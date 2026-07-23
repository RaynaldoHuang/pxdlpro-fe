import { useState, type CSSProperties } from "react";
import { Outlet } from "react-router-dom";

import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";

const adminLightTheme = {
  "--background": "oklch(1 0 0)",
  "--foreground": "oklch(0.145 0 0)",
  "--card": "oklch(1 0 0)",
  "--card-foreground": "oklch(0.145 0 0)",
  "--popover": "oklch(1 0 0)",
  "--popover-foreground": "oklch(0.145 0 0)",
  "--primary": "oklch(0.205 0 0)",
  "--primary-foreground": "oklch(0.985 0 0)",
  "--secondary": "oklch(0.97 0 0)",
  "--secondary-foreground": "oklch(0.205 0 0)",
  "--muted": "oklch(0.97 0 0)",
  "--muted-foreground": "oklch(0.556 0 0)",
  "--accent": "oklch(0.97 0 0)",
  "--accent-foreground": "oklch(0.205 0 0)",
  "--border": "oklch(0.922 0 0)",
  "--input": "oklch(0.922 0 0)",
  "--ring": "oklch(0.708 0 0)",
  "--sidebar": "oklch(0.985 0 0)",
  "--sidebar-foreground": "oklch(0.145 0 0)",
  "--sidebar-primary": "oklch(0.205 0 0)",
  "--sidebar-primary-foreground": "oklch(0.985 0 0)",
  "--sidebar-accent": "oklch(0.97 0 0)",
  "--sidebar-accent-foreground": "oklch(0.205 0 0)",
  "--sidebar-border": "oklch(0.922 0 0)",
  "--sidebar-ring": "oklch(0.708 0 0)",
} as CSSProperties;

export function AdministratorLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div
      className="min-h-screen bg-[#fafafa] text-foreground"
      style={adminLightTheme}
    >
      <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">
        <Sidebar
          collapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed((current) => !current)}
        />
      </div>
      <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
        <SheetContent
          side="left"
          className="w-72 gap-0 p-0"
          showCloseButton={false}
        >
          <SheetTitle className="sr-only">Administrator navigation</SheetTitle>
          <SheetDescription className="sr-only">
            Main navigation for administrator dashboard.
          </SheetDescription>
          <Sidebar
            onNavigate={() => setIsMobileSidebarOpen(false)}
            showCollapseButton={false}
            className="w-full"
          />
        </SheetContent>
      </Sheet>
      <div
        className={
          isCollapsed
            ? "min-h-screen lg:pl-16"
            : "min-h-screen lg:pl-64"
        }
      >
        <Header onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)} />
        <main className="min-h-[calc(100vh-3.5rem)] bg-[#fafafa] px-4 py-6 sm:px-6 lg:px-8">
          <div className="w-full space-y-5">
            <Breadcrumb />
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
