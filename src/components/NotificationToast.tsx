import { motion, AnimatePresence } from "motion/react";
import { Users } from "lucide-react";

interface NotificationToastProps {
  toast: { id: number; message: string } | null;
  onClose: () => void;
  onClick: () => void;
}

export default function NotificationToast({
  toast,
  onClose,
  onClick,
}: NotificationToastProps) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, x: -50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -50, scale: 0.9 }}
          className="fixed bottom-28 left-10 z-[100] max-w-xs w-full"
        >
          <div
            id="live-circle-toast"
            onClick={onClick}
            className="bg-[#0c1410] border-2 border-emerald-500/40 p-5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] cursor-pointer group hover:border-emerald-500 transition-all relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-[2px] bg-emerald-500 animate-pulse" />
            <div className="flex flex-col gap-3 text-left">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono font-black text-emerald-400 uppercase tracking-widest">
                  Live Circle Update
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                  className="text-[10px] font-mono font-black text-gray-500 hover:text-white uppercase tracking-tighter"
                >
                  DISMISS
                </button>
              </div>
              <p className="text-sm text-white font-sans font-bold leading-snug group-hover:text-emerald-300 transition-colors">
                {toast.message}
              </p>
              <div className="flex items-center gap-2 text-[9px] font-mono font-bold text-[#b87333] uppercase">
                <Users className="w-3 h-3" />
                Interact to Join Lounge
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
