"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import type { OrderStatus } from "@/generated/prisma/enums";

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createCategory(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  await prisma.category.create({
    data: { name, slug: slugify(name), imageUrl: "/images/mode.svg" },
  });
  revalidatePath("/admin/categories");
}

export async function createProduct(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "");
  const priceTotalXaf = Number(formData.get("priceTotalXaf"));
  const availabilityDaysMin = Number(formData.get("availabilityDaysMin"));
  const availabilityDaysMax = Number(formData.get("availabilityDaysMax"));
  const imagesRaw = String(formData.get("images") ?? "");
  const images = imagesRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (!name || !categoryId || !priceTotalXaf) return;

  const product = await prisma.product.create({
    data: {
      name,
      slug: `${slugify(name)}-${Date.now().toString(36)}`,
      description,
      categoryId,
      priceTotalXaf,
      availabilityDaysMin: availabilityDaysMin || 7,
      availabilityDaysMax: availabilityDaysMax || 14,
      images: images.length ? images : ["/images/mode.svg"],
      status: "ACTIVE",
    },
  });

  revalidatePath("/admin/produits");
  redirect(`/admin/produits/${product.id}/edit`);
}

export async function updateProduct(productId: string, formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "");
  const priceTotalXaf = Number(formData.get("priceTotalXaf"));
  const availabilityDaysMin = Number(formData.get("availabilityDaysMin"));
  const availabilityDaysMax = Number(formData.get("availabilityDaysMax"));
  const status = String(formData.get("status") ?? "ACTIVE") as "ACTIVE" | "DRAFT" | "ARCHIVED";
  const imagesRaw = String(formData.get("images") ?? "");
  const images = imagesRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  await prisma.product.update({
    where: { id: productId },
    data: {
      name,
      description,
      categoryId,
      priceTotalXaf,
      availabilityDaysMin,
      availabilityDaysMax,
      status,
      images: images.length ? images : undefined,
    },
  });

  revalidatePath("/admin/produits");
  revalidatePath(`/admin/produits/${productId}/edit`);
}

export async function deleteProduct(productId: string) {
  await requireAdmin();
  await prisma.product.delete({ where: { id: productId } }).catch(async () => {
    await prisma.product.update({ where: { id: productId }, data: { status: "ARCHIVED" } });
  });
  revalidatePath("/admin/produits");
  redirect("/admin/produits");
}

export async function createRelayPoint(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const neighborhood = String(formData.get("neighborhood") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const openingHours = String(formData.get("openingHours") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  if (!name || !neighborhood || !address) return;

  await prisma.relayPoint.create({
    data: { name, neighborhood, address, openingHours, phone },
  });
  revalidatePath("/admin/points-relais");
}

export async function updateRelayPointStatus(relayPointId: string, formData: FormData) {
  await requireAdmin();
  const status = String(formData.get("status") ?? "ACTIVE") as "ACTIVE" | "INACTIVE";
  await prisma.relayPoint.update({ where: { id: relayPointId }, data: { status } });
  revalidatePath("/admin/points-relais");
  revalidatePath(`/admin/points-relais/${relayPointId}`);
}

export async function updateOrderStatus(orderId: string, formData: FormData) {
  await requireAdmin();
  const status = String(formData.get("status") ?? "") as OrderStatus;
  if (!status) return;

  await prisma.$transaction(async (tx) => {
    await tx.order.update({ where: { id: orderId }, data: { status } });
    await tx.orderStatusHistory.create({ data: { orderId, status } });

    if (status === "ARRIVED_AT_RELAY") {
      await tx.relayCommission.update({
        where: { orderId },
        data: { depositedAt: new Date() },
      });
    }
    if (status === "PICKED_UP") {
      await tx.relayCommission.update({
        where: { orderId },
        data: { pickedUpAt: new Date(), status: "PAID" },
      });
    }
  });

  revalidatePath(`/admin/commandes/${orderId}`);
  revalidatePath("/admin/commandes");
}
