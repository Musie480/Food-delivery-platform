import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../../../config/env.js";

export const hashPassword = (password: string) => bcrypt.hash(password, 12);

export const verifyPassword = (password: string, hash: string) =>
  bcrypt.compare(password, hash);

export function generateToken(user: { id: string; role: string }) {
  return jwt.sign({ id: user.id, role: user.role }, env.jwtSecret, {
    expiresIn: "7d",
  });
}
