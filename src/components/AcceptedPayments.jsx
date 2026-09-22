import React from "react";
import {
  Smartphone,
  Building2,
  Wallet,
  Banknote,
  CreditCard,
} from "lucide-react";

const METHODS = [
  {
    name: "Tele Birr",
    icon: Smartphone,
    detail: "Mobile wallet",
  },
  {
    name: "CBE Bank",
    icon: Building2,
    detail: "Commercial Bank of Ethiopia",
  },
  {
    name: "M_PESA",
    icon: Wallet,
    detail: "Mobile banking",
  },
  {
    name: "Other banks",
    icon: CreditCard,
    detail: "Awash, Dashen, Abyssinia",
  },
  {
    name: "Cash on delivery",
    icon: Banknote,
    detail: "Pay when you receive",
  },
];

export default function AcceptedPayments() {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <div>
        <h3 className="text-base font-semibold">
          Accepted payment methods
        </h3>

        <p className="mt-1 text-sm text-muted-foreground">
          Pay your orders the way that's easiest for you.
        </p>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {METHODS.map((m) => {
          const Icon = m.icon;

          return (
            <div
              key={m.name}
              className="group flex items-center gap-3 rounded-xl border bg-background px-4 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-500/50 hover:shadow-sm"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 transition-colors group-hover:bg-emerald-100">
                <Icon className="h-5 w-5 text-emerald-600" />
              </div>

              <div className="min-w-0">
                <div className="text-sm font-medium leading-tight">
                  {m.name}
                </div>

                <div className="mt-1 text-[11px] leading-tight text-muted-foreground">
                  {m.detail}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
