import { Markup, Telegraf } from "telegraf";
import { addConversationMessage, createProject, getProject, listProjectsByChat, updateProject } from "./store";
import { runSiteScan } from "./scanner";

const URL_REGEX = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;

const keyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback("Статус", "status"),
    Markup.button.callback("Пересканировать", "rescan"),
  ],
  [Markup.button.callback("Тест чата", "test_chat")],
]);

const chatContext = new Map<number, { activeProjectId?: string; awaitingUrl?: boolean }>();

function getCtx(chatId: number) {
  const state = chatContext.get(chatId) ?? {};
  chatContext.set(chatId, state);
  return state;
}

function formatProjectStatus(projectId: string) {
  const project = getProject(projectId);
  if (!project) return "Проект не найден.";

  return [
    `ID: ${project.id}`,
    `Сайт: ${project.url}`,
    `Статус: ${project.status}`,
    `Прогресс: ${project.progress}%`,
    `Страниц: ${project.pagesFound}`,
    `Чанков: ${project.chunksCreated}`,
    project.datasetId ? `Dataset: ${project.datasetId}` : "",
    project.widgetUrl ? `Виджет: ${project.widgetUrl}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

async function startScan(bot: Telegraf, chatId: number, projectId: string) {
  const project = getProject(projectId);
  if (!project) {
    await bot.telegram.sendMessage(chatId, "Проект не найден.");
    return;
  }

  runSiteScan(projectId, project.url, async (message) => {
    await bot.telegram.sendMessage(chatId, message);
  }).catch(async (error) => {
    updateProject(projectId, { status: "failed", error: String(error) });
    await bot.telegram.sendMessage(chatId, `Ошибка сканирования: ${String(error)}`);
  });
}

export function createTelegramBot(token: string) {
  const bot = new Telegraf(token);

  bot.start(async (ctx) => {
    const chatId = ctx.chat.id;
    const state = getCtx(chatId);
    state.awaitingUrl = true;
    await ctx.reply(
      [
        "Отправьте URL сайта клиента (например: https://example.com).",
        "После этого запущу сканирование и подготовку чат-бота.",
      ].join("\n"),
      keyboard
    );
  });

  bot.command("new", async (ctx) => {
    const state = getCtx(ctx.chat.id);
    state.awaitingUrl = true;
    await ctx.reply("Пришлите новый URL сайта.");
  });

  bot.command("status", async (ctx) => {
    const state = getCtx(ctx.chat.id);
    if (state.activeProjectId) {
      await ctx.reply(formatProjectStatus(state.activeProjectId), keyboard);
      return;
    }

    const projects = listProjectsByChat(ctx.chat.id);
    if (!projects.length) {
      await ctx.reply("У вас пока нет проектов. Нажмите /start.");
      return;
    }
    await ctx.reply(formatProjectStatus(projects[0].id), keyboard);
  });

  bot.action("status", async (ctx) => {
    await ctx.answerCbQuery();
    const state = getCtx(ctx.chat.id);
    if (!state.activeProjectId) {
      await ctx.reply("Нет активного проекта. Используйте /start.");
      return;
    }
    await ctx.reply(formatProjectStatus(state.activeProjectId), keyboard);
  });

  bot.action("rescan", async (ctx) => {
    await ctx.answerCbQuery();
    const state = getCtx(ctx.chat.id);
    if (!state.activeProjectId) {
      await ctx.reply("Нет активного проекта для пересканирования.");
      return;
    }
    updateProject(state.activeProjectId, { status: "queued", progress: 0 });
    await ctx.reply("Пересканирование запущено.", keyboard);
    await startScan(bot, ctx.chat.id, state.activeProjectId);
  });

  bot.action("test_chat", async (ctx) => {
    await ctx.answerCbQuery();
    const state = getCtx(ctx.chat.id);
    if (!state.activeProjectId) {
      await ctx.reply("Сначала создайте проект и завершите сканирование.");
      return;
    }
    const project = getProject(state.activeProjectId);
    if (!project || project.status !== "ready") {
      await ctx.reply("Проект еще не готов. Проверьте статус через кнопку.");
      return;
    }
    await ctx.reply(
      "Тест чата (MVP):\nПишите вопрос в формате:\nask: <ваш вопрос>\n\nПример: ask: Какие у вас условия доставки?"
    );
  });

  bot.on("text", async (ctx) => {
    const chatId = ctx.chat.id;
    const text = ctx.message.text.trim();
    const state = getCtx(chatId);

    if (text.toLowerCase().startsWith("ask:")) {
      const question = text.slice(4).trim();
      if (!question) {
        await ctx.reply("После ask: укажите вопрос.");
        return;
      }
      if (!state.activeProjectId) {
        await ctx.reply("Нет активного проекта.");
        return;
      }
      const project = getProject(state.activeProjectId);
      if (!project || project.status !== "ready") {
        await ctx.reply("Проект не готов. Дождитесь окончания сканирования.");
        return;
      }
      const answer = `MVP-ответ:\nНа основе данных сайта ${project.url} я бы уточнил детали заявки и предложил консультацию с менеджером.`;
      addConversationMessage(project.id, "user", question);
      addConversationMessage(project.id, "assistant", answer);
      await ctx.reply(answer);
      return;
    }

    if (!state.awaitingUrl && !URL_REGEX.test(text)) {
      await ctx.reply("Неверный формат. Пришлите URL вида https://site.com или нажмите /start.");
      return;
    }

    if (!URL_REGEX.test(text)) {
      await ctx.reply("Не похоже на URL. Пример: https://site.com");
      return;
    }

    const project = createProject(chatId, text);
    state.activeProjectId = project.id;
    state.awaitingUrl = false;

    await ctx.reply(
      [
        "Сайт принят. Запускаю пайплайн:",
        "1) сканирование",
        "2) датасет",
        "3) бот + виджет",
      ].join("\n"),
      keyboard
    );

    await startScan(bot, chatId, project.id);
  });

  return bot;
}
