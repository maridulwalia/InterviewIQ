import { motion } from "framer-motion";

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <motion.div
        className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        style={{ borderWidth: 3 }}
      />
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="glass-card p-6 space-y-3">
      <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
      <div className="h-3 w-full bg-muted rounded animate-pulse" />
      <div className="h-3 w-4/5 bg-muted rounded animate-pulse" />
    </div>
  );
}
