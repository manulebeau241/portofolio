"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore, cartTotal } from "@/store/cart";
import { formatXaf } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/Button";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const total = cartTotal(items);

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-4 py-16 text-center">
        <p className="text-forest-800">Votre panier est vide.</p>
        <ButtonLink href="/catalogue">Découvrir le catalogue</ButtonLink>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-5 md:px-6">
      <h1 className="mb-4 text-xl font-bold text-forest-950">Mon panier</h1>

      <ul className="flex flex-col gap-3">
        {items.map((item) => (
          <li
            key={item.productId}
            className="flex gap-3 rounded-card bg-white p-3 ring-1 ring-forest-100"
          >
            <Link href={`/produit/${item.slug}`} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-sand-100">
              <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
            </Link>
            <div className="flex flex-1 flex-col justify-between">
              <div className="flex items-start justify-between gap-2">
                <Link href={`/produit/${item.slug}`} className="text-sm font-medium text-forest-950 line-clamp-2">
                  {item.name}
                </Link>
                <button
                  type="button"
                  onClick={() => removeItem(item.productId)}
                  aria-label="Retirer"
                  className="shrink-0 text-forest-400 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center rounded-lg border border-forest-200">
                  <button
                    type="button"
                    onClick={() => setQuantity(item.productId, item.quantity - 1)}
                    className="flex h-8 w-8 items-center justify-center text-forest-700"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(item.productId, item.quantity + 1)}
                    className="flex h-8 w-8 items-center justify-center text-forest-700"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <span className="text-sm font-bold text-forest-900">
                  {formatXaf(item.priceTotalXaf * item.quantity)}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex flex-col gap-3 rounded-card bg-forest-50 p-4">
        <div className="flex items-center justify-between text-sm text-forest-700">
          <span>Sous-total (tout compris)</span>
          <span className="font-semibold text-forest-950">{formatXaf(total)}</span>
        </div>
        <p className="text-xs text-forest-500">
          Aucun frais additionnel : le prix affiché inclut le fret et la douane.
        </p>
        <ButtonLink href="/commande/point-relais" size="lg">
          Choisir mon point relais
        </ButtonLink>
      </div>
    </div>
  );
}
