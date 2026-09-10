import { ScrollText } from "lucide-react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AdminAuditLogsPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Audit Logs</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Append-only trail of significant business and admin actions
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ScrollText className="size-5" />
            Coming Soon
          </CardTitle>
          <CardDescription>
            Audit logging is not yet available. Significant admin actions will
            be logged here once implemented.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
