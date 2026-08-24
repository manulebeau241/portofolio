import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductGallery } from "@/components/product/ProductGallery";
import { AddToCartPanel } from "@/components/product/AddToCartPanel";
import { formatAvailability } from "@/lib/utils";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product || product.status !== "ACTIVE") notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-5 md:px-6">
      <nav className="mb-4 text-xs text-forest-500">
        <Link href="/catalogue" className="hover:underline">Catalogue</Link>
        {" / "}
        <Link href={`/catalogue/${product.category.slug}`} className="hover:underline">
          {product.category.name}
        </Link>
      </nav>

      <div className="grid gap-6 md:grid-cols-2">
        <ProductGallery images={product.images} name={product.name} />

        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-xl font-bold text-forest-950 md:text-2xl">
              {product.name}
            </h1>
            <p className="mt-1 text-sm font-medium text-gold-700">
              {formatAvailability(product.availabilityDaysMin, product.availabilityDaysMax)}
            </p>
          </div>

          <AddToCartPanel
            productId={product.id}
            slug={product.slug}
            name={product.name}
            image={product.images[0] ?? "/images/mode.svg"}
            priceTotalXaf={product.priceTotalXaf}
          />

          <div className="rounded-card bg-forest-50 p-4 text-sm text-forest-700">
            <p>
              Ce produit est importé sur commande : il n&apos;est pas en stock
              immédiat. Une fois votre commande payée, nous lançons
              l&apos;acheminement et vous prévenons dès son arrivée à votre
              point relais.
            </p>
          </div>

          <div>
            <h2 className="mb-1 text-sm font-semibold text-forest-950">Description</h2>
            <p className="text-sm leading-relaxed text-forest-700">{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
