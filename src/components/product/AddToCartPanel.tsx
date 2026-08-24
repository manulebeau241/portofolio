"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/store/cart";
import { formatXaf } from "@/lib/utils";

export function AddToCartPanel({
  productId,
  slug,
  name,
  image,
  priceTotalXaf,
}: {
  productId: string;
  slug: string;
  name: string;
  image: string;
  priceTotalXaf: number;
}) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const router = useRouter();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="text-2xl font-extrabold text-forest-900">
          {formatXaf(priceTotalXaf)}
        </span>
        <span className="rounded-full bg-gold-50 px-2.5 py-1 text-xs font-semibold text-gold-700">
          Tout compris — sans frais cachés
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-lg border border-forest-200">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-10 w-10 items-center justify-center text-forest-700"
            aria-label="Diminuer la quantité"
          >
            <Minus size={16} />
          </button>
          <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="flex h-10 w-10 items-center justify-center text-forest-700"
            aria-label="Augmenter la quantité"
          >
            <Plus size={16} />
          </button>
        </div>

        <Button
          className="flex-1"
          onClick={() => {
            addItem({ productId, slug, name, image, priceTotalXaf }, quantity);
            setAdded(true);
          }}
        >
          Ajouter au panier
        </Button>
      </div>

      {added && (
        <div className="flex items-center justify-between rounded-lg bg-forest-50 px-3 py-2 text-sm text-forest-800">
          <span>Ajouté au panier ({quantity})</span>
          <button
            type="button"
            onClick={() => router.push("/panier")}
            className="font-semibold text-forest-700 underline underline-offset-2"
          >
            Voir le panier
          </button>
        </div>
      )}
    </div>
  );
}
