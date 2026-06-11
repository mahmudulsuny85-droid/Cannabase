import { motion, AnimatePresence } from "motion/react";
import { MessageSquare } from "lucide-react";

interface ActionButtonsProps {
  isMobileMenuOpen: boolean;
  onInboxOpen: () => void;
  onBudtenderToggle: () => void;
  hasUnreadMessages: boolean;
}

export default function ActionButtons({
  isMobileMenuOpen,
  onInboxOpen,
  onBudtenderToggle,
  hasUnreadMessages,
}: ActionButtonsProps) {
  return (
    <AnimatePresence>
      {!isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-40 flex flex-col items-end gap-4 pointer-events-auto"
        >
          {/* Floating Inbox Message Button */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={onInboxOpen}
            className="w-12 h-12 md:w-14 md:h-14 flex flex-col items-center justify-center bg-[var(--bg-surface-elevated)] border-2 border-[var(--border-subtle)] hover:border-emerald-500/50 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all cursor-pointer group relative overflow-hidden"
            aria-label="Private Messages"
          >
            <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/5 transition-colors" />
            <MessageSquare className="w-4 h-4 md:w-5 md:h-5 text-emerald-500 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="text-[7px] md:text-[8px] font-mono font-black text-emerald-500/70 dark:text-emerald-400/70 tracking-[0.2em] -mt-0.5">
              MSG
            </span>

            {hasUnreadMessages && (
              <span className="absolute top-2 right-2 md:top-3 md:right-3 w-1.5 h-1.5 md:w-2 md:h-2 bg-emerald-500 rounded-full border border-white dark:border-black animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            )}
          </motion.button>

          {/* Ask Budtender Floating CTA */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={onBudtenderToggle}
            className="w-12 h-12 md:w-14 md:h-14 flex flex-col items-center justify-center bg-[var(--bg-surface-elevated)] border-2 border-emerald-500/50 rounded-full shadow-[0_0_30px_rgba(16,185,129,0.2)] hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] transition-all cursor-pointer group"
            aria-label="Ask AI Budtender"
          >
            <div className="absolute inset-0 rounded-full border border-emerald-400/20 animate-ping opacity-20" />
            <span className="text-emerald-500 dark:text-emerald-400 font-mono font-black text-[9px] md:text-[10px] tracking-widest group-hover:text-emerald-400 dark:group-hover:text-white transition-colors">
              AI
            </span>
            <span className="text-[7px] md:text-[8px] font-mono font-black text-emerald-500/50 dark:text-emerald-400/50 -mt-1 uppercase tracking-tighter">
              BUD
            </span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
