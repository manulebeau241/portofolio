"use client";

import { useState, type FormEvent } from "react";
import { MapPin, Clock, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { OrderStatusBadge } from "@/components/ui/OrderStatusBadge";
import { OrderTimeline } from "@/components/order/OrderTimeline";
import { formatXaf } from "@/lib/utils";
import type { OrderStatus } from "@/generated/prisma/enums";

type TrackResult = {
  orderNumber: string;
  status: OrderStatus;
  pickupCode: string;
  totalXaf: number;
  estimatedArrivalDate: string | null;
  relayPoint: { name: string; address: string; neighborhood: string; openingHours: string };
  items: { name: string; quantity: number }[];
};

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [code, setCode] = useState("");
  const [result, setResult] = useState<TrackResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const params = new URLSearchParams({ orderNumber, code });
    const res = await fetch(`/api/track?${params.toString()}`);
    const data = await res.json();

    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Une erreur est survenue.");
      return;
    }
    setResult(data);
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8 md:px-6">
      <h1 className="text-xl font-bold text-forest-950">Suivre ma commande</h1>
      <p className="mt-1 text-sm text-forest-500">
        Entrez votre numéro de commande et votre code de retrait (reçus après paiement) pour voir où en est votre colis — sans avoir besoin de vous connecter.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
        <input
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          placeholder="Numéro de commande (ex. OKM-XXXXXX)"
          required
          className="input"
        />
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Code de retrait (ex. OKM-XXXX)"
          required
          className="input"
        />
        <Button type="submit" disabled={loading} className="gap-2">
          <Search size={16} />
          {loading ? "Recherche…" : "Suivre ma commande"}
        </Button>
      </form>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {result && (
        <div className="mt-6 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-forest-950">{result.orderNumber}</span>
            <OrderStatusBadge status={result.status} />
          </div>

          <OrderTimeline status={result.status} />

          {result.status !== "PICKED_UP" && (
            <div className="rounded-card border-2 border-dashed border-gold-400 bg-gold-50 p-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-gold-700">Code de retrait</p>
              <p className="mt-1 text-2xl font-extrabold tracking-widest text-forest-950">{result.pickupCode}</p>
            </div>
          )}

          <div className="flex flex-col gap-3 rounded-card bg-white p-4 ring-1 ring-forest-100">
            <div>
              <p className="text-sm font-semibold text-forest-950">Retrait chez</p>
              <p className="flex items-center gap-1.5 text-sm text-forest-700">
                <MapPin size={14} /> {result.relayPoint.name} — {result.relayPoint.address}
              </p>
              <p className="flex items-center gap-1.5 text-xs text-forest-500">
                <Clock size={14} /> {result.relayPoint.openingHours}
              </p>
            </div>
            <ul className="flex flex-col gap-1.5 border-t border-forest-100 pt-3 text-sm">
              {result.items.map((item, i) => (
                <li key={i} className="text-forest-700">
                  {item.quantity} × {item.name}
                </li>
              ))}
            </ul>
            <div className="flex justify-between border-t border-forest-100 pt-3 text-sm font-bold text-forest-950">
              <span>Total payé</span>
              <span>{formatXaf(result.totalXaf)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
