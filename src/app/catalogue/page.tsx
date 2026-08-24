import { prisma } from "@/lib/prisma";
import { getFilteredProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/product/ProductCard";
import { CatalogFilterBar } from "@/components/product/CatalogFilterBar";

export const metadata = { title: "Catalogue — Okoumia" };

export default async function CataloguePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const sort = typeof sp.sort === "string" ? sp.sort : undefined;
  const minPrice = sp.minPrice ? Number(sp.minPrice) : undefined;
  const maxPrice = sp.maxPrice ? Number(sp.maxPrice) : undefined;

  const [categories, products] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    getFilteredProducts({
      sort: sort as "recent" | "price_asc" | "price_desc" | undefined,
      minPrice,
      maxPrice,
    }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-5 md:px-6">
      <h1 className="mb-4 text-xl font-bold text-forest-950">Catalogue</h1>
      <CatalogFilterBar categories={categories} />
      {products.length === 0 ? (
        <p className="mt-10 text-center text-sm text-forest-500">
          Aucun produit ne correspond à ces critères pour le moment.
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
