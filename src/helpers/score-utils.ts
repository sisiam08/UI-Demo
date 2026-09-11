export function scoreColor(score: number): string {
  if (score >= 75) return "text-success";
  if (score >= 50) return "text-warning";
  if (score >= 25) return "text-orange-600";
  return "text-destructive";
}

export function scoreBg(score: number): string {
  if (score >= 75) return "bg-success/10 text-success border-success/20";
  if (score >= 50) return "bg-warning/10 text-warning border-warning/20";
  if (score >= 25)
    return "bg-orange-500/10 text-orange-600 border-orange-500/20";
  return "bg-destructive/10 text-destructive border-destructive/20";
}
