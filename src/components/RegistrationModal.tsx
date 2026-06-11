import React, { useState, useEffect } from "react";
import { X, User, ShieldAlert, Lock, Flame } from "lucide-react";
import { authService } from "../services/authService";
import { useAuthStore } from "../stores/authStore";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (handle: string) => void;
}

export default function RegistrationModal({
  isOpen,
  onClose,
  onLoginSuccess,
}: RegistrationModalProps) {
  const [tab, setTab] = useState<"register" | "login">("register");
  const [handle, setHandle] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [favoriteVibe, setFavoriteVibe] = useState("Chill Couch Lock");

  // Loading & Simulating states
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authStageText, setAuthStageText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const authIntervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const setUser = useAuthStore((state) => state.setUser);

  // Must be before early return — Rules of Hooks
  useEffect(() => {
    return () => {
      if (authIntervalRef.current) clearInterval(authIntervalRef.current);
    };
  }, []);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!handle.trim()) {
      setErrorMsg("Please provide a smoke handle name to join the circle. ");
      return;
    }
    if (!passphrase.trim()) {
      setErrorMsg("A secret passphrase is required for stash security. ");
      return;
    }

    setIsAuthenticating(true);
    setAuthStageText("Authenticating botanical ID... ");

    try {
      if (tab === "register") {
        const res = await authService.register(handle, passphrase);
        setUser(res.user);
      } else {
        const res = await authService.login(handle, passphrase);
        setUser(res.user);
      }

      onLoginSuccess(handle);
      setHandle("");
      setPassphrase("");
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "Authentication failed. Try again.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div
      id="registration-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-all duration-300"
      onClick={onClose}
    >
      <div
        id="registration-modal-container"
        className="w-full max-w-lg bg-[#0a0f0d] border-2 border-emerald-500/40 rounded-[28px] overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.25)] relative p-1 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative background glow rings */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />

        {/* Close Button */}
        <button
          id="btn-close-modal"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200 z-10"
          title="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {isAuthenticating ? (
          /* AUTHENTICATING SEQUENCE SCREEN */
          <div
            id="auth-loading-screen"
            className="p-8 md:p-12 text-center flex flex-col items-center justify-center min-h-[380px] space-y-6"
          >
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin" />
              <Flame className="w-6 h-6 text-emerald-400 absolute inset-0 m-auto animate-pulse" />
            </div>
            <div className="space-y-2">
              <h4 className="text-xl font-display font-black text-white uppercase tracking-tight">
                Accessing Circle...
              </h4>
              <p className="text-sm text-emerald-400 font-mono font-medium animate-pulse">
                {authStageText}
              </p>
            </div>
          </div>
        ) : (
          /* ACTIVE FORMS SCREEN */
          <div className="p-6 md:p-8 space-y-6 relative rounded-[22px] bg-gradient-to-b from-[#0a0f0d] via-[#0a0f0d] to-[#0a0f0d] backdrop-blur-[4px]">
            {/* Header branding / message */}
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 bg-emerald-950/50 border border-emerald-500/30 rounded-2xl text-emerald-400 mb-1">
                <Flame className="w-6 h-6 text-emerald-400 animate-pulse" />
              </div>
              <h3
                id="modal-heading"
                className="font-display text-2xl md:text-3xl font-black tracking-tight text-white uppercase"
              >
                {tab === "register"
                  ? "Grab Your Seat in the Circle"
                  : "Slide Back in to the Circle"}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed max-w-sm mx-auto">
                {tab === "register"
                  ? "Unlock customized strain mixes, global entourage telemetry, and sync with fellow research associates. "
                  : "Welcome back! Enter your smoke credentials to secure your custom stash box. "}
              </p>
            </div>

            {/* TAB SWITCHER */}
            <div className="flex bg-black/60 rounded-xl p-1 border border-white/10 transition-all duration-300">
              <button
                type="button"
                className={`w-1/2 py-2.5 text-xs font-mono font-bold tracking-wider uppercase rounded-lg transition-all ${
                  tab === "register"
                    ? "bg-emerald-500 text-black shadow-lg"
                    : "text-gray-400 hover:text-white"
                }`}
                onClick={() => setTab("register")}
              >
                Registration
              </button>
              <button
                type="button"
                className={`w-1/2 py-2.5 text-xs font-mono font-bold tracking-wider uppercase rounded-lg transition-all ${
                  tab === "login"
                    ? "bg-emerald-500 text-black shadow-lg"
                    : "text-gray-400 hover:text-white"
                }`}
                onClick={() => setTab("login")}
              >
                Lounge Entry
              </button>
            </div>

            {/* Error Message Indicator */}
            {errorMsg && (
              <div className="bg-rose-950/60 border border-rose-500/30 text-rose-200 text-xs px-4 py-3 rounded-xl flex items-center gap-3 font-mono">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form
              id="botanical-id-form"
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Smoke Handle field */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono tracking-widest text-[#b87333] uppercase block font-bold">
                  Choose Your Smoke Handle
                </label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 group-focus-within:text-emerald-400 transition-colors gap-2">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    id="input-handle"
                    type="text"
                    required
                    placeholder="e.g., TerpeneMaster"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:bg-black/60 transition-all"
                  />
                </div>
              </div>

              {/* Secret Passphrase field */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono tracking-widest text-[#b87333] uppercase block font-bold">
                  Secret Passphrase
                </label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 group-focus-within:text-emerald-400 transition-colors gap-2">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    id="input-passphrase"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={passphrase}
                    onChange={(e) => setPassphrase(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:bg-black/60 transition-all"
                  />
                </div>
              </div>

              {/* Smoke Preference field - Registration Only */}
              {tab === "register" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-mono tracking-widest text-[#b87333] uppercase block font-bold">
                    Primary Lounge Vibe
                  </label>
                  <select
                    id="select-interest"
                    value={favoriteVibe}
                    onChange={(e) => setFavoriteVibe(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 cursor-pointer"
                  >
                    <option value="Chill Couch Lock" className="bg-[#060c09]">
                      Chill Couch Lock (Deep Indica relax){" "}
                    </option>
                    <option value="Cerebral Artist" className="bg-[#060c09]">
                      Cerebral Artist (Interactive Sativa)
                    </option>
                    <option value="Productive Scholar" className="bg-[#060c09]">
                      Productive Scholar (Balanced hybrid)
                    </option>
                    <option value="Cosmic Explorer" className="bg-[#060c09]">
                      Cosmic Explorer (High Terpene/Pinene)
                    </option>
                  </select>
                </div>
              )}

              <button
                id="btn-submit-registration"
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-display font-black text-sm py-4 rounded-xl shadow-lg shadow-emerald-500/20 transition-all duration-300 cursor-pointer text-center block uppercase tracking-widest"
              >
                {tab === "register" ? "Join the Circle" : "Enter Circle"}
              </button>

              <p className="text-[10px] text-gray-500 text-center font-mono uppercase tracking-widest block font-medium">
                Syncing Stash Network • Virtual Vibe Checked
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
