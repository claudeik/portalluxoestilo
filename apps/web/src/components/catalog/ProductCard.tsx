// apps/web/src/components/catalog/ProductCard.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Star, ShieldCheck } from "lucide-react";
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
  const isOutOfStock = product.stock.quantity <= 0 || product.status === "OUT_OF_STOCK";
  const isLowStock = !isOutOfStock && product.stock.quantity <= 3;

  return (
    <div
      data-testid={`product-card-${product.slug}`}
      className="group relative bg-[#141210] border border-[#2A2520] hover:border-[#C9A961]/50 rounded-2xl overflow-hidden flex flex-col transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] bg-[#1E1B18] overflow-hidden">
        <Link to={`/produto/${product.slug}`} className="block w-full h-full">
          <img
            src={product.images[0]?.url}
            alt={product.images[0]?.altText || product.name}
            loading="lazy"
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
              isOutOfStock ? "opacity-45 grayscale" : ""
            }`}
          />
        </Link>

        {/* Top Left Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {typeof rank === "number" && (
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#C9A961] text-[#0A0908] font-serif font-bold text-sm shadow-lg">
              #{rank}
            </span>
          )}
          {product.isNew && !isOutOfStock && (
            <span className="px-2.5 py-0.5 rounded-full bg-[#0A0908]/90 border border-[#C9A961] text-[#C9A961] text-[10px] font-semibold tracking-wider uppercase">
              NOVO
            </span>
          )}
          {isLowStock && (
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/95 text-[#0A0908] text-[10px] font-bold tracking-wider uppercase">
              ÚLTIMAS {product.stock.quantity}
            </span>
          )}
          {isOutOfStock && (
            <span className="px-2.5 py-0.5 rounded-full bg-red-500/90 text-white text-[10px] font-bold tracking-wider uppercase">
              ESGOTADO
            </span>
          )}
        </div>

        {/* Wishlist Heart */}
        <button
          type="button"
          aria-label={isWishlisted ? "Remover dos desejos" : "Adicionar aos desejos"}
          onClick={() => toggleWishlist(product.id)}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-[#0A0908]/80 backdrop-blur-sm border border-[#2A2520] flex items-center justify-center text-[#F5EFE6] hover:border-[#C9A961] transition"
        >
          <Heart
            className={`w-4 h-4 ${
              isWishlisted ? "fill-[#C9A961] text-[#C9A961]" : "text-[#F5EFE6]"
            }`}
          />
        </button>

        {/* Bottom FOB + Remessa Conforme Pill */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between px-2.5 py-1 rounded-lg bg-[#0A0908]/85 backdrop-blur-md border border-[#2A2520]/80 text-[10px]">
          <span className="text-[#A89F91] font-mono">{formatUsd(product.fobPriceUsd)} FOB</span>
          <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
            <ShieldCheck className="w-3 h-3" />
            II R$ 0
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-3.5 flex-1 flex flex-col justify-between gap-2">
        <div>
          <div className="flex items-center justify-between text-[10px] text-[#A89F91] uppercase tracking-wider mb-1">
            <span>{product.categoryName}</span>
            <span className="inline-flex items-center gap-0.5 text-[#C9A961]">
              <Star className="w-3 h-3 fill-[#C9A961]" />
              {product.ratingAvg.toFixed(1)}
            </span>
          </div>

          <Link
            to={`/produto/${product.slug}`}
            className="font-serif text-base sm:text-lg leading-snug text-[#F5EFE6] group-hover:text-[#C9A961] transition line-clamp-2"
          >
            {product.name}
          </Link>
        </div>

        <div className="pt-2 border-t border-[#2A2520]/70 flex items-end justify-between gap-2">
          <div>
            {product.compareAtBrl && (
              <span className="block text-[11px] text-[#A89F91] line-through">
                {formatBrl(product.compareAtBrl)}
              </span>
            )}
            <span className="text-base sm:text-lg font-bold text-[#F5EFE6]">
              {formatBrl(priceBrl)}
            </span>
            <span className="block text-[10px] text-[#C9A961]">no Pix Split s/ IOF</span>
          </div>

          {variant !== "compact" && (
            <button
              type="button"
              disabled={isOutOfStock}
              onClick={() => addToCart(product.id, 1)}
              className={`p-2.5 rounded-xl border transition ${
                isOutOfStock
                  ? "bg-[#1E1B18] border-[#2A2520] text-[#A89F91] cursor-not-allowed"
                  : "bg-[#C9A961] border-[#C9A961] text-[#0A0908] hover:bg-[#DFC484]"
              }`}
              title={isOutOfStock ? "Produto esgotado" : "Adicionar à sacola"}
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
