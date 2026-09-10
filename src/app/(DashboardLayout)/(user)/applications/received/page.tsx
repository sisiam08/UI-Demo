import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import ReceivedApplicationsClient from "../../_component/application/received-applications-client";
import type { IApplication } from "@/interfaces";
import { getReceivedApplications } from "@/services/application.service";

export const dynamic = "force-dynamic";

export default async function ReceivedApplicationsPage() {
  let applications: IApplication[] = [];
  try {
    applications = await getReceivedApplications();
  } catch {
    applications = [];
  }

  return (
    <div className="space-y-6">
      <Link
        href="/startups/mine"
        className="-ml-2 inline-flex items-center gap-1 rounded-md px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to My Startups
      </Link>

      <div>
        <h1 className="text-xl font-bold sm:text-2xl">Applicants</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review co-founder applications across all your startups
        </p>
      </div>

      <ReceivedApplicationsClient initialApplications={applications} />
    </div>
  );
}
