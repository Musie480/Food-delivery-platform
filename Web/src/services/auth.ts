import { api } from "./api";
import type {
  AuthResponse,
  LoginInput,
  RegisterInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from "../types/auth";

export const authService = {
  async login(input: LoginInput): Promise<AuthResponse> {
    const { data } = await api.post("/auth/login", input);
    return data;
  },

  async register(input: RegisterInput): Promise<AuthResponse> {
    const { data } = await api.post("/auth/register", input);
    return data;
  },

  async forgotPassword(input: ForgotPasswordInput): Promise<void> {
    await api.post("/auth/forgot-password", input);
  },

  async resetPassword(
    token: string,
    input: ResetPasswordInput,
  ): Promise<void> {
    await api.post("/auth/reset-password", { ...input, token });
  },

  async verifyEmail(token: string): Promise<void> {
    await api.post("/auth/verify-email", { token });
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const { data } = await api.post("/auth/refresh", { refreshToken });
    return data;
  },

  async getProfile() {
    const { data } = await api.get("/auth/me");
    return data;
  },

  logout(): void {
    api.post("/auth/logout").catch(() => {});
  },
};
