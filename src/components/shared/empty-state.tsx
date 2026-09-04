import type { ReactNode } from "react";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        {icon && <div className="mb-4 text-muted-foreground">{icon}</div>}
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            {description}
          </p>
        )}
        {actionLabel &&
          (actionHref ? (
            <Button
              nativeButton={false}
              render={<Link href={actionHref} />}
              className="mt-4"
            >
              {actionLabel}
            </Button>
          ) : (
            <Button onClick={onAction} className="mt-4">
              {actionLabel}
            </Button>
          ))}
      </CardContent>
    </Card>
  );
}

export { EmptyState };
