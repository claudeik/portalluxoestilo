// apps/api/src/modules/checkout/pix-split.service.ts
import crypto from "node:crypto";

export interface PixSplitInput {
  orderNumber: string;
  totalBrl: number;
  subtotalBrl: number;
  shippingBrl: number;
  icmsBrl: number;
}

export interface PixChargeResult {
  externalId: string;
  splitId: string;
  pixKey: string;
  qrCodeUrl: string;
  amountBrl: number;
  expiresAt: Date;
  splits: {
    portalBrl: number;
    unicentroBrl: number;
    epyxBrl: number;
    taxBrl: number;
  };
}

export function computeRegulatedSplit(input: {
  totalBrl: number;
  icmsBrl: number;
}) {
  const portalBrl = Number((input.totalBrl * 0.20).toFixed(2));
  const epyxBrl = Number((input.totalBrl * 0.05).toFixed(2));
  const taxBrl = Number(input.icmsBrl.toFixed(2));
  const unicentroBrl = Number(
    (input.totalBrl - portalBrl - epyxBrl - taxBrl).toFixed(2)
  );

  return {
    portalBrl,
    unicentroBrl,
    epyxBrl,
    taxBrl,
  };
}

export async function generatePixCharge(
  input: PixSplitInput
): Promise<PixChargeResult> {
  const splits = computeRegulatedSplit({
    totalBrl: input.totalBrl,
    icmsBrl: input.icmsBrl,
  });

  const externalId = `chg_${crypto.randomBytes(8).toString("hex")}`;
  const splitId = `spl_${crypto.randomBytes(6).toString("hex")}`;
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min

  const pixKey = `00020126580014BR.GOV.BCB.PIX0136portal-estilo-luxo-${input.orderNumber.toLowerCase()}520400005303986540${input.totalBrl.toFixed(
    2
  )}5802BR5920PORTAL ESTILO LUXO6009SAO PAULO62070503***6304ABCD`;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(
    pixKey
  )}`;

  return {
    externalId,
    splitId,
    pixKey,
    qrCodeUrl,
    amountBrl: input.totalBrl,
    expiresAt,
    splits,
  };
}

export function validateWebhookSignature(
  payload: Buffer | string,
  signature: string,
  secret: string
): boolean {
  const raw = typeof payload === "string" ? Buffer.from(payload, "utf8") : payload;
  const expected = crypto.createHmac("sha256", secret).update(raw).digest("hex");
  const expectedBuf = Buffer.from(expected, "hex");
  const sigBuf = Buffer.from(signature || "", "hex");
  if (expectedBuf.length !== sigBuf.length) {
    return false;
  }
  return crypto.timingSafeEqual(expectedBuf, sigBuf);
}
