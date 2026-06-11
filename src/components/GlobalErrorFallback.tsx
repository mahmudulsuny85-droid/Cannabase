import { FallbackProps } from "react-error-boundary";
import { AlertCircle, RefreshCw } from "lucide-react";

export function GlobalErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] h-full p-6 text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/30">
        <AlertCircle className="w-8 h-8 md:w-10 md:h-10" />
      </div>
      
      <div className="space-y-2 max-w-sm">
        <h2 className="text-xl md:text-2xl font-black text-rose-500 uppercase tracking-tight">System Anomaly</h2>
        <p className="text-sm text-[var(--text-secondary)] font-medium">
          A disruption occurred in the active module. Our botanical engineers have been notified.
        </p>
      </div>

      <div className="bg-[var(--bg-surface-elevated)] p-4 rounded-xl border border-[var(--border-subtle)] max-w-md w-full overflow-hidden text-left">
        <p className="text-[10px] font-mono text-rose-400 font-bold break-all">
          {(error as Error).message}
        </p>
      </div>

      <button
        onClick={resetErrorBoundary}
        className="flex items-center gap-2 px-6 py-3 bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface)] text-[var(--text-primary)] font-bold rounded-xl border border-[var(--border-subtle)] hover:border-emerald-500/50 transition-all font-mono tracking-widest text-xs select-none"
      >
        <RefreshCw className="w-4 h-4" />
        RELOAD MODULE
      </button>
    </div>
  );
}
