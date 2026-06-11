import { ReactNode, useState } from "react";
import { COMPOUND_GLOSSARY, CompoundGlossaryItem } from "../data/compoundGlossary";

interface CompoundTooltipProps {
  compoundKey: string;
  children: ReactNode;
}

export function CompoundTooltip({ compoundKey, children }: CompoundTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const data = COMPOUND_GLOSSARY[compoundKey] 
    || Object.values(COMPOUND_GLOSSARY).find(c => c.name.toLowerCase() === compoundKey.toLowerCase());

  if (!data) return <>{children}</>;

  return (
    <div
      className="relative inline-block cursor-help group"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute z-50 w-64 p-3 mt-2 text-sm text-[var(--text-primary)] bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-xl shadow-xl -translate-x-1/2 left-1/2 bottom-full mb-2 pointer-events-none fade-in animate-in zoom-in-95 duration-200">
          <div className="space-y-1.5 text-left">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-600 dark:text-emerald-400 font-display">
                {data.name}
              </span>
              <span className="px-1.5 py-0.5 text-[8px] font-mono font-bold uppercase rounded bg-[var(--bg-main)] text-[var(--text-muted)]">
                {data.type}
              </span>
            </div>
            <p className="text-[11px] leading-relaxed text-[var(--text-secondary)] font-sans">
              {data.description}
            </p>
            {data.effects && data.effects.length > 0 && (
              <div className="pt-1 mt-1 border-t border-[var(--border-subtle)]">
                <span className="block text-[9px] font-mono font-bold uppercase text-[var(--text-muted)]">
                  Effects
                </span>
                <p className="text-[10px] text-[var(--text-secondary)]">
                  {data.effects.join(", ")}
                </p>
              </div>
            )}
            {data.medicalBenefits && data.medicalBenefits.length > 0 && (
              <div className="pt-1 mt-1 border-t border-[var(--border-subtle)]">
                <span className="block text-[9px] font-mono font-bold uppercase text-[var(--text-muted)]">
                  Medical Focus
                </span>
                <p className="text-[10px] text-[var(--text-secondary)]">
                  {data.medicalBenefits.join(", ")}
                </p>
              </div>
            )}
          </div>
          {/* subtle arrow */}
          <div className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-[var(--bg-surface-elevated)] border-b border-r border-[var(--border-subtle)] rotate-45" />
        </div>
      )}
    </div>
  );
}
