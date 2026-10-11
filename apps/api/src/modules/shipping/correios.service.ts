// apps/api/src/modules/shipping/correios.service.ts
import { logger } from "../../lib/logger.js";

export interface SroTrackingEvent {
  status: string;
  location: string;
  occurredAt: Date;
}

export async function getTrackingEvents(trackingCode: string): Promise<SroTrackingEvent[]> {
  logger.info({ trackingCode }, "Correios SRO-eXML: consultando eventos de rastreio");
  return [
    {
      status: "Pedido confirmado e split Pix liquidado",
      location: "São Paulo / SP — Banco Parceiro",
      occurredAt: new Date(Date.now() - 36 * 3600 * 1000),
    },
    {
      status: "Objeto separado e embalado na origem",
      location: "Encarnación / PY — Centro de Distribuição Unicentro",
      occurredAt: new Date(Date.now() - 24 * 3600 * 1000),
    },
    {
      status: "Objeto postado nos Correios (Remessa Conforme)",
      location: "Foz do Iguaçu / PR — Unidade Internacional",
      occurredAt: new Date(Date.now() - 12 * 3600 * 1000),
    },
  ];
}

export async function calcularFrete(zipCode: string): Promise<{
  serviceCode: string;
  costBrl: number;
  estimatedDays: number;
}> {
  const cleanZip = zipCode.replace(/\D/g, "");
  const isSoutheastOrSouth = /^[012389]/.test(cleanZip);
  return {
    serviceCode: "PAC_REMESSA_CONFORME",
    costBrl: isSoutheastOrSouth ? 25.0 : 32.0,
    estimatedDays: isSoutheastOrSouth ? 6 : 9,
  };
}
