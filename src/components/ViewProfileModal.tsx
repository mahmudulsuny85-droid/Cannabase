import { useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  User,
  Heart,
  MessageSquare,
  Shield,
  Activity,
  Droplet,
  Star,
} from "lucide-react";

interface ViewProfileModalProps {
  handle: string;
  onClose: () => void;
  onSendMessage: () => void;
  isFriend: boolean;
  onToggleFriend: () => void;
}

export default function ViewProfileModal({
  handle,
  onClose,
  onSendMessage,
  isFriend,
  onToggleFriend,
}: ViewProfileModalProps) {
  // Derive stable "random" numbers from the handle string to avoid re-renders
  const stableNumbers = useMemo(() => {
    let seed = 0;
    for (let i = 0; i < handle.length; i++) seed += handle.charCodeAt(i);
    return {
      associatesCount: (seed % 200) + 50,
      stashCount: (seed % 40) + 10,
    };
  }, [handle]);

  // Mock data for profiles
  const profileData = {
    badge:
      handle.includes("Botanist") || handle.includes("Tech")
        ? "Master Blender"
        : "Lounge Regular",
    bio: `Passionate botanical enthusiast and regular at the CannaBase Lounge. Specializing in high-terpene synergy and clean-energy Sativa blends.`,
    associatesCount: stableNumbers.associatesCount,
    stashCount: stableNumbers.stashCount,
    sharedBlends: [
      {
        id: "1",
        name: "Midnight Chill",
        thc: 5,
        cbd: 25,
        terpeneName: "Myrcene",
      },
      {
        id: "2",
        name: "Morning Focus",
        thc: 18,
        cbd: 2,
        terpeneName: "Pinene",
      },
      {
        id: "3",
        name: "Creative Flow",
        thc: 12,
        cbd: 12,
        terpeneName: "Limonene",
      },
    ],
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-all"
        transition={{ duration: 0.4 }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        transition={{ type: "spring", damping: 25, stiffness: 200, mass: 0.8 }}
        className="relative w-full max-w-lg bg-[#0c1410] border border-white/10 rounded-[32px] overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.8)]"
      >
        {/* Header Decor */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-black/40 hover:bg-black/60 border border-white/10 rounded-full text-white/50 hover:text-white transition-all z-10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 space-y-8 relative">
          {/* Profile Identity */}
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-500/30 flex items-center justify-center shadow-2xl relative">
              <User className="w-12 h-12 text-emerald-400" />
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#0c1410] border border-white/10 flex items-center justify-center">
                <Star className="w-4 h-4 text-emerald-400 fill-emerald-400" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-black text-white tracking-tight">
                  {handle}
                </h2>
                <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 rounded text-[9px] font-mono font-black text-emerald-400 uppercase tracking-widest">
                  {profileData.badge}
                </span>
              </div>
              <div className="flex gap-4 text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold">
                <span>{profileData.associatesCount} Associates</span>
                <span>{profileData.stashCount} Stash Items</span>
              </div>
              <button
                onClick={onToggleFriend}
                className={`mt-2 flex items-center gap-2 px-4 py-1.5 rounded-lg border transition-all text-[10px] font-mono font-black uppercase tracking-widest cursor-pointer ${
                  isFriend
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Heart
                  className={`w-3.5 h-3.5 ${isFriend ? "fill-emerald-400" : ""}`}
                />
                {isFriend ? "IN YOUR CIRCLE" : "ADD TO CIRCLE"}
              </button>
            </div>
          </div>

          {/* Bio Section */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-mono font-black text-emerald-400 uppercase tracking-[0.2em]">
              Botanical Bio
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed font-sans font-medium">
              {profileData.bio}
            </p>
          </div>

          {/* Shared Blends Grid */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-mono font-black text-emerald-400 uppercase tracking-[0.2em]">
              Shared Lab Blends
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {profileData.sharedBlends.map((blend) => (
                <div
                  key={blend.id}
                  className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group hover:border-emerald-500/30 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center">
                      <Droplet className="w-5 h-5 text-[#b87333]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white uppercase tracking-wider">
                        {blend.name}
                      </h4>
                      <div className="flex items-center gap-2 text-[9px] font-mono font-bold text-gray-500 uppercase">
                        <span className="text-rose-400">T: {blend.thc}%</span>
                        <span className="text-emerald-400">
                          C: {blend.cbd}%
                        </span>
                        <span className="text-amber-400">
                          {blend.terpeneName}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Shield className="w-4 h-4 text-white/10 group-hover:text-emerald-500/40 transition-colors" />
                </div>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 flex gap-3">
            <button
              onClick={onSendMessage}
              className="flex-1 bg-white text-black py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-50 transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              SEND PRIVATE MESSAGE
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
