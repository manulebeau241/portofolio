import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product/ProductCard";
import { ButtonLink } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categories, products] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({
      where: { status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ]);

  return (
    <div className="flex flex-col gap-8 pb-8">
      <section className="bg-forest-950 px-4 pb-10 pt-6 text-sand-50 md:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-gold-300">
            Import Gabon
          </p>
          <h1 className="mt-2 max-w-md text-3xl font-extrabold leading-tight md:text-4xl">
            Ce qu&apos;on ne trouve pas ici, on vous le fait venir.
          </h1>
          <p className="mt-3 max-w-md text-sm text-forest-200 md:text-base">
            Prix tout compris (produit + fret + douane). Retrait simple dans
            une boutique partenaire près de chez vous à Libreville.
          </p>
          <div className="mt-5 flex gap-3">
            <ButtonLink href="/catalogue" variant="secondary">
              Voir le catalogue
            </ButtonLink>
            <ButtonLink href="/points-relais" variant="outline" className="border-forest-600 text-sand-50 hover:bg-forest-900">
              Points relais
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <h2 className="mb-3 text-lg font-bold text-forest-950">Catégories</h2>
        <div className="scroll-rail -mx-4 flex gap-3 overflow-x-auto px-4 md:mx-0 md:grid md:grid-cols-4 md:px-0">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/catalogue/${c.slug}`}
              className="group relative flex h-28 w-40 shrink-0 flex-col justify-end overflow-hidden rounded-card bg-forest-800 p-3 md:w-auto"
            >
              {c.imageUrl && (
                <Image
                  src={c.imageUrl}
                  alt={c.name}
                  fill
                  sizes="200px"
                  className="object-cover opacity-70 transition-transform duration-300 group-hover:scale-105"
                />
              )}
              <span className="relative z-10 text-sm font-semibold text-sand-50">
                {c.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-forest-950">Nouveautés</h2>
          <Link href="/catalogue" className="text-sm font-semibold text-forest-600 hover:text-forest-800">
            Tout voir
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} priority={i < 2} />
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <div className="grid gap-3 rounded-card bg-forest-50 p-5 text-sm text-forest-800 md:grid-cols-3">
          <div>
            <p className="font-semibold text-forest-950">Prix tout compris</p>
            <p className="mt-1 text-forest-600">Produit, fret et douane inclus. Aucun frais surprise au retrait.</p>
          </div>
          <div>
            <p className="font-semibold text-forest-950">Paiement à la commande</p>
            <p className="mt-1 text-forest-600">Mobile Money (Airtel, Moov) ou carte. Votre commande est lancée dès le paiement validé.</p>
          </div>
          <div>
            <p className="font-semibold text-forest-950">Retrait en point relais</p>
            <p className="mt-1 text-forest-600">Un code unique vous est envoyé pour récupérer votre colis dans une boutique de votre quartier.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
