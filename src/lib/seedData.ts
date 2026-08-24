import bcrypt from "bcryptjs";
import type { PrismaClient } from "@/generated/prisma/client";

const img = (seed: string) => `/images/${seed}.svg`;

type ProductSeed = {
  name: string;
  slug: string;
  description: string;
  priceTotalXaf: number;
  availabilityDaysMin: number;
  availabilityDaysMax: number;
};

const PRODUCTS_BY_CATEGORY: Record<string, ProductSeed[]> = {
  electromenager: [
    {
      name: "Réfrigérateur combiné 350L",
      slug: "refrigerateur-combine-350l",
      description: "Réfrigérateur-congélateur combiné, classe énergétique A+, dégivrage automatique.",
      priceTotalXaf: 285000,
      availabilityDaysMin: 20,
      availabilityDaysMax: 30,
    },
    {
      name: "Machine à laver automatique 7kg",
      slug: "machine-a-laver-automatique-7kg",
      description: "Lave-linge à chargement frontal, 7kg, plusieurs programmes de lavage.",
      priceTotalXaf: 245000,
      availabilityDaysMin: 20,
      availabilityDaysMax: 28,
    },
    {
      name: "Climatiseur split 12000 BTU",
      slug: "climatiseur-split-12000-btu",
      description: "Climatiseur split inverter, installation murale, télécommande incluse.",
      priceTotalXaf: 320000,
      availabilityDaysMin: 25,
      availabilityDaysMax: 35,
    },
    {
      name: "Four micro-ondes 25L",
      slug: "four-micro-ondes-25l",
      description: "Micro-ondes avec fonction grill, 25 litres, panneau de commande digital.",
      priceTotalXaf: 65000,
      availabilityDaysMin: 12,
      availabilityDaysMax: 18,
    },
    {
      name: "Bouilloire électrique inox",
      slug: "bouilloire-electrique-inox",
      description: "Bouilloire électrique 1,7L en inox, arrêt automatique, chauffe rapide.",
      priceTotalXaf: 18000,
      availabilityDaysMin: 8,
      availabilityDaysMax: 14,
    },
    {
      name: "Aspirateur sans fil",
      slug: "aspirateur-sans-fil",
      description: "Aspirateur balai sans fil, batterie longue durée, filtration multicouche.",
      priceTotalXaf: 75000,
      availabilityDaysMin: 14,
      availabilityDaysMax: 20,
    },
    {
      name: "Ventilateur sur pied",
      slug: "ventilateur-sur-pied",
      description: "Ventilateur sur pied oscillant, 3 vitesses, hauteur réglable.",
      priceTotalXaf: 28000,
      availabilityDaysMin: 10,
      availabilityDaysMax: 16,
    },
    {
      name: "Cuisinière à gaz 4 feux",
      slug: "cuisiniere-a-gaz-4-feux",
      description: "Cuisinière 4 feux gaz avec four intégré, allumage électronique.",
      priceTotalXaf: 135000,
      availabilityDaysMin: 18,
      availabilityDaysMax: 25,
    },
  ],
  tech: [
    {
      name: "Smartphone Android 128GB",
      slug: "smartphone-android-128gb",
      description: "Smartphone Android, 128GB de stockage, double SIM, appareil photo double capteur.",
      priceTotalXaf: 145000,
      availabilityDaysMin: 15,
      availabilityDaysMax: 22,
    },
    {
      name: "Ordinateur portable 15\" 8GB RAM",
      slug: "ordinateur-portable-15-8gb-ram",
      description: "Ordinateur portable 15,6 pouces, 8GB RAM, 256GB SSD, idéal bureautique.",
      priceTotalXaf: 385000,
      availabilityDaysMin: 20,
      availabilityDaysMax: 28,
    },
    {
      name: "Tablette tactile 10 pouces",
      slug: "tablette-tactile-10-pouces",
      description: "Tablette 10 pouces, Wi-Fi, 64GB de stockage, autonomie une journée.",
      priceTotalXaf: 95000,
      availabilityDaysMin: 14,
      availabilityDaysMax: 20,
    },
    {
      name: "Montre connectée sport",
      slug: "montre-connectee-sport",
      description: "Montre connectée avec suivi d'activité, notifications et autonomie de 7 jours.",
      priceTotalXaf: 35000,
      availabilityDaysMin: 14,
      availabilityDaysMax: 21,
    },
    {
      name: "Écouteurs sans fil",
      slug: "ecouteurs-sans-fil",
      description: "Écouteurs Bluetooth avec boîtier de charge, autonomie totale 20h.",
      priceTotalXaf: 22000,
      availabilityDaysMin: 10,
      availabilityDaysMax: 16,
    },
    {
      name: "Enceinte Bluetooth portable",
      slug: "enceinte-bluetooth-portable",
      description: "Enceinte portable étanche, autonomie 12h, son puissant pour usage extérieur.",
      priceTotalXaf: 32000,
      availabilityDaysMin: 12,
      availabilityDaysMax: 18,
    },
    {
      name: "Power bank 20000mAh",
      slug: "power-bank-20000mah",
      description: "Batterie externe 20000mAh, charge rapide, deux ports USB.",
      priceTotalXaf: 15000,
      availabilityDaysMin: 8,
      availabilityDaysMax: 14,
    },
    {
      name: "Clé USB 64GB",
      slug: "cle-usb-64gb",
      description: "Clé USB 3.0, 64GB, compacte et rapide.",
      priceTotalXaf: 8000,
      availabilityDaysMin: 8,
      availabilityDaysMax: 12,
    },
    {
      name: "Casque audio à réduction de bruit",
      slug: "casque-audio-reduction-de-bruit",
      description: "Casque circum-aural avec réduction de bruit active, confort longue durée.",
      priceTotalXaf: 58000,
      availabilityDaysMin: 14,
      availabilityDaysMax: 20,
    },
  ],
  accessoires: [
    {
      name: "Lunettes de soleil polarisées",
      slug: "lunettes-de-soleil-polarisees",
      description: "Protection UV400, monture légère, adaptées à toutes les morphologies de visage.",
      priceTotalXaf: 15000,
      availabilityDaysMin: 8,
      availabilityDaysMax: 14,
    },
    {
      name: "Ceinture cuir véritable",
      slug: "ceinture-cuir-veritable",
      description: "Ceinture en cuir véritable, boucle métal robuste, plusieurs tailles disponibles.",
      priceTotalXaf: 18000,
      availabilityDaysMin: 10,
      availabilityDaysMax: 15,
    },
    {
      name: "Sac à main similicuir",
      slug: "sac-a-main-similicuir",
      description: "Sac à main élégant, compartiment principal spacieux et poche zippée intérieure.",
      priceTotalXaf: 28500,
      availabilityDaysMin: 10,
      availabilityDaysMax: 15,
    },
    {
      name: "Portefeuille cuir homme",
      slug: "portefeuille-cuir-homme",
      description: "Portefeuille en cuir, plusieurs compartiments cartes, format compact.",
      priceTotalXaf: 16000,
      availabilityDaysMin: 8,
      availabilityDaysMax: 14,
    },
    {
      name: "Casquette ajustable",
      slug: "casquette-ajustable",
      description: "Casquette unisexe, taille ajustable, plusieurs coloris disponibles.",
      priceTotalXaf: 9000,
      availabilityDaysMin: 8,
      availabilityDaysMax: 12,
    },
    {
      name: "Parapluie automatique",
      slug: "parapluie-automatique",
      description: "Parapluie ouverture/fermeture automatique, résistant au vent.",
      priceTotalXaf: 12000,
      availabilityDaysMin: 8,
      availabilityDaysMax: 14,
    },
    {
      name: "Valise cabine rigide",
      slug: "valise-cabine-rigide",
      description: "Valise cabine coque rigide, roues 360°, serrure à combinaison intégrée.",
      priceTotalXaf: 55000,
      availabilityDaysMin: 15,
      availabilityDaysMax: 22,
    },
  ],
  meubles: [
    {
      name: "Chaise de bureau ergonomique",
      slug: "chaise-de-bureau-ergonomique",
      description: "Chaise de bureau avec support lombaire, accoudoirs réglables, roulettes.",
      priceTotalXaf: 68000,
      availabilityDaysMin: 18,
      availabilityDaysMax: 25,
    },
    {
      name: "Table basse en bois",
      slug: "table-basse-en-bois",
      description: "Table basse en bois massif, design épuré, plateau et étagère basse.",
      priceTotalXaf: 52000,
      availabilityDaysMin: 18,
      availabilityDaysMax: 26,
    },
    {
      name: "Étagère murale 5 niveaux",
      slug: "etagere-murale-5-niveaux",
      description: "Étagère murale 5 niveaux, montage simple, idéale salon ou bureau.",
      priceTotalXaf: 32000,
      availabilityDaysMin: 14,
      availabilityDaysMax: 20,
    },
    {
      name: "Canapé 3 places",
      slug: "canape-3-places",
      description: "Canapé 3 places, assise confortable, tissu résistant.",
      priceTotalXaf: 245000,
      availabilityDaysMin: 25,
      availabilityDaysMax: 35,
    },
    {
      name: "Lit double avec sommier",
      slug: "lit-double-avec-sommier",
      description: "Lit double 140x190, cadre bois, sommier à lattes inclus.",
      priceTotalXaf: 185000,
      availabilityDaysMin: 22,
      availabilityDaysMax: 30,
    },
    {
      name: "Armoire 2 portes",
      slug: "armoire-2-portes",
      description: "Armoire 2 portes avec penderie et étagères, montage inclus dans la notice.",
      priceTotalXaf: 145000,
      availabilityDaysMin: 20,
      availabilityDaysMax: 28,
    },
    {
      name: "Bureau d'ordinateur compact",
      slug: "bureau-ordinateur-compact",
      description: "Bureau compact avec tiroir et support clavier coulissant.",
      priceTotalXaf: 62000,
      availabilityDaysMin: 16,
      availabilityDaysMax: 22,
    },
  ],
};

const CATEGORIES = [
  { slug: "electromenager", name: "Électroménager" },
  { slug: "tech", name: "Tech" },
  { slug: "accessoires", name: "Accessoires" },
  { slug: "meubles", name: "Meubles" },
];

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

  const categoriesBySlug: Record<string, { id: string }> = {};
  for (const c of CATEGORIES) {
    categoriesBySlug[c.slug] = await prisma.category.create({
      data: { name: c.name, slug: c.slug, imageUrl: img(c.slug) },
    });
  }

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

  const createdProducts: { id: string; name: string; priceTotalXaf: number }[] = [];
  for (const [categorySlug, products] of Object.entries(PRODUCTS_BY_CATEGORY)) {
    for (const p of products) {
      const product = await prisma.product.create({
        data: {
          name: p.name,
          slug: p.slug,
          description: p.description,
          images: [img(categorySlug)],
          priceTotalXaf: p.priceTotalXaf,
          availabilityDaysMin: p.availabilityDaysMin,
          availabilityDaysMax: p.availabilityDaysMax,
          categoryId: categoriesBySlug[categorySlug].id,
        },
      });
      createdProducts.push(product);
    }
  }

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

  const demoProduct = createdProducts.find((p) => p.name === "Smartphone Android 128GB")!;
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
