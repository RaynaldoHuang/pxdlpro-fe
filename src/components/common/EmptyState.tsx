import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

type EmptyStateProps = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export function EmptyState({ title, description, icon: Icon }: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="flex min-h-40 flex-col items-center justify-center gap-3 text-center">
        <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <Icon className="size-5" />
        </div>
        <div className="space-y-1">
          <h3 className="font-heading text-base font-normal">{title}</h3>
          <p className="max-w-md text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
