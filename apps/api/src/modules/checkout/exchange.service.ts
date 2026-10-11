// apps/api/src/modules/checkout/exchange.service.ts
import axios from "axios";
import { redis } from "../../lib/redis.js";
import { logger } from "../../lib/logger.js";

const DEFAULT_PTAX_RATE = 5.0; // US$ 1 = R$ 5,00 (0% spread)

export async function getUsdBrlRate(): Promise<number> {
  try {
    const cached = await redis.get("cache:usd_brl");
    if (cached) {
      return parseFloat(cached);
    }
  } catch {
    // Redis offline fallback
  }

  try {
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const yyyy = today.getFullYear();
    const baseUrl =
      process.env.BCB_PTAX_URL ||
      "https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata";
    const url = `${baseUrl}/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao='${mm}-${dd}-${yyyy}'&$format=json`;

    const { data } = await axios.get(url, { timeout: 3500 });
    const rate = data?.value?.[0]?.cotacaoVenda;
    if (rate && typeof rate === "number") {
      try {
        await redis.set("cache:usd_brl", rate.toFixed(4), "EX", 86400);
      } catch {
        // Ignore Redis write error
      }
      return rate;
    }
  } catch (err) {
    logger.warn({ err }, "PTAX BCB fallback ativado (usando taxa padrão 5.0000)");
  }

  return DEFAULT_PTAX_RATE;
}

export async function calculateBrlPrice(fobPriceUsd: number): Promise<number> {
  const rate = await getUsdBrlRate();
  return Number((fobPriceUsd * rate).toFixed(2));
}
