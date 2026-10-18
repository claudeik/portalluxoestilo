// apps/web/src/routes/CatalogPages.tsx
// Telas de Vitrine e Catálogo · Portal Estilo Luxo (Volume I · Pitch Editorial)
// Mockups 01, 02, 03 e 04 · Creme Editorial (#FAF7F2), Playfair Display e Cormorant Garamond

import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Sparkles,
  ShieldCheck,
  SlidersHorizontal,
  Search,
  ArrowLeft,
  Heart,
  ShoppingBag,
  Truck,
  CheckCircle2,
  Share2,
  Layers,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { usePortalStore, CATEGORIES } from "../stores/app.store";
import { ProductCard } from "../components/catalog/ProductCard";
import { calculateBrlFromFob, calculateQuote, formatBrl, formatUsd } from "../lib/format";
import { PERSONAS } from "../data/catalog.data";

export function HomePage() {
  const { products, selectedState, ptaxRate, currentPersona, switchPersona } = usePortalStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [maxPriceBrl, setMaxPriceBrl] = useState<number>(250);
  const [sortBy, setSortBy] = useState<"relevant" | "price_asc" | "price_desc">("relevant");

  const activePersona = PERSONAS[currentPersona];

  const filteredProducts = products
    .filter((p) => {
      const brl = calculateBrlFromFob(p.fobPriceUsd, ptaxRate);
      if (brl > maxPriceBrl) return false;
      if (selectedCategory !== "ALL" && p.categorySlug !== selectedCategory) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price_asc") return a.fobPriceUsd - b.fobPriceUsd;
      if (sortBy === "price_desc") return b.fobPriceUsd - a.fobPriceUsd;
      return (a.weeklyRank || 99) - (b.weeklyRank || 99);
    });

  return (
    <div className="max-w-5xl mx-auto px-4 pt-4 pb-28 space-y-10 animate-fade-in">
      {/* Mockup 01 · Hero Banner Editorial da Safra */}
      <section className="relative rounded-3xl overflow-hidden bg-[#0A0A0A] text-[#FAF7F2] p-6 sm:p-10 border border-[#B8924A]/40 shadow-xl">
        <div className="max-w-2xl space-y-4 relative z-10 text-left">
          <div className="flex flex-wrap items-center gap-2">
            <span className="eyebrow text-[#D9BE85]">Nova Curadoria · Safra Primavera</span>
            <span className="text-[10px] font-mono text-[#8C8275]">
              · Edição Outubro 2026
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-normal leading-[1.1] text-[#FAF7F2]">
            Acessórios do Paraguai até{" "}
            <em className="italic text-[#D9BE85] font-normal">R$ 250</em>
          </h1>

          <p className="italic-serif text-base sm:text-lg text-[#FAF7F2]/80 leading-relaxed max-w-xl">
            "Curadoria é o novo luxo acessível. Peças selecionadas em Ciudad del Este com preço final transparente na tela, isenção Remessa Conforme e entrega rastreada pelos Correios."
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href="#catalogo"
              className="btn-gold"
            >
              <span>Ver Curadoria Completa</span>
              <ChevronRight className="w-4 h-4" />
            </a>

            <Link
              to="/estudo"
              className="btn-outline border-[#D9BE85] text-[#D9BE85] hover:bg-[#D9BE85]/10"
            >
              <BookOpen className="w-4 h-4" />
              <span>Ler Tese do Estudo</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Seletor Rápido de Persona (Experiência Interativa) */}
      <section className="p-4 sm:p-5 bg-white dark:bg-[#14110E] border border-[#C9BFA8] dark:border-[#2A2520] rounded-2xl shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#B8924A]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#0A0A0A] dark:text-[#FAF7F2]">
              Jornada Ativa: {activePersona.name} ({activePersona.age} anos · {activePersona.profession})
            </span>
          </div>
          <span className="text-[11px] text-[#8C8275] hidden sm:inline">
            Clique para alternar a perspectiva da cliente
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {Object.values(PERSONAS).map((p) => {
            const isSel = currentPersona === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => switchPersona(p.id)}
                className={`p-3 rounded-xl border text-left transition flex items-center gap-3 ${
                  isSel
                    ? "bg-[#FAF7F2] dark:bg-[#1C1814] border-[#B8924A] shadow-sm ring-1 ring-[#B8924A]"
                    : "bg-[#F0EBE0]/60 dark:bg-[#14110E] border-[#C9BFA8]/60 hover:border-[#B8924A]"
                }`}
              >
                <img src={p.avatar} alt={p.name} className="w-9 h-9 rounded-full object-cover shrink-0" />
                <div className="flex-1 truncate">
                  <div className="font-serif text-xs font-semibold text-[#0A0A0A] dark:text-[#FAF7F2] truncate">
                    {p.name}
                  </div>
                  <div className="text-[10px] text-[#8C8275] truncate">{p.tagline}</div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Mockup 01 · Categorias da Curadoria */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="eyebrow text-[#0A0A0A] dark:text-[#FAF7F2]">6 Categorias Curadas</span>
          <span className="text-xs text-[#8C8275]">Tudo abaixo de US$ 45 FOB</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(isSelected ? "ALL" : cat.slug)}
                className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                  isSelected
                    ? "bg-[#0A0A0A] text-[#FAF7F2] border-[#0A0A0A] shadow-md"
                    : "bg-white dark:bg-[#14110E] border-[#C9BFA8] text-[#0A0A0A] dark:text-[#FAF7F2] hover:border-[#B8924A]"
                }`}
              >
                <span className="font-serif text-xs font-medium">{cat.name}</span>
                <span className="text-[9px] text-[#8C8275] line-clamp-1">{((cat.description || "").split)("(")[1]?.replace(")", "") || "Curado"}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Mockup 03 · Vitrine Editorial: A Escolha da Editora */}
      <section className="rounded-3xl bg-[#0A0A0A] text-[#FAF7F2] p-6 sm:p-8 border border-[#B8924A]/40 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#B8924A]/30 pb-4">
          <div>
            <span className="italic-serif text-sm text-[#D9BE85]">Editorial · Outubro 2026</span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#FAF7F2] font-normal">
              A Escolha da <em className="italic text-[#D9BE85]">Editora</em>
            </h2>
          </div>
          <p className="text-xs text-[#C9BFA8] max-w-sm leading-relaxed">
            Oito peças selecionadas a partir de fornecedores certificados de Ciudad del Este. Bijuterias banhadas a ouro 18k, lenços em viscose e bolsas de palha trançada.
          </p>
        </div>

        {/* 4 Destaques da Safra */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {products.slice(0, 4).map((p) => {
            const price = calculateBrlFromFob(p.fobPriceUsd, ptaxRate);
            const rawImg = (p as any).images?.[0];
            const imgUrl = typeof rawImg === "string" ? rawImg : rawImg?.url || "";
            return (
              <Link
                key={p.id}
                to={`/produto/${p.slug}`}
                className="group p-3 rounded-xl bg-[#14110E] border border-[#2A2520] hover:border-[#B8924A] transition space-y-2 block"
              >
                <div className="aspect-[4/5] rounded-lg overflow-hidden bg-[#1C1814]">
                  <img
                    src={imgUrl}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="space-y-0.5">
                  <div className="text-[10px] text-[#8C8275] uppercase">{p.categoryName}</div>
                  <div className="font-serif text-xs text-[#FAF7F2] truncate group-hover:text-[#D9BE85] transition">
                    {p.name}
                  </div>
                  <div className="italic-serif text-sm font-bold text-[#D9BE85]">
                    {formatBrl(price)}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Grade Principal de Produtos */}
      <section id="catalogo" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#C9BFA8] pb-3">
          <div>
            <h2 className="font-serif text-2xl text-[#0A0A0A] dark:text-[#FAF7F2]">
              Safra Primavera 2026
            </h2>
            <span className="text-xs text-[#8C8275]">
              {filteredProducts.length} peças disponíveis com preço final na tela
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-[#8C8275]">Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white dark:bg-[#14110E] border border-[#C9BFA8] dark:border-[#2A2520] rounded-lg px-2.5 py-1.5 text-xs text-[#0A0A0A] dark:text-[#FAF7F2]"
            >
              <option value="relevant">Mais Relevantes</option>
              <option value="price_asc">Menor Preço</option>
              <option value="price_desc">Maior Preço</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Banner de Garantia Remessa Conforme & Entrega Correios */}
      <section className="p-6 bg-[#F0EBE0] dark:bg-[#14110E] border border-[#C9BFA8] dark:border-[#2A2520] rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-[#5B8254] shrink-0" />
          <div>
            <span className="font-serif font-bold text-sm text-[#0A0A0A] dark:text-[#FAF7F2] block">
              Remessa Conforme Oficial
            </span>
            <span className="text-xs text-[#4A4A4A]">Imposto Federal R$ 0,00 até US$ 50</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Truck className="w-8 h-8 text-[#8B6B30] shrink-0" />
          <div>
            <span className="font-serif font-bold text-sm text-[#0A0A0A] dark:text-[#FAF7F2] block">
              Correios Rastreável
            </span>
            <span className="text-xs text-[#4A4A4A]">Entrega em 10 a 15 dias sem surpresa</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-[#B8924A] shrink-0" />
          <div>
            <span className="font-serif font-bold text-sm text-[#0A0A0A] dark:text-[#FAF7F2] block">
              Curadoria com Ritual
            </span>
            <span className="text-xs text-[#4A4A4A]">Papel seda e cartão assinado</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { products, ptaxRate } = usePortalStore();
  const category = CATEGORIES.find((c) => c.slug === slug) || CATEGORIES[0];
  const catProducts = products.filter((p) => p.categorySlug === category.slug);

  return (
    <div className="max-w-5xl mx-auto px-4 pt-6 pb-28 space-y-8 animate-fade-in">
      <div className="flex items-center justify-between border-b border-[#C9BFA8] pb-4">
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-xs text-[#8C8275] hover:text-[#0A0A0A] mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar à Vitrine</span>
          </Link>
          <h1 className="font-serif text-3xl text-[#0A0A0A] dark:text-[#FAF7F2]">
            {category.name}
          </h1>
          <p className="italic-serif text-sm text-[#8B6B30] mt-1">
            {catProducts.length} peças selecionadas nesta safra · {category.description}
          </p>
        </div>

        <div className="text-right hidden sm:block">
          <span className="text-[10px] uppercase font-mono tracking-wider text-[#5B8254] bg-[#5B8254]/10 px-2.5 py-1 rounded-full">
            Isenção Federal Confirmada
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {catProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { products, ptaxRate, addToCart, wishlistIds, toggleWishlist, selectedState } = usePortalStore();

  const product = products.find((p) => p.slug === slug) || products[0];
  const isWishlisted = wishlistIds.includes(product.id);
  const priceBrl = calculateBrlFromFob(product.fobPriceUsd, ptaxRate);

  const rawImages = (product as any).images || [];
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const quote = calculateQuote({
    subtotalBrl: priceBrl,
    state: selectedState,
  });

  const getImgUrl = (img: any) => (typeof img === "string" ? img : img?.url || "");

  return (
    <div className="max-w-4xl mx-auto px-4 pt-6 pb-28 space-y-8 animate-fade-in">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs text-[#8C8275] hover:text-[#0A0A0A]"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar ao catálogo</span>
      </Link>

      {/* Mockup 04 · Estrutura Vertical de Produto de Revista */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Galeria de Fotos em Estúdio */}
        <div className="space-y-3">
          <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-[#F0EBE0] border border-[#C9BFA8] relative shadow-md">
            <img
              src={getImgUrl(rawImages[activeImageIndex])}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-3 left-3 bg-[#FAF7F2]/90 backdrop-blur-sm text-[#0A0A0A] text-[9px] uppercase font-mono tracking-wider px-2 py-0.5 rounded">
              Fotografia de Estúdio Oficial
            </span>
          </div>

          {rawImages.length > 1 && (
            <div className="flex gap-2">
              {rawImages.map((img: any, idx: number) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-16 h-20 rounded-xl overflow-hidden border transition ${
                    activeImageIndex === idx ? "border-[#B8924A] ring-2 ring-[#B8924A]/30" : "border-[#C9BFA8] opacity-70"
                  }`}
                >
                  <img src={getImgUrl(img)} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Detalhes Editoriais do Produto */}
        <div className="space-y-6 text-left">
          <div className="space-y-2 border-b border-[#C9BFA8] pb-4">
            <span className="eyebrow text-[#8B6B30]">{product.categoryName}</span>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#0A0A0A] dark:text-[#FAF7F2] font-normal leading-tight">
              {product.name}
            </h1>
            <div className="flex items-baseline gap-3 pt-1">
              <span className="italic-serif text-3xl font-bold text-[#8B6B30] dark:text-[#D9BE85]">
                {formatBrl(priceBrl)}
              </span>
              <span className="text-xs text-[#8C8275] font-mono">
                ({formatUsd(product.fobPriceUsd)} FOB)
              </span>
            </div>
          </div>

          {/* Descrição Editorial (~90 palavras conforme estudo) */}
          <div className="space-y-3 text-xs sm:text-sm text-[#4A4A4A] dark:text-[#FAF7F2]/80 leading-relaxed">
            <span className="text-[10px] uppercase font-bold text-[#8C8275] tracking-wider block">
              Curadoria & Styling
            </span>
            <p className="italic-serif text-base text-[#2C2C2C] dark:text-[#FAF7F2]/90 leading-relaxed">
              "{product.editorialNote || product.tagline}"
            </p>
            <div className="text-xs text-[#8C8275] pt-1">
              <strong>Composição:</strong> {product.material || "Matéria-prima nobre selecionada"} · {product.color || "Acabamento artesanal"}
            </div>
          </div>

          {/* Prévia Transparente de Entrega & Tributos (Sem Surpresas) */}
          <div className="p-4 rounded-2xl bg-[#F0EBE0] dark:bg-[#14110E] border border-[#C9BFA8] space-y-2 text-xs">
            <div className="flex items-center justify-between text-[#8B6B30] font-semibold">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#5B8254]" />
                <span>Remessa Conforme Unicentro PY</span>
              </span>
              <span className="text-[#5B8254] font-mono">II Federal: R$ 0,00</span>
            </div>
            <div className="flex justify-between text-[#4A4A4A]">
              <span>Frete Correios Internacional:</span>
              <span>{formatBrl(quote.shippingBrl)}</span>
            </div>
            <div className="flex justify-between text-[#4A4A4A]">
              <span>ICMS {selectedState} (17% por dentro):</span>
              <span>{formatBrl(quote.icmsBrl)}</span>
            </div>
            <div className="pt-2 border-t border-[#C9BFA8]/60 flex justify-between font-bold text-[#0A0A0A] dark:text-[#FAF7F2]">
              <span>Total Estimado no Resumo:</span>
              <span className="italic-serif text-base text-[#8B6B30]">{formatBrl(quote.totalBrl)}</span>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                addToCart(product.id, 1);
                navigate("/carrinho");
              }}
              className="btn-gold flex-1 text-center"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Comprar · {formatBrl(priceBrl)}</span>
            </button>

            <button
              type="button"
              aria-label="Salvar nos favoritos"
              onClick={() => toggleWishlist(product.id)}
              className={`p-3 rounded-xl border transition ${
                isWishlisted
                  ? "bg-[#FAF7F2] border-[#B8924A] text-[#B8924A]"
                  : "border-[#C9BFA8] text-[#8C8275] hover:border-[#0A0A0A]"
              }`}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? "fill-[#B8924A]" : ""}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SearchPage() {
  const { products, ptaxRate } = usePortalStore();
  const [query, setQuery] = useState("");

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.categoryName.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 pt-6 pb-28 space-y-6 animate-fade-in">
      <div className="relative">
        <Search className="w-5 h-5 absolute left-3 top-3 text-[#8C8275]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar lenço, brinco, bolsa de palha..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#C9BFA8] text-sm text-[#0A0A0A] focus:outline-none focus:border-[#B8924A]"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}

export function RankingPage() {
  return <HomePage />;
}

export function NewPage() {
  return <HomePage />;
}
