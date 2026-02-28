import { randomUUID } from "node:crypto";
import type { ChatMessage, Project, ScanStatus } from "./types";

const projects = new Map<string, Project>();
const chatProjects = new Map<number, string[]>();
const conversations = new Map<string, ChatMessage[]>();

function nowIso() {
  return new Date().toISOString();
}

export function createProject(chatId: number, url: string): Project {
  const id = randomUUID();
  const createdAt = nowIso();
  const project: Project = {
    id,
    chatId,
    url,
    status: "queued",
    progress: 0,
    pagesFound: 0,
    chunksCreated: 0,
    createdAt,
    updatedAt: createdAt,
  };

  projects.set(id, project);
  const ids = chatProjects.get(chatId) ?? [];
  ids.unshift(id);
  chatProjects.set(chatId, ids);
  conversations.set(id, []);
  return project;
}

export function listProjectsByChat(chatId: number): Project[] {
  const ids = chatProjects.get(chatId) ?? [];
  return ids.map((id) => projects.get(id)).filter((p): p is Project => Boolean(p));
}

export function getProject(projectId: string): Project | undefined {
  return projects.get(projectId);
}

export function updateProject(projectId: string, patch: Partial<Project>): Project | undefined {
  const current = projects.get(projectId);
  if (!current) return undefined;
  const updated: Project = {
    ...current,
    ...patch,
    updatedAt: nowIso(),
  };
  projects.set(projectId, updated);
  return updated;
}

export function setProjectStatus(projectId: string, status: ScanStatus, error?: string) {
  return updateProject(projectId, { status, error });
}

export function addConversationMessage(projectId: string, role: ChatMessage["role"], text: string) {
  const conversation = conversations.get(projectId) ?? [];
  conversation.push({ role, text, createdAt: nowIso() });
  conversations.set(projectId, conversation);
}

export function getConversation(projectId: string): ChatMessage[] {
  return conversations.get(projectId) ?? [];
}
