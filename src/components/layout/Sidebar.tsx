import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { SidebarGroup } from "@/components/navigation/SidebarGroup";
import { Button } from "@/components/ui/button";
import { administratorNavigation } from "@/constants/navigation";
import { siteConfig } from "@/config/site";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { cn } from "@/lib/utils";

type SidebarProps = {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onNavigate?: () => void;
  showCollapseButton?: boolean;
  className?: string;
};

export function Sidebar({
  collapsed = false,
  onToggleCollapse,
  onNavigate,
  showCollapseButton = true,
  className,
}: SidebarProps) {
  const { user } = useAdminAuth();
  const navigation = administratorNavigation
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (item) => !item.roles || item.roles.includes(user?.role ?? ""),
      ),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground",
        collapsed ? "w-16" : "w-64",
        className,
      )}
    >
      <div
        className={cn(
          "flex h-14 items-center gap-2 border-b border-sidebar-border px-3",
          collapsed && "justify-center",
        )}
      >
        {!collapsed && (
          <>
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sm font-normal text-sidebar-primary-foreground">
              P
            </div>
            <div className="min-w-0">
              <p className="truncate font-heading text-sm font-normal">
                {siteConfig.name}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                Admin CMS
              </p>
            </div>
          </>
        )}
        {showCollapseButton && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className={cn("hidden lg:inline-flex", !collapsed && "ml-auto")}
            onClick={onToggleCollapse}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeftOpen className="size-4" />
            ) : (
              <PanelLeftClose className="size-4" />
            )}
            <span className="sr-only">
              {collapsed ? "Expand sidebar" : "Collapse sidebar"}
            </span>
          </Button>
        )}
      </div>
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {navigation.map((group, index) => (
          <SidebarGroup
            key={group.title ?? `group-${index}`}
            group={group}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        ))}
      </nav>
    </aside>
  );
}
