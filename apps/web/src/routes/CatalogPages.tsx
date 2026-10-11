// apps/web/src/routes/CatalogPages.tsx
// Telas de Vitrine e Catálogo (Flows 01, 02 e 03 de Figma_Frame.pdf e README_Produto.pdf)

import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Sparkles,
  Gift,
  Radio,
  ShieldCheck,
  SlidersHorizontal,
  Search,
  ArrowLeft,
  Star,
  Heart,
  ShoppingBag,
  Truck,
  CheckCircle2,
  AlertTriangle,
  Share2,
  Award,
  ZoomIn,
  Layers,
} from "lucide-react";
import { usePortalStore, CATEGORIES } from "../stores/app.store";
import { ProductCard } from "../components/catalog/ProductCard";
import { calculateBrlFromFob, calculateQuote, formatBrl, formatUsd } from "../lib/format";

const COLOR_SWATCH_HEX: Record<string, string> = {
  Dourado: "#C9A961",
  Esmeralda: "#2E6F5E",
  "Palha Natural": "#D8C39E",
  Tartaruga: "#6E472B",
  "Preto Obsidian": "#181614",
  Marfim: "#F5EFE6",
};

export function HomePage() {
  const { products, selectedState, ptaxRate } = usePortalStore();
  const [selectedColor, setSelectedColor] = useState<string>("ALL");
  const [selectedMaterial, setSelectedMaterial] = useState<string>("ALL");
  const [maxPriceBrl, setMaxPriceBrl] = useState<number>(250);
  const [sortBy, setSortBy] = useState<"relevant" | "price_asc" | "price_desc" | "new">("relevant");
  const filterDialogRef = useRef<HTMLDialogElement>(null);

  const colors = Array.from(new Set(products.map((p) => p.color).filter(Boolean))) as string[];
  const materials = Array.from(new Set(products.map((p) => p.material).filter(Boolean))) as string[];

  const filteredProducts = products
    .filter((p) => {
      const brl = calculateBrlFromFob(p.fobPriceUsd, ptaxRate);
      if (brl > maxPriceBrl) return false;
      if (selectedColor !== "ALL" && p.color !== selectedColor) return false;
      if (selectedMaterial !== "ALL" && p.material !== selectedMaterial) return false;
      if (sortBy === "new" && !p.isNew) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price_asc") return a.fobPriceUsd - b.fobPriceUsd;
      if (sortBy === "price_desc") return b.fobPriceUsd - a.fobPriceUsd;
      return (a.weeklyRank || 99) - (b.weeklyRank || 99);
    });

  const topRanked = [...products]
    .filter((p) => typeof p.weeklyRank === "number")
    .sort((a, b) => (a.weeklyRank || 99) - (b.weeklyRank || 99))
    .slice(0, 5);

  return (
    <div className="max-w-5xl mx-auto px-4 pt-4 pb-28 space-y-8">
      {/* Flow 01 Slide 03 · Hero Banner Editorial */}
      <section
        data-testid="home-hero"
        className="relative rounded-3xl overflow-hidden border border-[#C9A961]/40 bg-gradient-to-br from-[#1C1814] via-[#0A0908] to-[#14110E] p-6 sm:p-8"
      >
        <div className="max-w-xl space-y-4 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="eyebrow">Nova curadoria · Unicentro PY → Brasil</span>
            <span className="text-[10px] font-mono text-[#8A8278]">
              · Câmbio PTAX atualizado hoje às 16h05 BRT
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl text-[#F5EFE6] leading-[1.08] font-normal">
            Acessórios do Paraguai até R$ 250, <em className="italic text-[#C9A961]">sem surpresa na entrega.</em>
          </h1>

          <p className="text-sm text-[#C9C2B6] leading-relaxed">
            Vitrine curada da Unicentro abaixo de US$ 45 FOB com{" "}
            <strong className="text-[#7FA66B]">Imposto Federal R$ 0,00</strong> (Remessa Conforme), ICMS de{" "}
            <strong className="text-[#C9A961]">{selectedState}</strong> no Pix Split e rastreio Correios.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link to="/conta/assistente" className="btn-gold text-xs sm:text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Descobrir Meu Look com IA</span>
            </Link>
            <Link to="/s/aniversario-marina-2026" className="btn-outline text-xs sm:text-sm">
              <Gift className="w-4 h-4" />
              <span>Presente Compartilhado</span>
            </Link>
            <Link
              to="/design-system"
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-[#14110E] border border-[#4FC3F7]/40 text-[#4FC3F7] font-mono text-xs hover:bg-[#4FC3F7]/10 transition"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Spec Figma (12 Slides)</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 6 Category Chips (Horizontal Scroll · Slide 03) */}
      <section aria-label="Categorias da curadoria" className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl text-[#F5EFE6]">Categorias Curadas</h2>
          <div className="flex items-center gap-3 text-xs">
            <Link to="/mais-vendidos" className="text-[#C9A961] hover:underline">
              Mais vendidos
            </Link>
            <Link to="/novidades" className="text-[#C9A961] hover:underline">
              Novidades (14d)
            </Link>
          </div>
        </div>

        <div
          data-testid="category-chips-row"
          className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1"
        >
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/catalogo/${cat.slug}`}
              data-testid={`chip-${cat.slug}`}
              className="cat-chip text-xs font-medium flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A961]" />
              <span>{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3 Journeys Quick Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Link
          to="/conta/assistente"
          className="bg-[#14110E] border border-[#2A2520] hover:border-[#C9A961]/60 rounded-2xl p-4 flex items-start gap-3.5 transition"
        >
          <div className="w-10 h-10 rounded-xl bg-[#C9A961]/15 border border-[#C9A961]/40 flex items-center justify-center text-[#C9A961] shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="eyebrow !text-[9px]">Flow 08 · SLA &lt; 8s</span>
            <h3 className="font-serif text-lg text-[#F5EFE6]">Estilo IA com Drop Zone</h3>
            <p className="text-xs text-[#8A8278] mt-0.5">
              Envie sua foto e receba 3 combinações curadas (LOOK 1 como MELHOR COMBO).
            </p>
          </div>
        </Link>

        <Link
          to="/conta/compartilhar"
          className="bg-[#14110E] border border-[#2A2520] hover:border-[#C9A961]/60 rounded-2xl p-4 flex items-start gap-3.5 transition"
        >
          <div className="w-10 h-10 rounded-xl bg-[#C9A961]/15 border border-[#C9A961]/40 flex items-center justify-center text-[#C9A961] shrink-0">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <span className="eyebrow !text-[9px]">Flow 09 · Look Presente</span>
            <h3 className="font-serif text-lg text-[#F5EFE6]">Carrinho Compartilhável</h3>
            <p className="text-xs text-[#8A8278] mt-0.5">
              Monte um look com checkboxes, convide amigas e divida no Pix Split.
            </p>
          </div>
        </Link>

        <Link
          to="/live/quinta-luxo"
          className="bg-[#14110E] border border-[#2A2520] hover:border-[#C9A961]/60 rounded-2xl p-4 flex items-start gap-3.5 transition"
        >
          <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-widest text-red-400 font-semibold">
              Flow 10 · AO VIVO · 1.247 assistindo
            </span>
            <h3 className="font-serif text-lg text-[#F5EFE6]">Live com Marina Ferraz</h3>
            <p className="text-xs text-[#8A8278] mt-0.5">
              Curadoria de outono · parte 4 com destaque sincronizado e próximos itens.
            </p>
          </div>
        </Link>
      </section>

      {/* Top 5 Weekly Ranking */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="eyebrow">Mais vendidos da semana</span>
            <h2 className="font-serif text-2xl text-[#F5EFE6]">Top 5 Curadoria</h2>
          </div>
          <Link to="/mais-vendidos" className="text-xs text-[#C9A961] hover:underline font-medium">
            VER TUDO →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {topRanked.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              variant="ranking"
              rank={product.weeklyRank}
            />
          ))}
        </div>
      </section>

      {/* Full Catalog + Flow 02 Full-Screen Filter Modal Trigger */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-serif text-2xl text-[#F5EFE6]">
              Vitrine Mobile-First ({filteredProducts.length} itens)
            </h2>
            <p className="text-xs text-[#8A8278]">
              Preço final no carrinho com imposto federal zero (Remessa Conforme)
            </p>
          </div>

          <div className="flex items-center gap-2">
            {(selectedColor !== "ALL" || selectedMaterial !== "ALL" || maxPriceBrl < 250 || sortBy !== "relevant") && (
              <button
                type="button"
                onClick={() => {
                  setSelectedColor("ALL");
                  setSelectedMaterial("ALL");
                  setMaxPriceBrl(250);
                  setSortBy("relevant");
                }}
                className="text-xs text-[#C9A961] underline"
              >
                Limpar filtros
              </button>
            )}
            <button
              type="button"
              data-testid="open-filter-modal-btn"
              onClick={() => filterDialogRef.current?.showModal()}
              className="btn-outline !min-h-[38px] !py-1.5 !px-3.5 text-xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filtros ({filteredProducts.length})</span>
            </button>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-[#14110E] border border-[#2A2520] rounded-2xl p-8 text-center space-y-3">
            <p className="text-sm text-[#C9C2B6]">
              Nenhum acessório corresponde aos filtros combinados.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedColor("ALL");
                setSelectedMaterial("ALL");
                setMaxPriceBrl(250);
                setSortBy("relevant");
              }}
              className="btn-gold text-xs"
            >
              Ampliar filtros e ver toda a curadoria
            </button>
          </div>
        ) : (
          <div
            data-testid="product-grid"
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5"
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Flow 02 Slide 04 · Modal de Filtros Full-Screen (Range Slider, Color Swatches 32x32, Chips, Radio Sort) */}
      <dialog
        ref={filterDialogRef}
        closedby="any"
        aria-labelledby="filter-dialog-title"
        className="bg-[#1C1814] text-[#F5EFE6] border border-[#C9A961]/40 rounded-3xl p-6 w-full max-w-md shadow-2xl"
      >
        <div className="space-y-5">
          {/* 1 · Header: title "Filtros" Playfair + Limpar right */}
          <div className="flex items-center justify-between border-b border-[#2A2520] pb-3">
            <button
              type="button"
              onClick={() => filterDialogRef.current?.close()}
              aria-label="Fechar modal de filtros"
              className="text-sm text-[#8A8278] hover:text-[#F5EFE6]"
            >
              ✕
            </button>
            <h3 id="filter-dialog-title" className="font-serif text-xl text-[#F5EFE6]">
              Filtros
            </h3>
            <button
              type="button"
              onClick={() => {
                setSelectedColor("ALL");
                setSelectedMaterial("ALL");
                setMaxPriceBrl(250);
                setSortBy("relevant");
              }}
              className="text-xs text-[#C9A961] hover:underline"
            >
              Limpar
            </button>
          </div>

          {/* 2 · FAIXA DE PREÇO FINAL Range Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="eyebrow !text-[10px]">FAIXA DE PREÇO FINAL</span>
              <span className="font-mono text-xs text-[#C9A961]">
                R$ 70 — R$ {maxPriceBrl}
              </span>
            </div>
            <input
              type="range"
              min={70}
              max={250}
              step={10}
              value={maxPriceBrl}
              onChange={(e) => setMaxPriceBrl(Number(e.target.value))}
              className="w-full accent-[#C9A961] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] font-mono text-[#8A8278]">
              <span>R$ 70</span>
              <span>R$ 250</span>
            </div>
          </div>

          {/* 3 · COR Swatches 32×32 · radius 50% · sel ring */}
          <div className="space-y-2.5">
            <span className="eyebrow !text-[10px] block">COR</span>
            <div className="flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={() => setSelectedColor("ALL")}
                className={`px-3 py-1 rounded-full text-xs border ${
                  selectedColor === "ALL"
                    ? "bg-[#C9A961] text-[#0A0908] border-[#C9A961] font-bold"
                    : "border-[#2A2520] text-[#8A8278]"
                }`}
              >
                Todas
              </button>
              {colors.map((c) => {
                const hex = COLOR_SWATCH_HEX[c] || "#C9A961";
                const isSelected = selectedColor === c;
                return (
                  <button
                    key={c}
                    type="button"
                    title={c}
                    aria-label={`Filtrar por cor ${c}`}
                    onClick={() => setSelectedColor(isSelected ? "ALL" : c)}
                    style={{ backgroundColor: hex }}
                    className={`w-8 h-8 rounded-full border transition ${
                      isSelected
                        ? "ring-2 ring-[#C9A961] ring-offset-2 ring-offset-[#1C1814] border-white"
                        : "border-[#F5EFE6]/30 opacity-80 hover:opacity-100"
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* 4 · MATERIAL Chips */}
          <div className="space-y-2">
            <span className="eyebrow !text-[10px] block">MATERIAL</span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedMaterial("ALL")}
                className={`cat-chip text-xs ${selectedMaterial === "ALL" ? "active" : ""}`}
              >
                Todos
              </button>
              {materials.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setSelectedMaterial(selectedMaterial === m ? "ALL" : m)}
                  className={`cat-chip text-xs ${selectedMaterial === m ? "active" : ""}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* 5 · ORDENAR POR Radio Rows */}
          <div className="space-y-2">
            <span className="eyebrow !text-[10px] block">ORDENAR POR</span>
            <div className="space-y-1.5 text-xs">
              {[
                { id: "relevant", label: "Mais relevantes" },
                { id: "price_asc", label: "Menor preço" },
                { id: "price_desc", label: "Maior preço" },
                { id: "new", label: "Novidades" },
              ].map((opt) => (
                <label
                  key={opt.id}
                  className="flex items-center gap-2.5 h-8 cursor-pointer text-[#F5EFE6]"
                >
                  <input
                    type="radio"
                    name="sortBy"
                    checked={sortBy === opt.id}
                    onChange={() => setSortBy(opt.id as typeof sortBy)}
                    className="accent-[#C9A961]"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 6 · CTA .btn-gold "Aplicar filtros (N)" (bloqueia se N === 0 per README_Produto.pdf §3.2) */}
          <button
            type="button"
            disabled={filteredProducts.length === 0}
            onClick={() => filterDialogRef.current?.close()}
            className="btn-gold w-full text-sm disabled:opacity-40"
          >
            {filteredProducts.length === 0
              ? "0 itens · Amplie os filtros"
              : `Aplicar filtros (${filteredProducts.length})`}
          </button>
        </div>
      </dialog>
    </div>
  );
}

export function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const { products } = usePortalStore();
  const catInfo = CATEGORIES.find((c) => c.slug === category);
  const filtered = products.filter((p) => p.categorySlug === category);

  return (
    <div className="max-w-5xl mx-auto px-4 pt-5 pb-28 space-y-6">
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="p-2 rounded-full bg-[#14110E] border border-[#2A2520] text-[#F5EFE6]"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <span className="eyebrow">Categoria Curada Unicentro · Até R$ 250</span>
          <h1 className="font-serif text-3xl text-[#F5EFE6]">
            {catInfo?.name || category}
          </h1>
          {catInfo?.description && (
            <p className="text-xs text-[#8A8278]">{catInfo.description}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {CATEGORIES.map((c) => (
          <Link
            key={c.id}
            to={`/catalogo/${c.slug}`}
            className={`cat-chip text-xs ${c.slug === category ? "active" : ""}`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-[#14110E] border border-[#2A2520] rounded-2xl p-8 text-center space-y-3">
          <p className="text-sm text-[#C9C2B6]">Esta categoria está sendo atualizada pela curadoria.</p>
          <Link to="/" className="btn-gold text-xs">
            Ver outros acessórios
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export function SearchPage() {
  const { products } = usePortalStore();
  const [rawQuery, setRawQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce 250ms (README_Produto.pdf §3.1)
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(rawQuery), 250);
    return () => clearTimeout(t);
  }, [rawQuery]);

  const results = products.filter((p) => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.categoryName.toLowerCase().includes(q) ||
      (p.material && p.material.toLowerCase().includes(q))
    );
  });

  const recentSearches = ["Brinco gota dourado", "Lenço seda", "Bolsa de palha", "Presilhas"];

  return (
    <div className="max-w-5xl mx-auto px-4 pt-5 pb-28 space-y-6">
      <div className="space-y-3">
        <span className="eyebrow">Flow 01 · Busca Instantânea (&le;300ms)</span>
        <h1 className="font-serif text-2xl text-[#F5EFE6]">Buscar na Curadoria</h1>
        <div className="relative">
          <Search className="w-5 h-5 text-[#C9A961] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            autoFocus
            value={rawQuery}
            onChange={(e) => setRawQuery(e.target.value)}
            placeholder="Busque por brinco, lenço, bolsa de palha, presilhas..."
            data-testid="search-input"
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#14110E] border border-[#2A2520] focus:border-[#C9A961] text-sm text-[#F5EFE6] focus:outline-none"
          />
        </div>

        {/* Buscas recentes & Em alta */}
        <div className="flex items-center gap-2 flex-wrap pt-1">
          <span className="text-[11px] text-[#8A8278]">Buscas recentes:</span>
          {recentSearches.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => setRawQuery(term)}
              className="cat-chip text-[11px]"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {results.length === 0 ? (
        <div className="bg-[#14110E] border border-[#2A2520] rounded-2xl p-6 text-center space-y-4">
          <p className="text-sm text-[#C9C2B6]">
            Nenhum resultado encontrado para <strong>"{debouncedQuery}"</strong>.
          </p>
          <p className="text-xs text-[#8A8278]">Experimente nossas 3 categorias mais populares:</p>
          <div className="flex justify-center gap-2 flex-wrap">
            <Link to="/catalogo/bijuterias" className="cat-chip active text-xs">
              Bijuterias
            </Link>
            <Link to="/catalogo/lencos" className="cat-chip active text-xs">
              Lenços
            </Link>
            <Link to="/catalogo/bolsas" className="cat-chip active text-xs">
              Bolsas
            </Link>
            <button
              type="button"
              onClick={() => setRawQuery("")}
              className="btn-outline !min-h-[34px] !py-1 !px-3 text-xs"
            >
              Limpar busca
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export function RankingPage() {
  const { products } = usePortalStore();
  const ranked = [...products]
    .filter((p) => typeof p.weeklyRank === "number")
    .sort((a, b) => (a.weeklyRank || 99) - (b.weeklyRank || 99))
    .slice(0, 5);

  return (
    <div className="max-w-5xl mx-auto px-4 pt-5 pb-28 space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/" className="p-2 rounded-full bg-[#14110E] border border-[#2A2520]">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <span className="eyebrow">Flow 02 · Atualizado toda segunda 00h BRT</span>
          <h1 className="font-serif text-3xl text-[#F5EFE6]">Top 5 Mais Vendidos da Semana</h1>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {ranked.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            variant="ranking"
            rank={product.weeklyRank}
          />
        ))}
      </div>
    </div>
  );
}

export function NewPage() {
  const { products } = usePortalStore();
  const newItems = products.filter((p) => p.isNew);

  return (
    <div className="max-w-5xl mx-auto px-4 pt-5 pb-28 space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/" className="p-2 rounded-full bg-[#14110E] border border-[#2A2520]">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <span className="eyebrow">Flow 02 · Badge NOVO por 14 dias</span>
          <h1 className="font-serif text-3xl text-[#F5EFE6]">Novidades da Curadoria</h1>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {newItems.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const {
    products,
    reviews,
    ptaxRate,
    selectedState,
    wishlistIds,
    toggleWishlist,
    addToCart,
    setToast,
  } = usePortalStore();

  const product = products.find((p) => p.slug === slug) || products[0];
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const isWishlisted = wishlistIds.includes(product.id);
  const priceBrl = calculateBrlFromFob(product.fobPriceUsd, ptaxRate);
  const quote = calculateQuote({
    subtotalBrl: priceBrl,
    state: selectedState,
    exchangeRate: ptaxRate,
  });

  const isOutOfStock = product.stock.quantity <= 0 || product.status === "OUT_OF_STOCK";
  const productReviews = reviews.filter((r) => r.productId === product.id);
  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.status === "ACTIVE")
    .slice(0, 4);

  return (
    <div className="max-w-5xl mx-auto px-4 pt-4 pb-28 space-y-8">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs text-[#C9C2B6] hover:text-[#F5EFE6]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← {product.categoryName}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Compartilhar produto"
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              setToast("Link da peça copiado!");
            }}
            className="p-2 rounded-full bg-[#14110E] border border-[#2A2520] text-[#F5EFE6] hover:border-[#C9A961]"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label={isWishlisted ? "Remover dos favoritos" : "Favoritar peça"}
            onClick={() => toggleWishlist(product.id)}
            className="p-2 rounded-full bg-[#14110E] border border-[#2A2520] text-[#F5EFE6] hover:border-[#C9A961]"
          >
            <Heart
              className={`w-4 h-4 ${
                isWishlisted ? "fill-[#C9A961] text-[#C9A961]" : "text-[#F5EFE6]"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Flow 03 Slide 05 · Main PDP Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {/* 1 · Hero Image with 2x Zoom + 2 · 4 Thumbnail Dots */}
        <div className="space-y-3">
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#14110E] border border-[#2A2520]">
            <img
              src={product.images[selectedImgIdx]?.url || product.images[0]?.url}
              alt={product.name}
              onClick={() => setIsZoomed((z) => !z)}
              className={`w-full h-full object-cover cursor-zoom-in transition-transform duration-300 ${
                isZoomed ? "scale-[2]" : "scale-100"
              }`}
            />
            <button
              type="button"
              aria-label="Alternar zoom 2x na imagem"
              onClick={() => setIsZoomed((z) => !z)}
              className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-[#0A0908]/85 border border-[#2A2520] text-[10px] text-[#C9A961] flex items-center gap-1"
            >
              <ZoomIn className="w-3.5 h-3.5" />
              <span>{isZoomed ? "1x" : "Zoom 2x"}</span>
            </button>
          </div>

          {/* 4 Thumbnail Dots (Slide 05: 4 total · 1 active gold · 3 muted) */}
          <div className="flex items-center justify-center gap-2 py-1">
            {[0, 1, 2, 3].map((dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                aria-label={`Ver imagem ${dotIdx + 1}`}
                onClick={() => setSelectedImgIdx(dotIdx % product.images.length)}
                className={`w-2 h-2 rounded-full transition ${
                  selectedImgIdx === dotIdx
                    ? "bg-[#C9A961] scale-125"
                    : "bg-[#8A8278]/40 hover:bg-[#8A8278]"
                }`}
              />
            ))}
          </div>
        </div>

        {/* 3 · Title + 4 · Price + 5 · 3-Column Specs + 6 · CTAs */}
        <div className="space-y-5">
          <div>
            <span className="eyebrow">{product.categoryName} · SKU {product.sku}</span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#F5EFE6] mt-1">
              {product.name}
            </h1>
          </div>

          {/* 4 · Price Block + "Preço final no carrinho" pill (Slide 05) */}
          <div className="space-y-2">
            <div className="flex items-baseline gap-3">
              <span
                data-testid="pdp-price-brl"
                className="font-serif text-3xl sm:text-4xl font-semibold text-[#C9A961]"
              >
                {formatBrl(priceBrl)}
              </span>
              {product.compareAtBrl && (
                <span className="text-base text-[#8A8278] line-through">
                  {formatBrl(product.compareAtBrl)}
                </span>
              )}
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A961]/10 border border-[#C9A961]/30 text-xs text-[#C9A961]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#7FA66B]" />
              <span>
                Preço final no carrinho ({selectedState}): <strong>{formatBrl(quote.totalBrl)}</strong> · Imposto federal R$ 0,00
              </span>
            </div>
          </div>

          <p className="text-sm text-[#C9C2B6] leading-relaxed">{product.description}</p>

          {/* 5 · 3-Column Spec Cards (Slide 05: TAMANHO | PESO | ORIGEM) */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-[#14110E] border border-[#2A2520] rounded-xl p-3 text-center">
              <span className="block text-[10px] uppercase tracking-wider text-[#8A8278]">
                TAMANHO
              </span>
              <span className="text-xs font-medium text-[#F5EFE6] mt-0.5 block">
                {product.dimensions || "a confirmar com fornecedor"}
              </span>
            </div>
            <div className="bg-[#14110E] border border-[#2A2520] rounded-xl p-3 text-center">
              <span className="block text-[10px] uppercase tracking-wider text-[#8A8278]">
                PESO
              </span>
              <span className="text-xs font-medium text-[#F5EFE6] mt-0.5 block">
                {product.weightGrams ? `${product.weightGrams}g` : "a confirmar"}
              </span>
            </div>
            <div className="bg-[#14110E] border border-[#2A2520] rounded-xl p-3 text-center">
              <span className="block text-[10px] uppercase tracking-wider text-[#8A8278]">
                ORIGEM
              </span>
              <span className="text-xs font-medium text-[#F5EFE6] mt-0.5 block">
                Paraguai
              </span>
            </div>
          </div>

          {/* 6 · Primary CTA "Comprar · R$ XX" (leva direto ao checkout per README_Produto.pdf §3.3) + Secondary "Adicionar à sacola" */}
          {isOutOfStock ? (
            <div className="bg-[#C97264]/10 border border-[#C97264]/40 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-[#C97264] text-xs font-bold uppercase">
                <AlertTriangle className="w-4 h-4" />
                <span>Peça esgotada na Unicentro · Veja similares abaixo</span>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5 pt-1">
              <button
                type="button"
                data-testid="pdp-buy-now-btn"
                onClick={() => {
                  addToCart(product.id, 1);
                  navigate("/checkout");
                }}
                className="btn-gold w-full text-sm shadow-lg"
              >
                <span>Comprar · {formatBrl(priceBrl)}</span>
              </button>

              <button
                type="button"
                data-testid="pdp-add-to-cart"
                onClick={() => addToCart(product.id, 1)}
                className="btn-outline w-full text-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Adicionar à sacola</span>
              </button>
            </div>
          )}

          {/* Extra Supplier Specs */}
          <div className="bg-[#14110E] border border-[#2A2520] rounded-2xl p-4 space-y-2 text-xs">
            <div className="flex justify-between text-[#8A8278]">
              <span>Material:</span>
              <span className="text-[#F5EFE6]">
                {product.material || "a confirmar com fornecedor"}
              </span>
            </div>
            <div className="flex justify-between text-[#8A8278]">
              <span>Preço FOB Origem:</span>
              <span className="text-[#F5EFE6] font-mono">{formatUsd(product.fobPriceUsd)}</span>
            </div>
            <div className="flex justify-between text-[#8A8278]">
              <span>Cuidados:</span>
              <span className="text-[#F5EFE6]">
                {product.careInstructions || "a confirmar com fornecedor"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Avaliações Verificadas */}
      <section className="space-y-4 pt-4 border-t border-[#2A2520]">
        <div className="flex items-center justify-between">
          <div>
            <span className="eyebrow">Prova Social · Moderação 24h</span>
            <h2 className="font-serif text-2xl text-[#F5EFE6]">
              Avaliações ({productReviews.length})
            </h2>
          </div>
          <Link to="/conta/pedidos" className="text-xs text-[#C9A961] hover:underline">
            Avaliar após entrega →
          </Link>
        </div>

        {productReviews.length === 0 ? (
          <div className="bg-[#14110E] border border-[#2A2520] rounded-2xl p-5 flex items-center justify-between">
            <p className="text-xs text-[#8A8278]">
              Ainda sem avaliações publicadas — seja a primeira a avaliar após receber seu pedido!
            </p>
            <Link to="/conta/pedidos" className="btn-outline !min-h-[34px] !py-1 !px-3 text-xs">
              Meus pedidos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {productReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-[#14110E] border border-[#2A2520] rounded-2xl p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#C9A961]">
                    {Array.from({ length: rev.rating }).map((_, idx) => (
                      <Star key={idx} className="w-3.5 h-3.5 fill-[#C9A961]" />
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] text-[#7FA66B]">
                    <CheckCircle2 className="w-3 h-3" />
                    Compra entregue
                  </span>
                </div>
                <h4 className="font-semibold text-sm text-[#F5EFE6]">{rev.title}</h4>
                <p className="text-xs text-[#C9C2B6] leading-relaxed">
                  {rev.body.slice(0, 1000)}
                </p>
                <div className="text-[11px] text-[#8A8278]">
                  {rev.customerName} · {rev.cityState} · {rev.createdAt}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recomendações pgvector */}
      <section className="space-y-4 pt-4 border-t border-[#2A2520]">
        <div>
          <span className="eyebrow">Similaridade Vetorial pgvector</span>
          <h2 className="font-serif text-2xl text-[#F5EFE6]">Combina Com / Similares</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {relatedProducts.map((rel) => (
            <ProductCard key={rel.id} product={rel} />
          ))}
        </div>
      </section>
    </div>
  );
}
