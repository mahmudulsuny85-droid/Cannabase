import { motion, AnimatePresence } from "motion/react";
import {
  Leaf,
  BookOpen,
  Palette,
  Smile,
  Users,
  Activity,
  Microscope,
  Bookmark,
  User,
} from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
  onSectionChange: (section: any) => void;
  isLoggedIn: boolean;
  currentUser: { handle: string } | null;
  onLogout: () => void;
  onRegisterOpen: () => void;
}

export default function MobileMenu({
  isOpen,
  onClose,
  activeSection,
  onSectionChange,
  isLoggedIn,
  currentUser,
  onLogout,
  onRegisterOpen,
}: MobileMenuProps) {
  const menuLinks = [
    { id: "home", label: "The Lounge", icon: <Leaf className="w-4 h-4" /> },
    {
      id: "directory",
      label: "Strain Archive",
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      id: "simulator",
      label: "Custom Mix Lab",
      icon: <Palette className="w-4 h-4" />,
    },
    { id: "mood", label: "Mood Matcher", icon: <Smile className="w-4 h-4" /> },
    {
      id: "community",
      label: "Smoking Circle",
      icon: <Users className="w-4 h-4" />,
    },
    {
      id: "live",
      label: "Live Lounges",
      icon: <Activity className="w-4 h-4" />,
    },
    {
      id: "science",
      label: "Terpene & ECS Info",
      icon: <Microscope className="w-4 h-4" />,
    },
    {
      id: "profile",
      label: "My Stash",
      icon: <Bookmark className="w-4 h-4" />,
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay for focus */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[35]"
          />

          <motion.div
            id="mobile-nav-drawer"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="md:hidden absolute top-0 inset-x-0 bg-[var(--bg-surface)] backdrop-blur-3xl border-b border-[var(--border-subtle)] z-[70] p-5 flex flex-col gap-4 shadow-2xl rounded-b-[40px] h-screen overflow-y-auto pt-24"
          >
            <div className="flex flex-col gap-2">
              {menuLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <button
                    id={`btn-mobile-nav-${link.id}`}
                    key={link.id}
                    onClick={() => {
                      onSectionChange(link.id as any);
                      onClose();
                    }}
                    className={`flex items-center gap-4 w-full text-left text-sm font-mono uppercase tracking-widest px-4 py-3.5 rounded-2xl transition-all ${
                      isActive
                        ? "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 font-black border border-emerald-500/20 shadow-inner"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <span
                      className={
                        isActive
                          ? "text-emerald-500 dark:text-emerald-400"
                          : "text-[var(--text-muted)]"
                      }
                    >
                      {link.icon}
                    </span>
                    {link.label}
                  </button>
                );
              })}
            </div>

            {isLoggedIn && currentUser ? (
              <div className="w-full flex flex-col gap-2.5 mt-3 pt-3 border-t border-[var(--border-subtle)]">
                <div className="flex items-center justify-center gap-3 px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                  <User className="w-4 h-4 text-[#b87333] dark:text-[#ffd700]" />
                  <span className="text-xs font-sans text-emerald-600 dark:text-emerald-400 font-extrabold uppercase tracking-wider">
                    Yo,{" "}
                    <span className="text-[#b87333] dark:text-[#ffd700]">
                      {currentUser.handle}
                    </span>
                    !
                  </span>
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="w-full py-3.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-450 font-mono font-black border border-rose-500/20 rounded-2xl text-center text-xs tracking-wider uppercase cursor-pointer"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <button
                id="btn-mobile-register"
                onClick={() => {
                  onRegisterOpen();
                  onClose();
                }}
                className="w-full py-4 bg-emerald-500 text-emerald-950 font-display font-black rounded-2xl text-center text-xs tracking-wider uppercase mt-3 cursor-pointer shadow-lg active:scale-[0.98] transition-all hover:bg-emerald-400 shadow-emerald-500/20"
              >
                Get Lounge Membership
              </button>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
