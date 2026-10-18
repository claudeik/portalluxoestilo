// packages/types/index.ts
// Portal Estilo Luxo · Contratos TypeScript do Produto (Volume I · Pitch Editorial)

export type KycStatus = "PENDING" | "SUBMITTED" | "APPROVED" | "REJECTED";
export type ProductStatus = "ACTIVE" | "DRAFT" | "ARCHIVED" | "OUT_OF_STOCK";
export type CartStatus = "OPEN" | "CHECKOUT" | "CONVERTED" | "EXPIRED" | "ABANDONED";
export type OrderStatus =
  | "PENDING_PAYMENT"
  | "PAID"
  | "PREPARING"
  | "SHIPPED"
  | "IN_CUSTOMS"
  | "DELIVERED"
  | "CANCELED"
  | "REFUNDED";
export type PixStatus = "GENERATED" | "PAID" | "EXPIRED" | "FAILED" | "WAITING_PAYMENT" | "CONFIRMED";
export type ErpType = "BLING" | "SAMKYA";
export type InvoiceStatus = "PENDING" | "EMITTED" | "CANCELED";
export type SharedCartStatus = "OPEN" | "COMPLETED" | "EXPIRED" | "CANCELED";
export type InviteStatus = "PENDING" | "VIEWED" | "ACCEPTED" | "DECLINED" | "EXPIRED";
export type LiveStatus = "SCHEDULED" | "LIVE" | "ENDED";

export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string;
  iconName?: string;
  sortOrder: number;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  altText?: string;
  sortOrder: number;
}

export interface StockInfo {
  productId: string;
  quantity: number;
  reserved: number;
  lastSyncAt: string;
  unicentroRef?: string;
}

export interface Product {
  id: string;
  slug: string;
  sku: string;
  unicentroId: string;
  categoryId: string;
  categorySlug: string;
  categoryName: string;
  name: string;
  description: string;
  tagline?: string;
  editorialNote?: string;
  material?: string;
  color?: string;
  colorHex?: string;
  dimensions?: string;
  weightGrams?: number;
  careInstructions?: string;
  originCity: string;
  fobPriceUsd: number;
  compareAtBrl?: number;
  ncmCode?: string;
  images: ProductImage[];
  stock: StockInfo;
  status: ProductStatus;
  isNew: boolean;
  weeklyRank?: number;
  ratingAvg: number;
  reviewCount: number;
  styleTags: string[];
}

export interface Address {
  id: string;
  customerId: string;
  label: string;
  zipCode: string;
  street: string;
  number: string;
  complement?: string;
  district: string;
  city: string;
  state: string;
  isDefault: boolean;
}

export interface Customer {
  id: string;
  email: string;
  phone: string;
  cpf: string;
  fullName: string;
  kycStatus: KycStatus;
  kycExternalId?: string;
  kycApprovedAt?: string;
  addresses: Address[];
}

export interface CheckoutQuote {
  subtotalBrl: number;
  shippingBrl: number;
  federalTaxBrl: number; // Always 0.00 (Remessa Conforme <= US$ 50 FOB)
  icmsBrl: number;
  totalBrl: number;
  exchangeRate: number;
  icmsRate: number;
  state: string;
  splits: {
    portalBrl: number;     // 20% commission
    unicentroBrl: number;  // Supplier net + freight
    epyxBrl: number;       // 5% platform fee
    taxBrl: number;        // State ICMS
  };
  expiresAt: string;
}

export interface PixPayment {
  id: string;
  orderId: string;
  pixKey: string;
  qrCodeUrl: string;
  externalId: string;
  splitId?: string;
  amountBrl: number;
  status: PixStatus;
  paidAt?: string;
  expiresAt: string;
}

export interface TrackingEvent {
  id: string;
  status: string;
  description: string;
  location: string;
  occurredAt: string;
  stepIndex: number; // 0 to 5
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  items: {
    id: string;
    productId: string;
    product: Product;
    quantity: number;
    unitPriceBrl: number;
    totalBrl: number;
  }[];
  totalBrl: number;
  subtotalBrl: number;
  shippingBrl: number;
  federalTaxBrl: number;
  icmsBrl: number;
  exchangeRate: number;
  icmsState: string;
  status: OrderStatus;
  pixPayment?: PixPayment;
  trackingCode: string;
  trackingStep: number; // 0..5
  trackingEvents: TrackingEvent[];
  invoiceNumber?: string;
  invoiceKey?: string;
  createdAt: string;
  paidAt?: string;
  deliveredAt?: string;
  reviewed?: boolean;
}
