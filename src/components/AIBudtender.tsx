import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MessageSquare,
  Send,
  X,
  Bot,
  Sparkles,
  User,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import { STRAINS_DATA } from "../data";

interface AIBudtenderProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: "user" | "budtender";
  text: string;
  time: string;
}

import { chatService } from "../services/chatService";

export default function AIBudtender({ isOpen, onClose }: AIBudtenderProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      sender: "budtender",
      text: "Hey friend! What kind of vibe are you looking for today? I'm your virtual budtender and vibe assistant. I can help you pick the perfect strain or compound mix for gaming, chilling on the couch, getting creative, or finding daytime focus. Just ask me anything!",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const processResponse = async (userInput: string) => {
    setIsTyping(true);

    try {
      // Create history from messages
      const history = messages.map((msg) => ({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      }));

      const data = await chatService.sendMessage(userInput, history);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + "-reply",
          sender: "budtender",
          text: data.text,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } catch (error) {
      console.error("Budtender error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + "-error",
          sender: "budtender",
          text: "Sorry friend, my mind is a bit foggy right now. Let me clear my head and try again in a bit! You can keep browsing the archive in the meantime.",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    processResponse(userMessage.text);
  };

  const selectPresetVibe = (presetText: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: presetText,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    processResponse(presetText);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 50 }}
          id="ai-budtender-chat-drawer"
          className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 w-full sm:max-w-[420px] h-full sm:h-[600px] bg-[var(--bg-surface)] backdrop-blur-2xl border border-[var(--border-regular)] sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col z-[100] text-left"
        >
          {/* Header */}
          <div className="p-4 bg-[var(--bg-surface-elevated)] border-b border-[var(--border-subtle)] flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 relative text-emerald-600 dark:text-emerald-400">
                <Bot className="w-6 h-6" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <div className="text-left">
                <span className="font-display font-black text-emerald-600 dark:text-[#ffd700] text-sm block">
                  Vibe Assistant
                </span>
                <span className="text-[10px] font-mono text-[var(--text-muted)] tracking-widest uppercase font-bold">
                  Online Now
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-[var(--bg-main)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hidden">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[90%] ${msg.sender === "user" ? "ml-auto flex-row-reverse text-right" : "text-left"}`}
              >
                <div
                  className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center font-mono text-xs font-bold ${
                    msg.sender === "user"
                      ? "bg-emerald-500/10 text-emerald-600"
                      : "bg-[var(--bg-surface-elevated)] text-emerald-600 dark:text-emerald-400 border border-[var(--border-subtle)]"
                  }`}
                >
                  {msg.sender === "user" ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>

                <div className="space-y-1">
                  <div
                    className={`p-3.5 rounded-2xl relative shadow-xs ${
                      msg.sender === "user"
                        ? "bg-emerald-500 text-white rounded-tr-none"
                        : "bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] rounded-tl-none shadow-sm"
                    }`}
                  >
                    <p className="text-sm md:text-base font-sans leading-relaxed text-left font-medium tracking-wide whitespace-pre-line">
                      {msg.text}
                    </p>
                  </div>
                  <span className="text-[9px] font-mono text-[var(--text-muted)] block px-1">
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 max-w-[85%] text-left">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 shrink-0 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Bot className="w-4 h-4 animate-spin-slow" />
                </div>
                <div className="bg-[var(--bg-surface-elevated)] border border-emerald-500/10 p-3.5 rounded-2xl rounded-tl-none space-y-1.5 shadow-sm">
                  <div className="flex gap-1 items-center">
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick preset suggestions */}
          <div className="px-4 py-2 bg-[var(--bg-surface-elevated)] border-t border-[var(--border-subtle)] flex gap-1.5 overflow-x-auto whitespace-nowrap shrink-0 scrollbar-hidden">
            {[
              "Gaming Vibe",
              "Couchlock Help",
              "Creative Flow",
              "Daytime Focus",
            ].map((label) => (
              <button
                key={label}
                onClick={() => selectPresetVibe(`Tell me about a ${label}`)}
                className="px-3 py-1.5 rounded-full bg-[var(--bg-main)] border border-[var(--border-subtle)] text-[10px] text-[var(--text-secondary)] font-sans cursor-pointer transition-all shrink-0 font-bold hover:border-emerald-500/50 hover:text-emerald-600"
              >
                {label}
              </button>
            ))}
          </div>

          {/* Input field */}
          <div className="p-4 bg-[var(--bg-surface)] border-t border-[var(--border-subtle)] flex items-center shrink-0">
            <div className="flex-1 flex gap-2 bg-[var(--bg-main)] rounded-xl px-3.5 py-1 focus-within:ring-1 ring-emerald-500 border border-[var(--border-regular)]">
              <input
                type="text"
                placeholder="Message assistant..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendMessage();
                }}
                className="flex-1 bg-transparent border-none py-3 text-sm md:text-base text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                className="text-emerald-500 hover:text-emerald-600 disabled:text-[var(--text-muted)] transition-colors cursor-pointer self-center p-1.5"
              >
                <Send className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
