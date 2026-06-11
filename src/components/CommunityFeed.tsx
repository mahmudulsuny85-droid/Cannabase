import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Heart,
  MessageSquare,
  Share2,
  Users,
  Send,
  Leaf,
  Repeat,
  Bold,
  Italic,
  Link as LinkIcon,
  Bookmark,
  Search,
  SmilePlus,
  Image as ImageIcon,
  X,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

// Mock Data
const INITIAL_POSTS = [
  {
    id: 1,
    user: "Botanist_Jane",
    name: "Jane Smith",
    initials: "BJ",
    color: "bg-emerald-500",
    timeAgo: "2 hours ago",
    timestamp: "May 26, 2026 - 15:30 UTC",
    content:
      "Just rolled a clean **1:2 THC:CBD blend** for this afternoon's coding flow. Honestly, the synergy is immaculate—super clear head buzz, zero jitters, just pure creative focus. Anyone else vibing with low-THC mixes today?",
    badge: {
      text: "Vibe Check",
      style:
        "text-blue-400 dark:text-blue-300 border-blue-500/30 bg-blue-500/10",
    },
    likes: 24,
    comments: 5,
    reposts: 2,
    isLiked: false,
    isReposted: false,
    isSaved: false,
    reactions: [
      { emoji: "LEAF", count: 12, userReacted: true },
      { emoji: "MIND", count: 5, userReacted: false },
    ],
    stats: { posts: 142, followers: "3.2k", following: 400 },
  },
  {
    id: 2,
    user: "TerpeneChaser",
    name: "Alex Johnson",
    initials: "TC",
    color: "bg-amber-500",
    timeAgo: "5 hours ago",
    timestamp: "May 26, 2026 - 12:45 UTC",
    content:
      "Just cracked open some Jack Herer and the Pinene aroma is hitting crazy good! Extremely uplifting and clean. What are your favorite piney strains for an active afternoon hike?",
    badge: {
      text: "Stash Showcase",
      style:
        "text-emerald-500 dark:text-emerald-300 border-emerald-500/30 bg-emerald-500/10",
    },
    likes: 56,
    comments: 12,
    reposts: 8,
    isLiked: true,
    isReposted: false,
    isSaved: true,
    reactions: [
      { emoji: "TECH", count: 24, userReacted: true },
      { emoji: "LIT", count: 8, userReacted: false },
    ],
    stats: { posts: 89, followers: "1.1k", following: 200 },
  },
  {
    id: 3,
    user: "GreenHealer",
    name: "Dr. Green",
    initials: "GH",
    color: "bg-purple-500",
    timeAgo: "1 day ago",
    timestamp: "May 25, 2026 - 09:20 UTC",
    content:
      "Tonight's selection is Granddaddy Purple. Super heavy on the Myrcene, testing at 1.5%. Absolutely perfect strain for sinking deep into the couch, melting away soreness, and catching some serious deep sleep.",
    badge: {
      text: "Strain Reviews",
      style:
        "text-purple-400 dark:text-purple-300 border-purple-500/30 bg-purple-500/10",
    },
    likes: 89,
    comments: 21,
    reposts: 15,
    isLiked: false,
    isReposted: true,
    isSaved: false,
    reactions: [{ emoji: "CALM", count: 32, userReacted: false }],
    stats: { posts: 350, followers: "12k", following: 800 },
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 },
  },
};

interface CommunityFeedProps {
  posts?: any[];
  setPosts?: React.Dispatch<React.SetStateAction<any[]>>;
  researchAssociates?: string[];
  setResearchAssociates?: React.Dispatch<React.SetStateAction<string[]>>;
  pendingInvites?: { user: string; direction: "incoming" | "outgoing" }[];
  setPendingInvites?: React.Dispatch<
    React.SetStateAction<{ user: string; direction: "incoming" | "outgoing" }[]>
  >;
  onViewProfile?: (handle: string) => void;
}

export default function CommunityFeed({
  posts = [],
  setPosts = () => {},
  researchAssociates = ["Botanist_Jane"],
  setResearchAssociates = () => {},
  pendingInvites = [{ user: "GreenHealer", direction: "incoming" }],
  setPendingInvites = () => {},
  onViewProfile = () => {},
}: CommunityFeedProps) {
  const [newPost, setNewPost] = useState("");
  const [isHubOpen, setIsHubOpen] = useState(false);

  const [activeTag, setActiveTag] = useState("ALL DISCUSSION");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedPostId, setCopiedPostId] = useState<number | null>(null);
  const [expandedComments, setExpandedComments] = useState<
    Record<number, boolean>
  >({});
  const [replyTexts, setReplyTexts] = useState<Record<number, string>>({});

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pickerPostId, setPickerPostId] = useState<number | null>(null);

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

  const tags = [
    "ALL DISCUSSION",
    "CULTIVAR REVIEWS",
    "SIMULATOR BLENDS",
    "LOUNGE CHATS",
  ];

  const filteredPosts = posts.filter((p) => {
    const matchesTag =
      activeTag === "ALL DISCUSSION" ||
      (activeTag === "CULTIVAR REVIEWS" &&
        p.badge?.text === "Strain Reviews") ||
      (activeTag === "SIMULATOR BLENDS" &&
        p.badge?.text === "Stash Showcase") ||
      (activeTag === "LOUNGE CHATS" && p.badge?.text === "Vibe Check");
    const matchesSearch =
      searchQuery === "" ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  const handlePassVibe = (id: number) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, passCount: (p as any).passCount + 1 } : p,
      ),
    );
  };

  const handleAddToCircle = (username: string) => {
    if (!researchAssociates.includes(username)) {
      setResearchAssociates([...researchAssociates, username]);
    }
  };

  const toggleComments = (id: number) => {
    setExpandedComments((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePostReply = (id: number) => {
    const text = replyTexts[id];
    if (!text?.trim()) return;

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            comments: p.comments + 1,
            replies: [
              ...(p as any).replies,
              { id: Date.now() + Math.random(), user: "You", content: text },
            ],
          };
        }
        return p;
      }),
    );
    setReplyTexts((prev) => ({ ...prev, [id]: "" }));
  };

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleCopyLink = (id: number) => {
    setCopiedPostId(id);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopiedPostId(null), 2000);
  };

  const handlePost = () => {
    if (!newPost.trim() && !selectedImage) return;

    const now = new Date();

    const post = {
      id: Date.now() + Math.random(),
      user: "Current_Explorist",
      name: "You",
      initials: "CE",
      color: "bg-emerald-400",
      timeAgo: "Just now",
      timestamp: `${now.toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric" })} - ${now.toLocaleString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })} UTC`,
      content: newPost,
      image: selectedImage,
      passCount: 0,
      replies: [],
      badge: {
        text: "Stash Showcase",
        style: "text-gray-300 border-gray-500/30 bg-gray-500/10",
      },
      likes: 0,
      comments: 0,
      reposts: 0,
      isLiked: false,
      isReposted: false,
      isSaved: false,
      reactions: [],
      stats: { posts: 1, followers: "0", following: 0 },
    };

    setPosts([post, ...posts]);
    setNewPost("");
    setSelectedImage(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Mock preview logic
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const toggleLike = (id: number) => {
    setPosts(
      posts.map((post) => {
        if (post.id === id) {
          return {
            ...post,
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          };
        }
        return post;
      }),
    );
  };

  const toggleRepost = (id: number) => {
    setPosts(
      posts.map((post) => {
        if (post.id === id) {
          return {
            ...post,
            isReposted: !post.isReposted,
            reposts: post.isReposted ? post.reposts - 1 : post.reposts + 1,
          };
        }
        return post;
      }),
    );
  };

  const toggleSave = (id: number) => {
    setPosts(
      posts.map((post) => {
        if (post.id === id) {
          return { ...post, isSaved: !post.isSaved };
        }
        return post;
      }),
    );
  };

  const toggleReaction = (postId: number, emoji: string) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          const existingReaction = post.reactions.find(
            (r) => r.emoji === emoji,
          );
          let newReactions = [...post.reactions];

          if (existingReaction) {
            newReactions = newReactions
              .map((r) =>
                r.emoji === emoji
                  ? {
                      ...r,
                      count: r.userReacted ? r.count - 1 : r.count + 1,
                      userReacted: !r.userReacted,
                    }
                  : r,
              )
              .filter((r) => r.count > 0);
          } else {
            newReactions.push({ emoji, count: 1, userReacted: true });
          }

          return { ...post, reactions: newReactions };
        }
        return post;
      }),
    );
  };

  const insertText = (before: string, after: string = "") => {
    // Simple insertion, ideally we'd use ref and selectionStart, but this is a quick functional approach
    setNewPost((prev) => prev + before + "text" + after);
  };

  const incomingCount = pendingInvites.filter(
    (x) => x.direction === "incoming",
  ).length;

  return (
    <div className="w-full h-full flex flex-col space-y-4 md:space-y-6 max-w-4xl mx-auto pb-24 md:pb-32 px-4">
      {/* Header section with Associates Hub toggle */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-[var(--border-regular)]">
        <div className="space-y-1.5 text-left">
          <h3 className="font-display text-xl md:text-3xl font-black text-[var(--text-primary)] flex items-center gap-2.5">
            <Users className="w-5 h-5 md:w-6 md:h-6 text-emerald-500" />
            Smoking Circle
          </h3>
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <span className="text-[9px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                Active: {peerCount}
              </span>
            </div>
            <p className="text-[11px] md:text-sm text-[var(--text-secondary)] font-sans font-medium max-w-xl">
              Swap stories, frosty buds, and vibes.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsHubOpen((prev) => !prev)}
          className={`shrink-0 relative flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider border transition-all cursor-pointer ${
            isHubOpen
              ? "bg-emerald-500 text-white border-transparent"
              : "bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-emerald-500/50"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>My Circle</span>
          {incomingCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 text-[10px] items-center justify-center text-white">
                {incomingCount}
              </span>
            </span>
          )}
        </button>
      </div>

      <div className="flex flex-col gap-6 flex-1 overflow-y-auto pr-2 pb-8 scrollbar-hidden">
        <AnimatePresence>
          {isHubOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-2xl p-4 md:p-6 shadow-xl relative backdrop-blur-md mb-6">
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-[var(--border-subtle)]">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-emerald-500" />
                    <span className="text-xs md:text-sm font-mono font-black text-[var(--text-primary)] uppercase">
                      My Circle
                    </span>
                  </div>
                  <X
                    onClick={() => setIsHubOpen(false)}
                    className="w-4 h-4 text-[var(--text-muted)] cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                      Connected ({researchAssociates.length})
                    </h4>
                    {researchAssociates.length === 0 ? (
                      <div className="bg-[var(--bg-main)] border border-[var(--border-subtle)] rounded-xl p-6 text-center text-[var(--text-muted)] text-xs font-mono">
                        No buddies in the circle.
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                        {researchAssociates.map((username) => (
                          <div
                            key={username}
                            className="flex items-center justify-between p-2.5 bg-[var(--bg-main)] border border-[var(--border-subtle)] rounded-xl"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-emerald-400 flex items-center justify-center font-mono font-bold text-xs text-white">
                                {username.substring(0, 2).toUpperCase()}
                              </div>
                              <span className="text-xs font-bold text-[var(--text-primary)]">
                                @{username}
                              </span>
                            </div>
                            <X
                              onClick={() =>
                                setResearchAssociates((prev) =>
                                  prev.filter((x) => x !== username),
                                )
                              }
                              className="w-3.5 h-3.5 text-rose-400 cursor-pointer"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right Column */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-500 uppercase">
                      Pending ({pendingInvites.length})
                    </h4>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          id="quick-invite"
                          type="text"
                          placeholder="Search handle..."
                          className="flex-1 bg-[var(--bg-main)] border border-[var(--border-regular)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                        <button
                          onClick={() => {
                            const input = document.getElementById(
                              "quick-invite",
                            ) as HTMLInputElement;
                            if (input?.value.trim()) {
                              setPendingInvites((prev) => [
                                ...prev,
                                {
                                  user: input.value.trim(),
                                  direction: "outgoing",
                                },
                              ]);
                              input.value = "";
                            }
                          }}
                          className="px-4 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase"
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search hashtags, strains, or topics..."
            className="w-full bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-xl pl-11 pr-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Quick-Tag Filter Bar */}
        <div className="flex gap-2 min-h-[40px] overflow-x-auto scrollbar-hidden pb-1">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-4 py-2 rounded-lg text-[10px] font-mono uppercase tracking-widest transition-all whitespace-nowrap font-black border ${
                activeTag === tag
                  ? "bg-emerald-500 text-white border-emerald-400 shadow-md"
                  : "bg-[var(--bg-surface-elevated)] text-[var(--text-muted)] border-[var(--border-subtle)] hover:border-emerald-500/30"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Create Post Input */}
        <motion.div
          id="create-post-wrapper"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-[var(--bg-surface)] border border-emerald-500/20 rounded-2xl p-4 md:p-7 space-y-4 shadow-lg shadow-emerald-500/5 mt-2"
        >
          <div className="flex gap-3 md:gap-4.5">
            <div
              onClick={() => onViewProfile("Current_Explorist")}
              className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-emerald-400/20 flex items-center justify-center border border-emerald-400/40 shrink-0 cursor-pointer hover:bg-emerald-400/30 transition-colors"
            >
              <span className="text-emerald-400 font-bold font-mono text-xs md:text-sm">
                CE
              </span>
            </div>
            <div className="flex-1 space-y-3.5 overflow-hidden">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Share with the circle..."
                className="w-full bg-transparent border-none text-sm md:text-base text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none p-1 rounded-xl resize-none min-h-[4rem] md:min-h-[4.5rem] whitespace-pre-wrap font-sans font-semibold leading-relaxed"
              />

              {selectedImage && (
                <div className="relative inline-block mt-2">
                  <img
                    src={selectedImage}
                    alt="Upload preview"
                    className="h-24 md:h-32 object-cover rounded-xl border border-[var(--border-subtle)]"
                  />
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-1 right-1 md:top-2 md:right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-rose-500/80 transition-colors"
                  >
                    <X className="w-3 md:w-4 h-3 md:h-4" />
                  </button>
                </div>
              )}

              <div className="flex flex-wrap gap-2 md:gap-2.5">
                <button
                  onClick={() => insertText("**", "**")}
                  className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg transition-colors"
                  title="Bold"
                >
                  <Bold className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </button>
                <button
                  onClick={() => insertText("*", "*")}
                  className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg transition-colors"
                  title="Italic"
                >
                  <Italic className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </button>
                <button
                  onClick={() => insertText("[", "](url)")}
                  className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg transition-colors"
                  title="Link"
                >
                  <LinkIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </button>
                <div className="w-px h-5 md:h-6 bg-[var(--border-subtle)] mx-0.5 md:mx-1.5 self-center" />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg transition-colors"
                  title="Upload Photo"
                >
                  <ImageIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </button>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-[var(--border-subtle)]">
            <div className="flex gap-2">
              <button className="p-2.5 text-[var(--text-secondary)] hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-500/10 rounded-xl transition-colors flex gap-2 items-center text-[10px] md:text-sm font-mono font-bold">
                <Leaf className="w-4 h-4 md:w-4.5 md:h-4.5" />
                <span className="hidden sm:inline">Tag Strain</span>
              </button>
            </div>
            <button
              id="btn-post-to-circle"
              onClick={handlePost}
              style={{ color: "#000101", backgroundColor: "#19e6a7" }}
              className="hover:opacity-90 px-4 md:px-6 py-2 md:py-2.5 rounded-xl font-black font-mono text-[10px] md:text-sm tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50 transition-all cursor-pointer"
              disabled={!newPost.trim() && !selectedImage}
            >
              <Send className="w-3.5 h-3.5 md:w-4 md:h-4" />
              POST
            </button>
          </div>
        </motion.div>

        {/* Feed Timeline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          <AnimatePresence>
            {filteredPosts.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12 text-gray-450 font-mono text-sm"
              >
                No posts found in this circle.
              </motion.div>
            )}
            {filteredPosts.map((post) => (
              <motion.div
                key={post.id}
                layout
                variants={itemVariants}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[var(--bg-surface)] border border-[var(--border-regular)] rounded-2xl p-4 md:p-7 hover:border-[var(--border-subtle)]/20 transition-colors shadow-md relative overflow-hidden"
              >
                {/* Post Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start mb-4 md:mb-5 gap-3">
                  <div
                    className="flex gap-3 md:gap-3.5 cursor-pointer group"
                    onClick={() => onViewProfile(post.user)}
                  >
                    <div
                      className={`w-9 h-9 md:w-11 md:h-11 rounded-full ${post.color} flex items-center justify-center border border-white/20 shadow-inner group-hover:ring-2 ring-emerald-500/50 transition-all shrink-0`}
                    >
                      <span className="text-white font-black font-mono text-xs md:text-sm">
                        {post.initials}
                      </span>
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="font-display font-black text-[var(--text-primary)] text-sm md:text-lg group-hover:text-emerald-500 dark:group-hover:text-emerald-300 transition-colors truncate">
                        {post.name}
                        {post.user && (
                          <span className="text-[var(--text-muted)] ml-1 md:ml-1.5 text-[10px] md:text-sm font-mono font-normal">
                            @{post.user}
                          </span>
                        )}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCircle(post.user);
                          }}
                          disabled={researchAssociates.includes(post.user)}
                          className={`text-[8px] md:text-[9px] font-mono font-black uppercase tracking-widest px-2 py-0.5 md:py-1 rounded-lg border transition-all ${
                            researchAssociates.includes(post.user)
                              ? "bg-white/5 text-[var(--text-muted)] border-[var(--border-subtle)]"
                              : "bg-emerald-400 text-emerald-950 border-emerald-300 hover:bg-emerald-300 shadow-sm"
                          }`}
                        >
                          {researchAssociates.includes(post.user)
                            ? "CIRCLE MEMBER"
                            : "ADD BUDDY"}
                        </button>
                        <span className="text-[10px] md:text-xs font-mono text-emerald-600 dark:text-emerald-400/80">
                          {post.timeAgo}
                        </span>
                      </div>
                    </div>
                  </div>
                  {post.badge && (
                    <span
                      className={`px-2 md:px-3 py-1 border rounded-lg text-[10px] md:text-xs font-mono font-bold uppercase tracking-wider ${post.badge.style} shrink-0`}
                    >
                      {post.badge.text}
                    </span>
                  )}
                </div>

                {/* Post Content with Rich Text */}
                <div className="text-sm md:text-base text-[var(--text-secondary)] font-sans font-medium leading-relaxed mb-4 md:mb-5 markdown-body prose prose-invert max-w-none prose-p:my-1 prose-a:text-emerald-500 prose-strong:text-[var(--text-primary)]">
                  <ReactMarkdown>{post.content}</ReactMarkdown>
                </div>

                {/* Embedded Image (mock render) */}
                {/* @ts-ignore - mock property */}
                {post.image && (
                  <div className="mb-4 md:mb-6 rounded-2xl overflow-hidden border border-[var(--border-subtle)] max-w-lg shadow-sm">
                    <img
                      src={(post as any).image}
                      alt="Post attachment"
                      className="w-full object-cover max-h-80"
                    />
                  </div>
                )}

                {/* Post Interactivity */}
                <div className="flex flex-wrap gap-x-4 gap-y-3 md:gap-7 border-t border-[var(--border-subtle)] pt-4 mt-2">
                  <button
                    onClick={() => toggleLike(post.id)}
                    className={`flex items-center gap-1.5 md:gap-2 text-[11px] md:text-sm font-mono font-bold transition-colors ${
                      post.isLiked
                        ? "text-rose-500"
                        : "text-[var(--text-muted)] hover:text-rose-500"
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 md:w-4.5 md:h-4.5 ${post.isLiked ? "fill-current" : ""}`}
                    />
                    {post.likes}
                  </button>
                  <button
                    onClick={() => toggleComments(post.id)}
                    className="flex items-center gap-1.5 md:gap-2 text-[11px] md:text-sm font-mono font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors uppercase tracking-widest"
                  >
                    <MessageSquare className="w-4 h-4 md:w-4.5 md:h-4.5" />
                    <span className="hidden xs:inline">
                      {expandedComments[post.id]
                        ? "HIDE"
                        : `COMMENTS (${post.comments})`}
                    </span>
                    <span className="xs:hidden">{post.comments}</span>
                  </button>
                  <button
                    onClick={() => handlePassVibe(post.id)}
                    className="flex items-center gap-1.5 md:gap-2 px-2.5 md:px-4 py-1.5 md:py-2 bg-emerald-400 text-emerald-950 rounded-lg text-[10px] md:text-xs font-mono font-black uppercase tracking-widest transition-transform duration-150 active:scale-95 hover:bg-emerald-300"
                  >
                    PASS: {(post as any).passCount || 0}
                  </button>
                  <button
                    onClick={() => toggleSave(post.id)}
                    className={`flex items-center gap-1.5 md:gap-2 text-[11px] md:text-sm font-mono font-bold transition-colors ml-auto ${
                      post.isSaved
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    <Bookmark
                      className={`w-4 h-4 md:w-4.5 md:h-4.5 ${post.isSaved ? "fill-current" : ""}`}
                    />
                  </button>
                </div>

                {/* Reactions (bottom row) */}
                <div className="flex gap-2.5 pt-4 flex-wrap relative">
                  {post.reactions?.map((reaction, idx) => (
                    <button
                      key={idx}
                      onClick={() => toggleReaction(post.id, reaction.emoji)}
                      className={`px-3 py-1.5 rounded-full border text-[10px] uppercase font-mono font-black flex items-center gap-1.5 transition-colors ${
                        reaction.userReacted
                          ? "bg-emerald-400 border-emerald-300 text-emerald-950"
                          : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <span className="text-sm">
                        {EMOJI_MAP[reaction.emoji] || "🍁"}
                      </span>
                      <span className="tracking-wider">{reaction.emoji}</span>
                      <span className="text-gray-400 font-sans ml-0.5">
                        {reaction.count}
                      </span>
                    </button>
                  ))}

                  <div className="relative">
                    <button
                      onClick={() =>
                        setPickerPostId(
                          pickerPostId === post.id ? null : post.id,
                        )
                      }
                      className="p-2 rounded-full text-gray-400 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                    >
                      <SmilePlus className="w-4.5 h-4.5" />
                    </button>

                    {/* Inline Emoji Picker Popover */}
                    {pickerPostId === post.id && (
                      <div className="absolute left-0 bottom-full mb-2 bg-[#0c1410] border border-emerald-500/30 rounded-2xl p-2.5 shadow-2xl shadow-black/80 z-20 grid grid-cols-4 gap-1.5 w-[250px] backdrop-blur-md">
                        {EMOJI_LIST.map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => {
                              toggleReaction(post.id, emoji);
                              setPickerPostId(null);
                            }}
                            className="py-2 px-1 flex flex-col items-center justify-center rounded-xl border border-white/5 hover:border-emerald-500/30 bg-white/5 hover:bg-emerald-500/15 text-center transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
                            title={emoji}
                          >
                            <span className="text-xl mb-0.5">
                              {EMOJI_MAP[emoji] || "🍁"}
                            </span>
                            <span className="text-[7.5px] font-mono font-black text-gray-500 uppercase tracking-widest">
                              {emoji}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Stash Commenting Engine */}
                {expandedComments[post.id] && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 pt-6 border-t border-white/10 space-y-5"
                  >
                    <div className="space-y-4">
                      {(post as any).replies?.map((reply: any) => (
                        <div
                          key={reply.id}
                          className="flex gap-3 bg-white/5 p-4 rounded-xl border border-white/5 cursor-pointer hover:bg-white/10 transition-colors"
                          onClick={() => onViewProfile(reply.user)}
                        >
                          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0 border border-white/10">
                            <span className="text-[10px] font-mono font-bold text-white">
                              {reply.user.substring(0, 1)}
                            </span>
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                              {reply.user}
                            </div>
                            <div className="text-sm text-gray-200 font-medium leading-relaxed">
                              {reply.content}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="Join the discussion..."
                        value={replyTexts[post.id] || ""}
                        onChange={(e) =>
                          setReplyTexts((prev) => ({
                            ...prev,
                            [post.id]: e.target.value,
                          }))
                        }
                        onKeyDown={(e) =>
                          e.key === "Enter" && handlePostReply(post.id)
                        }
                        className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 font-sans"
                      />
                      <button
                        onClick={() => handlePostReply(post.id)}
                        className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-mono font-black text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
                      >
                        POST REPLY
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
