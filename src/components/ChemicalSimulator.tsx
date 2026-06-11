import { useState, useMemo, useEffect, useRef } from "react";
import { motion } from "motion/react";
import {
  Sliders,
  Activity,
  Heart,
  Eye,
  Sparkles,
  Brain,
  Award,
  Info,
  Scale,
  Zap,
  Flame,
  ShieldAlert,
  Bookmark,
} from "lucide-react";

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
  hidden: { opacity: 0, y: 30, scale: 0.95 },
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

export default function ChemicalSimulator({
  onSaveMix,
  onShareToFeed,
}: {
  onSaveMix?: (mix: any) => void;
  onShareToFeed?: (content: string) => void;
}) {
  const [thc, setThc] = useState(12); // Slider (0-30%)
  const [cbd, setCbd] = useState(15); // Slider (0-30%)
  const [terpeneConcentration, setTerpeneConcentration] = useState(2.2); // Slider (0.0-5.0%)
  const [selectedTerpene, setSelectedTerpene] = useState("Myrcene");

  const [isThcDragging, setIsThcDragging] = useState(false);
  const [isCbdDragging, setIsCbdDragging] = useState(false);
  const [isTerpDragging, setIsTerpDragging] = useState(false);

  const [customMixName, setCustomMixName] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const VIBE_PRESETS = [
    {
      id: "focus",
      label: "Wake & Bake",
      thc: 8,
      cbd: 16,
      tap: 2.2,
      terpene: "Pinene",
    },
    {
      id: "calm",
      label: "Mega Chill",
      thc: 4,
      cbd: 24,
      tap: 3.0,
      terpene: "Linalool",
    },
    {
      id: "sleep",
      label: "Deep Sleep",
      thc: 20,
      cbd: 10,
      tap: 3.5,
      terpene: "Myrcene",
    },
    {
      id: "social",
      label: "Social Circle",
      thc: 22,
      cbd: 8,
      tap: 2.8,
      terpene: "Limonene",
    },
    {
      id: "creative",
      label: "Creative Flow",
      thc: 26,
      cbd: 2,
      tap: 3.2,
      terpene: "Limonene",
    },
    {
      id: "healing",
      label: "Body Healing",
      thc: 14,
      cbd: 14,
      tap: 3.0,
      terpene: "Caryophyllene",
    },
  ];

  const applyPreset = (preset: (typeof VIBE_PRESETS)[0]) => {
    setThc(preset.thc);
    setCbd(preset.cbd);
    setTerpeneConcentration(preset.tap);
    setSelectedTerpene(preset.terpene);
  };

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [shareSuccess, setShareSuccess] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleShareToFeedInternal = () => {
    if (!onShareToFeed) return;
    const ratio = cbd / (thc || 0.1);
    const content = `Just engineered a new custom blend: ${cbd}% CBD / ${thc}% THC for ${analysis.vibe.toLowerCase()}. Try syncing your sliders to this ratio! (Synergy Index: ${(thc + cbd + terpeneConcentration * 4.5).toFixed(1)})`;
    onShareToFeed(content);
    setShareSuccess(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setShareSuccess(false), 3000);
  };

  const handleSaveMix = () => {
    if (!customMixName.trim()) return;
    try {
      const newMix = {
        id: Date.now().toString(),
        name: customMixName.trim(),
        thc,
        cbd,
        terpeneConcentration,
        selectedTerpene,
        vibe: analysis.vibe,
        created: new Date().toLocaleDateString(),
      };

      const stored = localStorage.getItem("canna_custom_mixes");
      const currentMixes = stored ? JSON.parse(stored) || [] : [];
      const updated = [newMix, ...currentMixes];
      localStorage.setItem("canna_custom_mixes", JSON.stringify(updated));

      if (onSaveMix) {
        onSaveMix(newMix);
      }

      setSaveSuccess(true);
      setCustomMixName("");
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      console.error(
        "Diagnostic error: Failed to parse mixes fallback executed.",
        e,
      );
    }
  };

  const terpenes = [
    {
      name: "Myrcene",
      description: "Herbal, earthy aroma.",
      role: "Helps calm the body and promotes deep muscle relaxation.",
    },
    {
      name: "Pinene",
      description: "Fresh pine needle scent.",
      role: "Enhances mental clarity, alertness, and keeps your memory sharp.",
    },
    {
      name: "Limonene",
      description: "Bright citrus lemon scent.",
      role: "Uplifts your mood and helps ease everyday stress.",
    },
    {
      name: "Caryophyllene",
      description: "Spicy black pepper aroma.",
      role: "Provides soothing comfort for physical soreness and tension.",
    },
    {
      name: "Linalool",
      description: "Sweet lavender floral perfume.",
      role: "Deeply soothing, helping your mind and body unwind.",
    },
  ];

  // Particle simulation loop reacting to THC/CBD/Terpene states
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      type: "thc" | "cbd" | "terpene";
    }> = [];

    const isThcMax = thc === 30;
    const isCbdMax = cbd === 30;
    const isTerpMax = terpeneConcentration === 5;
    const isMegaSynergy = isThcMax || isCbdMax || isTerpMax;

    // Re-initialize particles of types depending on current levels
    const initParticles = () => {
      particles = [];
      const numThc = Math.max(2, Math.round(thc * 1.2));
      const numCbd = Math.max(2, Math.round(cbd * 1.2));
      const numTerp = Math.max(2, Math.round(terpeneConcentration * 6));

      // THC particles (Red/Pink/Neon Red)
      for (let i = 0; i < numThc; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * (1.5 + thc / 10),
          vy: (Math.random() - 0.5) * (1.5 + thc / 10),
          size: Math.random() * 2 + 1.5,
          color: isThcMax ? "#ff3333" : "#f43f5e",
          type: "thc",
        });
      }

      // CBD particles (Cyan/Teal/Blue)
      for (let i = 0; i < numCbd; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * (1.5 + cbd / 10),
          vy: (Math.random() - 0.5) * (1.5 + cbd / 10),
          size: Math.random() * 2 + 1.5,
          color: isCbdMax ? "#38bdf8" : "#14b8a6",
          type: "cbd",
        });
      }

      // Terpene particles (Gold/Orange)
      for (let i = 0; i < numTerp; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * (2 + terpeneConcentration),
          vy: (Math.random() - 0.5) * (2 + terpeneConcentration),
          size: Math.random() * 1.5 + 2,
          color: "#f59e0b",
          type: "terpene",
        });
      }
    };

    // Keep handle on canvas dimensions
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth || 300;
        canvas.height = parent.clientHeight || 150;
      }
      initParticles();
    };

    resizeCanvas();
    const resizeObserver = new ResizeObserver(() => resizeCanvas());
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw faint molecular grid backdrop
      const gridColor =
        getComputedStyle(document.documentElement)
          .getPropertyValue("--canvas-grid")
          .trim() || "rgba(255, 255, 255, 0.03)";
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      const step = 20;
      for (let x = 0; x < canvas.width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Max level alert visual effect
      if (isMegaSynergy) {
        ctx.strokeStyle = "rgba(16, 185, 129, 0.08)";
        ctx.lineWidth = 3;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
      }

      // Render connected lines (Entourage Synergy visualization)
      ctx.lineWidth = 0.8;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Connection range changes depending on total concentration & terpenes
          const connectDist = 55 + terpeneConcentration * 6;
          if (dist < connectDist) {
            const alpha =
              (1 - dist / connectDist) * (0.15 + terpeneConcentration / 10);

            // Mix color gradients for entourage representation
            if (particles[i].type !== particles[j].type) {
              ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`; // purple synergy
            } else if (particles[i].type === "thc") {
              ctx.strokeStyle = `rgba(244, 63, 94, ${alpha})`;
            } else if (particles[i].type === "cbd") {
              ctx.strokeStyle = `rgba(20, 184, 166, ${alpha})`;
            } else {
              ctx.strokeStyle = `rgba(245, 158, 11, ${alpha})`;
            }
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw and move particles
      particles.forEach((p) => {
        // Draw glow glow if Max state
        if (isMegaSynergy) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3.5, 0, Math.PI * 2);
          ctx.fillStyle =
            p.color === "#f43f5e"
              ? "rgba(244, 63, 94, 0.09)"
              : p.color === "#14b8a6"
                ? "rgba(20, 184, 166, 0.09)"
                : "rgba(245, 158, 11, 0.09)";
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Move
        let currentVx = p.vx;
        let currentVy = p.vy;

        // Pushing limit causes hyperactive particle velocities
        if (isMegaSynergy) {
          currentVx *= 1.4;
          currentVy *= 1.4;
        }

        p.x += currentVx;
        p.y += currentVy;

        // Boundaries
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Keeps particles safe
        p.x = Math.max(0, Math.min(canvas.width, p.x));
        p.y = Math.max(0, Math.min(canvas.height, p.y));
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
    };
  }, [thc, cbd, terpeneConcentration]);

  // Dynamically calculate clinical scores based on THC, CBD, and Terpene combinations
  const analysis = useMemo(() => {
    let euphoria = 0;
    let calm = 0;
    let focus = 0;
    let physicalRelief = 0;
    let medicalSummary = "";
    let therapeuticVibe = "";

    // Base scores from Cannabinoids
    euphoria += Math.min(thc * 3.3, 100);
    calm += Math.min(cbd * 3.3, 100);

    // Focus calculation
    focus += cbd * 1.5 + (selectedTerpene === "Pinene" ? 40 : 0);
    focus -= Math.max(0, (thc - 15) * 2);
    focus = Math.max(10, Math.min(100, focus));

    // Physical relief with concentration multipliers
    physicalRelief += cbd * 2.2 + thc * 1.2;
    if (selectedTerpene === "Caryophyllene" || selectedTerpene === "Myrcene") {
      physicalRelief += 30;
    }
    physicalRelief += terpeneConcentration * 5;
    physicalRelief = Math.min(100, physicalRelief);

    // Apply Terpene modifiers based on concentration scaler (0 to 2x multiplier)
    const activeMultiplier = terpeneConcentration / 2.5;

    if (selectedTerpene === "Myrcene") {
      calm += 25 * activeMultiplier;
      euphoria *= 1 - 0.05 * activeMultiplier;
    } else if (selectedTerpene === "Limonene") {
      euphoria += 18 * activeMultiplier;
      calm += 12 * activeMultiplier;
    } else if (selectedTerpene === "Linalool") {
      calm += 38 * activeMultiplier;
      focus *= 1 - 0.1 * activeMultiplier;
    } else if (selectedTerpene === "Pinene") {
      focus += 28 * activeMultiplier;
    } else if (selectedTerpene === "Caryophyllene") {
      calm += 18 * activeMultiplier;
      physicalRelief += 10 * activeMultiplier;
    }

    calm = Math.min(100, calm);
    euphoria = Math.min(100, euphoria);
    focus = Math.min(100, focus);

    // Generate clinical entourage description profiles
    const ratio = cbd / (thc || 0.1);
    if (thc <= 3 && cbd >= 12) {
      therapeuticVibe = "Mega Chill & Body Relaxation (High CBD)";
      medicalSummary = `This blend is loaded with CBD and barely has any THC (about a 1:${ratio.toFixed(1)} ratio), meaning you won't get stoned or foggy. It is absolutely perfect for melting away body stress, loosening up tight muscles, and cooling down after a crazy day with a pristine, clear mind.`;
    } else if (thc > 27 && selectedTerpene === "Myrcene" && cbd < 5) {
      therapeuticVibe = "Couchlock & Deep Sleep (High THC)";
      medicalSummary = `This is high-octane weed maxed out on THC (${thc}%) and packed with Myrcene. It is the ultimate "couchlock" vibe. Best saved for late night when you want to melt into the cushions, grab some snacks, and pass out for a stellar night of deep sleep.`;
    } else if (thc > 25 && selectedTerpene === "Pinene") {
      therapeuticVibe = "Creative Head Buzz & Clean Focus (THC + Pinene)";
      medicalSummary = `A high THC level combined with Pinene creates a super crisp, uplifting head buzz. The Pinene acts as a shield against standard weed "brain fog," leaving you feeling sharp, happy, inspired, and energetic enough to create things.`;
    } else if (thc > 10 && thc < 18 && cbd > 10 && cbd < 20) {
      therapeuticVibe = "Smooth & Balanced 1:1 Mix (Chill & Creative)";
      medicalSummary = `This is the absolute sweet spot for a well-balanced session. A perfect equal mix of THC and CBD where the CBD naturally softens any heavy head rushes, preventing heart-racing or paranoia and leaving you in a very warm, cozy, and happy state.`;
    } else if (cbd < 4 && thc < 6) {
      therapeuticVibe = "Microdose Buzz (Mild & Productive)";
      medicalSummary =
        "Just a tiny pinch of both THC and CBD to elevate your day. It is created to give you a very subtle mood lift and light body relaxation while keeping you 100% sharp, operational, and active.";
    } else {
      therapeuticVibe = "Custom Hybrid Vibe";
      medicalSummary = `You've dialed in a custom hybrid blend! Pinpointing ${selectedTerpene} at ${terpeneConcentration}% shapes your high, working together with your THC (${thc}%) and CBD (${cbd}%) to create a personalized, custom smoke session.`;
    }

    return {
      euphoria: Math.round(euphoria),
      calm: Math.round(calm),
      focus: Math.round(focus),
      physicalRelief: Math.round(physicalRelief),
      vibe: therapeuticVibe,
      summary: medicalSummary,
      ratioText:
        ratio > 20
          ? "Pure Relaxation (CBD)"
          : ratio < 0.05
            ? "Strong Head Buzz (THC)"
            : `Smooth 1:1 Hybrid Mix`,
    };
  }, [thc, cbd, selectedTerpene, terpeneConcentration]);

  return (
    <div
      id="chem-workbench"
      className="p-5 md:p-9 pb-24 md:pb-32 bg-[var(--bg-surface)] border border-[var(--border-regular)] rounded-2xl md:rounded-3xl space-y-6 md:space-y-8 shadow-2xl relative overflow-hidden"
    >
      {/* Upper Status Bar */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <span className="text-[10px] md:text-xs font-mono tracking-wider text-emerald-600 dark:text-[#b87333] uppercase bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] px-3 md:px-4 py-1.5 md:py-2 rounded-full flex items-center gap-2 font-bold">
          <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
          Simulator Ready
        </span>
        <div className="text-[10px] md:text-xs font-mono font-bold uppercase text-[var(--text-primary)] tracking-wider bg-emerald-500/10 border border-emerald-500/20 px-3 md:px-4 py-1.5 md:py-2 rounded-full">
          Synergy Index:{" "}
          <span className="text-emerald-600 dark:text-[#b87335] font-black">
            {(thc + cbd + terpeneConcentration * 4.5).toFixed(1)}
          </span>
        </div>
      </div>

      <div className="space-y-2 text-left">
        <h3 className="font-display text-xl md:text-3xl font-black text-[var(--text-primary)] flex items-center gap-2.5">
          <Sliders className="w-5 h-5 md:w-6 md:h-6 text-emerald-500 animate-pulse-slow" />
          Breakdown Simulator
        </h3>
        <p className="text-xs md:text-base text-[var(--text-secondary)] font-sans font-medium max-w-3xl leading-relaxed">
          Slide the controls to adjust THC, CBD, and terpene levels. Watch how
          the mix shapes your overall session vibe.
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-12 gap-8"
      >
        {/* Left Side: Dynamic Sliders and Terpenes */}
        <motion.div variants={itemVariants} className="lg:col-span-7 space-y-7">
          {/* Vibe Presets Quick Select */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[10px] font-mono tracking-[0.2em] text-[var(--text-muted)] uppercase font-black">
                Optimized Presets
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {VIBE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => applyPreset(preset)}
                  className="px-2.5 md:px-3 py-1 md:py-1.5 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] hover:border-emerald-500/50 hover:bg-emerald-500/5 text-[9px] md:text-[10px] font-mono font-bold text-[var(--text-secondary)] hover:text-emerald-500 transition-all cursor-pointer uppercase tracking-tight"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cannabinoid Sliders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* THC slider */}
            <div className="space-y-3 bg-[var(--bg-surface-elevated)] p-4 md:p-5 border border-[var(--border-subtle)] rounded-xl relative group">
              <div className="flex justify-between items-center">
                <span className="text-[10px] md:text-sm font-mono tracking-wider text-[var(--text-secondary)] font-bold uppercase flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-rose-500" />
                  THC (Head)
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-sm md:text-lg font-mono text-rose-600 dark:text-red-455 font-black">
                    {thc}%
                  </span>
                </div>
              </div>

              <div className="relative h-7 md:h-5 mt-2 bg-slate-200/50 dark:bg-[var(--bg-main)] border border-[var(--border-subtle)] rounded-full flex items-center px-1">
                <div className="flex-1 h-2 md:h-2.5 overflow-hidden rounded-full bg-slate-300/30 dark:bg-black/20">
                  <motion.div
                    className="h-full bg-gradient-to-r from-rose-400 to-rose-600 rounded-full"
                    animate={{ width: `${(thc / 30) * 100}%` }}
                    transition={{ type: "spring", stiffness: 85, damping: 14 }}
                  />
                </div>
                {/* Visual Thumb */}
                <motion.div
                  className="absolute top-1/2 w-6 h-6 md:w-5 md:h-5 bg-white border-2 border-rose-500 rounded-full shadow-lg pointer-events-none z-20"
                  animate={{
                    left: `${(thc / 30) * 100}%`,
                    x: thc < 2 ? 0 : thc > 28 ? -24 : -12,
                    y: "-50%",
                    scale: isThcDragging ? 1.3 : 1,
                    boxShadow: isThcDragging
                      ? "0 0 20px rgba(244, 63, 94, 0.5)"
                      : "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: isThcDragging ? 400 : 300,
                    damping: 30,
                  }}
                />
                <input
                  type="range"
                  min="0"
                  max="30"
                  step="1"
                  value={thc}
                  onChange={(e) => setThc(Number(e.target.value))}
                  onPointerDown={() => setIsThcDragging(true)}
                  onPointerUp={() => setIsThcDragging(false)}
                  onPointerCancel={() => setIsThcDragging(false)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30 
                             [&::-webkit-slider-thumb]:w-10 [&::-webkit-slider-thumb]:h-10 
                             [&::-moz-range-thumb]:w-10 [&::-moz-range-thumb]:h-10"
                />
              </div>
            </div>

            {/* CBD slider */}
            <div className="space-y-3 bg-[var(--bg-surface-elevated)] p-4 md:p-5 border border-[var(--border-subtle)] rounded-xl relative group">
              <div className="flex justify-between items-center">
                <span className="text-[10px] md:text-sm font-mono tracking-wider text-[var(--text-secondary)] font-bold uppercase flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-cyan-500" />
                  CBD (Body)
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-sm md:text-lg font-mono text-cyan-600 dark:text-cyan-400 font-black">
                    {cbd}%
                  </span>
                </div>
              </div>

              <div className="relative h-7 md:h-5 mt-2 bg-slate-200/50 dark:bg-[var(--bg-main)] border border-[var(--border-subtle)] rounded-full flex items-center px-1">
                <div className="flex-1 h-2 md:h-2.5 overflow-hidden rounded-full bg-slate-300/30 dark:bg-black/20">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-full"
                    animate={{ width: `${(cbd / 30) * 100}%` }}
                    transition={{ type: "spring", stiffness: 85, damping: 14 }}
                  />
                </div>
                {/* Visual Thumb */}
                <motion.div
                  className="absolute top-1/2 w-6 h-6 md:w-5 md:h-5 bg-white border-2 border-cyan-500 rounded-full shadow-lg pointer-events-none z-20"
                  animate={{
                    left: `${(cbd / 30) * 100}%`,
                    x: cbd < 2 ? 0 : cbd > 28 ? -24 : -12,
                    y: "-50%",
                    scale: isCbdDragging ? 1.3 : 1,
                    boxShadow: isCbdDragging
                      ? "0 0 20px rgba(6, 182, 212, 0.5)"
                      : "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: isCbdDragging ? 400 : 300,
                    damping: 30,
                  }}
                />
                <input
                  type="range"
                  min="0"
                  max="30"
                  step="1"
                  value={cbd}
                  onChange={(e) => setCbd(Number(e.target.value))}
                  onPointerDown={() => setIsCbdDragging(true)}
                  onPointerUp={() => setIsCbdDragging(false)}
                  onPointerCancel={() => setIsCbdDragging(false)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30
                             [&::-webkit-slider-thumb]:w-10 [&::-webkit-slider-thumb]:h-10 
                             [&::-moz-range-thumb]:w-10 [&::-moz-range-thumb]:h-10"
                />
              </div>
            </div>
          </div>

          {/* Terpene concentration slider */}
          <div className="space-y-3 bg-[var(--bg-surface-elevated)] p-4 md:p-5 border border-[var(--border-subtle)] rounded-xl relative group">
            <div className="flex justify-between items-center">
              <span className="text-xs md:text-sm font-mono tracking-wider text-[var(--text-secondary)] font-bold uppercase flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                Terpene Levels (Taste & Aroma)
              </span>
              <span className="text-base md:text-lg font-mono text-amber-500 font-black drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]">
                {terpeneConcentration}%
              </span>
            </div>

            {/* Tactile Range Slider Segment */}
            <div className="relative h-8 md:h-6 mt-2.5 bg-slate-200/50 dark:bg-[var(--bg-main)] border border-[var(--border-subtle)] rounded-full flex items-center px-1">
              <div className="flex-1 h-3 md:h-4 overflow-hidden rounded-full bg-slate-300/30 dark:bg-black/20">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                  animate={{ width: `${(terpeneConcentration / 5) * 100}%` }}
                  transition={{
                    type: "spring",
                    stiffness: 85,
                    damping: 14,
                    mass: 0.8,
                  }}
                />
              </div>
              {/* Visual Thumb */}
              <motion.div
                className="absolute top-1/2 w-7 h-7 md:w-6 md:h-6 bg-white border-2 border-amber-500 rounded-full shadow-lg pointer-events-none z-20"
                animate={{
                  left: `${(terpeneConcentration / 5) * 100}%`,
                  x:
                    terpeneConcentration < 0.3
                      ? 0
                      : terpeneConcentration > 4.7
                        ? -28
                        : -14,
                  y: "-50%",
                  scale: isTerpDragging ? 1.3 : 1,
                  boxShadow: isTerpDragging
                    ? "0 0 25px rgba(245, 158, 11, 0.6)"
                    : "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                transition={{
                  type: "spring",
                  stiffness: isTerpDragging ? 400 : 300,
                  damping: 30,
                }}
              />
              <input
                id="slider-terp"
                type="range"
                min="0.1"
                max="5.0"
                step="0.1"
                value={terpeneConcentration}
                onChange={(e) =>
                  setTerpeneConcentration(Number(e.target.value))
                }
                onPointerDown={() => setIsTerpDragging(true)}
                onPointerUp={() => setIsTerpDragging(false)}
                onPointerCancel={() => setIsTerpDragging(false)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30
                           [&::-webkit-slider-thumb]:w-12 [&::-webkit-slider-thumb]:h-12 
                           [&::-moz-range-thumb]:w-12 [&::-moz-range-thumb]:h-12"
              />
            </div>

            <div className="flex justify-between text-[10px] font-mono text-[var(--text-muted)] uppercase font-medium transition-all pt-0.5">
              <span>0.1% Light</span>
              <span>2.5% Tasty</span>
              <span>5.0% Dank</span>
            </div>
          </div>

          {/* Terpene selections */}
          <div className="space-y-3">
            <label className="text-xs md:text-sm font-semibold tracking-wider text-[#b87333] uppercase block text-glow">
              Pick a Terpene for Your Stash
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 bg-[var(--bg-surface-elevated)] p-2.5 border border-[var(--border-subtle)] rounded-xl">
              {terpenes.map((t) => {
                const isActive = selectedTerpene === t.name;
                return (
                  <button
                    id={`btn-terpene-${t.name.toLowerCase()}`}
                    key={t.name}
                    type="button"
                    onClick={() => setSelectedTerpene(t.name)}
                    className={`p-2.5 rounded-lg border text-center cursor-pointer transition-all duration-300 ${
                      isActive
                        ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-600 dark:text-emerald-300 shadow-md font-bold"
                        : "bg-[var(--bg-main)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-emerald-500/30 hover:text-emerald-500"
                    }`}
                  >
                    <div className="text-xs md:text-sm font-display font-bold block leading-normal">
                      {t.name}
                    </div>
                    <div className="text-[10px] text-gray-400 font-mono mt-1 leading-normal">
                      {t.description.split(",")[0]}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Terpene details */}
          {selectedTerpene && (
            <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-xl flex gap-4 items-start relative overflow-hidden backdrop-blur-sm">
              <span className="p-2.5 bg-emerald-500/10 rounded-lg text-emerald-600 dark:text-emerald-300 text-xs font-mono font-black border border-emerald-500/20 shrink-0">
                {selectedTerpene.substring(0, 3).toUpperCase()}
              </span>
              <div className="space-y-1 text-left">
                <div className="text-sm md:text-base font-display font-bold text-[var(--text-primary)] flex items-center gap-2 leading-tight">
                  {selectedTerpene}
                </div>
                <p className="text-[11px] md:text-sm text-[var(--text-secondary)] font-sans font-medium leading-relaxed">
                  {terpenes.find((p) => p.name === selectedTerpene)?.role}
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Right Side: Particle Bonding Screen & Clinical Outcomes */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-5 flex flex-col gap-6"
        >
          {/* molecular animation panel */}
          <motion.div
            variants={itemVariants}
            className="bg-[var(--bg-surface-elevated)] rounded-xl border border-[var(--border-subtle)] p-4 flex flex-col space-y-3 relative min-h-[240px] shadow-sm"
          >
            <div className="flex justify-between items-center pb-2 border-b border-[var(--border-subtle)] relative z-10">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-[#b87333] font-bold flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                Molecular Activity
              </span>
            </div>

            {/* Canvas Container */}
            <div className="flex-1 min-h-[160px] rounded-lg bg-[var(--bg-main)] relative overflow-hidden border border-[var(--border-subtle)]">
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full block"
              />
            </div>
          </motion.div>

          {/* Clinical Outcomes Cards */}
          <motion.div
            variants={itemVariants}
            className="bg-[var(--bg-surface-elevated)] rounded-xl p-5 md:p-6 border border-[var(--border-subtle)] flex flex-col justify-between space-y-6 relative overflow-hidden shadow-sm"
          >
            <div className="space-y-4">
              <div className="pb-3 border-b border-[var(--border-subtle)] space-y-1 text-left">
                <span className="text-[10px] md:text-sm font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-300 font-bold flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-500" />
                  Outcome
                </span>
                <h4 className="font-display text-sm md:text-xl font-extrabold text-[var(--text-primary)] tracking-tight">
                  {analysis.vibe}
                </h4>
              </div>

              <p className="text-[11px] md:text-sm text-[var(--text-secondary)] font-sans font-medium leading-relaxed text-left">
                {analysis.summary}
              </p>
            </div>

            {/* Pharmacognosy Projection Indices */}
            <div className="space-y-4 pt-4 border-t border-[var(--border-subtle)] text-left">
              {[
                {
                  label: "BODY CALM",
                  val: analysis.calm,
                  color: "bg-rose-500",
                },
                {
                  label: "MENTAL FOCUS",
                  val: analysis.focus,
                  color: "bg-emerald-500",
                },
                {
                  label: "PHYSICAL SOOTHE",
                  val: analysis.physicalRelief,
                  color: "bg-cyan-500",
                },
                {
                  label: "EUPHORIA",
                  val: analysis.euphoria,
                  color: "bg-amber-500",
                },
              ].map((eff) => (
                <div key={eff.label} className="space-y-1.5">
                  <div className="flex justify-between text-[var(--text-primary)] font-bold font-mono text-[9px] md:text-xs">
                    <span>{eff.label}</span>
                    <span>{eff.val}%</span>
                  </div>
                  <div className="h-1.5 bg-[var(--bg-main)] rounded-full overflow-hidden border border-[var(--border-subtle)]">
                    <motion.div
                      className={`h-full ${eff.color}`}
                      animate={{ width: `${eff.val}%` }}
                      transition={{
                        type: "spring",
                        stiffness: 95,
                        damping: 15,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Save Mix Panel */}
            <div className="mt-4 p-4 bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/20 rounded-xl space-y-3 text-left">
              <input
                type="text"
                placeholder="Name your mix..."
                value={customMixName}
                onChange={(e) => setCustomMixName(e.target.value)}
                className="w-full bg-[var(--bg-main)] border border-[var(--border-regular)] rounded-xl px-3.5 h-9 text-xs text-[var(--text-primary)] outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveMix}
                  disabled={!customMixName.trim() || saveSuccess}
                  className="flex-1 h-9 flex items-center justify-center rounded-xl text-[10px] font-black bg-emerald-600 text-white disabled:opacity-50"
                >
                  {saveSuccess ? "Saved!" : "Save to Stash"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
