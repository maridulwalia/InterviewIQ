import { motion } from "framer-motion";
import { Sparkles, AlertTriangle, TrendingUp, ArrowRight } from "lucide-react";
import CountUp from "./CountUp";
import { getScoreColors } from "@/lib/score";
import type { AnswerFeedback } from "@/services/api";

interface Props {
  feedback: AnswerFeedback;
  onNext: () => void;
  isLast: boolean;
}

export default function ResultCard({ feedback, onNext, isLast }: Props) {
  const c = getScoreColors(feedback.score);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 200, damping: 22 }}
      className="glass-card p-8 space-y-6"
    >
      <div className="flex items-center gap-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.1 }}
          className={`relative w-24 h-24 rounded-full ${c.bg} ${c.border} border-2 flex items-center justify-center`}
        >
          <span className={`text-3xl font-bold ${c.text}`}>
            <CountUp to={feedback.score} decimals={feedback.score % 1 ? 1 : 0} />
          </span>
          <span className="absolute -bottom-2 text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-card border border-border">
            /10
          </span>
        </motion.div>
        <div>
          <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${c.bg} ${c.text}`}>
            <Sparkles className="w-3 h-3" /> {c.label}
          </div>
          <h3 className="text-lg font-semibold mt-2">AI Evaluation</h3>
          <p className="text-sm text-muted-foreground">Detailed feedback on your answer</p>
        </div>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="text-sm leading-relaxed bg-muted/40 rounded-lg p-4 border border-border"
      >
        {feedback.feedback}
      </motion.p>

      {feedback.missingPoints?.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            <h4 className="font-semibold text-sm">Missing Points</h4>
          </div>
          <ul className="space-y-2">
            {feedback.missingPoints.map((p, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className="text-sm flex gap-2"
              >
                <span className="text-yellow-500 mt-0.5">•</span>
                <span className="text-muted-foreground">{p}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}

      {feedback.improvementSuggestion && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h4 className="font-semibold text-sm">Improvement Suggestion</h4>
          </div>
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {feedback.improvementSuggestion}
            </p>
          </div>
        </motion.div>
      )}

      <div className="flex justify-end pt-2">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onNext}
          className="btn-primary-glow px-6 py-2.5 flex items-center gap-2"
        >
          {isLast ? "View Results" : "Next Question"}
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}