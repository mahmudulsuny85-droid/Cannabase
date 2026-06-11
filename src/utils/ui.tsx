import {
  Target,
  Brain,
  Smile,
  Shield,
  Activity,
  Palette,
  Sparkles,
  Heart,
  Moon,
  Zap,
  Users,
  Award,
} from "lucide-react";

export const getBenefitIcon = (benefit: string) => {
  const norm = benefit.toLowerCase();
  if (norm.includes("focus"))
    return <Target className="w-3.5 h-3.5 text-blue-400" />;
  if (
    norm.includes("clarity") ||
    norm.includes("cognitive") ||
    norm.includes("uplift")
  )
    return <Brain className="w-3.5 h-3.5 text-indigo-400" />;
  if (
    norm.includes("calm") ||
    norm.includes("comfort") ||
    norm.includes("peace")
  )
    return <Smile className="w-3.5 h-3.5 text-emerald-400" />;
  if (
    norm.includes("inflammation") ||
    norm.includes("immune") ||
    norm.includes("shield")
  )
    return <Shield className="w-3.5 h-3.5 text-teal-400" />;
  if (
    norm.includes("pain") ||
    norm.includes("tension") ||
    norm.includes("muscle") ||
    norm.includes("relaxation")
  )
    return <Activity className="w-3.5 h-3.5 text-amber-400" />;
  if (
    norm.includes("creative") ||
    norm.includes("flow") ||
    norm.includes("drive")
  )
    return <Palette className="w-3.5 h-3.5 text-[#b87333]" />;
  if (
    norm.includes("euphoria") ||
    norm.includes("mood") ||
    norm.includes("uplift")
  )
    return <Sparkles className="w-3.5 h-3.5 text-amber-300" />;
  if (
    norm.includes("stress") ||
    norm.includes("reduction") ||
    norm.includes("anxiety")
  )
    return <Heart className="w-3.5 h-3.5 text-[#b87333]" />;
  if (norm.includes("insomnia") || norm.includes("sleep"))
    return <Moon className="w-3.5 h-3.5 text-purple-400" />;
  if (norm.includes("energy"))
    return <Zap className="w-3.5 h-3.5 text-yellow-400" />;
  if (norm.includes("social") || norm.includes("engagement"))
    return <Users className="w-3.5 h-3.5 text-sky-400" />;
  return <Award className="w-3.5 h-3.5 text-emerald-400" />;
};

export const pageTurnVariants = {
  initial: {
    opacity: 0,
    rotateY: -35,
    scale: 0.95,
    transformOrigin: "left center",
  },
  animate: {
    opacity: 1,
    rotateY: 0,
    scale: 1,
    transformOrigin: "left center",
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1] as any,
    },
  },
  exit: {
    opacity: 0,
    rotateY: 35,
    scale: 0.95,
    transformOrigin: "right center",
    transition: {
      duration: 0.45,
      ease: [0.25, 0, 0.35, 1] as any,
    },
  },
};
