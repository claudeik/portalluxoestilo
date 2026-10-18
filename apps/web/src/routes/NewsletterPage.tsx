// apps/web/src/routes/NewsletterPage.tsx
// Mockup 12 do Estudo · E-mail Editorial estilo Porter Magazine (Net-a-Porter)
// Edição quinzenal com carta da editora, peças da safra e preço transparente

import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, ShoppingBag, Share2, Mail, CheckCircle2 } from "lucide-react";
import { usePortalStore } from "../stores/app.store";
import { formatBrl } from "../lib/format";

export function NewsletterPage() {
  const { customer, currentPersona } = usePortalStore();
  const firstName = customer?.fullName.split(" ")[0] || "Maria Helena";

  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 pb-28 space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-[#8C8275] hover:text-[#0A0A0A] font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar à Loja</span>
        </Link>
        <span className="text-[10px] font-mono uppercase tracking-wider text-[#8B6B30] bg-[#F0EBE0] px-2.5 py-1 rounded-full">
          Mockup 12 · Newsletter de Revista
        </span>
      </div>

      {/* Frame da Newsletter */}
      <div className="bg-white border border-[#C9BFA8] rounded-3xl overflow-hidden shadow-xl">
        {/* Topo Preto de Alta Costura */}
        <header className="bg-[#0A0A0A] text-[#FAF7F2] p-8 text-center space-y-2">
          <div className="font-serif text-2xl tracking-[0.25em] uppercase text-[#D9BE85]">
            Portal · Estilo · Luxo
          </div>
          <div className="italic-serif text-sm text-[#FAF7F2]/80">
            Edição #03 · Outubro 2026 · Safra Primavera
          </div>
        </header>

        {/* Corpo da Carta Editorial */}
        <div className="p-8 sm:p-10 space-y-8 text-[#2C2C2C]">
          <div className="space-y-3">
            <span className="eyebrow text-[#8B6B30]">A Escolha da Editora</span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#0A0A0A] leading-tight font-normal">
              Oito peças que traduzem <br />
              <em className="italic text-[#8B6B30]">o novo luxo acessível</em>
            </h1>
          </div>

          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[#4A4A4A]">
            <p>
              Olá, <strong>{firstName}</strong>.
            </p>
            <p>
              Nossa equipe de curadoria acaba de retornar de Ciudad del Este com a seleção oficial da <strong>Safra Primavera</strong>. Oito peças escolhidas a dedo entre artesãos e fornecedores certificados da Unicentro.
            </p>
            <p>
              Bijuterias esculpidas com banho em ouro 18k níquel-free, lenços em viscose fluida com corante botânico e bolsas de palha toquilla trançadas manualmente. Tudo rigorosamente abaixo de US$ 45 FOB — com imposto federal zerado sob o regime Remessa Conforme e entrega rastreada pelos Correios em 10 a 15 dias úteis.
            </p>
          </div>

          {/* Destaque Hero da Edição */}
          <div className="bg-[#FAF7F2] border border-[#C9BFA8] rounded-2xl overflow-hidden p-6 space-y-6">
            <div className="aspect-[4/3] rounded-xl overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=80"
                alt="Lenço Estampado Floral"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-3 left-3 bg-[#0A0A0A]/85 backdrop-blur-md text-[#FAF7F2] text-[10px] uppercase font-mono tracking-wider px-2.5 py-1 rounded-md">
                Peça Central da Safra
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-xl text-[#0A0A0A]">Lenço Estampado Floral Exclusivo</h3>
                <p className="text-xs text-[#8C8275]">Viscose acetinada 90×90 cm · Edição limitada numerada</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase text-[#8C8275] block">Preço Final:</span>
                <span className="italic-serif text-2xl font-bold text-[#8B6B30]">
                  R$ 110,00
                </span>
              </div>
            </div>

            <Link
              to="/produto/lenco-estampado-floral"
              className="btn-gold w-full text-center"
            >
              Comprar Peça da Edição →
            </Link>
          </div>

          {/* Mini Grid 2x2 de Acessórios da Safra */}
          <div className="space-y-3 pt-2">
            <span className="eyebrow text-[#0A0A0A]">Também nesta edição:</span>
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/produto/brinco-gota-dourado"
                className="p-3 bg-[#FAF7F2] border border-[#C9BFA8] rounded-xl hover:border-[#B8924A] transition space-y-2 block"
              >
                <div className="aspect-square rounded-lg overflow-hidden bg-[#F0EBE0]">
                  <img
                    src="https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=400&q=80"
                    alt="Brinco Gota"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-xs">
                  <span className="font-medium text-[#0A0A0A] block truncate">Brinco Gota Dourado</span>
                  <span className="italic-serif text-sm text-[#8B6B30]">R$ 90,00</span>
                </div>
              </Link>

              <Link
                to="/produto/bolsa-palha-trancada"
                className="p-3 bg-[#FAF7F2] border border-[#C9BFA8] rounded-xl hover:border-[#B8924A] transition space-y-2 block"
              >
                <div className="aspect-square rounded-lg overflow-hidden bg-[#F0EBE0]">
                  <img
                    src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=400&q=80"
                    alt="Bolsa de Palha"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-xs">
                  <span className="font-medium text-[#0A0A0A] block truncate">Bolsa de Palha Trançada</span>
                  <span className="italic-serif text-sm text-[#8B6B30]">R$ 210,00</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Assinatura da Curadoria */}
          <div className="pt-6 border-t border-[#C9BFA8] flex items-center justify-between text-xs text-[#8C8275]">
            <div className="italic-serif text-base text-[#0A0A0A]">
              — Curadoria Portal Estilo Luxo
            </div>
            <div className="text-[10px] uppercase font-mono">
              Frequência Quinzenal
            </div>
          </div>
        </div>

        {/* Footer do E-mail */}
        <footer className="bg-[#FAF7F2] border-t border-[#C9BFA8] p-6 text-center text-[11px] text-[#8C8275] space-y-1">
          <p>Você recebeu esta edição porque está inscrita na lista de safras exclusivas da Portal.</p>
          <p>Portal Estilo Luxo · curadoria@portalestiloluxo.com.br · São Paulo · Brasil</p>
        </footer>
      </div>
    </div>
  );
}
