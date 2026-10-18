// apps/web/src/components/layout/TabBar.tsx
// Tab Bar Mobile · Portal Estilo Luxo (Volume I · Pitch Editorial)
// Creme Editorial (#FAF7F2), Dourado (#B8924A) e Preto (#0A0A0A)

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Layers, BookOpen, ShoppingBag, User } from "lucide-react";
import { usePortalStore } from "../../stores/app.store";

export function TabBar() {
  const location = useLocation();
  const { cart, alerts } = usePortalStore();

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const unreadAlerts = alerts.filter((a) => !a.read).length;

  const tabs = [
    {
      label: "Início",
      path: "/",
      icon: Home,
      isActive: location.pathname === "/" || location.pathname.startsWith("/produto"),
    },
    {
      label: "Categorias",
      path: "/categoria/lencos",
      icon: Layers,
      isActive: location.pathname.startsWith("/categoria"),
    },
    {
      label: "Estudo",
      path: "/estudo",
      icon: BookOpen,
      isActive: location.pathname === "/estudo",
    },
    {
      label: "Sacola",
      path: "/carrinho",
      icon: ShoppingBag,
      isActive: location.pathname === "/carrinho" || location.pathname.startsWith("/checkout"),
      badge: totalItems,
    },
    {
      label: "Conta",
      path: "/conta",
      icon: User,
      isActive: location.pathname.startsWith("/conta"),
      badge: unreadAlerts,
    },
  ];

  return (
    <nav
      aria-label="Navegação mobile"
      className="fixed bottom-0 inset-x-0 z-40 bg-[#FAF7F2]/95 dark:bg-[#0A0908]/95 backdrop-blur-lg border-t border-[#C9BFA8] dark:border-[#2A2520] pb-safe"
    >
      <div className="max-w-lg mx-auto grid grid-cols-5 h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`relative flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition ${
                tab.isActive
                  ? "text-[#8B6B30] dark:text-[#D9BE85] font-bold"
                  : "text-[#8C8275] hover:text-[#0A0A0A] dark:hover:text-[#FAF7F2]"
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {typeof tab.badge === "number" && tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-[#0A0A0A] text-[#FAF7F2] text-[9px] font-bold flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span>{tab.label}</span>
              {tab.isActive && (
                <span className="absolute top-0 w-8 h-0.5 rounded-full bg-[#B8924A]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
