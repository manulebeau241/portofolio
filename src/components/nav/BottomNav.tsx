"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Search, ShoppingBag, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore, cartCount } from "@/store/cart";

const items = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/catalogue", label: "Catalogue", icon: LayoutGrid },
  { href: "/recherche", label: "Recherche", icon: Search },
  { href: "/panier", label: "Panier", icon: ShoppingBag },
  { href: "/compte", label: "Compte", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  const count = useCartStore((s) => cartCount(s.items));

  if (pathname.startsWith("/admin")) return null;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-forest-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 md:hidden">
      <ul className="flex items-stretch justify-between px-1 pb-[env(safe-area-inset-bottom)]">
        {items.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={cn(
                  "relative flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium",
                  active ? "text-forest-800" : "text-forest-400"
                )}
              >
                <span className="relative">
                  <Icon
                    size={22}
                    strokeWidth={active ? 2.4 : 1.9}
                    className={active ? "text-forest-800" : "text-forest-400"}
                  />
                  {href === "/panier" && count > 0 && (
                    <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-500 px-1 text-[9px] font-bold text-forest-950">
                      {count}
                    </span>
                  )}
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
