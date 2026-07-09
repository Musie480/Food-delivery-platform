import type { Response } from "express";
import { z } from "zod";
import { prisma } from "../../../shared/prisma.js";
import type { AuthRequest } from "../../../middleware/auth.js";

const createSchema = z.object({
  title: z.enum(["Home", "Work", "Other"]).default("Other"),
  label: z.string().max(50).optional(),
  address: z.string().min(3).max(300),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
  isDefault: z.boolean().optional(),
});

const updateSchema = z.object({
  title: z.enum(["Home", "Work", "Other"]).optional(),
  label: z.string().max(50).optional(),
  address: z.string().min(3).max(300).optional(),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
  isDefault: z.boolean().optional(),
});

export async function listAddresses(req: AuthRequest, res: Response) {
  const addresses = await prisma.address.findMany({
    where: { userId: req.userId! },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });
  res.json({ addresses });
}

export async function createAddress(req: AuthRequest, res: Response) {
  const { title, label, address, lat, lng, isDefault } = createSchema.parse(req.body);

  if (isDefault) {
    await prisma.address.updateMany({
      where: { userId: req.userId!, isDefault: true },
      data: { isDefault: false },
    });
  }

  const created = await prisma.address.create({
    data: {
      userId: req.userId!,
      title,
      label: label ?? null,
      address,
      lat: lat ?? null,
      lng: lng ?? null,
      isDefault: isDefault ?? false,
    },
  });

  res.status(201).json({ address: created });
}

export async function updateAddress(req: AuthRequest, res: Response) {
  const id = req.params.id as string;
  const { title, label, address, lat, lng, isDefault } = updateSchema.parse(req.body);

  const existing = await prisma.address.findFirst({
    where: { id, userId: req.userId! },
  });
  if (!existing) {
    res.status(404).json({ message: "Address not found" });
    return;
  }

  if (isDefault) {
    await prisma.address.updateMany({
      where: { userId: req.userId!, isDefault: true },
      data: { isDefault: false },
    });
  }

  const updated = await prisma.address.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(label !== undefined && { label: label ?? null }),
      ...(address !== undefined && { address }),
      ...(lat !== undefined && { lat: lat ?? null }),
      ...(lng !== undefined && { lng: lng ?? null }),
      ...(isDefault !== undefined && { isDefault }),
    },
  });

  res.json({ address: updated });
}

export async function deleteAddress(req: AuthRequest, res: Response) {
  const id = req.params.id as string;

  const existing = await prisma.address.findFirst({
    where: { id, userId: req.userId! },
  });
  if (!existing) {
    res.status(404).json({ message: "Address not found" });
    return;
  }

  await prisma.address.delete({ where: { id } });
  res.json({ message: "Address deleted" });
}

export async function setDefaultAddress(req: AuthRequest, res: Response) {
  const id = req.params.id as string;

  const existing = await prisma.address.findFirst({
    where: { id, userId: req.userId! },
  });
  if (!existing) {
    res.status(404).json({ message: "Address not found" });
    return;
  }

  await prisma.address.updateMany({
    where: { userId: req.userId!, isDefault: true },
    data: { isDefault: false },
  });

  const updated = await prisma.address.update({
    where: { id },
    data: { isDefault: true },
  });

  res.json({ address: updated });
}
