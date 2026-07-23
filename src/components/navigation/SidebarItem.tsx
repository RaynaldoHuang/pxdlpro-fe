import { NavLink } from "react-router-dom";

import { cn } from "@/lib/utils";
import type { NavigationItem } from "@/types/navigation";

type SidebarItemProps = {
  item: NavigationItem;
  collapsed?: boolean;
  onNavigate?: () => void;
};

export function SidebarItem({
  item,
  collapsed = false,
  onNavigate,
}: SidebarItemProps) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.href}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          "flex h-9 items-center gap-2 rounded-lg px-2 text-sm font-normal text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
          collapsed && "justify-center px-0",
        )
      }
      title={collapsed ? item.title : undefined}
    >
      <Icon className="size-4 shrink-0" />
      {!collapsed && <span className="truncate">{item.title}</span>}
    </NavLink>
  );
}
