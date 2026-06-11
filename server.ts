import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { ai } from "./server/gemini";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs";
import { authMiddleware, generateToken } from "./server/middleware";
import { chatRequestSchema, loginRequestSchema, registerRequestSchema } from "./server/schemas";
import prisma from "./server/prisma";

async function startServer() {
  const app = express();
  app.set("trust proxy", 1);
  const PORT = 3000;

  // Security Middleware
  app.use(helmet({ contentSecurityPolicy: false })); // Disabled CSP for Vite HMR/dev compatibility
  const allowedOrigin = process.env.NODE_ENV === "production"
    ? (process.env.APP_URL || false)
    : true;
  app.use(cors({ origin: allowedOrigin, credentials: true }));
  
  // Body parsing with limits
  app.use(express.json({ limit: "100kb" })); 
  app.use(cookieParser());

  // Rate Limiting
  const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 1000, 
    message: "Too many requests from this IP",
    validate: { xForwardedForHeader: false }
  });
  app.use("/api", globalLimiter);

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 20, 
    message: "Too many authentication attempts",
    validate: { xForwardedForHeader: false }
  });

  // ========== AUTHENTICATION ROUTES ==========

  app.post("/api/auth/register", authLimiter, async (req, res) => {
    try {
      const data = registerRequestSchema.parse(req.body);
      const existingUser = await prisma.user.findUnique({ where: { username: data.username } });
      if (existingUser) {
         return res.status(400).json({ error: "Username already exists" });
      }
      const hashedPassword = await bcrypt.hash(data.password, 10);
      
      const user = await prisma.user.create({
        data: {
          username: data.username,
          passwordHash: hashedPassword,
        }
      });
      
      const token = generateToken({ id: user.id, username: user.username });
      res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 7 * 24 * 60 * 60 * 1000 });
      res.json({ message: "Registered successfully", user: { username: data.username } });
    } catch (err: any) {
      return res.status(400).json({ error: "Validation failed", details: err.errors });
    }
  });

  app.post("/api/auth/login", authLimiter, async (req, res) => {
    try {
      const data = loginRequestSchema.parse(req.body);
      const user = await prisma.user.findUnique({ where: { username: data.username } });
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      const valid = await bcrypt.compare(data.password, user.passwordHash);
      if (!valid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = generateToken({ id: user.id, username: user.username });
      res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 7 * 24 * 60 * 60 * 1000 });
      res.json({ message: "Logged in", user: { username: user.username } });
    } catch (err: any) {
      return res.status(400).json({ error: "Validation failed", details: err.errors });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    res.clearCookie("token", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" });
    res.json({ message: "Logged out" });
  });

  app.get("/api/auth/me", authMiddleware, (req, res) => {
    res.json({ user: (req as any).user });
  });

  // ========== CHAT ROUTES ==========
  
  app.post("/api/chat", authMiddleware, async (req, res) => {
    try {
      const { message, history } = chatRequestSchema.parse(req.body);
      
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "Gemini API key is not configured." });
      }

      const chat = ai.chats.create({
        model: "gemini-2.5-flash",
        config: {
          systemInstruction: "You are a friendly, expert virtual budtender in the CannaBase Digital Lounge. You help users understand cannabis strains, terpenes, and how to use the Custom Mix Lab. You are warm, welcoming, and knowledgeable about the science of cannabis (like the endocannabinoid system). Keep responses concise but helpful. Encourage users to explore the 'Directory' or 'Simulator' tabs if relevant.",
        },
        history: history || [],
      });

      const result = await chat.sendMessage({ message });
      res.json({ text: result.text });
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid input", details: error.errors });
      }
      console.error("Gemini API error:", error);
      res.status(500).json({ error: "Failed to get response from AI Budtender." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
