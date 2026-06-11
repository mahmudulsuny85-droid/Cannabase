import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Leaf, Droplet, Dna, ArrowRight } from "lucide-react";
import { Strain } from "../types";
import { STRAINS_DATA } from "../data";
import { getBenefitIcon, pageTurnVariants } from "../utils/ui";
import terrariumImg from "../assets/images/canna_terrarium_1779749718348.png";

interface HeroSectionProps {
  selectedStrain: Strain;
  setSelectedStrain: (strain: Strain) => void;
  setActiveSection: (section: any) => void;
}

export default function HeroSection({
  selectedStrain,
  setSelectedStrain,
  setActiveSection,
}: HeroSectionProps) {
  const [timeGreeting, setTimeGreeting] = useState("Good Morning");

  useEffect(() => {
    const hour = new Date().getHours(); // Use local time, not UTC
    if (hour < 12) setTimeGreeting("Wake & Bake Vibes");
    else if (hour < 17) setTimeGreeting("Afternoon Sesh");
    else if (hour < 21) setTimeGreeting("Evening Lounge");
    else setTimeGreeting("Midnight Sessions");
  }, []);

  return (
    <motion.div
      id="home-view-wrapper"
      key="home"
      variants={pageTurnVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ backfaceVisibility: "hidden" }}
      className="w-full h-full flex flex-col xl:grid xl:grid-cols-12 gap-8 xl:gap-4 items-center overflow-y-auto scrollbar-hidden pb-20 md:pb-32"
    >
      {/* Left Hierarchy Panel: Massive overlapping display text */}
      <motion.div
        id="left-hero-typography"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.15,
              delayChildren: 0.2,
            },
          },
        }}
        className="xl:col-span-5 space-y-6 md:space-y-8 text-center xl:text-left transition-transform duration-200 ease-out p-1 w-full max-w-2xl mx-auto xl:mx-0"
        style={{
          transform:
            "translate3d(calc(var(--px-x, 0) * 15px), calc(var(--px-y, 0) * 10px), 20px)",
        }}
      >
        {/* classification categorizer */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 15 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.6, ease: "easeOut" },
            },
          }}
          className="inline-flex items-center gap-3 px-3.5 py-1.5 bg-emerald-950/40 border border-emerald-500/20 text-[#b87333] rounded-full"
        >
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest uppercase font-black text-emerald-400">
              {timeGreeting}
            </span>
          </div>
          <div className="w-px h-3 bg-white/20" />
          <span className="text-[10px] font-mono tracking-widest uppercase font-bold">
            The Vibe Archive
          </span>
        </motion.div>

        <div className="space-y-4">
          <motion.h1
            id="hero-heading"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.8, ease: "easeOut" },
              },
            }}
            className="font-display text-[32px] sm:text-[42px] md:text-[52px] xl:text-[72px] font-black leading-[1.1] mb-6 tracking-tight text-[var(--text-primary)] drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
          >
            Your Digital <br className="hidden sm:block" />
            Smoking{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-300 font-extrabold drop-shadow-[0_0_25px_rgba(52,211,153,0.75)] tracking-tight py-1 inline-block">
              Circle
            </span>
          </motion.h1>

          <motion.p
            id="hero-subtext"
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.8, ease: "easeOut" },
              },
            }}
            className="text-sm md:text-base text-[var(--text-secondary)] max-w-sm font-sans font-medium leading-relaxed mx-auto xl:mx-0"
          >
            Your ultimate guide to strains, custom mixing vibes, tracking your
            high, and chilling out with friends.
          </motion.p>
        </div>

        {/* Hot selection catalog list */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.8, ease: "easeOut" },
            },
          }}
          className="space-y-3.5 bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] p-5 rounded-2xl max-w-md shadow-inner mx-auto xl:mx-0"
        >
          <span className="text-[10px] font-mono text-[#b87333] uppercase tracking-widest block font-black text-left">
            Pick Your Leaf / Vibe Check:
          </span>
          <div className="flex flex-wrap gap-2 justify-center xl:justify-start">
            {STRAINS_DATA.slice(0, 4).map((str) => {
              const isCurrent = str.id === selectedStrain.id;
              return (
                <button
                  id={`btn-hero-catalog-${str.id}`}
                  key={str.id}
                  type="button"
                  onClick={() => setSelectedStrain(str)}
                  className={`px-3 py-2 rounded-xl text-[10px] md:text-xs font-display flex items-center gap-1.5 cursor-pointer transition-all duration-300 ${
                    isCurrent
                      ? "bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 font-bold shadow-lg shadow-emerald-900/10"
                      : "bg-black/40 text-gray-400 hover:text-white border border-white/5 hover:border-white/10"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {str.name.split(" ")[0]}
                </button>
              );
            })}
          </div>
        </motion.div>
      </motion.div>

      {/* Central Illustration Area: Layered Parallax Terrarium */}
      <div
        id="central-terrarium-viewport"
        className="xl:col-span-4 relative flex items-center justify-center min-h-[300px] md:min-h-[480px] pointer-events-none w-full"
      >
        {/* Back glow breathing copper frame behind illustration */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 bg-gradient-to-b from-emerald-500 to-transparent rounded-full blur-[80px]"
        />

        {/* Parallax Wrapper */}
        <div
          id="parallax-terrarium-container"
          className="relative w-full max-w-[280px] sm:max-w-[420px] xl:max-w-[440px] z-10 transition-transform duration-300 ease-out flex items-center justify-center pointer-events-auto"
          style={{
            transform:
              "translate3d(calc(var(--px-x, 0) * -38px), calc(var(--px-y, 0) * -22px), 15px)",
          }}
        >
          {/* Dynamic Floating/Breathing Terrarium Element */}
          <motion.div
            id="floating-artwork-cage"
            animate={{
              y: [0, -10, 0],
              scale: [1.01, 1.03, 1.01],
              rotate: [0, 0.5, -0.5, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative w-full h-full flex items-center justify-center border-[2px] border-[#b87333]/40 rounded-[40px] md:rounded-[60px] backdrop-blur-[6px] bg-emerald-950/20 p-4 md:p-6 shadow-2xl overflow-hidden"
          >
            {/* Layered botanical artwork */}
            <img
              src={terrariumImg}
              alt="CannaBase Geometric Glass Terrarium Illustration"
              referrerPolicy="no-referrer"
              className="w-full h-auto drop-shadow-[0_20px_40px_rgba(4,40,24,0.5)] object-contain rounded-[30px] md:rounded-[40px]"
            />

            {/* Overlay glass glare highlight cards */}
            <div className="absolute top-[15%] right-[10%] p-2 bg-black/60 backdrop-blur-md rounded-xl border border-[#b87333]/40 shadow-xl text-[8px] md:text-[9px] font-mono text-white/95 flex items-center gap-1.5 animate-pulse-slow font-bold">
              <Droplet className="w-3 h-3 md:w-3.5 md:h-3.5 text-blue-400" />
              <span>Stratified Humus</span>
            </div>

            <div className="absolute bottom-[20%] left-[8%] p-2 bg-black/60 backdrop-blur-md rounded-xl border border-emerald-500/40 shadow-xl text-[8px] md:text-[9px] font-mono text-white/95 flex items-center gap-1.5 font-bold">
              <Dna className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#b87333]" />
              <span>Specimen v1</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* BOTTOM RIGHT INTERACTIVE CARD (Featured Strain Selection) */}
      <div
        id="bottom-right-featured-card"
        className="xl:col-span-3 z-30 w-full transition-transform duration-200 ease-out max-w-sm"
        style={{
          transform:
            "translate3d(calc(var(--px-x, 0) * 12px), calc(var(--px-y, 0) * 8px), 28px)",
        }}
      >
        <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-[24px] p-5 md:p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between h-full">
          {/* Subtle aesthetic backdrop light */}
          <div className="absolute -right-24 -bottom-24 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex justify-between items-start mb-4 text-left">
              <div>
                <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-1 font-mono">
                  Featured Strain
                </p>
                <h3 className="text-white text-lg md:text-xl font-semibold flex items-center gap-1.5 truncate">
                  {selectedStrain.name}
                </h3>
              </div>
            </div>

            {/* Chemical and benefits breakdown */}
            <div className="space-y-4 mb-5">
              {/* Type & Terpene Meta */}
              <div className="grid grid-cols-2 gap-3 p-2.5 bg-white/[0.02] border border-white/10 rounded-xl text-left">
                <div className="pl-1">
                  <span className="text-[8px] md:text-[9px] text-[#b87333] font-mono font-bold uppercase block">
                    Genetics
                  </span>
                  <span className="text-[11px] md:text-[12px] text-emerald-300 font-medium truncate block">
                    {selectedStrain.type}
                  </span>
                </div>
                <div className="pl-1 border-l border-white/10">
                  <span className="text-[8px] md:text-[9px] text-[#b87333] font-mono font-bold uppercase block">
                    Main Terpene
                  </span>
                  <span className="text-[11px] md:text-[12px] text-amber-300 font-medium truncate block">
                    {selectedStrain.terpenes[0]?.name || "Myrcene"}
                  </span>
                </div>
              </div>

              {/* Interactive Responsive Bar Chart */}
              <div className="p-3.5 bg-black/40 border border-white/10 rounded-[16px] space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-white/80 font-mono uppercase tracking-widest font-bold">
                    Cannabinoids
                  </span>
                </div>

                <div className="space-y-2.5">
                  {/* THC Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[9px] font-mono">
                      <span className="text-white/90 font-medium flex items-center gap-1.5 font-sans">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        THC
                      </span>
                      <span className="text-amber-400 font-bold">
                        {selectedStrain.thcValue}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden relative">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.min((selectedStrain.thcValue / 30) * 100, 100)}%`,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 80,
                          damping: 15,
                        }}
                        className="h-full bg-gradient-to-r from-amber-600 to-amber-500 rounded-full"
                      />
                    </div>
                  </div>

                  {/* CBD Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[9px] font-mono">
                      <span className="text-white/90 font-medium flex items-center gap-1.5 font-sans">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        CBD
                      </span>
                      <span className="text-emerald-400 font-bold">
                        {selectedStrain.cbdValue}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden relative">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.min((selectedStrain.cbdValue / 30) * 100, 100)}%`,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 80,
                          damping: 15,
                        }}
                        className="h-full bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            id="btn-explore-featured-strain"
            onClick={() => {
              setActiveSection("directory");
            }}
            className="w-full bg-emerald-500 text-emerald-950 py-3.5 rounded-xl text-[10px] md:text-sm font-black uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            Explore View
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
