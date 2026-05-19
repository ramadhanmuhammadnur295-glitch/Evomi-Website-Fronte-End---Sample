"use client";

import { createContext, useContext, useState, useCallback, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextValue {
  toast: (options: Omit<Toast, "id">) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const toastConfig: Record<ToastType, { icon: React.ReactNode; styles: string }> = {
  success: {
    icon: <CheckCircle size={18} />,
    styles: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950",
  },
  error: {
    icon: <XCircle size={18} />,
    styles: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950",
  },
  warning: {
    icon: <AlertCircle size={18} />,
    styles: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950",
  },
  info: {
    icon: <Info size={18} />,
    styles: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950",
  },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (options: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).slice(2);
      const duration = options.duration ?? 4000;
      setToasts((prev) => [...prev, { ...options, id }]);
      if (duration > 0) {
        setTimeout(() => dismiss(id), duration);
      }
    },
    [dismiss]
  );

  const contextValue: ToastContextValue = {
    toast: addToast,
    success: (title, description) => addToast({ type: "success", title, description }),
    error: (title, description) => addToast({ type: "error", title, description }),
    warning: (title, description) => addToast({ type: "warning", title, description }),
    info: (title, description) => addToast({ type: "info", title, description }),
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {/* Toast portal */}
      <div
        aria-live="polite"
        className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none"
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => {
            const { icon, styles } = toastConfig[toast.type];
            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, x: 20 }}
                transition={{ type: "spring", duration: 0.3, bounce: 0.3 }}
                className="pointer-events-auto w-80 bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-800 p-4 flex items-start gap-3"
              >
                <span className={cn("flex-shrink-0 p-1 rounded-md", styles)}>
                  {icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {toast.title}
                  </p>
                  {toast.description && (
                    <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                      {toast.description}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => dismiss(toast.id)}
                  className="flex-shrink-0 p-1 rounded-md text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <X size={14} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}

export default ToastProvider;
