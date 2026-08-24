import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatXaf } from "@/lib/utils";
import { OrderStatusBadge } from "@/components/ui/OrderStatusBadge";

export default async function AdminDashboardPage() {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [ordersToday, pendingOrders, revenueAgg, recentOrders, productCount, relayPointCount] =
    await Promise.all([
      prisma.order.count({ where: { createdAt: { gte: startOfDay } } }),
      prisma.order.count({ where: { status: { in: ["RECEIVED", "IN_TRANSIT"] } } }),
      prisma.order.aggregate({ _sum: { totalXaf: true }, where: { paymentStatus: "PAID" } }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 6,
        include: { relayPoint: true, user: true },
      }),
      prisma.product.count({ where: { status: "ACTIVE" } }),
      prisma.relayPoint.count({ where: { status: "ACTIVE" } }),
    ]);

  const stats = [
    { label: "Commandes aujourd'hui", value: ordersToday },
    { label: "À traiter", value: pendingOrders },
    { label: "Chiffre d'affaires payé", value: formatXaf(revenueAgg._sum.totalXaf ?? 0) },
    { label: "Produits actifs", value: productCount },
    { label: "Points relais actifs", value: relayPointCount },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-forest-950">Tableau de bord</h1>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-card bg-white p-4 ring-1 ring-forest-100">
            <p className="text-xs text-forest-500">{s.label}</p>
            <p className="mt-1 text-lg font-bold text-forest-950">{s.value}</p>
          </div>
        ))}
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-forest-950">Dernières commandes</h2>
          <Link href="/admin/commandes" className="text-sm font-medium text-forest-600 hover:text-forest-800">
            Voir tout
          </Link>
        </div>
        <div className="overflow-hidden rounded-card bg-white ring-1 ring-forest-100">
          <table className="w-full text-left text-sm">
            <thead className="bg-forest-50 text-xs uppercase text-forest-500">
              <tr>
                <th className="px-4 py-2 font-medium">Commande</th>
                <th className="px-4 py-2 font-medium">Client</th>
                <th className="px-4 py-2 font-medium">Point relais</th>
                <th className="px-4 py-2 font-medium">Total</th>
                <th className="px-4 py-2 font-medium">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-50">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-forest-50/50">
                  <td className="px-4 py-2.5">
                    <Link href={`/admin/commandes/${order.id}`} className="font-medium text-forest-800 hover:underline">
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-2.5 text-forest-600">{order.user.fullName}</td>
                  <td className="px-4 py-2.5 text-forest-600">{order.relayPoint.name}</td>
                  <td className="px-4 py-2.5 font-medium text-forest-900">{formatXaf(order.totalXaf)}</td>
                  <td className="px-4 py-2.5"><OrderStatusBadge status={order.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
