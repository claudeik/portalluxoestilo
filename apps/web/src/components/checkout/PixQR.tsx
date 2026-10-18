// apps/web/src/components/checkout/PixQR.tsx
// Mockup 08 do Estudo · Pagamento Pix com Split Regulado Automático
// QR Code nítido, código Copia e Cola, expiração em 30 min e confirmação instantânea

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
      className="bg-white dark:bg-[#14110E] border border-[#B8924A] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl text-center sm:text-left"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-[#C9BFA8] pb-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#8B6B30] font-semibold">
            Pedido {orderNumber}
          </span>
          <h3 className="font-serif text-2xl text-[#0A0A0A] dark:text-[#FAF7F2]">
            Pagar com Pix
          </h3>
        </div>
        <div
          data-testid="pix-countdown"
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold ${
            isExpired
              ? "bg-red-500/10 text-red-600 border border-red-500/30"
              : "bg-[#F0EBE0] text-[#8B6B30] border border-[#B8924A]"
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>{isExpired ? "EXPIRADO" : `Expira em ${mm}:${ss}`}</span>
        </div>
      </div>

      {isExpired ? (
        <div className="text-center py-6 space-y-4">
          <p className="text-xs text-[#8C8275]">
            O QR Code expirou após 30 minutos para garantir a reserva do estoque na Unicentro.
          </p>
          <button
            type="button"
            onClick={onRegenerateQr}
            className="btn-gold"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Gerar Novo QR Code Pix (30 min)</span>
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Imagem do QR Code */}
            <div className="bg-white p-4 rounded-2xl shrink-0 shadow-lg border border-[#C9BFA8]">
              <img
                src={qrCodeUrl}
                alt={`QR Code Pix para o pedido ${orderNumber}`}
                className="w-44 h-44 object-contain"
              />
            </div>

            <div className="flex-1 space-y-4 text-center sm:text-left">
              <div>
                <span className="text-xs text-[#8C8275] block">Valor final do Pix:</span>
                <p className="italic-serif text-4xl font-bold text-[#8B6B30]">
                  {formatBrl(amountBrl)}
                </p>
              </div>

              <p className="text-xs text-[#4A4A4A] leading-relaxed">
                Escaneie o código com o aplicativo do seu banco ou copie a chave Pix abaixo. O split de 4 vias é executado automaticamente pelo Banco Parceiro.
              </p>

              {/* Copia e Cola Box */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 bg-[#F0EBE0] dark:bg-[#1C1814] border border-[#C9BFA8] rounded-xl p-2.5">
                  <input
                    type="text"
                    readOnly
                    value={pixKey}
                    aria-label="Código Pix Copia e Cola"
                    className="bg-transparent text-[11px] font-mono text-[#0A0A0A] dark:text-[#FAF7F2] w-full focus:outline-none truncate"
                  />
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="btn-gold text-[10px] py-1.5 px-3 min-h-[34px] shrink-0"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copiado!" : "Copiar"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Botão de Simulação em 3s */}
          <div className="pt-4 border-t border-[#C9BFA8] flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={onSimulatePaid}
              className="w-full sm:flex-1 btn-gold py-3 text-xs"
            >
              <Zap className="w-4 h-4" />
              <span>Simular Pagamento Bancário em 3s (Aprovar Pix)</span>
            </button>
          </div>
        </>
      )}

      <div className="flex items-center justify-center gap-2 text-[11px] text-[#8C8275]">
        <ShieldCheck className="w-4 h-4 text-[#5B8254]" />
        <span>Pagamento split regulado pelo Banco Central · Certificado Unicentro PY</span>
      </div>
    </div>
  );
}
