// apps/web/src/stores/app.store.ts
// Estado global persistente (Zustand) cobrindo as 3 Jornadas e os 10 Fluxos do Portal Estilo Luxo

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Customer, Order, Product } from "@portal/types";
import { CATEGORIES, INITIAL_PRODUCTS, INITIAL_REVIEWS, ProductReviewItem } from "../data/catalog.data";
import { calculateBrlFromFob, calculateQuote } from "../lib/format";

export interface CartEntry {
  productId: string;
  quantity: number;
  addedAt: string;
}

export interface GeneratedLookCombo {
  id: string;
  rank: 1 | 2 | 3;
  title: string;
  subtitle: string;
  isBestCombo: boolean;
  matchScore: number;
  items: Product[];
  totalBrl: number;
}

export interface AiLookSession {
  id: string;
  createdAt: string;
  occasion: "dia" | "noite" | "trabalho" | "festa" | "praia";
  photoPreviewUrl: string;
  photoTags: string[];
  latencyMs: number;
  usedManualFallback: boolean;
  regenerateCount: number;
  looks: GeneratedLookCombo[];
}

export interface SharedLookItem {
  id: string;
  product: Product;
  unitPriceBrl: number;
  contributedByName?: string;
  contributedByEmail?: string;
  contributedAt?: string;
}

export interface SharedLookCart {
  id: string;
  token: string;
  ownerName: string;
  title: string;
  message: string;
  status: "OPEN" | "COMPLETED" | "EXPIRED" | "CANCELED";
  expiresAt: string;
  createdAt: string;
  invitedEmails: string[];
  items: SharedLookItem[];
}

export interface AppAlert {
  id: string;
  type: "PRICE_DROP" | "LOW_STOCK" | "TRACKING" | "LIVE";
  title: string;
  description: string;
  productSlug?: string;
  orderId?: string;
  createdAt: string;
  read: boolean;
}

export interface LiveChatMessage {
  id: string;
  authorName: string;
  text: string;
  isHost: boolean;
  createdAt: string;
}

interface PortalAppState {
  // Catálogo e Câmbio
  products: Product[];
  reviews: ProductReviewItem[];
  ptaxRate: number;
  selectedState: string;
  selectedZipCode: string;

  // Cliente & Auth (Marina / Bia / Guest)
  customer: Customer | null;
  savedCartUntil?: string;

  // Carrinho
  cart: CartEntry[];

  // Pedidos
  orders: Order[];

  // Wishlist & Alertas
  wishlistIds: string[];
  alerts: AppAlert[];

  // Assistente IA
  aiSessions: AiLookSession[];
  activeAiSessionId: string | null;

  // Presente Compartilhado (Jornada 3)
  sharedCarts: SharedLookCart[];

  // Live Shopping (Fluxo 10)
  liveFeaturedProductId: string;
  liveViewerCount: number;
  liveMessages: LiveChatMessage[];
  liveReminderSet: boolean;

  // Toast notification
  toastMessage: string | null;

  // Actions
  setToast: (msg: string | null) => void;
  setSelectedState: (uf: string, zipCode?: string) => void;
  addToCart: (productId: string, qty?: number) => void;
  updateCartQty: (productId: string, qty: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  saveCartFallback24h: () => void;

  // Auth & KYC
  loginAsMarina: () => void;
  logoutCustomer: () => void;
  registerCustomerWithKyc: (data: {
    fullName: string;
    email: string;
    phone: string;
    cpf: string;
    zipCode: string;
    street: string;
    number: string;
    complement?: string;
    district: string;
    city: string;
    state: string;
    partnerBank: "STONE" | "CELCOIN" | "INTER";
  }) => void;

  // Checkout & Orders
  createOrderFromCart: () => Order | null;
  confirmPixPayment: (orderId: string) => void;
  regeneratePixQr: (orderId: string) => void;
  advanceOrderTracking: (orderId: string) => void;
  submitOrderReview: (params: {
    orderId: string;
    productId: string;
    rating: number;
    title: string;
    body: string;
    tags: string[];
  }) => void;

  // Wishlist
  toggleWishlist: (productId: string) => void;
  markAlertRead: (alertId: string) => void;

  // Assistente IA
  generateAiLooks: (params: {
    photoPreviewUrl: string;
    occasion: "dia" | "noite" | "trabalho" | "festa" | "praia";
    forceFallback?: boolean;
  }) => AiLookSession;
  regenerateAiLooks: (sessionId: string) => void;
  buyEntireLook: (look: GeneratedLookCombo) => void;

  // Presente Compartilhado
  createSharedCart: (params: {
    title: string;
    message: string;
    productIds: string[];
    invitedEmails: string[];
  }) => SharedLookCart;
  contributeToSharedItem: (params: {
    token: string;
    itemId: string;
    friendName: string;
    friendEmail: string;
    friendCpf: string;
  }) => void;
  completeRemainingSharedCartByOwner: (token: string) => void;

  // Live Shopping
  setLiveFeaturedProduct: (productId: string) => void;
  sendLiveChatMessage: (authorName: string, text: string, isHost?: boolean) => void;
  toggleLiveReminder: () => void;
}

const DEFAULT_MARINA: Customer = {
  id: "cust-marina-01",
  fullName: "Marina Albuquerque",
  email: "marina.albuquerque@gmail.com",
  phone: "(11) 99412-8830",
  cpf: "384.920.118-44",
  kycStatus: "APPROVED",
  kycExternalId: "kyc_celcoin_994812",
  kycApprovedAt: "2026-10-10T14:20:00Z",
  addresses: [
    {
      id: "addr-01",
      customerId: "cust-marina-01",
      label: "Casa · Jardins",
      zipCode: "01414-001",
      street: "Rua Oscar Freire",
      number: "1120",
      complement: "Apto 82",
      district: "Jardins",
      city: "São Paulo",
      state: "SP",
      isDefault: true,
    },
  ],
};

const INITIAL_ORDERS: Order[] = [
  {
    id: "PEL-2026-0842",
    orderNumber: "PEL-2026-0842",
    customerId: "cust-marina-01",
    items: [
      {
        id: "oi-01",
        productId: "prod-001",
        product: INITIAL_PRODUCTS[0],
        quantity: 1,
        unitPriceBrl: 90.0,
        totalBrl: 90.0,
      },
      {
        id: "oi-02",
        productId: "prod-002",
        product: INITIAL_PRODUCTS[1],
        quantity: 1,
        unitPriceBrl: 110.0,
        totalBrl: 110.0,
      },
    ],
    subtotalBrl: 200.0,
    shippingBrl: 25.0,
    federalTaxBrl: 0.0,
    icmsBrl: 29.06,
    totalBrl: 254.06,
    exchangeRate: 5.0,
    icmsState: "SP",
    status: "SHIPPED",
    trackingCode: "RR482910384PY",
    trackingStep: 2, // Em trânsito Correios
    invoiceNumber: "000.418920",
    invoiceKey: "35261012345678000199550010004189201009876543",
    createdAt: "2026-10-09T18:15:00Z",
    paidAt: "2026-10-09T18:17:12Z",
    trackingEvents: [
      {
        id: "trk-1",
        status: "Pedido confirmado · Split Pix liquidado",
        description: "Comissão Portal (20%), repasse Unicentro e ICMS liquidados via Banco Parceiro.",
        location: "São Paulo / SP",
        occurredAt: "09/10 · 18:17",
        stepIndex: 0,
      },
      {
        id: "trk-2",
        status: "Separado e NF-e emitida (Bling ERP)",
        description: "DANFE 000.418920 emitido e pacote conferido pela curadoria.",
        location: "Encarnación / PY — Centro Unicentro",
        occurredAt: "10/10 · 09:40",
        stepIndex: 1,
      },
      {
        id: "trk-3",
        status: "Objeto postado e em trânsito nos Correios",
        description: "Despacho internacional via Remessa Conforme (Imposto Federal R$ 0,00).",
        location: "Foz do Iguaçu / PR → São Paulo / SP",
        occurredAt: "11/10 · 11:20",
        stepIndex: 2,
      },
    ],
  },
  {
    id: "PEL-2026-0791",
    orderNumber: "PEL-2026-0791",
    customerId: "cust-marina-01",
    items: [
      {
        id: "oi-03",
        productId: "prod-003",
        product: INITIAL_PRODUCTS[2],
        quantity: 1,
        unitPriceBrl: 210.0,
        totalBrl: 210.0,
      },
    ],
    subtotalBrl: 210.0,
    shippingBrl: 25.0,
    federalTaxBrl: 0.0,
    icmsBrl: 30.51,
    totalBrl: 265.51,
    exchangeRate: 5.0,
    icmsState: "SP",
    status: "DELIVERED",
    trackingCode: "RR319044812PY",
    trackingStep: 4, // Entregue
    invoiceNumber: "000.391044",
    invoiceKey: "35261012345678000199550010003910441009876543",
    createdAt: "2026-10-01T14:00:00Z",
    paidAt: "2026-10-01T14:02:00Z",
    deliveredAt: "2026-10-07T16:45:00Z",
    reviewed: false,
    trackingEvents: [
      {
        id: "trk-d1",
        status: "Pedido confirmado · Split Pix liquidado",
        description: "Split processado pelo Banco Parceiro.",
        location: "São Paulo / SP",
        occurredAt: "01/10 · 14:02",
        stepIndex: 0,
      },
      {
        id: "trk-d2",
        status: "Separado na Unicentro",
        description: "Embalagem de luxo concluída.",
        location: "Encarnación / PY",
        occurredAt: "02/10 · 10:15",
        stepIndex: 1,
      },
      {
        id: "trk-d3",
        status: "Postado nos Correios",
        description: "Objeto encaminhado para o Brasil.",
        location: "Foz do Iguaçu / PR",
        occurredAt: "03/10 · 15:00",
        stepIndex: 2,
      },
      {
        id: "trk-d4",
        status: "Fiscalização Aduaneira Concluída",
        description: "Liberado sem tributação adicional (Remessa Conforme).",
        location: "Curitiba / PR — Receita Federal",
        occurredAt: "05/10 · 08:30",
        stepIndex: 3,
      },
      {
        id: "trk-d5",
        status: "Objeto entregue à destinatária",
        description: "Entregue na portaria em Rua Oscar Freire, 1120.",
        location: "São Paulo / SP",
        occurredAt: "07/10 · 16:45",
        stepIndex: 4,
      },
    ],
  },
];

const INITIAL_SHARED_CARTS: SharedLookCart[] = [
  {
    id: "sc-001",
    token: "aniversario-marina-2026",
    ownerName: "Marina Albuquerque",
    title: "Look de Aniversário da Marina ✨",
    message:
      "Meninas! Montei meu look dos sonhos na Portal Estilo Luxo. Cada peça já está com preço final em Reais sem surpresa de imposto! Escolha uma peça para presentear comigo 💛",
    status: "OPEN",
    createdAt: "2026-10-10T12:00:00Z",
    expiresAt: new Date(Date.now() + 6 * 24 * 3600 * 1000).toISOString(),
    invitedEmails: ["bia.costa@gmail.com", "camila.rocha@gmail.com", "julia.mendes@gmail.com"],
    items: [
      {
        id: "sci-1",
        product: INITIAL_PRODUCTS[0], // Brinco R$ 90
        unitPriceBrl: 90.0,
        contributedByName: "Camila Rocha",
        contributedByEmail: "camila.rocha@gmail.com",
        contributedAt: "Ontem às 19:40",
      },
      {
        id: "sci-2",
        product: INITIAL_PRODUCTS[1], // Lenço R$ 110
        unitPriceBrl: 110.0,
      },
      {
        id: "sci-3",
        product: INITIAL_PRODUCTS[3], // Óculos R$ 170
        unitPriceBrl: 170.0,
      },
    ],
  },
];

const INITIAL_ALERTS: AppAlert[] = [
  {
    id: "alt-1",
    type: "LOW_STOCK",
    title: "Últimas 3 unidades na Unicentro!",
    description: "A Bolsa Palha Trançada Encarnación da sua lista de desejos tem apenas 3 unidades restantes.",
    productSlug: "bolsa-palha-trancada-encarnacion",
    createdAt: "Há 25 min",
    read: false,
  },
  {
    id: "alt-2",
    type: "PRICE_DROP",
    title: "Queda de preço ≥ 12% no câmbio + curadoria",
    description: "O Relógio Minimal Petite Gold baixou de R$ 250,00 para R$ 220,00 na cotação de hoje.",
    productSlug: "relogio-minimal-petite-gold",
    createdAt: "Há 2 horas",
    read: false,
  },
  {
    id: "alt-3",
    type: "TRACKING",
    title: "Seu pacote RR482910384PY avançou!",
    description: "Objeto despachado via Remessa Conforme rumo a São Paulo/SP.",
    orderId: "PEL-2026-0842",
    createdAt: "Hoje · 11:20",
    read: false,
  },
  {
    id: "alt-4",
    type: "LIVE",
    title: "Quinta Luxo ao Vivo com Marina Ferraz",
    description: "Transmissão direto de Encarnación mostrando combinações com lenços de seda e ouro 18k.",
    createdAt: "Agora ao vivo",
    read: true,
  },
];

const INITIAL_LIVE_MESSAGES: LiveChatMessage[] = [
  {
    id: "lm-1",
    authorName: "Marina Ferraz · Curadora",
    text: "Bem-vindas à nossa Quinta Luxo direto da Unicentro! Hoje todas as peças destacadas têm Imposto Federal R$ 0,00 no Remessa Conforme ✨",
    isHost: true,
    createdAt: "19:01",
  },
  {
    id: "lm-2",
    authorName: "Patrícia M. (SP)",
    text: "Esse Brinco Gota Dourado pesa na orelha, Marina?",
    isHost: false,
    createdAt: "19:02",
  },
  {
    id: "lm-3",
    authorName: "Marina Ferraz · Curadora",
    text: "Zero peso, Pati! Ele tem estrutura oca italiana de apenas 18g o par e banho de 3 milésimos de ouro 18k.",
    isHost: true,
    createdAt: "19:02",
  },
  {
    id: "lm-4",
    authorName: "Bia C. (RJ)",
    text: "Acabei de garantir o Lenço Riviera Esmeralda pelo Pix Split, aprovou em 3 segundos!",
    isHost: false,
    createdAt: "19:04",
  },
];

export const usePortalStore = create<PortalAppState>()(
  persist(
    (set, get) => ({
      products: INITIAL_PRODUCTS,
      reviews: INITIAL_REVIEWS,
      ptaxRate: 5.0,
      selectedState: "SP",
      selectedZipCode: "01414-001",
      customer: DEFAULT_MARINA,
      cart: [
        {
          productId: "prod-001",
          quantity: 1,
          addedAt: new Date().toISOString(),
        },
      ],
      orders: INITIAL_ORDERS,
      wishlistIds: ["prod-001", "prod-003", "prod-006"],
      alerts: INITIAL_ALERTS,
      aiSessions: [],
      activeAiSessionId: null,
      sharedCarts: INITIAL_SHARED_CARTS,
      liveFeaturedProductId: "prod-001",
      liveViewerCount: 642,
      liveMessages: INITIAL_LIVE_MESSAGES,
      liveReminderSet: false,
      toastMessage: null,

      setToast: (msg) => {
        set({ toastMessage: msg });
        if (msg) {
          setTimeout(() => {
            if (get().toastMessage === msg) {
              set({ toastMessage: null });
            }
          }, 3500);
        }
      },

      setSelectedState: (uf, zipCode) => {
        set({
          selectedState: uf.toUpperCase(),
          ...(zipCode ? { selectedZipCode: zipCode } : {}),
        });
      },

      addToCart: (productId, qty = 1) => {
        const product = get().products.find((p) => p.id === productId);
        if (!product) return;
        if (product.stock.quantity <= 0 || product.status === "OUT_OF_STOCK") {
          get().setToast("Este item está esgotado na Unicentro. Veja similares abaixo!");
          return;
        }
        const existing = get().cart.find((c) => c.productId === productId);
        const newQty = (existing?.quantity || 0) + qty;
        if (newQty > product.stock.quantity) {
          get().setToast(`Apenas ${product.stock.quantity} unidades disponíveis em estoque.`);
          return;
        }
        if (existing) {
          set({
            cart: get().cart.map((c) =>
              c.productId === productId ? { ...c, quantity: newQty } : c
            ),
          });
        } else {
          set({
            cart: [
              ...get().cart,
              { productId, quantity: qty, addedAt: new Date().toISOString() },
            ],
          });
        }
        get().setToast(`"${product.name}" adicionado à sacola!`);
      },

      updateCartQty: (productId, qty) => {
        if (qty <= 0) {
          get().removeFromCart(productId);
          return;
        }
        const product = get().products.find((p) => p.id === productId);
        if (product && qty > product.stock.quantity) {
          get().setToast(`Estoque máximo na Unicentro: ${product.stock.quantity} un.`);
          return;
        }
        set({
          cart: get().cart.map((c) =>
            c.productId === productId ? { ...c, quantity: qty } : c
          ),
        });
      },

      removeFromCart: (productId) => {
        set({ cart: get().cart.filter((c) => c.productId !== productId) });
      },

      clearCart: () => set({ cart: [] }),

      saveCartFallback24h: () => {
        const until = new Date(Date.now() + 24 * 3600 * 1000).toISOString();
        set({ savedCartUntil: until });
        get().setToast("Sacola salva com preço garantido por 24 horas! Você pode retomar o cadastro quando quiser.");
      },

      loginAsMarina: () => {
        set({ customer: DEFAULT_MARINA });
        get().setToast("Bem-vinda de volta, Marina! KYC aprovado no Banco Parceiro.");
      },

      logoutCustomer: () => {
        set({ customer: null });
        get().setToast("Sessão encerrada (modo visitante ativo).");
      },

      registerCustomerWithKyc: (data) => {
        const newCustomer: Customer = {
          id: `cust-${Date.now()}`,
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          cpf: data.cpf,
          kycStatus: "APPROVED",
          kycExternalId: `kyc_${data.partnerBank.toLowerCase()}_${Math.floor(100000 + Math.random() * 900000)}`,
          kycApprovedAt: new Date().toISOString(),
          addresses: [
            {
              id: `addr-${Date.now()}`,
              customerId: `cust-${Date.now()}`,
              label: "Principal",
              zipCode: data.zipCode,
              street: data.street,
              number: data.number,
              complement: data.complement,
              district: data.district,
              city: data.city,
              state: data.state.toUpperCase(),
              isDefault: true,
            },
          ],
        };
        set({
          customer: newCustomer,
          selectedState: data.state.toUpperCase(),
          selectedZipCode: data.zipCode,
        });
      },

      createOrderFromCart: () => {
        const state = get();
        if (state.cart.length === 0) return null;

        const orderItems = state.cart
          .map((entry) => {
            const product = state.products.find((p) => p.id === entry.productId);
            if (!product) return null;
            const unitPriceBrl = calculateBrlFromFob(product.fobPriceUsd, state.ptaxRate);
            return {
              id: `oi-${Date.now()}-${product.id}`,
              productId: product.id,
              product,
              quantity: entry.quantity,
              unitPriceBrl,
              totalBrl: Number((unitPriceBrl * entry.quantity).toFixed(2)),
            };
          })
          .filter((Boolean as unknown) as <T>(x: T | null) => x is T);

        const subtotalBrl = orderItems.reduce((acc, i) => acc + i.totalBrl, 0);
        const quote = calculateQuote({
          subtotalBrl,
          state: state.selectedState,
          zipCode: state.selectedZipCode,
          exchangeRate: state.ptaxRate,
        });

        const orderNumber = `PEL-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        const trackingDigits = Math.floor(100000000 + Math.random() * 900000000);
        const trackingCode = `RR${trackingDigits}PY`;
        const pixKey = `00020126580014BR.GOV.BCB.PIX0136portal-estilo-luxo-${orderNumber.toLowerCase()}520400005303986540${quote.totalBrl.toFixed(
          2
        )}5802BR5920PORTAL ESTILO LUXO6009SAO PAULO62070503***6304E1A9`;

        const newOrder: Order = {
          id: orderNumber,
          orderNumber,
          customerId: state.customer?.id || "guest",
          items: orderItems,
          subtotalBrl: quote.subtotalBrl,
          shippingBrl: quote.shippingBrl,
          federalTaxBrl: 0.0,
          icmsBrl: quote.icmsBrl,
          totalBrl: quote.totalBrl,
          exchangeRate: quote.exchangeRate,
          icmsState: quote.state,
          status: "PENDING_PAYMENT",
          trackingCode,
          trackingStep: 0,
          createdAt: new Date().toISOString(),
          pixPayment: {
            id: `pix-${Date.now()}`,
            orderId: orderNumber,
            pixKey,
            qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(
              pixKey
            )}`,
            externalId: `chg_${Date.now()}`,
            splitId: `spl_${Date.now()}`,
            amountBrl: quote.totalBrl,
            status: "GENERATED",
            expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
          },
          trackingEvents: [
            {
              id: `trk-${Date.now()}`,
              status: "Cobrança Pix Split gerada · Aguardando confirmação",
              description: "QR Code ativo por 15 minutos com reserva de estoque na Unicentro.",
              location: "São Paulo / SP — Banco Parceiro",
              occurredAt: "Agora",
              stepIndex: 0,
            },
          ],
        };

        set({ orders: [newOrder, ...state.orders] });
        return newOrder;
      },

      confirmPixPayment: (orderId) => {
        const state = get();
        const invoiceNum = `000.${Math.floor(420000 + Math.random() * 70000)}`;
        const updatedOrders = state.orders.map((o) => {
          if (o.id !== orderId && o.orderNumber !== orderId) return o;
          return {
            ...o,
            status: "PAID" as const,
            paidAt: new Date().toISOString(),
            invoiceNumber: invoiceNum,
            invoiceKey: `3526101234567800019955001000${invoiceNum.replace(".", "")}1009876543`,
            trackingStep: 1,
            pixPayment: o.pixPayment
              ? { ...o.pixPayment, status: "PAID" as const, paidAt: new Date().toISOString() }
              : undefined,
            trackingEvents: [
              {
                id: `trk-paid-${Date.now()}`,
                status: "Pedido confirmado · Split Pix liquidado",
                description:
                  "Webhook HMAC confirmado: 20% Portal, repasse Unicentro PY, 5% Epyx e ICMS estadual liquidados automaticamente.",
                location: "São Paulo / SP — Banco Parceiro",
                occurredAt: "Agora mesmo",
                stepIndex: 0,
              },
              {
                id: `trk-erp-${Date.now() + 1}`,
                status: `NF-e ${invoiceNum} emitida no Bling + Etiqueta ${o.trackingCode}`,
                description: "Job BullMQ erp-sync concluído em 4,2s. Pedido em separação na Unicentro.",
                location: "Encarnación / PY — Centro Unicentro",
                occurredAt: "Agora mesmo",
                stepIndex: 1,
              },
            ],
          };
        });

        set({ orders: updatedOrders, cart: [] });
        get().setToast("Pagamento Pix confirmado! Split liquidado e NF-e emitida no Bling.");
      },

      regeneratePixQr: (orderId) => {
        const updated = get().orders.map((o) => {
          if (o.id !== orderId) return o;
          const newKey = `${o.pixPayment?.pixKey.slice(0, -4) || ""}${Math.floor(1000 + Math.random() * 8999)}`;
          return {
            ...o,
            pixPayment: o.pixPayment
              ? {
                  ...o.pixPayment,
                  pixKey: newKey,
                  status: "GENERATED" as const,
                  expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
                }
              : undefined,
          };
        });
        set({ orders: updated });
        get().setToast("Novo QR Code Pix gerado com validade de 15 minutos!");
      },

      advanceOrderTracking: (orderId) => {
        const stepTemplates = [
          {
            step: 0,
            orderStatus: "PAID" as const,
            status: "Pedido confirmado · Split Pix liquidado",
            description: "Pagamento processado via split regulado.",
            location: "São Paulo / SP",
          },
          {
            step: 1,
            orderStatus: "PREPARING" as const,
            status: "Em separação na Unicentro + NF-e emitida",
            description: "Peças inspecionadas pelo controle de qualidade em Encarnación.",
            location: "Encarnación / PY",
          },
          {
            step: 2,
            orderStatus: "SHIPPED" as const,
            status: "Objeto postado nos Correios (SRO-eXML)",
            description: "Trânsito internacional iniciado via Remessa Conforme.",
            location: "Foz do Iguaçu / PR",
          },
          {
            step: 3,
            orderStatus: "IN_CUSTOMS" as const,
            status: "Fiscalização Aduaneira Concluída · Remessa Conforme",
            description: "Declaração DIR verde: Imposto Federal R$ 0,00 e ICMS já recolhido no checkout.",
            location: "Curitiba / PR — Receita Federal",
          },
          {
            step: 4,
            orderStatus: "DELIVERED" as const,
            status: "Objeto entregue à cliente!",
            description: "Entrega confirmada pelos Correios. Avaliação liberada!",
            location: "Endereço da Cliente · Brasil",
          },
        ];

        const updated = get().orders.map((o) => {
          if (o.id !== orderId) return o;
          const nextStep = Math.min(4, o.trackingStep + 1);
          const tpl = stepTemplates[nextStep];
          return {
            ...o,
            status: tpl.orderStatus,
            trackingStep: nextStep,
            deliveredAt: nextStep === 4 ? new Date().toISOString() : o.deliveredAt,
            trackingEvents: [
              ...o.trackingEvents,
              {
                id: `trk-step-${Date.now()}`,
                status: tpl.status,
                description: tpl.description,
                location: tpl.location,
                occurredAt: "Atualizado via SRO-eXML",
                stepIndex: nextStep,
              },
            ],
          };
        });

        set({ orders: updated });
        get().setToast("Status SRO-eXML dos Correios atualizado!");
      },

      submitOrderReview: ({ orderId, productId, rating, title, body, tags }) => {
        const customerName = get().customer?.fullName || "Marina A.";
        const state = get().selectedState;
        const newReview: ProductReviewItem = {
          id: `rev-${Date.now()}`,
          productId,
          customerName,
          cityState: `Brasil, ${state}`,
          rating,
          title,
          body,
          tags,
          createdAt: "Agora mesmo",
          verifiedDelivery: true,
        };
        set({
          reviews: [newReview, ...get().reviews],
          orders: get().orders.map((o) =>
            o.id === orderId ? { ...o, reviewed: true } : o
          ),
        });
        get().setToast("Avaliação enviada! Obrigada por compartilhar sua experiência.");
      },

      toggleWishlist: (productId) => {
        const current = get().wishlistIds;
        const exists = current.includes(productId);
        if (!exists && current.length >= 50) {
          get().setToast("Limite máximo de 50 itens na lista de desejos atingido.");
          return;
        }
        set({
          wishlistIds: exists
            ? current.filter((id) => id !== productId)
            : [...current, productId],
        });
        get().setToast(
          exists ? "Removido da sua Lista de Desejos" : "Salvo na Lista de Desejos com alertas ativos!"
        );
      },

      markAlertRead: (alertId) => {
        set({
          alerts: get().alerts.map((a) => (a.id === alertId ? { ...a, read: true } : a)),
        });
      },

      generateAiLooks: ({ photoPreviewUrl, occasion, forceFallback = false }) => {
        const prods = get().products.filter((p) => p.status === "ACTIVE");
        const rate = get().ptaxRate;

        const buildCombo = (
          rank: 1 | 2 | 3,
          title: string,
          subtitle: string,
          ids: string[],
          score: number
        ): GeneratedLookCombo => {
          const items = ids
            .map((id) => prods.find((p) => p.id === id))
            .filter((Boolean as unknown) as <T>(x: T | undefined) => x is T);
          const totalBrl = items.reduce(
            (sum, item) => sum + calculateBrlFromFob(item.fobPriceUsd, rate),
            0
          );
          return {
            id: `combo-${Date.now()}-${rank}`,
            rank,
            title,
            subtitle,
            isBestCombo: rank === 1,
            matchScore: score,
            items,
            totalBrl,
          };
        };

        const looks: GeneratedLookCombo[] =
          occasion === "noite" || occasion === "festa"
            ? [
                buildCombo(
                  1,
                  "Look 1 · Noite Imperial Dourado & Veludo",
                  "Contraste sofisticado entre o veludo obsidian e pontos de luz em ouro 18k",
                  ["prod-001", "prod-005", "prod-008"],
                  98
                ),
                buildCombo(
                  2,
                  "Look 2 · Elegância Milanesa",
                  "Relógio caixa petite madrepérola + bracelete martelado + cinto escultural",
                  ["prod-006", "prod-009", "prod-007"],
                  93
                ),
                buildCombo(
                  3,
                  "Look 3 · Toque de Seda Esmeralda",
                  "Ponto de cor esmeralda sobre alfaiataria noturna com brinco gota",
                  ["prod-002", "prod-001", "prod-007"],
                  89
                ),
              ]
            : [
                buildCombo(
                  1,
                  "Look 1 · Resort Chic Encarnación",
                  "Harmonia solar entre palha natural, seda esmeralda e ouro 18k",
                  ["prod-001", "prod-002", "prod-003"],
                  99
                ),
                buildCombo(
                  2,
                  "Look 2 · Urbano Milano & Ouro Champagne",
                  "Óculos acetato tartaruga + colar elo português + cinto couro legítimo",
                  ["prod-004", "prod-005", "prod-007"],
                  94
                ),
                buildCombo(
                  3,
                  "Look 3 · Executiva Minimalista",
                  "Relógio Petite Gold + brinco gota imperial + lenço Riviera",
                  ["prod-006", "prod-001", "prod-002"],
                  91
                ),
              ];

        const session: AiLookSession = {
          id: `ai-look-${Date.now()}`,
          createdAt: new Date().toISOString(),
          occasion,
          photoPreviewUrl,
          photoTags: [
            `ocasião:${occasion}`,
            "paleta:dourado-champagne+esmeralda+neutros",
            forceFallback ? "modo:curadoria-humana-fallback" : "estilo:editorial-chic",
          ],
          latencyMs: forceFallback ? 420 : 1840, // SLA < 8000ms (Product Brief §3.2)
          usedManualFallback: forceFallback,
          regenerateCount: 0,
          looks,
        };

        set({
          aiSessions: [session, ...get().aiSessions],
          activeAiSessionId: session.id,
        });
        return session;
      },

      regenerateAiLooks: (sessionId) => {
        const session = get().aiSessions.find((s) => s.id === sessionId);
        if (!session) return;
        if (session.regenerateCount >= 3) {
          get().setToast("Limite de 3 regenerações por sessão atingido (Spec §27.6).");
          return;
        }
        const rotatedLooks = [...session.looks.slice(1), session.looks[0]].map((l, idx) => ({
          ...l,
          rank: (idx + 1) as 1 | 2 | 3,
          isBestCombo: idx === 0,
        }));
        set({
          aiSessions: get().aiSessions.map((s) =>
            s.id === sessionId
              ? {
                  ...s,
                  regenerateCount: s.regenerateCount + 1,
                  looks: rotatedLooks,
                }
              : s
          ),
        });
        get().setToast("Novas combinações geradas pela IA!");
      },

      buyEntireLook: (look) => {
        for (const item of look.items) {
          get().addToCart(item.id, 1);
        }
        get().setToast(`Look completo (${look.items.length} peças) adicionado à sacola!`);
      },

      createSharedCart: ({ title, message, productIds, invitedEmails }) => {
        const state = get();
        const items: SharedLookItem[] = productIds
          .map((pid, idx) => {
            const product = state.products.find((p) => p.id === pid);
            if (!product) return null;
            return {
              id: `sci-${Date.now()}-${idx}`,
              product,
              unitPriceBrl: calculateBrlFromFob(product.fobPriceUsd, state.ptaxRate),
            };
          })
          .filter((Boolean as unknown) as <T>(x: T | null) => x is T);

        const slugBase = title
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
        const token = `${slugBase || "look"}-${Math.floor(100 + Math.random() * 900)}`;

        const newShared: SharedLookCart = {
          id: `sc-${Date.now()}`,
          token,
          ownerName: state.customer?.fullName || "Marina Albuquerque",
          title,
          message,
          status: "OPEN",
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
          invitedEmails: invitedEmails.slice(0, 8),
          items,
        };

        set({ sharedCarts: [newShared, ...state.sharedCarts] });
        get().setToast("Link de Presente Compartilhado criado! Válido por 7 dias.");
        return newShared;
      },

      contributeToSharedItem: ({ token, itemId, friendName, friendEmail }) => {
        const updated = get().sharedCarts.map((sc) => {
          if (sc.token !== token) return sc;
          const updatedItems = sc.items.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  contributedByName: friendName,
                  contributedByEmail: friendEmail,
                  contributedAt: "Agora via Pix Split",
                }
              : item
          );
          const allPaid = updatedItems.every((i) => Boolean(i.contributedByName));
          return {
            ...sc,
            items: updatedItems,
            status: allPaid ? ("COMPLETED" as const) : sc.status,
          };
        });

        set({ sharedCarts: updated });
        const target = updated.find((s) => s.token === token);
        if (target?.status === "COMPLETED") {
          get().setToast("🎉 Todas as peças foram pagas! Split Pix fechado automaticamente e pedido enviado à Unicentro!");
        } else {
          get().setToast(`Obrigada, ${friendName}! Sua contribuição via Pix foi confirmada.`);
        }
      },

      completeRemainingSharedCartByOwner: (token) => {
        const ownerName = get().customer?.fullName || "Marina (Dona do Look)";
        const updated = get().sharedCarts.map((sc) => {
          if (sc.token !== token) return sc;
          return {
            ...sc,
            status: "COMPLETED" as const,
            items: sc.items.map((item) =>
              item.contributedByName
                ? item
                : {
                    ...item,
                    contributedByName: `${ownerName} (Completou no fallback 7d)`,
                    contributedAt: "Agora via Pix",
                  }
            ),
          };
        });
        set({ sharedCarts: updated });
        get().setToast("Você completou os itens restantes! Look fechado e enviado para separação.");
      },

      setLiveFeaturedProduct: (productId) => {
        set({ liveFeaturedProductId: productId });
      },

      sendLiveChatMessage: (authorName, text, isHost = false) => {
        const now = new Date();
        const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
        set({
          liveMessages: [
            ...get().liveMessages,
            {
              id: `lm-${Date.now()}`,
              authorName,
              text,
              isHost,
              createdAt: hhmm,
            },
          ],
        });
      },

      toggleLiveReminder: () => {
        const next = !get().liveReminderSet;
        set({ liveReminderSet: next });
        get().setToast(
          next
            ? "Lembrete ativado para a próxima Live de Quinta às 19h BRT!"
            : "Lembrete de live desativado."
        );
      },
    }),
    {
      name: "portal-estilo-luxo-v1-storage",
    }
  )
);

export { CATEGORIES };
