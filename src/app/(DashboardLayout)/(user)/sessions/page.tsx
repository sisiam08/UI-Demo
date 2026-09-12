import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import SessionsClient from "../_component/session/sessions-client";
import type { IUserSession } from "@/interfaces";
import { getActiveSessions } from "@/services/auth.service";

export const dynamic = "force-dynamic";

export default async function SessionsPage() {
  let sessions: IUserSession[] = [];
  try {
    sessions = await getActiveSessions();
  } catch {
    sessions = [];
  }

  return (
    <div className="max-w-8xl space-y-6">
      <Link
        href="/profile"
        className="-ml-2 inline-flex items-center gap-1 rounded-md px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Profile
      </Link>

      <div>
        <h1 className="text-xl font-bold sm:text-2xl">Active Sessions</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Devices currently logged into your account
        </p>
      </div>

      <SessionsClient initialSessions={sessions} />
    </div>
  );
}
