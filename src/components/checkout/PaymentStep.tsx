"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Smartphone, CreditCard } from "lucide-react";
import { cn, formatXaf } from "@/lib/utils";
import { useCartStore, cartTotal } from "@/store/cart";
import { Button } from "@/components/ui/Button";
import type { RelayPoint } from "@/generated/prisma/client";

const methods = [
  { value: "AIRTEL_MONEY" as const, label: "Airtel Money", icon: Smartphone },
  { value: "MOOV_MONEY" as const, label: "Moov Money", icon: Smartphone },
  { value: "CARD" as const, label: "Carte bancaire", icon: CreditCard },
];

export function PaymentStep({ relayPoints }: { relayPoints: RelayPoint[] }) {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const relayPointId = useCartStore((s) => s.relayPointId);
  const clear = useCartStore((s) => s.clear);
  const [method, setMethod] = useState<(typeof methods)[number]["value"]>("AIRTEL_MONEY");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const relayPoint = useMemo(
    () => relayPoints.find((rp) => rp.id === relayPointId),
    [relayPoints, relayPointId]
  );
  const total = cartTotal(items);

  useEffect(() => {
    if (items.length === 0) router.replace("/panier");
    else if (!relayPointId) router.replace("/commande/point-relais");
  }, [items.length, relayPointId, router]);

  async function handlePay() {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        relayPointId,
        paymentMethod: method,
      }),
    });

    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Le paiement a échoué, réessayez.");
      return;
    }

    const order = await res.json();
    clear();
    router.push(`/commande/confirmation/${order.id}`);
  }

  if (!relayPoint) return null;

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-card bg-forest-50 p-4 text-sm">
        <p className="font-semibold text-forest-950">Retrait chez :</p>
        <p className="text-forest-700">{relayPoint.name} — {relayPoint.neighborhood}</p>
      </div>

      <div>
        <h2 className="mb-2 text-sm font-semibold text-forest-950">Mode de paiement</h2>
        <div className="flex flex-col gap-2">
          {methods.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setMethod(value)}
              className={cn(
                "flex items-center gap-3 rounded-card border p-4 text-left transition-colors",
                method === value
                  ? "border-forest-700 bg-forest-50"
                  : "border-forest-100 bg-white hover:border-forest-300"
              )}
            >
              <Icon size={20} className="text-forest-700" />
              <span className="font-medium text-forest-900">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-forest-100 pt-4">
        <span className="text-sm text-forest-600">Total à payer</span>
        <span className="text-lg font-extrabold text-forest-950">{formatXaf(total)}</span>
      </div>

      <p className="text-xs text-forest-500">
        Paiement simulé pour la démonstration : aucun débit réel n&apos;est
        effectué. En production, ce bouton déclenchera une demande de
        paiement {method === "CARD" ? "carte" : "Mobile Money"} auprès du
        prestataire choisi.
      </p>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button size="lg" disabled={loading} onClick={handlePay}>
        {loading ? "Paiement en cours…" : `Payer ${formatXaf(total)}`}
      </Button>
    </div>
  );
}
