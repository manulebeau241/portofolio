import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { OrderStatusBadge } from "@/components/ui/OrderStatusBadge";
import { formatXaf } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/Button";

export default async function OrdersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion?next=/compte/commandes");

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { relayPoint: true, items: true },
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 md:px-6">
      <h1 className="mb-4 text-xl font-bold text-forest-950">Mes commandes</h1>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <p className="text-sm text-forest-500">Vous n&apos;avez pas encore de commande.</p>
          <ButtonLink href="/catalogue">Découvrir le catalogue</ButtonLink>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {orders.map((order) => (
            <li key={order.id}>
              <Link
                href={`/compte/commandes/${order.id}`}
                className="flex flex-col gap-2 rounded-card bg-white p-4 ring-1 ring-forest-100 hover:ring-forest-300"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-forest-950">{order.orderNumber}</span>
                  <OrderStatusBadge status={order.status} />
                </div>
                <p className="text-xs text-forest-500">
                  {order.items.length} article{order.items.length > 1 ? "s" : ""} · Retrait :{" "}
                  {order.relayPoint.name}
                </p>
                <p className="text-sm font-bold text-forest-900">{formatXaf(order.totalXaf)}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
