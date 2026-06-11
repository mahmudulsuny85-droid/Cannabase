import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Hash,
  Volume2,
  Video,
  Users,
  Mic,
  MicOff,
  VideoOff,
  Send,
  Plus,
  X,
  ShieldAlert,
} from "lucide-react";

type Channel = {
  id: string;
  name: string;
  type: "text" | "voice";
  category: string;
  isPrivate: boolean;
  approvedUsers: string[];
  unreadCount?: number;
  activeUsers?: number;
  hasMentions?: boolean;
};

const INITIAL_CHANNELS: Channel[] = [
  {
    id: "c1",
    name: "lounge-talk",
    type: "text",
    category: "Circle Text Chats",
    unreadCount: 3,
    hasMentions: true,
    isPrivate: false,
    approvedUsers: ["Current_Explorist"],
  },
  {
    id: "c2",
    name: "stash-reviews",
    type: "text",
    category: "Circle Text Chats",
    isPrivate: false,
    approvedUsers: ["Current_Explorist"],
  },
  {
    id: "c4",
    name: "growers-corner",
    type: "text",
    category: "Circle Text Chats",
    isPrivate: true,
    approvedUsers: [],
  }, // Needs approval
  {
    id: "v1",
    name: "The Couchlock Corner",
    type: "voice",
    category: "Cozy Smoke Lounges",
    activeUsers: 4,
    isPrivate: false,
    approvedUsers: ["Current_Explorist"],
  },
  {
    id: "v2",
    name: "Creative Flow Circle",
    type: "voice",
    category: "Cozy Smoke Lounges",
    activeUsers: 2,
    isPrivate: false,
    approvedUsers: ["Current_Explorist"],
  },
  {
    id: "v4",
    name: "Late Night Session",
    type: "voice",
    category: "Cozy Smoke Lounges",
    activeUsers: 2,
    isPrivate: true,
    approvedUsers: [], // Needs approval
  },
  {
    id: "c3",
    name: "daily-vibes",
    type: "text",
    category: "Circle Text Chats",
    unreadCount: 1,
    isPrivate: false,
    approvedUsers: ["Current_Explorist"],
  },
  {
    id: "v3",
    name: "Wellness & Couch Chill",
    type: "voice",
    category: "Chill Zones",
    activeUsers: 1,
    isPrivate: false,
    approvedUsers: ["Current_Explorist"],
  },
];

const EMOJI_MAP: Record<string, string> = {
  LIT: "🔥",
  PUFF: "💨",
  VIBE: "✨",
  HEART: "💚",
  TECH: "🧪",
  CALM: "🧘",
  BRAIN: "🧠",
  SPARK: "⚡",
  LEAF: "🍁",
  MIND: "🔮",
};

const EMOJI_LIST = [
  "LIT",
  "PUFF",
  "VIBE",
  "HEART",
  "TECH",
  "CALM",
  "BRAIN",
  "SPARK",
];

const MOCK_MESSAGES = [
  {
    id: 1,
    user: "GreenHealer",
    time: "10:24 AM",
    text: "Yo! Anyone rolling up that new Super Lemon Haze batch from yesterday?",
    reactions: [
      { emoji: "LIT", count: 3, userReacted: false },
      { emoji: "LEAF", count: 2, userReacted: true },
    ],
  },
  {
    id: 2,
    user: "TerpeneChaser",
    time: "10:26 AM",
    text: "Oh yeah, the citrus terps are insanely loud on that. Super sweet, hits you with a happy, creative head buzz.",
    reactions: [{ emoji: "HEART", count: 5, userReacted: true }],
  },
  {
    id: 3,
    user: "Botanist_Jane",
    time: "10:30 AM",
    text: "Sipping a tea right now with some chill indica extract. Getting ready to hop in the 'Creative Flow Circle' for some tunes.",
    reactions: [],
  },
];

const STREAMING_COMPONENTS = [
  {
    user: "StonerDave",
    text: "Just put on this cozy ambient lofi playlist if you're chilling: https://synthwave.fm/chillin-circle Super clean beats!",
  },
  {
    user: "MelodyVibes",
    text: "Munchies check! Just ordered a warm cinnamon bagel batch with sweet vanilla cream. Absolute top-tier combo.",
  },
  {
    user: "Cloud9",
    text: "Dude, that sounds beautiful. I am hitting some real Granddaddy Purple in a raw glass piece and it is incredibly smooth.",
  },
  {
    user: "TerpeneChaser",
    text: "Has anyone tried raising Pinene in the custom simulator? I made a super focused blend called 'Prism Fog' and my reaction times are insane!",
  },
  {
    user: "GreenHealer",
    text: "Oh yeah, Pinene acts as a clean focus modulator - literally clears away brain fog. I always add at least 25% Pinene to my daytime working blends.",
  },
  {
    user: "HighFlyer",
    text: "Just vibing out here... perfect warm sunset view. Passing the digital joint to everyone here, hope you all have a peaceful evening!",
  },
  {
    user: "CouchSurfer",
    text: "Highly recommend watching that documentary about ancient forest plants on streaming right now. Visually stunning!",
  },
  {
    user: "LimoneneLover",
    text: "Mmm, that fresh citrus scent of Limonene always brings such a happy, sunshine-y smile to my face. Best terpene easily.",
  },
];

export default function LiveLounges({
  onViewProfile = () => {},
}: {
  onViewProfile?: (handle: string) => void;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [channels, setChannels] = useState<Channel[]>(INITIAL_CHANNELS);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [activeChannelId, setActiveChannelId] = useState("c1");
  const [roomChats, setRoomChats] = useState<Record<string, any[]>>(() => {
    try {
      const stored = localStorage.getItem("canna_lounge_chats");
      if (stored) return JSON.parse(stored) || {};
    } catch {
      // safe fallback
    }
    return { c1: MOCK_MESSAGES };
  });

  useEffect(() => {
    try {
      localStorage.setItem("canna_lounge_chats", JSON.stringify(roomChats));
    } catch (e) {
      console.error("Diagnostic error: Failed to stringify room chats.", e);
    }
  }, [roomChats]);

  const messages = roomChats[activeChannelId] || [];

  const [newMessage, setNewMessage] = useState("");
  const activeChannelIdRef = useRef(activeChannelId);

  useEffect(() => {
    activeChannelIdRef.current = activeChannelId;
  }, [activeChannelId]);

  const responseTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (responseTimerRef.current) clearTimeout(responseTimerRef.current);
    };
  }, []);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [pickerMessageId, setPickerMessageId] = useState<number | null>(null);

  const [activeDM, setActiveDM] = useState<string | null>(null);
  const [dmHistory, setDmHistory] = useState<Record<string, any[]>>({});
  const [newDmMessage, setNewDmMessage] = useState("");

  const handleSendDM = () => {
    if (!newDmMessage.trim() || !activeDM) return;
    const msg = {
      id: Date.now() + Math.random(),
      user: "Current_Explorist",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      text: newDmMessage,
    };
    setDmHistory((prev) => ({
      ...prev,
      [activeDM]: [...(prev[activeDM] || []), msg],
    }));
    setNewDmMessage("");
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const [newChannelType, setNewChannelType] = useState<"text" | "voice">(
    "text",
  );
  const [newChannelCategory, setNewChannelCategory] =
    useState("Circle Text Chats");
  const [newChannelPrivate, setNewChannelPrivate] = useState(false);

  const [roomAccessList, setRoomAccessList] = useState<Record<string, string>>(
    () => {
      try {
        const stored = localStorage.getItem("canna_room_access");
        if (stored) return JSON.parse(stored) || {};
      } catch {
        // safe fallback
      }
      return {};
    },
  );

  useEffect(() => {
    try {
      localStorage.setItem("canna_room_access", JSON.stringify(roomAccessList));
    } catch (e) {
      console.error(
        "Diagnostic error: Failed to stringify room access list.",
        e,
      );
    }
  }, [roomAccessList]);
  const [peerCount, setPeerCount] = useState(420);

  useEffect(() => {
    const interval = setInterval(() => {
      setPeerCount(
        (prev) =>
          prev +
          (Math.random() > 0.5
            ? Math.floor(Math.random() * 2) + 1
            : -(Math.floor(Math.random() * 2) + 1)),
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const activeChannel = channels.find((c) => c.id === activeChannelId);

  useEffect(() => {
    let interval: any;
    if (
      activeChannel?.type === "voice" &&
      (!activeChannel?.isPrivate ||
        roomAccessList[activeChannel?.id] === "APPROVED")
    ) {
      setSessionDuration(0);
      interval = setInterval(() => {
        setSessionDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeChannel?.id, activeChannel?.type, activeChannel?.isPrivate]);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentActiveId = activeChannelIdRef.current;
      setChannels((prevChannels) => {
        const inactiveTextChannels = prevChannels.filter(
          (c) => c.type === "text" && c.id !== currentActiveId,
        );
        if (inactiveTextChannels.length === 0) return prevChannels;

        const randomChannel =
          inactiveTextChannels[
            Math.floor(Math.random() * inactiveTextChannels.length)
          ];
        const randomMsgInfo =
          STREAMING_COMPONENTS[
            Math.floor(Math.random() * STREAMING_COMPONENTS.length)
          ];

        const newMsg = {
          id: Date.now() + Math.random(),
          user: randomMsgInfo.user,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          text: randomMsgInfo.text,
          reactions: [],
        };

        setRoomChats((prev) => ({
          ...prev,
          [randomChannel.id]: [...(prev[randomChannel.id] || []), newMsg],
        }));

        return prevChannels.map((c) =>
          c.id === randomChannel.id
            ? { ...c, unreadCount: (c.unreadCount || 0) + 1 }
            : c,
        );
      });
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const filteredChannels = channels.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleCreateChannel = () => {
    if (!newChannelName.trim()) return;
    const newChan = {
      id: `new-${Date.now()}`,
      name: newChannelName.toLowerCase().replace(/\s+/g, "-"),
      type: newChannelType,
      category: newChannelCategory,
      isPrivate: newChannelPrivate,
      approvedUsers: ["Current_Explorist"], // Creator is automatically approved
      unreadCount: 0,
      activeUsers: 0,
    };
    setChannels([...channels, newChan]);
    setIsCreateModalOpen(false);
    setNewChannelName("");
    setActiveChannelId(newChan.id);
  };

  const handleRequestAccess = (channelId: string) => {
    setRoomAccessList((prev) => ({ ...prev, [channelId]: "PENDING_APPROVAL" }));
    setTimeout(() => {
      setRoomAccessList((prev) => ({ ...prev, [channelId]: "APPROVED" }));
    }, 2000);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const currentActiveId = activeChannelId;

    setRoomChats((prev) => ({
      ...prev,
      [currentActiveId]: [
        ...(prev[currentActiveId] || []),
        {
          id: Date.now() + Math.random(),
          user: "Current_Explorist",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          text: newMessage,
          reactions: [],
        },
      ],
    }));
    setNewMessage("");

    if (responseTimerRef.current) clearTimeout(responseTimerRef.current);
    responseTimerRef.current = setTimeout(() => {
      const responseMsgInfo =
        STREAMING_COMPONENTS[
          Math.floor(Math.random() * STREAMING_COMPONENTS.length)
        ];
      setRoomChats((prev) => ({
        ...prev,
        [currentActiveId]: [
          ...(prev[currentActiveId] || []),
          {
            id: Date.now() + Math.random(),
            user: responseMsgInfo.user,
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            text: "Totally agree! " + responseMsgInfo.text,
            reactions: [],
          },
        ],
      }));

      // Update unread count if user left the room
      if (currentActiveId !== activeChannelIdRef.current) {
        setChannels((prevChans) =>
          prevChans.map((c) =>
            c.id === currentActiveId
              ? { ...c, unreadCount: (c.unreadCount || 0) + 1 }
              : c,
          ),
        );
      }
    }, 4500);
  };

  const toggleReaction = (msgId: number, emoji: string) => {
    setRoomChats((prev) => {
      const currentMessages = prev[activeChannelId] || [];
      const updatedMessages = currentMessages.map((msg) => {
        if (msg.id === msgId) {
          const existing = msg.reactions?.find((r: any) => r.emoji === emoji);
          let newReactions = msg.reactions ? [...msg.reactions] : [];
          if (existing) {
            newReactions = newReactions
              .map((r: any) =>
                r.emoji === emoji
                  ? {
                      ...r,
                      count: r.userReacted ? r.count - 1 : r.count + 1,
                      userReacted: !r.userReacted,
                    }
                  : r,
              )
              .filter((r: any) => r.count > 0);
          } else {
            newReactions.push({ emoji, count: 1, userReacted: true });
          }
          return { ...msg, reactions: newReactions };
        }
        return msg;
      });
      return { ...prev, [activeChannelId]: updatedMessages };
    });
  };

  return (
    <div
      id="live-lounges"
      className="w-full h-[75vh] md:h-[80vh] min-h-[500px] flex bg-[var(--bg-main)] border border-[var(--border-regular)] rounded-2xl overflow-hidden shadow-2xl relative mb-24 md:mb-32 mx-auto max-w-6xl"
    >
      {/* Sidebar Mobile Overlay Backdrop */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden absolute inset-0 bg-black/60 backdrop-blur-sm z-[25]"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Channels */}
      <div
        className={`w-64 lg:w-72 bg-[var(--bg-surface)] flex-col border-r border-[var(--border-regular)] shrink-0 absolute md:relative inset-y-0 left-0 z-30 transition-transform duration-300 ease-in-out md:translate-x-0 ${isSidebarOpen ? "translate-x-0 flex" : "-translate-x-full md:flex"}`}
      >
        <div className="p-4 border-b border-[var(--border-subtle)] flex flex-col gap-3.5">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-black text-[var(--text-primary)] text-sm md:text-base flex items-center gap-1.5 shrink-0">
              <Users className="w-4 h-4 text-emerald-500" />
              Smoke Stations
            </h2>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="p-1.5 rounded-lg text-emerald-500 hover:bg-emerald-500/10 transition-colors cursor-pointer"
                title="Create Station"
              >
                <Plus className="w-4 h-4" />
              </button>
              <X
                onClick={() => setIsSidebarOpen(false)}
                className="md:hidden w-4 h-4 text-[var(--text-muted)] cursor-pointer ml-1"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3.5 space-y-6 scrollbar-hidden">
          {["Circle Text Chats", "Cozy Smoke Lounges", "Chill Zones"].map(
            (category) => {
              const categoryChannels = filteredChannels.filter(
                (c) => c.category === category,
              );
              if (categoryChannels.length === 0) return null;
              return (
                <div key={category} className="space-y-1">
                  <h3 className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400/80 uppercase tracking-wider px-2 mb-2 font-bold">
                    {category}
                  </h3>
                  {categoryChannels.map((channel) => (
                    <button
                      key={channel.id}
                      onClick={() => {
                        setActiveChannelId(channel.id);
                        setIsSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all border group ${
                        activeChannelId === channel.id
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-350 border-emerald-500/30 shadow-sm"
                          : "text-[var(--text-secondary)] border-transparent hover:bg-[var(--bg-surface-elevated)]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <div
                          className={`p-1.5 rounded-lg transition-colors ${
                            activeChannelId === channel.id
                              ? "bg-emerald-500/20"
                              : "bg-black/5 dark:bg-white/5 opacity-60 group-hover:opacity-100"
                          }`}
                        >
                          {channel.type === "text" ? (
                            <Hash className="w-3.5 h-3.5" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5" />
                          )}
                        </div>
                        <span
                          className={`text-xs md:text-[13px] truncate ${activeChannelId === channel.id ? "font-bold" : "font-medium"}`}
                        >
                          {channel.name}
                        </span>
                      </div>

                      {channel.isPrivate &&
                        roomAccessList[channel.id] !== "APPROVED" && (
                          <ShieldAlert className="w-3 h-3 text-rose-500/60" />
                        )}

                      {channel.activeUsers && channel.activeUsers > 0 && (
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-[10px] font-mono text-emerald-500/80 font-bold">
                            {channel.activeUsers}
                          </span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              );
            },
          )}
        </div>

        <div className="p-3 bg-[var(--bg-surface-elevated)] border-t border-[var(--border-subtle)] flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white text-[10px] font-bold">
              CE
            </div>
            <div className="flex flex-col truncate">
              <span className="text-[11px] font-bold text-[var(--text-primary)]">
                Explorist
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-[var(--bg-main)] relative min-w-0">
        <div className="h-14 px-4 flex items-center justify-between border-b border-[var(--border-regular)] bg-[var(--bg-surface)]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 text-[var(--text-secondary)]"
            >
              <Users className="w-5 h-5 text-emerald-500" />
            </button>
            <h3 className="font-black text-[var(--text-primary)] text-sm md:text-base truncate">
              #{activeChannel?.name}
            </h3>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 space-y-6">
          {activeChannel?.isPrivate &&
          roomAccessList[activeChannelId] !== "APPROVED" ? (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-6">
              <ShieldAlert className="w-16 h-16 text-rose-500 mb-2" />
              <h2 className="text-xl md:text-2xl font-black text-[var(--text-primary)]">
                THIS CIRCLE IS PRIVATE
              </h2>
              <p className="text-[var(--text-secondary)] text-sm md:text-base max-w-sm">
                PRIVACY APPROVAL IS REQUIRED TO ENTER.
              </p>
              <button
                onClick={() => handleRequestAccess(activeChannelId)}
                disabled={
                  roomAccessList[activeChannelId] === "PENDING_APPROVAL"
                }
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-[var(--bg-surface-elevated)] disabled:text-[var(--text-muted)] text-white font-bold rounded-xl transition-all"
              >
                {roomAccessList[activeChannelId] === "PENDING_APPROVAL"
                  ? "PENDING_APPROVAL..."
                  : "REQUEST ACCESS"}
              </button>
            </div>
          ) : activeChannel?.type === "text" ? (
            messages.map((msg) => (
              <div key={msg.id} className="flex gap-3 text-left">
                <div className="w-9 h-9 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-500/30">
                  <span className="text-emerald-500 text-xs font-black">
                    {msg.user.substring(0, 2).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] md:text-sm font-black text-emerald-600 dark:text-emerald-350">
                      @{msg.user}
                    </span>
                    <span className="text-[9px] text-[var(--text-muted)] font-mono">
                      {msg.time}
                    </span>
                  </div>
                  <p className="text-xs md:text-base text-[var(--text-secondary)] mt-1">
                    {msg.text}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-xl md:text-2xl font-black text-[var(--text-primary)]">
                  {activeChannel?.name}
                </h2>
                <div className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  Live Sesh • {formatTime(sessionDuration)}
                </div>
              </div>
              <div className="flex gap-4 p-4 bg-[var(--bg-surface-elevated)] rounded-2xl border border-[var(--border-subtle)]">
                <button
                  onClick={() => setIsMicOn(!isMicOn)}
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center ${isMicOn ? "bg-emerald-500 text-white" : "bg-rose-500/20 text-rose-500"}`}
                >
                  {isMicOn ? (
                    <Mic className="w-4 h-4 md:w-5 md:h-5" />
                  ) : (
                    <MicOff className="w-4 h-4 md:w-5 md:h-5" />
                  )}
                </button>
                <button
                  onClick={() => setIsVideoOn(!isVideoOn)}
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center ${isVideoOn ? "bg-emerald-500 text-white" : "bg-rose-500/20 text-rose-500"}`}
                >
                  {isVideoOn ? (
                    <Video className="w-4 h-4 md:w-5 md:h-5" />
                  ) : (
                    <VideoOff className="w-4 h-4 md:w-5 md:h-5" />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {(!activeChannel?.isPrivate ||
          roomAccessList[activeChannelId] === "APPROVED") &&
          activeChannel?.type === "text" && (
            <div className="p-3 md:p-4 absolute bottom-0 left-0 right-0 bg-[var(--bg-main)]">
              <div className="bg-[var(--bg-surface-elevated)] rounded-xl flex items-center px-4 border border-[var(--border-subtle)] focus-within:border-emerald-500">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Send message..."
                  className="flex-1 bg-transparent py-3 text-xs md:text-sm text-[var(--text-primary)] outline-none"
                />
                <Send
                  onClick={handleSendMessage}
                  className="w-4 h-4 text-emerald-500 cursor-pointer"
                />
              </div>
            </div>
          )}
      </div>

      {isCreateModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl w-full max-w-md p-6 shadow-2xl flex flex-col gap-6 relative"
          >
            <div className="flex flex-col gap-1 text-left">
              <h3 className="font-display font-black text-2xl text-[var(--text-primary)]">
                Create a Smoke Station
              </h3>
              <p className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                Start a new cozy discussion space
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] md:text-xs font-mono font-black text-[var(--text-secondary)] block mb-2 uppercase tracking-widest">
                  Station Name
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-mono font-bold">
                    #
                  </span>
                  <input
                    type="text"
                    value={newChannelName}
                    onChange={(e) => setNewChannelName(e.target.value)}
                    className="w-full bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] focus:border-emerald-500 focus:outline-none rounded-xl pl-8 pr-4 py-3 text-sm text-[var(--text-primary)] transition-all font-medium"
                    placeholder="puff-n-paint"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-mono font-black text-[var(--text-secondary)] block uppercase tracking-widest">
                    Type
                  </label>
                  <select
                    value={newChannelType}
                    onChange={(e: any) => setNewChannelType(e.target.value)}
                    className="w-full bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-xl px-3 py-3 text-xs md:text-sm text-[var(--text-primary)] outline-none font-bold cursor-pointer hover:border-[var(--border-regular)] transition-colors"
                  >
                    <option value="text">💬 Text Chat</option>
                    <option value="voice">🔊 Voice / Live</option>
                  </select>
                </div>
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-mono font-black text-[var(--text-secondary)] block uppercase tracking-widest">
                    Category
                  </label>
                  <select
                    value={newChannelCategory}
                    onChange={(e: any) => setNewChannelCategory(e.target.value)}
                    className="w-full bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-xl px-3 py-3 text-xs md:text-sm text-[var(--text-primary)] outline-none font-bold cursor-pointer hover:border-[var(--border-regular)] transition-colors"
                  >
                    <option value="Circle Text Chats">Text Chats</option>
                    <option value="Cozy Smoke Lounges">Lounges</option>
                    <option value="Chill Zones">Chill Zones</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                <div className="flex flex-col text-left">
                  <span className="text-sm font-black text-[var(--text-primary)]">
                    Private Session
                  </span>
                  <span className="text-[10px] font-semibold text-[var(--text-muted)]">
                    Buddy approval required
                  </span>
                </div>
                <button
                  onClick={() => setNewChannelPrivate(!newChannelPrivate)}
                  className={`w-10 h-6 rounded-full relative transition-all duration-300 ${newChannelPrivate ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"}`}
                >
                  <motion.span
                    animate={{ x: newChannelPrivate ? 18 : 2 }}
                    className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                  />
                </button>
              </div>
            </div>

            <div className="flex justify-end bg-black/5 dark:bg-white/5 -mx-6 -mb-6 p-4 px-6 mt-2 rounded-b-2xl border-t border-[var(--border-subtle)]">
              <div className="flex gap-3">
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateChannel}
                  disabled={!newChannelName.trim()}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-600/20 transition-all font-mono tracking-widest cursor-pointer"
                >
                  CREATE STATION
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Direct Message Slide-out Panel - REPLACED BY CENTRALIZED PROFILE/INBOX */}
    </div>
  );
}
