import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderNumber = searchParams.get("orderNumber")?.trim().toUpperCase();
  const code = searchParams.get("code")?.trim().toUpperCase();

  if (!orderNumber || !code) {
    return Response.json({ error: "Numéro de commande et code requis." }, { status: 400 });
  }

  const order = await prisma.order.findFirst({
    where: { orderNumber, pickupCode: code },
    include: { relayPoint: true, items: true },
  });

  if (!order) {
    return Response.json(
      { error: "Aucune commande ne correspond à ce numéro et ce code." },
      { status: 404 }
    );
  }

  return Response.json({
    orderNumber: order.orderNumber,
    status: order.status,
    pickupCode: order.pickupCode,
    totalXaf: order.totalXaf,
    estimatedArrivalDate: order.estimatedArrivalDate,
    relayPoint: {
      name: order.relayPoint.name,
      address: order.relayPoint.address,
      neighborhood: order.relayPoint.neighborhood,
      openingHours: order.relayPoint.openingHours,
    },
    items: order.items.map((item) => ({
      name: item.productNameSnapshot,
      quantity: item.quantity,
    })),
  });
}
