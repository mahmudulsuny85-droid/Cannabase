import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Brain,
  Zap,
  Moon,
  Heart,
  Sparkles,
  Activity,
  Stethoscope,
  Gauge,
  ChevronRight,
} from "lucide-react";
import { CompoundTooltip } from "./CompoundTooltip";

// Mood based data map
const MOOD_DATA = [
  {
    id: "focus",
    label: "Wake and Bake Vibe",
    icon: Brain,
    description:
      "Perfect morning smoke. Keeps you crystal clear, sharp, energized, and ready to get things done without any racing thoughts.",
    ratio: "1:2 (THC:CBD)",
    thc: "Low-Medium (5-10%)",
    cbd: "High (10-20%)",
    terpenes: "Pinene, Limonene",
    color: "from-blue-500/10 via-blue-950/20 to-blue-900/30",
    border: "border-blue-500/30",
    hoverBorder: "hover:border-blue-400",
    text: "text-blue-400",
    bgIcon: "bg-blue-500/20",
    traits: { calm: 60, focus: 95, creative: 50, energy: 40 },
  },
  {
    id: "calm",
    label: "Mega Chill & Unwind",
    icon: Heart,
    description:
      "Perfect for taking a load off after a long day. Melts away mental stress and eases your brain without putting you straight to sleep.",
    ratio: "1:4 or lower (THC:CBD)",
    thc: "Microdose (2-5%)",
    cbd: "Very High (15-20%+)",
    terpenes: "Linalool, Myrcene",
    color: "from-teal-500/10 via-teal-950/20 to-teal-900/30",
    border: "border-teal-500/30",
    hoverBorder: "hover:border-teal-400",
    text: "text-teal-400",
    bgIcon: "bg-teal-500/20",
    traits: { calm: 98, focus: 40, creative: 35, energy: 20 },
  },
  {
    id: "sleep",
    label: "Couchlock & Deep Sleep",
    icon: Moon,
    description:
      "Heavy-hitting body relaxation. Makes your limbs feel like warm lead, melts you into the couch, and lets you slide straight into deep sleep.",
    ratio: "1:1 to 2:1 (THC:CBD)",
    thc: "Medium-High (15-20%)",
    cbd: "Medium (5-15%)",
    terpenes: "Myrcene, Caryophyllene, Terpinolene",
    color: "from-indigo-500/10 via-indigo-950/20 to-indigo-900/30",
    border: "border-indigo-500/30",
    hoverBorder: "hover:border-indigo-400",
    text: "text-indigo-400",
    bgIcon: "bg-indigo-500/20",
    traits: { calm: 95, focus: 15, creative: 15, energy: 10 },
  },
  {
    id: "energy",
    label: "Good for Smoking with Friends",
    icon: Zap,
    description:
      "A social, talkative, and giggly high. Boosts your physical motivation and has you ready for deep debates, gaming, or general laughs.",
    ratio: "2:1 (THC:CBD)",
    thc: "High (15-25%)",
    cbd: "Low-Medium (5-10%)",
    terpenes: "Limonene, Terpinolene",
    color: "from-amber-500/10 via-amber-950/20 to-amber-900/30",
    border: "border-amber-500/30",
    hoverBorder: "hover:border-amber-400",
    text: "text-amber-400",
    bgIcon: "bg-amber-500/20",
    traits: { calm: 30, focus: 75, creative: 70, energy: 95 },
  },
  {
    id: "creative",
    label: "Creative Flow & Inspiration",
    icon: Sparkles,
    description:
      "A bright, lateral brain high designed for brainstorming, instrument jamming, visual art, or getting totally lost in a good movie.",
    ratio: "High THC (10:1+)",
    thc: "Very High (20%+)",
    cbd: "Trace amounts",
    terpenes: "Limonene, Caryophyllene",
    color: "from-fuchsia-500/10 via-fuchsia-950/20 to-fuchsia-900/30",
    border: "border-fuchsia-500/30",
    hoverBorder: "hover:border-fuchsia-400",
    text: "text-fuchsia-400",
    bgIcon: "bg-fuchsia-500/20",
    traits: { calm: 40, focus: 60, creative: 98, energy: 75 },
  },
  {
    id: "pain",
    label: "Body Healing & Soreness Melt",
    icon: Activity,
    description:
      "Deep somatic comfort that target-soothes tire-out muscles and tense joints. Keeps your body feeling light, warm, and totally cozy.",
    ratio: "1:1 (THC:CBD)",
    thc: "Medium (10-15%)",
    cbd: "Medium (10-15%)",
    terpenes: "Caryophyllene, Myrcene, Pinene",
    color: "from-red-500/10 via-red-950/20 to-red-900/30",
    border: "border-red-500/30",
    hoverBorder: "hover:border-red-400",
    text: "text-red-400",
    bgIcon: "bg-red-500/20",
    traits: { calm: 85, focus: 45, creative: 45, energy: 35 },
  },
];

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
  hidden: { opacity: 0, y: 20, scale: 0.98 },
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

export default function MoodRatioEngine() {
  const [selectedMoodId, setSelectedMoodId] = useState<string>(MOOD_DATA[0].id);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const selectedMood =
    MOOD_DATA.find((m) => m.id === selectedMoodId) || MOOD_DATA[0];

  // User-modifiable traits representing fine-tuned custom compound ratios
  const [calm, setCalm] = useState(selectedMood.traits.calm);
  const [focus, setFocus] = useState(selectedMood.traits.focus);
  const [creative, setCreative] = useState(selectedMood.traits.creative);
  const [energy, setEnergy] = useState(selectedMood.traits.energy);

  // Sync sliders to selected preset archetype when it changes
  useEffect(() => {
    setCalm(selectedMood.traits.calm);
    setFocus(selectedMood.traits.focus);
    setCreative(selectedMood.traits.creative);
    setEnergy(selectedMood.traits.energy);
  }, [selectedMoodId, selectedMood.traits]);

  // Computed custom indices based on fine-tuned trait mixes
  const targetSynergyIndex = useMemo(() => {
    return Math.round(
      (calm * 1.25 + focus * 0.9 + creative * 1.45 + energy * 1.1) / 4.2,
    );
  }, [calm, focus, creative, energy]);

  // Dynamic calculated target cannabinoid ratios based on manual slider changes
  const computedRatioText = useMemo(() => {
    const isHeavyFocus = focus > 80 && calm >= 50 && energy < 60;
    const isHeavyCalm = calm > 85 && energy < 30;
    const isHeavySleep = calm > 85 && energy < 15 && creative < 30;
    const isHeavyEnergy = energy > 80 && calm < 50;
    const isHeavyCreative = creative > 85 && calm < 50;
    const isHeavyPain = calm > 70 && energy < 50;

    if (isHeavySleep) return "1:1 ratio - couchlock & deep sleep mode";
    if (isHeavyCalm) return "1:4 ratio - mega chill & unwind vibe";
    if (isHeavyFocus) return "1:2 ratio - perfect daytime smoke";
    if (isHeavyEnergy) return "2:1 ratio - good for smoking with friends";
    if (isHeavyCreative) return "10:1 ratio - highly creative & inspired high";
    if (isHeavyPain) return "3:3 ratio - body healing & muscle recovery";

    // Fallback based on mathematical ratio
    const thcFactor = Math.max(
      1,
      Math.round((energy * 1.5 + creative * 1.8) / 30),
    );
    const cbdFactor = Math.max(1, Math.round((calm * 2.0 + focus * 0.8) / 30));
    return `${thcFactor}:${cbdFactor} blend - custom smoker mix`;
  }, [calm, focus, creative, energy]);

  // SVG Radar Coordinates: Width and Height are structured at 200 units
  const radarPoints = useMemo(() => {
    const cx = 100;
    const cy = 100;
    const maxVal = 70; // Max radius length

    const pCalm = { x: cx, y: cy - (calm / 100) * maxVal };
    const pFocus = { x: cx + (focus / 100) * maxVal, y: cy };
    const pEnergy = { x: cx, y: cy + (energy / 100) * maxVal };
    const pCreative = { x: cx - (creative / 100) * maxVal, y: cy };

    return `${pCalm.x},${pCalm.y} ${pFocus.x},${pFocus.y} ${pEnergy.x},${pEnergy.y} ${pCreative.x},${pCreative.y}`;
  }, [calm, focus, creative, energy]);

  return (
    <div
      id="mood-consumption-matrix"
      className="w-full h-full flex flex-col space-y-4 md:space-y-6"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[var(--border-regular)] gap-5">
        <div className="space-y-1.5 text-left">
          <h3 className="font-display text-xl md:text-3xl font-black text-[var(--text-primary)] flex items-center gap-2.5">
            <Stethoscope className="w-6 h-6 text-emerald-500 animate-pulse-slow" />
            Vibe Finder & Session Planner
          </h3>
          <p className="text-xs md:text-base text-[var(--text-secondary)] font-sans font-medium max-w-3xl leading-relaxed">
            Select your target vibe or adjust sliders to dial it in. The matrix
            automatically guides you to the ideal cannabinoid mix.
          </p>
        </div>

        {/* Global animated Synergy Display */}
        <div className="shrink-0 flex items-center gap-3 md:gap-4">
          <button
            onClick={() => setShowAnalysis(!showAnalysis)}
            className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl border transition-all font-mono text-[9px] md:text-[10px] font-black uppercase tracking-wider ${showAnalysis ? "bg-emerald-500 text-white dark:text-emerald-950 border-emerald-400 shadow-lg" : "bg-[var(--bg-surface-elevated)] border-[var(--border-subtle)] text-emerald-600 dark:text-emerald-400 hover:bg-white/10"}`}
          >
            <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4" />
            {showAnalysis ? "Hide" : "Analysis"}
          </button>

          <div className="shrink-0 flex items-center gap-2 md:gap-2.5 px-3 md:px-4.5 py-2 md:py-2.5 bg-[var(--bg-surface-elevated)] border border-emerald-500/20 rounded-2xl relative">
            <Gauge className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" />
            <div className="font-mono text-left">
              <span className="text-[9px] text-[var(--text-muted)] block uppercase tracking-wider font-semibold">
                Match Score
              </span>
              <span className="text-sm md:text-base font-black text-emerald-600 dark:text-emerald-350 tracking-tight block leading-none md:leading-normal">
                {targetSynergyIndex}{" "}
                <span className="text-[8px] md:text-[10px] text-[var(--text-muted)] font-bold uppercase">
                  PTS
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative flex-1 min-h-0">
        {/* Left Side: Interactive Archetype Selector List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-4 flex flex-col space-y-3.5 overflow-y-auto scrollbar-hidden pb-4 pr-1"
        >
          <motion.span
            variants={itemVariants}
            className="text-[10px] md:text-sm font-mono tracking-wider text-emerald-600 dark:text-[#b87333] uppercase block font-extrabold text-left ml-1.5"
          >
            SELECT A PRESET VIBE
          </motion.span>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
            {MOOD_DATA.map((mood) => {
              const Icon = mood.icon;
              const isSelected = selectedMoodId === mood.id;

              return (
                <motion.button
                  key={mood.id}
                  variants={itemVariants}
                  onClick={() => setSelectedMoodId(mood.id)}
                  className={`w-full flex items-center justify-between p-3.5 md:p-4 rounded-xl border text-left transition-all duration-300 relative group cursor-pointer overflow-hidden ${
                    isSelected
                      ? `bg-[var(--bg-surface)] border-emerald-500/40 shadow-xl z-10`
                      : `bg-[var(--bg-surface-elevated)] border-[var(--border-subtle)] hover:border-emerald-500/20 hover:bg-[var(--bg-main)]`
                  }`}
                >
                  <div className="flex items-start gap-4 relative z-10 overflow-hidden">
                    <div
                      className={`p-2.5 md:p-3 rounded-2xl transition-all duration-300 shrink-0 ${isSelected ? `${mood.bgIcon} shadow-inner` : "bg-[var(--bg-main)] shadow-sm border border-[var(--border-subtle)]"}`}
                    >
                      <Icon
                        className={`w-5 h-5 md:w-5.5 md:h-5.5 ${isSelected ? mood.text : "text-[var(--text-muted)]"}`}
                      />
                    </div>
                    <div className="space-y-0.5 md:space-y-1 overflow-hidden">
                      <h4
                        className={`font-display text-sm md:text-lg font-black tracking-tight ${isSelected ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"}`}
                      >
                        {mood.label}
                      </h4>
                      <p
                        className={`text-[10px] md:text-sm font-sans font-medium line-clamp-1 md:line-clamp-2 leading-relaxed tracking-tight ${isSelected ? "text-[var(--text-secondary)]" : "text-[var(--text-muted)]"}`}
                      >
                        {mood.description}
                      </p>
                    </div>
                  </div>

                  <ChevronRight
                    className={`w-4 h-4 md:w-5 md:h-5 text-[var(--text-muted)] transition-all ${isSelected ? "rotate-90 text-emerald-500" : "group-hover:translate-x-1"}`}
                  />
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Right Side: Tactile Interactive Calibration Station */}
        <div className="lg:col-span-8 flex flex-col min-h-0 bg-[var(--bg-surface)] border border-[var(--border-regular)] rounded-2xl overflow-hidden shadow-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedMood.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex-1 p-5 md:p-8 flex flex-col justify-between"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 relative">
                {/* Calibration Area: Sliders & Description */}
                <div className="md:col-span-7 flex flex-col space-y-6 text-left">
                  {/* Title block */}
                  <div className="space-y-2">
                    <span className="text-[10px] md:text-sm font-mono tracking-wider text-emerald-600 dark:text-[#b87333] block font-extrabold uppercase">
                      COMPOSITION
                    </span>
                    <h3 className="text-xl md:text-3xl font-display font-black text-[var(--text-primary)] flex items-center gap-2.5">
                      <selectedMood.icon
                        className={`w-6 h-6 ${selectedMood.text}`}
                      />
                      {selectedMood.label}
                    </h3>
                  </div>

                  {/* Tactile sliders section */}
                  <div
                    id="tactile-matrix-sliders"
                    className="space-y-4 md:space-y-5"
                  >
                    <span className="text-[10px] md:text-sm font-mono tracking-wider text-emerald-600 dark:text-emerald-400 block font-extrabold uppercase">
                      DIAL IN YOUR VIBE
                    </span>

                    {[
                      {
                        label: "Body Chill",
                        val: calm,
                        set: setCalm,
                        color: "text-teal-500",
                        bg: "bg-teal-500",
                      },
                      {
                        label: "Head Buzz",
                        val: focus,
                        set: setFocus,
                        color: "text-blue-500",
                        bg: "bg-blue-500",
                      },
                      {
                        label: "Mind High",
                        val: creative,
                        set: setCreative,
                        color: "text-fuchsia-500",
                        bg: "bg-fuchsia-500",
                      },
                      {
                        label: "Activity",
                        val: energy,
                        set: setEnergy,
                        color: "text-amber-500",
                        bg: "bg-amber-500",
                      },
                    ].map((s) => (
                      <div
                        key={s.label}
                        className="space-y-2.5 bg-[var(--bg-surface-elevated)] p-3.5 md:p-4 rounded-xl border border-[var(--border-subtle)]"
                      >
                        <div className="flex justify-between items-center text-[10px] md:text-sm font-mono">
                          <span className="text-[var(--text-secondary)] font-bold uppercase flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${s.bg}`} />
                            {s.label}
                          </span>
                          <span className={`${s.color} font-black text-sm`}>
                            {s.val}%
                          </span>
                        </div>
                        <div className="relative h-2.5 md:h-3 bg-[var(--bg-main)] rounded-full flex items-center overflow-hidden border border-[var(--border-subtle)]">
                          <span
                            className={`h-full ${s.bg} rounded-full transition-all duration-300 opacity-60 dark:opacity-100 shadow-sm`}
                            style={{ width: `${s.val}%` }}
                          />
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={s.val}
                            onChange={(e) => s.set(Number(e.target.value))}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dashboard Node radar-chart HUD illustration on SVG */}
                <div className="md:col-span-5 flex flex-col items-center justify-center p-5 bg-[var(--bg-main)]/60 border border-[var(--border-subtle)] rounded-xl relative min-h-[225px] mt-4 md:mt-0">
                  <span className="absolute top-2 left-3 text-[9px] font-mono text-[var(--text-muted)] font-bold uppercase tracking-wider">
                    Vibe Balance
                  </span>

                  <div className="w-[160px] h-[160px] md:w-[185px] md:h-[185px] relative top-1.5 flex items-center justify-center">
                    <svg
                      viewBox="0 0 200 200"
                      className="w-full h-full overflow-visible"
                    >
                      <circle
                        cx="100"
                        cy="100"
                        r="70"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeDasharray="2,2"
                        className="opacity-10 text-[var(--text-muted)]"
                      />
                      <line
                        x1="100"
                        y1="30"
                        x2="100"
                        y2="170"
                        stroke="currentColor"
                        strokeWidth="1"
                        className="opacity-10 text-[var(--text-muted)]"
                      />
                      <line
                        x1="30"
                        y1="100"
                        x2="170"
                        y2="100"
                        stroke="currentColor"
                        strokeWidth="1"
                        className="opacity-10 text-[var(--text-muted)]"
                      />

                      <polygon
                        points={radarPoints}
                        fill="rgba(16, 185, 129, 0.15)"
                        stroke="#10b981"
                        strokeWidth="2"
                        className="transition-all duration-300"
                      />

                      <circle
                        cx="100"
                        cy={100 - (calm / 100) * 70}
                        r="3"
                        fill="#14b8a6"
                      />
                      <circle
                        cx={100 + (focus / 100) * 70}
                        cy="100"
                        r="3"
                        fill="#3b82f6"
                      />
                      <circle
                        cx="100"
                        cy={100 + (energy / 100) * 70}
                        r="3"
                        fill="#f59e0b"
                      />
                      <circle
                        cx={100 - (creative / 100) * 70}
                        cy="100"
                        r="3"
                        fill="#d946ef"
                      />
                    </svg>
                  </div>

                  <div className="mt-4 text-[10px] font-mono text-[var(--text-muted)] font-semibold">
                    Synergy Index:{" "}
                    <span className="text-emerald-500 font-bold">
                      {(
                        (calm * focus +
                          focus * energy +
                          energy * creative +
                          creative * calm) /
                        10000
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Lower projection dashboard area */}
              <div className="mt-8 pt-6 border-t border-[var(--border-subtle)] space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-[var(--bg-surface-elevated)] p-4 border border-[var(--border-subtle)] rounded-xl text-left">
                    <span className="text-[9px] font-mono font-bold tracking-wider text-[var(--text-muted)] uppercase block pb-1">
                      RATIO
                    </span>
                    <strong className="text-emerald-600 dark:text-emerald-400 text-sm md:text-base font-mono block pt-1 font-extrabold truncate">
                      {computedRatioText}
                    </strong>
                  </div>

                  <div className="bg-[var(--bg-surface-elevated)] p-4 border border-[var(--border-subtle)] rounded-xl text-left sm:col-span-2 shadow-sm transition-all hover:border-[var(--border-regular)]">
                    <span className="text-[10px] font-mono font-bold tracking-widest text-[var(--text-muted)] uppercase block pb-2">
                      TOP COMPOUNDS
                    </span>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {selectedMood.terpenes.split(", ").map((t) => (
                        <CompoundTooltip key={t} compoundKey={t}>
                          <span
                            className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 shadow-sm text-emerald-600 dark:text-emerald-400 text-xs font-mono font-extrabold rounded-lg backdrop-blur-md transition-all hover:bg-emerald-500/20 cursor-help inline-block"
                          >
                            {t}
                          </span>
                        </CompoundTooltip>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-[10px] text-[var(--text-muted)] font-mono leading-relaxed text-left flex gap-2">
                  <Stethoscope className="w-3.5 h-3.5 shrink-0" />
                  Guidelines represent standard baselines. Everyone is wired
                  differently—start low, go slow.
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
