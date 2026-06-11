export class AppError extends Error {
  status?: number;
  details?: any;

  constructor(message: string, status?: number, details?: any) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.details = details;
  }
}

export const api = {
  async get(url: string, options?: RequestInit) {
    return this.request(url, { ...options, method: 'GET' });
  },

  async post(url: string, data: any, options?: RequestInit) {
    return this.request(url, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: JSON.stringify(data),
    });
  },

  async request(url: string, options: RequestInit) {
    try {
      const response = await fetch(url, {
        credentials: 'include', // Always send auth cookies
        ...options,
      });
      if (!response.ok) {
        let errorMsg = 'An unexpected error occurred';
        let details = null;
        try {
          const data = await response.json();
          errorMsg = data.error || errorMsg;
          details = data.details || null;
        } catch {
          // not json
        }
        throw new AppError(errorMsg, response.status, details);
      }
      return response.json();
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error instanceof Error ? error.message : "Network error");
    }
  }
};
