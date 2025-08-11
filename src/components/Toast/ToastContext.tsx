import { createContext } from "react";
import type { Toast } from "./type";

// Toast context
interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => string;
  removeToast: (id: string) => void;
  updateToast: (id: string, updates: Partial<Toast>) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(
  undefined
);
