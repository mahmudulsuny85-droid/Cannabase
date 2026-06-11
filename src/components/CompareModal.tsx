import { motion } from "motion/react";
import { X, Leaf, Compass } from "lucide-react";
import { Strain } from "../types";
import { CompoundTooltip } from "./CompoundTooltip";
import { getBenefitIcon } from "../utils/ui";

interface CompareModalProps {
  strainA: Strain;
  strainB: Strain;
  onClose: () => void;
}

export default function CompareModal({
  strainA,
  strainB,
  onClose,
}: CompareModalProps) {
  return (
    <div
      id="compare-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        id="compare-modal"
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl bg-[#080d0a]/95 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Glow Decors */}
        <div className="absolute top-0 left-1/4 w-[250px] h-[250px] bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[250px] h-[250px] bg-[#b87333]/10 rounded-full blur-[80px] pointer-events-none" />

        {/* Modal Header */}
        <div className="flex justify-between items-start border-b border-white/10 pb-4 mb-6 z-10 relative">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-[#b87333] uppercase font-bold block">
              Comparative Analysis
            </span>
            <h2 className="text-xl md:text-2xl font-bold font-sans text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-400" />
              Cultivar Side-by-Side Comparison
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-white/5 hover:bg-white/15 text-white/70 hover:text-white rounded-full transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto scrollbar-hidden space-y-8 flex-1 pr-1">
          {/* Main Titles / Quick Info Grid */}
          <div className="grid grid-cols-2 gap-4 pb-6 border-b border-white/10">
            {/* Strain A Title */}
            <div className="p-4 bg-white/[0.02] border border-white/10 rounded-2xl relative">
              <div className="absolute top-2 right-2 px-2 py-0.5 bg-emerald-900 border border-emerald-400 text-[9px] font-mono font-bold text-emerald-200 rounded uppercase">
                {strainA.type.split("-")[0]}
              </div>
              <span className="text-[9px] font-mono text-[#b87333] font-bold uppercase block">
                SUBJECT ALPHA
              </span>
              <h3 className="text-lg md:text-xl font-bold text-white mt-1 flex items-center gap-1.5 leading-tight">
                <Leaf className="w-4.5 h-4.5 text-[#b87333]" />
                {strainA.name}
              </h3>
              <p className="text-[10px] text-gray-200 font-mono mt-2 leading-relaxed italic block">
                Parentage: {strainA.parentage.join(" × ")}
              </p>
            </div>

            {/* Strain B Title */}
            <div className="p-4 bg-white/[0.02] border border-white/10 rounded-2xl relative">
              <div className="absolute top-2 right-2 px-2 py-0.5 bg-emerald-900 border border-emerald-400 text-[9px] font-mono font-bold text-emerald-200 rounded uppercase">
                {strainB.type.split("-")[0]}
              </div>
              <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase block">
                SUBJECT BETA
              </span>
              <h3 className="text-lg md:text-xl font-bold text-white mt-1 flex items-center gap-1.5 leading-tight">
                <Leaf className="w-4.5 h-4.5 text-emerald-400" />
                {strainB.name}
              </h3>
              <p className="text-[10px] text-gray-200 font-mono mt-2 leading-relaxed italic block">
                Parentage: {strainB.parentage.join(" × ")}
              </p>
            </div>
          </div>

          {/* section: Chemical Potency side-by-side */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono font-extrabold text-emerald-400 uppercase tracking-widest block text-center text-glow">
              Cannabinoid Concentrations
            </h4>

            <div className="grid grid-cols-2 gap-6 p-4 bg-black/40 border border-white/10 rounded-2xl">
              {/* Product A Cannabinoids */}
              <div className="space-y-4">
                {/* THC gauge */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <CompoundTooltip compoundKey="thc">
                      <span className="text-white/80 cursor-help border-b border-dashed border-white/30 hover:border-amber-400">THC Concentration</span>
                    </CompoundTooltip>
                    <span className="text-amber-400 font-bold">
                      {strainA.cannabinoids.thc} ({strainA.thcValue}%)
                    </span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full"
                      style={{
                        width: `${Math.min((strainA.thcValue / 30) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* CBD gauge */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <CompoundTooltip compoundKey="cbd">
                      <span className="text-white/80 cursor-help border-b border-dashed border-white/30 hover:border-emerald-400">CBD Concentration</span>
                    </CompoundTooltip>
                    <span className="text-emerald-400 font-bold">
                      {strainA.cannabinoids.cbd} ({strainA.cbdValue}%)
                    </span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full"
                      style={{
                        width: `${Math.min((strainA.cbdValue / 30) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Product B Cannabinoids */}
              <div className="space-y-4 border-l border-white/5 pl-6">
                {/* THC gauge */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <CompoundTooltip compoundKey="thc">
                      <span className="text-white/80 cursor-help border-b border-dashed border-white/30 hover:border-amber-400">THC Concentration</span>
                    </CompoundTooltip>
                    <span className="text-amber-400 font-bold">
                      {strainB.cannabinoids.thc} ({strainB.thcValue}%)
                    </span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full"
                      style={{
                        width: `${Math.min((strainB.thcValue / 30) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* CBD gauge */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <CompoundTooltip compoundKey="cbd">
                      <span className="text-white/80 cursor-help border-b border-dashed border-white/30 hover:border-emerald-400">CBD Concentration</span>
                    </CompoundTooltip>
                    <span className="text-emerald-400 font-bold">
                      {strainB.cannabinoids.cbd} ({strainB.cbdValue}%)
                    </span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full"
                      style={{
                        width: `${Math.min((strainB.cbdValue / 30) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* section: Key Benefits list with distinct icons */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono font-extrabold text-[#b87333] uppercase tracking-widest block text-center">
              Target Academic Benefits
            </h4>

            <div className="grid grid-cols-2 gap-6">
              {/* Strain A Benefits */}
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  {strainA.benefits.map((benefit) => (
                    <div
                      key={benefit}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-950/20 border border-emerald-500/20 rounded-xl text-xs text-white font-medium"
                    >
                      {getBenefitIcon(benefit)}
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strain B Benefits */}
              <div className="space-y-2 border-l border-white/10 pl-6">
                <div className="flex flex-wrap gap-1.5">
                  {strainB.benefits.map((benefit) => (
                    <div
                      key={benefit}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-950/20 border border-emerald-500/20 rounded-xl text-xs text-white font-medium"
                    >
                      {getBenefitIcon(benefit)}
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* section: Primary Terpenes comparison */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono font-extrabold text-emerald-400 uppercase tracking-widest block text-center">
              Terpene Formulations
            </h4>

            <div className="grid grid-cols-2 gap-6">
              {/* Strain A Terpenes */}
              <div className="space-y-3 bg-black/40 p-4 border border-white/10 rounded-2xl">
                {strainA.terpenes.map((terp) => {
                  const val = Math.min((terp.percentage / 0.8) * 100, 100);
                  return (
                    <div key={terp.name} className="space-y-1">
                      <div className="flex justify-between text-[11px] font-mono">
                        <CompoundTooltip compoundKey={terp.name}>
                          <strong className="text-white font-semibold cursor-help border-b border-dashed border-white/30 hover:border-[#b87333]">
                            {terp.name}
                          </strong>
                        </CompoundTooltip>
                        <span className="text-amber-400 font-bold">
                          {(terp.percentage * 100).toFixed(2)}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden relative">
                        <motion.div
                          className="h-full bg-gradient-to-r from-emerald-450 to-[#b87333] rounded-full absolute top-0 left-0"
                          initial={{ width: 0 }}
                          animate={{ width: `${val}%` }}
                          transition={{ duration: 1.0, ease: "easeOut" }}
                        />
                      </div>
                      <div className="text-[10px] text-gray-200 font-sans italic font-medium leading-tight">
                        {terp.effect}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Strain B Terpenes */}
              <div className="space-y-3 bg-black/40 p-4 border border-white/10 rounded-2xl">
                {strainB.terpenes.map((terp) => {
                  const val = Math.min((terp.percentage / 0.8) * 100, 100);
                  return (
                    <div key={terp.name} className="space-y-1">
                      <div className="flex justify-between text-[11px] font-mono">
                        <CompoundTooltip compoundKey={terp.name}>
                          <strong className="text-white font-semibold cursor-help border-b border-dashed border-white/30 hover:border-[#b87333]">
                            {terp.name}
                          </strong>
                        </CompoundTooltip>
                        <span className="text-amber-400 font-bold">
                          {(terp.percentage * 100).toFixed(2)}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden relative">
                        <motion.div
                          className="h-full bg-gradient-to-r from-emerald-450 to-[#b87333] rounded-full absolute top-0 left-0"
                          initial={{ width: 0 }}
                          animate={{ width: `${val}%` }}
                          transition={{ duration: 1.0, ease: "easeOut" }}
                        />
                      </div>
                      <div className="text-[10px] text-gray-200 font-sans italic font-medium leading-tight">
                        {terp.effect}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* section: Cultivation side-by-side */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono font-extrabold text-[#b87333] uppercase tracking-widest block text-center">
              Cultivation parameters
            </h4>

            <div className="grid grid-cols-2 gap-6 bg-white/[0.01] border border-white/10 p-4 rounded-2xl">
              {/* Strain A metrics */}
              <div className="grid grid-cols-2 gap-4 text-xs font-sans">
                <div className="bg-black/30 p-2.5 rounded-xl border border-white/10">
                  <span className="text-[9px] font-mono text-emerald-400 block font-bold uppercase">
                    Difficulty
                  </span>
                  <span className="text-white font-semibold">
                    {strainA.cultivation.difficulty}
                  </span>
                </div>
                <div className="bg-black/30 p-2.5 rounded-xl border border-white/10">
                  <span className="text-[9px] font-mono text-emerald-400 block font-bold uppercase">
                    Flowering Time
                  </span>
                  <span className="text-white font-semibold">
                    {strainA.cultivation.floweringTime}
                  </span>
                </div>
                <div className="bg-black/30 p-2.5 rounded-xl border border-white/10 col-span-2">
                  <span className="text-[9px] font-mono text-emerald-400 block font-bold uppercase">
                    Preferred Climate
                  </span>
                  <span className="text-white font-semibold truncate block">
                    {strainA.cultivation.preferredClimate}
                  </span>
                </div>
              </div>

              {/* Strain B metrics */}
              <div className="grid grid-cols-2 gap-4 text-xs font-sans border-l border-white/10 pl-6">
                <div className="bg-black/30 p-2.5 rounded-xl border border-white/10">
                  <span className="text-[9px] font-mono text-emerald-400 block font-bold uppercase">
                    Difficulty
                  </span>
                  <span className="text-white font-semibold">
                    {strainB.cultivation.difficulty}
                  </span>
                </div>
                <div className="bg-black/30 p-2.5 rounded-xl border border-white/10">
                  <span className="text-[9px] font-mono text-emerald-400 block font-bold uppercase">
                    Flowering Time
                  </span>
                  <span className="text-white font-semibold">
                    {strainB.cultivation.floweringTime}
                  </span>
                </div>
                <div className="bg-black/30 p-2.5 rounded-xl border border-white/10 col-span-2">
                  <span className="text-[9px] font-mono text-emerald-400 block font-bold uppercase">
                    Preferred Climate
                  </span>
                  <span className="text-white font-semibold truncate block">
                    {strainB.cultivation.preferredClimate}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* description side-by-side */}
          <div className="grid grid-cols-2 gap-6 italic">
            <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-2xl text-xs text-white leading-relaxed font-sans font-medium">
              "{strainA.description}"
            </div>
            <div className="p-4 bg-[#b87333]/10 border border-[#b87333]/30 rounded-2xl text-xs text-white leading-relaxed font-sans font-medium">
              "{strainB.description}"
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-6 border-t border-white/10 pt-4 flex justify-between items-center z-10 relative text-xs">
          <div className="text-gray-300 font-mono font-medium">
            Comparing{" "}
            <span className="text-white font-bold">{strainA.name}</span> and{" "}
            <span className="text-white font-bold">{strainB.name}</span>
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-emerald-500 text-black hover:bg-emerald-400 font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
          >
            Finished Analyzing
          </button>
        </div>
      </motion.div>
    </div>
  );
}
