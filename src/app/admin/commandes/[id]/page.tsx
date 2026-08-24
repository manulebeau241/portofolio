import { notFound } from "next/navigation";
import { formatXaf } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { OrderStatusBadge, ORDER_STATUS_LABELS } from "@/components/ui/OrderStatusBadge";
import { updateOrderStatus } from "@/app/admin/actions";
import { nextOrderStatus } from "@/lib/orderStatus";
import { Button } from "@/components/ui/Button";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { relayPoint: true, items: true, user: true, statusHistory: { orderBy: { changedAt: "asc" } } },
  });

  if (!order) notFound();

  const upcoming = nextOrderStatus(order.status);
  const updateStatusWithId = updateOrderStatus.bind(null, order.id);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-forest-950">{order.orderNumber}</h1>
          <p className="text-sm text-forest-500">{order.user.fullName} — {order.user.phone}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-card bg-white p-4 ring-1 ring-forest-100">
          <h2 className="mb-2 text-sm font-semibold text-forest-950">Articles</h2>
          <ul className="flex flex-col gap-1.5 text-sm">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between text-forest-700">
                <span>{item.quantity} × {item.productNameSnapshot}</span>
                <span className="font-medium text-forest-950">{formatXaf(item.subtotalXaf)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex justify-between border-t border-forest-100 pt-2 text-sm font-bold text-forest-950">
            <span>Total</span>
            <span>{formatXaf(order.totalXaf)}</span>
          </div>
        </div>

        <div className="rounded-card bg-white p-4 ring-1 ring-forest-100">
          <h2 className="mb-2 text-sm font-semibold text-forest-950">Retrait & paiement</h2>
          <p className="text-sm text-forest-700">{order.relayPoint.name}</p>
          <p className="text-xs text-forest-500">{order.relayPoint.address}</p>
          <p className="mt-2 text-sm text-forest-700">
            Paiement : {order.paymentMethod.replace("_", " ")} — {order.paymentStatus}
          </p>
          <p className="text-sm text-forest-700">
            Code de retrait : <span className="font-semibold">{order.pickupCode}</span>
          </p>
        </div>
      </div>

      <div className="rounded-card bg-white p-4 ring-1 ring-forest-100">
        <h2 className="mb-3 text-sm font-semibold text-forest-950">Statut de la commande</h2>
        <ol className="mb-4 flex flex-col gap-1 text-sm text-forest-600">
          {order.statusHistory.map((h) => (
            <li key={h.id}>
              {new Date(h.changedAt).toLocaleString("fr-FR")} — {ORDER_STATUS_LABELS[h.status]}
            </li>
          ))}
        </ol>
        {upcoming && order.status !== "CANCELLED" ? (
          <form action={updateStatusWithId} className="flex items-center gap-3">
            <input type="hidden" name="status" value={upcoming} />
            <Button type="submit">
              Passer à « {ORDER_STATUS_LABELS[upcoming]} »
            </Button>
          </form>
        ) : (
          <p className="text-sm text-forest-500">Aucune action supplémentaire.</p>
        )}
      </div>
    </div>
  );
}
