import type { OrderStatus } from "@/generated/prisma/enums";

const NEXT_STATUS: Record<OrderStatus, OrderStatus | null> = {
  RECEIVED: "IN_TRANSIT",
  IN_TRANSIT: "ARRIVED_AT_RELAY",
  ARRIVED_AT_RELAY: "PICKED_UP",
  PICKED_UP: null,
  CANCELLED: null,
};

export function nextOrderStatus(status: OrderStatus) {
  return NEXT_STATUS[status];
}
