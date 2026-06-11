import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CompoundTooltip } from "./CompoundTooltip";
import {
  Star,
  Users,
  Trash2,
  MapPin,
  Sparkles,
  Activity,
  Bookmark,
  UserCheck,
  TrendingUp,
  Settings,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import {
  Camera,
  Upload,
  Edit3,
  Wand2,
  Check,
  X as CloseIcon,
} from "lucide-react";
import SettingsModal from "./SettingsModal";
import { STRAINS_DATA } from "../data";
import { Strain } from "../types";
import avatarImg1 from "../assets/images/profile_avatar_connoisseur_1779936959606.png";
import avatarImg2 from "../assets/images/avatar_nebula_mystic_1779939853589.png";
import avatarImg3 from "../assets/images/avatar_botanic_tech_1779939874010.png";

// Sample trend data for the chart
const TREND_DATA = [
  { day: "Mon", interaction: 12, mixes: 2 },
  { day: "Tue", interaction: 18, mixes: 5 },
  { day: "Wed", interaction: 15, mixes: 3 },
  { day: "Thu", interaction: 25, mixes: 8 },
  { day: "Fri", interaction: 32, mixes: 12 },
  { day: "Sat", interaction: 28, mixes: 10 },
  { day: "Sun", interaction: 22, mixes: 6 },
];

interface MyStashProps {
  researchAssociates: string[];
  setResearchAssociates: React.Dispatch<React.SetStateAction<string[]>>;
  customMixes: CustomMix[];
  onDeleteMix: (id: string) => void;
  currentUser?: { handle: string } | null;
  onWaveHand?: (buddyName: string) => void;
  onViewProfile?: (handle: string) => void;
  onUpdateUser?: (newUser: { handle: string }) => void;
}

interface CustomMix {
  id: string;
  name: string;
  thc: number;
  cbd: number;
  terpeneConcentration: number;
  selectedTerpene: string;
  vibe: string;
  created: string;
}

export default function MyStash({
  researchAssociates,
  setResearchAssociates,
  customMixes,
  onDeleteMix,
  currentUser,
  onWaveHand,
  onViewProfile = () => {},
  onUpdateUser = () => {},
}: MyStashProps) {
  const [favoriteStrains, setFavoriteStrains] = useState<Strain[]>([]);

  // Local profile states (user interactive customization)
  const [profileBio, setProfileBio] = useState(() => {
    return (
      localStorage.getItem("canna_profile_bio") ||
      "Chief Science Explorer mapping out the entourage effect. Always looking for sweet citrus terp combos and crisp focus high vibes."
    );
  });
  const [profileLocation, setProfileLocation] = useState(() => {
    return (
      localStorage.getItem("canna_profile_location") ||
      "Pacific Northwest Hills"
    );
  });
  const [avatarUrl, setAvatarUrl] = useState(() => {
    return localStorage.getItem("canna_profile_avatar") || avatarImg1;
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showNotification, setShowNotification] = useState("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const genTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (genTimerRef.current) clearTimeout(genTimerRef.current);
    };
  }, []);

  // Load stash assets
  useEffect(() => {
    // Favorite Strains
    try {
      const storedVal = localStorage.getItem("canna_favorite_strains");
      const storedFavIds: string[] = storedVal
        ? JSON.parse(storedVal) || []
        : ["s1", "s3"];
      const filtered = STRAINS_DATA.filter((s) => storedFavIds.includes(s.id));
      setFavoriteStrains(filtered);
    } catch (err) {
      console.error(
        "Diagnostic error: Failed to parse favorite strains fallback.",
      );
      // Fallback
      setFavoriteStrains(STRAINS_DATA.slice(0, 2));
    }
  }, []);

  const saveProfileSettings = () => {
    try {
      localStorage.setItem("canna_profile_bio", profileBio);
      localStorage.setItem("canna_profile_location", profileLocation);
      localStorage.setItem("canna_profile_avatar", avatarUrl);
    } catch (e) {
      console.error("Diagnostic error: Profile save memory full.");
    }
    setIsEditingProfile(false);
    triggerNotification("Profile details updated!");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        triggerNotification("File too large (max 2MB)");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setAvatarUrl(base64);
        triggerNotification("Photo uploaded successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const generateAIAvatar = () => {
    setIsGenerating(true);
    // Simulate generation delay
    if (genTimerRef.current) clearTimeout(genTimerRef.current);
    genTimerRef.current = setTimeout(() => {
      const options = [avatarImg1, avatarImg2, avatarImg3];
      const random = options[Math.floor(Math.random() * options.length)];
      setAvatarUrl(random);
      setIsGenerating(false);
      triggerNotification("Avatar Generated!");
    }, 2000);
  };

  const triggerNotification = (msg: string) => {
    setShowNotification(msg);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setShowNotification(""), 3000);
  };

  const handleDeleteMix = (id: string) => {
    onDeleteMix(id);
    triggerNotification("Custom mix deleted from stash");
  };

  const handleDeleteFavorite = (id: string) => {
    const updatedFavs = favoriteStrains.filter((item) => item.id !== id);
    setFavoriteStrains(updatedFavs);
    try {
      const storedVal = localStorage.getItem("canna_favorite_strains");
      const storedFavIds: string[] = storedVal
        ? JSON.parse(storedVal) || []
        : [];
      const filteredIds = storedFavIds.filter((x: string) => x !== id);
      localStorage.setItem(
        "canna_favorite_strains",
        JSON.stringify(filteredIds),
      );
      triggerNotification("Cultivar removed from favorites");
    } catch (err) {
      console.error("Diagnostic error: Cultivar update failure fallback.");
    }
  };

  return (
    <div className="w-full space-y-8 bg-[var(--bg-surface)] border border-[var(--border-regular)] rounded-2xl md:rounded-3xl p-6 md:p-8 pb-32 shadow-2xl relative text-[var(--text-primary)]">
      {/* Visual notification bubble */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 right-4 bg-emerald-500 text-emerald-950 font-sans font-extrabold text-xs px-4 py-2.5 rounded-full shadow-lg z-50 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {showNotification}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Header Block */}
      <div className="bg-[var(--bg-surface-elevated)] rounded-2xl p-6 border border-[var(--border-subtle)] relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6 stash-header-glass">
        <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4 text-left">
          <div
            className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-tr from-emerald-500 to-[#b87333] p-[3px] shadow-lg flex items-center justify-center relative shrink-0 group cursor-pointer"
            onClick={() => setIsAvatarModalOpen(true)}
          >
            <div className="w-full h-full bg-[#0a0c0b] rounded-[13px] flex items-center justify-center overflow-hidden relative">
              <img
                src={avatarUrl}
                alt="Profile Avatar"
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 border-2 border-black rounded-full animate-pulse z-10 flex items-center justify-center">
              <Edit3 className="w-2.5 h-2.5 text-black" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-display font-black text-[#ffd700] tracking-tight">
                {currentUser
                  ? `${currentUser.handle}'s Stash`
                  : "Current_Explorist"}
              </h2>
              <div className="flex items-center gap-1.5 p-1 bg-white/5 rounded-lg border border-white/10">
                <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 font-bold uppercase tracking-wider">
                  Senior Connoisseur
                </span>
                <div className="w-[1px] h-3 bg-white/10" />
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="p-1 px-2 hover:bg-white/10 rounded-md text-gray-400 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
                  title="Configure Laboratory"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-mono uppercase font-black">
                    Controls
                  </span>
                </button>
              </div>
            </div>

            <p className="text-xs text-gray-400 font-mono flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              ID: #4921 • Joined March 2026
            </p>
          </div>
        </div>

        {/* Profile Stats Widget */}
        <div className="flex gap-4 self-stretch md:self-auto justify-around bg-neutral-950/40 p-4 rounded-xl border border-white/5">
          <div className="text-center px-4">
            <span className="text-xl font-mono font-black text-emerald-300 block">
              {customMixes.length}
            </span>
            <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest block font-bold mt-0.5">
              My Mixes
            </span>
          </div>
          <div className="w-[1px] bg-white/10" />
          <div className="text-center px-4">
            <span className="text-xl font-mono font-black text-amber-500 block">
              {favoriteStrains.length}
            </span>
            <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest block font-bold mt-0.5">
              Favs
            </span>
          </div>
          <div className="w-[1px] bg-white/10" />
          <div className="text-center px-4">
            <span className="text-xl font-mono font-black text-sky-400 block">
              {researchAssociates.length}
            </span>
            <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest block font-bold mt-0.5">
              Buddies
            </span>
          </div>
        </div>
      </div>

      {/* Bio / Settings Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 bg-black/40 rounded-2xl border border-white/5 space-y-4 text-left flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <span className="text-xs font-mono text-[#b87333] uppercase tracking-wider font-bold block">
                Stash Drawer Bio & Settings
              </span>
              <button
                onClick={() => {
                  if (isEditingProfile) {
                    saveProfileSettings();
                  } else {
                    setIsEditingProfile(true);
                  }
                }}
                className="text-[10px] font-mono uppercase tracking-widest text-[#ffd700] hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 transition-colors cursor-pointer font-bold"
              >
                {isEditingProfile ? "Save Profile" : "Edit Details"}
              </button>
            </div>

            {isEditingProfile ? (
              <div className="space-y-4 pt-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono text-gray-300 font-bold uppercase tracking-wider">
                    Bio Capsule
                  </label>
                  <textarea
                    value={profileBio}
                    onChange={(e) => setProfileBio(e.target.value)}
                    maxLength={250}
                    rows={3}
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
                <div className="flex flex-col gap-1.5 max-w-sm">
                  <label className="text-xs font-mono text-gray-300 font-bold uppercase tracking-wider">
                    Region Hub
                  </label>
                  <input
                    type="text"
                    value={profileLocation}
                    onChange={(e) => setProfileLocation(e.target.value)}
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4 pt-4 text-sm">
                <p className="text-white/90 font-sans leading-relaxed font-medium italic">
                  "{profileBio}"
                </p>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-gray-400 bg-neutral-950/40 px-3 py-1.5 rounded-lg border border-white/5 w-fit font-bold uppercase">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  {profileLocation}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Trend Visualization Chart */}
        <div className="p-5 bg-black/40 rounded-2xl border border-white/5 flex flex-col text-left">
          <div className="flex justify-between items-center pb-2 border-b border-white/5 mb-4">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-bold flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5" />
              Exploration Trends
            </span>
            <span className="text-[10px] font-mono text-gray-500 font-bold">
              WEEKLY ACTIVITY
            </span>
          </div>

          <div className="flex-1 h-32 w-full min-h-[140px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TREND_DATA}>
                <defs>
                  <linearGradient
                    id="colorInteraction"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorMixes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffd700" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ffd700" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#ffffff05"
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#4b5563", fontSize: 9, fontWeight: 700 }}
                  dy={10}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0a0f0d",
                    border: "1px solid #ffffff1a",
                    borderRadius: "8px",
                    fontSize: "10px",
                    fontFamily: "monospace",
                  }}
                  itemStyle={{ color: "#fff" }}
                />
                <Area
                  type="monotone"
                  dataKey="interaction"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorInteraction)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="mixes"
                  stroke="#ffd700"
                  fillOpacity={1}
                  fill="url(#colorMixes)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 mt-3 pt-3 border-t border-white/5">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[8px] font-mono text-gray-400 font-bold uppercase">
                Browsing
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#ffd700]" />
              <span className="text-[8px] font-mono text-gray-400 font-bold uppercase">
                Custom Mixing
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Customization Modal */}
      <AnimatePresence>
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          currentUser={currentUser || { handle: "Current_Explorist" }}
          onUpdateUser={onUpdateUser}
        />
        {isAvatarModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAvatarModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-[#0a0f0d] border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-[#ffd700] to-[#b87333]" />

              <div className="flex justify-between items-center">
                <h3 className="text-xl font-display font-black text-white">
                  Avatar Customizer
                </h3>
                <button
                  onClick={() => setIsAvatarModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Preview */}
              <div className="flex flex-col items-center gap-4">
                <div className="w-32 h-32 rounded-3xl bg-gradient-to-tr from-emerald-500 to-[#b87333] p-1 shadow-2xl">
                  <div className="w-full h-full bg-[#0a0c0b] rounded-[22px] flex items-center justify-center overflow-hidden">
                    <img
                      src={avatarUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold">
                  Identity Preview
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 pt-4">
                {/* Upload Section */}
                <label className="group relative flex flex-col items-center justify-center p-4 py-6 border-2 border-dashed border-white/10 hover:border-emerald-500/50 rounded-2xl transition-all cursor-pointer bg-white/5 hover:bg-emerald-500/5 overflow-hidden">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <Upload className="w-6 h-6 text-gray-400 group-hover:text-emerald-400 mb-2 transition-colors" />
                  <span className="text-xs font-mono text-gray-300 font-bold uppercase">
                    Upload Custom Photo
                  </span>
                  <p className="text-[9px] text-gray-500 mt-1 uppercase font-bold">
                    JPG, PNG up to 2MB
                  </p>
                </label>

                {/* AI Generation Section */}
                <button
                  onClick={generateAIAvatar}
                  disabled={isGenerating}
                  className="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-400 hover:from-emerald-500 hover:to-emerald-300 text-emerald-950 font-display font-black text-sm rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg disabled:opacity-50 disabled:grayscale"
                >
                  {isGenerating ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-emerald-950 border-t-transparent rounded-full animate-spin" />
                      <span className="uppercase tracking-widest font-mono text-xs">
                        Synthesizing...
                      </span>
                    </div>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" />
                      <span className="uppercase tracking-widest">
                        Create AI Avatar
                      </span>
                    </>
                  )}
                </button>

                {/* Gallery Select */}
                <div className="space-y-3 pt-2">
                  <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest font-bold border-b border-white/5 pb-1">
                    Connoisseur Gallery
                  </p>
                  <div className="flex justify-center gap-3">
                    {[avatarImg1, avatarImg2, avatarImg3].map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setAvatarUrl(img)}
                        className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all ${avatarUrl === img ? "border-emerald-500 scale-110" : "border-white/10 hover:border-white/30"}`}
                      >
                        <img
                          src={img}
                          alt={`Gallery ${i}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsAvatarModalOpen(false)}
                className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all"
              >
                Done
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Stash Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 Columns: Mixes & Favorites */}
        <div className="lg:col-span-8 space-y-8">
          {/* Custom Mixes Container */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <h3 className="text-xl font-display font-black text-white flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-emerald-400" />
                Simbiosis Mixes
              </h3>
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest font-bold">
                Logged Compounds
              </span>
            </div>

            {customMixes.length === 0 ? (
              <div className="p-8 text-center bg-black/40 border border-white/5 rounded-2xl space-y-3.5">
                <p className="text-sm text-gray-400 font-sans font-medium">
                  Your custom compound shelf is empty. Go to the{" "}
                  <span className="text-[#b87333] font-bold">
                    Compound Simulator
                  </span>{" "}
                  to design custom cannabinoid & terpene mixes!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customMixes.map((mix) => (
                  <div
                    key={mix.id}
                    className="p-5 bg-black/60 border border-white/10 rounded-xl space-y-4 hover:border-emerald-500/30 transition-all flex flex-col justify-between text-left"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-display font-bold text-base text-white truncate text-glow-sm">
                          {mix.name}
                        </h4>
                        <button
                          onClick={() => handleDeleteMix(mix.id)}
                          className="p-1 text-gray-400 hover:text-rose-455 transition-colors cursor-pointer"
                          title="Delete Mix"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-xs text-amber-500 font-mono font-bold uppercase tracking-wider block mt-1">
                        {mix.vibe || "Custom Hybrid"}
                      </p>

                      {/* Mix Stats Grid */}
                      <div className="grid grid-cols-3 gap-2 p-2 bg-neutral-950/50 rounded-lg border border-white/5 mt-3 text-center">
                        <div>
                          <span className="text-[8px] font-mono text-gray-500 block uppercase font-extrabold">
                            THC
                          </span>
                          <span className="text-xs font-mono text-red-400 font-black">
                            {mix.thc}%
                          </span>
                        </div>
                        <div>
                          <span className="text-[8px] font-mono text-gray-500 block uppercase font-extrabold">
                            CBD
                          </span>
                          <span className="text-xs font-mono text-emerald-400 font-black">
                            {mix.cbd}%
                          </span>
                        </div>
                        <div>
                          <span className="text-[8px] font-mono text-gray-500 block uppercase font-extrabold">
                            ANALYSIS
                          </span>
                          <button
                            className="text-[10px] font-mono text-sky-400 font-black hover:text-white transition-colors cursor-pointer block w-full truncate"
                            onClick={(e) => {
                              e.stopPropagation();
                              triggerNotification(
                                `Analyzing ${mix.name}: High ${mix.selectedTerpene} synergy.`,
                              );
                            }}
                          >
                            VIEW
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[10px] font-mono text-gray-400 pt-2 border-t border-white/5">
                      <span>Logged: {mix.created}</span>
                      <span className="flex items-center gap-1 text-[#b87333] font-bold uppercase tracking-wider">
                        <Activity className="w-3.5 h-3.5" />
                        Simulator Spec
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Favorite Strains Drawer */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <h3 className="text-xl font-display font-black text-white flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400" />
                Favorite Cultivars
              </h3>
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest font-bold">
                My Favorites Stash
              </span>
            </div>

            {favoriteStrains.length === 0 ? (
              <div className="p-8 text-center bg-black/40 border border-white/5 rounded-2xl space-y-3.5">
                <p className="text-sm text-gray-400 font-sans font-medium">
                  Add cultivars to your favorites on the{" "}
                  <span className="text-emerald-400 font-bold">
                    Cultivar Directory
                  </span>{" "}
                  tab to list them here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {favoriteStrains.map((strain) => (
                  <div
                    key={strain.id}
                    className="p-4 bg-black/60 border border-white/10 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-amber-500/30 transition-all text-left"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="p-1 px-2 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold uppercase">
                          {strain.type}
                        </span>
                        <h4 className="font-display font-black text-[#f3f4f6] text-lg">
                          {strain.name}
                        </h4>
                      </div>
                      <p className="text-xs text-gray-300 font-sans leading-relaxed">
                        Main terpene:{" "}
                        <CompoundTooltip compoundKey={strain.terpenes[0]?.name || "N/A"}>
                          <span className="text-amber-400 font-bold border-b border-dashed border-white/20 hover:border-amber-400 cursor-help">
                            {strain.terpenes[0]?.name || "N/A"}
                          </span>
                        </CompoundTooltip>{" "}
                        • Benefits: {strain.benefits.slice(0, 2).join(", ")}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right text-[10px] font-mono shrink-0 hidden md:block">
                        <CompoundTooltip compoundKey="thc">
                          <span className="text-red-400 font-bold border-b border-dashed border-white/20 hover:border-red-400 cursor-help">
                            T: {strain.cannabinoids.thc}
                          </span>
                        </CompoundTooltip>{" "}
                        •{" "}
                        <CompoundTooltip compoundKey="cbd">
                          <span className="text-emerald-400 font-bold border-b border-dashed border-white/20 hover:border-emerald-400 cursor-help">
                            C: {strain.cannabinoids.cbd}
                          </span>
                        </CompoundTooltip>
                      </div>
                      <button
                        onClick={() => handleDeleteFavorite(strain.id)}
                        className="px-3 py-1.5 rounded-lg border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500 hover:text-white text-rose-400 text-xs transition-colors font-bold cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 4 Columns: Smoke Buddies */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <h3 className="text-xl font-display font-black text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-sky-400" />
              Smoke Buddies
            </h3>
            <span className="text-[10px] font-mono text-sky-400 uppercase tracking-widest font-bold">
              Connected
            </span>
          </div>

          <div className="bg-black/40 border border-white/5 rounded-2xl p-4 space-y-4 text-left">
            {researchAssociates.map((buddyName, idx) => (
              <div
                key={buddyName}
                className="p-3 bg-neutral-900/60 border border-white/5 rounded-xl flex items-center justify-between gap-3 group hover:border-emerald-500/20 transition-all cursor-pointer"
                onClick={() => onViewProfile(buddyName)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-mono text-sm font-black text-emerald-500 group-hover:bg-emerald-500 transition-all duration-300 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                      {buddyName.substring(0, 2).toUpperCase()}
                    </div>
                    {/* Status Indicator */}
                    <div
                      className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white dark:border-[#0a0f0d] rounded-full transition-transform group-hover:scale-110 ${idx % 2 === 0 ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-gray-400"}`}
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-sm md:text-base font-black text-gray-800 dark:text-white block truncate group-hover:text-emerald-500 transition-colors">
                        @{buddyName}
                      </span>
                      {idx % 2 === 0 && (
                        <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded-md font-black uppercase tracking-tighter">
                          Online
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 flex items-center gap-1 font-mono font-black uppercase tracking-tighter truncate mt-0.5">
                      <UserCheck className="w-3.5 h-3.5 text-sky-500 animate-pulse shrink-0" />
                      Session Connect
                    </span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.1, rotate: -2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onWaveHand) {
                      onWaveHand(buddyName);
                    } else {
                      const message = `Waved friendly hello to @${buddyName}!`;
                      triggerNotification(message);
                    }
                  }}
                  className="shrink-0 h-10 px-4 bg-emerald-500/10 dark:bg-sky-950/60 border border-emerald-500/20 dark:border-sky-500/30 hover:border-emerald-500 dark:hover:border-sky-400/50 text-emerald-600 dark:text-sky-400 text-[10px] font-mono uppercase tracking-[0.1em] font-black rounded-xl cursor-pointer transition-all flex items-center gap-2 hover:bg-emerald-500 hover:text-white dark:hover:bg-sky-500 dark:hover:text-sky-950 shadow-sm"
                >
                  <motion.span
                    className="text-sm"
                    animate={{
                      rotate: [0, 20, -20, 20, 0],
                    }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    👋
                  </motion.span>
                  <span className="font-black">Wave</span>
                </motion.button>
              </div>
            ))}

            <div className="text-[11px] font-mono text-center text-gray-500 dark:text-gray-400 border-t border-black/5 dark:border-white/5 pt-4">
              Explore your network further. Add more session buddies by clicking
              profile badges in the{" "}
              <span className="text-emerald-600 dark:text-emerald-400 font-black cursor-pointer hover:underline underline-offset-4 transition-all">
                Community
              </span>{" "}
              collective feed.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
