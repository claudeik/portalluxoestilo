// apps/web/src/lib/format.ts
// Utilitários de moeda (BRL/USD), CPF, CEP, ICMS "por dentro" e Pix Split (Volume I · Pitch Editorial)

import { CheckoutQuote } from "@portal/types";

export const ICMS_RATES: Record<string, number> = {
  AC: 0.19,
  AL: 0.19,
  AM: 0.20,
  AP: 0.18,
  BA: 0.205,
  CE: 0.20,
  DF: 0.20,
  ES: 0.17,
  GO: 0.19,
  MA: 0.22,
  MG: 0.18,
  MS: 0.17,
  MT: 0.17,
  PA: 0.19,
  PB: 0.20,
  PE: 0.205,
  PI: 0.21,
  PR: 0.195,
  RJ: 0.20,
  RN: 0.18,
  RO: 0.195,
  RR: 0.20,
  RS: 0.17,
  SC: 0.17,
  SE: 0.19,
  SP: 0.17, // Alíquota de referência do estudo
  TO: 0.20,
};

export function formatBrl(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatUsd(value: number): string {
  return `US$ ${value.toFixed(2)}`;
}

export function calculateBrlFromFob(fobUsd: number, ptaxRate: number = 5.0): number {
  return Number((fobUsd * ptaxRate).toFixed(2));
}

export function calculateQuote(params: {
  subtotalBrl: number;
  state: string;
  zipCode?: string;
  exchangeRate?: number;
}): CheckoutQuote {
  const state = (params.state || "SP").toUpperCase();
  const icmsRate = ICMS_RATES[state] ?? 0.17;
  const exchangeRate = params.exchangeRate ?? 5.0;

  // Regra de frete Correios PAC Internacional / Remessa Conforme
  const shippingBrl = params.subtotalBrl === 0 ? 0 : 25.0;

  // Fórmula oficial ICMS "por dentro" sobre (mercadoria + frete)
  // Exemplo do pitch: (110 + 25) / (1 - 0.17) - 135 = R$ 27,65
  const baseComFrete = params.subtotalBrl + shippingBrl;
  const icmsBrl =
    params.subtotalBrl === 0
      ? 0
      : Number((baseComFrete / (1 - icmsRate) - baseComFrete).toFixed(2));

  // Imposto de Importação Federal = R$ 0,00 (Remessa Conforme certificada Unicentro < US$ 50 FOB)
  const federalTaxBrl = 0.0;
  const totalBrl = Number((baseComFrete + icmsBrl + federalTaxBrl).toFixed(2));

  // Split Pix regulado pelo Banco Parceiro (Capítulo 14 do Pitch Editorial):
  // 1. Portal Estilo Luxo: 20% comissão (sobre valor da mercadoria = R$ 22,00 para R$ 110)
  // 2. Unicentro PY: ~71% mercadoria + margem FOB via câmbio regulado
  // 3. Epyx: ~5% plataforma e-commerce
  // 4. Tributos: ICMS estadual
  const portalBrl = Number((params.subtotalBrl * 0.20).toFixed(2));
  const epyxBrl = Number((totalBrl * 0.05).toFixed(2));
  const taxBrl = icmsBrl;
  const unicentroBrl = Number(Math.max(0, totalBrl - portalBrl - epyxBrl - taxBrl).toFixed(2));

  return {
    subtotalBrl: Number(params.subtotalBrl.toFixed(2)),
    shippingBrl,
    federalTaxBrl,
    icmsBrl,
    totalBrl,
    exchangeRate,
    icmsRate,
    state,
    splits: {
      portalBrl,
      unicentroBrl,
      epyxBrl,
      taxBrl,
    },
    expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
  };
}

export function formatCpf(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function isValidCpf(cpf: string): boolean {
  const clean = cpf.replace(/\D/g, "");
  if (clean.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(clean)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(clean.charAt(i), 10) * (10 - i);
  }
  let rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(clean.charAt(9), 10)) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(clean.charAt(i), 10) * (11 - i);
  }
  rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  return rev === parseInt(clean.charAt(10), 10);
}

export function formatCep(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  return digits.replace(/(\d{5})(\d)/, "$1-$2");
}

export async function lookupCep(cep: string): Promise<{
  street: string;
  district: string;
  city: string;
  state: string;
} | null> {
  const clean = cep.replace(/\D/g, "");
  if (clean.length !== 8) return null;

  const fallbackMap: Record<string, { street: string; district: string; city: string; state: string }> = {
    "05416010": { street: "Rua Aspicuelta", district: "Pinheiros", city: "São Paulo", state: "SP" },
    "01414001": { street: "Rua Oscar Freire", district: "Jardins", city: "São Paulo", state: "SP" },
    "90570020": { street: "Rua Padre Chagas", district: "Moinhos de Vento", city: "Porto Alegre", state: "RS" },
    "51020000": { street: "Avenida Boa Viagem", district: "Boa Viagem", city: "Recife", state: "PE" },
  };
  if (fallbackMap[clean]) return fallbackMap[clean];

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 480);
    const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (res.ok) {
      const data = await res.json();
      if (!data.erro) {
        return {
          street: data.logradouro || "Rua Aspicuelta",
          district: data.bairro || "Pinheiros",
          city: data.localidade || "São Paulo",
          state: data.uf || "SP",
        };
      }
    }
  } catch {
    // fallback
  }

  return { street: "Rua Aspicuelta", district: "Pinheiros", city: "São Paulo", state: "SP" };
}
