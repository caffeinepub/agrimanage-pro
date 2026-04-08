import { Button } from "@/components/ui/button";
import {
  BarChart2,
  Bell,
  CloudSun,
  Home,
  Lock,
  Menu,
  PawPrint,
  Sprout,
  Truck,
  X,
} from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import type { UserPage } from "../App";

const USER_NAV: { page: UserPage; label: string; icon: React.ElementType }[] = [
  { page: "home", label: "Home", icon: Home },
  { page: "delivery", label: "Marketplace", icon: Truck },
  { page: "notices", label: "Notices", icon: Bell },
  { page: "weather", label: "Weather", icon: CloudSun },
  { page: "reports", label: "Reports", icon: BarChart2 },
  { page: "livestock", label: "Livestock", icon: PawPrint },
];

interface UserLayoutProps {
  children: ReactNode;
  currentPage: UserPage;
  onNavigate: (page: UserPage) => void;
  onAdminLogin: () => void;
}

export default function UserLayout({
  children,
  currentPage,
  onNavigate,
  onAdminLogin,
}: UserLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Top navbar */}
      <header className="sticky top-0 z-40 bg-card border-b border-border shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Sprout className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground text-sm">
              AgriManage Pro
            </span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-1">
            {USER_NAV.map(({ page, label, icon: Icon }) => (
              <button
                key={page}
                type="button"
                data-ocid={`user.nav.${page}.link`}
                onClick={() => onNavigate(page)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  currentPage === page
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </nav>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="sm:hidden p-1.5 rounded-md hover:bg-muted"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="sm:hidden border-t border-border bg-card px-4 py-2 space-y-1">
            {USER_NAV.map(({ page, label, icon: Icon }) => (
              <button
                key={page}
                type="button"
                onClick={() => {
                  onNavigate(page);
                  setMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === page
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Page content */}
      <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>

      {/* Footer with hidden admin link */}
      <footer className="mt-12 border-t border-border py-6 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} AgriManage Pro. All rights reserved.</p>
        <div className="mt-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onAdminLogin}
            className="text-xs text-muted-foreground/50 hover:text-muted-foreground h-7 gap-1.5"
          >
            <Lock className="w-3 h-3" /> Admin Login
          </Button>
        </div>
      </footer>
    </div>
  );
}
