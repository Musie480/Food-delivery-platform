import { clsx } from "clsx";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  return (
    <div className={clsx("flex items-center justify-center", className)}>
      <span
        className={clsx(
          "animate-spin rounded-full border-2 border-surface-200 border-t-primary-500",
          {
            "h-4 w-4": size === "sm",
            "h-6 w-6": size === "md",
            "h-8 w-8": size === "lg",
          },
        )}
      />
    </div>
  );
}
