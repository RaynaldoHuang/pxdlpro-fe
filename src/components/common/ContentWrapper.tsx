import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type ContentWrapperProps = {
  children: ReactNode;
  className?: string;
};

export function ContentWrapper({ children, className }: ContentWrapperProps) {
  return <div className={cn("space-y-6", className)}>{children}</div>;
}
