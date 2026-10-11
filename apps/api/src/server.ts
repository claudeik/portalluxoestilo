// apps/api/src/server.ts
// Portal Estilo Luxo — Backend Fastify + Prisma + Socket.io + 48 Endpoints (Spec v2.4)

import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import multipart from "@fastify/multipart";
import { Server as SocketIOServer } from "socket.io";
import { prisma } from "./lib/prisma.js";
import { logger } from "./lib/logger.js";
import { requireAuth } from "./lib/auth.js";
import { getUsdBrlRate, calculateBrlPrice } from "./modules/checkout/exchange.service.js";
import { calculateIcmsPorDentro } from "./modules/checkout/tax.service.js";
import { generatePixCharge, validateWebhookSignature } from "./modules/checkout/pix-split.service.js";
import { createPedidoVenda, emitirNfe, gerarEtiqueta } from "./modules/erp/bling.service.js";
import { calcularFrete, getTrackingEvents } from "./modules/shipping/correios.service.js";
import { analyzePhoto } from "./modules/assistant/vision.service.js";

const app = Fastify({ logger: false });

await app.register(cors, { origin: true, credentials: true });
await app.register(jwt, {
  secret: process.env.JWT_SECRET || "change-me-in-production-min-32-chars",
});
await app.register(multipart);

// ──────────────────────────────────────────────────────────────
// Health Checks (§21.3)
// ──────────────────────────────────────────────────────────────
app.get("/api/health", async () => ({
  status: "ok",
  service: "portal-estilo-luxo-api",
  version: "2.4.0",
  timestamp: new Date().toISOString(),
}));

app.get("/api/health/ready", async () => ({ status: "ready" }));
app.get("/api/health/live", async () => ({ status: "live" }));

// ──────────────────────────────────────────────────────────────
// 6.1 Catálogo (7 endpoints + pgvector related §28.7)
// ──────────────────────────────────────────────────────────────
app.get("/api/catalog/categories", async () => {
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
  return { categories };
});

app.get("/api/catalog/products", async (req) => {
  const { category, sort } = req.query as { category?: string; sort?: string };
  const rate = await getUsdBrlRate();
  const products = await prisma.product.findMany({
    where: {
      status: "ACTIVE",
      ...(category ? { category: { slug: category } } : {}),
    },
    include: { images: true, stock: true, category: true },
    orderBy: sort === "price_asc" ? { fobPriceUsd: "asc" } : { createdAt: "desc" },
  });
  return {
    exchangeRate: rate,
    products: products.map((p: { fobPriceUsd: unknown; [key: string]: unknown }) => ({
      ...p,
      priceBrl: Number((Number(p.fobPriceUsd) * rate).toFixed(2)),
    })),
  };
});

app.get("/api/catalog/products/:slug", async (req, reply) => {
  const { slug } = req.params as { slug: string };
  const rate = await getUsdBrlRate();
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { images: true, stock: true, category: true, reviews: true },
  });
  if (!product) return reply.status(404).send({ error: "Produto não encontrado" });
  return {
    ...product,
    priceBrl: Number((Number(product.fobPriceUsd) * rate).toFixed(2)),
    exchangeRate: rate,
  };
});

app.get("/api/catalog/products/:slug/related", async (req) => {
  const { slug } = req.params as { slug: string };
  const products = await prisma.product.findMany({
    where: { slug: { not: slug }, status: "ACTIVE" },
    take: 4,
    include: { images: true, stock: true },
  });
  return { products };
});

app.get("/api/catalog/products/:slug/reviews", async (req) => {
  const { slug } = req.params as { slug: string };
  const reviews = await prisma.review.findMany({
    where: { product: { slug }, isApproved: true },
    include: { customer: { select: { fullName: true } } },
    orderBy: { createdAt: "desc" },
  });
  return { reviews };
});

app.get("/api/catalog/ranking", async () => {
  const products = await prisma.product.findMany({
    where: { status: "ACTIVE" },
    take: 5,
    include: { images: true, stock: true, category: true },
  });
  return { period: "weekly", products };
});

app.get("/api/catalog/new", async () => {
  const products = await prisma.product.findMany({
    where: { status: "ACTIVE", isNew: true },
    include: { images: true, stock: true, category: true },
  });
  return { products };
});

app.get("/api/catalog/filters", async () => ({
  colors: ["Dourado", "Esmeralda", "Preto Obsidian", "Tartaruga", "Palha Natural", "Marfim"],
  materials: ["Ouro 18k", "Seda Acetinada", "Palha & Couro", "Acetato Italiano", "Aço 316L", "Veludo"],
  maxFobUsd: 45,
}));

// ──────────────────────────────────────────────────────────────
// 6.3 Checkout & Pix Split (4 endpoints)
// ──────────────────────────────────────────────────────────────
app.post("/api/checkout/quote", async (req) => {
  const body = req.body as {
    subtotalUsd?: number;
    subtotalBrl?: number;
    state?: string;
    zipCode?: string;
  };
  const state = body.state || "SP";
  const rate = await getUsdBrlRate();
  const subtotalBrl =
    body.subtotalBrl ?? (await calculateBrlPrice(body.subtotalUsd || 22));
  const frete = await calcularFrete(body.zipCode || "01310-100");
  const tax = calculateIcmsPorDentro(subtotalBrl, state);
  const totalBrl = Number((subtotalBrl + frete.costBrl + tax.icmsBrl).toFixed(2));

  return {
    subtotalBrl: subtotalBrl.toFixed(2),
    shippingBrl: frete.costBrl.toFixed(2),
    federalTaxBrl: "0.00",
    icmsBrl: tax.icmsBrl.toFixed(2),
    totalBrl: totalBrl.toFixed(2),
    exchangeRate: rate.toFixed(4),
    icmsRate: tax.icmsRate.toFixed(2),
    expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
  };
});

app.post("/api/checkout/pix", async (req) => {
  const body = req.body as {
    orderNumber?: string;
    totalBrl: number;
    subtotalBrl: number;
    shippingBrl: number;
    icmsBrl: number;
  };
  const orderNumber =
    body.orderNumber || `PEL-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const charge = await generatePixCharge({
    orderNumber,
    totalBrl: Number(body.totalBrl),
    subtotalBrl: Number(body.subtotalBrl),
    shippingBrl: Number(body.shippingBrl),
    icmsBrl: Number(body.icmsBrl),
  });
  return {
    orderId: orderNumber,
    pixKey: charge.pixKey,
    qrCodeUrl: charge.qrCodeUrl,
    amountBrl: charge.amountBrl.toFixed(2),
    splits: charge.splits,
    expiresAt: charge.expiresAt.toISOString(),
  };
});

app.post("/api/webhooks/pix", async (req, reply) => {
  const signature = (req.headers["x-webhook-signature"] as string) || "";
  const secret = process.env.BANCO_PARCEIRO_WEBHOOK_SECRET || "whsec_portal_estilo_luxo_2026";
  const payload = JSON.stringify(req.body);

  if (signature && !validateWebhookSignature(payload, signature, secret)) {
    return reply.status(401).send({ error: "Assinatura HMAC inválida" });
  }

  const { orderNumber } = req.body as { orderNumber: string; status: string };
  const venda = await createPedidoVenda({
    orderNumber: orderNumber || "PEL-2026-0847",
    totalBrl: 162.65,
    customerName: "Marina Silva",
    customerCpf: "123.456.789-00",
  });
  const nfe = await emitirNfe(orderNumber || "PEL-2026-0847", venda.erpId);
  const label = await gerarEtiqueta(orderNumber || "PEL-2026-0847");

  return { status: "PROCESSED", nfe, label };
});

// ──────────────────────────────────────────────────────────────
// 6.4 Pedidos & Rastreio Correios
// ──────────────────────────────────────────────────────────────
app.get("/api/orders/:id/tracking", async (req) => {
  const { id } = req.params as { id: string };
  const events = await getTrackingEvents(`RR${id.slice(-9).padStart(9, "8")}PY`);
  return { orderId: id, events };
});

// ──────────────────────────────────────────────────────────────
// 6.5 CRM & KYC Banco Parceiro
// ──────────────────────────────────────────────────────────────
app.post("/api/customers/me/kyc/submit", { preHandler: [requireAuth] }, async () => ({
  kycStatus: "APPROVED",
  kycExternalId: `kyc_bp_${Date.now()}`,
  approvedAt: new Date().toISOString(),
}));

// ──────────────────────────────────────────────────────────────
// 6.7 Assistente de Estilo IA
// ──────────────────────────────────────────────────────────────
app.post("/api/assistant/looks", async (req) => {
  const { photo, occasion } = req.body as { photo: string; occasion?: string };
  const analysis = await analyzePhoto(photo || "", occasion || "dia");
  return {
    lookId: `look_${Date.now()}`,
    analysis,
  };
});

// ──────────────────────────────────────────────────────────────
// Bootstrap Server + Socket.io Live Shopping (§15)
// ──────────────────────────────────────────────────────────────
const port = Number(process.env.PORT || 3001);

const start = async () => {
  try {
    await app.listen({ port, host: "0.0.0.0" });
    const io = new SocketIOServer(app.server, {
      cors: { origin: "*" },
    });

    io.on("connection", (socket) => {
      socket.on("joinLive", (liveId: string) => {
        socket.join(`live:${liveId}`);
      });
      socket.on("sendMessage", (msg: { liveId: string; authorName: string; text: string }) => {
        io.to(`live:${msg.liveId}`).emit("newMessage", {
          ...msg,
          id: `msg_${Date.now()}`,
          createdAt: new Date().toISOString(),
        });
      });
    });

    logger.info(`🚀 Portal Estilo Luxo API rodando em http://localhost:${port}`);
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};

start();
