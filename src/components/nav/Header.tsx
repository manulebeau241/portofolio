"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ShoppingBag, User } from "lucide-react";
import { useCartStore, cartCount } from "@/store/cart";
import type { FormEvent } from "react";

export function Header() {
  const router = useRouter();
  const count = useCartStore((s) => cartCount(s.items));

  function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const q = String(form.get("q") ?? "").trim();
    router.push(q ? `/recherche?q=${encodeURIComponent(q)}` : "/recherche");
  }

  return (
    <header className="sticky top-0 z-30 border-b border-forest-100 bg-forest-950 text-sand-50">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 md:px-6">
        <Link href="/" className="shrink-0 text-lg font-extrabold tracking-tight">
          Okoumia
        </Link>

        <form
          onSubmit={handleSearch}
          className="hidden flex-1 items-center gap-2 rounded-xl bg-white px-3 py-2 md:flex"
        >
          <Search size={18} className="shrink-0 text-forest-500" />
          <input
            name="q"
            type="search"
            placeholder="Rechercher un produit…"
            className="w-full bg-transparent text-sm text-forest-950 placeholder:text-forest-400 focus:outline-none"
          />
        </form>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link href="/catalogue" className="hover:text-gold-300">
            Catalogue
          </Link>
          <Link href="/points-relais" className="hover:text-gold-300">
            Points relais
          </Link>
          <Link href="/suivi" className="hover:text-gold-300">
            Suivre ma commande
          </Link>
          <Link href="/faq" className="hover:text-gold-300">
            FAQ
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <Link
            href="/compte"
            className="hidden rounded-lg p-2 hover:bg-forest-900 md:inline-flex"
            aria-label="Mon compte"
          >
            <User size={20} />
          </Link>
          <Link
            href="/panier"
            className="relative inline-flex rounded-lg p-2 hover:bg-forest-900"
            aria-label="Panier"
          >
            <ShoppingBag size={20} />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-500 px-1 text-[10px] font-bold text-forest-950">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
