// apps/web/src/routes/CheckoutPages.tsx
// Mockups 05, 06, 07, 08 e 09 · Portal Estilo Luxo (Volume I · Pitch Editorial)
// Carrinho, Cadastro Banco Parceiro (90s), Resumo Transparente, Pix Split e Confirmação

import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Building2,
  Truck,
  Sparkles,
} from "lucide-react";
import { usePortalStore } from "../stores/app.store";
import {
  calculateBrlFromFob,
  calculateQuote,
  formatBrl,
  formatCpf,
  formatCep,
  isValidCpf,
  lookupCep,
} from "../lib/format";
import { CartSummary } from "../components/checkout/CartSummary";
import { PixQR } from "../components/checkout/PixQR";

export function CartPage() {
  const navigate = useNavigate();
  const {
    cart,
    products,
    ptaxRate,
    selectedState,
    updateCartQty,
    removeFromCart,
  } = usePortalStore();

  const detailedItems = cart
    .map((entry) => {
      const product = products.find((p) => p.id === entry.productId);
      if (!product) return null;
      const unitBrl = calculateBrlFromFob(product.fobPriceUsd, ptaxRate);
      const rawImg = (product as any).images?.[0];
      const imgUrl = typeof rawImg === "string" ? rawImg : rawImg?.url || "";
      return {
        ...entry,
        product,
        unitBrl,
        totalBrl: Number((unitBrl * entry.quantity).toFixed(2)),
        imgUrl,
      };
    })
    .filter((Boolean as unknown) as <T>(x: T | null) => x is T);

  const subtotalBrl = detailedItems.reduce((acc, item) => acc + item.totalBrl, 0);
  const quote = calculateQuote({
    subtotalBrl,
    state: selectedState,
  });

  if (detailedItems.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-[#F0EBE0] border border-[#C9BFA8] flex items-center justify-center mx-auto text-[#8C8275]">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="font-serif text-3xl text-[#0A0A0A]">Sua sacola está vazia</h1>
          <p className="text-xs text-[#8C8275]">
            Explore nossa safra curada de acessórios importados de Ciudad del Este.
          </p>
        </div>
        <Link to="/" className="btn-gold inline-flex">
          Explorar Curadoria →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pt-6 pb-28 space-y-8 animate-fade-in text-left">
      <div className="flex items-center justify-between border-b border-[#C9BFA8] pb-4">
        <div>
          <span className="eyebrow text-[#8B6B30]">Mockup 05 · Carrinho</span>
          <h1 className="font-serif text-3xl text-[#0A0A0A] dark:text-[#FAF7F2]">
            Sua Sacola ({detailedItems.length})
          </h1>
        </div>
        <span className="text-xs text-[#8C8275]">
          Isenção Remessa Conforme Aplicada
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-8 items-start">
        {/* Lista de Itens */}
        <div className="space-y-4">
          {detailedItems.map((item) => (
            <div
              key={item.productId}
              className="p-4 rounded-2xl bg-white dark:bg-[#14110E] border border-[#C9BFA8] dark:border-[#2A2520] flex gap-4 items-center shadow-sm"
            >
              <img
                src={item.imgUrl}
                alt={item.product.name}
                className="w-20 h-24 object-cover rounded-xl bg-[#F0EBE0] shrink-0 border border-[#C9BFA8]"
              />

              <div className="flex-1 space-y-1">
                <span className="text-[10px] uppercase text-[#8C8275]">{item.product.categoryName}</span>
                <h3 className="font-serif text-base text-[#0A0A0A] dark:text-[#FAF7F2] font-medium leading-tight">
                  {item.product.name}
                </h3>
                <div className="italic-serif text-lg font-bold text-[#8B6B30]">
                  {formatBrl(item.unitBrl)}
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <div className="flex items-center border border-[#C9BFA8] rounded-lg overflow-hidden bg-[#FAF7F2]">
                    <button
                      type="button"
                      onClick={() => updateCartQty(item.productId, item.quantity - 1)}
                      className="p-1.5 hover:bg-[#F0EBE0] text-[#0A0A0A]"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-semibold text-[#0A0A0A]">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateCartQty(item.productId, item.quantity + 1)}
                      className="p-1.5 hover:bg-[#F0EBE0] text-[#0A0A0A]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.productId)}
                    className="text-xs text-[#8C8275] hover:text-red-600 transition flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remover</span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Pré-resumo explicativo do Mockup 05 */}
          <div className="p-4 bg-[#F0EBE0] rounded-xl border border-[#C9BFA8] space-y-2 text-xs">
            <span className="text-[10px] uppercase font-bold text-[#8B6B30] tracking-wider block">
              Pré-Resumo Transparente
            </span>
            <div className="flex justify-between text-[#4A4A4A]">
              <span>Mercadoria:</span>
              <span>{formatBrl(quote.subtotalBrl)}</span>
            </div>
            <div className="flex justify-between text-[#4A4A4A]">
              <span>Frete Correios Internacional:</span>
              <span>{formatBrl(quote.shippingBrl)}</span>
            </div>
            <div className="flex justify-between text-[#5B8254] font-medium">
              <span>Imposto Federal de Importação:</span>
              <span>R$ 0,00 (Isento Remessa Conforme)</span>
            </div>
            <p className="text-[11px] text-[#8C8275] pt-1">
              O ICMS estadual será calculado no resumo final. Total estimado: {formatBrl(quote.totalBrl)}.
            </p>
          </div>
        </div>

        {/* Card Lateral de Resumo */}
        <div className="space-y-4">
          <CartSummary quote={quote} showSplitDetails={false} />

          <button
            type="button"
            onClick={() => navigate("/checkout")}
            className="btn-gold w-full text-center py-3.5"
          >
            <span>Ir para Resumo do Pedido</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function CheckoutPage() {
  const navigate = useNavigate();
  const {
    cart,
    products,
    ptaxRate,
    selectedState,
    selectedZipCode,
    customer,
    registerCustomerWithKyc,
    createOrderFromCart,
    confirmPixPayment,
    regeneratePixQr,
    orders,
  } = usePortalStore();

  const [step, setStep] = useState<"kyc" | "review" | "pix">(() => {
    return customer?.kycStatus === "APPROVED" ? "review" : "kyc";
  });

  // Formulário do Cadastro Único no Banco Parceiro (Mockup 07 · 90s)
  const [fullName, setFullName] = useState(customer?.fullName || "Maria Helena Andrade");
  const [email, setEmail] = useState(customer?.email || "maria.helena@fintech.com.br");
  const [cpf, setCpf] = useState(customer?.cpf || "384.920.678-90");
  const [zipCode, setZipCode] = useState(selectedZipCode || "05416-010");
  const [street, setStreet] = useState(customer?.addresses[0]?.street || "Rua Aspicuelta");
  const [number, setNumber] = useState(customer?.addresses[0]?.number || "123");
  const [district, setDistrict] = useState(customer?.addresses[0]?.district || "Pinheiros");
  const [city, setCity] = useState(customer?.addresses[0]?.city || "São Paulo");
  const [state, setState] = useState(selectedState || "SP");

  const [activeOrder, setActiveOrder] = useState<any>(() => {
    return orders.find((o) => o.status === "PENDING_PAYMENT") || null;
  });

  const detailedItems = cart
    .map((entry) => {
      const product = products.find((p) => p.id === entry.productId);
      if (!product) return null;
      const unitBrl = calculateBrlFromFob(product.fobPriceUsd, ptaxRate);
      return {
        ...entry,
        product,
        unitBrl,
        totalBrl: Number((unitBrl * entry.quantity).toFixed(2)),
      };
    })
    .filter((Boolean as unknown) as <T>(x: T | null) => x is T);

  const subtotalBrl = detailedItems.reduce((acc, item) => acc + item.totalBrl, 0);
  const quote = calculateQuote({
    subtotalBrl: activeOrder ? activeOrder.subtotalBrl : subtotalBrl,
    state: state,
  });

  const handleKycSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerCustomerWithKyc({
      fullName,
      email,
      phone: "(11) 98765-4321",
      cpf,
      zipCode,
      street,
      number,
      district,
      city,
      state,
      partnerBank: "INTER",
    });
    setStep("review");
  };

  const handleGeneratePix = () => {
    const order = createOrderFromCart();
    if (order) {
      setActiveOrder(order);
      setStep("pix");
    }
  };

  const handleSimulatePaid = () => {
    if (activeOrder) {
      confirmPixPayment(activeOrder.id);
      navigate(`/pedido-confirmado/${activeOrder.id}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 pt-6 pb-28 space-y-8 animate-fade-in text-left">
      <div className="flex items-center justify-between border-b border-[#C9BFA8] pb-4">
        <div>
          <span className="eyebrow text-[#8B6B30]">Checkout Transparente</span>
          <h1 className="font-serif text-3xl text-[#0A0A0A] dark:text-[#FAF7F2]">
            {step === "kyc" && "Cadastro Único no Banco Parceiro (90s)"}
            {step === "review" && "Resumo do Pedido · Sem Letras Miúdas"}
            {step === "pix" && "Pagamento Pix com Split Automático"}
          </h1>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[#8C8275]">
          <span className={step === "kyc" ? "text-[#8B6B30] font-bold" : ""}>1. Dados</span>
          <span>→</span>
          <span className={step === "review" ? "text-[#8B6B30] font-bold" : ""}>2. Resumo</span>
          <span>→</span>
          <span className={step === "pix" ? "text-[#8B6B30] font-bold" : ""}>3. Pix</span>
        </div>
      </div>

      {/* ETAPA 1: CADASTRO BANCO PARCEIRO (Mockup 07) */}
      {step === "kyc" && (
        <form onSubmit={handleKycSubmit} className="bg-white dark:bg-[#14110E] border border-[#C9BFA8] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="p-4 bg-[#F0EBE0] dark:bg-[#1C1814] rounded-2xl border-l-4 border-[#B8924A] space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#8B6B30]">
              Ambiente Regulado pelo Banco Central
            </span>
            <p className="text-xs text-[#4A4A4A] dark:text-[#FAF7F2]/80 leading-relaxed">
              🔒 Seus dados ficam protegidos no Banco Parceiro. A Portal Estilo Luxo não guarda dados bancários. Você só realiza este cadastro na primeira compra.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-[#8C8275] font-semibold uppercase text-[10px]">Nome Completo</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#FAF7F2] border border-[#C9BFA8] text-sm text-[#0A0A0A] focus:outline-none focus:border-[#B8924A]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#8C8275] font-semibold uppercase text-[10px]">CPF</label>
              <input
                type="text"
                required
                value={cpf}
                onChange={(e) => setCpf(formatCpf(e.target.value))}
                className="w-full p-3 rounded-xl bg-[#FAF7F2] border border-[#C9BFA8] text-sm text-[#0A0A0A] focus:outline-none focus:border-[#B8924A]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#8C8275] font-semibold uppercase text-[10px]">E-mail para Rastreio</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#FAF7F2] border border-[#C9BFA8] text-sm text-[#0A0A0A] focus:outline-none focus:border-[#B8924A]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#8C8275] font-semibold uppercase text-[10px]">CEP de Entrega</label>
              <input
                type="text"
                required
                value={zipCode}
                onChange={(e) => setZipCode(formatCep(e.target.value))}
                className="w-full p-3 rounded-xl bg-[#FAF7F2] border border-[#C9BFA8] text-sm text-[#0A0A0A] focus:outline-none focus:border-[#B8924A]"
              />
            </div>

            <div className="sm:col-span-2 grid grid-cols-3 gap-2">
              <div className="col-span-2 space-y-1">
                <label className="text-[#8C8275] font-semibold uppercase text-[10px]">Rua / Logradouro</label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#FAF7F2] border border-[#C9BFA8] text-sm text-[#0A0A0A] focus:outline-none focus:border-[#B8924A]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[#8C8275] font-semibold uppercase text-[10px]">Número</label>
                <input
                  type="text"
                  required
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#FAF7F2] border border-[#C9BFA8] text-sm text-[#0A0A0A] focus:outline-none focus:border-[#B8924A]"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn-gold w-full text-center py-3.5 text-xs tracking-wider"
          >
            <span>Confirmar e Ir para Resumo →</span>
          </button>
        </form>
      )}

      {/* ETAPA 2: RESUMO DO PEDIDO TRANSPARENTE (Mockup 06) */}
      {step === "review" && (
        <div className="space-y-6">
          <CartSummary quote={quote} showSplitDetails={true} />

          <div className="p-4 rounded-2xl bg-white border border-[#C9BFA8] flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#8C8275] block">Endereço de Entrega</span>
              <span className="font-medium text-[#0A0A0A]">
                {street}, {number} · {district} · {city}/{state}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setStep("kyc")}
              className="text-[#8B6B30] hover:underline font-semibold"
            >
              Alterar
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setStep("kyc")}
              className="btn-outline flex-1 text-center"
            >
              ← Voltar aos Dados
            </button>
            <button
              type="button"
              onClick={handleGeneratePix}
              className="btn-gold flex-[2] text-center py-3.5"
            >
              <span>Pagar com Pix · {formatBrl(quote.totalBrl)}</span>
            </button>
          </div>
        </div>
      )}

      {/* ETAPA 3: PAGAMENTO PIX (Mockup 08) */}
      {step === "pix" && activeOrder && (
        <div className="space-y-6">
          <PixQR
            orderNumber={activeOrder.orderNumber}
            pixKey={activeOrder.pixPayment?.pixKey || ""}
            qrCodeUrl={activeOrder.pixPayment?.qrCodeUrl || ""}
            amountBrl={activeOrder.totalBrl}
            expiresAt={activeOrder.pixPayment?.expiresAt || new Date(Date.now() + 30 * 60 * 1000).toISOString()}
            onSimulatePaid={handleSimulatePaid}
            onRegenerateQr={() => regeneratePixQr(activeOrder.id)}
          />

          <CartSummary quote={quote} showSplitDetails={true} />
        </div>
      )}
    </div>
  );
}

export function OrderConfirmPage() {
  const { id } = useParams<{ id: string }>();
  const { orders } = usePortalStore();
  const order = orders.find((o) => o.id === id || o.orderNumber === id) || orders[0];

  return (
    <div className="max-w-xl mx-auto px-4 py-12 space-y-8 animate-fade-in text-center">
      {/* Checkmark Dourado do Mockup 09 */}
      <div className="w-20 h-20 rounded-full bg-[#B8924A] text-[#0A0A0A] flex items-center justify-center mx-auto shadow-2xl text-3xl font-black">
        ✓
      </div>

      <div className="space-y-2">
        <span className="eyebrow text-[#8B6B30]">Mockup 09 · Confirmação</span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#0A0A0A] dark:text-[#FAF7F2]">
          Pedido Confirmado
        </h1>
        <p className="italic-serif text-xl text-[#8B6B30] font-semibold">
          #{order.orderNumber}
        </p>
      </div>

      {/* Card de Resumo e Split Automático */}
      <div className="bg-white dark:bg-[#14110E] border border-[#C9BFA8] dark:border-[#2A2520] rounded-3xl p-6 space-y-4 text-left shadow-sm">
        <div className="flex justify-between items-baseline border-b border-[#C9BFA8]/60 pb-3">
          <span className="text-xs text-[#8C8275]">Total Pago no Pix:</span>
          <span className="italic-serif text-2xl font-bold text-[#8B6B30]">
            {formatBrl(order.totalBrl)}
          </span>
        </div>

        <div className="p-3 bg-[#0A0A0A] text-[#FAF7F2] rounded-xl text-xs space-y-1 text-center">
          <span className="text-[#D9BE85] font-bold block">Split Regulado Liquidado com Sucesso</span>
          <p className="text-[11px] text-[#C9BFA8]">
            Comissão Portal 20%, Unicentro PY (~71%), Epyx (~5%) e Tributos estaduais processados pelo Banco Parceiro.
          </p>
        </div>

        <div className="space-y-2 text-xs text-[#4A4A4A] dark:text-[#FAF7F2]/80 pt-2">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#8B6B30] shrink-0" />
            <span>Despacho internacional via Correios em até 48h úteis.</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#5B8254] shrink-0" />
            <span>Certificação Remessa Conforme ativa · Sem taxas na entrega.</span>
          </div>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link
          to={`/conta/pedidos/${order.id}`}
          className="btn-gold w-full text-center py-3.5"
        >
          Acompanhar Rastreio Correios →
        </Link>
        <Link
          to="/"
          className="btn-outline w-full text-center py-3.5"
        >
          Voltar à Vitrine
        </Link>
      </div>
    </div>
  );
}

export function LoginPage() {
  return <CheckoutPage />;
}

export function OnboardingPage() {
  return <CheckoutPage />;
}

export function WelcomeSplashPage() {
  return <CartPage />;
}

export function OnboardingSuccessPage() {
  return <CartPage />;
}
