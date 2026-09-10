import { RequirementsClient } from "../../_component/requirements-client";
import {
  getAdminRequirements,
  type AdminRequirementsPage,
} from "@/service/admin.services";

export const dynamic = "force-dynamic";

export default async function AdminRequirementsPage() {
  let data: AdminRequirementsPage = {
    requirements: [],
    total: 0,
    page: 1,
    limit: 20,
  };
  try {
    data = await getAdminRequirements({ page: 1 });
  } catch {
    data = { requirements: [], total: 0, page: 1, limit: 20 };
  }

  return (
    <RequirementsClient
      initialRequirements={data.requirements}
      initialTotal={data.total}
      initialLimit={data.limit}
    />
  );
}
