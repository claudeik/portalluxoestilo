// apps/api/src/modules/checkout/tax.service.ts
// Mapa de ICMS para as 27 UFs + Remessa Conforme (Imposto Federal 0% até US$ 50 FOB)

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
  SP: 0.17, // Default técnico do Piloto (Product Brief §7)
  TO: 0.20,
};

export function getIcmsRate(state: string = "SP"): number {
  const uf = state.trim().toUpperCase();
  return ICMS_RATES[uf] ?? 0.17;
}

/**
 * Cálculo de ICMS "por dentro" conforme especificação §13.3:
 * icms = subtotalBrl - (subtotalBrl / (1 + icmsRate))
 */
export function calculateIcmsPorDentro(subtotalBrl: number, state: string = "SP"): {
  icmsRate: number;
  icmsBrl: number;
  federalTaxBrl: number;
} {
  const icmsRate = getIcmsRate(state);
  const icmsBrl = Number((subtotalBrl - subtotalBrl / (1 + icmsRate)).toFixed(2));
  return {
    icmsRate,
    icmsBrl,
    federalTaxBrl: 0.0, // Remessa Conforme: 0% II abaixo de US$ 50 FOB
  };
}
