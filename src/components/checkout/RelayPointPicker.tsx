"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Clock, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/Button";
import type { RelayPoint } from "@/generated/prisma/client";

export function RelayPointPicker({ relayPoints }: { relayPoints: RelayPoint[] }) {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const relayPointId = useCartStore((s) => s.relayPointId);
  const setRelayPoint = useCartStore((s) => s.setRelayPoint);

  useEffect(() => {
    if (items.length === 0) router.replace("/panier");
  }, [items.length, router]);

  const grouped = relayPoints.reduce<Record<string, RelayPoint[]>>((acc, rp) => {
    (acc[rp.neighborhood] ??= []).push(rp);
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-5">
      {Object.entries(grouped).map(([neighborhood, points]) => (
        <div key={neighborhood}>
          <h2 className="mb-2 text-sm font-semibold text-forest-500">{neighborhood}</h2>
          <div className="flex flex-col gap-2">
            {points.map((rp) => (
              <button
                key={rp.id}
                type="button"
                onClick={() => setRelayPoint(rp.id)}
                className={cn(
                  "flex flex-col gap-1 rounded-card border p-4 text-left transition-colors",
                  relayPointId === rp.id
                    ? "border-forest-700 bg-forest-50"
                    : "border-forest-100 bg-white hover:border-forest-300"
                )}
              >
                <span className="font-semibold text-forest-950">{rp.name}</span>
                <span className="flex items-center gap-1.5 text-xs text-forest-600">
                  <MapPin size={13} /> {rp.address}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-forest-600">
                  <Clock size={13} /> {rp.openingHours}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-forest-600">
                  <Phone size={13} /> {rp.phone}
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}

      <Button
        size="lg"
        disabled={!relayPointId}
        onClick={() => router.push("/commande/paiement")}
      >
        Continuer vers le paiement
      </Button>
    </div>
  );
}
