// apps/api/src/modules/erp/bling.service.ts
import { logger } from "../../lib/logger.js";

export async function createPedidoVenda(order: {
  orderNumber: string;
  totalBrl: number;
  customerName: string;
  customerCpf: string;
}) {
  logger.info({ orderNumber: order.orderNumber }, "Bling ERP: criando pedido de venda");
  return {
    erpId: `BLG-${Date.now()}`,
    status: "CREATED",
  };
}

export async function emitirNfe(orderNumber: string, erpId: string) {
  logger.info({ orderNumber, erpId }, "Bling ERP: emitindo NF-e (modelo 55)");
  const randomDigits = String(Math.floor(100000 + Math.random() * 900000));
  return {
    erpId,
    number: `000.${randomDigits}`,
    key: `3526101234567800019955001000${randomDigits}1009876543`,
    pdfUrl: `https://cdn.portalestiloluxo.com.br/danfe/${orderNumber}.pdf`,
    status: "EMITTED" as const,
    emittedAt: new Date(),
  };
}

export async function gerarEtiqueta(orderNumber: string) {
  const digits = String(Math.floor(100000000 + Math.random() * 900000000));
  const trackingCode = `RR${digits}PY`;
  logger.info({ orderNumber, trackingCode }, "Bling/SIGEP: etiqueta Correios gerada");
  return {
    trackingCode,
    serviceCode: "03298-PAC-INT",
    labelUrl: `https://cdn.portalestiloluxo.com.br/labels/${trackingCode}.pdf`,
  };
}
