import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, CheckCircle, MessageSquare } from "lucide-react";
import AnimatedPage from "@/components/AnimatedPage";
import { LoadingSpinner } from "@/components/LoadingSkeleton";
import { interviewApi } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface Question {
  _id: string;
  text: string;
  type: string;
}

export default function Interview() {
  const [questions, setQuestions] = useState<Question[]>(() => {
    const saved = sessionStorage.getItem("interviewQuestions");
    return saved ? JSON.parse(saved) : [];
  });
  const [index, setIndex] = useState(() => {
    const savedIdx = sessionStorage.getItem("interviewIndex");
    return savedIdx ? parseInt(savedIdx, 10) : 0;
  });
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(questions.length === 0);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (questions.length > 0) return; // Skip fetch if restored from session

    interviewApi.getQuestions()
      .then(({ data }) => {
        const fetchQuestions = data.questions || data;
        setQuestions(fetchQuestions);
        sessionStorage.setItem("interviewQuestions", JSON.stringify(fetchQuestions));
        sessionStorage.setItem("interviewIndex", "0");
      })
      .catch(() => toast({ title: "Failed to load questions", variant: "destructive" }))
      .finally(() => setLoading(false));
  }, [toast, questions.length]);

  const current = questions[index];

  const handleNext = async () => {
    if (!answer.trim()) {
      toast({ title: "Please write your answer", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      await interviewApi.submitAnswer({ questionId: current._id, answer: answer });
      if (index + 1 < questions.length) {
        const nextIdx = index + 1;
        setIndex(nextIdx);
        sessionStorage.setItem("interviewIndex", nextIdx.toString());
        setAnswer("");
      } else {
        setDone(true);
        sessionStorage.removeItem("interviewQuestions");
        sessionStorage.removeItem("interviewIndex");
      }
    } catch {
      toast({ title: "Submission failed", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <AnimatedPage><LoadingSpinner /></AnimatedPage>;

  if (done) {
    return (
      <AnimatedPage>
        <div className="container mx-auto px-4 py-20 max-w-lg text-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring" }}>
            <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Interview Complete!</h1>
            <p className="text-muted-foreground">Great job! Your answers have been submitted.</p>
          </motion.div>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              Question {index + 1} of {questions.length}
            </span>
          </div>
          <div className="h-2 flex-1 ml-4 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "var(--gradient-primary)" }}
              animate={{ width: `${((index + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35 }}
            className="glass-card p-8"
          >
            <h2 className="text-lg font-semibold mb-6">{current?.text}</h2>
            <motion.textarea
              whileFocus={{ scale: 1.01 }}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here..."
              rows={6}
              className="input-focus resize-none font-sans"
            />
          </motion.div>
        </AnimatePresence>

        <motion.div className="mt-6 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNext}
            disabled={submitting}
            className="btn-primary-glow px-8 py-3 flex items-center gap-2 disabled:opacity-50"
          >
            {submitting ? (
              <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="inline-block w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full" />
            ) : (
              <>
                {index + 1 < questions.length ? "Next" : "Finish"}
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </motion.div>
      </div>
    </AnimatedPage>
  );
}
