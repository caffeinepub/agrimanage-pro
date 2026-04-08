import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import AdminLayout from "./components/Layout";
import UserLayout from "./components/UserLayout";
import { useAdminAuth } from "./hooks/useAdminAuth";
import AdminLogin from "./pages/AdminLogin";
import Crops from "./pages/Crops";
import Dashboard from "./pages/Dashboard";
import Delivery from "./pages/Delivery";
import Expenses from "./pages/Expenses";
import Farmers from "./pages/Farmers";
import Fields from "./pages/Fields";
import Inventory from "./pages/Inventory";
import Livestock from "./pages/Livestock";
import NoticeBoard from "./pages/NoticeBoard";
import Reports from "./pages/Reports";
import Tasks from "./pages/Tasks";
import UserHome from "./pages/UserHome";
import Weather from "./pages/Weather";
import Workers from "./pages/Workers";

export type Page =
  | "dashboard"
  | "farmers"
  | "fields"
  | "crops"
  | "workers"
  | "tasks"
  | "inventory"
  | "expenses"
  | "notices"
  | "delivery"
  | "weather"
  | "reports"
  | "livestock";

export type UserPage =
  | "home"
  | "delivery"
  | "notices"
  | "weather"
  | "reports"
  | "livestock";

export default function App() {
  const [adminPage, setAdminPage] = useState<Page>("dashboard");
  const [userPage, setUserPage] = useState<UserPage>("home");
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const { isAuthenticated, login, logout } = useAdminAuth();

  // --- Admin mode ---
  if (isAuthenticated) {
    const renderAdminPage = () => {
      switch (adminPage) {
        case "dashboard":
          return <Dashboard onNavigate={setAdminPage} />;
        case "farmers":
          return <Farmers />;
        case "fields":
          return <Fields />;
        case "crops":
          return <Crops />;
        case "workers":
          return <Workers />;
        case "tasks":
          return <Tasks />;
        case "inventory":
          return <Inventory />;
        case "expenses":
          return <Expenses />;
        case "notices":
          return <NoticeBoard isAdmin />;
        case "delivery":
          return <Delivery isAdmin />;
        case "weather":
          return <Weather isAdmin />;
        case "reports":
          return <Reports isAdmin />;
        case "livestock":
          return <Livestock isAdmin />;
        default:
          return <Dashboard onNavigate={setAdminPage} />;
      }
    };
    return (
      <>
        <AdminLayout
          currentPage={adminPage}
          onNavigate={setAdminPage}
          onAdminLogout={logout}
        >
          {renderAdminPage()}
        </AdminLayout>
        <Toaster richColors position="top-right" />
      </>
    );
  }

  // --- Admin login overlay ---
  if (showAdminLogin) {
    return (
      <>
        <AdminLogin onLogin={login} onBack={() => setShowAdminLogin(false)} />
        <Toaster richColors position="top-right" />
      </>
    );
  }

  // --- Public user mode ---
  const renderUserPage = () => {
    switch (userPage) {
      case "home":
        return <UserHome onNavigate={setUserPage} />;
      case "delivery":
        return <Delivery isAdmin={false} onNavigate={setUserPage} />;
      case "notices":
        return <NoticeBoard isAdmin={false} />;
      case "weather":
        return <Weather />;
      case "reports":
        return <Reports />;
      case "livestock":
        return <Livestock />;
      default:
        return <UserHome onNavigate={setUserPage} />;
    }
  };

  return (
    <>
      <UserLayout
        currentPage={userPage}
        onNavigate={setUserPage}
        onAdminLogin={() => setShowAdminLogin(true)}
      >
        {renderUserPage()}
      </UserLayout>
      <Toaster richColors position="top-right" />
    </>
  );
}
