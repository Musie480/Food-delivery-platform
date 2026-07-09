import { createBrowserRouter, Navigate } from "react-router-dom";
import { LoginPage } from "../modules/auth/pages/LoginPage";
import { RegisterPage } from "../modules/auth/pages/RegisterPage";
import { ForgotPasswordPage } from "../modules/auth/pages/ForgotPasswordPage";
import { ResetPasswordPage } from "../modules/auth/pages/ResetPasswordPage";
import { VerifyEmailPage } from "../modules/auth/pages/VerifyEmailPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/auth/login" replace />,
  },
  {
    path: "/auth",
    children: [
      { index: true, element: <Navigate to="/auth/login" replace /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "forgot-password", element: <ForgotPasswordPage /> },
      { path: "reset-password/:token", element: <ResetPasswordPage /> },
      { path: "verify/:token", element: <VerifyEmailPage /> },
    ],
  },
  // Portal placeholders
  {
    path: "/admin",
    element: <div className="flex h-screen items-center justify-center text-2xl font-semibold text-surface-600">Admin Portal</div>,
  },
  {
    path: "/customer",
    element: <div className="flex h-screen items-center justify-center text-2xl font-semibold text-surface-600">Customer Portal</div>,
  },
  {
    path: "/driver",
    element: <div className="flex h-screen items-center justify-center text-2xl font-semibold text-surface-600">Driver Portal</div>,
  },
  {
    path: "/vendor",
    element: <div className="flex h-screen items-center justify-center text-2xl font-semibold text-surface-600">Vendor Portal</div>,
  },
  {
    path: "*",
    element: <Navigate to="/auth/login" replace />,
  },
]);
