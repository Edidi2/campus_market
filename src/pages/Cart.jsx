import React from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { useCart } from "@/lib/cartContext";
import { formatBirr } from "@/utils";

export default function Cart() {
  const { items, removeItem, updateQty, total, count } = useCart();

  if (items.length === 0) {
    return (
      <div className="text-center py-20 space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <ShoppingBag className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold">Your cart is empty</h2>
        <p className="text-muted-foreground">Browse the marketplace and add learning materials to your cart.</p>
        <Button asChild><Link to="/">Browse marketplace</Link></Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Your cart ({count})</h1>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {items.map((it) => (
            <div key={it.id} className="flex gap-4 rounded-xl border bg-card p-3">
              <div className="h-20 w-20 rounded-lg overflow-hidden bg-muted shrink-0">
                <Image src={it.image_url} alt={it.title} className="h-full w-full object-cover" fittingType="fill" />
              </div>
              <div className="flex-1 min-w-0">
                <Link to={`/product/${it.id}`} className="font-medium hover:underline line-clamp-1">{it.title}</Link>
                <p className="text-xs text-muted-foreground">by {it.producer_name || "Campus Seller"}</p>
                <p className="text-sm font-semibold mt-1">{formatBirr(it.price)}</p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button onClick={() => removeItem(it.id)} className="text-muted-foreground hover:text-destructive" aria-label="Remove"><Trash2 className="h-4 w-4" /></button>
                <div className="flex items-center border rounded-lg">
                  <button onClick={() => updateQty(it.id, it.qty - 1)} className="p-1.5 hover:bg-muted" aria-label="Decrease"><Minus className="h-3.5 w-3.5" /></button>
                  <span className="px-3 text-sm">{it.qty}</span>
                  <button onClick={() => updateQty(it.id, it.qty + 1)} className="p-1.5 hover:bg-muted" aria-label="Increase"><Plus className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-xl border bg-card p-5 h-fit space-y-4 lg:sticky lg:top-20">
          <h2 className="font-semibold">Order summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatBirr(total)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span className="text-emerald-700">Calculated at checkout</span></div>
            <div className="border-t pt-2 flex justify-between font-semibold text-base"><span>Total</span><span>{formatBirr(total)}</span></div>
          </div>
          <Button asChild className="w-full h-11"><Link to="/checkout">Proceed to checkout <ArrowRight className="h-4 w-4 ml-2" /></Link></Button>
          <Link to="/" className="block text-center text-sm text-muted-foreground hover:underline">Continue shopping</Link>
        </div>
      </div>
    </div>
  );
}