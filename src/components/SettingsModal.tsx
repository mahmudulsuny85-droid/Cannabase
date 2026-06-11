import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Settings,
  User,
  Palette,
  Shield,
  Lock,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  Moon,
  Sun,
  Monitor,
  Trash2,
  ChevronRight,
  Globe,
  Users,
  LockKeyhole,
  Sparkles,
} from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: { handle: string } | null;
  onUpdateUser: (newUser: { handle: string }) => void;
}

type SettingsTab = "account" | "theme" | "privacy" | "security";

export default function SettingsModal({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
}: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("account");
  const [newHandle, setNewHandle] = useState(currentUser?.handle || "");
  const [isCheckingHandle, setIsCheckingHandle] = useState(false);
  const [handleStatus, setHandleStatus] = useState<
    "none" | "available" | "taken"
  >("none");
  const [notification, setNotification] = useState("");

  // Theme Settings
  const [selectedTheme, setSelectedTheme] = useState(
    () => localStorage.getItem("canna_theme") || "emerald",
  );
  const [appearanceMode, setAppearanceMode] = useState(
    () => localStorage.getItem("canna_mode") || "dark",
  );

  // Privacy Settings
  const [profileVisibility, setProfileVisibility] = useState<
    "public" | "buddies" | "private"
  >(() => {
    return (localStorage.getItem("canna_privacy_profile") as any) || "public";
  });
  const [showStash, setShowStash] = useState(
    () => localStorage.getItem("canna_privacy_show_stash") !== "false",
  );
  const [showOnlineStatus, setShowOnlineStatus] = useState(
    () => localStorage.getItem("canna_privacy_online") !== "false",
  );

  // Security Settings
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(
    () => localStorage.getItem("canna_security_2fa") === "true",
  );

  useEffect(() => {
    if (newHandle !== currentUser?.handle && newHandle.length >= 3) {
      setIsCheckingHandle(true);
      const timer = setTimeout(() => {
        // Simulated check: names ending in 'taken' or 'user' are taken
        const taken =
          newHandle.toLowerCase().endsWith("taken") ||
          newHandle.toLowerCase() === "admin";
        setHandleStatus(taken ? "taken" : "available");
        setIsCheckingHandle(false);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      setHandleStatus("none");
      setIsCheckingHandle(false);
    }
  }, [newHandle, currentUser?.handle]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const notifTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (notifTimerRef.current) clearTimeout(notifTimerRef.current);
    };
  }, []);

  const triggerNotification = (msg: string) => {
    setNotification(msg);
    if (notifTimerRef.current) clearTimeout(notifTimerRef.current);
    notifTimerRef.current = setTimeout(() => setNotification(""), 3000);
  };

  const [isProcessing, setIsProcessing] = useState(false);

  const handleSaveAccount = () => {
    if (handleStatus === "available" || newHandle === currentUser?.handle) {
      if (newHandle === currentUser?.handle) {
        triggerNotification("Identity remains unchanged.");
        return;
      }

      setIsProcessing(true);
      // Simulate official identity migration protocol
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        onUpdateUser({ handle: newHandle });
        setIsProcessing(false);
        triggerNotification("Identity migration successful!");
      }, 2400);
    } else if (handleStatus === "taken") {
      triggerNotification("Identity request denied: Handle claimed.");
    }
  };

  const saveTheme = (theme: string) => {
    setSelectedTheme(theme);
    localStorage.setItem("canna_theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
    triggerNotification(
      `Theme changed to ${theme.charAt(0).toUpperCase() + theme.slice(1)}`,
    );
  };

  const saveMode = (mode: string) => {
    setAppearanceMode(mode);
    localStorage.setItem("canna_mode", mode);
    document.documentElement.setAttribute("data-mode", mode);
    // Dispatch storage event so same-tab listeners (TopNav) pick up the change
    window.dispatchEvent(new StorageEvent("storage", { key: "canna_mode", newValue: mode }));
    triggerNotification(`Display mode set to ${mode.toUpperCase()}`);
  };

  const savePrivacy = () => {
    localStorage.setItem("canna_privacy_profile", profileVisibility);
    localStorage.setItem("canna_privacy_show_stash", String(showStash));
    localStorage.setItem("canna_privacy_online", String(showOnlineStatus));
    triggerNotification("Privacy settings saved.");
  };

  const saveSecurity = () => {
    localStorage.setItem("canna_security_2fa", String(twoFactorEnabled));
    triggerNotification("Security settings updated.");
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl bg-[#0a0f0d] border border-white/10 rounded-[32px] overflow-hidden flex flex-col md:flex-row h-[600px] shadow-2xl"
        >
          {/* Sidebar Nav */}
          <div className="w-full md:w-64 bg-black/40 border-r border-white/5 p-6 flex flex-col gap-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-500/20 rounded-xl">
                <Settings className="w-5 h-5 text-emerald-400" />
              </div>
              <h2 className="text-lg font-display font-black text-white uppercase tracking-tight">
                Vibe Panel
              </h2>
            </div>

            <nav className="flex flex-col gap-1.5 flex-1">
              {[
                { id: "account", label: "My Account", icon: User },
                { id: "theme", label: "Appearance", icon: Palette },
                { id: "privacy", label: "Privacy Hub", icon: Shield },
                { id: "security", label: "Security & Ops", icon: LockKeyhole },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as SettingsTab)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-mono text-[11px] font-black uppercase tracking-widest transition-all ${
                      activeTab === tab.id
                        ? "bg-emerald-500 text-emerald-950 shadow-lg shadow-emerald-500/20"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>

            <button
              onClick={onClose}
              className="mt-auto px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-mono text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white border border-white/5 transition-all"
            >
              Exit Dashboard
            </button>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden relative">
            {/* Header */}
            <div className="p-8 pb-4 border-b border-white/5 flex justify-between items-center bg-[#0a0f0d]/50 backdrop-blur-sm sticky top-0 z-10">
              <h3 className="text-2xl font-display font-black text-white uppercase tracking-tight">
                {activeTab.replace("_", " ")}
              </h3>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-8 pt-6 space-y-8 scrollbar-thin scrollbar-thumb-white/10">
              {/* Account Settings */}
              {activeTab === "account" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-4 text-left">
                    <label className="text-[10px] font-mono text-emerald-400 font-black uppercase tracking-[0.2em] block">
                      Handle Identity
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <span className="text-emerald-500 font-mono font-black">
                          @
                        </span>
                      </div>
                      <input
                        type="text"
                        value={newHandle}
                        onChange={(e) =>
                          setNewHandle(
                            e.target.value.replace(/[^a-zA-Z0-9_]/g, ""),
                          )
                        }
                        className={`w-full bg-black/40 border ${handleStatus === "available" ? "border-emerald-500/50" : handleStatus === "taken" ? "border-rose-500/50" : "border-white/10"} group-hover:border-white/20 rounded-2xl py-4 pl-10 pr-12 text-white font-display font-bold text-lg focus:outline-none focus:ring-2 ring-emerald-500/20 transition-all`}
                        placeholder="new_explorist"
                      />
                      <div className="absolute inset-y-0 right-4 flex items-center gap-2">
                        {isCheckingHandle && (
                          <span className="text-[8px] font-mono text-gray-500 uppercase font-black animate-pulse">
                            Scanning Grid...
                          </span>
                        )}
                        {isCheckingHandle ? (
                          <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                        ) : handleStatus === "available" ? (
                          <Check className="w-5 h-5 text-emerald-400" />
                        ) : handleStatus === "taken" ? (
                          <AlertCircle className="w-5 h-5 text-rose-500" />
                        ) : null}
                      </div>
                    </div>

                    {(handleStatus === "taken" && (
                      <p className="text-[10px] font-mono text-rose-400 font-bold uppercase tracking-wider">
                        This handle is already claimed by another connoisseur.
                      </p>
                    )) ||
                      (handleStatus === "available" && (
                        <p className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                          Handle looks clean. Ready for migration.
                        </p>
                      ))}

                    <button
                      onClick={handleSaveAccount}
                      disabled={
                        handleStatus === "taken" ||
                        newHandle === currentUser?.handle ||
                        isProcessing
                      }
                      className="w-full py-4 bg-emerald-500/10 hover:bg-emerald-500 border border-emerald-500/30 text-emerald-400 hover:text-emerald-950 rounded-2xl font-display font-black uppercase tracking-widest text-sm transition-all shadow-xl hover:shadow-emerald-500/20 disabled:opacity-30 disabled:hover:bg-emerald-500/10 disabled:hover:text-emerald-400 cursor-pointer flex items-center justify-center gap-3 overflow-hidden relative"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          <span>Migrating Identity...</span>
                        </>
                      ) : (
                        "Process Identity Change"
                      )}

                      {isProcessing && (
                        <motion.div
                          initial={{ x: "-100%" }}
                          animate={{ x: "100%" }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="absolute inset-0 bg-white/20 skew-x-[-20deg]"
                        />
                      )}
                    </button>
                  </div>

                  <div className="pt-8 border-t border-white/5 space-y-6 text-left">
                    <label className="text-[10px] font-mono text-gray-500 font-black uppercase tracking-[0.2em] block">
                      Danger Zone
                    </label>
                    <div className="p-6 bg-rose-500/5 border border-rose-500/10 rounded-2xl flex items-center justify-between gap-4">
                      <div>
                        <h4 className="text-white font-display font-bold text-base">
                          Terminate Membership
                        </h4>
                        <p className="text-xs text-gray-500 font-sans mt-1">
                          Erase your stash, mix history, and membership ID
                          permanently.
                        </p>
                      </div>
                      <button className="px-4 py-2.5 bg-rose-500/20 hover:bg-rose-500 text-rose-400 hover:text-white rounded-xl font-mono text-[10px] font-black uppercase tracking-widest border border-rose-500/20 transition-all cursor-pointer">
                        Deactivate
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Theme Settings */}
              {activeTab === "theme" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-4 text-left">
                    <label className="text-[10px] font-mono text-emerald-400 font-black uppercase tracking-[0.2em] block">
                      Display Mode
                    </label>
                    <div className="flex gap-4">
                      {[
                        { id: "dark", label: "Dark Mode", icon: Moon },
                        { id: "light", label: "Light Mode", icon: Sun },
                      ].map((mode) => {
                        const Icon = mode.icon;
                        return (
                          <button
                            key={mode.id}
                            onClick={() => saveMode(mode.id)}
                            className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                              appearanceMode === mode.id
                                ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                                : "bg-black/40 border-white/5 text-gray-400 hover:border-white/20"
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                            <span className="font-display font-bold text-sm uppercase tracking-tight">
                              {mode.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-4 text-left pt-6 border-t border-white/5">
                    <label className="text-[10px] font-mono text-emerald-400 font-black uppercase tracking-[0.2em] block">
                      Interface Chroma
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        {
                          id: "emerald",
                          label: "Emerald",
                          color: "bg-emerald-500",
                        },
                        {
                          id: "violet",
                          label: "Violet Nebula",
                          color: "bg-violet-500",
                        },
                        {
                          id: "amber",
                          label: "Amber Sunset",
                          color: "bg-amber-500",
                        },
                        {
                          id: "cobalt",
                          label: "Cobalt Frost",
                          color: "bg-sky-500",
                        },
                      ].map((theme) => (
                        <button
                          key={theme.id}
                          onClick={() => saveTheme(theme.id)}
                          className={`group relative aspect-square p-2 bg-black/40 border-2 rounded-2xl transition-all ${
                            selectedTheme === theme.id
                              ? "border-emerald-500 scale-105 shadow-2xl shadow-emerald-500/20"
                              : "border-white/5 hover:border-white/20"
                          }`}
                        >
                          <div
                            className={`w-full h-full rounded-xl ${theme.color} opacity-40 group-hover:opacity-60 transition-opacity`}
                          />
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center">
                            <span className="text-[10px] font-mono text-white font-black uppercase tracking-widest">
                              {theme.label}
                            </span>
                          </div>
                          {selectedTheme === theme.id && (
                            <div className="absolute -top-2 -right-2 bg-emerald-500 p-1.5 rounded-full border-2 border-[#0a0f0d] shadow-lg">
                              <Check className="w-3 h-3 text-emerald-950" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6 pt-8 border-t border-white/5 text-left">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/5 rounded-lg text-gray-400">
                          <Eye className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-white font-display font-bold text-sm">
                            Glass Morphism
                          </h4>
                          <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider mt-0.5">
                            High Intensity Refraction
                          </p>
                        </div>
                      </div>
                      <div className="w-12 h-6 bg-emerald-500 rounded-full relative cursor-pointer shadow-inner">
                        <div className="absolute right-1 top-1 bottom-1 w-4 bg-white rounded-full transition-all" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Settings */}
              {activeTab === "privacy" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-4 text-left">
                    <label className="text-[10px] font-mono text-sky-400 font-black uppercase tracking-[0.2em] block">
                      Profile Discovery
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                      {[
                        {
                          id: "public",
                          label: "Public Broadcast",
                          icon: Globe,
                          desc: "Visible to all members of the digital collective.",
                        },
                        {
                          id: "buddies",
                          label: "Buddies Only",
                          icon: Users,
                          desc: "Only confirmed research associates can view your logs.",
                        },
                        {
                          id: "private",
                          label: "Stealth Mode",
                          icon: Lock,
                          desc: "Profile is hidden. Ghost protocol engaged.",
                        },
                      ].map((mode) => {
                        const Icon = mode.icon;
                        return (
                          <button
                            key={mode.id}
                            onClick={() => setProfileVisibility(mode.id as any)}
                            className={`flex items-center gap-4 p-5 rounded-2xl border transition-all text-left group ${
                              profileVisibility === mode.id
                                ? "bg-sky-500/10 border-sky-500/30"
                                : "bg-black/40 border-white/5 hover:border-white/10"
                            }`}
                          >
                            <div
                              className={`p-3 rounded-xl transition-colors ${profileVisibility === mode.id ? "bg-sky-500 text-sky-950" : "bg-white/5 text-gray-500 group-hover:text-white"}`}
                            >
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-white font-display font-bold text-sm uppercase tracking-tight">
                                {mode.label}
                              </h4>
                              <p className="text-[10px] text-gray-500 font-mono mt-1 font-bold uppercase tracking-widest">
                                {mode.desc}
                              </p>
                            </div>
                            {profileVisibility === mode.id && (
                              <Check className="w-5 h-5 text-sky-400" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-6 pt-8 border-t border-white/5 text-left">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h4 className="text-white font-display font-bold text-sm">
                          Online Status Pulse
                        </h4>
                        <p className="text-[10px] text-gray-500 font-mono uppercase font-bold">
                          Broadcast when you're in the lounge
                        </p>
                      </div>
                      <button
                        onClick={() => setShowOnlineStatus(!showOnlineStatus)}
                        className={`w-12 h-6 rounded-full relative transition-all ${showOnlineStatus ? "bg-emerald-500" : "bg-white/10"}`}
                      >
                        <motion.div
                          animate={{ x: showOnlineStatus ? 24 : 4 }}
                          className="absolute top-1 bottom-1 w-4 bg-white rounded-full"
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h4 className="text-white font-display font-bold text-sm">
                          Expose Stash Drawer
                        </h4>
                        <p className="text-[10px] text-gray-500 font-mono uppercase font-bold">
                          Share your custom mixes publicly
                        </p>
                      </div>
                      <button
                        onClick={() => setShowStash(!showStash)}
                        className={`w-12 h-6 rounded-full relative transition-all ${showStash ? "bg-emerald-500" : "bg-white/10"}`}
                      >
                        <motion.div
                          animate={{ x: showStash ? 24 : 4 }}
                          className="absolute top-1 bottom-1 w-4 bg-white rounded-full"
                        />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={savePrivacy}
                    className="w-full py-4 bg-sky-500/10 hover:bg-sky-500 border border-sky-500/30 text-sky-400 hover:text-sky-950 rounded-2xl font-display font-black uppercase tracking-widest text-sm transition-all shadow-xl hover:shadow-sky-500/20 cursor-pointer"
                  >
                    Lock In Privacy Config
                  </button>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === "security" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-6 text-left">
                    <div className="p-6 bg-black/40 border border-white/5 rounded-3xl space-y-4">
                      <div className="flex items-center gap-3">
                        <Lock className="w-5 h-5 text-amber-400" />
                        <h4 className="text-white font-display font-bold text-base">
                          Two-Factor Authentication
                        </h4>
                      </div>
                      <div className="flex items-center justify-between gap-4 p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
                        <p className="text-xs text-gray-400 font-sans">
                          Level up your account defense with 2FA protocol.
                        </p>
                        <button
                          onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                          className={`w-12 h-6 rounded-full relative transition-all ${twoFactorEnabled ? "bg-amber-500" : "bg-white/10"}`}
                        >
                          <motion.div
                            animate={{ x: twoFactorEnabled ? 24 : 4 }}
                            className="absolute top-1 bottom-1 w-4 bg-white rounded-full"
                          />
                        </button>
                      </div>
                    </div>

                    <div className="p-6 bg-black/40 border border-white/5 rounded-3xl space-y-4">
                      <div className="flex items-center gap-3">
                        <Monitor className="w-5 h-5 text-[#b87333]" />
                        <h4 className="text-white font-display font-bold text-base">
                          Active Sessions
                        </h4>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold uppercase">
                              This Device
                            </span>
                            <span className="text-xs text-gray-300 font-sans">
                              AI Studio Preview • Asia-SE1
                            </span>
                          </div>
                          <span className="text-[8px] font-mono text-gray-500 font-black uppercase">
                            Active Now
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={saveSecurity}
                    className="w-full py-4 bg-amber-600/10 hover:bg-amber-600 border border-amber-600/30 text-amber-500 hover:text-amber-950 rounded-2xl font-display font-black uppercase tracking-widest text-sm transition-all shadow-xl hover:shadow-amber-600/20 cursor-pointer"
                  >
                    Apply Security Overrides
                  </button>
                </div>
              )}
            </div>

            {/* Notification Overlay */}
            <AnimatePresence>
              {notification && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  className="absolute bottom-12 left-1/2 -translate-x-1/2 z-[310] px-6 py-3 bg-emerald-500 text-emerald-950 rounded-full font-sans font-black text-xs shadow-2xl flex items-center gap-2 border border-black/10"
                >
                  <Sparkles className="w-4 h-4" />
                  {notification}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
