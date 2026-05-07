import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

interface Props {
  seconds: number;
  onTimeout: () => void;
  resetKey: string | number;
}

export default function Timer({ seconds, onTimeout, resetKey }: Props) {
  const [left, setLeft] = useState(seconds);

  useEffect(() => {
    setLeft(seconds);
  }, [resetKey, seconds]);

  useEffect(() => {
    if (left <= 0) {
      onTimeout();
      return;
    }
    const id = setTimeout(() => setLeft((v) => v - 1), 1000);
    return () => clearTimeout(id);
  }, [left, onTimeout]);

  const pct = (left / seconds) * 100;
  const danger = left <= 10;
  const mm = Math.floor(left / 60).toString().padStart(2, "0");
  const ss = (left % 60).toString().padStart(2, "0");

  return (
    <div className="flex items-center gap-3">
      <motion.div
        animate={danger ? { scale: [1, 1.08, 1] } : { scale: 1 }}
        transition={danger ? { repeat: Infinity, duration: 0.8 } : {}}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-mono text-sm border ${
          danger ? "bg-red-500/10 text-red-500 border-red-500/30" : "bg-muted/50 border-border"
        }`}
      >
        <Clock className="w-4 h-4" />
        {mm}:{ss}
      </motion.div>
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden hidden sm:block">
        <motion.div
          className={`h-full rounded-full ${danger ? "bg-red-500" : "bg-primary"}`}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>
    </div>
  );
}