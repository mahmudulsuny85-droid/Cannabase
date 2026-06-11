import { motion, AnimatePresence } from "motion/react";
import {
  X,
  MessageSquare,
  MapPin,
  Calendar,
  Award,
  Leaf,
  Check,
  Plus,
  Clock,
  UserMinus,
} from "lucide-react";

interface UserProfileModalProps {
  user: any;
  onClose: () => void;
  onMessage: (user: any) => void;
  researchAssociates?: string[];
  pendingInvites?: { user: string; direction: "incoming" | "outgoing" }[];
  onAddAssociate?: (username: string) => void;
  onAcceptAssociate?: (username: string) => void;
  onDeclineAssociate?: (username: string) => void;
  onRemoveAssociate?: (username: string) => void;
}

export default function UserProfileModal({
  user,
  onClose,
  onMessage,
  researchAssociates = [],
  pendingInvites = [],
  onAddAssociate,
  onAcceptAssociate,
  onDeclineAssociate,
  onRemoveAssociate,
}: UserProfileModalProps) {
  if (!user) return null;

  const username = user.user;
  const isMe =
    username === "Current_Explorist" || username === "CE" || !username;

  const isConnected = researchAssociates.includes(username);
  const pendingInvite = pendingInvites.find((inv) => inv.user === username);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg bg-[#0a0f0d] border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-emerald-900/20"
        >
          {/* Header Banner */}
          <div
            className={`h-32 w-full ${user.color || "bg-emerald-800"}/40 relative overflow-hidden`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f0d] to-transparent"></div>
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white/70 hover:text-white transition-colors border border-white/10 z-20"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="px-8 pb-8">
            <div className="flex justify-between items-end -mt-12 mb-6">
              <div
                className={`w-24 h-24 rounded-2xl ${user.color || "bg-emerald-600"} flex items-center justify-center border-4 border-[#0a0f0d] shadow-xl relative z-10`}
              >
                <span className="text-white font-bold font-display text-3xl">
                  {user.initials}
                </span>
              </div>
              <div className="flex gap-3 relative z-10 pb-2">
                <button
                  onClick={() => onMessage(user)}
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl font-bold font-sans text-sm transition-all flex items-center gap-2 border border-white/10 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  Message
                </button>
                {!isMe && (
                  <>
                    {isConnected ? (
                      <div className="flex gap-1.5 items-center">
                        <span className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 px-4 py-2.5 rounded-xl font-black font-sans text-sm flex items-center gap-1.5 shadow-md shadow-emerald-950/20">
                          <Check className="w-4 h-4" />
                          Smoke Buddy
                        </span>
                        <button
                          onClick={() => onRemoveAssociate?.(username)}
                          className="bg-rose-500/10 hover:bg-rose-500 hover:text-white text-rose-400 px-3 py-2.5 rounded-xl font-bold font-sans text-sm border border-rose-500/20 transition-all cursor-pointer flex items-center justify-center gap-1"
                          title="Remove Smoke Buddy"
                        >
                          <UserMinus className="w-4 h-4" />
                        </button>
                      </div>
                    ) : pendingInvite ? (
                      pendingInvite.direction === "outgoing" ? (
                        <button
                          disabled
                          className="bg-white/5 border border-white/10 text-gray-400 px-4 py-2.5 rounded-xl font-bold font-sans text-sm flex items-center gap-1.5 animate-pulse-slow"
                        >
                          <Clock className="w-4 h-4 text-amber-500" />
                          Invited
                        </button>
                      ) : (
                        <div className="flex gap-1.5 items-center">
                          <button
                            onClick={() => onAcceptAssociate?.(username)}
                            className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 px-4 py-2.5 rounded-xl font-black font-sans text-sm transition-colors shadow-lg shadow-emerald-500/20 cursor-pointer flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Accept
                          </button>
                          <button
                            onClick={() => onDeclineAssociate?.(username)}
                            className="bg-rose-500/20 hover:bg-rose-600 text-rose-400 hover:text-white px-3.5 py-2.5 rounded-xl font-bold font-sans text-sm border border-rose-500/30 transition-all cursor-pointer"
                          >
                            Decline
                          </button>
                        </div>
                      )
                    ) : (
                      <button
                        onClick={() => onAddAssociate?.(username)}
                        className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 px-4 py-2.5 rounded-xl font-bold font-sans text-sm transition-all shadow-lg shadow-emerald-500/20 cursor-pointer flex items-center gap-1"
                      >
                        <Plus className="w-4 h-4" />+ Smoke Buddy
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-display font-black text-white flex items-center gap-2">
                  {user.name || user.user}
                  {user.isVerified && (
                    <Leaf className="w-5 h-5 text-emerald-400" />
                  )}
                </h2>
                <div className="text-sm font-mono text-emerald-400 font-bold">
                  @
                  {user.user?.toLowerCase() ||
                    user.name?.toLowerCase().replace(" ", "")}
                </div>
              </div>

              <p className="text-base text-white/90 font-sans font-medium leading-relaxed">
                {user.bio ||
                  "Laid-back herb lover exploring clean strains and sharing good vibes with awesome friends."}
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2 text-sm font-sans font-medium text-gray-400">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  {user.location || "Global Collective"}
                </div>
                <div className="flex items-center gap-2 text-sm font-sans font-medium text-gray-400">
                  <Calendar className="w-4 h-4 text-emerald-500" />
                  Joined {user.joined || "March 2024"}
                </div>
                <div className="flex items-center gap-2 text-sm font-sans font-medium text-gray-400">
                  <Award className="w-4 h-4 text-emerald-500" />
                  {user.role || "Herb Connoisseur"}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
                <div className="text-center bg-white/5 rounded-xl py-3 border border-white/5">
                  <div className="text-xl font-bold font-mono text-white">
                    {user.stats?.posts || 42}
                  </div>
                  <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                    Session Logs
                  </div>
                </div>
                <div className="text-center bg-white/5 rounded-xl py-3 border border-white/5">
                  <div className="text-xl font-bold font-mono text-white">
                    {user.stats?.followers || "1.2k"}
                  </div>
                  <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                    Buddies
                  </div>
                </div>
                <div className="text-center bg-white/5 rounded-xl py-3 border border-white/5">
                  <div className="text-xl font-bold font-mono text-white">
                    {user.stats?.following || 384}
                  </div>
                  <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                    Following
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
