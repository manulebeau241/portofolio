import { Search } from "lucide-react";
import { getFilteredProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/product/ProductCard";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const products = q ? await getFilteredProducts({ q }) : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-5 md:px-6">
      <form className="flex items-center gap-2 rounded-xl border border-forest-200 bg-white px-3 py-2.5">
        <Search size={18} className="shrink-0 text-forest-500" />
        <input
          name="q"
          type="search"
          defaultValue={q}
          autoFocus
          placeholder="Rechercher un produit…"
          className="w-full bg-transparent text-sm text-forest-950 placeholder:text-forest-400 focus:outline-none"
        />
      </form>

      {!q ? (
        <p className="mt-10 text-center text-sm text-forest-500">
          Recherchez parmi les produits importés : mode, accessoires,
          électronique, cosmétique…
        </p>
      ) : products.length === 0 ? (
        <p className="mt-10 text-center text-sm text-forest-500">
          Aucun résultat pour « {q} ».
        </p>
      ) : (
        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
