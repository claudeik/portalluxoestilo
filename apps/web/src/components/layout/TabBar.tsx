// apps/web/src/components/layout/TabBar.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Sparkles, Radio, ShoppingBag, User } from "lucide-react";
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
      isActive:
        location.pathname === "/" ||
        location.pathname.startsWith("/catalogo") ||
        location.pathname.startsWith("/produto"),
    },
    {
      label: "Assistente IA",
      path: "/conta/assistente",
      icon: Sparkles,
      isActive: location.pathname.startsWith("/conta/assistente"),
    },
    {
      label: "Ao Vivo",
      path: "/live/quinta-luxo",
      icon: Radio,
      isActive: location.pathname.startsWith("/live"),
      liveDot: true,
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
      isActive:
        location.pathname === "/conta" ||
        location.pathname.startsWith("/conta/pedidos") ||
        location.pathname.startsWith("/conta/desejos") ||
        location.pathname.startsWith("/conta/alertas"),
      badge: unreadAlerts,
    },
  ];

  return (
    <nav
      aria-label="Navegação principal mobile"
      data-testid="mobile-tabbar"
      className="fixed bottom-0 inset-x-0 z-40 bg-[#0A0908]/95 backdrop-blur-lg border-t border-[#2A2520] pb-safe"
    >
      <div className="max-w-lg mx-auto grid grid-cols-5 h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`relative flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition ${
                tab.isActive ? "text-[#C9A961]" : "text-[#A89F91] hover:text-[#F5EFE6]"
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {tab.liveDot && (
                  <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                )}
                {typeof tab.badge === "number" && tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-[#C9A961] text-[#0A0908] text-[9px] font-bold flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span>{tab.label}</span>
              {tab.isActive && (
                <span className="absolute top-0 w-8 h-0.5 rounded-full bg-[#C9A961]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
