import { AlertTriangle, LayoutDashboard, Menu, Moon, Package, Sun, Truck } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { NavLink } from "react-router";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

// ─── Nav config ───────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/assets", label: "Assets", icon: Package },
  { to: "/incidents", label: "Incidents", icon: AlertTriangle },
  { to: "/vehicles", label: "Vehicles", icon: Truck },
] as const;

// ─── Shared sub-components ────────────────────────────────────────────────────

function NavItems({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-0.5 px-3">
      {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )
          }
        >
          <Icon className="size-4 shrink-0" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}

function Brand() {
  return <span className="text-base font-semibold tracking-tight">UrbanTrack</span>;
}

// ─── Desktop sidebar ─────────────────────────────────────────────────────────

export function DesktopSidebar() {
  return (
    <aside className="bg-sidebar hidden w-56 shrink-0 flex-col border-r md:flex">
      {/* Header */}
      <div className="flex h-14 items-center border-b px-4">
        <Brand />
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto py-3">
        <NavItems />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t px-3 py-2">
        <span className="text-muted-foreground text-xs">Buenos Aires</span>
        <ThemeToggle />
      </div>
    </aside>
  );
}

// ─── Mobile top bar ───────────────────────────────────────────────────────────

export function MobileTopBar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b px-4 md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Open navigation menu"
          onClick={() => setOpen(true)}
        >
          <Menu className="size-5" />
        </Button>

        <SheetContent side="left" className="w-56 p-0" showCloseButton={false}>
          <SheetHeader className="flex h-14 flex-row items-center border-b px-4 py-0">
            <SheetTitle asChild>
              <Brand />
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto py-3">
            <NavItems onNavigate={() => setOpen(false)} />
          </div>

          <div className="flex items-center justify-between border-t px-3 py-2">
            <span className="text-muted-foreground text-xs">Buenos Aires</span>
            <ThemeToggle />
          </div>
        </SheetContent>
      </Sheet>

      <Brand />
    </header>
  );
}
