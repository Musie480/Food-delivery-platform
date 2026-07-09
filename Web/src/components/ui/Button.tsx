import { clsx } from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  loading,
  icon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={clsx(
        "group relative inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50",
        {
          "bg-primary-500 text-white hover:bg-primary-600 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40":
            variant === "primary",
          "bg-surface-100 text-surface-900 hover:bg-surface-200":
            variant === "secondary",
          "bg-transparent text-surface-600 hover:text-surface-900 hover:bg-surface-100":
            variant === "ghost",
          "border border-surface-300 bg-transparent text-surface-700 hover:bg-surface-50 hover:border-surface-400":
            variant === "outline",
        },
        {
          "px-4 py-2 text-sm": size === "sm",
          "px-6 py-3 text-sm": size === "md",
          "px-8 py-4 text-base": size === "lg",
        },
        className,
      )}
      {...props}
    >
      {loading ? (
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        children
      )}
      {icon && !loading && (
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:scale-105">
          {icon}
        </span>
      )}
    </button>
  );
}
