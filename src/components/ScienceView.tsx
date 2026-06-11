import { motion } from "motion/react";
import { Activity } from "lucide-react";
import { EDUCATIONAL_TOPICS } from "../data";
import { pageTurnVariants } from "../utils/ui";

interface ScienceViewProps {
  onRegisterOpen: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function ScienceView({ onRegisterOpen }: ScienceViewProps) {
  return (
    <motion.div
      id="science-deck"
      key="science"
      variants={pageTurnVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ backfaceVisibility: "hidden" }}
      className="w-full flex flex-col space-y-6 md:space-y-8 max-w-5xl mx-auto pb-24 md:pb-32 px-4"
    >
      {/* Science Title block */}
      <motion.div
        variants={itemVariants}
        className="space-y-3 border-b border-[var(--border-subtle)] pb-6 text-left"
      >
        <div className="inline-flex items-center gap-2.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
          <Activity className="w-3.5 h-3.5 text-emerald-500" />
          <span className="text-[10px] font-mono uppercase tracking-widest block font-black text-emerald-600 dark:text-emerald-400">
            Education HUB
          </span>
        </div>
        <h3 className="font-display text-2xl md:text-3xl font-black tracking-tight text-[var(--text-primary)]">
          The Science of Relaxation
        </h3>
        <p className="text-sm md:text-base text-[var(--text-secondary)] font-sans font-medium max-w-2xl leading-relaxed">
          Cannabis interacts with a natural balancing system in your body called
          the Endocannabinoid System (ECS).
        </p>
      </motion.div>

      {/* Science topics list */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {EDUCATIONAL_TOPICS.map((topic) => (
          <motion.div
            id={`topic-card-${topic.id}`}
            key={topic.id}
            variants={itemVariants}
            whileHover={{
              y: -5,
              boxShadow:
                "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
            }}
            className="p-6 bg-[var(--bg-surface-elevated)] rounded-2xl border border-[var(--border-subtle)] space-y-5 hover:border-emerald-500/30 transition-shadow shadow-lg"
          >
            <div className="space-y-2">
              <h4 className="font-display text-base font-black text-amber-600 dark:text-amber-500">
                {topic.title}
              </h4>
              <p className="text-xs text-[var(--text-secondary)] font-sans leading-relaxed">
                {topic.description}
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-[var(--border-subtle)]">
              {topic.items.map((sub, idx) => (
                <div
                  id={`sub-topic-row-${idx}`}
                  key={sub.name}
                  className="space-y-1"
                >
                  <strong className="text-[11px] font-mono font-bold text-[var(--text-primary)] uppercase tracking-wider block">
                    {sub.name}
                  </strong>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-sans font-medium">
                    {sub.role}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6"
      >
        <div className="space-y-1.5 text-center md:text-left">
          <h4 className="text-[var(--text-primary)] font-display text-lg font-black">
            Ready to session with friends?
          </h4>
          <p className="text-xs md:text-sm text-[var(--text-secondary)] font-sans max-w-lg">
            Create an account to save your favorite terpene ratios, stash
            reviews, and join live smoke rooms.
          </p>
        </div>

        <button
          id="btn-science-register"
          onClick={onRegisterOpen}
          className="shrink-0 px-8 py-3 bg-emerald-600 text-white font-mono font-black rounded-xl text-xs uppercase tracking-widest transition-all shadow-md hover:bg-emerald-500 cursor-pointer"
        >
          Join Circle
        </button>
      </motion.div>
    </motion.div>
  );
}
