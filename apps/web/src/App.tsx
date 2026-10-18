// apps/web/src/App.tsx
// Portal Estilo Luxo · Roteador Principal React Router v6 (Volume I · Pitch Editorial)
// Vitrine, 14 Mockups do Estudo, Pitch Editorial, E-mail Revista, Design System e Rastreio Correios

import React, { useEffect, useState } from "react";
import { BrowserRouter, HashRouter, Routes, Route, useLocation, Link } from "react-router-dom";
import { Compass, X, Sparkles, BookOpen } from "lucide-react";
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
import { CrmPage } from "./routes/CrmPage";
import { PitchEditorialPage } from "./routes/PitchEditorialPage";
import { NewsletterPage } from "./routes/NewsletterPage";

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
    { code: "PITCH", label: "Tese & Estudo Completo", path: "/estudo" },
    { code: "M01", label: "01 · Home Editorial", path: "/" },
    { code: "M02", label: "02 · Categoria & Filtros", path: "/categoria/lencos" },
    { code: "M04", label: "04 · PDP Lenço R$ 110", path: "/produto/lenco-estampado-floral" },
    { code: "M05", label: "05 · Sacola & Pré-resumo", path: "/carrinho" },
    { code: "M06", label: "06 · Resumo Transparente", path: "/checkout" },
    { code: "M09", label: "09 · Confirmação Split", path: "/pedido-confirmado/PRT-2026-0847" },
    { code: "M10", label: "10 · Minha Conta", path: "/conta" },
    { code: "M11", label: "11 · Meus Favoritos", path: "/conta/desejos" },
    { code: "M12", label: "12 · E-mail Revista", path: "/newsletter" },
    { code: "M13", label: "13 · Tracking Correios (6 Etapas)", path: "/conta/pedidos/PRT-2026-0847" },
    { code: "IA", label: "Assistente Visual IA", path: "/conta/assistente" },
    { code: "GIFT", label: "Presente Split (Bia)", path: "/s/aniversario-marina-2026" },
    { code: "LIVE", label: "Live Shopping", path: "/live/quinta-luxo" },
    { code: "DS", label: "Design System & Tokens", path: "/design-system" },
  ];

  return (
    <div className="fixed bottom-20 right-4 z-50">
      {open ? (
        <div className="bg-[#0A0A0A]/95 text-[#FAF7F2] backdrop-blur-xl border border-[#B8924A] rounded-2xl p-3.5 w-72 shadow-2xl space-y-2.5">
          <div className="flex items-center justify-between border-b border-[#2C2C2C] pb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#D9BE85] font-bold">
              Navegador do Estudo (14 Telas)
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-[#8C8275] hover:text-[#FAF7F2]"
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
                      ? "bg-[#B8924A] text-[#0A0A0A] font-bold"
                      : "text-[#FAF7F2] hover:bg-[#1C1814]"
                  }`}
                >
                  <span className="truncate">{s.label}</span>
                  <span
                    className={`font-mono text-[9px] ml-2 ${
                      active ? "text-[#0A0A0A]" : "text-[#D9BE85]"
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
          className="p-3 rounded-full bg-[#0A0A0A] text-[#D9BE85] border border-[#B8924A] shadow-2xl hover:scale-105 transition flex items-center gap-2"
          title="Abrir navegador de telas"
        >
          <Compass className="w-5 h-5 text-[#B8924A]" />
          <span className="text-xs font-semibold hidden sm:inline text-[#FAF7F2]">Navegar Telas</span>
        </button>
      )}
    </div>
  );
}

export function AppRoutes() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#0A0908] text-[#0A0A0A] dark:text-[#FAF7F2] transition-colors">
      <ScrollToTop />
      <Header />
      <main className="min-h-[calc(100vh-140px)]">
        <Routes>
          {/* Rotas Principais do Estudo */}
          <Route path="/" element={<HomePage />} />
          <Route path="/categoria/:slug" element={<CategoryPage />} />
          <Route path="/produto/:slug" element={<ProductPage />} />
          <Route path="/busca" element={<SearchPage />} />
          <Route path="/mais-vendidos" element={<RankingPage />} />
          <Route path="/novidades" element={<NewPage />} />

          {/* Carrinho, Checkout & Pix */}
          <Route path="/carrinho" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/pedido-confirmado/:id" element={<OrderConfirmPage />} />
          <Route path="/cadastro" element={<OnboardingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/boas-vindas" element={<WelcomeSplashPage />} />
          <Route path="/onboarding-sucesso" element={<OnboardingSuccessPage />} />

          {/* Pós-Compra & Conta */}
          <Route path="/conta" element={<ProfilePage />} />
          <Route path="/conta/pedidos" element={<OrdersPage />} />
          <Route path="/conta/pedidos/:id" element={<OrderDetailPage />} />
          <Route path="/conta/desejos" element={<WishlistPage />} />
          <Route path="/conta/desejos/:id" element={<WishlistDetailPage />} />
          <Route path="/conta/alertas" element={<AlertsPage />} />
          <Route path="/conta/enderecos" element={<AddressesPage />} />

          {/* Estudo Estratégico & Newsletter Revista */}
          <Route path="/estudo" element={<PitchEditorialPage />} />
          <Route path="/newsletter" element={<NewsletterPage />} />

          {/* Experiências Avançadas */}
          <Route path="/conta/assistente" element={<AssistantPage />} />
          <Route path="/s/:token" element={<SharedCartPage />} />
          <Route path="/compartilhar" element={<SharedCartCreatePage />} />
          <Route path="/live/:slug" element={<LivePage />} />

          {/* Gestão, Analytics & Design System */}
          <Route path="/design-system" element={<DesignSystemPage />} />
          <Route path="/admin/analytics" element={<AnalyticsDashboardPage />} />
          <Route path="/admin/crm" element={<CrmPage />} />

          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      <QuickReviewFloatingMenu />
      <TabBar />
    </div>
  );
}

export default function App() {
  const isHashRouting =
    typeof window !== "undefined" &&
    (window.location.protocol === "file:" || window.location.hash.startsWith("#/"));

  if (isHashRouting) {
    return (
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    );
  }

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
