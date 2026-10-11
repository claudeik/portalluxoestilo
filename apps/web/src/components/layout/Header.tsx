// apps/web/src/components/layout/Header.tsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingBag,
  Heart,
  Sparkles,
  Radio,
  ShieldCheck,
  BarChart3,
  UserCheck,
  Gift,
  MapPin,
} from "lucide-react";
import { usePortalStore } from "../../stores/app.store";
import { ICMS_RATES } from "../../lib/format";

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    cart,
    wishlistIds,
    alerts,
    selectedState,
    setSelectedState,
    ptaxRate,
    customer,
    loginAsMarina,
    logoutCustomer,
    toastMessage,
  } = usePortalStore();

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const unreadAlerts = alerts.filter((a) => !a.read).length;
  const icmsPct = Math.round((ICMS_RATES[selectedState] ?? 0.17) * 1000) / 10;

  return (
    <>
      {/* Top Cross-Border Trust & Persona Switcher Bar */}
      <div className="bg-[#141210] border-b border-[#2A2520] text-[11px] text-[#A89F91]">
        <div className="max-w-5xl mx-auto px-3 py-1.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[#C9A961] font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              Remessa Conforme · II Federal R$ 0,00
            </span>
            <span className="hidden sm:inline text-[#2A2520]">|</span>
            <span className="hidden sm:inline font-mono text-[10px]">
              PTAX BCB: US$ 1 = R$ {ptaxRate.toFixed(2).replace(".", ",")} (0% spread)
            </span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Seletor dinâmico de UF para ICMS (Product Brief §6.1) */}
            <label className="inline-flex items-center gap-1 bg-[#0A0908] border border-[#2A2520] rounded-full px-2 py-0.5 text-[10px] text-[#F5EFE6]">
              <MapPin className="w-3 h-3 text-[#C9A961]" />
              <span>Entrega:</span>
              <select
                aria-label="Selecionar estado de entrega para cálculo de ICMS"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="bg-transparent text-[#C9A961] font-semibold focus:outline-none cursor-pointer"
              >
                {Object.keys(ICMS_RATES).map((uf) => (
                  <option key={uf} value={uf} className="bg-[#141210] text-[#F5EFE6]">
                    {uf} ({Math.round(ICMS_RATES[uf] * 1000) / 10}%)
                  </option>
                ))}
              </select>
            </label>

            {/* Quick Persona Switcher para demonstração do Piloto */}
            <div className="hidden md:flex items-center gap-1 bg-[#0A0908] border border-[#2A2520] rounded-full p-0.5">
              <button
                type="button"
                onClick={() => {
                  loginAsMarina();
                  navigate("/");
                }}
                className={`px-2 py-0.5 rounded-full text-[10px] transition ${
                  customer ? "bg-[#C9A961] text-[#0A0908] font-semibold" : "text-[#A89F91] hover:text-[#F5EFE6]"
                }`}
              >
                Marina (KYC OK)
              </button>
              <button
                type="button"
                onClick={() => {
                  logoutCustomer();
                  navigate("/cadastro");
                }}
                className={`px-2 py-0.5 rounded-full text-[10px] transition ${
                  !customer && location.pathname === "/cadastro"
                    ? "bg-[#C9A961] text-[#0A0908] font-semibold"
                    : "text-[#A89F91] hover:text-[#F5EFE6]"
                }`}
              >
                Novo KYC
              </button>
              <button
                type="button"
                onClick={() => navigate("/s/aniversario-marina-2026")}
                className={`px-2 py-0.5 rounded-full text-[10px] transition ${
                  location.pathname.startsWith("/s/")
                    ? "bg-[#C9A961] text-[#0A0908] font-semibold"
                    : "text-[#A89F91] hover:text-[#F5EFE6]"
                }`}
              >
                Bia (Presente)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-[#0A0908]/95 backdrop-blur-md border-b border-[#2A2520]">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          {/* Brand Logo */}
          <Link to="/" className="flex flex-col group">
            <span className="font-serif text-xl sm:text-2xl tracking-[0.14em] text-[#F5EFE6] group-hover:text-[#C9A961] transition font-semibold">
              PORTAL ESTILO LUXO
            </span>
            <span className="text-[9px] uppercase tracking-[0.22em] text-[#C9A961]">
              Unicentro Paraguai · Curadoria Brasil ({selectedState} ICMS {icmsPct}%)
            </span>
          </Link>

          {/* Desktop Quick Journey Pills */}
          <nav className="hidden lg:flex items-center gap-1.5 text-xs">
            <Link
              to="/conta/assistente"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition ${
                location.pathname.includes("/assistente")
                  ? "bg-[#C9A961] text-[#0A0908] border-[#C9A961] font-semibold"
                  : "border-[#2A2520] text-[#F5EFE6] hover:border-[#C9A961]/60"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C9A961] shrink-0" />
              <span>Assistente IA</span>
            </Link>
            <Link
              to="/s/aniversario-marina-2026"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition ${
                location.pathname.startsWith("/s/") || location.pathname.includes("/compartilhar")
                  ? "bg-[#C9A961] text-[#0A0908] border-[#C9A961] font-semibold"
                  : "border-[#2A2520] text-[#F5EFE6] hover:border-[#C9A961]/60"
              }`}
            >
              <Gift className="w-3.5 h-3.5 text-[#C9A961] shrink-0" />
              <span>Presente Split</span>
            </Link>
            <Link
              to="/live/quinta-luxo"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition ${
                location.pathname.startsWith("/live")
                  ? "bg-[#C9A961] text-[#0A0908] border-[#C9A961] font-semibold"
                  : "border-[#2A2520] text-[#F5EFE6] hover:border-[#C9A961]/60"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <Radio className="w-3.5 h-3.5" />
              <span>Live</span>
            </Link>
            <Link
              to="/admin/analytics"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition ${
                location.pathname.startsWith("/admin")
                  ? "bg-[#C9A961] text-[#0A0908] border-[#C9A961] font-semibold"
                  : "border-[#2A2520] text-[#A89F91] hover:text-[#F5EFE6] hover:border-[#C9A961]/60"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-[#C9A961]" />
              <span>KPIs & IA Lake</span>
            </Link>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link
              to="/busca"
              aria-label="Buscar produtos"
              className="p-2 rounded-full text-[#F5EFE6] hover:bg-[#141210] hover:text-[#C9A961] transition"
            >
              <Search className="w-5 h-5" />
            </Link>

            <Link
              to="/conta/desejos"
              aria-label="Lista de desejos"
              className="relative p-2 rounded-full text-[#F5EFE6] hover:bg-[#141210] hover:text-[#C9A961] transition"
            >
              <Heart className="w-5 h-5" />
              {wishlistIds.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#1E1B18] border border-[#C9A961] text-[#C9A961] text-[10px] font-bold flex items-center justify-center">
                  {wishlistIds.length}
                </span>
              )}
            </Link>

            <Link
              to="/carrinho"
              aria-label="Sacola de compras"
              data-testid="header-cart-link"
              className="relative p-2 rounded-full text-[#F5EFE6] hover:bg-[#141210] hover:text-[#C9A961] transition"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCartItems > 0 && (
                <span
                  data-testid="cart-badge-count"
                  className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#C9A961] text-[#0A0908] text-[10px] font-bold flex items-center justify-center"
                >
                  {totalCartItems}
                </span>
              )}
            </Link>

            <Link
              to={customer ? "/conta" : "/login"}
              aria-label="Minha conta"
              className="relative hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#141210] border border-[#2A2520] hover:border-[#C9A961]/50 text-xs"
            >
              <UserCheck className="w-4 h-4 text-[#C9A961]" />
              <span className="max-w-[90px] truncate">
                {customer ? customer.fullName.split(" ")[0] : "Entrar"}
              </span>
              {unreadAlerts > 0 && (
                <span className="w-2 h-2 rounded-full bg-[#C9A961]" />
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Non-intrusive Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-20 right-4 left-4 sm:left-auto sm:max-w-sm z-50 bg-[#141210] border border-[#C9A961] text-[#F5EFE6] px-4 py-3 rounded-2xl shadow-2xl flex items-center justify-between gap-3 animate-fade-in"
        >
          <div className="flex items-center gap-2.5 text-xs leading-relaxed">
            <span className="w-2 h-2 rounded-full bg-[#C9A961] shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => usePortalStore.getState().setToast(null)}
            className="text-[11px] text-[#C9A961] font-semibold hover:underline shrink-0"
          >
            Fechar
          </button>
        </div>
      )}
    </>
  );
}
