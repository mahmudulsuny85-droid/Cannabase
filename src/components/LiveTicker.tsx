import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Zap, Users, Flame, Headphones, Sparkles, Leaf } from "lucide-react";

const INITIAL_EVENTS = [
  {
    id: 1,
    type: "blend",
    text: "Botanist_Jane shared 'Midnight Focus' mix (+2.2% Pinene)",
    icon: <Sparkles className="w-3 h-3 text-emerald-400" />,
  },
  {
    id: 2,
    type: "lounge",
    text: "Couchlock Corner is now at 85% capacity",
    icon: <Users className="w-3 h-3 text-emerald-400" />,
  },
  {
    id: 3,
    type: "vibe",
    text: "TerpeneChaser passed a vibe to GreenHealer",
    icon: <Flame className="w-3 h-3 text-orange-400" />,
  },
  {
    id: 4,
    type: "music",
    text: "Lofi session starting in Creative Flow Lounge",
    icon: <Headphones className="w-3 h-3 text-blue-400" />,
  },
  {
    id: 5,
    type: "new",
    text: "3 new peers just entered the Digital Lounge",
    icon: <Zap className="w-3 h-3 text-yellow-400" />,
  },
];

export default function LiveTicker() {
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      // Update both events and activeIndex together to avoid stale closure
      setEvents((prevEvents) => {
        let nextEvents = prevEvents;

        // Occasionally add a new pseudo-random event
        if (Math.random() > 0.7) {
          const users = [
            "Cloud9",
            "PuffD",
            "GreenBud",
            "TerpeneKing",
            "LoungeQueen",
            "ZenCoder",
          ];
          const randomUser = users[Math.floor(Math.random() * users.length)];
          const possibleEvents = [
            `shared a new blend: '${randomUser}'s Special'`,
            `just entered the 'Daily Vibes' circle`,
            `is rolling up some Jack Herer in Lounge 2`,
            `dropped a 5-star review for Granddaddy Purple`,
            `is vibing to the lounge stream right now`,
          ];
          const newEvent = {
            id: Date.now() + Math.random(),
            type: "random",
            text: `${randomUser} ${possibleEvents[Math.floor(Math.random() * possibleEvents.length)]}`,
            icon: <Leaf className="w-3 h-3 text-emerald-500" />,
          };
          nextEvents = [newEvent, ...prevEvents.slice(0, 8)];
        }

        // Advance index safely using the up-to-date length
        setActiveIndex((prev) => (prev + 1) % nextEvents.length);
        return nextEvents;
      });
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute bottom-0 left-0 right-0 h-10 bg-[var(--bg-surface-elevated)] backdrop-blur-md border-t border-[var(--border-subtle)] px-6 flex items-center overflow-hidden z-[40]">
      <div className="flex items-center gap-3 shrink-0 mr-4 border-r border-[var(--border-regular)] pr-4">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        <span className="text-[10px] font-mono font-black text-emerald-400 dark:text-emerald-400 uppercase tracking-widest">
          Live Circle Pulse
        </span>
      </div>

      <div className="flex-1 relative h-full flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={events[activeIndex]?.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex items-center gap-2 text-[11px] font-sans font-semibold text-[var(--text-secondary)]"
          >
            {events[activeIndex]?.icon}
            <span className="truncate max-w-[80vw]">
              {events[activeIndex]?.text}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="hidden sm:flex items-center gap-6 ml-auto pl-4 border-l border-[var(--border-regular)] text-[9px] font-mono text-[var(--text-muted)]">
        <div className="flex items-center gap-2">
          <span className="w-1 h-1 rounded-full bg-emerald-500" />
          <span>SERVER: VIBE-LHR-01</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1 h-1 rounded-full bg-[#b87333]" />
          <span>UPTIME: 99.9%</span>
        </div>
        <div className="flex items-center gap-2">
          <span>
            {new Date().toISOString().split("T")[1].substring(0, 5)} UTC
          </span>
        </div>
      </div>
    </div>
  );
}
