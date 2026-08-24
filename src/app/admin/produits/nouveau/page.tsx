import { prisma } from "@/lib/prisma";
import { createProduct } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold text-forest-950">Nouveau produit</h1>

      <form action={createProduct} className="flex max-w-xl flex-col gap-3">
        <Field label="Nom du produit">
          <input name="name" required className="input" />
        </Field>
        <Field label="Description">
          <textarea name="description" rows={4} className="input" />
        </Field>
        <Field label="Catégorie">
          <select name="categoryId" required className="input">
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Prix tout compris (XAF)">
          <input name="priceTotalXaf" type="number" required min={0} className="input" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Délai min (jours)">
            <input name="availabilityDaysMin" type="number" min={1} defaultValue={10} className="input" />
          </Field>
          <Field label="Délai max (jours)">
            <input name="availabilityDaysMax" type="number" min={1} defaultValue={18} className="input" />
          </Field>
        </div>
        <Field label="Images (URLs séparées par des virgules)">
          <input name="images" placeholder="/images/mode.svg" className="input" />
        </Field>

        <Button type="submit" className="mt-2 self-start">Créer le produit</Button>
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
