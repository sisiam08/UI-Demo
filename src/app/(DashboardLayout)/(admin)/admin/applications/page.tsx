import type { AdminApplicationsPage } from "@/interfaces";
import { ApplicationsClient } from "../../_component/applications-client";
import {
  getAdminApplications,
} from "@/services/admin.service";

export const dynamic = "force-dynamic";

export default async function AdminApplicationsPage() {
  let data: AdminApplicationsPage = {
    applications: [],
    total: 0,
    page: 1,
    limit: 20,
  };
  try {
    data = await getAdminApplications({ page: 1 });
  } catch {
    data = { applications: [], total: 0, page: 1, limit: 20 };
  }

  return (
    <ApplicationsClient
      initialApplications={data.applications}
      initialTotal={data.total}
      initialLimit={data.limit}
    />
  );
}
