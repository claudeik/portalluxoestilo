// apps/web/src/stores/app.store.ts
// Portal Estilo Luxo · Estado Global Zustand v2.0 (Volume I · Pitch Editorial)
// Personas (Maria Helena / Beatriz / Carmen), Split Pix Regulado, Tracking Correios 6 Etapas

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Customer, Order, Product } from "@portal/types";
import {
  CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_REVIEWS,
  PERSONAS,
  PersonaProfile,
  ProductReviewItem,
} from "../data/catalog.data";
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

export interface EditorialNotification {
  id: string;
  step: 1 | 2 | 3 | 4;
  title: string;
  subtitle: string;
  timestamp: string;
  channel: "WhatsApp" | "E-mail";
  body: string;
  imageUrl?: string;
  actionText?: string;
}

interface PortalAppState {
  // Catálogo e Câmbio
  products: Product[];
  reviews: ProductReviewItem[];
  ptaxRate: number;
  selectedState: string;
  selectedZipCode: string;

  // Tema & Personas
  themeMode: "light" | "dark";
  currentPersona: "maria_helena" | "beatriz" | "carmen";
  switchPersona: (personaId: "maria_helena" | "beatriz" | "carmen") => void;
  toggleTheme: () => void;

  // Notificações do Pitch (Capítulo 13)
  activeNotificationModal: number | null;
  setActiveNotificationModal: (num: number | null) => void;
  editorialNotifications: EditorialNotification[];

  // Cliente & Auth
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

  // Presente Compartilhado
  sharedCarts: SharedLookCart[];

  // Live Shopping
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

const CUSTOMER_PROFILES: Record<string, Customer> = {
  maria_helena: {
    id: "cust-maria-01",
    fullName: "Maria Helena Andrade",
    email: "maria.helena@fintech.com.br",
    phone: "(11) 98765-4321",
    cpf: "384.920.678-90",
    kycStatus: "APPROVED",
    kycExternalId: "kyc_banco_parceiro_847120",
    kycApprovedAt: "2026-10-17T22:15:00Z",
    addresses: [
      {
        id: "addr-01",
        customerId: "cust-maria-01",
        label: "Casa · Pinheiros",
        zipCode: "05416-010",
        street: "Rua Aspicuelta",
        number: "123",
        complement: "Apto 42",
        district: "Pinheiros",
        city: "São Paulo",
        state: "SP",
        isDefault: true,
      },
    ],
  },
  beatriz: {
    id: "cust-beatriz-02",
    fullName: "Beatriz Nogueira",
    email: "beatriz.design@gmail.com",
    phone: "(51) 99876-1234",
    cpf: "452.189.730-22",
    kycStatus: "APPROVED",
    kycExternalId: "kyc_banco_parceiro_847121",
    kycApprovedAt: "2026-10-14T11:30:00Z",
    addresses: [
      {
        id: "addr-02",
        customerId: "cust-beatriz-02",
        label: "Estúdio · Moinhos de Vento",
        zipCode: "90570-020",
        street: "Rua Padre Chagas",
        number: "280",
        complement: "Conjunto 302",
        district: "Moinhos de Vento",
        city: "Porto Alegre",
        state: "RS",
        isDefault: true,
      },
    ],
  },
  carmen: {
    id: "cust-carmen-03",
    fullName: "Carmen Silveira",
    email: "carmen.silveira@decor.com.br",
    phone: "(81) 99123-4567",
    cpf: "219.840.512-88",
    kycStatus: "APPROVED",
    kycExternalId: "kyc_banco_parceiro_847122",
    kycApprovedAt: "2026-10-11T16:45:00Z",
    addresses: [
      {
        id: "addr-03",
        customerId: "cust-carmen-03",
        label: "Casa · Boa Viagem",
        zipCode: "51020-000",
        street: "Av. Boa Viagem",
        number: "3420",
        complement: "Cobertura 01",
        district: "Boa Viagem",
        city: "Recife",
        state: "PE",
        isDefault: true,
      },
    ],
  },
};

const INITIAL_EDITORIAL_NOTIFICATIONS: EditorialNotification[] = [
  {
    id: "notif-1",
    step: 1,
    title: "Notificação 1 · Pix confirmado",
    subtitle: '"Recebemos seu pagamento, Maria."',
    timestamp: "17/10 · 22h18 (1 min após o Pix)",
    channel: "WhatsApp",
    body: "Confirma o pedido #PRT-2026-0847 e comunica com clareza: 'Nos próximos 2 dias úteis, atualizaremos o status com o código de rastreio dos Correios. Seu Pix foi dividido automaticamente em operação regulada.'",
    actionText: "Ver Pedido",
  },
  {
    id: "notif-2",
    step: 2,
    title: "Notificação 2 · Pedido postado",
    subtitle: '"Seu lenço está a caminho."',
    timestamp: "19/10 · 14h30",
    channel: "WhatsApp",
    body: "Inclui o código de rastreio dos Correios PY20261019847BR e a foto da peça empacotada no papel seda com o cartão assinado da curadoria Portal — o ritual de unboxing que substitui o silêncio da espera.",
    imageUrl: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80",
    actionText: "Rastrear Objeto",
  },
  {
    id: "notif-3",
    step: 3,
    title: "Notificação 3 · Desembaraçado",
    subtitle: '"Passou pela alfândega. Sem taxa."',
    timestamp: "22/10 · 11h12",
    channel: "WhatsApp",
    body: "A notificação mais importante da jornada: confirma que o Remessa Conforme da Unicentro funcionou, que não há cobrança extra e que a entrega segue o prazo de 12 dias. Reduz 70% da ansiedade.",
    actionText: "Ver Status",
  },
  {
    id: "notif-4",
    step: 4,
    title: "Notificação 4 · Em entrega",
    subtitle: '"Hoje, entre 10h e 18h."',
    timestamp: "28/10 · 08h30",
    channel: "WhatsApp",
    body: "Enviado na manhã da entrega pelos Correios com janela estimada de entrega e opção de avisar a portaria.",
    actionText: "Acompanhar Carteiro",
  },
];

const INITIAL_ORDERS: Order[] = [
  {
    id: "PRT-2026-0847",
    orderNumber: "PRT-2026-0847",
    customerId: "cust-maria-01",
    items: [
      {
        id: "oi-01",
        productId: "prod-001",
        product: INITIAL_PRODUCTS[0],
        quantity: 1,
        unitPriceBrl: 110.0,
        totalBrl: 110.0,
      },
    ],
    subtotalBrl: 110.0,
    shippingBrl: 25.0,
    federalTaxBrl: 0.0,
    icmsBrl: 27.65,
    totalBrl: 162.65,
    exchangeRate: 5.0,
    icmsState: "SP",
    status: "SHIPPED",
    trackingCode: "PY20261019847BR",
    trackingStep: 4, // Em trânsito SP
    invoiceNumber: "000.418920",
    invoiceKey: "35261012345678000199550010004189201009876543",
    createdAt: "2026-10-17T22:15:00Z",
    paidAt: "2026-10-17T22:17:00Z",
    trackingEvents: [
      {
        id: "trk-1",
        status: "Pago · Split Pix automático concluído",
        description: "Pix de R$ 162,65 dividido: Portal 20% (R$ 22,00), Unicentro PY ~71%, Epyx ~5%, Tributos ~4%.",
        location: "São Paulo / SP",
        occurredAt: "17/10 · 22h17",
        stepIndex: 0,
      },
      {
        id: "trk-2",
        status: "Em preparação · Unicentro Ciudad del Este",
        description: "Peça conferida, envolvida em papel seda cream e acompanhada de cartão de curadoria assinado.",
        location: "Ciudad del Este / PY",
        occurredAt: "18/10 · 09h00",
        stepIndex: 1,
      },
      {
        id: "trk-3",
        status: "Postado · Correios PY",
        description: "Objeto postado com código PY20261019847BR. Foto do pacote enviada à cliente.",
        location: "Ciudad del Este / PY → Foz do Iguaçu / PR",
        occurredAt: "19/10 · 14h22",
        stepIndex: 2,
      },
      {
        id: "trk-4",
        status: "Desembaraçado · Alfândega Receita Federal BR",
        description: "Canal Verde Remessa Conforme. Imposto Federal R$ 0,00 comprovado e sem retenção.",
        location: "Curitiba / PR · Centro Internacional",
        occurredAt: "22/10 · 11h08",
        stepIndex: 3,
      },
      {
        id: "trk-5",
        status: "Em trânsito · Centro de Distribuição SP",
        description: "Pacote a caminho da unidade de distribuição de Pinheiros / SP.",
        location: "São Paulo / SP",
        occurredAt: "28/10 · 08h30",
        stepIndex: 4,
      },
    ],
  },
  {
    id: "PRT-2026-0791",
    orderNumber: "PRT-2026-0791",
    customerId: "cust-carmen-03",
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
    icmsBrl: 48.13,
    totalBrl: 283.13,
    exchangeRate: 5.0,
    icmsState: "PE",
    status: "DELIVERED",
    trackingCode: "PY20261001791BR",
    trackingStep: 5,
    invoiceNumber: "000.391044",
    invoiceKey: "35261012345678000199550010003910441009876543",
    createdAt: "2026-10-01T14:00:00Z",
    paidAt: "2026-10-01T14:02:00Z",
    deliveredAt: "2026-10-12T16:45:00Z",
    reviewed: true,
    trackingEvents: [
      {
        id: "trk-d1",
        status: "Entregue pelos Correios sem taxa",
        description: "Recebido com papel seda e cartão assinado em Boa Viagem / Recife.",
        location: "Recife / PE",
        occurredAt: "12/10 · 16h45",
        stepIndex: 5,
      },
    ],
  },
];

const INITIAL_ALERTS: AppAlert[] = [
  {
    id: "alt-1",
    type: "TRACKING",
    title: "Passou pela alfândega. Sem taxa.",
    description: "Seu pedido #PRT-2026-0847 foi desembaraçado na Receita Federal e está a caminho de São Paulo.",
    orderId: "PRT-2026-0847",
    createdAt: "22/10 às 11:12",
    read: false,
  },
  {
    id: "alt-2",
    type: "PRICE_DROP",
    title: "Nova Curadoria · Safra Primavera",
    description: "8 novas peças exclusivas de Ciudad del Este desembarcaram com preço final na tela.",
    createdAt: "Hoje às 09:00",
    read: false,
  },
];

const INITIAL_SHARED_CARTS: SharedLookCart[] = [
  {
    id: "sc-aniversario-marina",
    token: "aniversario-marina-2026",
    ownerName: "Marina Albuquerque",
    title: "Presente de Aniversário da Marina ✨",
    message: "Amigas, selecionei os acessórios favoritos da curadoria Portal para comemorar meus 30 anos!",
    status: "OPEN",
    expiresAt: "2026-11-01T23:59:59Z",
    createdAt: "2026-10-10T12:00:00Z",
    invitedEmails: ["patricia@gmail.com", "bia.amiga@gmail.com", "camila@gmail.com"],
    items: [
      {
        id: "si-01",
        product: INITIAL_PRODUCTS[0],
        unitPriceBrl: 110.0,
      },
      {
        id: "si-02",
        product: INITIAL_PRODUCTS[1],
        unitPriceBrl: 90.0,
        contributedByName: "Bia C.",
        contributedByEmail: "bia.amiga@gmail.com",
        contributedAt: "2026-10-11T14:22:00Z",
      },
      {
        id: "si-03",
        product: INITIAL_PRODUCTS[2],
        unitPriceBrl: 210.0,
      },
    ],
  },
];

const INITIAL_LIVE_MESSAGES: LiveChatMessage[] = [
  {
    id: "lm-1",
    authorName: "Editora Portal · Curadoria",
    text: "Bem-vindas à nossa edição especial direto de Ciudad del Este! Todas as peças desta safra têm Imposto Federal R$ 0,00 sob o Remessa Conforme ✨",
    isHost: true,
    createdAt: "19:01",
  },
  {
    id: "lm-2",
    authorName: "Maria Helena (SP)",
    text: "O lenço floral combina com camisa branca de alfaiataria?",
    isHost: false,
    createdAt: "19:02",
  },
  {
    id: "lm-3",
    authorName: "Editora Portal · Curadoria",
    text: "Perfeito, Maria Helena! A viscose tem caimento acetinado ideal para o ambiente de trabalho e o nó francês.",
    isHost: true,
    createdAt: "19:03",
  },
  {
    id: "lm-4",
    authorName: "Beatriz (RS)",
    text: "Acabei de garantir o Brinco Gota Dourado pelo Pix Split, aprovou em 3 segundos!",
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
      selectedZipCode: "05416-010",
      themeMode: "light",
      currentPersona: "maria_helena",
      activeNotificationModal: null,
      editorialNotifications: INITIAL_EDITORIAL_NOTIFICATIONS,
      customer: CUSTOMER_PROFILES.maria_helena,
      cart: [
        {
          productId: "prod-001",
          quantity: 1,
          addedAt: new Date().toISOString(),
        },
      ],
      orders: INITIAL_ORDERS,
      wishlistIds: ["prod-001", "prod-002", "prod-003", "prod-004"],
      alerts: INITIAL_ALERTS,
      aiSessions: [],
      activeAiSessionId: null,
      sharedCarts: INITIAL_SHARED_CARTS,
      liveFeaturedProductId: "prod-001",
      liveViewerCount: 642,
      liveMessages: INITIAL_LIVE_MESSAGES,
      liveReminderSet: false,
      toastMessage: null,

      switchPersona: (personaId) => {
        const profile = PERSONAS[personaId];
        const cust = CUSTOMER_PROFILES[personaId];
        if (!profile || !cust) return;

        set({
          currentPersona: personaId,
          customer: cust,
          selectedState: cust.addresses[0]?.state || "SP",
          selectedZipCode: cust.addresses[0]?.zipCode || "01414-001",
        });

        get().setToast(`Alternado para Persona: ${profile.name} (${profile.profession})`);
      },

      toggleTheme: () => {
        const next = get().themeMode === "light" ? "dark" : "light";
        set({ themeMode: next });
        if (typeof document !== "undefined") {
          if (next === "dark") {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
        }
      },

      setActiveNotificationModal: (num) => {
        set({ activeNotificationModal: num });
      },

      setToast: (msg) => {
        set({ toastMessage: msg });
        if (msg) {
          setTimeout(() => {
            if (get().toastMessage === msg) {
              set({ toastMessage: null });
            }
          }, 4500);
        }
      },

      setSelectedState: (uf, zipCode) => {
        set({
          selectedState: uf.toUpperCase(),
          selectedZipCode: zipCode || get().selectedZipCode,
        });
        get().setToast(`Região de entrega atualizada: ${uf.toUpperCase()} (Alíquota ICMS ajustada)`);
      },

      addToCart: (productId, qty = 1) => {
        const currentCart = get().cart;
        const exists = currentCart.find((item) => item.productId === productId);
        let updated: CartEntry[];
        if (exists) {
          updated = currentCart.map((item) =>
            item.productId === productId ? { ...item, quantity: item.quantity + qty } : item
          );
        } else {
          updated = [...currentCart, { productId, quantity: qty, addedAt: new Date().toISOString() }];
        }
        set({ cart: updated });
        const prod = get().products.find((p) => p.id === productId);
        get().setToast(`"${prod?.name || 'Item'}" adicionado à sua sacola.`);
      },

      updateCartQty: (productId, qty) => {
        if (qty <= 0) {
          get().removeFromCart(productId);
          return;
        }
        set({
          cart: get().cart.map((i) => (i.productId === productId ? { ...i, quantity: qty } : i)),
        });
      },

      removeFromCart: (productId) => {
        set({
          cart: get().cart.filter((i) => i.productId !== productId),
        });
        get().setToast("Item removido da sacola.");
      },

      clearCart: () => {
        set({ cart: [] });
      },

      saveCartFallback24h: () => {
        const exp = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
        set({ savedCartUntil: exp });
        get().setToast("Sua sacola foi preservada por 24h. Retome a qualquer momento.");
      },

      loginAsMarina: () => {
        set({ customer: CUSTOMER_PROFILES.maria_helena });
        get().setToast("Sessão ativa: Maria Helena Andrade (KYC Bacen Aprovado).");
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
          kycExternalId: `kyc_banco_parceiro_${Math.floor(100000 + Math.random() * 900000)}`,
          kycApprovedAt: new Date().toISOString(),
          addresses: [
            {
              id: `addr-${Date.now()}`,
              customerId: `cust-${Date.now()}`,
              label: "Endereço Principal",
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
        get().setToast("Cadastro único no Banco Parceiro aprovado em 90s! Seus dados estão protegidos.");
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

        const orderNumber = `PRT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        const trackingDigits = Math.floor(100000000 + Math.random() * 900000000);
        const trackingCode = `PY${trackingDigits}BR`;
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
            expiresAt: quote.expiresAt,
          },
          trackingEvents: [
            {
              id: `trk-init-${Date.now()}`,
              status: "Aguardando pagamento Pix",
              description: "QR Code gerado. Split automático de 4 vias aguardando confirmação do Banco Parceiro.",
              location: "São Paulo / SP",
              occurredAt: "Agora",
              stepIndex: 0,
            },
          ],
        };

        set({
          orders: [newOrder, ...state.orders],
          cart: [],
        });

        get().setToast(`Pedido ${orderNumber} criado. QR Code Pix disponível.`);
        return newOrder;
      },

      confirmPixPayment: (orderId) => {
        const order = get().orders.find((o) => o.id === orderId || o.orderNumber === orderId);
        if (!order) return;

        const updatedOrders: Order[] = get().orders.map((o) => {
          if (o.id !== order.id) return o;
          return {
            ...o,
            status: "PAID" as const,
            paidAt: new Date().toISOString(),
            trackingStep: 1,
            pixPayment: o.pixPayment
              ? {
                  ...o.pixPayment,
                  status: "PAID" as const,
                  paidAt: new Date().toISOString(),
                }
              : undefined,
            trackingEvents: [
              {
                id: `trk-paid-${Date.now()}`,
                status: "Pago · Split Pix automático concluído",
                description: `Comissão Portal (20%), Unicentro (~71%), Epyx (~5%) e ICMS liquidados via Banco Parceiro.`,
                location: "São Paulo / SP",
                occurredAt: "Hoje",
                stepIndex: 0,
              },
              ...o.trackingEvents,
            ],
          };
        });

        set({ orders: updatedOrders });
        get().setToast(`Pix confirmado em 3s! Split automático executado para o pedido ${order.orderNumber}.`);
      },

      regeneratePixQr: (orderId) => {
        const order = get().orders.find((o) => o.id === orderId || o.orderNumber === orderId);
        if (!order) return;

        const updatedOrders = get().orders.map((o) => {
          if (o.id !== order.id) return o;
          const newExpires = new Date(Date.now() + 30 * 60 * 1000).toISOString();
          return {
            ...o,
            pixPayment: o.pixPayment
              ? {
                  ...o.pixPayment,
                  expiresAt: newExpires,
                }
              : undefined,
          };
        });

        set({ orders: updatedOrders });
        get().setToast("Novo QR Code Pix gerado (válido por mais 30 minutos).");
      },

      advanceOrderTracking: (orderId) => {
        const order = get().orders.find((o) => o.id === orderId || o.orderNumber === orderId);
        if (!order) return;

        const nextStep = Math.min(5, (order.trackingStep ?? 0) + 1);
        const stepsInfo = [
          { status: "Pago · Split Pix concluído", loc: "São Paulo / SP" },
          { status: "Em preparação · Unicentro PY", loc: "Ciudad del Este / PY" },
          { status: "Postado · Correios PY", loc: "Ciudad del Este / PY" },
          { status: "Desembaraçado · Alfândega BR sem taxas", loc: "Curitiba / PR" },
          { status: "Em trânsito · CD São Paulo", loc: "São Paulo / SP" },
          { status: "Entregue pelos Correios", loc: "Endereço da Cliente" },
        ];

        const target = stepsInfo[nextStep] || stepsInfo[5];

        const updatedOrders = get().orders.map((o) => {
          if (o.id !== order.id) return o;
          return {
            ...o,
            trackingStep: nextStep,
            status: (nextStep === 5 ? "DELIVERED" : "SHIPPED") as any,
            trackingEvents: [
              {
                id: `trk-adv-${Date.now()}`,
                status: target.status,
                description: `Atualização de rastreio Correios: etapa ${nextStep + 1} de 6.`,
                location: target.loc,
                occurredAt: "Agora",
                stepIndex: nextStep,
              },
              ...o.trackingEvents,
            ],
          };
        });

        set({ orders: updatedOrders });
        get().setToast(`Rastreio avançado para: ${target.status}`);
      },

      submitOrderReview: (params) => {
        const newReview: ProductReviewItem = {
          id: `rev-${Date.now()}`,
          author: get().customer?.fullName || "Cliente Verificada",
          city: `${get().customer?.addresses[0]?.city || "São Paulo"}, ${get().customer?.addresses[0]?.state || "SP"}`,
          rating: params.rating,
          date: "Hoje",
          comment: params.body,
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
        };

        const updatedOrders = get().orders.map((o) =>
          o.id === params.orderId ? { ...o, reviewed: true } : o
        );

        set({
          reviews: [newReview, ...get().reviews],
          orders: updatedOrders,
        });

        get().setToast("Avaliação publicada com sucesso! Obrigado pelo feedback.");
      },

      toggleWishlist: (productId) => {
        const current = get().wishlistIds;
        const exists = current.includes(productId);
        const next = exists ? current.filter((id) => id !== productId) : [...current, productId];
        set({ wishlistIds: next });
        const prod = get().products.find((p) => p.id === productId);
        get().setToast(
          exists
            ? `"${prod?.name || 'Item'}" removido dos favoritos.`
            : `"${prod?.name || 'Item'}" salvo para a próxima safra.`
        );
      },

      markAlertRead: (alertId) => {
        set({
          alerts: get().alerts.map((a) => (a.id === alertId ? { ...a, read: true } : a)),
        });
      },

      generateAiLooks: ({ photoPreviewUrl, occasion, forceFallback }) => {
        const prods = get().products;
        const p1 = prods[0];
        const p2 = prods[1];
        const p3 = prods[2];
        const p4 = prods[3];

        const combo1: GeneratedLookCombo = {
          id: `look-1-${Date.now()}`,
          rank: 1,
          title: "Harmonia Clássica Editorial",
          subtitle: "Lenço fluido com brinco gota banhado a ouro 18k",
          isBestCombo: true,
          matchScore: 98,
          items: [p1, p2].filter(Boolean),
          totalBrl: 200.0,
        };

        const combo2: GeneratedLookCombo = {
          id: `look-2-${Date.now()}`,
          rank: 2,
          title: "Elegância Artesanal",
          subtitle: "Bolsa de palha toquilla e bracelete martelado",
          isBestCombo: false,
          matchScore: 94,
          items: [p3, p4].filter(Boolean),
          totalBrl: 330.0,
        };

        const session: AiLookSession = {
          id: `ai-${Date.now()}`,
          createdAt: new Date().toISOString(),
          occasion,
          photoPreviewUrl,
          photoTags: ["Elegante", "Paleta Neutra", "Textura Viscose"],
          latencyMs: forceFallback ? 8200 : 3400,
          usedManualFallback: Boolean(forceFallback),
          regenerateCount: 0,
          looks: [combo1, combo2],
        };

        set({
          aiSessions: [session, ...get().aiSessions],
          activeAiSessionId: session.id,
        });

        get().setToast("Combinações da curadoria geradas com sucesso.");
        return session;
      },

      regenerateAiLooks: (sessionId) => {
        const prods = get().products;
        set({
          aiSessions: get().aiSessions.map((s) => {
            if (s.id !== sessionId) return s;
            return {
              ...s,
              regenerateCount: s.regenerateCount + 1,
              looks: s.looks.map((l) => ({
                ...l,
                matchScore: Math.min(99, l.matchScore + 1),
                items: [prods[1], prods[3], prods[0]].slice(0, 2),
              })),
            };
          }),
        });
        get().setToast("Nova safra de combinações gerada.");
      },

      buyEntireLook: (look) => {
        look.items.forEach((item) => {
          get().addToCart(item.id, 1);
        });
        get().setToast(`Visual completo (${look.items.length} itens) adicionado à sua sacola.`);
      },

      createSharedCart: ({ title, message, productIds, invitedEmails }) => {
        const state = get();
        const prods = state.products.filter((p) => productIds.includes(p.id));
        const token = `presente-${Math.random().toString(36).substring(2, 9)}`;

        const newCart: SharedLookCart = {
          id: `sc-${Date.now()}`,
          token,
          ownerName: state.customer?.fullName || "Maria Helena",
          title,
          message,
          status: "OPEN",
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString(),
          invitedEmails,
          items: prods.map((prod) => ({
            id: `si-${Date.now()}-${prod.id}`,
            product: prod,
            unitPriceBrl: calculateBrlFromFob(prod.fobPriceUsd, state.ptaxRate),
          })),
        };

        set({
          sharedCarts: [newCart, ...state.sharedCarts],
        });

        get().setToast("Lista de presentes compartilhada criada!");
        return newCart;
      },

      contributeToSharedItem: ({ token, itemId, friendName, friendEmail, friendCpf }) => {
        set({
          sharedCarts: get().sharedCarts.map((sc) => {
            if (sc.token !== token) return sc;
            return {
              ...sc,
              items: sc.items.map((item) =>
                item.id === itemId
                  ? {
                      ...item,
                      contributedByName: friendName,
                      contributedByEmail: friendEmail,
                      contributedAt: new Date().toISOString(),
                    }
                  : item
              ),
            };
          }),
        });
        get().setToast(`Obrigado, ${friendName}! Sua cota de presente foi confirmada.`);
      },

      completeRemainingSharedCartByOwner: (token) => {
        set({
          sharedCarts: get().sharedCarts.map((sc) => {
            if (sc.token !== token) return sc;
            return {
              ...sc,
              status: "COMPLETED",
            };
          }),
        });
        get().setToast("Presente concluído com sucesso!");
      },

      setLiveFeaturedProduct: (productId) => {
        set({ liveFeaturedProductId: productId });
      },

      sendLiveChatMessage: (authorName, text, isHost = false) => {
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
        const newMsg: LiveChatMessage = {
          id: `lm-${Date.now()}`,
          authorName,
          text,
          isHost,
          createdAt: timeStr,
        };
        set({
          liveMessages: [...get().liveMessages, newMsg],
        });
      },

      toggleLiveReminder: () => {
        const next = !get().liveReminderSet;
        set({ liveReminderSet: next });
        get().setToast(
          next
            ? "Lembrete de edição editorial ativado via WhatsApp!"
            : "Lembrete desativado."
        );
      },
    }),
    {
      name: "portal-estilo-luxo-storage-v2",
      partialize: (state) => ({
        cart: state.cart,
        orders: state.orders,
        wishlistIds: state.wishlistIds,
        customer: state.customer,
        currentPersona: state.currentPersona,
        themeMode: state.themeMode,
        selectedState: state.selectedState,
        selectedZipCode: state.selectedZipCode,
      }),
    }
  )
);

export { CATEGORIES, INITIAL_PRODUCTS, INITIAL_REVIEWS };
