// apps/web/src/routes/DesignSystemPage.tsx
// Página interativa do Design System v1.0 & Figma Frame Spec (Slides 01 a 12 de Figma_Frame.pdf + 145 Tokens)

import React from "react";
import { Link } from "react-router-dom";
import { Star, Sparkles, Check, Layers, Smartphone, ArrowRight } from "lucide-react";

const COLOR_TOKENS = [
  { name: "--bg", hex: "#0A0908", desc: "bg · deep black", lightText: true },
  { name: "--bg-elevated", hex: "#14110E", desc: "bg-elevated · cards", lightText: true },
  { name: "--surface", hex: "#1C1814", desc: "surface · modais", lightText: true },
  { name: "--divider", hex: "#2A2520", desc: "divider · bordas sutis", lightText: true },
  { name: "--primary", hex: "#F5EFE6", desc: "primary · warm off-white", lightText: false },
  { name: "--primary-dim", hex: "#C9C2B6", desc: "primary-dim · secundário", lightText: false },
  { name: "--muted", hex: "#8A8278", desc: "muted · aux text", lightText: false },
  { name: "--accent", hex: "#C9A961", desc: "accent · champagne gold", lightText: false },
];

const TEN_FLOWS = [
  { num: "01", title: "Vitrine · Home, Busca, Categoria", path: "/", specs: "Hero 84h · Chips scroll-x · Grid 2-col" },
  { num: "02", title: "Explorar · Modal Filtros, Top 5, Novidades", path: "/mais-vendidos", specs: "Range R$70-R$250 · Swatches 32x32 · Radio" },
  { num: "03", title: "Produto · PDP, Galeria Zoom 2x, Specs", path: "/produto/lenco-seda-riviera-esmeralda", specs: "Hero 180h · 4 dots · Specs 3-col · Comprar direto" },
  { num: "04", title: "Checkout · Sacola ICMS, QR Pix, Confirmação", path: "/carrinho", specs: "Federal R$ 0,00 green · ICMS dinâmico · QR 15m" },
  { num: "05", title: "Pós-compra · Timeline 5 etapas Correios", path: "/conta/pedidos/PEL-2026-0842", specs: "5 steps · Active 14px pulse dot · RR...PY" },
  { num: "06", title: "Onboarding · Splash Editorial + KYC Banco", path: "/boas-vindas", specs: "Splash 1.5s · CPF mod-11 · ViaCEP <=500ms" },
  { num: "07", title: "Wishlist · Badges + Gráfico SVG 30 dias", path: "/conta/desejos", specs: "BAIXOU R$ 15 green · ÚLTIMAS 2 gold · SVG chart" },
  { num: "08", title: "Assistente IA · Drop Zone + 3 Looks", path: "/conta/assistente", specs: "Bubble tinted · Dashed 1.5px gold · SLA <8s" },
  { num: "09", title: "Carrinho Compartilhável · Montar + Amiga", path: "/s/aniversario-marina-2026", specs: "Checkboxes 16px · Pills 'Eu pago' · Split Pix" },
  { num: "10", title: "Moda ao Vivo · Live Player + Próximos", path: "/live/quinta-luxo", specs: "Red pulse dot · Featured bar · 3 mini cards" },
];

export function DesignSystemPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 pt-6 pb-28 space-y-10">
      {/* Slide 01 Header */}
      <div className="border-b border-[#2A2520] pb-5 flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1.5">
          <span className="eyebrow">DESIGN SYSTEM · OVERVIEW · 01 / 12</span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#F5EFE6]">
            Tokens, componentes e <em className="italic font-normal text-[#C9A961]">princípios.</em>
          </h1>
          <p className="text-xs sm:text-sm text-[#8A8278]">
            145 tokens W3C / Tokens Studio em <code className="text-[#C9A961] font-mono">tokens.json</code> e variáveis CSS em <code className="text-[#C9A961] font-mono">globals.css</code> · 10 Fluxos · 30 Telas · 14 Componentes Reutilizáveis.
          </p>
        </div>

        <div className="flex gap-2 text-[11px] font-mono">
          <span className="px-3 py-1 rounded-full bg-[#4FC3F7]/10 border border-[#4FC3F7]/40 text-[#4FC3F7]">
            145 TOKENS
          </span>
          <span className="px-3 py-1 rounded-full bg-[#4FC3F7]/10 border border-[#4FC3F7]/40 text-[#4FC3F7]">
            14 COMPONENTES
          </span>
          <span className="px-3 py-1 rounded-full bg-[#4FC3F7]/10 border border-[#4FC3F7]/40 text-[#4FC3F7]">
            10 FLUXOS
          </span>
        </div>
      </div>

      {/* 01 Color Tokens + 02 Typography */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 bg-[#14110E] border border-[#2A2520] rounded-2xl p-5 space-y-4">
          <span className="text-xs font-mono text-[#4FC3F7] tracking-widest uppercase">
            01 · COLOR TOKENS (8 cores · champagne gold como acento único)
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {COLOR_TOKENS.map((t) => (
              <div key={t.name} className="space-y-1.5">
                <div
                  className="h-14 rounded-lg border border-[#F5EFE6]/20 flex items-end p-2"
                  style={{ backgroundColor: t.hex }}
                >
                  <span
                    className={`font-mono text-[10px] ${
                      t.lightText ? "text-[#F5EFE6]" : "text-[#0A0908] font-bold"
                    }`}
                  >
                    {t.name}
                  </span>
                </div>
                <p className="font-mono text-xs text-[#F5EFE6]">{t.hex}</p>
                <p className="font-mono text-[10px] text-[#8A8278]">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 bg-[#14110E] border border-[#2A2520] rounded-2xl p-5 space-y-4">
          <span className="text-xs font-mono text-[#4FC3F7] tracking-widest uppercase">
            02 · TYPOGRAPHY (3 fontes)
          </span>
          <div className="space-y-3">
            <div className="border-b border-[#2A2520] pb-2">
              <p className="font-serif text-2xl text-[#F5EFE6]">Playfair Display</p>
              <span className="font-mono text-[10px] text-[#8A8278]">
                --font-heading · 28–56px · Editorial Serif
              </span>
            </div>
            <div className="border-b border-[#2A2520] pb-2">
              <p className="font-sans text-base text-[#F5EFE6]">Inter Regular / Semibold</p>
              <span className="font-mono text-[10px] text-[#8A8278]">
                --font-body / --font-num · 13–15px UI & Preços
              </span>
            </div>
            <div>
              <p className="font-mono text-sm text-[#C9C2B6]">JetBrains Mono</p>
              <span className="font-mono text-[10px] text-[#8A8278]">
                --font-mono · Spec Annotations & Códigos
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Slide 02: 14 Componentes Reutilizáveis */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="eyebrow">DESIGN SYSTEM · COMPONENTS · 02 / 12</span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#F5EFE6]">
              14 componentes <em className="italic font-normal text-[#C9A961]">reutilizáveis.</em>
            </h2>
          </div>
          <Layers className="w-5 h-5 text-[#C9A961]" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {/* 01 Phone Frame */}
          <div className="bg-[#14110E] border border-[#2A2520] rounded-xl p-3.5 flex flex-col justify-between gap-3">
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-[#4FC3F7]">01</span>
              <span className="text-[#8A8278]">PHONE-FRAME</span>
            </div>
            <div className="mx-auto w-12 h-20 rounded-xl border border-[#C9A961]/60 bg-[#0A0908]" />
            <span className="font-mono text-[10px] text-[#8A8278]">240×500 · radius 32 · border 1px</span>
          </div>

          {/* 02 Prod Card */}
          <div className="bg-[#14110E] border border-[#2A2520] rounded-xl p-3.5 flex flex-col justify-between gap-3">
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-[#4FC3F7]">02</span>
              <span className="text-[#8A8278]">PROD-CARD</span>
            </div>
            <div className="prod-card p-2 text-center">
              <span className="block text-xs text-[#F5EFE6]">Lenço Seda</span>
              <span className="block text-xs font-bold text-[#C9A961]">R$ 110</span>
            </div>
            <span className="font-mono text-[10px] text-[#8A8278]">img 80h · radius 8</span>
          </div>

          {/* 03 Cat Chip */}
          <div className="bg-[#14110E] border border-[#2A2520] rounded-xl p-3.5 flex flex-col justify-between gap-3">
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-[#4FC3F7]">03</span>
              <span className="text-[#8A8278]">CAT-CHIP</span>
            </div>
            <div className="flex gap-1.5 justify-center">
              <span className="cat-chip text-[11px]">Bijuterias</span>
              <span className="cat-chip active text-[11px]">Dourado</span>
            </div>
            <span className="font-mono text-[10px] text-[#8A8278]">pill 4×9 · radius 999</span>
          </div>

          {/* 04 Btn Gold */}
          <div className="bg-[#14110E] border border-[#2A2520] rounded-xl p-3.5 flex flex-col justify-between gap-3">
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-[#4FC3F7]">04</span>
              <span className="text-[#8A8278]">BTN-GOLD</span>
            </div>
            <button type="button" className="btn-gold text-xs py-2">
              Comprar
            </button>
            <span className="font-mono text-[10px] text-[#8A8278]">accent bg · radius 8</span>
          </div>

          {/* 05 Btn Outline */}
          <div className="bg-[#14110E] border border-[#2A2520] rounded-xl p-3.5 flex flex-col justify-between gap-3">
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-[#4FC3F7]">05</span>
              <span className="text-[#8A8278]">BTN-OUTLINE</span>
            </div>
            <button type="button" className="btn-outline text-xs py-2">
              Salvar
            </button>
            <span className="font-mono text-[10px] text-[#8A8278]">border accent · radius 8</span>
          </div>

          {/* 06 Eyebrow */}
          <div className="bg-[#14110E] border border-[#2A2520] rounded-xl p-3.5 flex flex-col justify-between gap-3">
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-[#4FC3F7]">06</span>
              <span className="text-[#8A8278]">EYEBROW</span>
            </div>
            <div className="text-center">
              <span className="eyebrow">EYEBROW</span>
            </div>
            <span className="font-mono text-[10px] text-[#8A8278]">11px · 0.28em</span>
          </div>

          {/* 07 Gold Line */}
          <div className="bg-[#14110E] border border-[#2A2520] rounded-xl p-3.5 flex flex-col justify-between gap-3">
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-[#4FC3F7]">07</span>
              <span className="text-[#8A8278]">GOLD-LINE</span>
            </div>
            <div className="gold-line my-2" />
            <span className="font-mono text-[10px] text-[#8A8278]">1px · gradient → gold</span>
          </div>

          {/* 10 Stat Block */}
          <div className="bg-[#14110E] border border-[#2A2520] rounded-xl p-3.5 flex flex-col justify-between gap-3">
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-[#4FC3F7]">10</span>
              <span className="text-[#8A8278]">STAT-BLOCK</span>
            </div>
            <div className="text-center">
              <span className="font-serif text-2xl text-[#C9A961] font-bold">96%</span>
              <span className="block text-[9px] tracking-widest text-[#8A8278]">RECOMENDAM</span>
            </div>
            <span className="font-mono text-[10px] text-[#8A8278]">Playfair · accent</span>
          </div>

          {/* 11 Star Rating */}
          <div className="bg-[#14110E] border border-[#2A2520] rounded-xl p-3.5 flex flex-col justify-between gap-3">
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-[#4FC3F7]">11</span>
              <span className="text-[#8A8278]">STAR-RATING</span>
            </div>
            <div className="flex justify-center gap-1 text-[#C9A961]">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-[#C9A961]" />
              ))}
            </div>
            <span className="font-mono text-[10px] text-[#8A8278]">Material Icon · 14px</span>
          </div>

          {/* 12 Badge */}
          <div className="bg-[#14110E] border border-[#2A2520] rounded-xl p-3.5 flex flex-col justify-between gap-3">
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-[#4FC3F7]">12</span>
              <span className="text-[#8A8278]">BADGE</span>
            </div>
            <div className="text-center">
              <span className="px-2.5 py-1 rounded-full bg-[#7FA66B]/20 border border-[#7FA66B] text-[#7FA66B] text-[10px] font-bold uppercase tracking-wider">
                BAIXOU R$ 15
              </span>
            </div>
            <span className="font-mono text-[10px] text-[#8A8278]">success #7FA66B · 6px</span>
          </div>

          {/* 13 Form Field */}
          <div className="bg-[#14110E] border border-[#2A2520] rounded-xl p-3.5 flex flex-col justify-between gap-3">
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-[#4FC3F7]">13</span>
              <span className="text-[#8A8278]">FORM-FIELD</span>
            </div>
            <div className="form-field">
              <span className="block text-[9px] text-[#C9A961] uppercase">CPF</span>
              <span className="font-mono text-xs text-[#F5EFE6]">123.456.789-00</span>
            </div>
            <span className="font-mono text-[10px] text-[#8A8278]">surface · radius 6</span>
          </div>

          {/* 14 Success Check */}
          <div className="bg-[#14110E] border border-[#2A2520] rounded-xl p-3.5 flex flex-col justify-between gap-3">
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-[#4FC3F7]">14</span>
              <span className="text-[#8A8278]">SUCCESS-CHECK</span>
            </div>
            <div className="mx-auto w-9 h-9 rounded-full bg-[#C9A961] text-[#0A0908] flex items-center justify-center shadow-lg">
              <Check className="w-5 h-5" />
            </div>
            <span className="font-mono text-[10px] text-[#8A8278]">glowAccent · 60px</span>
          </div>
        </div>
      </section>

      {/* Slides 03–12: Os 10 Fluxos Navegáveis */}
      <section className="space-y-4">
        <div>
          <span className="eyebrow">MAPA DE NAVEGAÇÃO · SLIDES 03 A 12</span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#F5EFE6]">
            Os 10 Fluxos da Versão 1.0 (30 Telas)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {TEN_FLOWS.map((f) => (
            <Link
              key={f.num}
              to={f.path}
              className="bg-[#14110E] border border-[#2A2520] hover:border-[#C9A961] rounded-2xl p-4 flex items-center justify-between gap-4 transition group"
            >
              <div className="flex items-center gap-3.5">
                <span className="w-9 h-9 rounded-full bg-[#4FC3F7]/15 border border-[#4FC3F7] text-[#4FC3F7] font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  {f.num}
                </span>
                <div>
                  <h3 className="font-serif text-lg text-[#F5EFE6] group-hover:text-[#C9A961] transition">
                    {f.title}
                  </h3>
                  <p className="font-mono text-[11px] text-[#8A8278]">{f.specs}</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#C9A961] shrink-0" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
