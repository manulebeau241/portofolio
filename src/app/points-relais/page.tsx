import { MapPin, Clock, Phone } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Points relais — Okoumia" };
export const dynamic = "force-dynamic";

export default async function RelayPointsPage() {
  const relayPoints = await prisma.relayPoint.findMany({
    where: { status: "ACTIVE" },
    orderBy: { neighborhood: "asc" },
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 md:px-6">
      <h1 className="text-xl font-bold text-forest-950">Nos points relais</h1>
      <p className="mt-1 mb-5 text-sm text-forest-500">
        Boutiques partenaires où retirer vos commandes à Libreville.
      </p>

      <div className="flex flex-col gap-3">
        {relayPoints.map((rp) => (
          <div key={rp.id} className="rounded-card bg-white p-4 ring-1 ring-forest-100">
            <p className="text-xs font-semibold uppercase tracking-wide text-gold-700">{rp.neighborhood}</p>
            <p className="font-semibold text-forest-950">{rp.name}</p>
            <div className="mt-2 flex flex-col gap-1 text-sm text-forest-600">
              <span className="flex items-center gap-1.5"><MapPin size={14} /> {rp.address}</span>
              <span className="flex items-center gap-1.5"><Clock size={14} /> {rp.openingHours}</span>
              <span className="flex items-center gap-1.5"><Phone size={14} /> {rp.phone}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
