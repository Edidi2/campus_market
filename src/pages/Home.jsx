import React, { useState, useEffect } from "react";
import { supabase } from "@/api/supabaseClient";
import { Link } from "react-router-dom";
import { Search, Truck, ShieldCheck, Leaf, MapPin, TrendingDown, Store, CheckCircle2, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cartContext";
import ProductCard from "@/components/ProductCard";
import PromotionBanner from "@/components/PromotionBanner";
import AdPackages from "@/components/AdPackages";
import AcceptedPayments from "@/components/AcceptedPayments";
import { getExpiryInfo } from "@/utils";

const CATEGORIES = [
  "All", "Electronics", "Books & Notebooks", "Stationery",
  "Hygiene & Personal Care", "Bags", "Snacks & Drinks", "Other",
];

const BENEFITS = [
  { icon: Leaf, title: "Direct from producers", desc: "Buy straight from local producers — no merchant markup." },
  { icon: TrendingDown, title: "Lower prices", desc: "Connecting supply and demand cuts material costs for students." },
  { icon: Truck, title: "Campus delivery", desc: "Connected delivery riders bring orders to your safe zone." },
  { icon: ShieldCheck, title: "University verified", desc: "Admins screen items so students shop safely." },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

 useEffect(() => {
    (async () => {
      try {
        // Fetch products and promotions using the native Supabase client
        const [prodsRes, promosRes] = await Promise.all([
          supabase.from('products').select('*').eq('status', 'approved'),
          supabase.from('promotions').select('*').eq('active', true),
        ]);

        setProducts(prodsRes.data || []);
        setPromotions(promosRes.data || []);
      } catch (e) {
        console.error("Error loading home data:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = products.filter((p) => {
    const matchCat = category === "All" || p.category === category;
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 20% 30%, white 1px, transparent 1px)", backgroundSize: "32px 32px" }}
        />
        <div className="relative px-6 py-14 md:py-20 md:px-12 max-w-3xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
            <MapPin className="h-3.5 w-3.5" /> Campus-restricted marketplace
          </span>
          <h1 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight leading-tight">
            Learning materials & everyday essentials, straight from producers.
          </h1>
          <p className="mt-3 text-white/85 md:text-lg max-w-xl">
            Buy and sell within your university community. Lower prices, verified sellers, and safe on-campus delivery.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-2 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notebooks, laptops, soap..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-11 bg-white text-foreground border-0"
              />
            </div>
            <Button
              variant="secondary"
              className="h-11"
              onClick={() => document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" })}
            >
              Browse catalog
            </Button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {BENEFITS.map((b) => {
          const Icon = b.icon;
          return (
            <div key={b.title} className="rounded-xl border bg-card p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-3 font-medium text-sm">{b.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{b.desc}</p>
            </div>
          );
        })}
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Sponsored</h2>
          <span className="text-xs text-muted-foreground">Promotions from partners</span>
        </div>
        <PromotionBanner promotions={promotions} />
        <div className="mt-3">
          <AdPackages />
        </div>
      </section>

      <section id="catalog" className="space-y-4 scroll-mt-20">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Browse materials</h2>
          <Link to="/sell" className="text-sm text-emerald-700 font-medium hover:underline">
            Sell your products →
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1.5 rounded-full text-sm transition ${
                category === c ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
            No products found. Try a different category or search.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        <AcceptedPayments />
      </section>

      <section className="rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100">
        <div className="px-6 py-10 md:px-12 md:py-14 grid md:grid-cols-2 gap-6 items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 text-emerald-700 px-3 py-1 text-xs font-medium">
              <Store className="h-3.5 w-3.5" /> For local markets & producers
            </span>
            <h2 className="mt-3 text-2xl md:text-3xl font-bold tracking-tight">
              Sell your materials directly to students.
            </h2>
            <p className="mt-2 text-muted-foreground">
              Local producers, wholesalers, and market vendors — list your learning materials and essentials here, reach students on campus, and keep more of every sale by cutting out the middleman.
            </p>
            <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Reach verified students directly</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Set your own prices in Birr</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Campus delivery handled for you</li>
            </ul>
            <div className="mt-5 flex flex-col sm:flex-row gap-2">
              <Button asChild size="lg"><Link to="/verify-producer">Start selling <ArrowRight className="h-4 w-4 ml-2" /></Link></Button>
              <Button asChild size="lg" variant="outline"><Link to="/">Browse as buyer</Link></Button>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="grid grid-cols-2 gap-3">
              {["Local Producer", "Wholesaler", "Student Seller", "Merchant"].map((t, i) => (
                <div key={t} className={`rounded-2xl bg-white/70 backdrop-blur border p-4 ${i % 2 ? "translate-y-4" : ""}`}>
                  <Store className="h-6 w-6 text-emerald-600" />
                  <div className="mt-2 font-medium text-sm">{t}</div>
                  <div className="text-xs text-muted-foreground">Sell on campus</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}