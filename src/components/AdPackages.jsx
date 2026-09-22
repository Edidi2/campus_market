import React, { useState } from "react";
import { Megaphone, Smartphone, Building2, Wallet, Banknote, Check } from "lucide-react";
import { formatBirr } from "@/utils";

const PACKAGES = [
  { id: "hero", name: "Hero spotlight", desc: "Top of the homepage — maximum visibility", price: 500, position: "hero" },
  { id: "banner", name: "Banner ad", desc: "Rotating sponsored banner across the marketplace", price: 350, position: "banner" },
  { id: "sidebar", name: "Sidebar listing", desc: "Small ad in the marketplace sidebar", price: 200, position: "sidebar" },
];

const PAYMENT_METHODS = [
  { v: "tele_birr", l: "Tele Birr", icon: Smartphone, detail: "Send to 0912 34 56 78 — CampusGebeya" },
  { v: "cbe", l: "CBE Bank", icon: Building2, detail: "Account 1000 2030 0456 789 — CampusGebeya PLC" },
  { v: "m-pesa", l: "M-PESA", icon: Wallet, detail: "M_PESA ID: 88421 — CampusGebeya" },
  { v: "other_bank", l: "Other banks", icon: Building2, detail: "Awash / Dashen / Abyssinia — Account 4567 8910 2345" },
  { v: "cash_on_delivery", l: "Cash", icon: Banknote, detail: "Pay at the admin office" },
];

export default function AdPackages() {
  const [selected, setSelected] = useState(PACKAGES[0].id);
  const [payment, setPayment] = useState("tele_birr");
  const pkg = PACKAGES.find((p) => p.id === selected);
  const pm = PAYMENT_METHODS.find((p) => p.v === payment);

  return (
    <div className="rounded-2xl border bg-card p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Megaphone className="h-5 w-5 text-emerald-600" />
        <h3 className="font-semibold">Promote your product</h3>
      </div>
      <p className="text-sm text-muted-foreground">Choose an ad package and pay with your preferred method. Your promotion runs for 7 days.</p>

      <div className="grid sm:grid-cols-3 gap-3">
        {PACKAGES.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelected(p.id)}
            className={`text-left rounded-xl border p-4 transition ${
              selected === p.id ? "border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600" : "hover:bg-muted/40"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">{p.name}</span>
              {selected === p.id && <Check className="h-4 w-4 text-emerald-600" />}
            </div>
            <div className="mt-1 text-lg font-bold text-emerald-700">{formatBirr(p.price)}</div>
            <p className="mt-1 text-xs text-muted-foreground">{p.desc}</p>
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <div className="text-sm font-medium">Payment method</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {PAYMENT_METHODS.map((m) => {
            const Icon = m.icon;
            const active = payment === m.v;
            return (
              <button
                key={m.v}
                onClick={() => setPayment(m.v)}
                className={`flex flex-col items-center gap-1 rounded-lg border p-2.5 text-xs transition ${
                  active ? "border-emerald-600 bg-emerald-50/60 font-medium ring-1 ring-emerald-600" : "hover:bg-muted/40"
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? "text-emerald-700" : "text-muted-foreground"}`} />
                {m.l}
              </button>
            );
          })}
        </div>
        {pm && (
          <div className="rounded-lg bg-emerald-50/50 border border-emerald-100 p-2.5 text-xs">
            <span className="text-muted-foreground">Pay {formatBirr(pkg.price)} to: </span>
            <span className="font-mono text-emerald-900">{pm.detail}</span>
          </div>
        )}
      </div>
    </div>
  );
}