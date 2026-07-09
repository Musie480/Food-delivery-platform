import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authService } from "../../services/auth";
import { useAuthStore } from "../../store/authStore";
import type {
  LoginInput,
  RegisterInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from "../../types/auth";

export function useLogin() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (input: LoginInput) => authService.login(input),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken);
      toast.success("Welcome back!");
      navigate("/" + data.user.role, { replace: true });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useRegister() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (input: RegisterInput) => authService.register(input),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken);
      setTimeout(() => {
        navigate("/" + data.user.role, { replace: true });
      }, 1200);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (input: ForgotPasswordInput) => authService.forgotPassword(input),
    onSuccess: () => {
      toast.success("Reset link sent to your email");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useResetPassword() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ token, data }: { token: string; data: ResetPasswordInput }) =>
      authService.resetPassword(token, data),
    onSuccess: () => {
      toast.success("Password reset successfully");
      navigate("/auth/login", { replace: true });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useLogout() {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  return () => {
    authService.logout();
    clearAuth();
    navigate("/auth/login", { replace: true });
  };
}
