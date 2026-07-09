import type { Response } from "express";
import { z } from "zod";
import { prisma } from "../../../shared/prisma.js";
import type { AuthRequest } from "../../../middleware/auth.js";

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  avatar: z.string().optional(),
});

export async function updateProfile(req: AuthRequest, res: Response) {
  const parsed = updateSchema.parse(req.body);
  const data: Record<string, string> = {};
  if (parsed.name !== undefined) data.name = parsed.name;
  if (parsed.avatar !== undefined) data.avatar = parsed.avatar;

  const user = await prisma.user.update({
    where: { id: req.userId! },
    data,
    select: { id: true, name: true, phone: true, role: true, avatar: true, createdAt: true },
  });

  res.json({ user });
}

export async function getProfile(req: AuthRequest, res: Response) {
  const user = await prisma.user.findUnique({
    where: { id: req.userId! },
    select: { id: true, name: true, phone: true, role: true, avatar: true, createdAt: true },
  });

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  res.json({ user });
}
