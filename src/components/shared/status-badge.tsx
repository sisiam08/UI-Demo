import type {
  ApplicationStatus,
  RequirementStatus,
  StartupStatus,
  UserStatus,
} from "@/interfaces";
import type { SystemRole } from "@/constants/user-role";

import { cn } from "@/lib/utils";

type AnyStatus =
  | StartupStatus
  | RequirementStatus
  | ApplicationStatus
  | UserStatus
  | SystemRole
  | string;

const badgeVariants: Record<string, { className: string; label: string }> = {
  open: { className: "bg-success/10 text-success", label: "Open" },
  closed: { className: "bg-muted text-muted-foreground", label: "Closed" },
  pending: { className: "bg-warning/10 text-warning", label: "Pending" },
  accepted: { className: "bg-success/10 text-success", label: "Accepted" },
  rejected: {
    className: "bg-destructive/10 text-destructive",
    label: "Rejected",
  },
  withdrawn: { className: "bg-muted text-muted-foreground", label: "Withdrawn" },
  active: { className: "bg-success/10 text-success", label: "Active" },
  suspended: { className: "bg-warning/10 text-warning", label: "Suspended" },
  banned: { className: "bg-destructive/10 text-destructive", label: "Banned" },
  user: { className: "bg-muted text-muted-foreground", label: "User" },
  admin: { className: "bg-primary/10 text-primary", label: "Admin" },
  super_admin: { className: "bg-primary/10 text-primary", label: "Super Admin" },
};

function StatusBadge({ status }: { status: AnyStatus }) {
  const config = badgeVariants[status] ?? {
    className: "bg-muted text-muted-foreground",
    label: status,
  };

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-md px-2.5 py-0.5 text-xs font-medium",
        config.className,
      )}
    >
      {config.label}
    </span>
  );
}

export { StatusBadge };
