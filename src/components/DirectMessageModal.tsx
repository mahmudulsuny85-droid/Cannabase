import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Send,
  Paperclip,
  MoreVertical,
  Image as ImageIcon,
  CheckCheck,
  Check,
} from "lucide-react";

interface DirectMessageModalProps {
  recipient: any;
  onClose: () => void;
}

export default function DirectMessageModal({
  recipient,
  onClose,
}: DirectMessageModalProps) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: recipient.user,
      text: `Hey! I saw your recent note on synergistic ratios.`,
      time: "10:00 AM",
    },
    {
      id: 2,
      sender: "me",
      text: `Thanks! Yeah, adding Terpinolene really shifted the effects. Have you experimented with it?`,
      time: "10:05 AM",
      status: "read",
    },
    {
      id: 3,
      sender: recipient.user,
      text: `I have, actually. I found that keeping THC low helps avoid the jittery feeling while still getting the focus enhancement.`,
      time: "10:12 AM",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const dmSocketsRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    return () => {
      dmSocketsRef.current.forEach(clearTimeout);
    };
  }, []);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const newMsgId = Date.now();
    setMessages((prev) => [
      ...prev,
      {
        id: newMsgId,
        sender: "me",
        text: newMessage,
        time: "Just now",
        status: "sent",
      },
    ]);
    setNewMessage("");

    // Simulate read receipt updating after a few seconds
    const tid = setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === newMsgId ? { ...m, status: "read" } : m)),
      );
    }, 2500);
    dmSocketsRef.current.push(tid);
  };

  if (!recipient) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl h-[80vh] flex flex-col bg-[#0a0f0d] border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-emerald-900/10"
        >
          {/* DM Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-full ${recipient.color || "bg-emerald-600"} flex items-center justify-center border border-white/20`}
              >
                <span className="text-white font-bold font-mono text-xs">
                  {recipient.initials}
                </span>
              </div>
              <div>
                <h3 className="font-display font-bold text-white text-base">
                  {recipient.user}
                </h3>
                <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                  Active now
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5">
                <MoreVertical className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hidden">
            {messages.map((msg) => {
              const isMe = msg.sender === "me";
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                >
                  <div className="flex items-end gap-2 max-w-[80%]">
                    {!isMe && (
                      <div
                        className={`w-6 h-6 rounded-full shrink-0 ${recipient.color || "bg-emerald-600"} flex items-center justify-center border border-white/20 mb-1`}
                      >
                        <span className="text-white font-bold font-mono text-[8px]">
                          {recipient.initials}
                        </span>
                      </div>
                    )}
                    <div
                      className={`px-4 py-3 rounded-2xl text-sm font-sans font-medium leading-relaxed ${
                        isMe
                          ? "bg-emerald-600 text-white rounded-br-sm shadow-md"
                          : "bg-white/10 text-white/90 rounded-bl-sm border border-white/5"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 px-8">
                    <span className="text-[9px] font-mono text-gray-500">
                      {msg.time}
                    </span>
                    {isMe && msg.status && (
                      <span
                        className={`text-[10px] ${msg.status === "read" ? "text-emerald-400" : "text-gray-500"}`}
                      >
                        {msg.status === "read" ? (
                          <CheckCheck className="w-3 h-3" />
                        ) : (
                          <Check className="w-3 h-3" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white/5 border-t border-white/10">
            <div className="flex items-end gap-3 bg-black/40 border border-white/10 rounded-2xl p-2 focus-within:border-emerald-500/50 transition-colors">
              <button className="p-2.5 text-gray-400 hover:text-emerald-400 transition-colors rounded-xl hover:bg-white/5 shrink-0">
                <Paperclip className="w-5 h-5" />
              </button>
              <button className="p-2.5 text-gray-400 hover:text-emerald-400 transition-colors rounded-xl hover:bg-white/5 shrink-0">
                <ImageIcon className="w-5 h-5" />
              </button>
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={`Message @${recipient.user}...`}
                className="flex-1 bg-transparent border-none text-white text-sm focus:outline-none min-h-[44px] max-h-32 py-3 resize-none font-sans font-medium placeholder-gray-500"
              />
              <button
                onClick={handleSend}
                disabled={!newMessage.trim()}
                className="p-3 bg-emerald-500 text-emerald-950 hover:bg-emerald-400 disabled:opacity-50 disabled:hover:bg-emerald-500 transition-colors rounded-xl shrink-0 shadow-lg"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
