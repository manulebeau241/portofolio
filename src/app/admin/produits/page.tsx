import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatXaf } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-forest-950">Produits</h1>
        <ButtonLink href="/admin/produits/nouveau">Nouveau produit</ButtonLink>
      </div>

      <div className="overflow-x-auto rounded-card bg-white ring-1 ring-forest-100">
        <table className="w-full text-left text-sm">
          <thead className="bg-forest-50 text-xs uppercase text-forest-500">
            <tr>
              <th className="px-4 py-2 font-medium">Produit</th>
              <th className="px-4 py-2 font-medium">Catégorie</th>
              <th className="px-4 py-2 font-medium">Prix</th>
              <th className="px-4 py-2 font-medium">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-forest-50">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-forest-50/50">
                <td className="px-4 py-2.5">
                  <Link href={`/admin/produits/${p.id}/edit`} className="font-medium text-forest-800 hover:underline">
                    {p.name}
                  </Link>
                </td>
                <td className="px-4 py-2.5 text-forest-600">{p.category.name}</td>
                <td className="px-4 py-2.5 font-medium text-forest-900">{formatXaf(p.priceTotalXaf)}</td>
                <td className="px-4 py-2.5">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                      p.status === "ACTIVE"
                        ? "bg-forest-100 text-forest-800"
                        : p.status === "DRAFT"
                        ? "bg-gold-100 text-gold-800"
                        : "bg-sand-200 text-forest-500"
                    )}
                  >
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
