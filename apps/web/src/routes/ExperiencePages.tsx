// apps/web/src/routes/ExperiencePages.tsx
// Jornada 2 (Assistente IA · Flow 8), Jornada 3 (Presente Compartilhado · Flow 9),
// Moda ao Vivo (Live Shopping · Flow 10) e Dashboard Analítico Postgres-as-Lake (Seção 28)

import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Sparkles,
  Camera,
  RefreshCw,
  ShoppingBag,
  ShieldCheck,
  Gift,
  Share2,
  CheckCircle2,
  Clock,
  Users,
  Radio,
  Send,
  Bell,
  Play,
  BarChart3,
  AlertTriangle,
  Cpu,
  TrendingUp,
  Database,
  Award,
} from "lucide-react";
import { usePortalStore } from "../stores/app.store";
import { calculateBrlFromFob, formatBrl, formatCpf } from "../lib/format";

const PRESET_PHOTOS = [
  {
    id: "preset-1",
    label: "Look Alfaiataria Marfim (Dia / Trabalho)",
    occasion: "dia" as const,
    url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "preset-2",
    label: "Vestido Preto Slip (Noite / Jantar)",
    occasion: "noite" as const,
    url: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "preset-3",
    label: "Linho Resort Natural (Fim de Semana / Praia)",
    occasion: "praia" as const,
    url: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80",
  },
];

export function AssistantPage() {
  const navigate = useNavigate();
  const {
    aiSessions,
    activeAiSessionId,
    generateAiLooks,
    regenerateAiLooks,
    buyEntireLook,
  } = usePortalStore();

  const [selectedPhoto, setSelectedPhoto] = useState(PRESET_PHOTOS[0].url);
  const [occasion, setOccasion] = useState<"dia" | "noite" | "trabalho" | "festa" | "praia">("dia");
  const [forceFallback, setForceFallback] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const activeSession =
    aiSessions.find((s) => s.id === activeAiSessionId) || aiSessions[0] || null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setSelectedPhoto(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      generateAiLooks({
        photoPreviewUrl: selectedPhoto,
        occasion,
        forceFallback,
      });
      setIsGenerating(false);
    }, 650);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 pt-5 pb-28 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A961]/15 border border-[#C9A961]/40 text-[#C9A961] text-[10px] font-semibold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Jornada 2 · Assistente de Estilo IA · SLA &lt; 8s · Ticket Médio 4×</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#F5EFE6]">
          Sua Curadora Pessoal com Visão Computacional
        </h1>
        <p className="text-xs sm:text-sm text-[#A89F91] max-w-2xl">
          Envie uma foto da roupa que você vai usar (ou escolha um look abaixo). Nossa IA identifica paleta de cores, estilo e ocasião e monta <strong>3 combinações completas</strong> do catálogo da Unicentro.
        </p>
      </div>

      {/* Flow 08 Slide 10 · Chat Welcome Bubble + 3 Suggestion Chips + Dashed Gold Drop Zone */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#14110E] border border-[#2A2520] rounded-3xl p-5 sm:p-6">
        <div className="lg:col-span-5 space-y-4">
          {/* 1 · Welcome Chat Bubble (accent tinted bg · radius 8) */}
          <div className="bg-[#C9A961]/10 border border-[#C9A961]/30 rounded-xl p-4 text-xs sm:text-sm text-[#F5EFE6] leading-relaxed">
            Oi! Me manda uma foto do seu look ou de uma referência que você curtiu. Eu monto uma combinação com a curadoria da Portal.
          </div>

          {/* 2 · 3 Suggestion Chips (.cat-chip) */}
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Look do dia", idx: 0, occ: "dia" as const },
              { label: "Inspiração Pinterest", idx: 1, occ: "noite" as const },
              { label: "Foto de revista", idx: 2, occ: "praia" as const },
            ].map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={() => {
                  setSelectedPhoto(PRESET_PHOTOS[chip.idx].url);
                  setOccasion(chip.occ);
                }}
                className="cat-chip text-xs"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* 3 · Dashed 1.5px Gold Drop Zone + Preview */}
          <label className="relative block rounded-xl border-[1.5px] border-dashed border-[#C9A961] bg-[#0A0908]/60 p-4 text-center cursor-pointer hover:bg-[#C9A961]/10 transition">
            <img
              src={selectedPhoto}
              alt="Referência de look selecionada"
              className="w-28 h-36 object-cover rounded-lg mx-auto mb-3 border border-[#2A2520]"
            />
            <div className="text-[#C9A961] text-2xl font-light leading-none mb-1">＋</div>
            <span className="block text-xs font-semibold text-[#F5EFE6]">Enviar foto</span>
            <span className="block text-[11px] text-[#8A8278]">ou arraste aqui</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {/* 5 · ENVIADAS RECENTEMENTE (40×40 thumbnails) */}
          <div className="space-y-1.5">
            <span className="eyebrow !text-[9px] block">ENVIADAS RECENTEMENTE</span>
            <div className="flex items-center gap-2">
              {PRESET_PHOTOS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    setSelectedPhoto(preset.url);
                    setOccasion(preset.occasion);
                  }}
                  className={`w-11 h-11 rounded-md overflow-hidden border transition ${
                    selectedPhoto === preset.url
                      ? "border-[#C9A961] ring-2 ring-[#C9A961]/40"
                      : "border-[#2A2520] opacity-70"
                  }`}
                >
                  <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div>
              <label className="eyebrow !text-[10px] block mb-2">
                1. Ocasião de Uso
              </label>
              <div className="flex flex-wrap gap-2">
                {(["dia", "trabalho", "noite", "festa", "praia"] as const).map((occ) => (
                  <button
                    key={occ}
                    type="button"
                    onClick={() => setOccasion(occ)}
                    className={`cat-chip text-xs capitalize ${occasion === occ ? "active" : ""}`}
                  >
                    {occ}
                  </button>
                ))}
              </div>
            </div>

            {/* 6 · Input "Descreva seu estilo..." */}
            <div>
              <label className="eyebrow !text-[10px] block mb-2">
                2. Descreva seu estilo ou preferência (opcional)
              </label>
              <div className="flex items-center gap-2 bg-[#1C1814] border border-[#2A2520] rounded-xl px-3.5 py-2.5">
                <input
                  type="text"
                  placeholder="Descreva seu estilo (ex.: minimalista dourado, resort chic)..."
                  className="bg-transparent text-xs text-[#F5EFE6] flex-1 focus:outline-none"
                />
                <span className="w-6 h-6 rounded-full bg-[#C9A961] text-[#0A0908] text-xs font-bold flex items-center justify-center">
                  ↑
                </span>
              </div>
            </div>

            {/* Fallback Toggle (Product Brief §3.2) */}
            <label className="flex items-center gap-2.5 text-xs text-[#C9C2B6] bg-[#0A0908] border border-[#2A2520] rounded-xl p-3 cursor-pointer">
              <input
                type="checkbox"
                checked={forceFallback}
                onChange={(e) => setForceFallback(e.target.checked)}
                className="accent-[#C9A961]"
              />
              <span>
                Simular <strong>Fallback de Indisponibilidade da IA</strong> (ver curadoria manual sem bloquear o fluxo)
              </span>
            </label>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              data-testid="generate-ai-looks-btn"
              disabled={isGenerating}
              onClick={handleGenerate}
              className="btn-gold w-full py-4 text-sm shadow-xl"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {isGenerating
                  ? "Analisando paleta e combinando acessórios (<8s SLA)..."
                  : "Gerar 3 Looks Curados da Portal"}
              </span>
            </button>

            <p className="text-[11px] text-[#8A8278] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#7FA66B] shrink-0" />
              <span>
                <strong>Privacidade LGPD (§14.1):</strong> A foto da cliente NÃO é armazenada após o processamento; apenas tags de análise.
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Results Section: 3 Suggested Looks */}
      {activeSession && (
        <section data-testid="ai-looks-results" className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#141210] border border-[#C9A961]/40 rounded-2xl p-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-bold">
                  Processado em {(activeSession.latencyMs / 1000).toFixed(2)}s (SLA &lt; 8s OK)
                </span>
                {activeSession.usedManualFallback && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                    Modo Fallback: Curadoria Humana
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {activeSession.photoTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 rounded-full bg-[#0A0908] border border-[#2A2520] text-[11px] font-mono text-[#C9A961]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => regenerateAiLooks(activeSession.id)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0A0908] border border-[#2A2520] hover:border-[#C9A961] text-xs text-[#F5EFE6]"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#C9A961]" />
              <span>Não curtiu? Gerar outros ({activeSession.regenerateCount}/3)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {activeSession.looks.map((look) => (
              <div
                key={look.id}
                data-testid={`ai-look-card-${look.rank}`}
                className={`rounded-3xl p-5 flex flex-col justify-between gap-4 border transition ${
                  look.isBestCombo
                    ? "bg-gradient-to-b from-[#1E1A14] to-[#141210] border-[#C9A961] shadow-2xl"
                    : "bg-[#141210] border-[#2A2520]"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    {look.isBestCombo ? (
                      <span className="px-3 py-1 rounded-full bg-[#C9A961] text-[#0A0908] text-[10px] font-extrabold uppercase tracking-wider">
                        ★ MELHOR COMBO · Match {look.matchScore}%
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#0A0908] border border-[#2A2520] text-[#A89F91] text-[10px] font-semibold">
                        Opção #{look.rank} · Match {look.matchScore}%
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-serif text-xl text-[#F5EFE6]">{look.title}</h3>
                    <p className="text-xs text-[#A89F91] mt-0.5">{look.subtitle}</p>
                  </div>

                  <div className="space-y-2.5 pt-2">
                    {look.items.map((prod) => {
                      const brl = calculateBrlFromFob(prod.fobPriceUsd, 5.0);
                      return (
                        <Link
                          key={prod.id}
                          to={`/produto/${prod.slug}`}
                          className="flex items-center gap-3 bg-[#0A0908] border border-[#2A2520] hover:border-[#C9A961]/50 rounded-xl p-2 transition"
                        >
                          <img
                            src={prod.images[0]?.url}
                            alt={prod.name}
                            className="w-12 h-14 rounded-lg object-cover shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-[#F5EFE6] truncate">
                              {prod.name}
                            </p>
                            <p className="text-[11px] text-[#C9A961] font-semibold">
                              {formatBrl(brl)}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#2A2520] space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-[#A89F91]">Total do Look (3 peças):</span>
                    <span className="font-serif text-2xl font-bold text-[#C9A961]">
                      {formatBrl(look.totalBrl)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      buyEntireLook(look);
                      navigate("/carrinho");
                    }}
                    className="w-full py-3 rounded-xl bg-[#C9A961] hover:bg-[#DFC484] text-[#0A0908] font-bold text-xs flex items-center justify-center gap-2 transition"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Comprar o Look Completo</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// JORNADA 3 · PRESENTE COMPARTILHADO / LOOK COMPARTILHADO (Flow 9 — Bia)
// ═══════════════════════════════════════════════════════════════════════════

export function SharedCartCreatePage() {
  const navigate = useNavigate();
  const { products, createSharedCart, sharedCarts } = usePortalStore();

  const [title, setTitle] = useState("Look de Aniversário da Marina ✨");
  const [message, setMessage] = useState(
    "Amigas! Escolhi minhas peças favoritas da Unicentro na Portal Estilo Luxo. Cada item já tem preço fechado em Reais no Pix! Escolha qual peça você quer presentear 💛"
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([
    "prod-001",
    "prod-002",
    "prod-004",
  ]);
  const [emailsInput, setEmailsInput] = useState(
    "bia.costa@gmail.com, camila.rocha@gmail.com, julia.mendes@gmail.com"
  );

  const toggleProduct = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIds.length === 0) return;
    const invitedEmails = emailsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 8);
    const created = createSharedCart({
      title,
      message,
      productIds: selectedIds,
      invitedEmails,
    });
    navigate(`/s/${created.token}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pt-5 pb-28 space-y-6">
      <div className="space-y-2">
        <span className="text-[10px] uppercase tracking-widest text-[#C9A961] font-semibold">
          Jornada 3 · Aquisição Orgânica Viral (Meta K = 0.3)
        </span>
        <h1 className="font-serif text-3xl text-[#F5EFE6]">
          Montar Look para Presente Compartilhado
        </h1>
        <p className="text-xs text-[#A89F91]">
          Gere um link único válido por 7 dias para até 8 amigas. Elas visualizam sem precisar de cadastro prévio e pagam apenas a peça que escolherem via Pix Split!
        </p>
      </div>

      {/* Existing Shared Looks Quick Links */}
      {sharedCarts.length > 0 && (
        <div className="bg-[#141210] border border-[#C9A961]/40 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs">
            <span className="text-[#C9A961] font-semibold">Links ativos da Marina:</span>{" "}
            <span className="text-[#F5EFE6]">{sharedCarts[0].title}</span>
          </div>
          <Link
            to={`/s/${sharedCarts[0].token}`}
            className="px-3.5 py-1.5 rounded-xl bg-[#C9A961] text-[#0A0908] font-bold text-xs"
          >
            Abrir Visão da Amiga (Bia) →
          </Link>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-[#141210] border border-[#2A2520] rounded-3xl p-6 space-y-5"
      >
        <div>
          <label className="block text-xs text-[#A89F91] mb-1">Título do Presente</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[#0A0908] border border-[#2A2520] text-sm text-[#F5EFE6]"
          />
        </div>

        <div>
          <label className="block text-xs text-[#A89F91] mb-1">Mensagem para as amigas</label>
          <textarea
            rows={2}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-[#0A0908] border border-[#2A2520] text-sm text-[#F5EFE6]"
          />
        </div>

        <div>
          <label className="block text-xs text-[#A89F91] mb-2">
            Selecione as peças do Look ({selectedIds.length} selecionadas)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {products
              .filter((p) => p.status === "ACTIVE")
              .map((prod) => {
                const selected = selectedIds.includes(prod.id);
                const brl = calculateBrlFromFob(prod.fobPriceUsd, 5.0);
                return (
                  <button
                    key={prod.id}
                    type="button"
                    onClick={() => toggleProduct(prod.id)}
                    className={`p-2.5 rounded-2xl border text-left transition ${
                      selected
                        ? "bg-[#C9A961]/15 border-[#C9A961]"
                        : "bg-[#0A0908] border-[#2A2520] opacity-70"
                    }`}
                  >
                    <img
                      src={prod.images[0]?.url}
                      alt={prod.name}
                      className="w-full h-24 object-cover rounded-xl mb-2"
                    />
                    <p className="text-xs font-medium text-[#F5EFE6] line-clamp-1">
                      {prod.name}
                    </p>
                    <p className="text-xs text-[#C9A961] font-bold">{formatBrl(brl)}</p>
                  </button>
                );
              })}
          </div>
        </div>

        <div>
          <label className="block text-xs text-[#A89F91] mb-1">
            E-mails das amigas convidadas (máx 8, separados por vírgula)
          </label>
          <input
            type="text"
            value={emailsInput}
            onChange={(e) => setEmailsInput(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[#0A0908] border border-[#2A2520] text-xs text-[#F5EFE6]"
          />
        </div>

        <button
          type="submit"
          className="w-full py-4 rounded-2xl bg-[#C9A961] text-[#0A0908] font-bold text-sm"
        >
          Gerar Link Compartilhável (Validade 7 Dias)
        </button>
      </form>
    </div>
  );
}

export function SharedCartPage() {
  const { token } = useParams<{ token: string }>();
  const {
    sharedCarts,
    contributeToSharedItem,
    completeRemainingSharedCartByOwner,
    setToast,
  } = usePortalStore();

  const sharedCart =
    sharedCarts.find((s) => s.token === token) || sharedCarts[0];

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [friendName, setFriendName] = useState("Bia Costa");
  const [friendEmail, setFriendEmail] = useState("bia.costa@gmail.com");
  const [friendCpf, setFriendCpf] = useState("418.290.331-12");

  const totalLookBrl = sharedCart.items.reduce((acc, i) => acc + i.unitPriceBrl, 0);
  const totalPaidBrl = sharedCart.items
    .filter((i) => Boolean(i.contributedByName))
    .reduce((acc, i) => acc + i.unitPriceBrl, 0);
  const progressPct =
    totalLookBrl > 0 ? Math.round((totalPaidBrl / totalLookBrl) * 100) : 0;

  const selectedItem = sharedCart.items.find((i) => i.id === selectedItemId);

  return (
    <div
      data-testid="shared-cart-page"
      className="max-w-3xl mx-auto px-4 pt-5 pb-28 space-y-6"
    >
      {/* Shared Header Banner (Visão da Amiga Bia — Sem necessidade de login prévio!) */}
      <div className="bg-gradient-to-br from-[#1A1612] to-[#141210] border border-[#C9A961]/50 rounded-3xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9A961]/20 text-[#C9A961] text-[10px] font-bold uppercase tracking-wider">
            <Gift className="w-3.5 h-3.5" />
            Presente Compartilhado · Acesso Público sem Login Prévio
          </span>

          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              setToast("Link do presente copiado para compartilhar no WhatsApp!");
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0A0908] border border-[#2A2520] text-xs text-[#F5EFE6]"
          >
            <Share2 className="w-3.5 h-3.5 text-[#C9A961]" />
            Copiar Link WhatsApp
          </button>
        </div>

        <div>
          <h1 className="font-serif text-3xl text-[#F5EFE6]">{sharedCart.title}</h1>
          <p className="text-xs sm:text-sm text-[#A89F91] mt-1 leading-relaxed">
            "{sharedCart.message}" — <strong className="text-[#F5EFE6]">{sharedCart.ownerName}</strong>
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#A89F91]">
              Arrecadado:{" "}
              <strong className="text-[#C9A961]">{formatBrl(totalPaidBrl)}</strong> de{" "}
              {formatBrl(totalLookBrl)}
            </span>
            <span className="font-bold text-[#C9A961]">{progressPct}% completo</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-[#0A0908] overflow-hidden border border-[#2A2520]">
            <div
              className="h-full bg-[#C9A961] transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Items List with "Eu Pago" Pills */}
      <div className="space-y-3">
        <h2 className="font-serif text-xl text-[#F5EFE6]">
          Peças do Look ({sharedCart.items.filter((i) => !i.contributedByName).length} disponíveis)
        </h2>

        {sharedCart.items.map((item) => {
          const isPaid = Boolean(item.contributedByName);
          return (
            <div
              key={item.id}
              data-testid={`shared-item-${item.id}`}
              className={`bg-[#141210] border rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 transition ${
                isPaid ? "border-emerald-500/40 opacity-85" : "border-[#2A2520]"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <img
                  src={item.product.images[0]?.url}
                  alt={item.product.name}
                  className="w-16 h-20 rounded-xl object-cover"
                />
                <div>
                  <h3 className="font-serif text-lg text-[#F5EFE6]">{item.product.name}</h3>
                  <p className="text-sm font-bold text-[#C9A961]">
                    {formatBrl(item.unitPriceBrl)}{" "}
                    <span className="text-[11px] font-normal text-[#A89F91]">
                      (Preço final c/ Remessa Conforme)
                    </span>
                  </p>
                  {isPaid && (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-400 mt-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Presenteado por <strong>{item.contributedByName}</strong> ({item.contributedAt})
                    </span>
                  )}
                </div>
              </div>

              {isPaid ? (
                <span className="px-3 py-1.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-semibold">
                  Peça Confirmada ✓
                </span>
              ) : (
                <button
                  type="button"
                  data-testid={`pay-shared-item-${item.id}`}
                  onClick={() => setSelectedItemId(item.id)}
                  className="px-4 py-2.5 rounded-xl bg-[#C9A961] hover:bg-[#DFC484] text-[#0A0908] font-bold text-xs transition shadow"
                >
                  Eu pago esta peça ({formatBrl(item.unitPriceBrl)})
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* 1-Screen Simplified Friend Checkout (Persona Bia — Product Brief §2.2) */}
      {selectedItem && !selectedItem.contributedByName && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            contributeToSharedItem({
              token: sharedCart.token,
              itemId: selectedItem.id,
              friendName,
              friendEmail,
              friendCpf,
            });
            setSelectedItemId(null);
          }}
          className="bg-[#141210] border-2 border-[#C9A961] rounded-3xl p-5 sm:p-6 space-y-4"
        >
          <div className="flex items-center justify-between border-b border-[#2A2520] pb-3">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#C9A961] font-bold">
                Cadastro Simplificado da Amiga (1 Tela · Persona Bia)
              </span>
              <h3 className="font-serif text-xl text-[#F5EFE6]">
                Presentear: {selectedItem.product.name} ({formatBrl(selectedItem.unitPriceBrl)})
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setSelectedItemId(null)}
              className="text-xs text-[#A89F91]"
            >
              Cancelar
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-[#A89F91] mb-1">Seu Nome</label>
              <input
                type="text"
                required
                value={friendName}
                onChange={(e) => setFriendName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0908] border border-[#2A2520] text-xs text-[#F5EFE6]"
              />
            </div>
            <div>
              <label className="block text-xs text-[#A89F91] mb-1">Seu E-mail</label>
              <input
                type="email"
                required
                value={friendEmail}
                onChange={(e) => setFriendEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0908] border border-[#2A2520] text-xs text-[#F5EFE6]"
              />
            </div>
            <div>
              <label className="block text-xs text-[#A89F91] mb-1">CPF (para Pix Split)</label>
              <input
                type="text"
                required
                value={friendCpf}
                onChange={(e) => setFriendCpf(formatCpf(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0908] border border-[#2A2520] text-xs text-[#F5EFE6] font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            data-testid="confirm-friend-pix-btn"
            className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#0A0908] font-bold text-sm"
          >
            Pagar {formatBrl(selectedItem.unitPriceBrl)} via Pix Split Agora
          </button>
        </form>
      )}

      {/* 7-Day Fallback for Owner (Product Brief §3.3) */}
      {sharedCart.status !== "COMPLETED" && (
        <div className="bg-[#141210] border border-[#2A2520] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-0.5 text-xs">
            <span className="text-[#C9A961] font-semibold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Regra de Fallback de 7 Dias (Visão da Dona do Look)
            </span>
            <p className="text-[#A89F91]">
              Se alguma amiga não pagar em até 7 dias, a dona do look pode completar o saldo restante para fechar o pedido.
            </p>
          </div>

          <button
            type="button"
            onClick={() => completeRemainingSharedCartByOwner(sharedCart.token)}
            className="px-4 py-2 rounded-xl bg-[#0A0908] border border-[#C9A961] text-[#C9A961] text-xs font-semibold"
          >
            Completar Saldo Restante (Dona)
          </button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// FLUXO 10 · MODA AO VIVO / LIVE SHOPPING (Curadora Marina Ferraz)
// ═══════════════════════════════════════════════════════════════════════════

export function LivePage() {
  useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    products,
    liveFeaturedProductId,
    setLiveFeaturedProduct,
    liveViewerCount,
    liveMessages,
    sendLiveChatMessage,
    liveReminderSet,
    toggleLiveReminder,
    addToCart,
  } = usePortalStore();

  const [chatInput, setChatInput] = useState("");
  const [reactionCount, setReactionCount] = useState({ heart: 142, fire: 89, thumbs: 64 });

  const featuredProduct =
    products.find((p) => p.id === liveFeaturedProductId) || products[0];
  const featuredPriceBrl = calculateBrlFromFob(featuredProduct.fobPriceUsd, 5.0);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendLiveChatMessage("Você (Cliente)", chatInput.trim(), false);
    setChatInput("");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 pt-4 pb-28 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500 text-white text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            AO VIVO · QUINTA 19H BRT
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#141210] border border-[#2A2520] text-xs text-[#F5EFE6]">
            <Users className="w-3.5 h-3.5 text-[#C9A961]" />
            {liveViewerCount} assistindo (Meta Piloto &ge;500)
          </span>
        </div>

        <button
          type="button"
          onClick={toggleLiveReminder}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs border transition ${
            liveReminderSet
              ? "bg-[#C9A961] text-[#0A0908] border-[#C9A961] font-bold"
              : "bg-[#141210] border-[#2A2520] text-[#F5EFE6]"
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>{liveReminderSet ? "Lembrete Ativo ✓" : "Lembrar Próxima Live"}</span>
        </button>
      </div>

      {/* Main Live Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Video Stream + Synchronized Featured Product */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[9/12] sm:aspect-video rounded-3xl overflow-hidden bg-[#141210] border border-[#C9A961]/40">
            <img
              src={featuredProduct.images[0]?.url}
              alt="Transmissão ao vivo Marina Ferraz"
              className="w-full h-full object-cover brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0908] via-transparent to-[#0A0908]/60" />

            {/* Curator Header Overlay */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5 bg-[#0A0908]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#2A2520]">
                <div className="w-7 h-7 rounded-full bg-[#C9A961] text-[#0A0908] font-serif font-bold text-xs flex items-center justify-center">
                  MF
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#F5EFE6]">Marina Ferraz</p>
                  <p className="text-[10px] text-[#C9A961]">Direto da Unicentro · Encarnación</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#0A0908]/80 text-[10px] font-mono text-emerald-400">
                Latência 1.8s (&le;3s SLA)
              </span>
            </div>

            {/* Emoji Reactions Overlay (Spec §27.8) */}
            <div className="absolute right-4 bottom-28 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setReactionCount((r) => ({ ...r, heart: r.heart + 1 }))}
                className="px-3 py-1.5 rounded-full bg-[#0A0908]/85 border border-[#2A2520] text-xs flex items-center gap-1 hover:border-[#C9A961]"
              >
                <span>❤️</span>
                <span className="text-[10px]">{reactionCount.heart}</span>
              </button>
              <button
                type="button"
                onClick={() => setReactionCount((r) => ({ ...r, fire: r.fire + 1 }))}
                className="px-3 py-1.5 rounded-full bg-[#0A0908]/85 border border-[#2A2520] text-xs flex items-center gap-1 hover:border-[#C9A961]"
              >
                <span>🔥</span>
                <span className="text-[10px]">{reactionCount.fire}</span>
              </button>
              <button
                type="button"
                onClick={() => setReactionCount((r) => ({ ...r, thumbs: r.thumbs + 1 }))}
                className="px-3 py-1.5 rounded-full bg-[#0A0908]/85 border border-[#2A2520] text-xs flex items-center gap-1 hover:border-[#C9A961]"
              >
                <span>👍</span>
                <span className="text-[10px]">{reactionCount.thumbs}</span>
              </button>
            </div>

            {/* Synchronized Featured Product Card */}
            <div className="absolute bottom-4 left-4 right-4 bg-[#0A0908]/95 backdrop-blur-md border border-[#C9A961] rounded-2xl p-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={featuredProduct.images[0]?.url}
                  alt={featuredProduct.name}
                  className="w-12 h-14 rounded-xl object-cover shrink-0"
                />
                <div className="min-w-0">
                  <span className="text-[10px] uppercase tracking-wider text-[#C9A961] font-bold">
                    Em Destaque Agora na Live
                  </span>
                  <h3 className="text-sm font-semibold text-[#F5EFE6] truncate">
                    {featuredProduct.name}
                  </h3>
                  <p className="text-xs font-bold text-[#C9A961]">
                    {formatBrl(featuredPriceBrl)} · II R$ 0,00
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  addToCart(featuredProduct.id, 1);
                  navigate(`/produto/${featuredProduct.slug}?live=quinta-luxo`);
                }}
                className="px-4 py-2.5 rounded-xl bg-[#C9A961] text-[#0A0908] font-bold text-xs shrink-0"
              >
                Comprar
              </button>
            </div>
          </div>

          {/* Flow 10 Slide 12 · 6 · PRÓXIMOS DESTAQUES (3 mini cards · em N min) */}
          <div className="bg-[#14110E] border border-[#2A2520] rounded-2xl p-4 space-y-3">
            <span className="eyebrow !text-[10px] block">
              PRÓXIMOS DESTAQUES (Clique para destacar no vídeo agora)
            </span>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { prod: products[0], eta: "em 3 min" },
                { prod: products[2], eta: "em 8 min" },
                { prod: products.find((p) => p.slug.includes("presilha")) || products[1], eta: "em 12 min" },
              ].map(({ prod, eta }) => {
                if (!prod) return null;
                const brl = calculateBrlFromFob(prod.fobPriceUsd, 5.0);
                const isActive = prod.id === liveFeaturedProductId;
                return (
                  <button
                    key={prod.id}
                    type="button"
                    onClick={() => setLiveFeaturedProduct(prod.id)}
                    className={`p-2 rounded-xl border text-left transition ${
                      isActive
                        ? "bg-[#C9A961]/15 border-[#C9A961]"
                        : "bg-[#0A0908] border-[#2A2520]"
                    }`}
                  >
                    <img
                      src={prod.images[0]?.url}
                      alt={prod.name}
                      className="w-full h-14 object-cover rounded-lg mb-1.5"
                    />
                    <p className="text-xs font-medium text-[#F5EFE6] truncate">{prod.name}</p>
                    <p className="text-xs font-bold text-[#C9A961]">{formatBrl(brl)}</p>
                    <span className="block text-[10px] font-mono text-[#8A8278]">{eta}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Live Chat Panel + Replays */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-[#141210] border border-[#2A2520] rounded-3xl p-4 sm:p-5 space-y-4">
          <div className="border-b border-[#2A2520] pb-3 flex items-center justify-between">
            <h2 className="font-serif text-xl text-[#F5EFE6]">Chat ao Vivo (Throttled 3s)</h2>
            <span className="text-[11px] text-[#A89F91]">Socket.io Real-time</span>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {liveMessages.map((msg) => (
              <div
                key={msg.id}
                className={`p-3 rounded-2xl text-xs space-y-1 ${
                  msg.isHost
                    ? "bg-[#C9A961]/15 border border-[#C9A961]/50 text-[#F5EFE6]"
                    : "bg-[#0A0908] border border-[#2A2520] text-[#A89F91]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-bold ${
                      msg.isHost ? "text-[#C9A961]" : "text-[#F5EFE6]"
                    }`}
                  >
                    {msg.authorName}
                  </span>
                  <span className="text-[10px] opacity-60">{msg.createdAt}</span>
                </div>
                <p className="leading-relaxed">{msg.text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendChat} className="flex gap-2 pt-2 border-t border-[#2A2520]">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Pergunte para a curadora Marina Ferraz..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#0A0908] border border-[#2A2520] text-xs text-[#F5EFE6]"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-[#C9A961] text-[#0A0908] font-bold text-xs flex items-center gap-1"
            >
              <Send className="w-3.5 h-3.5" />
              Enviar
            </button>
          </form>

          {/* Replays Archive */}
          <div className="pt-3 border-t border-[#2A2520] space-y-2">
            <span className="text-[10px] uppercase tracking-wider text-[#C9A961] font-semibold">
              Replays Disponíveis (&le;30 min após término · Meta 30% views)
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#0A0908] border border-[#2A2520] rounded-xl p-2.5 flex items-center gap-2">
                <Play className="w-4 h-4 text-[#C9A961] shrink-0" />
                <span className="truncate">Especial Ouro 18k & Seda (610 views)</span>
              </div>
              <div className="bg-[#0A0908] border border-[#2A2520] rounded-xl p-2.5 flex items-center gap-2">
                <Play className="w-4 h-4 text-[#C9A961] shrink-0" />
                <span className="truncate">Bolsas Artesanais PY (540 views)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PARTE III · DASHBOARD EXECUTIVO & POSTGRES-AS-LAKE ANALYTICS (Spec §28 + Brief §5)
// ═══════════════════════════════════════════════════════════════════════════

export function AnalyticsDashboardPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 pt-5 pb-28 space-y-8">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A961]/15 border border-[#C9A961]/40 text-[#C9A961] text-[10px] font-semibold uppercase tracking-widest">
          <Database className="w-3.5 h-3.5" />
          <span>Spec v2.4 · Parte III (Seção 28 · ADR-0009) + KPIs Product Brief §5</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#F5EFE6]">
          Steering Committee · KPIs do Piloto & Postgres-as-Lake IA
        </h1>
        <p className="text-xs sm:text-sm text-[#A89F91]">
          Visão consolidada para o Líder de Produto: 5 KPIs norteadores, 4 métricas de guardrail e pipelines de IA (Prophet, pgvector, RFM e isolamento de anomalias fiscais NF-e).
        </p>
      </div>

      {/* 5 North Star KPIs (Product Brief §5) */}
      <section className="space-y-3">
        <h2 className="font-serif text-xl text-[#F5EFE6] flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#C9A961]" />
          5 KPIs Norteadores do Piloto (27/nov – 31/dez)
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: "Conversão Sessão→Pedido", actual: "1,8%", target: "Meta Piloto: 1,5% · Scale: 3%" },
            { label: "Ticket Médio", actual: "R$ 214", target: "Meta Piloto: R$ 180 · Scale: R$ 280" },
            { label: "CAC (Orgânico + Look)", actual: "R$ 41", target: "Meta Piloto: R$ 45 · Scale: R$ 30" },
            { label: "LTV (12 meses)", actual: "R$ 642", target: "Meta Piloto: R$ 540 · Scale: R$ 900" },
            { label: "NPS Pós-Entrega", actual: "54", target: "Meta Piloto: 45 · Scale: 60" },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className="bg-[#141210] border border-[#2A2520] rounded-2xl p-4 space-y-1"
            >
              <span className="text-[11px] text-[#A89F91] block">{kpi.label}</span>
              <span className="font-serif text-2xl font-bold text-[#C9A961] block">
                {kpi.actual}
              </span>
              <span className="text-[10px] text-emerald-400 block">{kpi.target}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 4 Guardrail Metrics (Product Brief §5.1) */}
      <section className="space-y-3">
        <h2 className="font-serif text-xl text-[#F5EFE6] flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          Métricas de Guardrail (Tempo Real)
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { name: "Taxa de Chargeback", val: "0,42%", limit: "Guardrail: < 1,5%", ok: true },
            { name: "Latência p99 da API", val: "340 ms", limit: "Guardrail: < 800 ms", ok: true },
            { name: "Taxa de Erro Pix Split", val: "0,08%", limit: "Guardrail: < 0,5%", ok: true },
            { name: "Processamento IA p95", val: "1,84 s", limit: "Guardrail: < 8,0 s", ok: true },
          ].map((g) => (
            <div
              key={g.name}
              className="bg-[#141210] border border-emerald-500/30 rounded-2xl p-4 space-y-1"
            >
              <span className="text-xs text-[#A89F91]">{g.name}</span>
              <p className="font-mono text-lg font-bold text-[#F5EFE6]">{g.val}</p>
              <span className="text-[10px] text-emerald-400">{g.limit} ✓</span>
            </div>
          ))}
        </div>
      </section>

      {/* Prophet Demand Forecast + Fiscal Anomalies (Spec §28.5 & §28.6) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#141210] border border-[#2A2520] rounded-3xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#C9A961] font-semibold">
                Job BullMQ: ml-demand-forecast (Prophet · MAPE 8.4%)
              </span>
              <h3 className="font-serif text-xl text-[#F5EFE6]">
                Previsão de Demanda Black Friday (Nov/2026)
              </h3>
            </div>
            <Cpu className="w-5 h-5 text-[#C9A961]" />
          </div>

          <div className="space-y-2.5 text-xs">
            {[
              { sku: "Brinco Gota Dourado Imperial", pred: 68, low: 54, high: 82, stock: 42 },
              { sku: "Lenço Seda Riviera Esmeralda", pred: 44, low: 35, high: 53, stock: 19 },
              { sku: "Bolsa Palha Trançada Encarnación", pred: 31, low: 24, high: 39, stock: 3 },
              { sku: "Relógio Minimal Petite Gold", pred: 29, low: 21, high: 36, stock: 2 },
            ].map((row) => (
              <div
                key={row.sku}
                className="bg-[#0A0908] border border-[#2A2520] rounded-xl p-3 flex items-center justify-between gap-2"
              >
                <div>
                  <p className="font-medium text-[#F5EFE6]">{row.sku}</p>
                  <p className="text-[11px] text-[#A89F91]">
                    IC 80%: [{row.low} – {row.high} un.] · Estoque atual: {row.stock} un.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-[#C9A961]/15 text-[#C9A961] font-mono font-bold">
                  {row.pred} un.
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Fiscal Anomaly Detection + RFM Segmentation */}
        <div className="bg-[#141210] border border-[#2A2520] rounded-3xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#C9A961] font-semibold">
                Job BullMQ: ml-anomaly-detection + analytics_customer_rfm
              </span>
              <h3 className="font-serif text-xl text-[#F5EFE6]">
                Auditoria Fiscal NF-e & Segmentação RFM
              </h3>
            </div>
            <Award className="w-5 h-5 text-[#C9A961]" />
          </div>

          <div className="space-y-3 text-xs">
            <div className="bg-amber-500/10 border border-amber-500/40 rounded-2xl p-3.5 space-y-1">
              <div className="flex items-center justify-between text-amber-300 font-bold">
                <span className="flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  FISCAL_ANOMALY (Score 0.85 · HIGH)
                </span>
                <span className="font-mono text-[10px]">NF-e 000.418802</span>
              </div>
              <p className="text-[#A89F91]">
                CFOP 5102 detectado em rascunho de importação — corrigido automaticamente pelo retry SEFAZ para CFOP cross-border 6108.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-[#0A0908] border border-[#2A2520] rounded-xl p-3">
                <span className="text-[10px] text-[#C9A961] uppercase font-bold">
                  Segmento CHAMPION (RFM)
                </span>
                <p className="font-serif text-xl font-bold text-[#F5EFE6] mt-0.5">24% da base</p>
                <p className="text-[11px] text-[#A89F91]">Recência &lt;30d · 3+ pedidos/ano</p>
              </div>
              <div className="bg-[#0A0908] border border-[#2A2520] rounded-xl p-3">
                <span className="text-[10px] text-emerald-400 uppercase font-bold">
                  Economia Postgres-as-Lake
                </span>
                <p className="font-serif text-xl font-bold text-[#F5EFE6] mt-0.5">~R$ 18k / 6m</p>
                <p className="text-[11px] text-[#A89F91]">Zero ETL externo no piloto (ADR-0009)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
