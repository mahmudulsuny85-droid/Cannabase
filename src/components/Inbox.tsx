import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Send,
  Search,
  User,
  MessageSquare,
  Clock,
  ChevronLeft,
  X,
} from "lucide-react";
import { DirectMessage, ChatThread } from "../types";

const renderWithWaveAnimation = (text: string) => {
  if (text.includes("👋")) {
    const parts = text.split("👋");
    return parts.map((part, index) => (
      <span key={index}>
        {part}
        {index < parts.length - 1 && (
          <motion.span
            className="inline-block origin-[70%_70%]"
            animate={{
              rotate: [0, 15, -10, 15, 0],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            👋
          </motion.span>
        )}
      </span>
    ));
  }
  return text;
};

interface InboxProps {
  messages: DirectMessage[];
  currentUserHandle: string;
  onSendMessage: (receiver: string, text: string) => void;
  activeTargetUser?: string;
  onViewProfile?: (handle: string) => void;
  onClose?: () => void;
  onMarkAsRead?: (handle: string) => void;
}

export default function Inbox({
  messages,
  currentUserHandle,
  onSendMessage,
  activeTargetUser,
  onViewProfile = () => {},
  onClose,
  onMarkAsRead,
}: InboxProps) {
  const [selectedThreadUser, setSelectedThreadUser] = useState<string | null>(
    activeTargetUser || null,
  );

  useEffect(() => {
    if (selectedThreadUser && onMarkAsRead) {
      onMarkAsRead(selectedThreadUser);
    }
  }, [selectedThreadUser, onMarkAsRead]);

  useEffect(() => {
    if (activeTargetUser) {
      setSelectedThreadUser(activeTargetUser);
    }
  }, [activeTargetUser]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Derive threads from messages
  const threads = useMemo(() => {
    const threadMap = new Map<string, ChatThread>();

    messages.forEach((msg) => {
      const otherUser =
        msg.sender === currentUserHandle ? msg.receiver : msg.sender;
      const existing = threadMap.get(otherUser);

      if (
        !existing ||
        new Date(msg.timestamp) > new Date(existing.lastTimestamp)
      ) {
        threadMap.set(otherUser, {
          userHandle: otherUser,
          lastMessage: msg.text,
          lastTimestamp: msg.timestamp,
          isOnline: Math.random() > 0.3, // Mock online status
          unreadCount: 0, // Simplified for now
        });
      }
    });

    return Array.from(threadMap.values()).sort(
      (a, b) =>
        new Date(b.lastTimestamp).getTime() -
        new Date(a.lastTimestamp).getTime(),
    );
  }, [messages, currentUserHandle]);

  const filteredThreads = threads.filter((t) =>
    t.userHandle.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const activeMessages = useMemo(() => {
    if (!selectedThreadUser) return [];
    return messages
      .filter(
        (m) =>
          (m.sender === currentUserHandle &&
            m.receiver === selectedThreadUser) ||
          (m.sender === selectedThreadUser && m.receiver === currentUserHandle),
      )
      .sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      );
  }, [messages, currentUserHandle, selectedThreadUser]);

  const handleSend = () => {
    if (!newMessage.trim() || !selectedThreadUser) return;
    onSendMessage(selectedThreadUser, newMessage);
    setNewMessage("");
  };

  return (
    <div className="w-full flex-1 flex flex-col h-full overflow-hidden bg-[#090e0c]/95 border border-white/10 rounded-2xl md:rounded-3xl backdrop-blur-xl shadow-2xl">
      <div className="flex flex-1 overflow-hidden h-full">
        {/* Left Panel: Thread List */}
        <div
          className={`w-full md:w-80 border-r border-white/5 flex flex-col shrink-0 ${selectedThreadUser ? "hidden md:flex" : "flex"}`}
        >
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-xs font-mono font-black uppercase tracking-[0.2em] text-emerald-400">
              Messages
            </h2>
            {onClose && (
              <button
                onClick={onClose}
                className="text-[10px] font-mono font-black text-gray-455 hover:text-white uppercase tracking-tighter cursor-pointer px-2 py-1 bg-white/5 rounded-lg border border-white/10"
              >
                CLOSE
              </button>
            )}
          </div>
          <div className="p-4 border-b border-white/5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search associates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-hidden">
            {filteredThreads.length === 0 ? (
              <div className="p-8 text-center text-gray-500 space-y-2">
                <MessageSquare className="w-8 h-8 mx-auto opacity-20" />
                <p className="text-[10px] uppercase font-mono tracking-widest">
                  No active circles
                </p>
              </div>
            ) : (
              filteredThreads.map((thread) => (
                <div
                  key={thread.userHandle}
                  onClick={() => setSelectedThreadUser(thread.userHandle)}
                  className={`w-full p-4 flex items-center gap-3 border-b border-white/5 transition-all text-left group cursor-pointer ${
                    selectedThreadUser === thread.userHandle
                      ? "bg-emerald-500/10"
                      : "hover:bg-white/5"
                  }`}
                >
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewProfile(thread.userHandle);
                    }}
                    className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 relative hover:ring-2 ring-emerald-500/50 transition-all"
                  >
                    <User className="w-5 h-5 text-emerald-400" />
                    {thread.isOnline && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#090e0c]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-xs font-bold text-white truncate group-hover:text-emerald-400 transition-colors">
                        {thread.userHandle}
                      </span>
                      <span className="text-[9px] font-mono text-gray-500">
                        {new Date(thread.lastTimestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400 truncate font-sans">
                      {thread.lastMessage}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Panel: Chat Window */}
        <div
          className={`${selectedThreadUser ? "flex" : "hidden md:flex"} flex-1 flex-col overflow-hidden bg-black/20`}
        >
          {selectedThreadUser ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/40">
                <div className="flex items-center">
                  <button
                    onClick={() => setSelectedThreadUser(null)}
                    className="md:hidden flex items-center justify-center p-2 text-emerald-450 hover:text-emerald-350 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-xl cursor-pointer mr-3 shrink-0 animate-pulse-slow"
                    title="Back to threads"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onViewProfile(selectedThreadUser)}
                    className="flex items-center gap-3 group text-left cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center group-hover:ring-2 ring-emerald-500/50 transition-all">
                      <User className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-white uppercase tracking-wider group-hover:text-emerald-400 transition-colors">
                        {selectedThreadUser}
                      </h3>
                      <p className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest font-bold">
                        Active Circle Member
                      </p>
                    </div>
                  </button>
                </div>
                {onClose && (
                  <button
                    onClick={onClose}
                    className="text-[10px] font-mono font-black text-gray-455 hover:text-white uppercase tracking-tighter cursor-pointer px-2 py-1 bg-white/5 rounded-lg border border-white/10"
                  >
                    CLOSE
                  </button>
                )}
              </div>

              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hidden">
                {activeMessages.map((msg, idx) => {
                  const isOwn = msg.sender === currentUserHandle;
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[70%] space-y-1.5`}>
                        <div
                          className={`px-4 py-2.5 rounded-2xl text-xs font-sans leading-relaxed shadow-lg ${
                            isOwn
                              ? "bg-emerald-500 text-emerald-950 rounded-tr-none"
                              : "bg-white/10 text-white border border-white/10 rounded-tl-none"
                          }`}
                        >
                          {renderWithWaveAnimation(msg.text)}
                        </div>
                        <div
                          className={`flex items-center gap-1.5 px-1 ${isOwn ? "justify-end" : "justify-start"}`}
                        >
                          <Clock className="w-2.5 h-2.5 text-gray-500" />
                          <span className="text-[9px] font-mono text-gray-500 uppercase">
                            {new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-white/5 bg-black/40">
                <div className="flex gap-2 relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Send a secure message..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!newMessage.trim()}
                    className="w-12 h-12 bg-emerald-500 text-emerald-950 rounded-xl flex items-center justify-center hover:bg-emerald-400 transition-colors cursor-pointer group disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/10"
                  >
                    <Send className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
              <div className="w-24 h-24 rounded-full bg-emerald-500/5 flex items-center justify-center animate-pulse">
                <MessageSquare className="w-10 h-10 text-emerald-500/20" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-black text-white uppercase tracking-[0.3em]">
                  Secure Inbox
                </h3>
                <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest max-w-xs mx-auto">
                  SELECT A CONVERSATION TO START CHATTING IN THE PRIVATE CIRCLE
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
