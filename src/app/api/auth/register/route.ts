import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";
import { normalizeGabonPhone } from "@/lib/phone";

const schema = z.object({
  fullName: z.string().min(2, "Nom trop court"),
  phone: z.string().min(8, "Numéro invalide"),
  password: z.string().min(6, "6 caractères minimum"),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "Données invalides" },
      { status: 400 }
    );
  }

  const phone = normalizeGabonPhone(parsed.data.phone);
  if (!phone) {
    return Response.json({ error: "Numéro de téléphone gabonais invalide" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { phone } });
  if (existing) {
    return Response.json({ error: "Un compte existe déjà avec ce numéro" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  const user = await prisma.user.create({
    data: { phone, fullName: parsed.data.fullName, passwordHash },
  });

  await createSession(user.id);
  return Response.json({ id: user.id, fullName: user.fullName });
}
