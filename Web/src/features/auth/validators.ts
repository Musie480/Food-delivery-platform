import { z } from "zod";

const phoneRegex = /^\+251\d{9}$/;

function normalizeEthiopianPhone(value: string) {
  const digits = value.replace(/\D/g, "");

  if (digits.length === 9) {
    return `+251${digits}`;
  }

  if (digits.length === 10 && digits.startsWith("0")) {
    return `+251${digits.slice(1)}`;
  }

  if (digits.length === 12 && digits.startsWith("251")) {
    return `+${digits}`;
  }

  if (digits.length === 14 && digits.startsWith("00251")) {
    return `+${digits.slice(2)}`;
  }

  return value;
}

const phoneSchema = z
  .string()
  .transform(normalizeEthiopianPhone)
  .pipe(
    z.string().regex(phoneRegex, "Enter a valid Ethiopian phone number (+251XXXXXXXXX)"),
  );

export const loginSchema = z.object({
  phone: phoneSchema,
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: phoneSchema,
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["customer", "driver"]),
});

export const forgotPasswordSchema = z.object({
  phone: phoneSchema,
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
