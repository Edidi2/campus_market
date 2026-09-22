import React from "react";
import { Smartphone, Building2, Wallet, Banknote, CreditCard } from "lucide-react";

const METHODS = [
  { name: "Tele Birr", icon: Smartphone, detail: "Mobile wallet" },
  { name: "CBE Bank", icon: Building2, detail: "Commercial Bank of Ethiopia" },
  { name: "M_PESA", icon: Wallet, detail: "Mobile banking" },
  { name: "Other banks", icon: CreditCard, detail: "Awash, Dashen, Abyssinia" },
  { name: "Cash on delivery", icon: Banknote, detail: "Pay when you receive" },
];

export default function AcceptedPayments() {
  return (
    <div className="rounded-2xl border bg-card p-5">
      <h3 className="font-semibold">Accepted payment methods</h3>
      <p className="text-sm text-muted-foreground mt-1">Pay your orders the way that's easiest for you.</p>
      <div className="mt-4 flex flex-wrap gap-3">
        {METHODS.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.name} className="flex items-center gap-2 rounded-xl border bg-background px-3 py-2">
              <Icon className="h-5 w-5 text-emerald-600" />
              <div>
                <div className="text-sm font-medium leading-none">{m.name}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{m.detail}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}