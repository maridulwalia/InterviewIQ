import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, MessageSquare, Sparkles } from "lucide-react";
import AnimatedPage from "@/components/AnimatedPage";

const cards = [
  {
    title: "Upload Resume",
    desc: "Upload your resume to get personalized questions",
    icon: FileText,
    path: "/upload",
    color: "from-primary/10 to-primary/5",
    iconColor: "text-primary",
  },
  {
    title: "Start Interview",
    desc: "Practice with AI-generated interview questions",
    icon: MessageSquare,
    path: "/interview",
    color: "from-accent/10 to-accent/5",
    iconColor: "text-accent",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user") || "{}"); } catch { return {}; }
  })();

  return (
    <AnimatedPage>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">Dashboard</span>
          </div>
          <h1 className="text-3xl font-bold">
            Welcome, <span className="gradient-text">{user.name || "there"}</span>
          </h1>
          <p className="text-muted-foreground mt-1">Ready to ace your next interview?</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6">
          {cards.map((card, i) => (
            <motion.button
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(card.path)}
              className="glass-card-hover p-8 text-left group"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <card.icon className={`w-6 h-6 ${card.iconColor}`} />
              </div>
              <h2 className="text-lg font-semibold mb-1">{card.title}</h2>
              <p className="text-sm text-muted-foreground">{card.desc}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </AnimatedPage>
  );
}
