"use client";

import { useState } from "react";

import { Ban, MessageSquare } from "lucide-react";
import Link from "next/link";

import CompatibilityScoreBadge from "../../../../../components/shared/compatibility-score-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
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
  getMyApplications,
  withdrawApplication,
} from "@/services/application.service";
import { formatDate } from "@/lib/utils";

export default function MyApplicationsClient({
  initialApplications,
}: {
  initialApplications: IApplication[];
}) {
  const [applications, setApplications] =
    useState<IApplication[]>(initialApplications);
  const [withdrawId, setWithdrawId] = useState<string | null>(null);

  async function reload() {
    try {
      setApplications(await getMyApplications());
    } catch (error) {
      toast.add({ type: "error", description: getApiErrorMessage(error) });
    }
  }

  async function handleWithdraw(id: string) {
    try {
      await withdrawApplication(id);
      toast.add({ type: "success", description: "Application withdrawn" });
      await reload();
    } catch (error) {
      toast.add({ type: "error", description: getApiErrorMessage(error) });
    }
  }

  if (applications.length === 0) {
    return (
      <EmptyState
        icon={<MessageSquare className="size-12" />}
        title="No applications yet"
        description="Browse open requirements and apply to become a co-founder."
        actionLabel="Browse requirements"
        actionHref="/requirements/browse"
      />
    );
  }

  return (
    <>
      <div className="flex flex-col gap-3 sm:hidden">
        {applications.map((app) => (
          <Card key={app.id}>
            <CardContent className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <Link
                    href={`/requirements/${app.requirement?.id}`}
                    className="block truncate text-sm leading-snug font-medium hover:underline"
                  >
                    {app.requirement?.startupIdea?.title}
                  </Link>
                  <p className="mt-0.5 text-xs text-muted-foreground capitalize">
                    {app.requirement?.requiredRole} · Applied{" "}
                    {formatDate(app.createdAt)}
                  </p>
                </div>
                <CompatibilityScoreBadge score={app.compatibilityScore} />
              </div>
              <div className="flex items-center justify-between">
                <StatusBadge status={app.status} />
                <div>
                  {app.status === "pending" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive"
                      onClick={() => setWithdrawId(app.id)}
                    >
                      <Ban className="size-4" />
                      Withdraw
                    </Button>
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
                <TableHead>Startup</TableHead>
                <TableHead>Role</TableHead>
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
                      href={`/requirements/${app.requirement?.id}`}
                      className="font-medium hover:underline"
                    >
                      {app.requirement?.startupIdea?.title}
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm capitalize">
                    {app.requirement?.requiredRole}
                  </TableCell>
                  <TableCell>
                    <CompatibilityScoreBadge score={app.compatibilityScore} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(app.createdAt)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={app.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    {app.status === "pending" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setWithdrawId(app.id)}
                      >
                        <Ban className="size-4" />
                        Withdraw
                      </Button>
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!withdrawId}
        onOpenChange={(open) => !open && setWithdrawId(null)}
        title="Withdraw this application?"
        description="You can reapply later, but you'll need to submit a new application."
        confirmLabel="Withdraw"
        onConfirm={() => withdrawId && void handleWithdraw(withdrawId)}
      />
    </>
  );
}
