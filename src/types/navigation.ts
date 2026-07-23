import type { LucideIcon } from "lucide-react";

export type NavigationItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  roles?: string[];
};

export type NavigationGroup = {
  title?: string;
  items: NavigationItem[];
};
