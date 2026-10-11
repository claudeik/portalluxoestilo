// apps/web/src/routes/PostPurchasePages.tsx
// Telas de Pós-Compra, Timeline Correios SRO-eXML (5 etapas), Minha Conta, Wishlist e Alertas (Flow 5 & Flow 7)

import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Package,
  Heart,
  Bell,
  Sparkles,
  Gift,
  MapPin,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Clock,
  Star,
  AlertTriangle,
  FileText,
  Trash2,
  ArrowLeft,
  FastForward,
} from "lucide-react";
import { usePortalStore } from "../stores/app.store";
import { ProductCard } from "../components/catalog/ProductCard";
import { formatBrl } from "../lib/format";

export function ProfilePage() {
  const navigate = useNavigate();
  const { customer, orders, wishlistIds, alerts, logoutCustomer, loginAsMarina, setToast } =
    usePortalStore();

  const unreadAlerts = alerts.filter((a) => !a.read).length;

  if (!customer) {
    return (
      <div className="max-w-lg mx-auto px-4 pt-12 pb-28 text-center space-y-4">
        <h1 className="font-serif text-3xl text-[#F5EFE6]">Minha Conta</h1>
        <p className="text-xs text-[#A89F91]">
          Você está navegando como visitante. Entre como Marina ou crie seu cadastro simplificado.
        </p>
        <div className="flex justify-center gap-3">
          <button
            type="button"
            onClick={loginAsMarina}
            className="px-5 py-3 rounded-xl bg-[#C9A961] text-[#0A0908] font-bold text-xs"
          >
            Entrar como Marina (Demo)
          </button>
          <Link
            to="/cadastro"
            className="px-5 py-3 rounded-xl bg-[#141210] border border-[#2A2520] text-[#F5EFE6] text-xs"
          >
            Novo Cadastro KYC
          </Link>
        </div>
      </div>
    );
  }

  const menuItems = [
    {
      title: "Meus Pedidos & Rastreio Correios",
      subtitle: `${orders.length} pedidos · SRO-eXML integrado`,
      path: "/conta/pedidos",
      icon: Package,
    },
    {
      title: "Lista de Desejos (Wishlist)",
      subtitle: `${wishlistIds.length} peças favoritadas (máx 50)`,
      path: "/conta/desejos",
      icon: Heart,
    },
    {
      title: "Alertas de Preço & Estoque",
      subtitle: `${unreadAlerts} alertas não lidos`,
      path: "/conta/alertas",
      icon: Bell,
    },
    {
      title: "Assistente de Estilo IA",
      subtitle: "Gerar 3 looks a partir da sua foto (SLA <8s)",
      path: "/conta/assistente",
      icon: Sparkles,
    },
    {
      title: "Criar Presente Compartilhado",
      subtitle: "Dividir look no Pix Split com até 8 amigas",
      path: "/conta/compartilhar",
      icon: Gift,
    },
    {
      title: "Meus Endereços",
      subtitle: `${customer.addresses[0]?.city || "São Paulo"}/${customer.addresses[0]?.state || "SP"}`,
      path: "/conta/enderecos",
      icon: MapPin,
    },
  ];

  return (
    <div
      data-testid="profile-page"
      className="max-w-4xl mx-auto px-4 pt-5 pb-28 space-y-6"
    >
      {/* Profile Header Card */}
      <div className="bg-[#141210] border border-[#2A2520] rounded-3xl p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#C9A961]/20 border border-[#C9A961] flex items-center justify-center font-serif text-2xl font-bold text-[#C9A961]">
            {customer.fullName
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl text-[#F5EFE6]">{customer.fullName}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-[10px] font-semibold">
                KYC Aprovado
              </span>
            </div>
            <p className="text-xs text-[#A89F91]">
              {customer.email} · CPF {customer.cpf} · ID Banco: {customer.kycExternalId}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={logoutCustomer}
          className="px-3.5 py-2 rounded-xl bg-[#0A0908] border border-[#2A2520] text-xs text-[#A89F91] hover:text-[#F5EFE6]"
        >
          Alternar para Visitante
        </button>
      </div>

      {/* Stats Strip */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#141210] border border-[#2A2520] rounded-2xl p-4 text-center">
          <span className="font-serif text-2xl font-bold text-[#C9A961]">{orders.length}</span>
          <span className="block text-[11px] text-[#A89F91]">Pedidos</span>
        </div>
        <div className="bg-[#141210] border border-[#2A2520] rounded-2xl p-4 text-center">
          <span className="font-serif text-2xl font-bold text-[#C9A961]">{wishlistIds.length}</span>
          <span className="block text-[11px] text-[#A89F91]">Desejos</span>
        </div>
        <div className="bg-[#141210] border border-[#2A2520] rounded-2xl p-4 text-center">
          <span className="font-serif text-2xl font-bold text-[#C9A961]">{unreadAlerts}</span>
          <span className="block text-[11px] text-[#A89F91]">Alertas Ativos</span>
        </div>
      </div>

      {/* 6 Menu Items (Spec §24.3 Flow 5.4) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="bg-[#141210] border border-[#2A2520] hover:border-[#C9A961]/60 rounded-2xl p-4 flex items-center gap-3.5 transition"
            >
              <div className="w-10 h-10 rounded-xl bg-[#0A0908] border border-[#2A2520] flex items-center justify-center text-[#C9A961] shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-lg text-[#F5EFE6]">{item.title}</h2>
                <p className="text-xs text-[#A89F91]">{item.subtitle}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* LGPD Right to Erasure (§16.2 / §27.4) */}
      <div className="bg-[#141210] border border-[#2A2520] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-0.5">
          <h3 className="text-xs font-semibold text-[#F5EFE6] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#C9A961]" />
            Privacidade & LGPD (Art. 18 — Direito ao Esquecimento)
          </h3>
          <p className="text-[11px] text-[#A89F91]">
            Seus dados são auditados na tabela AuditLog. A exclusão agenda remoção definitiva em 7 dias úteis.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setToast(
              "Solicitação LGPD registrada no AuditLog! Sua conta entrou no período de graça de 7 dias úteis."
            );
            navigate("/");
          }}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-500/40 text-red-400 text-xs hover:bg-red-500/10"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Solicitar Exclusão LGPD
        </button>
      </div>
    </div>
  );
}

export function OrdersPage() {
  const { orders } = usePortalStore();

  return (
    <div className="max-w-4xl mx-auto px-4 pt-5 pb-28 space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/conta" className="p-2 rounded-full bg-[#141210] border border-[#2A2520]">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#C9A961] font-semibold">
            Rastreio Correios SRO-eXML Integrado
          </span>
          <h1 className="font-serif text-3xl text-[#F5EFE6]">Meus Pedidos</h1>
        </div>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            data-testid={`order-card-${order.orderNumber}`}
            className="bg-[#141210] border border-[#2A2520] hover:border-[#C9A961]/50 rounded-2xl p-5 space-y-4 transition"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#2A2520] pb-3">
              <div>
                <span className="font-mono text-xs text-[#C9A961] font-bold">
                  {order.orderNumber}
                </span>
                <span className="mx-2 text-[#2A2520]">•</span>
                <span className="text-xs text-[#A89F91]">
                  Código Correios:{" "}
                  <strong className="font-mono text-[#F5EFE6]">{order.trackingCode}</strong>
                </span>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-[11px] font-semibold ${
                  order.status === "DELIVERED"
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/40"
                    : "bg-[#C9A961]/15 text-[#C9A961] border border-[#C9A961]/40"
                }`}
              >
                {order.status === "DELIVERED"
                  ? "ENTREGUE PELOS CORREIOS"
                  : `ETAPA ${order.trackingStep + 1}/5 · EM TRÂNSITO`}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {order.items.map((item) => (
                  <img
                    key={item.id}
                    src={item.product.images[0]?.url}
                    alt={item.product.name}
                    className="w-14 h-16 rounded-xl object-cover border border-[#2A2520]"
                  />
                ))}
                <div>
                  <p className="text-sm font-medium text-[#F5EFE6]">
                    {order.items.map((i) => i.product.name).join(" + ")}
                  </p>
                  <p className="text-xs text-[#A89F91]">
                    Total Pix Split: <strong className="text-[#C9A961]">{formatBrl(order.totalBrl)}</strong>{" "}
                    (Imposto Fed. R$ 0,00 · ICMS {order.icmsState} incluso)
                  </p>
                </div>
              </div>

              <Link
                to={`/conta/pedidos/${order.id}`}
                className="px-4 py-2.5 rounded-xl bg-[#C9A961] text-[#0A0908] font-bold text-xs"
              >
                Ver Timeline & NF-e →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const TIMELINE_STEPS = [
  {
    step: 0,
    title: "1. Pedido Confirmado & Split Pix",
    subtitle: "Liquidado no Banco Parceiro (20% Portal · Unicentro · ICMS)",
  },
  {
    step: 1,
    title: "2. Em Separação na Unicentro + NF-e Bling",
    subtitle: "DANFE emitido e peças conferidas em Encarnación (PY)",
  },
  {
    step: 2,
    title: "3. Postado nos Correios (SRO-eXML)",
    subtitle: "Objeto despachado para o Brasil via Remessa Conforme",
  },
  {
    step: 3,
    title: "4. Fiscalização Aduaneira Concluída",
    subtitle: "Canal verde Receita Federal · Imposto Federal R$ 0,00",
  },
  {
    step: 4,
    title: "5. Objeto Entregue à Cliente",
    subtitle: "Entrega concluída pelos Correios · Avaliação liberada",
  },
];

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { orders, advanceOrderTracking, submitOrderReview } = usePortalStore();
  const order = orders.find((o) => o.id === id || o.orderNumber === id) || orders[0];

  const [showCustomsAlert, setShowCustomsAlert] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("Chegou perfeito e sem nenhuma taxa extra!");
  const [reviewBody, setReviewBody] = useState(
    "Acompanhei o rastreio pelos Correios direto pelo app e a qualidade da peça da Unicentro superou minhas expectativas."
  );
  const [selectedTags, setSelectedTags] = useState<string[]>([
    "Qualidade impecável",
    "Sem taxa extra",
  ]);

  const isDelivered = order.status === "DELIVERED" || order.trackingStep >= 4;

  const availableTags = [
    "Qualidade impecável",
    "Sem taxa extra",
    "Entrega rápida",
    "Idêntico à foto",
    "Ótimo custo-benefício",
  ];

  const toggleTag = (t: string) => {
    setSelectedTags((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pt-5 pb-28 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            to="/conta/pedidos"
            className="p-2 rounded-full bg-[#141210] border border-[#2A2520]"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#C9A961] font-semibold">
              Pós-Compra Transparente · API Correios SRO-eXML
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#F5EFE6]">
              Pedido {order.orderNumber}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isDelivered && (
            <button
              type="button"
              data-testid="advance-tracking-btn"
              onClick={() => advanceOrderTracking(order.id)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#C9A961] text-[#0A0908] font-bold text-xs shadow"
            >
              <FastForward className="w-3.5 h-3.5" />
              Simular Avanço Correios ({order.trackingStep + 1}/5)
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowCustomsAlert((prev) => !prev)}
            className="px-3 py-2 rounded-xl bg-[#141210] border border-[#2A2520] text-[11px] text-[#A89F91] hover:text-[#F5EFE6]"
          >
            Simular Alerta &gt;72h Alfândega
          </button>
        </div>
      </div>

      {/* Edge Case Alert (>72h in Customs or Black Friday delay — Spec §11.4 / §20.4) */}
      {showCustomsAlert && (
        <div className="bg-amber-500/10 border border-amber-500/40 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <h3 className="font-bold text-amber-300">
              Comunicação Proativa · Monitoramento Automático Correios (&gt;72h)
            </h3>
            <p className="text-[#A89F91]">
              Identificamos alta demanda na unidade de Curitiba/PR (SLA estendido Black Friday). Sua declaração Remessa Conforme já está 100% quitada e nossa equipe de suporte já notificou os Correios prioritariamente.
            </p>
          </div>
        </div>
      )}

      {/* Tracking Code + NF-e Bling Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-[#141210] border border-[#2A2520] rounded-2xl p-4 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] text-[#A89F91] flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#C9A961]" />
              Objeto Internacional Correios
            </span>
            <p
              data-testid="order-tracking-code"
              className="font-mono text-lg font-bold text-[#F5EFE6]"
            >
              {order.trackingCode}
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#0A0908] border border-[#C9A961]/40 text-[11px] text-[#C9A961]">
            Sync a cada 4h
          </span>
        </div>

        <div className="bg-[#141210] border border-[#2A2520] rounded-2xl p-4 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] text-[#A89F91] flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#C9A961]" />
              Nota Fiscal Eletrônica (Bling ERP)
            </span>
            <p className="font-mono text-sm font-semibold text-[#F5EFE6]">
              DANFE Nº {order.invoiceNumber || "000.418920"}
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-[11px] font-semibold">
            SEFAZ Autorizada
          </span>
        </div>
      </div>

      {/* 5-Stage Timeline with Pulse Animation on Active Step (Spec §24.3 Flow 5.1 & 5.2) */}
      <div
        data-testid="tracking-timeline-5-steps"
        className="bg-[#141210] border border-[#2A2520] rounded-3xl p-5 sm:p-6 space-y-5"
      >
        <h2 className="font-serif text-2xl text-[#F5EFE6]">
          Timeline de Entrega (5 Etapas)
        </h2>

        <div className="space-y-4">
          {TIMELINE_STEPS.map((item) => {
            const isCompleted = order.trackingStep > item.step || order.trackingStep === 4;
            const isCurrent = order.trackingStep === item.step && order.trackingStep < 4;

            return (
              <div
                key={item.step}
                data-testid={`timeline-step-${item.step}`}
                className="flex items-start gap-4"
              >
                <div className="relative flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center border text-xs font-bold ${
                      isCompleted
                        ? "bg-emerald-500 text-[#0A0908] border-emerald-500"
                        : isCurrent
                        ? "bg-[#C9A961] text-[#0A0908] border-[#C9A961] animate-pulse ring-4 ring-[#C9A961]/25"
                        : "bg-[#0A0908] text-[#A89F91] border-[#2A2520]"
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : item.step + 1}
                  </div>
                </div>

                <div className="flex-1 pb-3 border-b border-[#2A2520]/60">
                  <div className="flex items-center justify-between">
                    <h3
                      className={`text-sm font-semibold ${
                        isCompleted || isCurrent ? "text-[#F5EFE6]" : "text-[#A89F91]"
                      }`}
                    >
                      {item.title}
                    </h3>
                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded-full bg-[#C9A961]/20 text-[#C9A961] text-[10px] font-bold">
                        ETAPA ATUAL
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#A89F91] mt-0.5">{item.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Post-Delivery Evaluation Gate (Spec §24.3 Flow 5.7 & 5.8) */}
      <div
        data-testid="post-delivery-review-section"
        className="bg-[#141210] border border-[#2A2520] rounded-3xl p-5 sm:p-6 space-y-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#C9A961] font-semibold">
              Feedback Loop Curadoria & NPS Pós-Entrega
            </span>
            <h2 className="font-serif text-2xl text-[#F5EFE6]">Avaliar Peças do Pedido</h2>
          </div>
        </div>

        {!isDelivered ? (
          <div
            data-testid="review-locked-banner"
            className="bg-[#0A0908] border border-[#2A2520] rounded-2xl p-4 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3 text-xs text-[#A89F91]">
              <Clock className="w-5 h-5 text-[#C9A961] shrink-0" />
              <span>
                A avaliação só é liberada após a confirmação de entrega pelos Correios (Etapa 5/5). Clique em{" "}
                <strong className="text-[#F5EFE6]">"Simular Avanço Correios"</strong> acima para testar!
              </span>
            </div>
          </div>
        ) : order.reviewed ? (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 text-xs text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Sua avaliação para este pedido já foi publicada na vitrine!</span>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submitOrderReview({
                orderId: order.id,
                productId: order.items[0]?.productId || "prod-001",
                rating,
                title: reviewTitle,
                body: reviewBody,
                tags: selectedTags,
              });
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs text-[#A89F91] mb-1.5">Sua nota (1 a 5 estrelas)</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-2 rounded-xl bg-[#0A0908] border border-[#2A2520]"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= rating ? "fill-[#C9A961] text-[#C9A961]" : "text-[#A89F91]"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs text-[#A89F91] mb-1.5">Tags rápidas</label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-xs border ${
                      selectedTags.includes(tag)
                        ? "bg-[#C9A961] text-[#0A0908] border-[#C9A961] font-semibold"
                        : "border-[#2A2520] text-[#A89F91]"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs text-[#A89F91] mb-1">Título da avaliação</label>
              <input
                type="text"
                required
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0A0908] border border-[#2A2520] text-sm text-[#F5EFE6]"
              />
            </div>

            <div>
              <label className="block text-xs text-[#A89F91] mb-1">Seu comentário</label>
              <textarea
                rows={3}
                required
                value={reviewBody}
                onChange={(e) => setReviewBody(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0A0908] border border-[#2A2520] text-sm text-[#F5EFE6]"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#C9A961] text-[#0A0908] font-bold text-xs sm:text-sm"
            >
              Publicar Avaliação Verificada
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export function WishlistPage() {
  const { products, wishlistIds, alerts } = usePortalStore();
  const wishProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="max-w-5xl mx-auto px-4 pt-5 pb-28 space-y-8">
      <div className="flex items-center justify-between border-b border-[#2A2520] pb-4">
        <div>
          <span className="eyebrow">
            {wishProducts.length} ITENS · {alerts.filter((a) => !a.read).length} EM ALERTA
          </span>
          <h1 className="font-serif text-3xl text-[#F5EFE6]">Lista de desejos</h1>
        </div>
        <Link to="/conta/alertas" className="text-xs text-[#C9A961] hover:underline">
          Filtrar / Ver todos →
        </Link>
      </div>

      {wishProducts.length === 0 ? (
        <div className="bg-[#14110E] border border-[#2A2520] rounded-3xl p-8 text-center space-y-3">
          <p className="text-sm text-[#8A8278]">Você ainda não salvou peças na sua Lista de Desejos.</p>
          <Link to="/" className="btn-gold text-xs">
            Explorar Vitrine
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishProducts.map((product, idx) => (
            <div key={product.id} className="space-y-1.5">
              <div className="relative">
                <ProductCard product={product} />
                {idx === 0 && (
                  <span className="absolute top-12 left-2.5 px-2.5 py-0.5 rounded-full bg-[#7FA66B]/25 border border-[#7FA66B] text-[#7FA66B] text-[10px] font-bold uppercase tracking-wider">
                    BAIXOU R$ 15
                  </span>
                )}
              </div>
              <Link
                to={`/conta/desejos/${product.id}`}
                className="block text-center text-[11px] text-[#C9A961] hover:underline font-mono"
              >
                Ver gráfico de preço 30d & estoque →
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Flow 07 Slide 09 · Seção ALERTAS ATIVOS com pulse dot */}
      <section className="space-y-3 pt-2 border-t border-[#2A2520]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#C9A961] animate-pulse shadow-[0_0_8px_#C9A961]" />
          <h2 className="eyebrow !text-xs">ALERTAS ATIVOS</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            to="/conta/desejos/prod-001"
            className="bg-[#14110E] border border-[#2A2520] hover:border-[#C9A961] rounded-xl p-3.5 flex items-center justify-between gap-3 transition"
          >
            <div>
              <p className="text-xs font-semibold text-[#F5EFE6]">
                Brinco gota dourado baixou R$ 15 (ontem)
              </p>
              <span className="text-[11px] text-[#7FA66B]">
                Comprar antes que acabe · Menor preço em 30 dias
              </span>
            </div>
            <span className="text-xs text-[#C9A961]">→</span>
          </Link>

          <Link
            to="/conta/desejos/prod-003"
            className="bg-[#14110E] border border-[#2A2520] hover:border-[#C9A961] rounded-xl p-3.5 flex items-center justify-between gap-3 transition"
          >
            <div>
              <p className="text-xs font-semibold text-[#F5EFE6]">
                Bolsa de palha: {products.find((p) => p.id === "prod-003")?.stock.quantity || 3} unidades no estoque
              </p>
              <span className="text-[11px] text-[#C9A961]">
                Alerta automático de estoque baixo (&le;3 un.)
              </span>
            </div>
            <span className="text-xs text-[#C9A961]">→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

export function WishlistDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { products, addToCart } = usePortalStore();
  const product =
    products.find((p) => p.id === productId || p.slug === productId) || products[0];
  const priceBrl = product.fobPriceUsd * 5.0;

  return (
    <div className="max-w-3xl mx-auto px-4 pt-5 pb-28 space-y-6">
      <div className="flex items-center gap-3">
        <Link
          to="/conta/desejos"
          className="p-2 rounded-full bg-[#14110E] border border-[#2A2520]"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <span className="eyebrow">Flow 07 · Histórico de Preço 30 Dias & Estoque</span>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#F5EFE6]">{product.name}</h1>
        </div>
      </div>

      <div className="bg-[#14110E] border border-[#2A2520] rounded-3xl p-5 sm:p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={product.images[0]?.url}
              alt={product.name}
              className="w-20 h-24 rounded-2xl object-cover border border-[#2A2520]"
            />
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#7FA66B]/20 border border-[#7FA66B] text-[#7FA66B] text-[10px] font-bold uppercase">
                BAIXOU R$ 15 · Menor preço 30d
              </span>
              <p className="font-serif text-3xl font-bold text-[#C9A961] mt-1">
                {formatBrl(priceBrl)}
              </p>
              <p className="text-xs text-[#8A8278]">
                Imposto Federal R$ 0,00 (Remessa Conforme)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              addToCart(product.id, 1);
              navigate("/checkout");
            }}
            className="btn-gold text-xs"
          >
            Comprar Agora · {formatBrl(priceBrl)}
          </button>
        </div>

        {/* Mini-Chart SVG de Histórico de Preço 30 dias (README_Produto.pdf §3.7) */}
        <div className="bg-[#0A0908] border border-[#2A2520] rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#C9C2B6] font-medium">
              Evolução de preço em Reais (últimos 30 dias)
            </span>
            <span className="font-mono text-[11px] text-[#7FA66B]">-14% vs pico</span>
          </div>

          <svg
            viewBox="0 0 320 90"
            className="w-full h-24 overflow-visible"
            role="img"
            aria-label="Gráfico SVG de histórico de preço nos últimos 30 dias"
          >
            <defs>
              <linearGradient id="goldChartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C9A961" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#C9A961" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path
              d="M 10 25 L 70 25 L 130 35 L 190 30 L 250 55 L 310 68 L 310 85 L 10 85 Z"
              fill="url(#goldChartGrad)"
            />
            <path
              d="M 10 25 L 70 25 L 130 35 L 190 30 L 250 55 L 310 68"
              fill="none"
              stroke="#C9A961"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="310" cy="68" r="5" fill="#7FA66B" />
          </svg>

          <div className="flex justify-between text-[10px] font-mono text-[#8A8278]">
            <span>Há 30 dias: {formatBrl(priceBrl + 25)}</span>
            <span>Há 15 dias: {formatBrl(priceBrl + 15)}</span>
            <span className="text-[#7FA66B] font-bold">Hoje: {formatBrl(priceBrl)}</span>
          </div>
        </div>

        {/* Barra de Estoque */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-[#8A8278]">Disponibilidade na Unicentro (Encarnación):</span>
            <span className="font-mono text-[#C9A961] font-bold">
              {product.stock.quantity} unidades
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#0A0908] overflow-hidden border border-[#2A2520]">
            <div
              className="h-full bg-[#C9A961]"
              style={{ width: `${Math.min(100, product.stock.quantity * 8)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function AlertsPage() {
  const { alerts, markAlertRead } = usePortalStore();
  const [filter, setFilter] = useState<string>("ALL");

  const filtered = alerts.filter((a) => (filter === "ALL" ? true : a.type === filter));

  return (
    <div className="max-w-3xl mx-auto px-4 pt-5 pb-28 space-y-6">
      <div>
        <span className="text-[10px] uppercase tracking-widest text-[#C9A961] font-semibold">
          Notificações Inteligentes da Curadoria
        </span>
        <h1 className="font-serif text-3xl text-[#F5EFE6]">Central de Alertas</h1>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {[
          { key: "ALL", label: "Todos" },
          { key: "LOW_STOCK", label: "Últimas Unidades (≤3)" },
          { key: "PRICE_DROP", label: "Queda de Preço (≥10%)" },
          { key: "TRACKING", label: "Rastreio Correios" },
        ].map((chip) => (
          <button
            key={chip.key}
            type="button"
            onClick={() => setFilter(chip.key)}
            className={`px-3.5 py-1.5 rounded-full text-xs border shrink-0 ${
              filter === chip.key
                ? "bg-[#C9A961] text-[#0A0908] border-[#C9A961] font-semibold"
                : "bg-[#141210] border-[#2A2520] text-[#A89F91]"
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((alert) => (
          <div
            key={alert.id}
            onClick={() => markAlertRead(alert.id)}
            className={`bg-[#141210] border rounded-2xl p-4 flex items-start justify-between gap-4 cursor-pointer transition ${
              alert.read ? "border-[#2A2520] opacity-75" : "border-[#C9A961]/60"
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {!alert.read && <span className="w-2 h-2 rounded-full bg-[#C9A961]" />}
                <h3 className="text-sm font-semibold text-[#F5EFE6]">{alert.title}</h3>
              </div>
              <p className="text-xs text-[#A89F91]">{alert.description}</p>
              <span className="block text-[10px] text-[#C9A961]">{alert.createdAt}</span>
            </div>

            {alert.productSlug && (
              <Link
                to={`/produto/${alert.productSlug}`}
                className="px-3 py-1.5 rounded-xl bg-[#C9A961] text-[#0A0908] font-bold text-xs shrink-0"
              >
                Ver Peça
              </Link>
            )}
            {alert.orderId && (
              <Link
                to={`/conta/pedidos/${alert.orderId}`}
                className="px-3 py-1.5 rounded-xl bg-[#0A0908] border border-[#C9A961] text-[#C9A961] font-semibold text-xs shrink-0"
              >
                Ver Rastreio
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function AddressesPage() {
  const { customer, selectedState, setSelectedState } = usePortalStore();

  return (
    <div className="max-w-2xl mx-auto px-4 pt-5 pb-28 space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/conta" className="p-2 rounded-full bg-[#141210] border border-[#2A2520]">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="font-serif text-3xl text-[#F5EFE6]">Endereços de Entrega</h1>
      </div>

      {customer?.addresses.map((addr) => (
        <div
          key={addr.id}
          className="bg-[#141210] border border-[#C9A961]/50 rounded-2xl p-5 flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#C9A961]/20 text-[#C9A961] text-[10px] font-semibold">
              {addr.label} · Padrão (ICMS {selectedState})
            </span>
            <p className="text-sm font-medium text-[#F5EFE6]">
              {addr.street}, {addr.number} {addr.complement ? `· ${addr.complement}` : ""}
            </p>
            <p className="text-xs text-[#A89F91]">
              {addr.district} · {addr.city}/{addr.state} · CEP {addr.zipCode}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSelectedState(addr.state, addr.zipCode)}
            className="text-xs text-[#C9A961] underline"
          >
            Usar no cálculo ICMS
          </button>
        </div>
      ))}
    </div>
  );
}
