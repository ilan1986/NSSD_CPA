import * as cheerio from "cheerio";
import { updateProject } from "./store";

type ProgressHandler = (message: string) => void;

const MAX_PAGES = 30;
const REQUEST_TIMEOUT_MS = 12000;
const MAX_TEXT_PER_PAGE = 7000;

function normalizeUrl(baseUrl: URL, href: string) {
  try {
    const next = new URL(href, baseUrl);
    next.hash = "";
    if (next.origin !== baseUrl.origin) return null;
    if (!/^https?:$/i.test(next.protocol)) return null;
    return next.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

function splitIntoChunks(text: string, chunkSize = 900) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return [];
  const chunks: string[] = [];
  for (let i = 0; i < clean.length; i += chunkSize) {
    chunks.push(clean.slice(i, i + chunkSize));
  }
  return chunks;
}

function extractPageText(html: string) {
  const $ = cheerio.load(html);
  $("script, style, noscript, iframe, svg").remove();
  const text = $("h1, h2, h3, p, li, td, th")
    .toArray()
    .map((el) => $(el).text().trim())
    .filter(Boolean)
    .join("\n");
  return text.slice(0, MAX_TEXT_PER_PAGE);
}

async function fetchHtml(url: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "user-agent": "nssd-site-scanner/0.1",
      },
    });
    const contentType = response.headers.get("content-type") ?? "";
    if (!response.ok || !contentType.includes("text/html")) return null;
    return await response.text();
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export async function runSiteScan(projectId: string, siteUrl: string, onProgress?: ProgressHandler) {
  const baseUrl = new URL(siteUrl);
  const root = baseUrl.toString().replace(/\/$/, "");
  const queue = [root];
  const visited = new Set<string>();
  const chunks: string[] = [];

  updateProject(projectId, { status: "scanning", progress: 5, pagesFound: 0, chunksCreated: 0, error: undefined });
  onProgress?.("Старт сканирования: ищу страницы сайта...");

  while (queue.length && visited.size < MAX_PAGES) {
    const current = queue.shift();
    if (!current || visited.has(current)) continue;
    visited.add(current);

    const html = await fetchHtml(current);
    if (!html) continue;

    const pageText = extractPageText(html);
    chunks.push(...splitIntoChunks(pageText));

    const $ = cheerio.load(html);
    const links = $("a[href]")
      .toArray()
      .map((el) => $(el).attr("href") ?? "")
      .map((href) => normalizeUrl(baseUrl, href))
      .filter((href): href is string => Boolean(href));

    for (const link of links) {
      if (!visited.has(link) && !queue.includes(link) && queue.length < MAX_PAGES * 3) {
        queue.push(link);
      }
    }

    const progress = Math.min(90, Math.round((visited.size / MAX_PAGES) * 100));
    updateProject(projectId, {
      progress,
      pagesFound: visited.size,
      chunksCreated: chunks.length,
    });
    onProgress?.(`Сканирование: ${visited.size} стр., ${chunks.length} чанков.`);
  }

  if (!visited.size || !chunks.length) {
    updateProject(projectId, { status: "failed", progress: 100, error: "Не удалось собрать текст с сайта." });
    onProgress?.("Ошибка: не удалось собрать контент. Проверьте URL и доступность сайта.");
    return;
  }

  updateProject(projectId, {
    status: "ready",
    progress: 100,
    pagesFound: visited.size,
    chunksCreated: chunks.length,
    datasetId: `ds_${projectId.slice(0, 8)}`,
    botId: `bot_${projectId.slice(0, 8)}`,
    widgetUrl: `/widget/${projectId}`,
  });
  onProgress?.("Готово: сайт просканирован, датасет собран, бот создан.");
}
