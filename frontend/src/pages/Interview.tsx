import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, CheckCircle, MessageSquare, Zap, RefreshCw, Settings, List, Terminal, Users, User, BrainCircuit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AnimatedPage from "@/components/AnimatedPage";
import { LoadingSpinner } from "@/components/LoadingSkeleton";
import ResultCard from "@/components/ResultCard";
import Timer from "@/components/Timer";
import { interviewApi, type AnswerFeedback, type InterviewConfig } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface Question {
  _id: string;
  question: string;
  topic?: string;
}

const QUESTION_SECONDS = 90;
const TECH_CATEGORIES = ["DSA", "DBMS", "OS", "CN", "SQL", "OOPs", "System Design"];

export default function Interview() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [setup, setSetup] = useState(true);
  const [role, setRole] = useState("Software Developer");
  const [difficulty, setDifficulty] = useState("MEDIUM");
  
  // New Configuration State
  const [total, setTotal] = useState(10);
  const [technical, setTechnical] = useState(5);
  const [hr, setHr] = useState(2);
  const [behavioral, setBehavioral] = useState(2);
  const [aptitude, setAptitude] = useState(1);
  const [technicalCategories, setTechnicalCategories] = useState<string[]>([]);
  const [regenerate, setRegenerate] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<AnswerFeedback | null>(null);
  const [done, setDone] = useState(false);
  const [mockMode, setMockMode] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const startInterview = async () => {
    setLoading(true);
    setSetup(false);
    try {
      const config: InterviewConfig = {
        role,
        difficulty,
        total,
        technical,
        hr,
        behavioral,
        aptitude,
        technicalCategories,
        regenerate
      };
      
      const res: any = await interviewApi.getQuestions(config);
      const rawData = res.data.data;
      const questionsData = Array.isArray(rawData) 
        ? rawData.map((q: any) => ({
            _id: q._id || q.text, // If _id missing, use text as fallback for key
            question: q.text || q.question || "",
            topic: q.category || q.topic || "General"
          }))
        : [];
      
      setQuestions(questionsData);
      if (res.data.cached) {
        toast({ title: "Resumed previous session", description: "Returning to your existing questions." });
      } else {
        toast({ title: "Generated fresh questions", description: "AI has prepared a new set for you." });
      }
    } catch (err) {
      console.error("Failed to load questions:", err);
      toast({ title: "Failed to load questions", variant: "destructive" });
      setSetup(true);
    } finally {
      setLoading(false);
      setRegenerate(false);
    }
  };

  const toggleCategory = (cat: string) => {
    setTechnicalCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const current = questions[index];

  // ... (submit logic unchanged) ...
  const submit = useCallback(async (auto = false) => {
    if (!current) return;
    if (!auto && !answer.trim()) {
      toast({ title: "Please write your answer", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const response: any = await interviewApi.submitAnswer({
        questionId: current._id,
        answerText: answer.trim() || "(no answer provided)",
      });
      const feedbackData = response.data.data;
      setFeedback(feedbackData);
      if (auto) toast({ title: "Time's up!", description: "Answer submitted automatically." });
    } catch (err) {
      const score = Math.floor(Math.random() * 11);
      setFeedback({
        score,
        feedback: "Your answer covers the basics but could go deeper with concrete examples and clearer structure.",
        missingPoints: ["Technical depth", "Specific examples"],
        improvementSuggestion: "Try to use the STAR method to structure your response effectively.",
      });
      toast({ title: "Showing sample feedback", description: "Backend unreachable.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  }, [answer, current, toast]);

  const handleNext = () => {
    setFeedback(null);
    if (index + 1 < questions.length) {
      setIndex((i) => i + 1);
      setAnswer("");
    } else {
      setDone(true);
    }
  };

  if (loading) return <AnimatedPage><LoadingSpinner /></AnimatedPage>;
  
  if (setup) {
    return (
      <AnimatedPage>
        <div className="container mx-auto px-4 py-10 max-w-2xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold">Interview <span className="gradient-text">Configuration</span></h1>
                <p className="text-sm text-muted-foreground mt-1">Customize your AI-powered preparation session.</p>
              </div>
              <Settings className="w-6 h-6 text-primary animate-pulse-slow" />
            </div>
            
            <div className="space-y-8">
              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Target Role</label>
                  <input 
                    type="text" 
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="input-focus"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Difficulty</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["EASY", "MEDIUM", "HARD"].map((level) => (
                      <button
                        key={level}
                        onClick={() => setDifficulty(level)}
                        className={`py-2 text-[10px] font-bold rounded-lg border transition-all ${
                          difficulty === level 
                            ? "bg-primary text-primary-foreground border-primary" 
                            : "border-border hover:border-primary/50 text-muted-foreground"
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Distribution */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <List className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-semibold">Question Distribution</h3>
                  <span className="ml-auto text-xs font-bold text-primary px-2 py-0.5 bg-primary/10 rounded-full">
                    Total: {total}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: "Technical", val: technical, set: setTechnical, icon: Terminal },
                    { label: "HR", val: hr, set: setHr, icon: User },
                    { label: "Behavioral", val: behavioral, set: setBehavioral, icon: Users },
                    { label: "Aptitude", val: aptitude, set: setAptitude, icon: BrainCircuit },
                  ].map((item) => (
                    <div key={item.label} className="p-3 rounded-xl bg-muted/30 border border-border/50 text-center">
                      <item.icon className="w-4 h-4 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">{item.label}</p>
                      <input 
                        type="number" 
                        value={item.val}
                        onChange={(e) => {
                          const v = parseInt(e.target.value) || 0;
                          item.set(v);
                          setTotal(technical + hr + behavioral + aptitude + (item.set === setTechnical ? v - item.val : 0)); // simple reactive sync
                        }}
                        className="w-full bg-transparent text-center font-bold text-lg focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Categories */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Terminal className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-semibold">Technical Categories (Optional)</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {TECH_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        technicalCategories.includes(cat)
                          ? "bg-primary/20 border-primary text-primary"
                          : "border-border hover:border-primary/30 text-muted-foreground"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 pt-4">
                <button
                  onClick={() => { setRegenerate(false); startInterview(); }}
                  className="btn-primary-glow w-full py-3.5 flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4" /> Start Interview
                </button>
                <button
                  onClick={() => { setRegenerate(true); startInterview(); }}
                  className="flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground hover:text-primary transition-colors py-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Generate Fresh Questions
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatedPage>
    );
  }

  if (!questions.length) {
    return (
      <AnimatedPage>
        <div className="container mx-auto px-4 py-20 max-w-lg text-center">
          <p className="text-muted-foreground">No questions available. Please upload your resume first.</p>
        </div>
      </AnimatedPage>
    );
  }

  if (done) {
    return (
      <AnimatedPage>
        <div className="container mx-auto px-4 py-20 max-w-lg text-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring" }}>
            <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Interview Complete!</h1>
            <p className="text-muted-foreground mb-6">View your performance breakdown and trends.</p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/analytics")}
              className="btn-primary-glow px-6 py-3"
            >
              View Analytics
            </motion.button>
          </motion.div>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              Question {index + 1} of {questions.length}
            </span>
          </div>
          <button
            onClick={() => setMockMode((m) => !m)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors flex items-center gap-1.5 ${
              mockMode ? "bg-accent/10 border-accent/30 text-accent" : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <Zap className="w-3 h-3" />
            Mock Mode {mockMode ? "ON" : "OFF"}
          </button>
        </div>

        <div className="h-2 rounded-full bg-muted overflow-hidden mb-6">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "var(--gradient-primary)" }}
            animate={{ width: `${((index + (feedback ? 1 : 0)) / questions.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        {mockMode && !feedback && (
          <div className="mb-4">
            <Timer seconds={QUESTION_SECONDS} resetKey={index} onTimeout={() => !submitting && !feedback && submit(true)} />
          </div>
        )}

        <AnimatePresence mode="wait">
          {feedback ? (
            <ResultCard
              key="feedback"
              feedback={feedback}
              isLast={index + 1 >= questions.length}
              onNext={handleNext}
            />
          ) : (
            <motion.div
              key={`q-${index}`}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}
              className="glass-card p-8"
            >
              {current?.topic && (
                <span className="inline-block text-[10px] font-mono uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-full mb-3">
                  {current.topic}
                </span>
              )}
              <h2 className="text-lg font-semibold mb-6">{current?.question}</h2>
              <motion.textarea
                whileFocus={{ scale: 1.005 }}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here..."
                rows={6}
                disabled={submitting}
                className="input-focus resize-none font-sans"
              />

              <div className="mt-6 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => submit(false)}
                  disabled={submitting}
                  className="btn-primary-glow px-8 py-3 flex items-center gap-2 disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="inline-block w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                      />
                      Evaluating...
                    </>
                  ) : (
                    <>
                      Submit Answer
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatedPage>
  );
}