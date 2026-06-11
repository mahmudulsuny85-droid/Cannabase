import { api } from "./api";

export const authService = {
  async register(username: string, password: string) {
    return api.post("/api/auth/register", { username, password });
  },

  async login(username: string, password: string) {
    return api.post("/api/auth/login", { username, password });
  },

  async logout() {
    return api.post("/api/auth/logout", {});
  },

  async fetchMe() {
    const data = await api.get("/api/auth/me");
    return data.user;
  },
};
