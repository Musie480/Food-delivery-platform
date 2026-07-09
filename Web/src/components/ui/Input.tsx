import { clsx } from "clsx";
import type { InputHTMLAttributes } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  register?: UseFormRegisterReturn;
  icon?: React.ReactNode;
}

export function Input({
  label,
  error,
  register,
  icon,
  className,
  ...props
}: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-sm font-medium text-surface-700">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-surface-400">
            {icon}
          </div>
        )}
        <div className="overflow-hidden rounded-2xl border border-surface-200 bg-white ring-1 ring-black/[0.02] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-500/10">
          <input
            className={clsx(
              "w-full bg-transparent px-4 py-3 text-sm text-surface-900 placeholder:text-surface-400 focus:outline-none",
              icon && "pl-12",
              className,
            )}
            {...register}
            {...props}
          />
        </div>
      </div>
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
