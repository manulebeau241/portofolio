import { prisma } from "@/lib/prisma";
import { RelayPointPicker } from "@/components/checkout/RelayPointPicker";
import { CheckoutSteps } from "@/components/checkout/CheckoutSteps";

export const dynamic = "force-dynamic";

export default async function RelayPointStepPage() {
  const relayPoints = await prisma.relayPoint.findMany({
    where: { status: "ACTIVE" },
    orderBy: { neighborhood: "asc" },
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-5 md:px-6">
      <CheckoutSteps current="point-relais" />
      <h1 className="mb-1 text-xl font-bold text-forest-950">Choisir un point relais</h1>
      <p className="mb-5 text-sm text-forest-500">
        Sélectionnez la boutique partenaire où vous récupérerez votre commande.
      </p>
      <RelayPointPicker relayPoints={relayPoints} />
    </div>
  );
}
