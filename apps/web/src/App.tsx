// apps/web/src/App.tsx
// Roteador principal React Router v6 cobrindo os 10 Fluxos (30 telas), Design System v1.0 e Dashboard Analítico §28
// Suporta BrowserRouter (servidor web) e HashRouter automático quando aberto como arquivo único (.html via WhatsApp)

import React, { useEffect, useState } from "react";
import { BrowserRouter, HashRouter, Routes, Route, useLocation, Link } from "react-router-dom";
import { Compass, X } from "lucide-react";
import { Header } from "./components/layout/Header";
import { TabBar } from "./components/layout/TabBar";
import {
  HomePage,
  CategoryPage,
  SearchPage,
  RankingPage,
  NewPage,
  ProductPage,
} from "./routes/CatalogPages";
import {
  CartPage,
  CheckoutPage,
  OrderConfirmPage,
  LoginPage,
  OnboardingPage,
  WelcomeSplashPage,
  OnboardingSuccessPage,
} from "./routes/CheckoutPages";
import {
  ProfilePage,
  OrdersPage,
  OrderDetailPage,
  WishlistPage,
  WishlistDetailPage,
  AlertsPage,
  AddressesPage,
} from "./routes/PostPurchasePages";
import {
  AssistantPage,
  SharedCartCreatePage,
  SharedCartPage,
  LivePage,
  AnalyticsDashboardPage,
} from "./routes/ExperiencePages";
import { DesignSystemPage } from "./routes/DesignSystemPage";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
}

function QuickReviewFloatingMenu() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const shortcuts = [
    { code: "F01", label: "Vitrine Home", path: "/" },
    { code: "F02", label: "Top 5 & Filtros", path: "/mais-vendidos" },
    { code: "F03", label: "PDP Produto (Zoom 2x)", path: "/produto/lenco-seda-riviera-esmeralda" },
    { code: "F04", label: "Sacola & ICMS Dinâmico", path: "/carrinho" },
    { code: "F04b", label: "Checkout QR Pix Split", path: "/checkout" },
    { code: "F05", label: "Rastreio Correios 5 Etapas", path: "/conta/pedidos/PEL-2026-0842" },
    { code: "F06", label: "Splash Editorial", path: "/boas-vindas" },
    { code: "F06b", label: "Cadastro KYC Banco", path: "/cadastro" },
    { code: "F07", label: "Wishlist + Gráfico SVG", path: "/conta/desejos" },
    { code: "F08", label: "Assistente IA (Foto)", path: "/conta/assistente" },
    { code: "F09", label: "Presente Amiga (Bia)", path: "/s/aniversario-marina-2026" },
    { code: "F10", label: "Live Marina Ferraz", path: "/live/quinta-luxo" },
    { code: "DS", label: "Spec Figma (14 Comp.)", path: "/design-system" },
    { code: "KPI", label: "KPIs & IA Lake (§28)", path: "/admin/analytics" },
  ];

  return (
    <div className="fixed bottom-20 right-4 z-50">
      {open ? (
        <div className="bg-[#14110E]/95 backdrop-blur-xl border border-[#C9A961] rounded-2xl p-3.5 w-72 shadow-2xl space-y-2.5">
          <div className="flex items-center justify-between border-b border-[#2A2520] pb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#C9A961] font-bold">
              Navegador de Revisão (10 Fluxos)
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-[#8A8278] hover:text-[#F5EFE6]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-1 max-h-72 overflow-y-auto pr-1">
            {shortcuts.map((s) => {
              const active = location.pathname === s.path;
              return (
                <Link
                  key={s.code}
                  to={s.path}
                  onClick={() => setOpen(false)}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition ${
                    active
                      ? "bg-[#C9A961] text-[#0A0908] font-bold"
                      : "text-[#F5EFE6] hover:bg-[#1C1814]"
                  }`}
                >
                  <span>{s.label}</span>
                  <span
                    className={`font-mono text-[10px] ${
                      active ? "text-[#0A0908]" : "text-[#4FC3F7]"
                    }`}
                  >
                    {s.code}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-[#14110E]/95 border border-[#C9A961] text-[#C9A961] text-xs font-semibold shadow-2xl hover:bg-[#C9A961] hover:text-[#0A0908] transition"
        >
          <Compass className="w-4 h-4" />
          <span>Mapa 10 Fluxos</span>
        </button>
      )}
    </div>
  );
}

const Router =
  typeof window !== "undefined" && window.location.protocol === "file:"
    ? HashRouter
    : BrowserRouter;

export function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-[#0A0908] text-[#F5EFE6]">
        <Header />
        <main className="flex-1">
          <Routes>
            {/* Design System & Figma Spec (Slides 01-12) */}
            <Route path="/design-system" element={<DesignSystemPage />} />

            {/* Públicas (Flow 01, 02, 03, 04, 09, 10) */}
            <Route path="/" element={<HomePage />} />
            <Route path="/busca" element={<SearchPage />} />
            <Route path="/catalogo/:category" element={<CategoryPage />} />
            <Route path="/produto/:slug" element={<ProductPage />} />
            <Route path="/mais-vendidos" element={<RankingPage />} />
            <Route path="/novidades" element={<NewPage />} />
            <Route path="/carrinho" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/checkout/confirmacao/:orderId" element={<OrderConfirmPage />} />
            <Route path="/live/:id" element={<LivePage />} />
            <Route path="/s/:token" element={<SharedCartPage />} />

            {/* Autenticação, Welcome Splash & Onboarding KYC Banco Parceiro (Flow 06) */}
            <Route path="/boas-vindas" element={<WelcomeSplashPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/cadastro" element={<OnboardingPage />} />
            <Route path="/cadastro/sucesso" element={<OnboardingSuccessPage />} />

            {/* Conta, Pós-Compra, Wishlist c/ Gráfico SVG e IA (Flow 05, 07, 08, 09) */}
            <Route path="/conta" element={<ProfilePage />} />
            <Route path="/conta/pedidos" element={<OrdersPage />} />
            <Route path="/conta/pedidos/:id" element={<OrderDetailPage />} />
            <Route path="/conta/desejos" element={<WishlistPage />} />
            <Route path="/conta/desejos/:productId" element={<WishlistDetailPage />} />
            <Route path="/conta/alertas" element={<AlertsPage />} />
            <Route path="/conta/assistente" element={<AssistantPage />} />
            <Route path="/conta/assistente/:lookId" element={<AssistantPage />} />
            <Route path="/conta/enderecos" element={<AddressesPage />} />
            <Route path="/conta/Enderecos" element={<AddressesPage />} />
            <Route path="/conta/compartilhar" element={<SharedCartCreatePage />} />

            {/* Analytics & Steering Committee (Spec §28 + Brief §5) */}
            <Route path="/admin/analytics" element={<AnalyticsDashboardPage />} />
          </Routes>
        </main>
        <QuickReviewFloatingMenu />
        <TabBar />
      </div>
    </Router>
  );
}

export default App;
