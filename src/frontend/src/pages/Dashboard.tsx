import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertTriangle,
  ClipboardList,
  DollarSign,
  MapPin,
  Package,
  Sprout,
  TrendingUp,
  Users,
} from "lucide-react";
import type { Page } from "../App";
import { useDashboardStats } from "../hooks/useQueries";

interface Props {
  onNavigate: (page: Page) => void;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  colorClass: string;
  bgClass: string;
  loading: boolean;
}

function StatCard({
  title,
  value,
  icon: Icon,
  colorClass,
  bgClass,
  loading,
}: StatCardProps) {
  return (
    <Card className="shadow-card">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {loading ? (
              <Skeleton className="h-8 w-16 mt-1" />
            ) : (
              <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
            )}
          </div>
          <div
            className={`w-10 h-10 rounded-lg ${bgClass} flex items-center justify-center`}
          >
            <Icon className={`w-5 h-5 ${colorClass}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard({ onNavigate }: Props) {
  const { data: stats, isLoading } = useDashboardStats();

  const statCards = [
    {
      title: "Total Farmers",
      value: stats?.totalFarmers?.toString() ?? "0",
      icon: Users,
      colorClass: "text-primary",
      bgClass: "bg-secondary",
      page: "farmers" as Page,
    },
    {
      title: "Total Fields",
      value: stats?.totalFields?.toString() ?? "0",
      icon: MapPin,
      colorClass: "text-blue-600",
      bgClass: "bg-blue-50",
      page: "fields" as Page,
    },
    {
      title: "Active Crops",
      value: stats?.activeCrops?.toString() ?? "0",
      icon: Sprout,
      colorClass: "text-emerald-600",
      bgClass: "bg-emerald-50",
      page: "crops" as Page,
    },
    {
      title: "Pending Tasks",
      value: stats?.pendingTasks?.toString() ?? "0",
      icon: ClipboardList,
      colorClass: "text-orange-600",
      bgClass: "bg-orange-50",
      page: "tasks" as Page,
    },
    {
      title: "Low Stock Items",
      value: stats?.lowStockItems?.toString() ?? "0",
      icon: AlertTriangle,
      colorClass: "text-red-600",
      bgClass: "bg-red-50",
      page: "inventory" as Page,
    },
    {
      title: "Monthly Expenses",
      value: stats ? `₹${stats.totalExpensesThisMonth.toLocaleString()}` : "₹0",
      icon: DollarSign,
      colorClass: "text-accent-foreground",
      bgClass: "bg-accent/20",
      page: "expenses" as Page,
    },
  ];

  const quickActions = [
    { label: "Add Farmer", page: "farmers" as Page, icon: Users },
    { label: "Add Field", page: "fields" as Page, icon: MapPin },
    { label: "Plant Crop", page: "crops" as Page, icon: Sprout },
    { label: "Create Task", page: "tasks" as Page, icon: ClipboardList },
    { label: "Add Worker", page: "workers" as Page, icon: Package },
    { label: "Update Inventory", page: "inventory" as Page, icon: Package },
    { label: "Log Expense", page: "expenses" as Page, icon: DollarSign },
    { label: "Post Notice", page: "notices" as Page, icon: ClipboardList },
  ];

  return (
    <div data-ocid="dashboard.page" className="space-y-6">
      <Card className="bg-primary text-primary-foreground border-0 overflow-hidden relative shadow-card">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 opacity-90" />
            <div>
              <h2 className="text-xl font-bold">Welcome to AgriManage Pro</h2>
              <p className="text-primary-foreground/80 text-sm mt-0.5">
                Complete farm management solution — track crops, workers,
                inventory &amp; more.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Overview
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
          {statCards.map((card) => (
            <StatCard key={card.title} {...card} loading={isLoading} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map(({ label, page, icon: Icon }) => (
            <Button
              key={label}
              type="button"
              data-ocid={`dashboard.${label.toLowerCase().replace(/\s+/g, "_")}.button`}
              variant="outline"
              onClick={() => onNavigate(page)}
              className="h-auto py-3 flex-col gap-1.5 text-xs font-medium hover:bg-secondary hover:border-primary/30 transition-colors"
            >
              <Icon className="w-4 h-4 text-primary" />
              {label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
