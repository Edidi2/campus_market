import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { useCart } from "@/lib/cartContext";
import { formatBirr, getExpiryInfo } from "@/utils";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const exp = getExpiryInfo(product.created_date);

  return (
    <div className="group rounded-xl border bg-card overflow-hidden transition hover:shadow-md">
      <Link to={`/product/${product.id}`}>
        <div className="aspect-square overflow-hidden bg-muted">
          <Image
            src={product.image_url}
            alt={product.title}
            className="h-full w-full object-cover transition group-hover:scale-105"
            fittingType="fill"
          />
        </div>
      </Link>
      <div className="px-3 pt-2 flex items-center justify-between text-[10px] text-muted-foreground">
        <span>Posted {exp.posted}</span>
        <span className={exp.expired ? "text-red-600 font-medium" : ""}>
          {exp.expired ? "Expired" : `${exp.daysLeft}d left`}
        </span>
      </div>
      <div className="p-3 pt-1.5 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{product.category}</span>
          {product.producer_type === "Local Producer" && (
            <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 font-medium">
              <Leaf className="h-2.5 w-2.5" /> Direct
            </span>
          )}
        </div>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-medium text-sm line-clamp-1 hover:underline">{product.title}</h3>
        </Link>
        <p className="text-xs text-muted-foreground line-clamp-1">by {product.producer_name || "Campus Seller"}</p>
        <div className="flex items-center justify-between pt-1">
          <span className="text-lg font-semibold">{formatBirr(product.price)}</span>
          <Button size="sm" variant="secondary" onClick={() => addItem(product)} aria-label="Add to cart">
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}