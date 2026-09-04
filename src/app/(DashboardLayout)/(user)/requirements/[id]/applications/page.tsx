import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import ApplicantsClient from "../../../_component/application/applicants-client";
import type { IApplication } from "@/interfaces";
import { httpGet } from "@/lib/http";

export default async function ApplicantsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let applications: IApplication[] = [];
  try {
    applications = (
      await httpGet<IApplication[]>(`/requirements/${id}/applications`)
    ).data;
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
          Review and accept or reject candidates for this requirement
        </p>
      </div>

      <ApplicantsClient id={id} initialApplications={applications} />
    </div>
  );
}
