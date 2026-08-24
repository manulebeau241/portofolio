import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

export type CatalogFilters = {
  categorySlug?: string;
  q?: string;
  sort?: "recent" | "price_asc" | "price_desc";
  minPrice?: number;
  maxPrice?: number;
};

export async function getFilteredProducts(filters: CatalogFilters) {
  const where: Prisma.ProductWhereInput = { status: "ACTIVE" };

  if (filters.categorySlug) {
    where.category = { slug: filters.categorySlug };
  }
  if (filters.q) {
    where.OR = [
      { name: { contains: filters.q, mode: "insensitive" } },
      { description: { contains: filters.q, mode: "insensitive" } },
    ];
  }
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.priceTotalXaf = {
      ...(filters.minPrice !== undefined ? { gte: filters.minPrice } : {}),
      ...(filters.maxPrice !== undefined ? { lte: filters.maxPrice } : {}),
    };
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    filters.sort === "price_asc"
      ? { priceTotalXaf: "asc" }
      : filters.sort === "price_desc"
      ? { priceTotalXaf: "desc" }
      : { createdAt: "desc" };

  return prisma.product.findMany({ where, orderBy });
}
