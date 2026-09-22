import React, { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { ShoppingCart, Store, User, Shield, LayoutDashboard, Menu, X, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cartContext";
import { useAuth } from "@/lib/AuthContext";

const navItems = [
  { to: "/", label: "Marketplace", icon: Store },
  { to: "/sell", label: "Sell Products", icon: LayoutDashboard },
  { to: "/profile", label: "My Profile", icon: User },
];

export default function Layout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { count } = useCart();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 gap-3">
          <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-lg tracking-tight">CampusMarket</span>
          </Link>
          <nav className="ml-auto hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition ${
                    active ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="h-4 w-4" /> {item.label}
                </Link>
              );
            })}
            {isAdmin && (
              <Link
                to="/admin"
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition ${
                  location.pathname === "/admin" ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Shield className="h-4 w-4" /> University Control
              </Link>
            )}
          </nav>
          <Link to="/cart" className="relative ml-auto md:ml-2">
            <Button variant="outline" size="icon" aria-label="Cart">
              <ShoppingCart className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-primary-foreground text-xs font-semibold">
                  {count}
                </span>
              )}
            </Button>
          </Link>
        </div>
        {open && (
          <div className="md:hidden border-t bg-background px-2 pb-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-md hover:bg-muted text-sm"
                >
                  <Icon className="h-4 w-4" /> {item.label}
                </Link>
              );
            })}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-md hover:bg-muted text-sm"
              >
                <Shield className="h-4 w-4" /> University Control
              </Link>
            )}
          </div>
        )}
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">
        <Outlet />
      </main>
      <footer className="border-t mt-10">
        <div className="mx-auto max-w-7xl px-4 py-6 text-center text-xs text-muted-foreground">
          CampusMarket — a campus-restricted marketplace. Transactions happen in person at designated campus safe zones.
        </div>
      </footer>
    </div>
  );
}