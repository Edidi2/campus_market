import React, { useState, useEffect } from "react";
import { supabase } from "@/api/supabaseClient";
import { Link } from "react-router-dom";
import { ShieldCheck, Store, Loader2, CheckCircle2, ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import ImageUpload from "@/components/ImageUpload";

export default function ProducerVerification() {
  const { toast } = useToast();
  const [existing, setExisting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    company_name: "",
    owner_name: "",
    contact_phone: "",
    description: "",
    fayda_id_image_url: "",
    tax_receipt_image_url: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const list = await supabase.entities.ProducerProfile.list("-created_date", 1);
        if (list.length) setExisting(list[0]);
      } catch (e) {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="h-96 animate-pulse rounded-xl bg-muted" />;

  const isVerified = existing?.status === "approved";

  const submit = async () => {
    if (!form.company_name || !form.owner_name) {
      toast({ title: "Missing fields", description: "Company name and owner name are required.", variant: "destructive" });
      return;
    }
    if (!form.fayda_id_image_url || !form.tax_receipt_image_url) {
      toast({ title: "Documents required", description: "Please upload your Fayda ID and tax receipt.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      await supabase.entities.ProducerProfile.create({
        ...form,
        verified: false,
        status: "pending",
      });
      toast({ title: "Verification submitted", description: "Your documents were sent for review. You'll be approved shortly." });
      const list = await supabase.entities.ProducerProfile.list("-created_date", 1);
      if (list.length) setExisting(list[0]);
      setForm({ company_name: "", owner_name: "", contact_phone: "", description: "", fayda_id_image_url: "", tax_receipt_image_url: "" });
    } catch (e) {
      toast({ title: "Failed", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        ← Back to marketplace
      </Link>

      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Producer verification</h1>
          <p className="text-sm text-muted-foreground">Verify your business so students know you're a trusted seller — not a scammer.</p>
        </div>
      </div>

      {existing && (
        <div
          className={`rounded-xl border p-4 flex items-start gap-3 ${
            isVerified ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"
          }`}
        >
          {isVerified ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
          ) : (
            <Loader2 className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          )}
          <div className="text-sm">
            {isVerified ? (
              <>
                <p className="font-medium text-emerald-800">Your business is verified ✓</p>
                <p className="text-emerald-700">{existing.company_name} — you can now list and sell products.</p>
                <Button asChild size="sm" className="mt-3"><Link to="/sell">Go to seller dashboard <ArrowRight className="h-4 w-4 ml-1" /></Link></Button>
              </>
            ) : (
              <>
                <p className="font-medium text-amber-800">Verification under review</p>
                <p className="text-amber-700">Your documents for <b>{existing.company_name}</b> are being reviewed by the university admin. You'll be able to sell once approved.</p>
              </>
            )}
          </div>
        </div>
      )}

      <div className="rounded-xl border bg-card p-5 space-y-4">
        <h2 className="font-semibold flex items-center gap-2"><Store className="h-4 w-4" /> Business details</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <div><Label>Company / shop name *</Label><Input value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} placeholder="e.g. Adama Books Co-op" /></div>
          <div><Label>Owner's full name *</Label><Input value={form.owner_name} onChange={(e) => setForm({ ...form, owner_name: e.target.value })} placeholder="e.g. Abebe Bekele" /></div>
          <div className="sm:col-span-2">
            <Label>Phone number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={form.contact_phone} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} placeholder="+251 9..." className="pl-9" />
            </div>
          </div>
        </div>
        <div><Label>Business description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} placeholder="What do you sell?" /></div>

        <div className="grid sm:grid-cols-2 gap-4">
          <ImageUpload label="Fayda ID (scanned image) *" value={form.fayda_id_image_url} onChange={(v) => setForm({ ...form, fayda_id_image_url: v })} />
          <ImageUpload label="Tax payment receipt *" value={form.tax_receipt_image_url} onChange={(v) => setForm({ ...form, tax_receipt_image_url: v })} />
        </div>

        <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
          Your Fayda ID and tax receipt are checked by the university admin to confirm your business is legitimate before you can sell. This protects students from scammers.
        </div>

        <Button className="h-11 w-full" disabled={saving} onClick={submit}>
          {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Submitting...</> : "Submit for verification"}
        </Button>
      </div>
    </div>
  );
}