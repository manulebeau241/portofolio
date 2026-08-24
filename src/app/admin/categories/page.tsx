import { prisma } from "@/lib/prisma";
import { createCategory } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold text-forest-950">Catégories</h1>

      <div className="overflow-hidden rounded-card bg-white ring-1 ring-forest-100">
        <table className="w-full text-left text-sm">
          <thead className="bg-forest-50 text-xs uppercase text-forest-500">
            <tr>
              <th className="px-4 py-2 font-medium">Nom</th>
              <th className="px-4 py-2 font-medium">Slug</th>
              <th className="px-4 py-2 font-medium">Produits</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-forest-50">
            {categories.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-2.5 font-medium text-forest-900">{c.name}</td>
                <td className="px-4 py-2.5 text-forest-500">{c.slug}</td>
                <td className="px-4 py-2.5 text-forest-600">{c._count.products}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form action={createCategory} className="flex max-w-md items-end gap-2">
        <label className="flex flex-1 flex-col gap-1 text-sm font-medium text-forest-800">
          Nouvelle catégorie
          <input name="name" required placeholder="Ex. Puériculture" className="input" />
        </label>
        <Button type="submit">Ajouter</Button>
      </form>
    </div>
  );
}
