import { Outlet } from "react-router";
import { DesktopSidebar, MobileTopBar } from "./Sidebar";

export function MainLayout() {
  return (
    <div className="flex h-svh bg-background">
      <DesktopSidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <MobileTopBar />

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
