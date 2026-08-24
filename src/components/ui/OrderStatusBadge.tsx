import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/generated/prisma/enums";

const config: Record<OrderStatus, { label: string; className: string }> = {
  RECEIVED: {
    label: "Commande reçue",
    className: "bg-sand-200 text-forest-800",
  },
  IN_TRANSIT: {
    label: "En cours d'acheminement",
    className: "bg-gold-100 text-gold-800",
  },
  ARRIVED_AT_RELAY: {
    label: "Arrivée au point relais",
    className: "bg-forest-100 text-forest-800",
  },
  PICKED_UP: {
    label: "Retirée",
    className: "bg-forest-700 text-sand-50",
  },
  CANCELLED: {
    label: "Annulée",
    className: "bg-red-100 text-red-700",
  },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { label, className } = config[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        className
      )}
    >
      {label}
    </span>
  );
}

export const ORDER_STATUS_STEPS: OrderStatus[] = [
  "RECEIVED",
  "IN_TRANSIT",
  "ARRIVED_AT_RELAY",
  "PICKED_UP",
];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = Object.fromEntries(
  Object.entries(config).map(([k, v]) => [k, v.label])
) as Record<OrderStatus, string>;
