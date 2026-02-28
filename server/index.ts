import "dotenv/config";
import express from "express";
import cors from "cors";
import { createTelegramBot } from "./bot";
import { addConversationMessage, getConversation, getProject, listProjectsByChat } from "./store";

const port = Number(process.env.PORT ?? 8787);
const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  throw new Error("TELEGRAM_BOT_TOKEN is required in .env");
}

const app = express();
app.use(cors());
app.use(express.json());

const bot = createTelegramBot(token);

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "telegram-ai-bot-mvp" });
});

app.get("/api/chats/:chatId/projects", (req, res) => {
  const chatId = Number(req.params.chatId);
  if (Number.isNaN(chatId)) {
    res.status(400).json({ error: "Invalid chatId" });
    return;
  }
  res.json({ projects: listProjectsByChat(chatId) });
});

app.get("/api/projects/:projectId", (req, res) => {
  const project = getProject(req.params.projectId);
  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }
  res.json({ project });
});

app.post("/api/projects/:projectId/ask", (req, res) => {
  const project = getProject(req.params.projectId);
  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  const question = typeof req.body?.question === "string" ? req.body.question.trim() : "";
  if (!question) {
    res.status(400).json({ error: "question is required" });
    return;
  }

  const answer =
    project.status === "ready"
      ? `MVP-ответ по ${project.url}: уточните потребность клиента и предложите целевое действие (звонок/бриф/демо).`
      : "Проект еще не готов. Дождитесь завершения сканирования.";

  addConversationMessage(project.id, "user", question);
  addConversationMessage(project.id, "assistant", answer);

  res.json({
    answer,
    history: getConversation(project.id),
  });
});

const server = app.listen(port, () => {
  console.log(`HTTP server running on http://localhost:${port}`);
});

bot.launch().then(() => {
  console.log("Telegram bot started.");
});

const gracefulStop = () => {
  bot.stop("SIGTERM");
  server.close(() => {
    process.exit(0);
  });
};

process.once("SIGINT", gracefulStop);
process.once("SIGTERM", gracefulStop);
