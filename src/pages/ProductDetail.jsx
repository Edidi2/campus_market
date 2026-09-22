import React, { useState, useEffect } from "react";
import { supabase } from "@/api/supabaseClient";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Minus, Plus, MapPin, Leaf, Phone, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { useCart } from "@/lib/cartContext";
import { useToast } from "@/components/ui/use-toast";
import ProductCard from "@/components/ProductCard";
import AcceptedPayments from "@/components/AcceptedPayments";
import { formatBirr, getExpiryInfo } from "@/utils";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [producerPhone, setProducerPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        // 1. Fetch the specific product by ID using standard Supabase query
        const { data: productData, error: productError } = await supabase
          .from('products') // Make sure this matches your Supabase table name (e.g., 'products')
          .select('*')
          .eq('id', id)
          .single();

        if (productError) throw productError;
        setProduct(productData);

        // 2. Fetch related items from the same category
        if (productData?.category) {
          const { data: relatedData } = await supabase
            .from('products')
            .select('*')
            .eq('category', productData.category)
            .eq('status', 'approved')
            .neq('id', id)
            .limit(5);

          setRelated(relatedData || []);
        }

        // 3. Fetch producer/seller contact info if available
        try {
          const { data: profiles } = await supabase
            .from('producer_profiles') // Adjust table name if needed
            .select('*')
            .limit(50);

          const match = profiles?.find(
            (pr) => pr.owner_name === productData.producer_name || pr.company_name === productData.producer_name
          );
          if (match?.contact_phone) setProducerPhone(match.contact_phone);
        } catch (e) {
          // producer contact optional
        }
      } catch (e) {
        console.error("Error fetching product:", e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="h-96 animate-pulse rounded-xl bg-muted" />;
  if (!product)
    return (
      <div className="text-center py-20 text-muted-foreground">
        Product not found. <Link to="/" className="text-emerald-700 underline">Back to marketplace</Link>
      </div>
    );

  const add = () => {
    addItem(product, qty);
    toast({ title: "Added to cart", description: `${qty} × ${product.title}` });
  };

  const orderNow = () => {
    addItem(product, qty);
    navigate("/checkout");
  };

  return (
    <div className="space-y-8">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to marketplace
      </Link>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="rounded-2xl overflow-hidden border bg-muted aspect-square">
          <Image src={product.image_url} alt={product.title} className="h-full w-full object-cover" fittingType="fill" />
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">{product.category}</span>
            {product.producer_type === "Local Producer" && (
              <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium">
                <Leaf className="h-3 w-3" /> Direct from producer
              </span>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">{product.title}</h1>
          <p className="text-3xl font-semibold">{formatBirr(product.price)}</p>
          <p className="text-muted-foreground leading-relaxed">{product.description || "No description provided."}</p>
          <div className="rounded-xl border p-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Seller</span><span className="font-medium">{product.producer_name || "Campus Seller"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span>{product.producer_type || "Merchant"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">In stock</span><span>{product.stock ?? 1}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Posted</span><span>{getExpiryInfo(product.created_date).posted}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Expires</span><span className={getExpiryInfo(product.created_date).expired ? "text-red-600 font-medium" : ""}>{getExpiryInfo(product.created_date).expired ? "Expired" : getExpiryInfo(product.created_date).expiry}</span></div>
          </div>

          <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-emerald-800">
              <Phone className="h-4 w-4" /> Contact the producer
            </div>
            {producerPhone ? (
              <a href={`tel:${producerPhone}`} className="mt-2 inline-flex items-center gap-2 text-lg font-semibold text-emerald-700 hover:underline">
                {producerPhone}
              </a>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">Phone number not provided by this seller.</p>
            )}
          </div>
          <div className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full">
            <MapPin className="h-3.5 w-3.5" /> Meet at a campus safe zone
          </div>
          <div className="flex items-center gap-3 pt-2">
            <div className="flex items-center border rounded-lg">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2 hover:bg-muted" aria-label="Decrease"><Minus className="h-4 w-4" /></button>
              <span className="px-4 font-medium">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="p-2 hover:bg-muted" aria-label="Increase"><Plus className="h-4 w-4" /></button>
            </div>
            <Button className="flex-1 h-11" onClick={add}>
              <ShoppingCart className="h-4 w-4 mr-2" /> Add to cart
            </Button>
          </div>
          <Button onClick={orderNow} size="lg" className="w-full h-11 bg-amber-500 hover:bg-amber-600 text-white">
            <Zap className="h-4 w-4 mr-2" /> Order now
          </Button>
        </div>
      </div>

      <AcceptedPayments />
      {related.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Related items</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}