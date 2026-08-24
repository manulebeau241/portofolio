import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatXaf } from "@/lib/utils";
import { updateRelayPointStatus } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";

export default async function AdminRelayPointDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const relayPoint = await prisma.relayPoint.findUnique({
    where: { id },
    include: { commissions: { include: { order: true }, orderBy: { id: "desc" } } },
  });

  if (!relayPoint) notFound();

  const updateStatus = updateRelayPointStatus.bind(null, relayPoint.id);
  const totalPaid = relayPoint.commissions.filter((c) => c.status === "PAID").reduce((s, c) => s + c.amountXaf, 0);
  const totalPending = relayPoint.commissions.filter((c) => c.status === "PENDING").reduce((s, c) => s + c.amountXaf, 0);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold text-forest-950">{relayPoint.name}</h1>
        <p className="text-sm text-forest-500">{relayPoint.neighborhood} — {relayPoint.address}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Colis déposés" value={relayPoint.commissions.filter((c) => c.depositedAt).length} />
        <Stat label="Colis retirés" value={relayPoint.commissions.filter((c) => c.pickedUpAt).length} />
        <Stat label="Commissions payées" value={formatXaf(totalPaid)} />
        <Stat label="Commissions en attente" value={formatXaf(totalPending)} />
      </div>

      <form action={updateStatus} className="flex items-center gap-2">
        <select name="status" defaultValue={relayPoint.status} className="input w-40">
          <option value="ACTIVE">Actif</option>
          <option value="INACTIVE">Inactif</option>
        </select>
        <Button type="submit" size="sm">Mettre à jour</Button>
      </form>

      <div className="overflow-x-auto rounded-card bg-white ring-1 ring-forest-100">
        <table className="w-full text-left text-sm">
          <thead className="bg-forest-50 text-xs uppercase text-forest-500">
            <tr>
              <th className="px-4 py-2 font-medium">Commande</th>
              <th className="px-4 py-2 font-medium">Déposé</th>
              <th className="px-4 py-2 font-medium">Retiré</th>
              <th className="px-4 py-2 font-medium">Commission</th>
              <th className="px-4 py-2 font-medium">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-forest-50">
            {relayPoint.commissions.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-2.5 font-medium text-forest-900">{c.order.orderNumber}</td>
                <td className="px-4 py-2.5 text-forest-600">
                  {c.depositedAt ? new Date(c.depositedAt).toLocaleDateString("fr-FR") : "—"}
                </td>
                <td className="px-4 py-2.5 text-forest-600">
                  {c.pickedUpAt ? new Date(c.pickedUpAt).toLocaleDateString("fr-FR") : "—"}
                </td>
                <td className="px-4 py-2.5 font-medium text-forest-900">{formatXaf(c.amountXaf)}</td>
                <td className="px-4 py-2.5 text-forest-600">{c.status}</td>
              </tr>
            ))}
            {relayPoint.commissions.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-forest-400">
                  Aucune commande pour ce point relais.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-card bg-white p-4 ring-1 ring-forest-100">
      <p className="text-xs text-forest-500">{label}</p>
      <p className="mt-1 text-lg font-bold text-forest-950">{value}</p>
    </div>
  );
}
