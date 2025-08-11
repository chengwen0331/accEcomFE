export type ToastVariant = "success" | "error" | "warning" | "info" | "loading";

export type ToastPosition =
  | "top"
  | "bottom"
  | "topLeft"
  | "topRight"
  | "bottomLeft"
  | "bottomRight";

interface ToastActionProps {
  label: string;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}

export interface Toast {
  id: string;
  variant: ToastVariant | (string & {});
  title: string;
  description?: string;
  duration?: number;
  dismissible?: boolean;
  action?: ToastActionProps[];
  position?: ToastPosition;
}

export interface ToastState {
  toasts: Toast[];
}

export type ToastAction =
  | { type: "ADD_TOAST"; payload: Toast }
  | { type: "REMOVE_TOAST"; payload: string }
  | { type: "UPDATE_TOAST"; payload: { id: string; updates: Partial<Toast> } };
