import { api } from "./api";

export const chatService = {
  async sendMessage(message: string, history: Array<{ role: string; parts: Array<{ text: string }> }> = []) {
    return api.post("/api/chat", { message, history });
  }
};
