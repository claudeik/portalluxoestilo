// apps/web/src/routes/CheckoutPages.tsx
// Telas de Sacola, Checkout Pix Split, Confirmação de Pedido e Onboarding KYC Banco Parceiro (Flow 4 & Flow 6)

import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ShieldCheck,
  ArrowRight,
  BookmarkCheck,
  CheckCircle2,
  FileText,
  Truck,
  Building2,
  Lock,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { usePortalStore } from "../stores/app.store";
import {
  calculateBrlFromFob,
  calculateQuote,
  formatBrl,
  formatCep,
  formatCpf,
  ICMS_RATES,
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
    selectedZipCode,
    setSelectedState,
    updateCartQty,
    removeFromCart,
    customer,
    saveCartFallback24h,
    savedCartUntil,
  } = usePortalStore();

  const [cepInput, setCepInput] = useState(selectedZipCode);
  const [cepLoading, setCepLoading] = useState(false);

  const detailedItems = cart
    .map((entry) => {
      const product = products.find((p) => p.id === entry.productId);
      if (!product) return null;
      const unitBrl = calculateBrlFromFob(product.fobPriceUsd, ptaxRate);
      return {
        ...entry,
        product,
        unitBrl,
        lineTotalBrl: Number((unitBrl * entry.quantity).toFixed(2)),
      };
    })
    .filter((Boolean as unknown) as <T>(x: T | null) => x is T);

  const subtotalBrl = detailedItems.reduce((acc, i) => acc + i.lineTotalBrl, 0);
  const quote = calculateQuote({
    subtotalBrl,
    state: selectedState,
    zipCode: selectedZipCode,
    exchangeRate: ptaxRate,
  });

  const handleCepLookup = async () => {
    setCepLoading(true);
    const res = await lookupCep(cepInput);
    setCepLoading(false);
    if (res) {
      setSelectedState(res.state, formatCep(cepInput));
    }
  };

  if (detailedItems.length === 0) {
    return (
      <div
        data-testid="empty-cart-state"
        className="max-w-xl mx-auto px-4 pt-12 pb-28 text-center space-y-5"
      >
        <div className="w-16 h-16 rounded-full bg-[#141210] border border-[#C9A961]/40 mx-auto flex items-center justify-center text-[#C9A961]">
          <ShoppingBag className="w-7 h-7" />
        </div>
        <h1 className="font-serif text-3xl text-[#F5EFE6]">Sua sacola está vazia</h1>
        <p className="text-sm text-[#A89F91]">
          Explore nossa curadoria da Unicentro com Imposto Federal R$ 0,00 ou peça 3 sugestões de looks para nossa Assistente IA.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link
            to="/"
            className="px-6 py-3 rounded-xl bg-[#C9A961] text-[#0A0908] font-bold text-sm"
          >
            Explorar Vitrine
          </Link>
          <Link
            to="/conta/assistente"
            className="px-6 py-3 rounded-xl bg-[#141210] border border-[#2A2520] text-[#F5EFE6] font-medium text-sm inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#C9A961]" />
            Usar Assistente IA
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 pt-5 pb-28 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#C9A961] font-semibold">
            Jornada 1 · Preço Final Transparente
          </span>
          <h1 className="font-serif text-3xl text-[#F5EFE6]">
            Sua Sacola ({detailedItems.reduce((a, b) => a + b.quantity, 0)} peças)
          </h1>
        </div>

        <button
          type="button"
          onClick={saveCartFallback24h}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#141210] border border-[#2A2520] hover:border-[#C9A961] text-xs text-[#C9A961]"
        >
          <BookmarkCheck className="w-3.5 h-3.5" />
          <span>Salvar Sacola por 24h (Fallback)</span>
        </button>
      </div>

      {savedCartUntil && (
        <div className="bg-[#C9A961]/10 border border-[#C9A961]/40 rounded-2xl p-3 text-xs text-[#C9A961] flex items-center justify-between">
          <span>
            ✓ Sacola e cotação PTAX salvas por 24 horas caso você queira concluir o cadastro bancário depois.
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Cart Items + Dynamic CEP/State */}
        <div className="lg:col-span-7 space-y-4">
          {detailedItems.map((item) => (
            <div
              key={item.productId}
              data-testid={`cart-item-${item.product.slug}`}
              className="bg-[#141210] border border-[#2A2520] rounded-2xl p-4 flex gap-4"
            >
              <Link
                to={`/produto/${item.product.slug}`}
                className="w-20 h-24 rounded-xl overflow-hidden bg-[#1E1B18] shrink-0"
              >
                <img
                  src={item.product.images[0]?.url}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              </Link>

              <div className="flex-1 flex flex-col justify-between">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link
                      to={`/produto/${item.product.slug}`}
                      className="font-serif text-lg text-[#F5EFE6] hover:text-[#C9A961]"
                    >
                      {item.product.name}
                    </Link>
                    <span className="block text-[11px] text-[#A89F91]">
                      SKU {item.product.sku} · US$ {item.product.fobPriceUsd.toFixed(2)} FOB
                    </span>
                  </div>
                  <button
                    type="button"
                    aria-label="Remover item"
                    data-testid={`remove-item-${item.product.slug}`}
                    onClick={() => removeFromCart(item.productId)}
                    className="p-1.5 text-[#A89F91] hover:text-red-400 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="inline-flex items-center gap-2 bg-[#0A0908] border border-[#2A2520] rounded-xl px-2 py-1">
                    <button
                      type="button"
                      aria-label="Diminuir quantidade"
                      onClick={() => updateCartQty(item.productId, item.quantity - 1)}
                      className="p-1 text-[#A89F91] hover:text-[#F5EFE6]"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span
                      data-testid={`qty-${item.product.slug}`}
                      className="text-xs font-semibold w-5 text-center"
                    >
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      aria-label="Aumentar quantidade"
                      onClick={() => updateCartQty(item.productId, item.quantity + 1)}
                      className="p-1 text-[#A89F91] hover:text-[#F5EFE6]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-bold text-[#F5EFE6]">
                      {formatBrl(item.lineTotalBrl)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Dynamic CEP & State ICMS Calculator (Product Brief §6.1) */}
          <div className="bg-[#141210] border border-[#2A2520] rounded-2xl p-4 space-y-3">
            <h3 className="font-serif text-base text-[#F5EFE6]">
              Simulador de Entrega Correios & ICMS por Estado de Destino
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                value={cepInput}
                onChange={(e) => setCepInput(formatCep(e.target.value))}
                placeholder="01414-001"
                aria-label="CEP de entrega"
                className="px-3.5 py-2 rounded-xl bg-[#0A0908] border border-[#2A2520] text-xs text-[#F5EFE6] w-36 font-mono"
              />
              <button
                type="button"
                onClick={handleCepLookup}
                className="px-3.5 py-2 rounded-xl bg-[#1E1B18] border border-[#C9A961]/40 text-xs text-[#C9A961] font-medium"
              >
                {cepLoading ? "Buscando..." : "Calcular CEP"}
              </button>

              <select
                aria-label="Estado de destino"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#0A0908] border border-[#2A2520] text-xs text-[#F5EFE6]"
              >
                {Object.keys(ICMS_RATES).map((uf) => (
                  <option key={uf} value={uf}>
                    Estado: {uf} (ICMS {Math.round(ICMS_RATES[uf] * 1000) / 10}%)
                  </option>
                ))}
              </select>
            </div>
            <p className="text-[11px] text-[#A89F91]">
              O ICMS é calculado pelo estado de entrega (e não do CPF), evitando divergência fiscal interestadual.
            </p>
          </div>
        </div>

        {/* Right Column: Summary + Checkout CTA */}
        <div className="lg:col-span-5 space-y-4">
          <CartSummary quote={quote} showSplitBreakdown={true} />

          <button
            type="button"
            data-testid="proceed-to-checkout-btn"
            onClick={() => {
              if (!customer || customer.kycStatus !== "APPROVED") {
                navigate("/cadastro?redirect=/checkout");
              } else {
                navigate("/checkout");
              }
            }}
            className="w-full py-4 px-6 rounded-2xl bg-[#C9A961] hover:bg-[#DFC484] text-[#0A0908] font-bold text-sm flex items-center justify-center gap-2 shadow-xl transition"
          >
            <span>
              {customer?.kycStatus === "APPROVED"
                ? "Ir para Pagamento Pix Split"
                : "Continuar · Cadastro Rápido Banco Parceiro"}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <Link
            to="/conta/compartilhar"
            className="w-full py-3 px-4 rounded-xl bg-[#141210] border border-[#2A2520] hover:border-[#C9A961] text-xs text-[#F5EFE6] flex items-center justify-center gap-2 transition"
          >
            <span>Ou transformar esta sacola em Presente Compartilhado com amigas</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export function CheckoutPage() {
  const navigate = useNavigate();
  const {
    customer,
    cart,
    products,
    ptaxRate,
    selectedState,
    selectedZipCode,
    createOrderFromCart,
    confirmPixPayment,
    regeneratePixQr,
    orders,
  } = usePortalStore();

  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

  if (!customer || customer.kycStatus !== "APPROVED") {
    return (
      <div className="max-w-lg mx-auto px-4 pt-12 pb-28 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-[#C9A961]/15 border border-[#C9A961] mx-auto flex items-center justify-center text-[#C9A961]">
          <Lock className="w-5 h-5" />
        </div>
        <h1 className="font-serif text-2xl text-[#F5EFE6]">
          Validação KYC no Banco Parceiro Necessária
        </h1>
        <p className="text-xs text-[#A89F91] leading-relaxed">
          Para operar o Pix Split regulado pelo Banco Central sem custódia pela Portal, precisamos validar seu CPF e endereço uma única vez.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
          <Link
            to="/cadastro?redirect=/checkout"
            className="px-5 py-3 rounded-xl bg-[#C9A961] text-[#0A0908] font-bold text-xs"
          >
            Fazer Cadastro Simplificado (3 etapas)
          </Link>
          <button
            type="button"
            onClick={() => usePortalStore.getState().loginAsMarina()}
            className="px-5 py-3 rounded-xl bg-[#141210] border border-[#2A2520] text-[#F5EFE6] text-xs"
          >
            Entrar como Marina (KYC já Aprovado)
          </button>
        </div>
      </div>
    );
  }

  const activeOrder = activeOrderId
    ? orders.find((o) => o.id === activeOrderId) || null
    : null;

  const subtotalBrl = cart.reduce((acc, item) => {
    const p = products.find((prod) => prod.id === item.productId);
    return acc + (p ? calculateBrlFromFob(p.fobPriceUsd, ptaxRate) * item.quantity : 0);
  }, 0);

  const quote = calculateQuote({
    subtotalBrl,
    state: selectedState,
    zipCode: selectedZipCode,
    exchangeRate: ptaxRate,
  });

  const handleGeneratePix = () => {
    const created = createOrderFromCart();
    if (created) {
      setActiveOrderId(created.id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pt-5 pb-28 space-y-6">
      <div>
        <span className="text-[10px] uppercase tracking-widest text-[#C9A961] font-semibold">
          Checkout Regulado · Reserva de Estoque 15 min
        </span>
        <h1 className="font-serif text-3xl text-[#F5EFE6]">Finalizar Pedido com Pix Split</h1>
      </div>

      {/* Customer KYC + Delivery Address Card */}
      <div className="bg-[#141210] border border-[#2A2520] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[#F5EFE6]">{customer.fullName}</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-[10px] font-semibold">
              KYC Banco Parceiro Aprovado
            </span>
          </div>
          <p className="text-xs text-[#A89F91]">
            CPF {customer.cpf} · Entrega em{" "}
            {customer.addresses[0]
              ? `${customer.addresses[0].street}, ${customer.addresses[0].number} — ${customer.addresses[0].city}/${customer.addresses[0].state} (${customer.addresses[0].zipCode})`
              : `Estado ${selectedState}`}
          </p>
        </div>
        <Link to="/conta/enderecos" className="text-xs text-[#C9A961] hover:underline">
          Alterar endereço
        </Link>
      </div>

      {!activeOrder ? (
        <div className="space-y-5">
          <CartSummary quote={quote} showSplitBreakdown={true} />

          <button
            type="button"
            data-testid="generate-pix-btn"
            onClick={handleGeneratePix}
            className="w-full py-4 px-6 rounded-2xl bg-[#C9A961] hover:bg-[#DFC484] text-[#0A0908] font-bold text-base shadow-xl transition flex items-center justify-center gap-2"
          >
            <span>Gerar QR Code Pix ({formatBrl(quote.totalBrl)})</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <PixQR
          orderNumber={activeOrder.orderNumber}
          pixKey={activeOrder.pixPayment?.pixKey || ""}
          qrCodeUrl={activeOrder.pixPayment?.qrCodeUrl || ""}
          amountBrl={activeOrder.totalBrl}
          expiresAt={
            activeOrder.pixPayment?.expiresAt ||
            new Date(Date.now() + 15 * 60 * 1000).toISOString()
          }
          onSimulatePaid={() => {
            confirmPixPayment(activeOrder.id);
            navigate(`/checkout/confirmacao/${activeOrder.id}`);
          }}
          onRegenerateQr={() => regeneratePixQr(activeOrder.id)}
        />
      )}
    </div>
  );
}

export function OrderConfirmPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { orders } = usePortalStore();
  const order = orders.find((o) => o.id === orderId || o.orderNumber === orderId) || orders[0];

  return (
    <div
      data-testid="order-confirmation-page"
      className="max-w-2xl mx-auto px-4 pt-8 pb-28 space-y-6"
    >
      <div className="bg-[#141210] border border-[#C9A961]/50 rounded-3xl p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 mx-auto flex items-center justify-center text-emerald-400">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <span className="px-3 py-1 rounded-full bg-[#C9A961]/15 text-[#C9A961] text-xs font-semibold">
          Pagamento Confirmado · Split Pix Liquidado
        </span>

        <h1 className="font-serif text-3xl sm:text-4xl text-[#F5EFE6]">
          Pedido {order?.orderNumber} Confirmado!
        </h1>

        <p className="text-xs sm:text-sm text-[#A89F91] max-w-md mx-auto leading-relaxed">
          O Banco Parceiro confirmou seu Pix, liquidou o split com a Unicentro e o ERP Bling já emitiu sua Nota Fiscal Eletrônica e etiqueta internacional dos Correios.
        </p>

        {/* NF-e Bling + Etiqueta Correios Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-2">
          <div className="bg-[#0A0908] border border-[#2A2520] rounded-2xl p-3.5 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-[#C9A961] font-semibold">
              <FileText className="w-4 h-4" />
              <span>NF-e Emitida (Bling ERP)</span>
            </div>
            <p className="text-xs text-[#F5EFE6] font-mono">
              Nº {order?.invoiceNumber || "000.429104"}
            </p>
            <p className="text-[10px] text-[#A89F91] truncate font-mono">
              Chave: {order?.invoiceKey || "35261012345678000199550010004291041009876543"}
            </p>
          </div>

          <div className="bg-[#0A0908] border border-[#2A2520] rounded-2xl p-3.5 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
              <Truck className="w-4 h-4" />
              <span>Rastreio Correios SRO-eXML</span>
            </div>
            <p
              data-testid="confirm-tracking-code"
              className="text-xs text-[#F5EFE6] font-mono font-bold"
            >
              {order?.trackingCode || "RR482910384PY"}
            </p>
            <p className="text-[10px] text-[#A89F91]">
              Remessa Conforme · Imposto Federal R$ 0,00
            </p>
          </div>
        </div>

        <div className="pt-3 flex flex-col sm:flex-row gap-3">
          <Link
            to={`/conta/pedidos/${order?.id || "PEL-2026-0842"}`}
            className="flex-1 py-3.5 px-5 rounded-xl bg-[#C9A961] text-[#0A0908] font-bold text-xs sm:text-sm"
          >
            Acompanhar Timeline Correios (5 Etapas)
          </Link>
          <Link
            to="/"
            className="py-3.5 px-5 rounded-xl bg-[#0A0908] border border-[#2A2520] text-[#F5EFE6] text-xs sm:text-sm"
          >
            Voltar à Vitrine
          </Link>
        </div>
      </div>
    </div>
  );
}

export function LoginPage() {
  const navigate = useNavigate();
  const { loginAsMarina } = usePortalStore();
  const [email, setEmail] = useState("marina.albuquerque@gmail.com");

  return (
    <div className="max-w-md mx-auto px-4 pt-10 pb-28 space-y-6">
      <div className="text-center space-y-2">
        <span className="text-[10px] uppercase tracking-widest text-[#C9A961] font-semibold">
          Portal Estilo Luxo · Acesso Seguro
        </span>
        <h1 className="font-serif text-3xl text-[#F5EFE6]">Entrar na Sua Conta</h1>
        <p className="text-xs text-[#A89F91]">
          Acesse seus pedidos, rastreio Correios e looks salvos na Assistente IA.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          loginAsMarina();
          navigate("/conta");
        }}
        className="bg-[#141210] border border-[#2A2520] rounded-3xl p-6 space-y-4"
      >
        <div className="space-y-1.5">
          <label className="text-xs text-[#A89F91]">E-mail</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[#0A0908] border border-[#2A2520] text-sm text-[#F5EFE6]"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-xl bg-[#C9A961] text-[#0A0908] font-bold text-sm"
        >
          Entrar como Marina (KYC Aprovado)
        </button>

        <div className="pt-3 border-t border-[#2A2520] text-center">
          <Link to="/cadastro" className="text-xs text-[#C9A961] hover:underline">
            Primeira compra? Faça o cadastro simplificado no Banco Parceiro →
          </Link>
        </div>
      </form>
    </div>
  );
}

export function OnboardingPage() {
  const navigate = useNavigate();
  const { registerCustomerWithKyc, saveCartFallback24h } = usePortalStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [fullName, setFullName] = useState("Marina Albuquerque");
  const [email, setEmail] = useState("marina.albuquerque@gmail.com");
  const [phone, setPhone] = useState("(11) 99412-8830");
  const [cpf, setCpf] = useState("390.533.447-05"); // Valid mod-11 CPF or user input
  const [zipCode, setZipCode] = useState("01414-001");
  const [street, setStreet] = useState("Rua Oscar Freire");
  const [number, setNumber] = useState("1120");
  const [district, setDistrict] = useState("Jardins");
  const [city, setCity] = useState("São Paulo");
  const [state, setState] = useState("SP");
  const [partnerBank, setPartnerBank] = useState<"CELCOIN" | "STONE" | "INTER">("CELCOIN");
  const [lgpdConsent, setLgpdConsent] = useState(true);

  const cpfValid = isValidCpf(cpf) || cpf === "123.456.789-00" || cpf.replace(/\D/g, "").length === 11;

  const handleCepBlur = async () => {
    const found = await lookupCep(zipCode);
    if (found) {
      setStreet(found.street);
      setDistrict(found.district);
      setCity(found.city);
      setState(found.state);
    }
  };

  const handleCompleteOnboarding = (e: React.FormEvent) => {
    e.preventDefault();
    registerCustomerWithKyc({
      fullName,
      email,
      phone,
      cpf,
      zipCode,
      street,
      number,
      district,
      city,
      state,
      partnerBank,
    });
    navigate("/cadastro/sucesso");
  };

  return (
    <div className="max-w-xl mx-auto px-4 pt-6 pb-28 space-y-6">
      <div className="space-y-2">
        <span className="text-[10px] uppercase tracking-widest text-[#C9A961] font-semibold">
          Fluxo 6 · Critical Path Jornada 1 (1 vez só · 3 etapas rápidas)
        </span>
        <h1 className="font-serif text-3xl text-[#F5EFE6]">
          Cadastro Simplificado & KYC Banco Parceiro
        </h1>
        <p className="text-xs text-[#A89F91]">
          Exigido pela regulamentação de câmbio/Remessa Conforme para emitir sua NF-e e liquidar o Pix Split sem taxas ocultas.
        </p>
      </div>

      {/* Social Login A/B Test (Product Brief §6.3 Mitigation) */}
      <div className="bg-[#141210] border border-[#2A2520] rounded-2xl p-4 space-y-2.5">
        <span className="text-[10px] uppercase tracking-wider text-[#C9A961] font-semibold">
          Acelerador de Conversão (A/B Test Login Social)
        </span>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => setStep(2)}
            className="py-2.5 px-3 rounded-xl bg-[#0A0908] border border-[#2A2520] hover:border-[#C9A961] text-xs font-medium text-[#F5EFE6]"
          >
            Continuar com Google
          </button>
          <button
            type="button"
            onClick={() => setStep(2)}
            className="py-2.5 px-3 rounded-xl bg-[#0A0908] border border-[#2A2520] hover:border-[#C9A961] text-xs font-medium text-[#F5EFE6]"
          >
            Continuar com Apple
          </button>
        </div>
      </div>

      {/* Stepper Header */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { num: 1, title: "1. Identificação CPF" },
          { num: 2, title: "2. Endereço Correios" },
          { num: 3, title: "3. KYC Banco Split" },
        ].map((s) => (
          <button
            key={s.num}
            type="button"
            onClick={() => setStep(s.num as 1 | 2 | 3)}
            className={`py-2 px-3 rounded-xl text-xs font-medium border text-left transition ${
              step === s.num
                ? "bg-[#C9A961] text-[#0A0908] border-[#C9A961] font-bold"
                : "bg-[#141210] border-[#2A2520] text-[#A89F91]"
            }`}
          >
            {s.title}
          </button>
        ))}
      </div>

      <form
        onSubmit={handleCompleteOnboarding}
        className="bg-[#141210] border border-[#2A2520] rounded-3xl p-6 space-y-4"
      >
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-[#A89F91] mb-1">Nome Completo</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#0A0908] border border-[#2A2520] text-sm text-[#F5EFE6]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-[#A89F91] mb-1">
                  CPF (para Remessa Conforme)
                </label>
                <input
                  type="text"
                  required
                  value={cpf}
                  onChange={(e) => setCpf(formatCpf(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl bg-[#0A0908] border border-[#2A2520] text-sm text-[#F5EFE6] font-mono"
                />
                {!cpfValid && (
                  <span className="text-[11px] text-amber-400 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" /> Digite os 11 dígitos do CPF
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs text-[#A89F91] mb-1">WhatsApp / Celular</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#0A0908] border border-[#2A2520] text-sm text-[#F5EFE6]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-[#A89F91] mb-1">E-mail</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#0A0908] border border-[#2A2520] text-sm text-[#F5EFE6]"
              />
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full py-3.5 rounded-xl bg-[#C9A961] text-[#0A0908] font-bold text-sm"
            >
              Continuar para Endereço de Entrega →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-[#A89F91] mb-1">
                  CEP (Busca ViaCEP &le;500ms)
                </label>
                <input
                  type="text"
                  required
                  value={zipCode}
                  onChange={(e) => setZipCode(formatCep(e.target.value))}
                  onBlur={handleCepBlur}
                  className="w-full px-4 py-3 rounded-xl bg-[#0A0908] border border-[#2A2520] text-sm text-[#F5EFE6] font-mono"
                />
              </div>
              <div>
                <label className="block text-xs text-[#A89F91] mb-1">UF (Define ICMS)</label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#0A0908] border border-[#2A2520] text-sm text-[#F5EFE6]"
                >
                  {Object.keys(ICMS_RATES).map((uf) => (
                    <option key={uf} value={uf}>
                      {uf} ({Math.round(ICMS_RATES[uf] * 1000) / 10}%)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block text-xs text-[#A89F91] mb-1">Rua / Logradouro</label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#0A0908] border border-[#2A2520] text-sm text-[#F5EFE6]"
                />
              </div>
              <div>
                <label className="block text-xs text-[#A89F91] mb-1">Número</label>
                <input
                  type="text"
                  required
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#0A0908] border border-[#2A2520] text-sm text-[#F5EFE6]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-[#A89F91] mb-1">Bairro</label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#0A0908] border border-[#2A2520] text-sm text-[#F5EFE6]"
                />
              </div>
              <div>
                <label className="block text-xs text-[#A89F91] mb-1">Cidade</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#0A0908] border border-[#2A2520] text-sm text-[#F5EFE6]"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep(3)}
              className="w-full py-3.5 rounded-xl bg-[#C9A961] text-[#0A0908] font-bold text-sm"
            >
              Continuar para Validação KYC →
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="bg-[#0A0908] border border-[#2A2520] rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs text-[#C9A961] font-semibold">
                <Building2 className="w-4 h-4" />
                <span>Pipeline de Bancos Parceiros homologados (ADR-0005)</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(["CELCOIN", "STONE", "INTER"] as const).map((bank) => (
                  <button
                    key={bank}
                    type="button"
                    onClick={() => setPartnerBank(bank)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border ${
                      partnerBank === bank
                        ? "bg-[#C9A961]/20 border-[#C9A961] text-[#C9A961]"
                        : "border-[#2A2520] text-[#A89F91]"
                    }`}
                  >
                    {bank}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-[#A89F91]">
                Seus dados trafegam via TLS 1.3 diretamente com o liquidante do Pix Split.
              </p>
            </div>

            <label className="flex items-start gap-2.5 text-xs text-[#A89F91] cursor-pointer">
              <input
                type="checkbox"
                checked={lgpdConsent}
                onChange={(e) => setLgpdConsent(e.target.checked)}
                className="mt-0.5"
              />
              <span>
                Concordo com o processamento dos meus dados para emissão de NF-e, despacho Remessa Conforme e liquidação Pix Split conforme a LGPD (Art. 7º).
              </span>
            </label>

            <button
              type="submit"
              data-testid="submit-kyc-btn"
              className="w-full py-4 rounded-xl bg-[#C9A961] hover:bg-[#DFC484] text-[#0A0908] font-bold text-sm shadow-lg"
            >
              Aprovar KYC Instantaneamente e Ir para o Checkout
            </button>
          </div>
        )}
      </form>

      {/* Fallback 24h Cart Preservation (Product Brief §3.1) */}
      <div className="text-center">
        <button
          type="button"
          onClick={() => {
            saveCartFallback24h();
            navigate("/carrinho");
          }}
          className="text-xs text-[#A89F91] hover:text-[#C9A961] underline"
        >
          Não está com documento agora? Salvar carrinho por 24h e retomar depois
        </button>
      </div>
    </div>
  );
}

export function WelcomeSplashPage() {
  return (
    <div
      data-testid="welcome-splash-page"
      className="max-w-md mx-auto px-4 pt-6 pb-28"
    >
      <div className="relative min-h-[560px] rounded-[32px] overflow-hidden border border-[#2A2520] flex flex-col justify-between p-7 bg-[#0A0908] shadow-2xl">
        <img
          src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=85"
          alt="Editorial Portal Estilo Luxo"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0908] via-[#0A0908]/65 to-transparent" />

        {/* 2 · Wordmark */}
        <div className="relative z-10 text-center pt-2">
          <span className="text-xs tracking-[0.22em] text-[#C9A961] font-semibold uppercase">
            PORTAL ESTILO LUXO
          </span>
        </div>

        {/* 3 · Title Playfair Italic + 4 · Eyebrow + 5 · CTA Começar + 6 · Link Entrar */}
        <div className="relative z-10 space-y-5 text-center">
          <div className="space-y-2">
            <h1 className="font-serif italic text-3xl sm:text-4xl text-[#F5EFE6] leading-snug font-normal">
              Curadoria de estilo do Paraguai para o Brasil.
            </h1>
            <p className="eyebrow !text-[10px]">
              ACESSÓRIOS ATÉ US$ 50 · ENTREGA PELOS CORREIOS
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <Link to="/cadastro" className="btn-gold w-full text-sm">
              Começar
            </Link>
            <Link
              to="/login"
              className="block text-xs text-[#8A8278] hover:text-[#F5EFE6] hover:underline"
            >
              Já tem conta? Entrar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function OnboardingSuccessPage() {
  const { customer } = usePortalStore();

  return (
    <div className="max-w-lg mx-auto px-4 pt-10 pb-28 text-center space-y-6">
      {/* .success-check 60px gold circle with glow */}
      <div className="success-check mx-auto">
        <ShieldCheck className="w-8 h-8" />
      </div>

      <span className="inline-block px-3.5 py-1 rounded-full bg-[#C9A961]/15 border border-[#C9A961]/40 text-[#C9A961] text-xs font-semibold">
        ✦ Bônus Primeira Compra: Frete Correios Prioritário Ativo
      </span>

      <div className="space-y-2">
        <h1 className="font-serif text-3xl text-[#F5EFE6]">Conta Pronta para Comprar!</h1>
        <p className="text-sm text-[#C9C2B6]">
          Parabéns, <strong>{customer?.fullName}</strong>! Seu cadastro único foi validado no Banco Parceiro ({customer?.kycExternalId}). Nas próximas compras você pula direto para o QR Pix.
        </p>
      </div>

      {/* Menu de atalhos (Flow 06 · README_Produto.pdf §3.6) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
        <Link
          to="/conta/assistente"
          className="bg-[#14110E] border border-[#2A2520] hover:border-[#C9A961] rounded-2xl p-4 space-y-1 transition"
        >
          <span className="eyebrow !text-[9px]">Atalho 1</span>
          <h3 className="font-serif text-lg text-[#F5EFE6]">Assistente IA</h3>
          <p className="text-[11px] text-[#8A8278]">Envie sua foto e veja 3 looks</p>
        </Link>
        <Link
          to="/"
          className="bg-[#14110E] border border-[#2A2520] hover:border-[#C9A961] rounded-2xl p-4 space-y-1 transition"
        >
          <span className="eyebrow !text-[9px]">Atalho 2</span>
          <h3 className="font-serif text-lg text-[#F5EFE6]">Curadoria</h3>
          <p className="text-[11px] text-[#8A8278]">Peças até US$ 45 FOB</p>
        </Link>
        <Link
          to="/mais-vendidos"
          className="bg-[#14110E] border border-[#2A2520] hover:border-[#C9A961] rounded-2xl p-4 space-y-1 transition"
        >
          <span className="eyebrow !text-[9px]">Atalho 3</span>
          <h3 className="font-serif text-lg text-[#F5EFE6]">Mais Vendidos</h3>
          <p className="text-[11px] text-[#8A8278]">Top 5 semanal do Brasil</p>
        </Link>
      </div>

      <div className="flex justify-center pt-2">
        <Link to="/checkout" className="btn-gold px-8 text-sm">
          Ir Direto para o QR Code Pix →
        </Link>
      </div>
    </div>
  );
}
