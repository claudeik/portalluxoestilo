// apps/web/src/components/checkout/PixQR.tsx
import React, { useEffect, useState } from "react";
import { Copy, Check, Clock, RefreshCw, ShieldCheck, Zap } from "lucide-react";
import { formatBrl } from "../../lib/format";

interface PixQRProps {
  orderNumber: string;
  pixKey: string;
  qrCodeUrl: string;
  amountBrl: number;
  expiresAt: string;
  onSimulatePaid: () => void;
  onRegenerateQr: () => void;
}

export function PixQR({
  orderNumber,
  pixKey,
  qrCodeUrl,
  amountBrl,
  expiresAt,
  onSimulatePaid,
  onRegenerateQr,
}: PixQRProps) {
  const [copied, setCopied] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number>(() => {
    const diff = Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000);
    return Math.max(0, diff);
  });

  useEffect(() => {
    const diff = Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000);
    setSecondsLeft(Math.max(0, diff));
  }, [expiresAt]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");
  const isExpired = secondsLeft <= 0;

  const handleCopy = () => {
    navigator.clipboard?.writeText(pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      data-testid="pix-qr-container"
      className="bg-[#141210] border border-[#C9A961]/50 rounded-2xl p-5 space-y-5"
    >
      <div className="flex items-center justify-between border-b border-[#2A2520] pb-3">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#C9A961] font-semibold">
            Pedido {orderNumber}
          </span>
          <h3 className="font-serif text-xl text-[#F5EFE6]">Pagamento Pix com Split Regulado</h3>
        </div>
        <div
          data-testid="pix-countdown"
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold ${
            isExpired
              ? "bg-red-500/20 text-red-400 border border-red-500/40"
              : "bg-[#C9A961]/15 text-[#C9A961] border border-[#C9A961]/40"
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>{isExpired ? "EXPIRADO" : `${mm}:${ss}`}</span>
        </div>
      </div>

      {isExpired ? (
        <div className="text-center py-6 space-y-4">
          <p className="text-sm text-[#A89F91]">
            O QR Code Pix expirou após 15 minutos para liberar a reserva de estoque. Gere um novo código com a cotação atualizada:
          </p>
          <button
            type="button"
            onClick={onRegenerateQr}
            data-testid="regenerate-pix-btn"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#C9A961] text-[#0A0908] font-semibold text-sm hover:bg-[#DFC484] transition"
          >
            <RefreshCw className="w-4 h-4" />
            Gerar Novo QR Code Pix (15 min)
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="bg-white p-3 rounded-2xl shrink-0 shadow-xl">
              <img
                src={qrCodeUrl}
                alt={`QR Code Pix para o pedido ${orderNumber}`}
                className="w-44 h-44 object-contain"
              />
            </div>

            <div className="flex-1 space-y-3 text-center sm:text-left">
              <div>
                <span className="text-xs text-[#A89F91]">Valor exato a pagar:</span>
                <p className="font-serif text-3xl font-bold text-[#C9A961]">
                  {formatBrl(amountBrl)}
                </p>
              </div>

              <p className="text-xs text-[#A89F91] leading-relaxed">
                Abra o app do seu banco, escolha <strong>Pix Copia e Cola</strong> ou aponte a câmera. A confirmação via webhook e emissão da NF-e ocorrem em até 5 segundos.
              </p>

              {/* Copia e Cola Box */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 bg-[#0A0908] border border-[#2A2520] rounded-xl p-2">
                  <input
                    type="text"
                    readOnly
                    value={pixKey}
                    aria-label="Código Pix Copia e Cola"
                    className="bg-transparent text-[11px] font-mono text-[#A89F91] w-full focus:outline-none truncate"
                  />
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C9A961] text-[#0A0908] font-semibold text-xs shrink-0 hover:bg-[#DFC484] transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copiado!" : "Copiar"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Simulator Controls for Demo & E2E */}
          <div className="pt-4 border-t border-[#2A2520] flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={onSimulatePaid}
              data-testid="simulate-pix-paid-btn"
              className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#0A0908] font-bold text-sm shadow-lg transition"
            >
              <Zap className="w-4 h-4" />
              Simular Pagamento Pix Confirmado (Webhook Banco Parceiro)
            </button>

            <button
              type="button"
              onClick={() => setSecondsLeft(0)}
              className="text-xs text-[#A89F91] hover:text-[#F5EFE6] underline"
            >
              Testar expiração (15 min)
            </button>
          </div>
        </>
      )}

      <div className="flex items-center justify-center gap-2 text-[11px] text-[#A89F91]">
        <ShieldCheck className="w-4 h-4 text-[#C9A961]" />
        <span>Split regulado pelo Banco Central · Assinatura HMAC SHA-256 verificada</span>
      </div>
    </div>
  );
}
