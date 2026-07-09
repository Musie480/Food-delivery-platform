export type UserRole = "customer" | "vendor" | "admin" | "driver";

export interface User {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginInput {
  phone: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  phone: string;
  password: string;
  role: "customer" | "driver";
}

export interface ForgotPasswordInput {
  phone: string;
}
