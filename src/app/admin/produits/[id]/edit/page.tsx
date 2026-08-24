import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateProduct, deleteProduct } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  const updateWithId = updateProduct.bind(null, product.id);
  const deleteWithId = deleteProduct.bind(null, product.id);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold text-forest-950">{product.name}</h1>

      <form action={updateWithId} className="flex max-w-xl flex-col gap-3">
        <Field label="Nom du produit">
          <input name="name" defaultValue={product.name} required className="input" />
        </Field>
        <Field label="Description">
          <textarea name="description" rows={4} defaultValue={product.description} className="input" />
        </Field>
        <Field label="Catégorie">
          <select name="categoryId" defaultValue={product.categoryId} required className="input">
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Prix tout compris (XAF)">
          <input name="priceTotalXaf" type="number" defaultValue={product.priceTotalXaf} required min={0} className="input" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Délai min (jours)">
            <input name="availabilityDaysMin" type="number" defaultValue={product.availabilityDaysMin} min={1} className="input" />
          </Field>
          <Field label="Délai max (jours)">
            <input name="availabilityDaysMax" type="number" defaultValue={product.availabilityDaysMax} min={1} className="input" />
          </Field>
        </div>
        <Field label="Images (URLs séparées par des virgules)">
          <input name="images" defaultValue={product.images.join(", ")} className="input" />
        </Field>
        <Field label="Statut">
          <select name="status" defaultValue={product.status} className="input">
            <option value="ACTIVE">Actif</option>
            <option value="DRAFT">Brouillon</option>
            <option value="ARCHIVED">Archivé</option>
          </select>
        </Field>

        <Button type="submit" className="mt-2 self-start">Enregistrer</Button>
      </form>

      <form action={deleteWithId}>
        <Button type="submit" variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
          Supprimer le produit
        </Button>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-sm font-medium text-forest-800">
      {label}
      {children}
    </label>
  );
}
