import type { ProfileRole, StartupStage } from "@/interfaces";

export const PROFILE_ROLES: ProfileRole[] = [
  "technical",
  "product",
  "design",
  "marketing",
  "business",
];

export const PROFILE_ROLE_LABELS: Record<ProfileRole, string> = {
  technical: "Technical",
  product: "Product",
  design: "Design",
  marketing: "Marketing",
  business: "Business",
};

export const PROFILE_ROLE_OPTIONS = PROFILE_ROLES.map((role) => ({
  value: role,
  label: PROFILE_ROLE_LABELS[role],
}));

export const STARTUP_STAGES: StartupStage[] = [
  "idea",
  "prototype",
  "mvp",
  "launched",
  "scaling",
];

export const STARTUP_STAGE_OPTIONS = STARTUP_STAGES.map((stage) => ({
  value: stage,
  label:
    stage === "mvp"
      ? "MVP"
      : stage.charAt(0).toUpperCase() + stage.slice(1),
}));

export const SKILL_OPTIONS = [
  "React",
  "Next.js",
  "Node.js",
  "TypeScript",
  "Python",
  "PostgreSQL",
  "UI/UX Design",
  "Figma",
  "Product Management",
  "Marketing",
  "SEO",
  "Sales",
  "Finance",
  "Machine Learning",
  "DevOps",
  "Docker",
];

export const INDUSTRY_OPTIONS = [
  "SaaS",
  "FinTech",
  "HealthTech",
  "EdTech",
  "AI/ML",
  "E-commerce",
  "Marketplace",
  "Developer Tools",
  "Consumer",
  "B2B",
  "ClimateTech",
  "Web3",
  "Gaming",
  "Social",
];
