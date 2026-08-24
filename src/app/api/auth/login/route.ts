import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";
import { normalizeGabonPhone } from "@/lib/phone";

const schema = z.object({
  phone: z.string().min(8),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Données invalides" }, { status: 400 });
  }

  const phone = normalizeGabonPhone(parsed.data.phone);
  if (!phone) {
    return Response.json({ error: "Numéro de téléphone invalide" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { phone } });
  if (!user) {
    return Response.json({ error: "Identifiants incorrects" }, { status: 401 });
  }

  const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!valid) {
    return Response.json({ error: "Identifiants incorrects" }, { status: 401 });
  }

  await createSession(user.id);
  return Response.json({ id: user.id, fullName: user.fullName, role: user.role });
}
