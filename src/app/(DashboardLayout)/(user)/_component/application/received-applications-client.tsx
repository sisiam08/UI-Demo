"use client";

import { useCallback, useState } from "react";

import { Check, MessageSquare, UsersRound, X } from "lucide-react";
import Link from "next/link";

import CompatibilityScoreBadge from "../shared/compatibility-score-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/toast";
import type { IApplication } from "@/interfaces";
import { getApiErrorMessage } from "@/lib/api-error";
import { httpGet, httpPatch } from "@/lib/http";
import { formatDate, initials } from "@/lib/utils";

type Action = { type: "accept" | "reject"; appId: string };

function ReceivedApplicationsClient({
  initialApplications,
}: {
  initialApplications: IApplication[];
}) {
  const [applications, setApplications] = useState<IApplication[]>(
    initialApplications,
  );
  const [action, setAction] = useState<Action | null>(null);

  const reload = useCallback(async () => {
    try {
      const response = await httpGet<IApplication[]>("/applications/received");
      setApplications(response.data);
    } catch (error) {
      toast.add({ type: "error", description: getApiErrorMessage(error) });
    }
  }, []);

  async function handleAction(current: Action) {
    try {
      await httpPatch<void>(`/applications/${current.appId}/${current.type}`);
      toast.add({
        type: "success",
        description: `Application ${current.type === "accept" ? "accepted" : "rejected"}`,
      });
      await reload();
    } catch (error) {
      toast.add({ type: "error", description: getApiErrorMessage(error) });
    }
  }

  if (applications.length === 0) {
    return (
      <EmptyState
        icon={<UsersRound className="size-12" />}
        title="No applications yet"
        description="When someone applies to one of your startup requirements, they&apos;ll appear here."
        actionLabel="View my startups"
        actionHref="/startups/mine"
      />
    );
  }

  return (
    <>
      <div className="space-y-3">
        {applications.map((app) => (
          <Card key={app.id}>
            <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <Link
                href={`/profile/${app.candidate?.id}`}
                className="group flex min-w-0 items-center gap-3"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground transition-shadow group-hover:ring-2 group-hover:ring-primary/40">
                  {initials(app.candidate?.fullName ?? "?")}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-medium group-hover:underline">
                    {app.candidate?.fullName}
                  </p>
                  <p className="truncate text-sm text-muted-foreground capitalize">
                    {app.requirement?.startupIdea?.title} ·{" "}
                    {app.requirement?.requiredRole} · Applied{" "}
                    {formatDate(app.createdAt)}
                  </p>
                </div>
              </Link>
              <div className="flex shrink-0 items-center gap-2">
                <StatusBadge status={app.status} />
                {app.status === "pending" && (
                  <>
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() =>
                        setAction({ type: "accept", appId: app.id })
                      }
                    >
                      <Check className="size-4 sm:mr-1" />
                      <span className="hidden sm:inline">Accept</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setAction({ type: "reject", appId: app.id })
                      }
                    >
                      <X className="size-4 sm:mr-1" />
                      <span className="hidden sm:inline">Reject</span>
                    </Button>
                  </>
                )}
                {app.status === "accepted" && (
                  <Button
                    size="sm"
                    variant="outline"
                    nativeButton={false}
                    render={<Link href={`/messages?thread=${app.id}`} />}
                  >
                    <MessageSquare className="size-4" />
                    Message
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <ConfirmDialog
        open={!!action}
        onOpenChange={(open) => !open && setAction(null)}
        title={
          action?.type === "accept"
            ? "Accept applicant?"
            : "Reject applicant?"
        }
        description={
          action?.type === "accept"
            ? "This will unlock messaging with this applicant."
            : "The applicant will be notified that they were not selected."
        }
        confirmLabel={action?.type === "accept" ? "Accept" : "Reject"}
        variant={action?.type === "accept" ? "success" : "destructive"}
        onConfirm={() => action && void handleAction(action)}
      />
    </>
  );
}

export { ReceivedApplicationsClient };
