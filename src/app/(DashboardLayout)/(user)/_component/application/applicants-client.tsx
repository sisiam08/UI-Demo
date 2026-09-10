"use client";

import { useCallback, useState } from "react";

import { Check, MessageSquare, X } from "lucide-react";
import Link from "next/link";

import CompatibilityScoreBadge from "../../../../../components/shared/compatibility-score-badge";
import { ConfirmDialog } from "../../../../../components/shared/confirm-dialog";
import { EmptyState } from "../../../../../components/shared/empty-state";
import { StatusBadge } from "../../../../../components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/toast";
import type { IApplication } from "@/interfaces";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  acceptApplication,
  rejectApplication,
} from "@/services/application.service";
import { getRequirementApplications } from "@/services/requirement.service";
import { formatDate, initials } from "@/lib/utils";

type Action = { type: "accept" | "reject"; appId: string };

export default function ApplicantsClient({
  id,
  initialApplications,
}: {
  id: string;
  initialApplications: IApplication[];
}) {
  const [applications, setApplications] =
    useState<IApplication[]>(initialApplications);
  const [action, setAction] = useState<Action | null>(null);

  const reload = useCallback(async () => {
    try {
      setApplications(await getRequirementApplications(id));
    } catch (error) {
      toast.add({ type: "error", description: getApiErrorMessage(error) });
    }
  }, [id]);

  async function handleAction(current: Action) {
    try {
      if (current.type === "accept") {
        await acceptApplication(current.appId);
      } else {
        await rejectApplication(current.appId);
      }
      toast.add({ type: "success", description: "Action completed" });
      await reload();
    } catch (error) {
      toast.add({ type: "error", description: getApiErrorMessage(error) });
    }
  }

  return (
    <>
      {applications.length === 0 ? (
        <EmptyState
          title="No applicants yet"
          description="When candidates apply to this requirement, they will appear here."
        />
      ) : (
        <>
          <div className="flex flex-col gap-3 sm:hidden">
            {applications.map((app) => (
              <Card key={app.id}>
                <CardContent className="space-y-3 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <Link
                      href={`/profile/${app.candidate?.id}`}
                      className="flex min-w-0 items-center gap-2 hover:underline"
                    >
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                        {initials(app.candidate?.fullName ?? "?")}
                      </div>
                      <span className="truncate text-sm font-medium">
                        {app.candidate?.fullName}
                      </span>
                    </Link>
                    <CompatibilityScoreBadge score={app.compatibilityScore} />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={app.status} />
                      <span className="text-xs text-muted-foreground">
                        {formatDate(app.createdAt)}
                      </span>
                    </div>
                    {app.status === "pending" ? (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() =>
                            setAction({ type: "accept", appId: app.id })
                          }
                        >
                          <Check className="size-4" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            setAction({ type: "reject", appId: app.id })
                          }
                        >
                          <X className="size-4" />
                          Reject
                        </Button>
                      </div>
                    ) : app.status === "accepted" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        nativeButton={false}
                        render={<Link href={`/messages?thread=${app.id}`} />}
                      >
                        <MessageSquare className="size-4" />
                        Message
                      </Button>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="hidden sm:block">
            <CardContent className="overflow-x-auto p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Applied</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell>
                        <Link
                          href={`/profile/${app.candidate?.id}`}
                          className="flex items-center gap-2 hover:underline"
                        >
                          <div className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                            {initials(app.candidate?.fullName ?? "?")}
                          </div>
                          <span className="font-medium">
                            {app.candidate?.fullName}
                          </span>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <CompatibilityScoreBadge
                          score={app.compatibilityScore}
                        />
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(app.createdAt)}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={app.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        {app.status === "pending" ? (
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="success"
                              onClick={() =>
                                setAction({ type: "accept", appId: app.id })
                              }
                            >
                              <Check className="size-4" />
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() =>
                                setAction({ type: "reject", appId: app.id })
                              }
                            >
                              <X className="size-4" />
                              Reject
                            </Button>
                          </div>
                        ) : app.status === "accepted" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            render={
                              <Link href={`/messages?thread=${app.id}`} />
                            }
                          >
                            <MessageSquare className="size-4" />
                            Message
                          </Button>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            —
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}

      <ConfirmDialog
        open={!!action}
        onOpenChange={(open) => !open && setAction(null)}
        title={
          action?.type === "accept"
            ? "Accept this application?"
            : "Reject this application?"
        }
        description={
          action?.type === "accept"
            ? "The candidate will be notified and messaging will be unlocked between you."
            : "The candidate will be notified that their application was rejected."
        }
        confirmLabel={action?.type === "accept" ? "Accept" : "Reject"}
        variant={action?.type === "accept" ? "success" : "destructive"}
        onConfirm={() => action && void handleAction(action)}
      />
    </>
  );
}
