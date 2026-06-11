import React, { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { motion, AnimatePresence } from "motion/react";

// Types & Data
import { Strain } from "./types";
import {
  STRAINS_DATA,
  INITIAL_POSTS,
  INITIAL_MESSAGES,
} from "./data";
import { pageTurnVariants } from "./utils/ui";

// Subcomponents
import { useAuthStore } from "./stores/authStore";
import { authService } from "./services/authService";
import ParticleCanvas from "./components/ParticleCanvas";
import RegistrationModal from "./components/RegistrationModal";
import AIBudtender from "./components/AIBudtender";
import Inbox from "./components/Inbox";
import ViewProfileModal from "./components/ViewProfileModal";
import TopNav from "./components/TopNav";
import MobileMenu from "./components/MobileMenu";
import HeroSection from "./components/HeroSection";
import LiveTicker from "./components/LiveTicker";
import AppBackground from "./components/AppBackground";
import ActionButtons from "./components/ActionButtons";
import NotificationToast from "./components/NotificationToast";
import { ErrorBoundary } from "react-error-boundary";
import { GlobalErrorFallback } from "./components/GlobalErrorFallback";

// Lazy-loaded routes for performance optimization
const ChemicalSimulator = React.lazy(() => import("./components/ChemicalSimulator"));
const StrainExplorer = React.lazy(() => import("./components/StrainExplorer"));
const MoodRatioEngine = React.lazy(() => import("./components/MoodRatioEngine"));
const CommunityFeed = React.lazy(() => import("./components/CommunityFeed"));
const LiveLounges = React.lazy(() => import("./components/LiveLounges"));
const MyStash = React.lazy(() => import("./components/MyStash"));
const ScienceView = React.lazy(() => import("./components/ScienceView"));

// Loading fallback for Suspense
const LoadingFallback = () => (
  <div className="w-full h-full flex flex-col items-center justify-center p-12 text-[var(--text-muted)] animate-pulse">
    <div className="w-12 h-12 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin mb-4"></div>
    <p className="font-mono text-sm tracking-widest uppercase">Loading Module...</p>
  </div>
);
  const [selectedStrain, setSelectedStrain] = useState<Strain>(STRAINS_DATA[0]);
  const [activeSection, setActiveSection] = useState<
    | "home"
    | "directory"
    | "simulator"
    | "science"
    | "mood"
    | "community"
    | "live"
    | "profile"
    | "inbox"
  >("home");
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBudtenderOpen, setIsBudtenderOpen] = useState(false);
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [selectedProfileHandle, setSelectedProfileHandle] = useState<
    string | null
  >(null);
  const [activeTargetInboxUser, setActiveTargetInboxUser] = useState<
    string | undefined
  >(undefined);
  const [activeToast, setActiveToast] = useState<{
    id: number;
    message: string;
  } | null>(null);

  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem("canna_theme");
      if (storedTheme) {
        document.documentElement.setAttribute("data-theme", storedTheme);
      }
      const storedMode = localStorage.getItem("canna_mode");
      if (storedMode) {
        document.documentElement.setAttribute("data-mode", storedMode);
      }
    } catch (e) {
      console.error("Diagnostic error: LocalStorage initialization failed.");
    }
  }, []);

  // Background Live Notification Engine
  const activeToastRef = useRef<{ id: number; message: string } | null>(null);
  activeToastRef.current = activeToast;

  useEffect(() => {
    const messages = [
      "Activity in Couchlock Corner: User404 just shared a new simulator blend layout",
      "Lounge Alert: TerpeneMaster is hosting a live vibe check in The Garden",
      "Science Circle: Research Associate shared a new study on Myrcene synergy",
      "Social Pulse: 5 peers just joined the High Sierra lounge",
      "Circle Note: Someone just passed a vibe on your recent stash showcase",
    ];

    const interval = setInterval(() => {
      if (!activeToastRef.current) {
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
        setActiveToast({ id: Date.now() + Math.random(), message: randomMsg });
      }
    }, 28000); // 28 seconds

    return () => clearInterval(interval);
  }, []); // stable - no deps needed; reads activeToast via ref

  // Authentication states
  const { user: currentUser, isAuthenticated: isLoggedIn, setUser, setLoading } = useAuthStore();

  useEffect(() => {
    let mounted = true;
    authService.fetchMe()
      .then((user) => mounted && setUser(user))
      .catch(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [setUser, setLoading]);

  const handleLoginSuccess = (handleName: string) => {
    // In our new flow, user is already set in the modal by calling setUser.
    // So this might just be a notification trigger now or we just leave it for legacy compatibility
    // with local component state logic.
    if (!currentUser && handleName) {
      setUser({ username: handleName });
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (err) {
      console.error("Diagnostic error: Failed to clear auth from server.");
      setUser(null);
    }
  };

  // Global custom mixes state synced with localStorage for live updates across simulator & stash profile
  const [customMixes, setCustomMixes] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem("canna_custom_mixes");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const handleAddCustomMixFromApp = (newMix: any) => {
    setCustomMixes((prev) => {
      // In case the list already contains it, skip duplicate
      if (prev.some((m) => m.id === newMix.id)) return prev;
      const updated = [newMix, ...prev];
      try {
        localStorage.setItem("canna_custom_mixes", JSON.stringify(updated));
      } catch (err) {
        console.error(
          "Diagnostic error: Unable to commit custom mix payload to local store.",
        );
      }
      return updated;
    });
  };

  const handleDeleteMixFromApp = (id: string) => {
    setCustomMixes((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      try {
        localStorage.setItem("canna_custom_mixes", JSON.stringify(updated));
      } catch (err) {
        console.error(
          "Diagnostic error: Unable to persist deletion of custom mix.",
        );
      }
      return updated;
    });
  };

  // Global connection state layer: "Research Associates" (Friends) & "Pending Invites" (Friend Requests)
  const [researchAssociates, setResearchAssociates] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("canna_associates");
      return stored ? JSON.parse(stored) : ["Botanist_Jane"];
    } catch {
      return ["Botanist_Jane"];
    }
  });

  const [pendingInvites, setPendingInvites] = useState<
    { user: string; direction: "incoming" | "outgoing" }[]
  >(() => {
    try {
      const stored = localStorage.getItem("canna_pending_invites");
      return stored
        ? JSON.parse(stored)
        : [{ user: "GreenHealer", direction: "incoming" }];
    } catch {
      return [{ user: "GreenHealer", direction: "incoming" }];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        "canna_associates",
        JSON.stringify(researchAssociates),
      );
    } catch (e) {
      console.error("Diagnostic error: Failed to sync research associates.");
    }
  }, [researchAssociates]);

  useEffect(() => {
    try {
      localStorage.setItem(
        "canna_pending_invites",
        JSON.stringify(pendingInvites),
      );
    } catch (e) {
      console.error("Diagnostic error: Failed to sync pending requests.");
    }
  }, [pendingInvites]);

  // Global Private Messages state synced with localStorage
  const [directMessages, setDirectMessages] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem("canna_direct_messages");
      if (stored) return JSON.parse(stored);
      return INITIAL_MESSAGES.map((m) => ({
        ...m,
        receiver: currentUser?.handle || "Current_Explorist",
      }));
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        "canna_direct_messages",
        JSON.stringify(directMessages),
      );
    } catch (e) {
      console.error("Diagnostic error: Failed to update local message cache.");
    }
  }, [directMessages]);

  const dmSocketsRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    return () => {
      dmSocketsRef.current.forEach(clearTimeout);
    };
  }, []);

  const handleSendMessage = (receiver: string, text: string) => {
    const senderHandle = currentUser?.handle || "Current_Explorist";
    const newMsg = {
      id: `m-${Date.now() + Math.random()}`,
      sender: senderHandle,
      receiver,
      text,
      timestamp: new Date().toISOString(),
      isRead: true, // User's own sent messages are read
    };
    setDirectMessages((prev) => [...prev, newMsg]);

    // Simulated WebSocket Response Engine
    const tid = setTimeout(
      () => {
        const responses = [
          "Yo! Just saw this, checking out that custom simulator blend you shared now. Looks fire.",
          "That's a clean ratio, let me sync my dashboard sliders to match it real quick.",
          "Immaculate vibes on that last stash share. How's the terpene profile hitting?",
          "Just tapped into the same strain. The Pinene clarity is actually insane today.",
          "Copy that. Keeping the circle updated on our next live lounge session.",
        ];
        const randomResponse =
          responses[Math.floor(Math.random() * responses.length)];

        const socketReply = {
          id: `s-${Date.now() + Math.random()}`,
          sender: receiver,
          receiver: senderHandle,
          text: randomResponse,
          timestamp: new Date().toISOString(),
          isRead: false,
        };

        setDirectMessages((prev) => [...prev, socketReply]);

        // Trigger a light toast if inbox is closed
        if (!isInboxOpen) {
          setActiveToast({
            id: Date.now() + Math.random(),
            message: `Private message from ${receiver}`,
          });
        }
      },
      Math.floor(Math.random() * 2000) + 3000,
    ); // 3-5 seconds delay

    dmSocketsRef.current.push(tid);
  };

  const handleMarkAsRead = useCallback(
    (handle: string) => {
      setDirectMessages((prev) => {
        // Only execute state update if there are actual unread messages from this sender
        const hasUnread = prev.some(
          (m) =>
            m.sender === handle &&
            m.receiver === currentUser?.handle &&
            !m.isRead,
        );
        if (!hasUnread) return prev;
        return prev.map((m) =>
          m.sender === handle && m.receiver === currentUser?.handle
            ? { ...m, isRead: true }
            : m,
        );
      });
    },
    [currentUser?.handle],
  );

  const handleWaveHandBuddy = (buddyName: string) => {
    handleSendMessage(buddyName, "👋");
    setActiveTargetInboxUser(buddyName);
    setIsInboxOpen(true);
  };

  // Parallax pointer reference
  const containerRef = useRef<HTMLDivElement>(null);

  // Global Posts state synced with localStorage
  const [posts, setPosts] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem("canna_posts");
      if (stored) return JSON.parse(stored);
      return INITIAL_POSTS;
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("canna_posts", JSON.stringify(posts));
    } catch (e) {
      console.error(
        "Diagnostic error: Failed to commit active feed to local store.",
      );
    }
  }, [posts]);

  const handleShareToFeed = (content: string) => {
    const now = new Date();
    const newPost = {
      id: Date.now() + Math.random(),
      user: currentUser?.handle || "Current_Explorist",
      name: currentUser?.handle || "You",
      initials: (currentUser?.handle || "CE").substring(0, 2).toUpperCase(),
      color: "bg-emerald-500",
      timeAgo: "Just now",
      timestamp: `${now.toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric" })} - ${now.toLocaleString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })} UTC`,
      content,
      passCount: 0,
      replies: [],
      badge: {
        text: "Simulator Blends",
        style: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
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
    setPosts([newPost, ...posts]);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let ticker: number;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    // Direct interpolation style updates bypassing React cycle
    const updateParallax = () => {
      currentX += (targetX - currentX) * 0.085; // Damping/Spring coefficient
      currentY += (targetY - currentY) * 0.085;

      container.style.setProperty("--px-x", currentX.toFixed(4));
      container.style.setProperty("--px-y", currentY.toFixed(4));

      ticker = requestAnimationFrame(updateParallax);
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize coordinate metrics centered around zero: -0.5 to 0.5
      targetX = e.clientX / window.innerWidth - 0.5;
      targetY = e.clientY / window.innerHeight - 0.5;
    };

    window.addEventListener("mousemove", handleMouseMove);
    ticker = requestAnimationFrame(updateParallax);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(ticker);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="app-root-container"
      className="min-h-screen w-full relative flex items-center justify-center p-3 sm:p-4 md:p-8 bg-[var(--bg-main)] overflow-hidden select-none font-sans"
    >
      <AppBackground activeSection={activeSection} />

      {/* MAIN TRANSMEDIAL GLASS WRAPPER */}
      <main
        id="main-glass-envelope"
        className="w-full max-w-[1360px] min-h-[500px] sm:min-h-[760px] lg:min-h-[850px] bg-[#040806]/85 dark:bg-[#040806]/85 backdrop-blur-[36px] rounded-[32px] border border-emerald-500/20 shadow-[0_48px_96px_rgba(0,0,0,0.8)] ring-1 ring-emerald-500/10 overflow-hidden flex flex-col relative z-20 transition-all duration-500 ease-out p-1"
        style={{
          transform:
            "perspective(1200px) rotateY(calc(var(--px-x, 0) * 2.8deg)) rotateX(calc(var(--px-y, 0) * -2.8deg)) translate3d(calc(var(--px-x, 0) * 8px), calc(var(--px-y, 0) * 8px), 0px)",
        }}
      >
        {/* HTML5 Canvas Ambient gold dust inside glass wrapper */}
        <ParticleCanvas />

        <TopNav
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          isLoggedIn={isLoggedIn}
          currentUser={currentUser as any}
          handleLogout={handleLogout}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          setIsRegisterOpen={setIsRegisterOpen}
        />

        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          isLoggedIn={isLoggedIn}
          currentUser={currentUser as any}
          onLogout={handleLogout}
          onRegisterOpen={() => setIsRegisterOpen(true)}
        />

        {/* CONTAINER VIEW AREA */}
        <div
          id="content-viewport"
          style={{ perspective: "1500px", transformStyle: "preserve-3d" }}
          className="flex-1 w-full flex flex-col relative z-20 p-5 md:p-8 pt-6"
        >
          <AnimatePresence mode="wait">
            {activeSection === "home" && (
              <motion.div
                id="hero-root"
                key="home"
                variants={pageTurnVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full flex-1"
              >
                <HeroSection
                  selectedStrain={selectedStrain}
                  setSelectedStrain={setSelectedStrain}
                  setActiveSection={setActiveSection}
                />
              </motion.div>
            )}

            {activeSection === "directory" && (
              <motion.div
                id="directory-root"
                key="directory"
                variants={pageTurnVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{ backfaceVisibility: "hidden" }}
                className="w-full h-full flex-1"
              >
                <ErrorBoundary FallbackComponent={GlobalErrorFallback}>
                  <Suspense fallback={<LoadingFallback />}>
                    <StrainExplorer
                      selectedStrain={selectedStrain}
                      onSelectStrain={(s) => setSelectedStrain(s)}
                    />
                  </Suspense>
                </ErrorBoundary>
              </motion.div>
            )}

            {activeSection === "simulator" && (
              <motion.div
                id="simulator-root"
                key="simulator"
                variants={pageTurnVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{ backfaceVisibility: "hidden" }}
                className="w-full h-full flex-1"
              >
                <ErrorBoundary FallbackComponent={GlobalErrorFallback}>
                  <Suspense fallback={<LoadingFallback />}>
                    <ChemicalSimulator
                      onSaveMix={handleAddCustomMixFromApp}
                      onShareToFeed={handleShareToFeed}
                    />
                  </Suspense>
                </ErrorBoundary>
              </motion.div>
            )}

            {activeSection === "mood" && (
              <motion.div
                id="mood-deck"
                key="mood"
                variants={pageTurnVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{ backfaceVisibility: "hidden" }}
                className="w-full h-full flex-1"
              >
                <ErrorBoundary FallbackComponent={GlobalErrorFallback}>
                  <Suspense fallback={<LoadingFallback />}>
                    <MoodRatioEngine />
                  </Suspense>
                </ErrorBoundary>
              </motion.div>
            )}

            {activeSection === "community" && (
              <motion.div
                id="community-deck"
                key="community"
                variants={pageTurnVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{ backfaceVisibility: "hidden" }}
                className="w-full h-full flex-1"
              >
                <ErrorBoundary FallbackComponent={GlobalErrorFallback}>
                  <Suspense fallback={<LoadingFallback />}>
                    <CommunityFeed
                      posts={posts}
                      setPosts={setPosts}
                      researchAssociates={researchAssociates}
                      setResearchAssociates={setResearchAssociates}
                      pendingInvites={pendingInvites}
                      setPendingInvites={setPendingInvites}
                      onViewProfile={setSelectedProfileHandle}
                    />
                  </Suspense>
                </ErrorBoundary>
              </motion.div>
            )}

            {activeSection === "live" && (
              <motion.div
                id="live-deck"
                key="live"
                variants={pageTurnVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{ backfaceVisibility: "hidden" }}
                className="w-full h-full flex-1"
              >
                <ErrorBoundary FallbackComponent={GlobalErrorFallback}>
                  <Suspense fallback={<LoadingFallback />}>
                    <LiveLounges onViewProfile={setSelectedProfileHandle} />
                  </Suspense>
                </ErrorBoundary>
              </motion.div>
            )}

            {activeSection === "science" && (
              <motion.div
                id="science-root"
                key="science"
                variants={pageTurnVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full h-full flex-1"
              >
                <ErrorBoundary FallbackComponent={GlobalErrorFallback}>
                  <Suspense fallback={<LoadingFallback />}>
                    <ScienceView onRegisterOpen={() => setIsRegisterOpen(true)} />
                  </Suspense>
                </ErrorBoundary>
              </motion.div>
            )}

            {activeSection === "profile" && (
              <motion.div
                id="profile-deck"
                key="profile"
                variants={pageTurnVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{ backfaceVisibility: "hidden" }}
                className="w-full h-full flex-1"
              >
                <ErrorBoundary FallbackComponent={GlobalErrorFallback}>
                  <Suspense fallback={<LoadingFallback />}>
                    <MyStash
                      researchAssociates={researchAssociates}
                      setResearchAssociates={setResearchAssociates}
                      customMixes={customMixes}
                      onDeleteMix={handleDeleteMixFromApp}
                      currentUser={currentUser as any}
                      onWaveHand={handleWaveHandBuddy}
                      onViewProfile={setSelectedProfileHandle}
                      onUpdateUser={(newUser: any) => handleLoginSuccess(newUser.handle || newUser.username)}
                    />
                  </Suspense>
                </ErrorBoundary>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <LiveTicker />

        {/* BOTTOM METADATA/CREDIT STRIP */}
        <footer
          id="system-bar"
          className="w-full px-6 py-[18px] border-t border-[var(--border-subtle)] flex flex-col sm:flex-row justify-between items-center gap-3 text-[10px] font-mono text-[var(--text-muted)] bg-[var(--bg-surface-elevated)] backdrop-blur-sm relative z-30"
        >
          <span className="text-center sm:text-left leading-relaxed">
            © 2026 CannaBase Lounge. Your cozy digital smoke bubble.
          </span>
          <div className="flex flex-wrap gap-x-4 gap-y-2 items-center justify-center">
            <span className="text-[var(--text-muted)] font-bold">
              GOOD VIBES ONLY • SHARING IS CARING
            </span>
            <span className="text-emerald-500 dark:text-emerald-400 uppercase tracking-widest font-bold">
              ● CURED AND TRIPLE FILTERED
            </span>
          </div>
        </footer>
      </main>

      {/* REGISTRATION MODAL */}
      <RegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Action Cluster (Bottom Right) */}
      <ActionButtons
        isMobileMenuOpen={isMobileMenuOpen}
        onInboxOpen={() => setIsInboxOpen(true)}
        onBudtenderToggle={() => setIsBudtenderOpen(!isBudtenderOpen)}
        hasUnreadMessages={directMessages.some(
          (m) =>
            !m.isRead &&
            m.receiver === (currentUser?.handle || "Current_Explorist"),
        )}
      />

      {/* Global Inbox Overlay Modal */}
      <AnimatePresence>
        {isInboxOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-2 sm:p-4 md:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsInboxOpen(false)}
              className="absolute inset-0 bg-black/65 backdrop-blur-md"
              transition={{ duration: 0.3 }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-full max-w-5xl h-[88vh] md:h-[80vh]"
            >
              <Inbox
                messages={directMessages}
                currentUserHandle={currentUser?.handle || "Current_Explorist"}
                onSendMessage={handleSendMessage}
                activeTargetUser={activeTargetInboxUser}
                onViewProfile={setSelectedProfileHandle}
                onClose={() => setIsInboxOpen(false)}
                onMarkAsRead={handleMarkAsRead}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global User Profile Modal */}
      <AnimatePresence>
        {selectedProfileHandle && (
          <ViewProfileModal
            handle={selectedProfileHandle}
            onClose={() => setSelectedProfileHandle(null)}
            isFriend={researchAssociates.includes(selectedProfileHandle)}
            onToggleFriend={() => {
              if (researchAssociates.includes(selectedProfileHandle)) {
                setResearchAssociates((prev) =>
                  prev.filter((h) => h !== selectedProfileHandle),
                );
              } else {
                setResearchAssociates((prev) => [
                  ...prev,
                  selectedProfileHandle,
                ]);
              }
            }}
            onSendMessage={() => {
              setActiveTargetInboxUser(selectedProfileHandle);
              setIsInboxOpen(true);
              setSelectedProfileHandle(null);
            }}
          />
        )}
      </AnimatePresence>

      <NotificationToast
        toast={activeToast}
        onClose={() => setActiveToast(null)}
        onClick={() => {
          setActiveSection("live");
          setActiveToast(null);
        }}
      />

      {/* Interactive AI Budtender Conversational Drawer */}
      <AIBudtender
        isOpen={isBudtenderOpen}
        onClose={() => setIsBudtenderOpen(false)}
      />
    </div>
  );
}
