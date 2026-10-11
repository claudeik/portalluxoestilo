// apps/web/src/components/checkout/CartSummary.tsx
import React from "react";
import { ShieldCheck, Split, Info } from "lucide-react";
import { CheckoutQuote } from "@portal/types";
import { formatBrl } from "../../lib/format";

interface CartSummaryProps {
  quote: CheckoutQuote;
  showSplitBreakdown?: boolean;
}

export function CartSummary({ quote, showSplitBreakdown = true }: CartSummaryProps) {
  const icmsPct = Math.round(quote.icmsRate * 1000) / 10;

  return (
    <div
      data-testid="cart-summary-card"
      className="bg-[#141210] border border-[#2A2520] rounded-2xl p-4 sm:p-5 space-y-4"
    >
      <div className="flex items-center justify-between border-b border-[#2A2520] pb-3">
        <div>
          <h3 className="font-serif text-lg text-[#F5EFE6]">Transparência Total do Pedido</h3>
          <p className="text-xs text-[#A89F91]">
            Preço final fechado em Reais · Zero cobrança extra nos Correios
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold">
          Remessa Conforme
        </span>
      </div>

      {/* Line Items Breakdown */}
      <div className="space-y-2.5 text-sm">
        <div className="flex items-center justify-between text-[#A89F91]">
          <span>Subtotal Catálogo Unicentro (PTAX R$ {quote.exchangeRate.toFixed(2)})</span>
          <span className="text-[#F5EFE6] font-medium">{formatBrl(quote.subtotalBrl)}</span>
        </div>

        <div className="flex items-center justify-between text-[#A89F91]">
          <span>Frete Internacional Correios (SRO-eXML)</span>
          <span className="text-[#F5EFE6] font-medium">{formatBrl(quote.shippingBrl)}</span>
        </div>

        <div className="flex items-center justify-between text-emerald-400">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            Imposto de Importação Federal (abaixo de US$ 50)
          </span>
          <span data-testid="federal-tax-value" className="font-bold">
            R$ 0,00
          </span>
        </div>

        <div className="flex items-center justify-between text-[#A89F91]">
          <span className="inline-flex items-center gap-1">
            ICMS Estadual ({quote.state} · {icmsPct}% cálculo por dentro)
          </span>
          <span data-testid="icms-tax-value" className="text-[#F5EFE6] font-medium">
            {formatBrl(quote.icmsBrl)}
          </span>
        </div>

        <div className="pt-3 border-t border-[#2A2520] flex items-baseline justify-between">
          <div>
            <span className="text-base font-semibold text-[#F5EFE6]">Total Final no Pix</span>
            <span className="block text-[11px] text-[#C9A961]">
              Câmbio travado · Sem IOF de cartão internacional
            </span>
          </div>
          <span data-testid="total-brl-value" className="font-serif text-2xl font-bold text-[#C9A961]">
            {formatBrl(quote.totalBrl)}
          </span>
        </div>
      </div>

      {/* Regulated Pix Split Visualization (Spec §9.2) */}
      {showSplitBreakdown && quote.totalBrl > 0 && (
        <div className="pt-3 border-t border-[#2A2520]/80 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-[#A89F91]">
            <span className="inline-flex items-center gap-1.5 text-[#C9A961] font-medium">
              <Split className="w-3.5 h-3.5" />
              Split Pix Automático (Banco Parceiro Regulado BC)
            </span>
            <span className="font-mono text-[10px]">Sem custódia pela Portal</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
            <div className="bg-[#0A0908] border border-[#2A2520] rounded-xl p-2">
              <span className="block text-[#A89F91]">Unicentro PY</span>
              <span className="font-semibold text-[#F5EFE6]">
                {formatBrl(quote.splits.unicentroBrl)}
              </span>
            </div>
            <div className="bg-[#0A0908] border border-[#C9A961]/30 rounded-xl p-2">
              <span className="block text-[#C9A961]">Portal (20%)</span>
              <span className="font-semibold text-[#C9A961]">
                {formatBrl(quote.splits.portalBrl)}
              </span>
            </div>
            <div className="bg-[#0A0908] border border-[#2A2520] rounded-xl p-2">
              <span className="block text-[#A89F91]">ICMS ({quote.state})</span>
              <span className="font-semibold text-[#F5EFE6]">
                {formatBrl(quote.splits.taxBrl)}
              </span>
            </div>
            <div className="bg-[#0A0908] border border-[#2A2520] rounded-xl p-2">
              <span className="block text-[#A89F91]">Epyx (5%)</span>
              <span className="font-semibold text-[#F5EFE6]">
                {formatBrl(quote.splits.epyxBrl)}
              </span>
            </div>
          </div>

          <p className="text-[10px] text-[#A89F91] flex items-start gap-1.5 leading-relaxed">
            <Info className="w-3.5 h-3.5 text-[#C9A961] shrink-0 mt-0.5" />
            <span>
              A Portal Estilo Luxo atua exclusivamente como representante comercial da Unicentro no Brasil. O split distribui o valor instantaneamente na liquidação do Pix.
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
