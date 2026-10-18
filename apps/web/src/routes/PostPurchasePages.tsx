// apps/web/src/routes/PostPurchasePages.tsx
// Mockups 10, 11, 13 e 14 · Portal Estilo Luxo (Volume I · Pitch Editorial)
// Minha Conta, Wishlist da Safra, Rastreio Correios 6 Etapas ("A Espera Sem Silêncio") e Notificações

import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Package,
  Heart,
  Bell,
  Sparkles,
  MapPin,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Clock,
  Star,
  FileText,
  ArrowLeft,
  Share2,
  Copy,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { usePortalStore } from "../stores/app.store";
import { ProductCard } from "../components/catalog/ProductCard";
import { formatBrl } from "../lib/format";
import { PERSONAS } from "../data/catalog.data";

export function ProfilePage() {
  const { customer, orders, wishlistIds, currentPersona, switchPersona } = usePortalStore();
  const recentOrder = orders[0];
  const persona = PERSONAS[currentPersona];

  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 pb-28 space-y-6 animate-fade-in text-left">
      <div className="flex items-center justify-between border-b border-[#C9BFA8] pb-4">
        <div>
          <span className="eyebrow text-[#8B6B30]">Mockup 10 · Minha Conta</span>
          <h1 className="font-serif text-3xl text-[#0A0A0A] dark:text-[#FAF7F2]">
            Perfil da Cliente
          </h1>
        </div>
        <span className="text-xs text-[#8C8275]">Cliente desde Out/2026</span>
      </div>

      {/* Card do Perfil */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#14110E] border border-[#C9BFA8] dark:border-[#2A2520] shadow-sm flex items-center gap-4">
        <img
          src={persona.avatar}
          alt={persona.name}
          className="w-16 h-16 rounded-full object-cover border-2 border-[#B8924A] shrink-0"
        />
        <div className="flex-1 truncate">
          <div className="font-serif text-xl text-[#0A0A0A] dark:text-[#FAF7F2] truncate">
            {customer?.fullName || persona.name}
          </div>
          <div className="text-xs text-[#8B6B30] italic-serif font-medium">
            {persona.profession} · {persona.location}
          </div>
          <div className="text-[11px] text-[#8C8275] pt-0.5">
            CPF: {customer?.cpf || "•••.•••.678-90"} · KYC Banco Parceiro Aprovado ✓
          </div>
        </div>
      </div>

      {/* Pedido Recente (Destaque do Estudo) */}
      {recentOrder && (
        <div className="p-5 rounded-2xl bg-white dark:bg-[#14110E] border-l-4 border-[#B8924A] border border-[#C9BFA8] space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-[#8B6B30] tracking-wider">
              Pedido Recente
            </span>
            <span className="text-[10px] font-mono text-[#8C8275]">
              #{recentOrder.orderNumber}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-base text-[#0A0A0A] dark:text-[#FAF7F2] font-semibold">
                {recentOrder.items[0]?.product?.name || "Lenço Estampado Floral"}
              </h3>
              <span className="text-xs text-[#5B8254] font-medium block mt-0.5">
                ● Status: Em trânsito para São Paulo / SP
              </span>
            </div>
            <div className="text-right">
              <span className="italic-serif text-lg font-bold text-[#8B6B30]">
                {formatBrl(recentOrder.totalBrl)}
              </span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs">
            <span className="text-[#8C8275]">Código: {recentOrder.trackingCode}</span>
            <Link
              to={`/conta/pedidos/${recentOrder.id}`}
              className="text-[#8B6B30] hover:underline font-semibold flex items-center gap-1"
            >
              <span>Ver Linha do Tempo</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Grid de Cards da Conta (Histórico, Endereços, Indicação) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/conta/pedidos"
          className="p-4 rounded-2xl bg-white dark:bg-[#14110E] border border-[#C9BFA8] hover:border-[#B8924A] transition space-y-1 block shadow-sm"
        >
          <span className="text-[10px] uppercase font-bold text-[#8C8275]">Histórico</span>
          <div className="font-serif text-lg text-[#0A0A0A] dark:text-[#FAF7F2]">
            {orders.length} {orders.length === 1 ? "Pedido" : "Pedidos"}
          </div>
          <span className="text-[11px] text-[#8B6B30]">
            {formatBrl(orders.reduce((acc, o) => acc + o.totalBrl, 0))} acumulado
          </span>
        </Link>

        <Link
          to="/conta/enderecos"
          className="p-4 rounded-2xl bg-white dark:bg-[#14110E] border border-[#C9BFA8] hover:border-[#B8924A] transition space-y-1 block shadow-sm"
        >
          <span className="text-[10px] uppercase font-bold text-[#8C8275]">Endereço Salvo</span>
          <div className="font-serif text-lg text-[#0A0A0A] dark:text-[#FAF7F2]">
            Pinheiros, SP
          </div>
          <span className="text-[11px] text-[#8C8275]">R. Aspicuelta, 123</span>
        </Link>

        <div className="p-4 rounded-2xl bg-[#F0EBE0] dark:bg-[#1C1814] border border-[#B8924A] space-y-1 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-[#8B6B30]">Indicações</span>
          <div className="font-serif text-lg text-[#0A0A0A] dark:text-[#FAF7F2]">
            R$ 15,00
          </div>
          <span className="text-[11px] text-[#5B8254] font-medium">Crédito disponível</span>
        </div>
      </div>

      {/* Compartilhamento / Indicar Amiga (Cena 6 do Storyboard) */}
      <div className="p-6 rounded-3xl bg-[#0A0A0A] text-[#FAF7F2] space-y-4 shadow-xl">
        <div className="space-y-1">
          <span className="eyebrow text-[#D9BE85]">Cena 6 · Indicação entre Amigas</span>
          <h3 className="font-serif text-xl font-normal text-[#FAF7F2]">
            Indique a Portal e ganhe <em className="italic text-[#D9BE85]">R$ 15</em>
          </h3>
          <p className="text-xs text-[#C9BFA8] leading-relaxed">
            "Acabei de comprar este lenço na Portal — preço final na tela, sem taxas na entrega e veio direto dos Correios."
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            navigator.clipboard?.writeText("https://portalestiloluxo.com.br/convite/mariahelena");
            usePortalStore.getState().setToast("Link de indicação copiado! Envie pelo WhatsApp para suas amigas.");
          }}
          className="btn-gold w-full text-center py-3"
        >
          <Share2 className="w-4 h-4" />
          <span>Copiar Link de Indicação (WhatsApp)</span>
        </button>
      </div>
    </div>
  );
}

export function WishlistPage() {
  const { wishlistIds, products } = usePortalStore();
  const wishProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="max-w-4xl mx-auto px-4 pt-6 pb-28 space-y-8 animate-fade-in text-left">
      <div className="flex items-center justify-between border-b border-[#C9BFA8] pb-4">
        <div>
          <span className="eyebrow text-[#8B6B30]">Mockup 11 · Meus Favoritos</span>
          <h1 className="font-serif text-3xl text-[#0A0A0A] dark:text-[#FAF7F2]">
            Sua Wishlist ({wishProducts.length})
          </h1>
          <p className="italic-serif text-sm text-[#8B6B30] mt-1">
            Salvo para a próxima safra · Avisaremos quando entrar em destaque
          </p>
        </div>
      </div>

      {wishProducts.length === 0 ? (
        <div className="text-center py-16 space-y-4">
          <Heart className="w-12 h-12 text-[#8C8275] mx-auto" />
          <p className="text-xs text-[#8C8275]">Sua lista de desejos está vazia.</p>
          <Link to="/" className="btn-gold inline-flex">
            Explorar Safra Primavera →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {wishProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { orders, advanceOrderTracking, setActiveNotificationModal } = usePortalStore();
  const order = orders.find((o) => o.id === id || o.orderNumber === id) || orders[0];

  const currentStep = order?.trackingStep ?? 4;

  const trackingSteps = [
    { num: 1, label: "Pago · Split Pix Liquidado", time: "17/10 · 22h17", loc: "São Paulo / SP", detail: "Pix de R$ 162,65 dividido em 4 vias reguladas." },
    { num: 2, label: "Em preparação · Unicentro PY", time: "18/10 · 09h00", loc: "Ciudad del Este / PY", detail: "Envolvido em papel seda cream com cartão numerado assinado." },
    { num: 3, label: "Postado · Correios PY", time: "19/10 · 14h22", loc: "Ciudad del Este / PY", detail: "Despachado sob código PY20261019847BR." },
    { num: 4, label: "Desembaraçado · Alfândega BR", time: "22/10 · 11h08", loc: "Curitiba / PR", detail: "Canal Verde Remessa Conforme. Imposto Federal R$ 0,00." },
    { num: 5, label: "Em trânsito · CD São Paulo", time: "28/10 · 08h30", loc: "São Paulo / SP", detail: "A caminho da unidade de distribuição de Pinheiros." },
    { num: 6, label: "Entregue pelos Correios", time: "Previsto 30/10", loc: "Rua Aspicuelta, 123", detail: "Entrega no domicílio sem cobranças extras." },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 pb-28 space-y-8 animate-fade-in text-left">
      <Link
        to="/conta"
        className="inline-flex items-center gap-1.5 text-xs text-[#8C8275] hover:text-[#0A0A0A]"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar à Minha Conta</span>
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#C9BFA8] pb-4">
        <div>
          <span className="eyebrow text-[#8B6B30]">Mockup 13 · A Espera Sem Silêncio</span>
          <h1 className="font-serif text-3xl text-[#0A0A0A] dark:text-[#FAF7F2]">
            Rastreio #{order.orderNumber}
          </h1>
          <p className="text-xs text-[#8C8275] mt-1">
            Código Correios: <strong className="font-mono text-[#0A0A0A] dark:text-[#FAF7F2]">{order.trackingCode}</strong>
          </p>
        </div>

        <button
          type="button"
          onClick={() => advanceOrderTracking(order.id)}
          className="btn-gold text-[10px] py-1.5 px-3"
        >
          <span>Simular Próxima Etapa</span>
        </button>
      </div>

      {/* Timeline Visual de 6 Etapas (Mockup 13) */}
      <div className="bg-white dark:bg-[#14110E] border border-[#C9BFA8] dark:border-[#2A2520] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#C9BFA8]/60 pb-3">
          <span className="font-serif text-base text-[#0A0A0A] dark:text-[#FAF7F2]">
            Linha do Tempo dos Correios (10 a 15 dias)
          </span>
          <span className="text-[10px] font-mono uppercase text-[#5B8254] font-bold">
            Etapa {Math.min(6, currentStep + 1)} de 6
          </span>
        </div>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-[#C9BFA8]">
          {trackingSteps.map((s, idx) => {
            const isDone = idx <= currentStep;
            const isCurrent = idx === currentStep;
            return (
              <div key={s.num} className="relative space-y-1">
                {/* Dot */}
                <div
                  className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 transition ${
                    isDone
                      ? "bg-[#B8924A] border-[#0A0A0A]"
                      : "bg-[#FAF7F2] border-[#C9BFA8]"
                  } ${isCurrent ? "ring-4 ring-[#B8924A]/30 scale-110" : ""}`}
                />

                <div className="flex items-baseline justify-between text-xs">
                  <span className={`font-semibold ${isDone ? "text-[#0A0A0A] dark:text-[#FAF7F2]" : "text-[#8C8275]"}`}>
                    {s.label}
                  </span>
                  <span className="text-[10px] font-mono text-[#8C8275]">{s.time}</span>
                </div>

                <div className="text-[11px] text-[#4A4A4A] dark:text-[#FAF7F2]/80 leading-relaxed">
                  {s.detail} · <span className="text-[#8B6B30] font-medium">{s.loc}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Atalhos para as 4 Notificações Reais do Estudo (Mockup 14) */}
      <div className="p-6 bg-[#F0EBE0] dark:bg-[#14110E] border border-[#B8924A] rounded-3xl space-y-4">
        <div className="space-y-1">
          <span className="eyebrow text-[#8B6B30]">Mockup 14 · Notificações da Jornada</span>
          <h3 className="font-serif text-xl text-[#0A0A0A] dark:text-[#FAF7F2]">
            As 4 Mensagens que Substituem o Silêncio
          </h3>
          <p className="text-xs text-[#4A4A4A] dark:text-[#FAF7F2]/80">
            A Portal elimina a ansiedade enviando atualizações proativas no WhatsApp:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {[
            { step: 1, title: "1. Pix Confirmado", text: '"Recebemos seu pagamento, Maria."' },
            { step: 2, title: "2. Postado com Foto", text: '"Seu lenço está a caminho (ver foto do pacote)."' },
            { step: 3, title: "3. Alfândega Verde", text: '"Passou pela alfândega. Sem taxa."' },
            { step: 4, title: "4. Dia da Entrega", text: '"Hoje, entre 10h e 18h."' },
          ].map((btn) => (
            <button
              key={btn.step}
              type="button"
              onClick={() => setActiveNotificationModal(btn.step)}
              className="p-3 bg-white dark:bg-[#1C1814] border border-[#C9BFA8] hover:border-[#B8924A] rounded-xl text-left transition space-y-1 block shadow-sm"
            >
              <span className="text-[10px] font-bold text-[#8B6B30] uppercase block">{btn.title}</span>
              <span className="italic-serif text-xs text-[#0A0A0A] dark:text-[#FAF7F2] line-clamp-1">{btn.text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function OrdersPage() {
  const { orders } = usePortalStore();
  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 pb-28 space-y-6 text-left animate-fade-in">
      <h1 className="font-serif text-3xl text-[#0A0A0A]">Meus Pedidos</h1>
      <div className="space-y-4">
        {orders.map((o) => (
          <div key={o.id} className="p-4 bg-white border border-[#C9BFA8] rounded-2xl flex justify-between items-center">
            <div>
              <span className="font-mono text-xs text-[#8C8275]">#{o.orderNumber}</span>
              <h3 className="font-serif text-base text-[#0A0A0A]">{o.items[0]?.product?.name}</h3>
              <span className="text-xs text-[#5B8254]">● {o.status}</span>
            </div>
            <div className="text-right space-y-2">
              <span className="italic-serif text-lg font-bold text-[#8B6B30] block">{formatBrl(o.totalBrl)}</span>
              <Link to={`/conta/pedidos/${o.id}`} className="text-xs text-[#8B6B30] font-semibold hover:underline">
                Rastrear →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function WishlistDetailPage() {
  return <WishlistPage />;
}

export function AlertsPage() {
  const { alerts } = usePortalStore();
  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 pb-28 space-y-6 text-left animate-fade-in">
      <h1 className="font-serif text-3xl text-[#0A0A0A]">Alertas de Curadoria</h1>
      <div className="space-y-3">
        {alerts.map((a) => (
          <div key={a.id} className="p-4 bg-white border border-[#C9BFA8] rounded-xl space-y-1">
            <span className="text-xs font-bold text-[#8B6B30]">{a.title}</span>
            <p className="text-xs text-[#4A4A4A]">{a.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AddressesPage() {
  const { customer } = usePortalStore();
  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 pb-28 space-y-6 text-left animate-fade-in">
      <h1 className="font-serif text-3xl text-[#0A0A0A]">Endereços Salvos</h1>
      <div className="p-4 bg-white border border-[#C9BFA8] rounded-2xl space-y-1">
        <span className="text-xs font-bold text-[#0A0A0A]">Principal</span>
        <p className="text-xs text-[#4A4A4A]">{customer?.addresses[0]?.street}, {customer?.addresses[0]?.number} · {customer?.addresses[0]?.district}</p>
        <p className="text-xs text-[#8C8275]">{customer?.addresses[0]?.city}/{customer?.addresses[0]?.state} · CEP {customer?.addresses[0]?.zipCode}</p>
      </div>
    </div>
  );
}
