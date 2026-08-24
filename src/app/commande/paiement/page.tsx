import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { PaymentStep } from "@/components/checkout/PaymentStep";
import { CheckoutSteps } from "@/components/checkout/CheckoutSteps";

export default async function PaymentStepPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion?next=/commande/paiement");

  const relayPoints = await prisma.relayPoint.findMany({ where: { status: "ACTIVE" } });

  return (
    <div className="mx-auto max-w-2xl px-4 py-5 md:px-6">
      <CheckoutSteps current="paiement" />
      <h1 className="mb-5 text-xl font-bold text-forest-950">Paiement</h1>
      <PaymentStep relayPoints={relayPoints} />
    </div>
  );
}
