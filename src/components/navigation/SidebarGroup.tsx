import type { NavigationGroup } from "@/types/navigation";

import { SidebarItem } from "@/components/navigation/SidebarItem";

type SidebarGroupProps = {
  group: NavigationGroup;
  collapsed?: boolean;
  onNavigate?: () => void;
};

export function SidebarGroup({
  group,
  collapsed = false,
  onNavigate,
}: SidebarGroupProps) {
  return (
    <div className="space-y-2">
      {group.title && !collapsed && (
        <p className="px-3 text-xs font-normal uppercase tracking-normal text-muted-foreground">
          {group.title}
        </p>
      )}
      <div className="space-y-1">
        {group.items.map((item) => (
          <SidebarItem
            key={item.href}
            item={item}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </div>
  );
}
