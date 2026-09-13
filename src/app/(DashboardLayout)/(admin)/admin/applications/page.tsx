import type { AdminApplicationsPage } from "@/interfaces";
import ApplicationsClient from "../../_component/application/applications-client";
import { getAdminApplications } from "@/services/admin.service";

export const dynamic = "force-dynamic";

export default async function AdminApplicationsPage() {
  let data: AdminApplicationsPage = {
    applications: [],
    total: 0,
    page: 1,
    limit: 20,
  };
  let initialError: string | undefined;
  try {
    data = await getAdminApplications({ page: 1 });
  } catch {
    initialError = "Unable to load applications.";
  }

  return (
    <ApplicationsClient
      initialApplications={data.applications}
      initialTotal={data.total}
      initialLimit={data.limit}
      initialError={initialError}
    />
  );
}
