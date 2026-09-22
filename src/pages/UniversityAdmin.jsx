import React, { useState, useEffect } from "react";
import { supabase } from "@/api/supabaseClient";
import { Shield, Check, Ban, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { useAuth } from "@/lib/AuthContext";
import { formatBirr } from "@/utils";

const statColors = {
  pending: "text-amber-600",
  approved: "text-emerald-600",
  restricted: "text-red-600",
};

export default function UniversityAdmin() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");

  const load = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);

      if (error) throw error;
      setProducts(data || []);
    } catch (e) {
      console.error("Error loading products:", e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (user && user.role !== "admin") {
    return (
      <div className="text-center py-20 space-y-3">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
          <Lock className="h-7 w-7" />
        </div>
        <h1 className="text-xl font-semibold">Admins only</h1>
        <p className="text-muted-foreground">The university control panel is restricted to administrators.</p>
      </div>
    );
  }

  const setStatus = async (id, status) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      load();
    } catch (e) {
      console.error("Error updating status:", e.message);
    }
  };

  const counts = {
    pending: products.filter((p) => p.status === "pending").length,
    approved: products.filter((p) => p.status === "approved").length,
    restricted: products.filter((p) => p.status === "restricted").length,
  };

  const shown = filter === "all" ? products : products.filter((p) => p.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><Shield className="h-6 w-6" /></div>
        <div>
          <h1 className="text-2xl font-bold">University control</h1>
          <p className="text-sm text-muted-foreground">Screen products to keep the campus marketplace safe.</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { k: "pending", l: "Pending review" },
          { k: "approved", l: "Approved" },
          { k: "restricted", l: "Restricted" },
        ].map((s) => (
          <div key={s.k} className="rounded-xl border bg-card p-4">
            <div className={`text-2xl font-bold ${statColors[s.k]}`}>{counts[s.k]}</div>
            <div className="text-xs text-muted-foreground">{s.l}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        {["pending", "approved", "restricted", "all"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-sm capitalize ${
              filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="h-32 animate-pulse rounded-xl bg-muted" />
      ) : shown.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">No products in this view.</div>
      ) : (
        <div className="space-y-2">
          {shown.map((p) => (
            <div key={p.id} className="flex items-center gap-3 rounded-xl border bg-card p-3">
              <div className="h-14 w-14 rounded-lg overflow-hidden bg-muted shrink-0">
                {p.image_url && <Image src={p.image_url} alt={p.title} className="h-full w-full object-cover" fittingType="fill" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium line-clamp-1">{p.title}</div>
                <div className="text-xs text-muted-foreground">
                  {p.category} · {formatBirr(p.price)} · by {p.producer_name || "—"}
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="text-emerald-700" onClick={() => setStatus(p.id, "approved")}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" className="text-red-600" onClick={() => setStatus(p.id, "restricted")}>
                  <Ban className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}