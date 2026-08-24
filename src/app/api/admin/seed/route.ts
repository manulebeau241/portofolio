import { prisma } from "@/lib/prisma";
import { seedDatabase } from "@/lib/seedData";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");
  const force = searchParams.get("force") === "true";

  if (!process.env.SEED_SECRET || key !== process.env.SEED_SECRET) {
    return new Response("Clé invalide.", { status: 403 });
  }

  if (!force) {
    const existing = await prisma.category.count();
    if (existing > 0) {
      return new Response(
        "La base contient déjà des données. Ajoutez &force=true à l'URL pour tout réinitialiser et recharger les données de démonstration (⚠️ supprime les commandes existantes).",
        { status: 409 }
      );
    }
  }

  await seedDatabase(prisma);

  return new Response(
    "Données de démonstration chargées avec succès. Vous pouvez fermer cette page et retourner sur le site.",
    { status: 200 }
  );
}
