import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  BarChart2,
  Bell,
  ClipboardList,
  CloudSun,
  DollarSign,
  HardHat,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  Package,
  PawPrint,
  Shield,
  Sprout,
  Tractor,
  Truck,
  Users,
  X,
} from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import type { Page } from "../App";

const NAV_ITEMS: { page: Page; label: string; icon: React.ElementType }[] = [
  { page: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { page: "farmers", label: "Farmers", icon: Users },
  { page: "fields", label: "Fields", icon: MapPin },
  { page: "crops", label: "Crops", icon: Sprout },
  { page: "workers", label: "Workers", icon: HardHat },
  { page: "tasks", label: "Tasks", icon: ClipboardList },
  { page: "inventory", label: "Inventory", icon: Package },
  { page: "expenses", label: "Expenses", icon: DollarSign },
  { page: "notices", label: "Notice Board", icon: Bell },
  { page: "delivery", label: "Delivery", icon: Truck },
  { page: "weather", label: "Weather", icon: CloudSun },
  { page: "reports", label: "Reports", icon: BarChart2 },
  { page: "livestock", label: "Livestock", icon: PawPrint },
];

interface LayoutProps {
  children: ReactNode;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onAdminLogout: () => void;
}

export default function Layout({
  children,
  currentPage,
  onNavigate,
  onAdminLogout,
}: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
        <div className="w-9 h-9 rounded-lg bg-sidebar-primary flex items-center justify-center">
          <Tractor className="w-5 h-5 text-sidebar-primary-foreground" />
        </div>
        <div>
          <p className="font-bold text-sidebar-foreground text-sm leading-tight">
            AgriManage Pro
          </p>
          <p className="text-sidebar-foreground/50 text-xs">Farm Management</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ page, label, icon: Icon }) => (
          <button
            key={page}
            type="button"
            data-ocid={`nav.${page}.link`}
            onClick={() => {
              onNavigate(page);
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
              currentPage === page
                ? "bg-sidebar-accent text-sidebar-foreground"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
            }`}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </button>
        ))}
      </nav>

      {/* Admin user section */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Avatar className="w-7 h-7">
              <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs">
                <Shield className="w-3.5 h-3.5" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sidebar-foreground text-xs font-medium">
                Admin
              </p>
              <p className="text-sidebar-foreground/50 text-xs">Full Access</p>
            </div>
          </div>
          <Button
            data-ocid="nav.logout.button"
            type="button"
            variant="ghost"
            size="sm"
            onClick={onAdminLogout}
            className="w-full text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/60 justify-start gap-2 h-8"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 bg-sidebar flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: overlay backdrop */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-56 bg-sidebar flex flex-col">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top header */}
        <header className="flex items-center gap-3 px-4 lg:px-6 h-14 bg-card border-b border-border flex-shrink-0">
          <button
            type="button"
            className="lg:hidden p-1.5 rounded-md hover:bg-muted transition-colors"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
          <div className="flex-1">
            <h1 className="text-base font-semibold text-foreground">
              {NAV_ITEMS.find((n) => n.page === currentPage)?.label ??
                "Dashboard"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Shield className="w-3.5 h-3.5 text-primary" />
              <span className="hidden sm:block">Admin</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}

          {/* Footer */}
          <footer className="mt-12 pt-6 border-t border-border text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} AgriManage Pro. All rights reserved.
          </footer>
        </main>
      </div>
    </div>
  );
}
