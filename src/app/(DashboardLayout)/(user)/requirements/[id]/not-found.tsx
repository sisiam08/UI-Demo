import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function RequirementNotFound() {
  return (
    <Card>
      <CardContent className="py-12 text-center">
        <p className="text-muted-foreground">Requirement not found.</p>
        <Button
          nativeButton={false}
          render={<Link href="/requirements/browse" />}
          className="mt-4"
        >
          Back to browse
        </Button>
      </CardContent>
    </Card>
  );
}
