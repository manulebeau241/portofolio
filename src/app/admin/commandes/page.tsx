import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatXaf } from "@/lib/utils";
import { OrderStatusBadge } from "@/components/ui/OrderStatusBadge";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/generated/prisma/enums";

const statusFilters: { value: OrderStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "Tous" },
  { value: "RECEIVED", label: "Reçues" },
  { value: "IN_TRANSIT", label: "En acheminement" },
  { value: "ARRIVED_AT_RELAY", label: "Arrivées" },
  { value: "PICKED_UP", label: "Retirées" },
  { value: "CANCELLED", label: "Annulées" },
];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeStatus = (status as OrderStatus | undefined) ?? undefined;

  const orders = await prisma.order.findMany({
    where: activeStatus ? { status: activeStatus } : undefined,
    orderBy: { createdAt: "desc" },
    include: { relayPoint: true, user: true },
  });

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold text-forest-950">Commandes</h1>

      <div className="flex flex-wrap gap-2">
        {statusFilters.map((f) => (
          <Link
            key={f.value}
            href={f.value === "ALL" ? "/admin/commandes" : `/admin/commandes?status=${f.value}`}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm font-medium",
              (f.value === "ALL" && !activeStatus) || f.value === activeStatus
                ? "border-forest-800 bg-forest-800 text-sand-50"
                : "border-forest-200 text-forest-700 hover:bg-forest-50"
            )}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <div className="overflow-x-auto rounded-card bg-white ring-1 ring-forest-100">
        <table className="w-full text-left text-sm">
          <thead className="bg-forest-50 text-xs uppercase text-forest-500">
            <tr>
              <th className="px-4 py-2 font-medium">Commande</th>
              <th className="px-4 py-2 font-medium">Client</th>
              <th className="px-4 py-2 font-medium">Point relais</th>
              <th className="px-4 py-2 font-medium">Total</th>
              <th className="px-4 py-2 font-medium">Paiement</th>
              <th className="px-4 py-2 font-medium">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-forest-50">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-forest-50/50">
                <td className="px-4 py-2.5">
                  <Link href={`/admin/commandes/${order.id}`} className="font-medium text-forest-800 hover:underline">
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="px-4 py-2.5 text-forest-600">{order.user.fullName}</td>
                <td className="px-4 py-2.5 text-forest-600">{order.relayPoint.name}</td>
                <td className="px-4 py-2.5 font-medium text-forest-900">{formatXaf(order.totalXaf)}</td>
                <td className="px-4 py-2.5 text-forest-600">{order.paymentStatus}</td>
                <td className="px-4 py-2.5"><OrderStatusBadge status={order.status} /></td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-forest-400">
                  Aucune commande.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
