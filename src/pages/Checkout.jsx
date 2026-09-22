import React, { useState, useEffect } from "react";
import { supabase } from "@/api/supabaseClient";
import { Link } from "react-router-dom";
import { Truck, MapPin, CheckCircle2, CreditCard, Smartphone, Building2, Wallet, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/lib/cartContext";
import { useToast } from "@/components/ui/use-toast";
import { formatBirr } from "@/utils";

const SAFE_ZONES = [
  "Main Library Entrance",
  "Student Union Building",
  "Science Block Gate",
  "Dormitory A Reception",
  "Cafeteria Main Hall",
];

const PAYMENT_METHODS = [
  { v: "tele_birr", l: "Tele Birr", icon: Smartphone, detail: "Send to 0912 34 56 78 — CampusGebeya", hint: "Open Tele Birr app → Send money → enter the number → confirm" },
  { v: "cbe", l: "CBE Bank", icon: Building2, detail: "Account 1000 2030 0456 789 — CampusGebeya PLC", hint: "Transfer via CBE Birr or branch to the account above" },
  { v: "m-pesa", l: "M-PESA", icon: Wallet, detail: "M-PESA ID: 88421 — CampusGebeya", hint: "Use the M-PESA ID above to complete the transfer" },
  { v: "other_bank", l: "Other banks", icon: Building2, detail: "Awash / Dashen / Abyssinia — Account 4567 8910 2345", hint: "Transfer to the account above, then share the receipt" },
  { v: "cash_on_delivery", l: "Cash on delivery", icon: Banknote, detail: "Pay the rider in cash on arrival", hint: "Have exact change ready at the delivery safe zone" },
];

const DELIVERY_PROVIDERS = [
  { name: "Campus Express", fee: 1.5, eta: "Same day" },
  { name: "Student Riders Co-op", fee: 1.0, eta: "Within 2 hours" },
  { name: "GreenDelivery", fee: 2.0, eta: "Eco same-day" },
  { name: "ZayRide Campus", fee: 2.5, eta: "Within 1 hour" },
  { name: "Ride Express", fee: 3.0, eta: "Express 30 min" },
  { name: "Self pickup", fee: 0, eta: "Pick up at safe zone — free" },
];

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { toast } = useToast();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    student_name: "",
    student_id_number: "",
    delivery_location: SAFE_ZONES[0],
    delivery_provider: DELIVERY_PROVIDERS[0].name,
    payment_method: "tele_birr",
    phone: "",
  });
  const [placing, setPlacing] = useState(false);
  const [done, setDone] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const list = await supabase.entities.StudentProfile.list();
        if (list.length) setProfile(list[0]);
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  useEffect(() => {
    if (profile)
      setForm((f) => ({
        ...f,
        student_name: profile.full_name,
        student_id_number: profile.student_id_number,
        phone: profile.phone || "",
      }));
  }, [profile]);

  if (items.length === 0 && !done) {
    return (
      <div className="text-center py-20 space-y-3">
        <h2 className="text-xl font-semibold">Nothing to check out</h2>
        <p className="text-muted-foreground">Your cart is empty.</p>
        <Button asChild><Link to="/">Browse marketplace</Link></Button>
      </div>
    );
  }

  const provider = DELIVERY_PROVIDERS.find((p) => p.name === form.delivery_provider);
  const grandTotal = total + (provider?.fee || 0);

  const placeOrder = async () => {
    if (!form.student_name || !form.student_id_number) {
      toast({ title: "Missing info", description: "Please complete your name and student ID.", variant: "destructive" });
      return;
    }
    setPlacing(true);
    try {
      const order = await supabase.entities.Order.create({
        student_name: form.student_name,
        student_id_number: form.student_id_number,
        items: JSON.stringify(items.map((i) => ({ id: i.id, title: i.title, price: i.price, qty: i.qty }))),
        total: grandTotal,
        delivery_location: form.delivery_location,
        delivery_zone: form.delivery_location,
        delivery_provider: form.delivery_provider,
        delivery_status: "pending",
        payment_method: form.payment_method,
        status: "placed",
      });
      setDone(order);
      clearCart();
    } catch (e) {
      toast({ title: "Order failed", description: e.message, variant: "destructive" });
    } finally {
      setPlacing(false);
    }
  };

  if (done) {
    return (
      <div className="max-w-lg mx-auto text-center py-16 space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <h1 className="text-2xl font-bold">Order placed!</h1>
        <p className="text-muted-foreground">
          Your order has been sent to the sellers. A delivery rider from <b>{done.delivery_provider}</b> will bring it to{" "}
          <b>{done.delivery_location}</b>.
        </p>
        <div className="rounded-xl border bg-card p-4 text-left text-sm space-y-1">
          <div className="flex justify-between"><span className="text-muted-foreground">Order ID</span><span className="font-mono">{done.id.slice(0, 8)}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Total</span><span className="font-semibold">{formatBirr(done.total)}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Payment</span><span>{({ tele_birr: "Tele Birr", cbe: "CBE Bank", mebesa: "MEBESA", other_bank: "Other banks", cash_on_delivery: "Cash on delivery" })[done.payment_method] || done.payment_method}</span></div>
        </div>
        <Button asChild><Link to="/">Back to marketplace</Link></Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Checkout</h1>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-xl border bg-card p-5 space-y-4">
            <h2 className="font-semibold flex items-center gap-2"><MapPin className="h-4 w-4" /> Student & delivery details</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <div><Label>Full name</Label><Input value={form.student_name} onChange={(e) => setForm({ ...form, student_name: e.target.value })} /></div>
              <div><Label>Student ID number</Label><Input value={form.student_id_number} onChange={(e) => setForm({ ...form, student_id_number: e.target.value })} /></div>
              <div><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+251 9..." /></div>
              <div>
                <Label>Delivery safe zone</Label>
                <select
                  className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={form.delivery_location}
                  onChange={(e) => setForm({ ...form, delivery_location: e.target.value })}
                >
                  {SAFE_ZONES.map((z) => <option key={z} value={z}>{z}</option>)}
                </select>
              </div>
            </div>
          </section>

          <section className="rounded-xl border bg-card p-5 space-y-4">
            <h2 className="font-semibold flex items-center gap-2"><Truck className="h-4 w-4" /> Delivery provider</h2>
            <div className="space-y-2">
              {DELIVERY_PROVIDERS.map((p) => (
                <label
                  key={p.name}
                  className={`flex items-center justify-between rounded-lg border p-3 cursor-pointer ${
                    form.delivery_provider === p.name ? "border-emerald-600 bg-emerald-50/50" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="provider"
                      checked={form.delivery_provider === p.name}
                      onChange={() => setForm({ ...form, delivery_provider: p.name })}
                      className="accent-emerald-600"
                    />
                    <div>
                      <div className="font-medium text-sm">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.eta}</div>
                    </div>
                  </div>
                  <span className="text-sm font-semibold">{formatBirr(p.fee)}</span>
                </label>
              ))}
            </div>
          </section>

          <section className="rounded-xl border bg-card p-5 space-y-4">
            <h2 className="font-semibold flex items-center gap-2"><CreditCard className="h-4 w-4" /> Payment method</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PAYMENT_METHODS.map((m) => {
                const Icon = m.icon;
                const active = form.payment_method === m.v;
                return (
                  <button
                    key={m.v}
                    onClick={() => setForm({ ...form, payment_method: m.v })}
                    className={`flex flex-col items-center gap-1.5 rounded-lg border p-3 text-sm transition-colors ${
                      active ? "border-emerald-600 bg-emerald-50/60 font-medium ring-1 ring-emerald-600" : "hover:bg-muted/40"
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${active ? "text-emerald-700" : "text-muted-foreground"}`} />
                    {m.l}
                  </button>
                );
              })}
            </div>
            {(() => {
              const m = PAYMENT_METHODS.find((p) => p.v === form.payment_method);
              if (!m) return null;
              return (
                <div className="rounded-lg bg-emerald-50/50 border border-emerald-100 p-3 space-y-1.5">
                  <div className="flex items-center gap-2 text-sm font-medium text-emerald-800"><m.icon className="h-4 w-4" /> {m.l}</div>
                  <div className="text-sm font-mono text-emerald-900 bg-white/60 rounded px-2 py-1 inline-block">{m.detail}</div>
                  <p className="text-xs text-emerald-700">{m.hint}</p>
                </div>
              );
            })()}
          </section>
        </div>

        <div className="rounded-xl border bg-card p-5 h-fit space-y-3 lg:sticky lg:top-20">
          <h2 className="font-semibold">Your order</h2>
          <div className="space-y-2 max-h-48 overflow-auto">
            {items.map((it) => (
              <div key={it.id} className="flex justify-between text-sm">
                <span className="truncate pr-2">{it.qty}× {it.title}</span>
                <span>{formatBirr(it.price * it.qty)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatBirr(total)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span>{formatBirr(provider?.fee || 0)}</span></div>
            <div className="flex justify-between font-semibold text-base pt-1"><span>Total</span><span>{formatBirr(grandTotal)}</span></div>
          </div>
          <Button className="w-full h-11" disabled={placing} onClick={placeOrder}>
            {placing ? "Placing order..." : "Place order"}
          </Button>
        </div>
      </div>
    </div>
  );
}