// apps/web/src/components/catalog/ProductCard.tsx
// Card Editorial de Produto · Portal Estilo Luxo (Volume I · Pitch Editorial)
// Creme Editorial (#FAF7F2), Tipografia Serif / Italic, Badge "Preço final no carrinho"

import React from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, ShieldCheck } from "lucide-react";
import { Product } from "@portal/types";
import { usePortalStore } from "../../stores/app.store";
import { calculateBrlFromFob, formatBrl, formatUsd } from "../../lib/format";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "compact" | "ranking";
  rank?: number;
}

export function ProductCard({ product, variant = "default", rank }: ProductCardProps) {
  const { ptaxRate, wishlistIds, toggleWishlist, addToCart } = usePortalStore();
  const isWishlisted = wishlistIds.includes(product.id);
  const priceBrl = calculateBrlFromFob(product.fobPriceUsd, ptaxRate);

  const rawImage = (product as any).images?.[0];
  const imageUrl = typeof rawImage === "string" ? rawImage : rawImage?.url || "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=600&q=80";

  return (
    <div
      data-testid={`product-card-${product.slug}`}
      className="group relative bg-white dark:bg-[#14110E] border border-[#C9BFA8] dark:border-[#2A2520] hover:border-[#B8924A] rounded-2xl overflow-hidden flex flex-col transition-all duration-300 shadow-sm"
    >
      {/* Contêiner de Imagem Editorial */}
      <div className="relative aspect-[4/5] bg-[#F0EBE0] dark:bg-[#1C1814] overflow-hidden">
        <Link to={`/produto/${product.slug}`} className="block w-full h-full">
          <img
            src={imageUrl}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Badges do Produto */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {typeof rank === "number" && (
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#0A0A0A] text-[#FAF7F2] font-serif font-bold text-xs shadow-md">
              #{rank}
            </span>
          )}
          {product.isNew && (
            <span className="px-2 py-0.5 rounded-full bg-[#FAF7F2]/95 border border-[#B8924A] text-[#8B6B30] text-[9px] font-semibold tracking-wider uppercase">
              Safra Outubro
            </span>
          )}
        </div>

        {/* Botão de Favoritos */}
        <button
          type="button"
          aria-label={isWishlisted ? "Remover dos favoritos" : "Salvar nos favoritos"}
          onClick={() => toggleWishlist(product.id)}
          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-[#FAF7F2]/90 dark:bg-[#0A0A0A]/80 backdrop-blur-sm border border-[#C9BFA8] flex items-center justify-center text-[#0A0A0A] dark:text-[#FAF7F2] hover:border-[#B8924A] transition"
        >
          <Heart
            className={`w-3.5 h-3.5 ${
              isWishlisted ? "fill-[#B8924A] text-[#B8924A]" : "text-[#0A0A0A] dark:text-[#FAF7F2]"
            }`}
          />
        </button>

        {/* Tag Remessa Conforme / FOB */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between px-2 py-1 rounded-md bg-[#FAF7F2]/90 dark:bg-[#0A0A0A]/90 backdrop-blur-md border border-[#C9BFA8]/80 text-[9px]">
          <span className="text-[#8C8275] font-mono">{formatUsd(product.fobPriceUsd)} FOB</span>
          <span className="inline-flex items-center gap-1 text-[#5B8254] font-medium">
            <ShieldCheck className="w-3 h-3" />
            II R$ 0,00
          </span>
        </div>
      </div>

      {/* Informações do Produto */}
      <div className="p-3.5 flex-1 flex flex-col justify-between gap-2 text-left">
        <div className="space-y-1">
          <div className="text-[10px] text-[#8C8275] uppercase tracking-wider">
            {product.categoryName}
          </div>

          <Link
            to={`/produto/${product.slug}`}
            className="font-serif text-sm sm:text-base leading-snug text-[#0A0A0A] dark:text-[#FAF7F2] group-hover:text-[#8B6B30] transition line-clamp-2"
          >
            {product.name}
          </Link>
        </div>

        <div className="pt-2 border-t border-[#C9BFA8]/50 dark:border-[#2A2520] flex items-end justify-between gap-2">
          <div>
            <span className="italic-serif text-lg font-bold text-[#8B6B30] dark:text-[#D9BE85] block">
              {formatBrl(priceBrl)}
            </span>
            <span className="text-[10px] text-[#8C8275] block">
              Preço final no carrinho
            </span>
          </div>

          {variant !== "compact" && (
            <button
              type="button"
              onClick={() => addToCart(product.id, 1)}
              className="p-2 rounded-lg bg-[#0A0A0A] dark:bg-[#B8924A] text-[#FAF7F2] dark:text-[#0A0A0A] hover:bg-[#B8924A] hover:text-[#0A0A0A] transition"
              title="Adicionar à sacola"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
