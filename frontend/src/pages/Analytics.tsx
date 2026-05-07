import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
} from "recharts";
import { BarChart3, TrendingUp, Target, Award, AlertTriangle, Lightbulb, Sparkles } from "lucide-react";
import AnimatedPage from "@/components/AnimatedPage";
import { CardSkeleton } from "@/components/LoadingSkeleton";
import CountUp from "@/components/CountUp";
import { analyticsApi, type AnalyticsData } from "@/services/api";
import { getScoreColors } from "@/lib/score";
import { useToast } from "@/hooks/use-toast";

const FALLBACK: AnalyticsData = {
  totalInterviews: 12,
  averageScore: 7.4,
  bestArea: "DBMS",
  performanceOverTime: [
    { date: "Apr 22", score: 5.5 },
    { date: "Apr 25", score: 6.2 },
    { date: "Apr 28", score: 6.8 },
    { date: "May 1", score: 7.1 },
    { date: "May 3", score: 7.9 },
    { date: "May 5", score: 8.3 },
  ],
  topicPerformance: [
    { topic: "DSA", score: 6.2 },
    { topic: "DBMS", score: 8.5 },
    { topic: "OS", score: 7.1 },
    { topic: "HR", score: 8.0 },
    { topic: "System Design", score: 4.5 },
    { topic: "Networking", score: 5.8 },
  ],
  weakAreas: [
    { topic: "System Design", score: 4.5 },
    { topic: "Networking", score: 5.8 },
  ],
  recommendations: [
    { title: "Practice scalable architecture", description: "Focus on caching, load balancing and database sharding patterns." },
    { title: "Strengthen networking fundamentals", description: "Review TCP/IP, DNS resolution, and HTTP/2 multiplexing." },
    { title: "Time-box your DSA answers", description: "Aim to articulate brute force then optimal within 5 minutes." },
  ],
};

const containerVariants = {
  animate: { transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    analyticsApi.getOverview()
      .then((res: any) => {
        console.log("Analytics API Response:", res.data);
        setData(res.data.data);
      })
      .catch((err) => {
        console.error("Analytics API Error:", err);
        setData(FALLBACK);
        toast({ title: "Showing sample analytics", description: "Live data unavailable." });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <AnimatedPage>
        <div className="container mx-auto px-4 py-12 max-w-6xl space-y-6">
          <div className="grid sm:grid-cols-3 gap-4">
            <CardSkeleton /><CardSkeleton /><CardSkeleton />
          </div>
          <CardSkeleton />
        </div>
      </AnimatedPage>
    );
  }

  const stats = [
    { label: "Total Interviews", value: data.totalInterviews, icon: Target, color: "text-primary", bg: "bg-primary/10" },
    { label: "Average Score", value: data.averageScore, decimals: 1, icon: TrendingUp, color: "text-accent", bg: "bg-accent/10" },
    { label: "Best Area", value: data.bestArea, icon: Award, color: "text-emerald-500", bg: "bg-emerald-500/10", isText: true },
  ];

  return (
    <AnimatedPage>
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="container mx-auto px-4 py-10 max-w-6xl space-y-8"
      >
        <motion.div variants={itemVariants}>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">Analytics</span>
          </div>
          <h1 className="text-3xl font-bold">Your <span className="gradient-text">Performance</span></h1>
          <p className="text-muted-foreground mt-1">Track progress and identify focus areas.</p>
        </motion.div>

        <motion.div variants={itemVariants} className="grid sm:grid-cols-3 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="glass-card-hover p-5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center`}>
                <s.icon className={`w-6 h-6 ${s.color}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</p>
                <p className="text-2xl font-bold">
                  {s.isText ? s.value : <CountUp to={s.value as number} decimals={s.decimals || 0} />}
                </p>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div variants={itemVariants} className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Performance Over Time</h3>
              <p className="text-xs text-muted-foreground">Average score per interview</p>
            </div>
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={data.performanceOverTime}>
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="100%" stopColor="hsl(var(--accent))" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis domain={[0, 10]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="url(#lineGrad)"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", r: 4 }}
                  activeDot={{ r: 6 }}
                  isAnimationActive
                  animationDuration={1200}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Topic-wise Performance</h3>
              <p className="text-xs text-muted-foreground">Average score per subject</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={data.topicPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="topic" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis domain={[0, 10]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  cursor={{ fill: "hsl(var(--muted) / 0.4)" }}
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="score" radius={[8, 8, 0, 0]} animationDuration={1000}>
                  {data.topicPerformance.map((t, i) => (
                    <Cell key={i} fill={getScoreColors(t.score).hex} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div variants={itemVariants} className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h3 className="font-semibold">Weak Areas</h3>
            </div>
            <div className="space-y-3">
              {data.weakAreas.length === 0 && (
                <p className="text-sm text-muted-foreground">No weak areas detected. Keep it up!</p>
              )}
              {data.weakAreas.map((w, i) => (
                <motion.div
                  key={w.topic}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-red-500/10 border border-red-500/30"
                >
                  <div>
                    <p className="font-semibold">{w.topic}</p>
                    <p className="text-xs text-red-500 font-medium uppercase tracking-wider">Needs Improvement</p>
                  </div>
                  <span className="text-xl font-bold text-red-500 font-mono">{w.score.toFixed(1)}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Recommendations</h3>
            </div>
            <div className="space-y-3">
              {data.recommendations.map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex gap-3 p-4 rounded-lg bg-muted/40 border border-border hover:border-primary/40 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{r.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{r.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatedPage>
  );
}