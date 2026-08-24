"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import type { Category } from "@/generated/prisma/client";

export function CatalogFilterBar({
  categories,
  activeCategorySlug,
}: {
  categories: Category[];
  activeCategorySlug?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="scroll-rail -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0">
        <Link
          href="/catalogue"
          className={cn(
            "shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium",
            !activeCategorySlug
              ? "border-forest-800 bg-forest-800 text-sand-50"
              : "border-forest-200 text-forest-700 hover:bg-forest-50"
          )}
        >
          Tout
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/catalogue/${c.slug}`}
            className={cn(
              "shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium",
              activeCategorySlug === c.slug
                ? "border-forest-800 bg-forest-800 text-sand-50"
                : "border-forest-200 text-forest-700 hover:bg-forest-50"
            )}
          >
            {c.name}
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <select
          defaultValue={searchParams.get("sort") ?? "recent"}
          onChange={(e) => updateParam("sort", e.target.value)}
          className="rounded-lg border border-forest-200 bg-white px-3 py-2 text-sm text-forest-800"
        >
          <option value="recent">Plus récents</option>
          <option value="price_asc">Prix croissant</option>
          <option value="price_desc">Prix décroissant</option>
        </select>
        <input
          type="number"
          placeholder="Prix min"
          defaultValue={searchParams.get("minPrice") ?? ""}
          onBlur={(e) => updateParam("minPrice", e.target.value)}
          className="w-28 rounded-lg border border-forest-200 bg-white px-3 py-2 text-sm text-forest-800"
        />
        <input
          type="number"
          placeholder="Prix max"
          defaultValue={searchParams.get("maxPrice") ?? ""}
          onBlur={(e) => updateParam("maxPrice", e.target.value)}
          className="w-28 rounded-lg border border-forest-200 bg-white px-3 py-2 text-sm text-forest-800"
        />
      </div>
    </div>
  );
}
