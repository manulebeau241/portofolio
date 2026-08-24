import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { LogoutButton } from "@/components/auth/LogoutButton";

const links = [
  { href: "/admin", label: "Tableau de bord" },
  { href: "/admin/commandes", label: "Commandes" },
  { href: "/admin/produits", label: "Produits" },
  { href: "/admin/categories", label: "Catégories" },
  { href: "/admin/points-relais", label: "Points relais" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion?next=/admin");
  if (user.role !== "ADMIN") redirect("/compte");

  return (
    <div className="min-h-screen bg-sand-50">
      <div className="border-b border-forest-100 bg-forest-950 text-sand-50">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3 md:px-6">
          <Link href="/admin" className="text-lg font-extrabold">
            Okoumia <span className="font-normal text-gold-300">admin</span>
          </Link>
          <nav className="scroll-rail flex flex-1 gap-4 overflow-x-auto text-sm font-medium">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="shrink-0 hover:text-gold-300">
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="hidden md:block">
            <LogoutButton className="border-forest-600 text-sand-50 hover:bg-forest-900" size="sm" />
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">{children}</div>
    </div>
  );
}
