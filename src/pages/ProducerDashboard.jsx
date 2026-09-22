import React, { useState, useEffect } from "react";
import { supabase } from "@/api/supabaseClient";
import { Store, Plus, Leaf, Loader2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Image } from "@/components/ui/image";
import ImageUpload from "@/components/ImageUpload";
import { formatBirr } from "@/utils";

const CATEGORIES = ["Electronics", "Books & Notebooks", "Stationery", "Hygiene & Personal Care", "Bags", "Snacks & Drinks","Table & Chairs ", Other"];
const PRODUCER_TYPES = ["Local Producer", "Wholesaler", "Student Seller", "Merchant"];

export default function ProducerDashboard() {
  const { toast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: CATEGORIES[0],
    price: "",
    stock: "1",
    image_url: "",
    producer_name: "",
    producer_type: PRODUCER_TYPES[0],
  });

 const load = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*'); // Removed strict ordering to prevent silent column mismatches

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

  const submit = async () => {
    if (!form.title || !form.price) {
      toast({ title: "Missing fields", description: "Title and price are required.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase
        .from('products')
        .insert([{
          title: form.title,
          description: form.description,
          category: form.category,
          price: parseFloat(form.price),
          stock: parseInt(form.stock) || 1,
          image_url: form.image_url,
          producer_name: form.producer_name,
          producer_type: form.producer_type,
          status: "pending"
        }]);

      if (error) throw error;

      toast({ title: "Product listed", description: "Sent to university admin for approval." });
      setForm({
        title: "",
        description: "",
        category: CATEGORIES[0],
        price: "",
        stock: "1",
        image_url: "",
        producer_name: form.producer_name,
        producer_type: form.producer_type,
      });
      setShowForm(false);
      load();
    } catch (e) {
      toast({ title: "Failed", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><Store className="h-6 w-6" /></div>
          <div>
            <h1 className="text-2xl font-bold">Producer dashboard</h1>
            <p className="text-sm text-muted-foreground">Sell directly to students — cut out the merchant markup.</p>
          </div>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" /> {showForm ? "Close" : "Add product"}
        </Button>
      </div>

      <div className="rounded-xl border bg-emerald-50/50 p-4 flex gap-3">
        <Leaf className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
        <p className="text-sm text-emerald-800">
          As a producer you connect supply directly with student demand, lowering material costs for buyers while earning more for you.
        </p>
      </div>

      {showForm && (
        <div className="rounded-xl border bg-card p-5 space-y-4">
          <h2 className="font-semibold">List a new product</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <div><Label>Product title *</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div><Label>Price (Birr) *</Label><Input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
            <div>
              <Label>Category</Label>
              <select className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div><Label>Stock</Label><Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} /></div>
            <div><Label>Producer / seller name</Label><Input value={form.producer_name} onChange={(e) => setForm({ ...form, producer_name: e.target.value })} /></div>
            <div>
              <Label>Producer type</Label>
              <select className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={form.producer_type} onChange={(e) => setForm({ ...form, producer_type: e.target.value })}>
                {PRODUCER_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></div>
          <ImageUpload label="Product image" value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} />
          <Button className="h-11" disabled={saving} onClick={submit}>
            {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Listing...</> : "Submit for approval"}
          </Button>
        </div>
      )}

      <div className="space-y-3">
        <h2 className="font-semibold flex items-center gap-2"><Package className="h-4 w-4" /> Your products</h2>
        {loading ? (
          <div className="h-32 animate-pulse rounded-xl bg-muted" />
        ) : products.length === 0 ? (
          <div className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
            No products yet. Click "Add product" to start selling.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {products.map((p) => (
              <div key={p.id} className="flex gap-3 rounded-xl border bg-card p-3">
                <div className="h-16 w-16 rounded-lg overflow-hidden bg-muted shrink-0">
                  {p.image_url && <Image src={p.image_url} alt={p.title} className="h-full w-full object-cover" fittingType="fill" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium line-clamp-1">{p.title}</div>
                  <div className="text-sm font-semibold">{formatBirr(p.price)}</div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      p.status === "approved"
                        ? "bg-emerald-100 text-emerald-700"
                        : p.status === "restricted"
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
