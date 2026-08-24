import Image from "next/image";
import Link from "next/link";
import { formatAvailability, formatXaf } from "@/lib/utils";
import type { Product } from "@/generated/prisma/client";

export function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  return (
    <Link
      href={`/produit/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-card bg-white ring-1 ring-forest-100 transition-shadow hover:shadow-lg hover:shadow-forest-900/5"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-sand-100">
        <Image
          src={product.images[0] ?? "/images/mode.svg"}
          alt={product.name}
          fill
          priority={priority}
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <h3 className="line-clamp-2 text-sm font-medium text-forest-950">
          {product.name}
        </h3>
        <p className="text-xs text-forest-500">
          {formatAvailability(product.availabilityDaysMin, product.availabilityDaysMax)}
        </p>
        <div className="mt-auto flex items-baseline justify-between pt-1">
          <span className="text-base font-bold text-forest-800">
            {formatXaf(product.priceTotalXaf)}
          </span>
          <span className="rounded-full bg-gold-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gold-700">
            Tout compris
          </span>
        </div>
      </div>
    </Link>
  );
}
