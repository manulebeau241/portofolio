import bcrypt from "bcryptjs";
import type { PrismaClient } from "@/generated/prisma/client";

const img = (seed: string) => `/images/${seed}.svg`;

export async function seedDatabase(prisma: PrismaClient) {
  await prisma.relayCommission.deleteMany();
  await prisma.orderStatusHistory.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.relayPoint.deleteMany();
  await prisma.user.deleteMany();

  const [mode, accessoires, electronique, cosmetique] = await Promise.all([
    prisma.category.create({
      data: { name: "Mode & Vêtements", slug: "mode-vetements", imageUrl: img("mode") },
    }),
    prisma.category.create({
      data: { name: "Accessoires", slug: "accessoires", imageUrl: img("accessoires") },
    }),
    prisma.category.create({
      data: { name: "Petit électronique", slug: "electronique", imageUrl: img("electronique") },
    }),
    prisma.category.create({
      data: { name: "Cosmétique & Beauté", slug: "cosmetique", imageUrl: img("cosmetique") },
    }),
  ]);

  const relayPoints = await Promise.all([
    prisma.relayPoint.create({
      data: {
        name: "Boutique Chic Glass",
        neighborhood: "Glass",
        address: "Face pharmacie de Glass, Libreville",
        openingHours: "Lun-Sam 8h-19h",
        phone: "+241 74 12 34 56",
        lat: 0.4283,
        lng: 9.4436,
      },
    }),
    prisma.relayPoint.create({
      data: {
        name: "Point Relais Nombakélé",
        neighborhood: "Nombakélé",
        address: "Carrefour Nombakélé, non loin du marché",
        openingHours: "Lun-Dim 8h-20h",
        phone: "+241 65 22 33 44",
        lat: 0.3925,
        lng: 9.4531,
      },
    }),
    prisma.relayPoint.create({
      data: {
        name: "Alpha Shop Akanda",
        neighborhood: "Akanda",
        address: "Route d'Akanda, près du carrefour PK12",
        openingHours: "Lun-Sam 9h-18h30",
        phone: "+241 77 55 66 77",
        lat: 0.5311,
        lng: 9.4128,
      },
    }),
    prisma.relayPoint.create({
      data: {
        name: "Boutique Nzeng-Ayong Centre",
        neighborhood: "Nzeng-Ayong",
        address: "Marché Nzeng-Ayong, stand 14",
        openingHours: "Lun-Dim 7h30-19h30",
        phone: "+241 66 88 99 00",
        lat: 0.4192,
        lng: 9.4974,
      },
    }),
  ]);

  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: "Sneakers urbaines unisexe",
        slug: "sneakers-urbaines-unisexe",
        description:
          "Sneakers légères et confortables, parfaites pour un usage quotidien. Import direct, taille européenne standard.",
        images: [img("sneakers1"), img("sneakers2")],
        priceTotalXaf: 42000,
        availabilityDaysMin: 12,
        availabilityDaysMax: 18,
        categoryId: mode.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Sac à main similicuir",
        slug: "sac-a-main-similicuir",
        description: "Sac à main élégant, compartiment principal spacieux et poche zippée intérieure.",
        images: [img("sac1"), img("sac2")],
        priceTotalXaf: 28500,
        availabilityDaysMin: 10,
        availabilityDaysMax: 15,
        categoryId: mode.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Montre connectée sport",
        slug: "montre-connectee-sport",
        description: "Montre connectée avec suivi d'activité, notifications et autonomie de 7 jours.",
        images: [img("montre1"), img("montre2")],
        priceTotalXaf: 35000,
        availabilityDaysMin: 14,
        availabilityDaysMax: 21,
        categoryId: electronique.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Écouteurs sans fil",
        slug: "ecouteurs-sans-fil",
        description: "Écouteurs Bluetooth avec boîtier de charge, autonomie totale 20h.",
        images: [img("ecouteurs1"), img("ecouteurs2")],
        priceTotalXaf: 22000,
        availabilityDaysMin: 10,
        availabilityDaysMax: 16,
        categoryId: electronique.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Lunettes de soleil polarisées",
        slug: "lunettes-de-soleil-polarisees",
        description: "Protection UV400, monture légère, adaptées à toutes les morphologies de visage.",
        images: [img("lunettes1"), img("lunettes2")],
        priceTotalXaf: 15000,
        availabilityDaysMin: 8,
        availabilityDaysMax: 14,
        categoryId: accessoires.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Ceinture cuir véritable",
        slug: "ceinture-cuir-veritable",
        description: "Ceinture en cuir véritable, boucle métal robuste, plusieurs tailles disponibles.",
        images: [img("ceinture1"), img("ceinture2")],
        priceTotalXaf: 18000,
        availabilityDaysMin: 10,
        availabilityDaysMax: 15,
        categoryId: accessoires.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Coffret soins visage hydratants",
        slug: "coffret-soins-visage-hydratants",
        description: "Coffret complet : nettoyant, sérum et crème hydratante pour tous types de peau.",
        images: [img("cosmetique1"), img("cosmetique2")],
        priceTotalXaf: 26000,
        availabilityDaysMin: 10,
        availabilityDaysMax: 18,
        categoryId: cosmetique.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Lisseur cheveux professionnel",
        slug: "lisseur-cheveux-professionnel",
        description: "Plaques céramique, chauffe rapide, idéal pour tous types de cheveux.",
        images: [img("lisseur1"), img("lisseur2")],
        priceTotalXaf: 32000,
        availabilityDaysMin: 12,
        availabilityDaysMax: 20,
        categoryId: cosmetique.id,
      },
    }),
  ]);

  const passwordHash = await bcrypt.hash("demo1234", 10);
  const user = await prisma.user.create({
    data: {
      phone: "+24177000000",
      email: "demo@okoumia.ga",
      passwordHash,
      fullName: "Client Démo",
      favoriteRelayPointId: relayPoints[0].id,
    },
  });

  await prisma.user.create({
    data: {
      phone: "+24177000001",
      email: "admin@okoumia.ga",
      passwordHash: await bcrypt.hash("admin1234", 10),
      fullName: "Admin Okoumia",
      role: "ADMIN",
    },
  });

  const demoProduct = products[0];
  const order = await prisma.order.create({
    data: {
      orderNumber: "OKM-00001",
      userId: user.id,
      relayPointId: relayPoints[0].id,
      status: "IN_TRANSIT",
      subtotalXaf: demoProduct.priceTotalXaf,
      totalXaf: demoProduct.priceTotalXaf,
      paymentMethod: "AIRTEL_MONEY",
      paymentStatus: "PAID",
      pickupCode: "OKM-4F82",
      items: {
        create: {
          productId: demoProduct.id,
          productNameSnapshot: demoProduct.name,
          unitPriceXafSnapshot: demoProduct.priceTotalXaf,
          quantity: 1,
          subtotalXaf: demoProduct.priceTotalXaf,
        },
      },
      payments: {
        create: {
          provider: "AIRTEL_MONEY",
          amountXaf: demoProduct.priceTotalXaf,
          status: "PAID",
          providerTransactionId: "SIMULATED-TXN-0001",
        },
      },
      statusHistory: {
        create: [{ status: "RECEIVED" }, { status: "IN_TRANSIT" }],
      },
    },
  });

  await prisma.relayCommission.create({
    data: {
      relayPointId: relayPoints[0].id,
      orderId: order.id,
      amountXaf: 1500,
    },
  });
}
