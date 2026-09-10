import { cn, scoreBg } from "@/lib/utils";

export default function CompatibilityScoreBadge({
  score,
  size = "sm",
}: {
  score: number;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "h-7 px-2.5 text-xs",
    md: "h-9 px-3 text-sm",
    lg: "h-12 px-4 text-base",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-semibold",
        scoreBg(score),
        sizes[size],
      )}
    >
      <svg
        viewBox="0 0 36 36"
        className={cn("shrink-0", size === "lg" ? "size-8" : "size-5")}
      >
        <circle
          cx="18"
          cy="18"
          r="15"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="opacity-20"
        />
        <circle
          cx="18"
          cy="18"
          r="15"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray={`${(score / 100) * 94.2} 94.2`}
          strokeLinecap="round"
        />
      </svg>
      {score}
      <span className="font-normal opacity-60">/100</span>
    </span>
  );
}

