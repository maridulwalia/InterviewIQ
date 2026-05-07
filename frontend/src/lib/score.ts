export type ScoreTone = "weak" | "average" | "strong";

export function getScoreTone(score: number): ScoreTone {
  if (score <= 4) return "weak";
  if (score <= 7) return "average";
  return "strong";
}

export function getScoreColors(score: number) {
  const tone = getScoreTone(score);
  switch (tone) {
    case "weak":
      return {
        text: "text-red-500",
        bg: "bg-red-500/10",
        border: "border-red-500/30",
        ring: "ring-red-500/20",
        hex: "#ef4444",
        label: "Needs Work",
      };
    case "average":
      return {
        text: "text-yellow-500",
        bg: "bg-yellow-500/10",
        border: "border-yellow-500/30",
        ring: "ring-yellow-500/20",
        hex: "#eab308",
        label: "Average",
      };
    case "strong":
      return {
        text: "text-emerald-500",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/30",
        ring: "ring-emerald-500/20",
        hex: "#10b981",
        label: "Strong",
      };
  }
}