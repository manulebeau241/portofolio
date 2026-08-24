import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { generateOrderNumber, generatePickupCode, RELAY_COMMISSION_XAF } from "@/lib/orders";

const schema = z.object({
  items: z
    .array(z.object({ productId: z.string(), quantity: z.number().int().min(1) }))
    .min(1),
  relayPointId: z.string(),
  paymentMethod: z.enum(["AIRTEL_MONEY", "MOOV_MONEY", "CARD"]),
});

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Vous devez être connecté" }, { status: 401 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ error: "Panier invalide" }, { status: 400 });
  }
  const { items, relayPointId, paymentMethod } = parsed.data;

  const relayPoint = await prisma.relayPoint.findUnique({ where: { id: relayPointId } });
  if (!relayPoint || relayPoint.status !== "ACTIVE") {
    return Response.json({ error: "Point relais invalide" }, { status: 400 });
  }

  const products = await prisma.product.findMany({
    where: { id: { in: items.map((i) => i.productId) }, status: "ACTIVE" },
  });
  if (products.length !== items.length) {
    return Response.json({ error: "Un ou plusieurs produits ne sont plus disponibles" }, { status: 400 });
  }

  const orderItemsData = items.map((item) => {
    const product = products.find((p) => p.id === item.productId)!;
    return {
      productId: product.id,
      productNameSnapshot: product.name,
      unitPriceXafSnapshot: product.priceTotalXaf,
      quantity: item.quantity,
      subtotalXaf: product.priceTotalXaf * item.quantity,
    };
  });

  const totalXaf = orderItemsData.reduce((sum, i) => sum + i.subtotalXaf, 0);
  const maxAvailabilityDays = Math.max(...products.map((p) => p.availabilityDaysMax));
  const estimatedArrivalDate = new Date(Date.now() + maxAvailabilityDays * 24 * 60 * 60 * 1000);

  const order = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      userId: user.id,
      relayPointId,
      status: "RECEIVED",
      subtotalXaf: totalXaf,
      totalXaf,
      paymentMethod,
      // Paiement simulé pour le MVP : validé immédiatement à la commande.
      paymentStatus: "PAID",
      pickupCode: generatePickupCode(),
      estimatedArrivalDate,
      items: { create: orderItemsData },
      payments: {
        create: {
          provider: paymentMethod,
          amountXaf: totalXaf,
          status: "PAID",
          providerTransactionId: `SIMULATED-${Date.now()}`,
        },
      },
      statusHistory: { create: { status: "RECEIVED" } },
      commission: {
        create: { relayPointId, amountXaf: RELAY_COMMISSION_XAF },
      },
    },
  });

  return Response.json({ id: order.id, orderNumber: order.orderNumber, pickupCode: order.pickupCode });
}
