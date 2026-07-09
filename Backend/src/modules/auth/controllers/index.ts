import type { Request, Response } from "express";
import { prisma } from "../../../shared/prisma.js";
import { registerSchema, loginSchema } from "../validators/index.js";
import { hashPassword, verifyPassword, generateToken } from "../services/index.js";

export async function register(req: Request, res: Response) {
  const data = registerSchema.parse(req.body);

  const existing = await prisma.user.findUnique({ where: { phone: data.phone } });
  if (existing) {
    res.status(409).json({ message: "Phone number already registered" });
    return;
  }

  const password = await hashPassword(data.password);
  const user = await prisma.user.create({
    data: {
      name: data.name,
      phone: data.phone,
      password,
      role: data.role,
    },
    select: { id: true, name: true, phone: true, role: true, avatar: true, createdAt: true },
  });

  const accessToken = generateToken(user);

  res.status(201).json({ user, accessToken, refreshToken: accessToken });
}

export async function login(req: Request, res: Response) {
  const data = loginSchema.parse(req.body);

  const user = await prisma.user.findUnique({ where: { phone: data.phone } });
  if (!user) {
    res.status(401).json({ message: "Invalid phone or password" });
    return;
  }

  const valid = await verifyPassword(data.password, user.password);
  if (!valid) {
    res.status(401).json({ message: "Invalid phone or password" });
    return;
  }

  const accessToken = generateToken(user);

  res.json({
    user: {
      id: user.id,
      name: user.name,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar,
      createdAt: user.createdAt,
    },
    accessToken,
    refreshToken: accessToken,
  });
}
