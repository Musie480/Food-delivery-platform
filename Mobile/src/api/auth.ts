import { api } from "./client";
import type {
  AuthResponse,
  LoginInput,
  RegisterInput,
  ForgotPasswordInput,
} from "../types/auth";

export const authApi = {
  login: (input: LoginInput) =>
    api.post<AuthResponse>("/auth/login", input).then((r) => r.data),

  register: (input: RegisterInput) =>
    api.post<AuthResponse>("/auth/register", input).then((r) => r.data),

  forgotPassword: (input: ForgotPasswordInput) =>
    api.post("/auth/forgot-password", input).then((r) => r.data),
};
