import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronRight, MapPin, Package } from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { LogoutButton } from "@/components/auth/LogoutButton";

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion?next=/compte");

  const favoriteRelayPoint = user.favoriteRelayPointId
    ? await prisma.relayPoint.findUnique({ where: { id: user.favoriteRelayPointId } })
    : null;

  return (
    <div className="mx-auto max-w-xl px-4 py-6 md:px-6">
      <h1 className="text-xl font-bold text-forest-950">Mon compte</h1>
      <div className="mt-3 rounded-card bg-white p-4 ring-1 ring-forest-100">
        <p className="font-semibold text-forest-950">{user.fullName}</p>
        <p className="text-sm text-forest-500">{user.phone}</p>
      </div>

      <div className="mt-4 flex flex-col divide-y divide-forest-100 overflow-hidden rounded-card bg-white ring-1 ring-forest-100">
        <Link href="/compte/commandes" className="flex items-center gap-3 p-4 hover:bg-forest-50">
          <Package size={18} className="text-forest-600" />
          <span className="flex-1 text-sm font-medium text-forest-900">Mes commandes</span>
          <ChevronRight size={16} className="text-forest-400" />
        </Link>
        <div className="flex items-center gap-3 p-4">
          <MapPin size={18} className="text-forest-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-forest-900">Point relais favori</p>
            <p className="text-xs text-forest-500">
              {favoriteRelayPoint ? `${favoriteRelayPoint.name} — ${favoriteRelayPoint.neighborhood}` : "Aucun point relais favori"}
            </p>
          </div>
        </div>
      </div>

      {user.role === "ADMIN" && (
        <Link
          href="/admin"
          className="mt-4 block rounded-card bg-forest-950 p-4 text-center text-sm font-semibold text-sand-50"
        >
          Accéder à l&apos;espace admin
        </Link>
      )}

      <div className="mt-6">
        <LogoutButton />
      </div>
    </div>
  );
}
