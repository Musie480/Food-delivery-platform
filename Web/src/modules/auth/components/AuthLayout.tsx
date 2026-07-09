import { Link } from "react-router-dom";
import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  mode?: "login" | "register" | "forgot" | "reset" | "verify";
}

const footerMap = {
  login: { text: "Don't have an account?", link: "/auth/register", label: "Sign up" },
  register: { text: "Already have an account?", link: "/auth/login", label: "Sign in" },
  forgot: { text: "Remember your password?", link: "/auth/login", label: "Sign in" },
  reset: { text: "Remember your password?", link: "/auth/login", label: "Sign in" },
  verify: null,
};

export function AuthLayout({ children, title, subtitle, mode = "login" }: AuthLayoutProps) {
  const footer = footerMap[mode];

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-surface-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="p-1.5">
          <div className="rounded-[calc(2rem-0.375rem)] bg-white p-8 shadow-xl shadow-black/[0.02] ring-1 ring-black/[0.03] sm:p-10">
            <div className="mb-8 text-center">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-2xl font-bold text-primary-500"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-500 text-sm font-bold text-white">
                  F
                </span>
                Keleme Delivery
              </Link>
              <h1 className="mt-6 text-2xl font-semibold tracking-tight text-surface-900">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-2 text-sm text-surface-500">{subtitle}</p>
              )}
            </div>
            {children}
          </div>
        </div>

        {footer && (
          <p className="mt-6 text-center text-sm text-surface-500">
            {footer.text}{" "}
            <Link
              to={footer.link}
              className="font-medium text-primary-500 transition-colors duration-300 hover:text-primary-600"
            >
              {footer.label}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
