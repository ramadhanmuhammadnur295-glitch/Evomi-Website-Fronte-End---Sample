import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  as?: "section" | "div" | "article";
  container?: boolean;
  size?: "sm" | "md" | "lg" | "full";
}

interface SectionHeaderProps {
  badge?: string;
  title: string;
  description?: string;
  align?: "left" | "center" | "right";
  className?: string;
}

const containerSizes = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-7xl",
  full: "max-w-full",
};

export function Section({
  as: Tag = "section",
  container = true,
  size = "lg",
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <Tag
      className={cn("py-16 lg:py-24", className)}
      {...props}
    >
      {container ? (
        <div
          className={cn(
            "mx-auto px-4 sm:px-6 lg:px-8",
            containerSizes[size]
          )}
        >
          {children}
        </div>
      ) : (
        children
      )}
    </Tag>
  );
}

export function SectionHeader({
  badge,
  title,
  description,
  align = "center",
  className,
}: SectionHeaderProps) {
  const alignStyles = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  };

  return (
    <div className={cn("flex flex-col gap-3 mb-12 lg:mb-16", alignStyles[align], className)}>
      {badge && (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900 w-fit">
          {badge}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-white leading-tight tracking-tight">
        {title}
      </h2>
      {description && (
        <p className="text-lg text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-2xl">
          {description}
        </p>
      )}
    </div>
  );
}

// Container-only utility
export function Container({
  size = "lg",
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { size?: "sm" | "md" | "lg" | "full" }) {
  return (
    <div
      className={cn(
        "mx-auto px-4 sm:px-6 lg:px-8",
        containerSizes[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default Section;
