import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { formatXaf } from "@/lib/utils";
import { OrderStatusBadge } from "@/components/ui/OrderStatusBadge";
import { OrderTimeline } from "@/components/order/OrderTimeline";

export default async function OrderDetailPage({
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
    <div className="mx-auto max-w-2xl px-4 py-6 md:px-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-forest-950">{order.orderNumber}</h1>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="mb-6">
        <OrderTimeline status={order.status} />
      </div>

      {order.status !== "PICKED_UP" && (
        <div className="mb-5 rounded-card border-2 border-dashed border-gold-400 bg-gold-50 p-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-gold-700">Code de retrait</p>
          <p className="mt-1 text-2xl font-extrabold tracking-widest text-forest-950">{order.pickupCode}</p>
        </div>
      )}

      <div className="flex flex-col gap-3 rounded-card bg-white p-4 ring-1 ring-forest-100">
        <div>
          <p className="text-sm font-semibold text-forest-950">Retrait chez</p>
          <p className="text-sm text-forest-700">{order.relayPoint.name} — {order.relayPoint.address}</p>
          <p className="text-xs text-forest-500">{order.relayPoint.openingHours}</p>
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
    </div>
  );
}
