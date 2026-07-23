import { useEffect } from "react";
import { Outlet } from "react-router-dom";

import { WebsiteFooter } from "@/components/layout/WebsiteFooter";
import { WebsiteNavbar } from "@/components/navigation/WebsiteNavbar";

export function WebsiteLayout() {
  useEffect(() => {
    document.documentElement.dataset.surface = "website";

    return () => {
      delete document.documentElement.dataset.surface;
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <WebsiteNavbar />
      <div className="bg-black pt-13">
        <Outlet />
      </div>
      <WebsiteFooter />
    </div>
  );
}
