import type { LucideIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type DashboardCardProps = {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
};

export function DashboardCard({
  title,
  value,
  description,
  icon: Icon,
}: DashboardCardProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between space-y-0">
        <div className="space-y-1">
          <CardDescription>{title}</CardDescription>
          <CardTitle className="text-2xl">{value}</CardTitle>
        </div>
        <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <Icon className="size-4" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
