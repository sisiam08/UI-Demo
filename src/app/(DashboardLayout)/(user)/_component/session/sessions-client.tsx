"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { MonitorSmartphone, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
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
import type { IUserSession } from "@/interfaces";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  getActiveSessions,
  logout,
  revokeSession,
} from "@/services/auth.service";
import { formatDateTime } from "@/helpers/date-utils";

export default function SessionsClient({
  initialSessions,
}: {
  initialSessions: IUserSession[];
}) {
  const router = useRouter();
  const [sessions, setSessions] = useState<IUserSession[]>(initialSessions);
  const [revokeId, setRevokeId] = useState<string | null>(null);

  const [colWidths, setColWidths] = useState([45, 5, 10, 10, 6]);
  const resizeRef = useRef<{
    colIndex: number;
    startX: number;
    startWidths: number[];
    tableWidth: number;
  } | null>(null);
  const tableRef = useRef<HTMLTableElement>(null);

  function handleResizeStart(e: React.MouseEvent, colIndex: number) {
    e.preventDefault();
    const tableWidth = tableRef.current?.getBoundingClientRect().width ?? 800;
    resizeRef.current = {
      colIndex,
      startX: e.clientX,
      startWidths: [...colWidths],
      tableWidth,
    };
  }

  useEffect(() => {
    const MIN_PCT = 5;

    function handleMouseMove(e: MouseEvent) {
      if (!resizeRef.current) return;
      const { colIndex, startX, startWidths, tableWidth } = resizeRef.current;
      const diffPx = e.clientX - startX;
      const diffPct = (diffPx / tableWidth) * 100;

      let newCurrent = startWidths[colIndex] + diffPct;
      let newNext = startWidths[colIndex + 1] - diffPct;

      if (newCurrent < MIN_PCT) {
        newCurrent = MIN_PCT;
        newNext = startWidths[colIndex] + startWidths[colIndex + 1] - MIN_PCT;
      }
      if (newNext < MIN_PCT) {
        newNext = MIN_PCT;
        newCurrent =
          startWidths[colIndex] + startWidths[colIndex + 1] - MIN_PCT;
      }

      setColWidths((prev) => {
        const next = [...prev];
        next[colIndex] = newCurrent;
        next[colIndex + 1] = newNext;
        return next;
      });
    }

    function handleMouseUp() {
      resizeRef.current = null;
    }

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const reload = useCallback(async () => {
    try {
      setSessions(await getActiveSessions());
    } catch (error) {
      toast.add({ type: "error", description: getApiErrorMessage(error) });
    }
  }, []);

  async function handleRevoke(id: string) {
    try {
      await revokeSession(id);
      toast.add({ type: "success", description: "Session revoked" });
      await reload();
    } catch (error) {
      toast.add({ type: "error", description: getApiErrorMessage(error) });
    }
  }

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      toast.add({ type: "error", description: getApiErrorMessage(error) });
    } finally {
      router.push("/login");
    }
  }

  if (sessions.length === 0) {
    return (
      <EmptyState
        icon={<MonitorSmartphone className="size-12" />}
        title="No active sessions"
        description="There are no active sessions to display."
      />
    );
  }

  return (
    <>
      <div className="flex flex-col gap-3 sm:hidden">
        {sessions.map((session, idx) => (
          <Card key={session.id}>
            <CardContent className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <MonitorSmartphone className="size-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {session.userAgent?.slice(0, 40) || "Unknown device"}
                    </p>
                    {idx === 0 && (
                      <span className="text-xs font-medium text-success">
                        This device
                      </span>
                    )}
                  </div>
                </div>
                {idx === 0 ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleLogout}
                    className="shrink-0"
                  >
                    Log out
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="shrink-0 text-destructive"
                    onClick={() => setRevokeId(session.id)}
                  >
                    <Trash2 className="size-4" />
                    Revoke
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
                <span>IP: {session.ipAddress || "—"}</span>
                <span>Last active: {formatDateTime(session.lastActiveAt)}</span>
                <span className="col-span-2">
                  Expires: {formatDateTime(session.expiresAt)}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="hidden sm:block">
        <CardContent className="p-0">
          <Table ref={tableRef} style={{ tableLayout: "fixed", width: "100%" }}>
            <colgroup>
              {colWidths.map((w, i) => (
                <col key={i} style={{ width: `${w}%` }} />
              ))}
            </colgroup>
            <TableHeader>
              <TableRow>
                {["Device", "IP", "Last active", "Expires", "Action"].map(
                  (header, i) => (
                    <TableHead key={header} className="relative text-center">
                      {header}
                      {i < 4 && (
                        <div
                          onMouseDown={(e) => handleResizeStart(e, i)}
                          style={{
                            position: "absolute",
                            right: 0,
                            top: 0,
                            bottom: 0,
                            width: "4px",
                            cursor: "col-resize",
                            userSelect: "none",
                            background: "transparent",
                          }}
                          onMouseEnter={(e) => {
                            (
                              e.currentTarget as HTMLDivElement
                            ).style.background = "hsl(var(--border))";
                          }}
                          onMouseLeave={(e) => {
                            (
                              e.currentTarget as HTMLDivElement
                            ).style.background = "transparent";
                          }}
                        />
                      )}
                    </TableHead>
                  )
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((session, idx) => (
                <TableRow key={session.id}>
                  <TableCell className="overflow-hidden">
                    <div className="flex items-center gap-2">
                      <MonitorSmartphone className="size-4 text-muted-foreground" />
                      <div>
                        <p className="truncate text-sm font-medium">
                          {session.userAgent || "Unknown device"}
                        </p>
                        {idx === 0 && (
                          <span className="text-xs font-medium text-success">
                            This device
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="truncate overflow-hidden text-center text-sm text-muted-foreground">
                    {session.ipAddress || "—"}
                  </TableCell>
                  <TableCell className="truncate overflow-hidden text-center text-sm text-muted-foreground">
                    {formatDateTime(session.lastActiveAt)}
                  </TableCell>
                  <TableCell className="truncate overflow-hidden text-center text-sm text-muted-foreground">
                    {formatDateTime(session.expiresAt)}
                  </TableCell>
                  <TableCell className="text-center">
                    {idx === 0 ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleLogout}
                      >
                        Log out
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => setRevokeId(session.id)}
                      >
                        <Trash2 className="size-4" />
                        Revoke
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
        open={!!revokeId}
        onOpenChange={(open) => !open && setRevokeId(null)}
        title="Revoke this session?"
        description="The device will be logged out immediately."
        confirmLabel="Revoke"
        onConfirm={() => revokeId && void handleRevoke(revokeId)}
      />
    </>
  );
}
