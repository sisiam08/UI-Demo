import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import MyApplicationsClient from "../../_component/application/my-applications-client";
import type { IApplication } from "@/interfaces";
import { getMyApplications } from "@/services/application.service";

export const dynamic = "force-dynamic";

export default async function MyApplicationsPage() {
  let applications: IApplication[] = [];
  try {
    applications = await getMyApplications();
  } catch {
    applications = [];
  }

  return (
    <div className="space-y-6">
      <Link
        href="/requirements/browse"
        className="-ml-2 inline-flex items-center gap-1 rounded-md px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back
      </Link>

      <div>
        <h1 className="text-xl font-bold sm:text-2xl">My Applications</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track the status of your co-founder applications
        </p>
      </div>

      <MyApplicationsClient initialApplications={applications} />
    </div>
  );
}
