import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatXaf, cn } from "@/lib/utils";
import { createRelayPoint } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";

export default async function AdminRelayPointsPage() {
  const relayPoints = await prisma.relayPoint.findMany({
    orderBy: { neighborhood: "asc" },
    include: { commissions: true },
  });

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold text-forest-950">Points relais</h1>

      <div className="overflow-x-auto rounded-card bg-white ring-1 ring-forest-100">
        <table className="w-full text-left text-sm">
          <thead className="bg-forest-50 text-xs uppercase text-forest-500">
            <tr>
              <th className="px-4 py-2 font-medium">Boutique</th>
              <th className="px-4 py-2 font-medium">Quartier</th>
              <th className="px-4 py-2 font-medium">Déposés</th>
              <th className="px-4 py-2 font-medium">Retirés</th>
              <th className="px-4 py-2 font-medium">Commissions dues</th>
              <th className="px-4 py-2 font-medium">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-forest-50">
            {relayPoints.map((rp) => {
              const deposited = rp.commissions.filter((c) => c.depositedAt).length;
              const pickedUp = rp.commissions.filter((c) => c.pickedUpAt).length;
              const pendingAmount = rp.commissions
                .filter((c) => c.status === "PENDING")
                .reduce((sum, c) => sum + c.amountXaf, 0);
              return (
                <tr key={rp.id}>
                  <td className="px-4 py-2.5">
                    <Link href={`/admin/points-relais/${rp.id}`} className="font-medium text-forest-800 hover:underline">
                      {rp.name}
                    </Link>
                  </td>
                  <td className="px-4 py-2.5 text-forest-600">{rp.neighborhood}</td>
                  <td className="px-4 py-2.5 text-forest-600">{deposited}</td>
                  <td className="px-4 py-2.5 text-forest-600">{pickedUp}</td>
                  <td className="px-4 py-2.5 font-medium text-forest-900">{formatXaf(pendingAmount)}</td>
                  <td className="px-4 py-2.5">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                        rp.status === "ACTIVE" ? "bg-forest-100 text-forest-800" : "bg-sand-200 text-forest-500"
                      )}
                    >
                      {rp.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <form action={createRelayPoint} className="grid max-w-xl grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-sm font-medium text-forest-800">
          Nom de la boutique
          <input name="name" required className="input" />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-forest-800">
          Quartier
          <input name="neighborhood" required className="input" />
        </label>
        <label className="col-span-2 flex flex-col gap-1 text-sm font-medium text-forest-800">
          Adresse
          <input name="address" required className="input" />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-forest-800">
          Horaires
          <input name="openingHours" placeholder="Lun-Sam 8h-19h" className="input" />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-forest-800">
          Téléphone
          <input name="phone" className="input" />
        </label>
        <Button type="submit" className="col-span-2 self-start">Ajouter le point relais</Button>
      </form>
    </div>
  );
}
