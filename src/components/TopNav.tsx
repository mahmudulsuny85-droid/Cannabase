import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Menu, X, Sun, Moon } from "lucide-react";

interface TopNavProps {
  activeSection: string;
  setActiveSection: (section: any) => void;
  isLoggedIn: boolean;
  currentUser: { handle: string } | null;
  handleLogout: () => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  setIsRegisterOpen: (open: boolean) => void;
}

export default function TopNav({
  activeSection,
  setActiveSection,
  isLoggedIn,
  currentUser,
  handleLogout,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  setIsRegisterOpen,
}: TopNavProps) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("canna_mode") || "dark";
    }
    return "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-mode", theme);
    localStorage.setItem("canna_mode", theme);
  }, [theme]);

  // Sync with external changes (e.g. SettingsModal changes the mode)
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "canna_mode" && e.newValue) {
        setTheme(e.newValue);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  const navLinks = [
    { id: "home", label: "The Lounge" },
    { id: "directory", label: "Strain Archive" },
    { id: "simulator", label: "Custom Mix Lab" },
    { id: "mood", label: "Mood Matcher" },
    { id: "community", label: "Smoking Circle" },
    { id: "live", label: "Live Lounges" },
    { id: "science", label: "Terpene & ECS Info" },
    { id: "profile", label: "My Stash" },
  ];

  return (
    <header
      id="top-navbar"
      className="w-full px-6 py-5 md:py-6 flex flex-col gap-5 border-b border-white/5 relative z-50 bg-[#090e0c]/40 backdrop-blur-md rounded-t-[32px] md:rounded-t-[40px]"
    >
      {/* Top row: Logo brand & Register CTA / Mobile hamburger */}
      <div className="flex items-center justify-between w-full">
        {/* Logo brand */}
        <div
          id="brand-logo"
          onClick={() => setActiveSection("home")}
          className="flex items-center gap-2.5 cursor-pointer group active:scale-95 transition-transform"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#b87333] to-[#ffd700] p-[2.5px] shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-[#0a0c0b] rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4.5 h-4.5 text-emerald-400 animate-pulse"
              >
                <path d="M7 20s0 -2 1 -3.5c-1.5 0 -2 -.5 -4 -1.5c0 0 1.839 -1.38 5 -1c-1.789 -.97 -3.279 -2.03 -5 -6c0 0 3.98 -.3 6.5 3.5c-2.284 -4.9 1.5 -9.5 1.5 -9.5c2.734 5.47 2.389 7.5 1.5 9.5c2.531 -3.77 6.5 -3.5 6.5 -3.5c-1.721 3.97 -3.211 5.03 -5 6c3.161 -.38 5 1 5 1c-2 1 -2.5 1.5 -4 1.5c1 1.5 1 3.5 1 3.5c-2 0 -4.438 -2.22 -5 -3c-.563 .78 -3 3 -5 3" />
                <path d="M12 22v-5" />
              </svg>
            </div>
          </div>
          <div className="space-y-0 text-left">
            <span className="font-display text-lg md:text-xl font-black tracking-tight text-[var(--text-primary)] block leading-none">
              Canna<span className="text-[#b87333]">Base</span>
            </span>
            <span className="text-[7px] md:text-[9px] font-mono tracking-widest text-emerald-500 dark:text-emerald-400 font-bold uppercase block truncate">
              <span className="hidden sm:inline">Digital Smoke Lounge & </span>
              Vibe Guide
            </span>
          </div>
        </div>

        {/* Action CTAs right */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-white/5 border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/10 transition-all duration-300 cursor-pointer group"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "light" ? (
              <Sun className="w-5 h-5 group-hover:rotate-45 transition-transform duration-500" />
            ) : (
              <Moon className="w-5 h-5 group-hover:-rotate-12 transition-transform duration-500" />
            )}
          </button>

          {isLoggedIn && currentUser ? (
            <div className="hidden md:flex items-center gap-4">
              <span
                id="header-user-greeting"
                className="text-xs font-sans text-[var(--text-primary)] font-bold bg-emerald-500/10 hover:bg-emerald-500/20 px-4.5 py-2 border border-emerald-500/30 rounded-xl relative overflow-hidden transition-all duration-300"
              >
                Yo,{" "}
                <span className="text-[#b87333] dark:text-[#ffd700] font-black">
                  {currentUser.handle}
                </span>
                !
              </span>
              <button
                id="btn-nav-logout"
                onClick={handleLogout}
                className="text-[11px] font-mono font-black tracking-wider text-rose-400 hover:text-rose-300 hover:underline uppercase transition duration-200 cursor-pointer"
              >
                Log Out
              </button>
            </div>
          ) : (
            <button
              id="btn-nav-register"
              onClick={() => setIsRegisterOpen(true)}
              className="hidden md:block px-6 py-2.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-emerald-950 border border-emerald-500/20 hover:border-emerald-500 rounded-full font-mono text-[11px] font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer shadow-lg hover:shadow-emerald-500/20"
            >
              Join the Lounge
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            id="mobile-menu-trigger"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2.5 rounded-xl transition-all duration-300 relative z-[100] ${
              isMobileMenuOpen
                ? "bg-emerald-500 text-emerald-950 shadow-[0_0_25px_rgba(16,185,129,0.5)]"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 stroke-[3]" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Separate Desktop Navigation Links Block with breathing room */}
      <div className="hidden md:flex items-center justify-center w-full pt-2 border-t border-white/5 mt-1">
        <nav
          id="desktop-nav"
          className="flex flex-wrap items-center justify-center gap-x-9 gap-y-3 max-w-full"
        >
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                id={`btn-nav-${link.id}`}
                key={link.id}
                onClick={() => setActiveSection(link.id as any)}
                className={`text-xs font-mono uppercase tracking-widest relative py-1 px-1.5 cursor-pointer transition-all duration-300 ${
                  isActive
                    ? "text-emerald-300 font-extrabold text-glow-sm"
                    : "text-gray-400 font-semibold hover:text-white"
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#b87333] to-emerald-400"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
