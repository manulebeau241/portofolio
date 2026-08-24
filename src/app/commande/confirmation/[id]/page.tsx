import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { formatXaf } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/Button";
import { CheckoutSteps } from "@/components/checkout/CheckoutSteps";

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion");

  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { relayPoint: true, items: true },
  });

  if (!order || order.userId !== user.id) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-5 md:px-6">
      <CheckoutSteps current="confirmation" />

      <div className="flex flex-col items-center gap-2 py-4 text-center">
        <CheckCircle2 size={40} className="text-forest-700" />
        <h1 className="text-xl font-bold text-forest-950">Commande confirmée</h1>
        <p className="text-sm text-forest-600">
          N° de commande <span className="font-semibold">{order.orderNumber}</span>
        </p>
      </div>

      <div className="rounded-card border-2 border-dashed border-gold-400 bg-gold-50 p-5 text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-gold-700">
          Code de retrait
        </p>
        <p className="mt-1 text-3xl font-extrabold tracking-widest text-forest-950">
          {order.pickupCode}
        </p>
        <p className="mt-2 text-xs text-forest-600">
          Présentez ce code au point relais lors du retrait. Il vous sera aussi envoyé par SMS.
        </p>
      </div>

      <div className="mt-5 flex flex-col gap-3 rounded-card bg-white p-4 ring-1 ring-forest-100">
        <div>
          <p className="text-sm font-semibold text-forest-950">Retrait chez</p>
          <p className="text-sm text-forest-700">
            {order.relayPoint.name} — {order.relayPoint.address}
          </p>
        </div>
        <ul className="flex flex-col gap-1.5 border-t border-forest-100 pt-3 text-sm">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between text-forest-700">
              <span>{item.quantity} × {item.productNameSnapshot}</span>
              <span className="font-medium text-forest-950">{formatXaf(item.subtotalXaf)}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between border-t border-forest-100 pt-3 text-sm font-bold text-forest-950">
          <span>Total payé</span>
          <span>{formatXaf(order.totalXaf)}</span>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2">
        <ButtonLink href={`/compte/commandes/${order.id}`}>Suivre ma commande</ButtonLink>
        <Link href="/catalogue" className="text-center text-sm font-medium text-forest-600 hover:text-forest-800">
          Continuer mes achats
        </Link>
      </div>
    </div>
  );
}
