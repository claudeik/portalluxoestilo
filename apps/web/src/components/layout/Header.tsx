// apps/web/src/components/layout/Header.tsx
// Header Editorial · Portal Estilo Luxo (Volume I · Pitch Editorial)
// Paleta Creme Editorial (#FAF7F2), Preto Profundo (#0A0A0A) e Dourado Champagne (#B8924A)

import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ShoppingBag,
  Heart,
  Search,
  UserCheck,
  Sparkles,
  BookOpen,
  Mail,
  Sun,
  Moon,
  Users,
  ChevronDown,
  Bell,
  CheckCircle2,
  X,
  PackageCheck,
} from "lucide-react";
import { usePortalStore } from "../../stores/app.store";
import { PERSONAS } from "../../data/catalog.data";

export function Header() {
  const location = useLocation();
  const {
    cart,
    wishlistIds,
    customer,
    currentPersona,
    switchPersona,
    themeMode,
    toggleTheme,
    editorialNotifications,
    activeNotificationModal,
    setActiveNotificationModal,
    toastMessage,
    selectedState,
  } = usePortalStore();

  const [personaMenuOpen, setPersonaMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const personaRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const activePersonaObj = PERSONAS[currentPersona];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (personaRef.current && !personaRef.current.contains(e.target as Node)) {
        setPersonaMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Top Banner de Transparência e Curadoria */}
      <div className="bg-[#0A0A0A] text-[#FAF7F2] text-[11px] py-1.5 px-4 border-b border-[#B8924A]/30">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8924A] animate-pulse shrink-0" />
            <span className="truncate">
              Curadoria Ciudad del Este → Brasil · Isenção Remessa Conforme (II Federal R$ 0,00)
            </span>
          </div>

          <div className="flex items-center gap-4 shrink-0 text-[10px] font-mono">
            {/* Persona Switcher Dropdown */}
            <div className="relative" ref={personaRef}>
              <button
                type="button"
                onClick={() => setPersonaMenuOpen(!personaMenuOpen)}
                className="flex items-center gap-1.5 text-[#D9BE85] hover:text-white transition py-0.5 px-2 rounded-md bg-[#2C2C2C]/60"
              >
                <Users className="w-3 h-3 text-[#B8924A]" />
                <span className="font-sans font-semibold">Persona: {activePersonaObj?.name.split(" ")[0]}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {personaMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-64 bg-[#0A0A0A] border border-[#B8924A] rounded-xl p-2 shadow-2xl z-50 space-y-1 text-left">
                  <div className="px-2.5 py-1 text-[9px] uppercase tracking-wider text-[#D9BE85] border-b border-[#2C2C2C]">
                    Trocar Persona de Teste
                  </div>
                  {Object.values(PERSONAS).map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        switchPersona(p.id);
                        setPersonaMenuOpen(false);
                      }}
                      className={`w-full text-left p-2 rounded-lg text-xs transition flex items-center gap-2.5 ${
                        currentPersona === p.id
                          ? "bg-[#B8924A] text-[#0A0A0A] font-bold"
                          : "text-[#FAF7F2] hover:bg-[#2C2C2C]"
                      }`}
                    >
                      <img src={p.avatar} alt={p.name} className="w-7 h-7 rounded-full object-cover shrink-0" />
                      <div className="flex-1 truncate">
                        <div className="truncate font-serif">{p.name} ({p.age}a)</div>
                        <div className="text-[10px] opacity-75 truncate">{p.profession}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link to="/estudo" className="hidden sm:inline-flex items-center gap-1 text-[#D9BE85] hover:underline">
              <BookOpen className="w-3 h-3" />
              <span>Pitch Editorial</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Header Principal */}
      <header className="sticky top-0 z-30 bg-[#FAF7F2]/95 dark:bg-[#0A0908]/95 backdrop-blur-md border-b border-[#C9BFA8] dark:border-[#2A2520] transition-colors">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Logo Editorial */}
          <Link to="/" className="flex flex-col group">
            <span className="font-serif text-xl sm:text-2xl tracking-[0.18em] text-[#0A0A0A] dark:text-[#FAF7F2] font-normal leading-tight group-hover:text-[#8B6B30] transition">
              PORTAL · ESTILO · LUXO
            </span>
            <span className="text-[9px] font-sans tracking-[0.25em] uppercase text-[#8B6B30] dark:text-[#D9BE85]">
              Curadoria do Paraguai para o Brasil
            </span>
          </Link>

          {/* Links Centrais Desktop */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-[#2C2C2C] dark:text-[#FAF7F2]">
            <Link
              to="/"
              className={`hover:text-[#8B6B30] transition ${
                location.pathname === "/" ? "text-[#8B6B30] font-bold border-b border-[#8B6B30] pb-1" : ""
              }`}
            >
              Vitrine
            </Link>
            <Link
              to="/categoria/lencos"
              className={`hover:text-[#8B6B30] transition ${
                location.pathname.startsWith("/categoria") ? "text-[#8B6B30] font-bold border-b border-[#8B6B30] pb-1" : ""
              }`}
            >
              Categorias
            </Link>
            <Link
              to="/estudo"
              className={`inline-flex items-center gap-1 hover:text-[#8B6B30] transition ${
                location.pathname === "/estudo" ? "text-[#8B6B30] font-bold border-b border-[#8B6B30] pb-1" : ""
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#B8924A]" />
              <span>Estudo & Tese</span>
            </Link>
            <Link
              to="/newsletter"
              className={`inline-flex items-center gap-1 hover:text-[#8B6B30] transition ${
                location.pathname === "/newsletter" ? "text-[#8B6B30] font-bold border-b border-[#8B6B30] pb-1" : ""
              }`}
            >
              <Mail className="w-3.5 h-3.5 text-[#B8924A]" />
              <span>E-mail Revista</span>
            </Link>
          </nav>

          {/* Ações / Ícones à Direita */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Botão de Notificações Ativas da Jornada */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                aria-label="Notificações da Jornada"
                className="relative p-2 rounded-full text-[#0A0A0A] dark:text-[#FAF7F2] hover:bg-[#F0EBE0] dark:hover:bg-[#1C1814] transition"
              >
                <Bell className="w-4 h-4 text-[#8B6B30]" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#B8924A]" />
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#14110E] border border-[#C9BFA8] dark:border-[#2A2520] rounded-2xl p-4 shadow-2xl z-50 space-y-3">
                  <div className="flex items-center justify-between border-b border-[#C9BFA8]/60 pb-2">
                    <span className="font-serif text-xs font-bold uppercase text-[#0A0A0A] dark:text-[#FAF7F2]">
                      A Espera Sem Silêncio (4 Notificações)
                    </span>
                    <button
                      type="button"
                      onClick={() => setNotificationsOpen(false)}
                      className="text-[#8C8275] hover:text-[#0A0A0A]"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                    {editorialNotifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          setActiveNotificationModal(n.step);
                          setNotificationsOpen(false);
                        }}
                        className="p-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#1C1814] hover:border-[#B8924A] border border-transparent cursor-pointer transition space-y-1"
                      >
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-bold text-[#8B6B30]">{n.title}</span>
                          <span className="text-[#8C8275]">{n.channel}</span>
                        </div>
                        <p className="text-xs font-serif text-[#0A0A0A] dark:text-[#FAF7F2] italic">{n.subtitle}</p>
                        <span className="text-[10px] text-[#8C8275] block">{n.timestamp}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    to="/conta/pedidos/PRT-2026-0847"
                    onClick={() => setNotificationsOpen(false)}
                    className="block text-center text-xs text-[#8B6B30] font-semibold hover:underline pt-1"
                  >
                    Ver Timeline Completa dos Correios →
                  </Link>
                </div>
              )}
            </div>

            {/* Alternador de Tema (Creme Editorial vs Dark) */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Alternar Tema"
              className="p-2 rounded-full text-[#0A0A0A] dark:text-[#FAF7F2] hover:bg-[#F0EBE0] dark:hover:bg-[#1C1814] transition"
            >
              {themeMode === "light" ? <Moon className="w-4 h-4 text-[#8C8275]" /> : <Sun className="w-4 h-4 text-[#D9BE85]" />}
            </button>

            {/* Favoritos / Wishlist */}
            <Link
              to="/conta/desejos"
              aria-label="Meus Favoritos"
              className="relative p-2 rounded-full text-[#0A0A0A] dark:text-[#FAF7F2] hover:bg-[#F0EBE0] dark:hover:bg-[#1C1814] transition"
            >
              <Heart className="w-4 h-4" />
              {wishlistIds.length > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-[#B8924A] text-[#0A0A0A] text-[9px] font-bold flex items-center justify-center">
                  {wishlistIds.length}
                </span>
              )}
            </Link>

            {/* Sacola de Compras */}
            <Link
              to="/carrinho"
              aria-label="Sacola de Compras"
              className="relative p-2 rounded-full text-[#0A0A0A] dark:text-[#FAF7F2] hover:bg-[#F0EBE0] dark:hover:bg-[#1C1814] transition"
            >
              <ShoppingBag className="w-4 h-4 text-[#0A0A0A] dark:text-[#FAF7F2]" />
              {totalCartItems > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#0A0A0A] dark:bg-[#B8924A] text-[#FAF7F2] dark:text-[#0A0A0A] text-[10px] font-bold flex items-center justify-center">
                  {totalCartItems}
                </span>
              )}
            </Link>

            {/* Minha Conta */}
            <Link
              to="/conta"
              aria-label="Minha Conta"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F0EBE0] dark:bg-[#1C1814] border border-[#C9BFA8] dark:border-[#2A2520] text-xs font-medium text-[#0A0A0A] dark:text-[#FAF7F2]"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#8B6B30]" />
              <span className="truncate max-w-[80px]">
                {customer ? customer.fullName.split(" ")[0] : "Entrar"}
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Modal de Notificação Ativa da Jornada */}
      {activeNotificationModal !== null && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-[#0A0A0A]/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
        >
          <div className="bg-[#FAF7F2] text-[#0A0A0A] border border-[#B8924A] rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setActiveNotificationModal(null)}
              className="absolute top-5 right-5 text-[#8C8275] hover:text-[#0A0A0A]"
            >
              <X className="w-5 h-5" />
            </button>

            {(() => {
              const current = editorialNotifications.find((n) => n.step === activeNotificationModal);
              if (!current) return null;
              return (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#5B8254]" />
                    <span className="text-[10px] uppercase font-mono tracking-wider text-[#8B6B30]">
                      {current.channel} Oficial · {current.timestamp}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif text-2xl font-normal text-[#0A0A0A]">
                      {current.title}
                    </h3>
                    <p className="italic-serif text-lg text-[#8B6B30] mt-1">
                      {current.subtitle}
                    </p>
                  </div>

                  {current.imageUrl && (
                    <div className="rounded-xl overflow-hidden border border-[#C9BFA8] aspect-video">
                      <img
                        src={current.imageUrl}
                        alt="Foto do pacote"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <p className="text-xs text-[#4A4A4A] leading-relaxed bg-white p-4 rounded-xl border border-[#C9BFA8]">
                    {current.body}
                  </p>

                  <div className="pt-2 flex items-center gap-3">
                    <Link
                      to="/conta/pedidos/PRT-2026-0847"
                      onClick={() => setActiveNotificationModal(null)}
                      className="btn-gold flex-1 text-center"
                    >
                      Acompanhar no Rastreio →
                    </Link>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-20 right-4 left-4 sm:left-auto sm:max-w-sm z-50 bg-[#0A0A0A] text-[#FAF7F2] border border-[#B8924A] px-4 py-3 rounded-2xl shadow-2xl flex items-center justify-between gap-3 animate-fade-in"
        >
          <div className="flex items-center gap-2.5 text-xs leading-relaxed">
            <span className="w-2 h-2 rounded-full bg-[#B8924A] shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => usePortalStore.getState().setToast(null)}
            className="text-[11px] text-[#D9BE85] font-semibold hover:underline shrink-0"
          >
            Fechar
          </button>
        </div>
      )}
    </>
  );
}
