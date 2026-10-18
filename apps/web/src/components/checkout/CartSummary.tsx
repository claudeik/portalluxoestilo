// apps/web/src/components/checkout/CartSummary.tsx
// Resumo Transparente do Pedido · Portal Estilo Luxo (Volume I · Pitch Editorial)
// Mercadoria, Frete, Imposto Federal R$ 0,00, ICMS estadual e Split Regulado

import React, { useState } from "react";
import { ShieldCheck, ChevronDown, ChevronUp, Info, Lock } from "lucide-react";
import { CheckoutQuote } from "@portal/types";
import { formatBrl, formatUsd } from "../../lib/format";

interface CartSummaryProps {
  quote: CheckoutQuote;
  showSplitDetails?: boolean;
}

export function CartSummary({ quote, showSplitDetails = true }: CartSummaryProps) {
  const [splitOpen, setSplitOpen] = useState(false);

  return (
    <div
      data-testid="cart-summary-card"
      className="bg-white dark:bg-[#14110E] border border-[#C9BFA8] dark:border-[#2A2520] rounded-2xl p-5 space-y-4 shadow-sm text-left"
    >
      <div className="flex items-center justify-between border-b border-[#C9BFA8]/60 pb-3">
        <h3 className="font-serif text-lg text-[#0A0A0A] dark:text-[#FAF7F2]">
          Resumo Transparente do Pedido
        </h3>
        <span className="text-[10px] uppercase font-mono tracking-wider text-[#5B8254] bg-[#5B8254]/10 px-2.5 py-0.5 rounded-full font-bold">
          Remessa Conforme
        </span>
      </div>

      <div className="space-y-2.5 text-xs text-[#2C2C2C] dark:text-[#FAF7F2]/90">
        <div className="flex justify-between">
          <span className="text-[#8C8275]">Mercadoria FOB (Ciudad del Este):</span>
          <span className="font-medium text-[#0A0A0A] dark:text-[#FAF7F2]">{formatBrl(quote.subtotalBrl)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-[#8C8275]">Frete Correios Internacional:</span>
          <span className="font-medium text-[#0A0A0A] dark:text-[#FAF7F2]">{formatBrl(quote.shippingBrl)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-[#8C8275]">Imposto de Importação Federal:</span>
          <span className="font-bold text-[#5B8254]">
            R$ 0,00 (Isento até US$ 50)
          </span>
        </div>

        <div className="flex justify-between pt-1 border-t border-dashed border-[#C9BFA8]">
          <span className="text-[#8C8275]">ICMS Estadual {quote.state} (17% por dentro):</span>
          <span className="font-medium text-[#8B6B30]">{formatBrl(quote.icmsBrl)}</span>
        </div>

        <div className="pt-3 border-t-2 border-[#0A0A0A] dark:border-[#B8924A] flex items-baseline justify-between">
          <span className="font-serif text-base font-bold text-[#0A0A0A] dark:text-[#FAF7F2]">
            Total Final no Pix:
          </span>
          <span className="italic-serif text-2xl font-bold text-[#8B6B30] dark:text-[#D9BE85]">
            {formatBrl(quote.totalBrl)}
          </span>
        </div>
      </div>

      <div className="p-3 bg-[#FAF7F2] dark:bg-[#1C1814] border border-[#C9BFA8] dark:border-[#2A2520] rounded-xl flex items-center gap-2 text-[11px] text-[#4A4A4A] dark:text-[#FAF7F2]/80">
        <Lock className="w-4 h-4 text-[#8B6B30] shrink-0" />
        <span>Preço final na tela · Sem taxas surpresa no recebimento pelos Correios.</span>
      </div>

      {showSplitDetails && (
        <div className="pt-2 border-t border-[#C9BFA8]/60 space-y-3">
          <button
            type="button"
            onClick={() => setSplitOpen(!splitOpen)}
            className="w-full flex items-center justify-between text-xs text-[#8B6B30] font-semibold hover:underline"
          >
            <span>Ver divisão do Split Regulado (4 destinos)</span>
            {splitOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {splitOpen && (
            <div className="grid grid-cols-2 gap-2 text-[10px] pt-1 animate-fade-in">
              <div className="bg-[#F0EBE0] dark:bg-[#1C1814] p-2.5 rounded-xl border border-[#C9BFA8]">
                <span className="block text-[#8B6B30] font-bold">Portal (20% comissão)</span>
                <span className="italic-serif text-sm font-bold text-[#0A0A0A] dark:text-[#FAF7F2]">
                  {formatBrl(quote.splits.portalBrl)}
                </span>
              </div>
              <div className="bg-[#F0EBE0] dark:bg-[#1C1814] p-2.5 rounded-xl border border-[#C9BFA8]">
                <span className="block text-[#0A0A0A] dark:text-[#FAF7F2] font-medium">Unicentro PY (~71%)</span>
                <span className="italic-serif text-sm font-bold text-[#0A0A0A] dark:text-[#FAF7F2]">
                  {formatBrl(quote.splits.unicentroBrl)}
                </span>
              </div>
              <div className="bg-[#F0EBE0] dark:bg-[#1C1814] p-2.5 rounded-xl border border-[#C9BFA8]">
                <span className="block text-[#8C8275]">Epyx E-commerce (~5%)</span>
                <span className="italic-serif text-sm font-bold text-[#0A0A0A] dark:text-[#FAF7F2]">
                  {formatBrl(quote.splits.epyxBrl)}
                </span>
              </div>
              <div className="bg-[#F0EBE0] dark:bg-[#1C1814] p-2.5 rounded-xl border border-[#C9BFA8]">
                <span className="block text-[#8C8275]">ICMS Estadual (~4%)</span>
                <span className="italic-serif text-sm font-bold text-[#0A0A0A] dark:text-[#FAF7F2]">
                  {formatBrl(quote.splits.taxBrl)}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
