"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  onClick,
  className = "",
  type = "button",
}: ButtonProps) {
  const baseStyles =
    "font-bold uppercase tracking-widest transition-all duration-200 rounded-xl";

  const variants = {
    primary: "bg-stone-900 text-white hover:bg-stone-800 disabled:opacity-50",
    secondary:
      "border border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white",
    danger: "bg-red-500 text-white hover:bg-red-600 disabled:opacity-50",
    ghost: "text-stone-600 hover:text-stone-900 hover:bg-stone-50",
  };

  const sizes = {
    sm: "px-4 py-2 text-[10px]",
    md: "px-6 py-3 text-xs",
    lg: "px-8 py-4 text-sm",
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  );
}
