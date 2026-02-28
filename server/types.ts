export type ScanStatus = "idle" | "queued" | "scanning" | "ready" | "failed";

export type Project = {
  id: string;
  chatId: number;
  url: string;
  status: ScanStatus;
  progress: number;
  pagesFound: number;
  chunksCreated: number;
  datasetId?: string;
  botId?: string;
  widgetUrl?: string;
  createdAt: string;
  updatedAt: string;
  error?: string;
};

export type ChatMessage = {
  role: "user" | "assistant";
  text: string;
  createdAt: string;
};
