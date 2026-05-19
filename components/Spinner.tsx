import { cn } from "@/lib/utils";

type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";
type SpinnerVariant = "default" | "primary" | "white";

interface SpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  label?: string;
  className?: string;
}

const sizeStyles: Record<SpinnerSize, string> = {
  xs: "w-3 h-3 border-[1.5px]",
  sm: "w-4 h-4 border-2",
  md: "w-6 h-6 border-2",
  lg: "w-8 h-8 border-[3px]",
  xl: "w-12 h-12 border-4",
};

const variantStyles: Record<SpinnerVariant, string> = {
  default: "border-neutral-300 border-t-neutral-700 dark:border-neutral-700 dark:border-t-neutral-300",
  primary: "border-blue-200 border-t-blue-600",
  white: "border-white/30 border-t-white",
};

export function Spinner({
  size = "md",
  variant = "primary",
  label,
  className,
}: SpinnerProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <div
        className={cn(
          "rounded-full animate-spin",
          sizeStyles[size],
          variantStyles[variant]
        )}
        role="status"
        aria-label={label || "Loading..."}
      />
      {label && (
        <span className="text-sm text-neutral-500 dark:text-neutral-400">{label}</span>
      )}
    </div>
  );
}

// Full-page loading overlay
export function PageLoader({ label }: { label?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm">
      <Spinner size="lg" label={label || "Loading..."} />
    </div>
  );
}

// Inline skeleton loader
interface SkeletonProps {
  className?: string;
  lines?: number;
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-800",
        className
      )}
    />
  );
}

export function SkeletonCard({ lines = 3 }: SkeletonProps) {
  return (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-3">
      <Skeleton className="h-5 w-2/3" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn("h-3", i === lines - 1 ? "w-1/2" : "w-full")}
        />
      ))}
    </div>
  );
}

export default Spinner;
