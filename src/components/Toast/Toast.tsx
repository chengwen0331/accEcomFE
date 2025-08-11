import { AlertTriangleFilled, CircleCheckFilled, CircleXFilled, InfoCircleFilled, X } from "./icons";
import { cn } from "./utils";
import type { ReactNode } from "react";
import { useCallback, useEffect, useReducer, useState } from "react";
import type { Toast, ToastPosition, ToastVariant } from "./type";
import { useToast } from "./useToast";
import { ToastContext } from "./ToastContext";
import { toastReducer } from "./reducer";

// ******************************  README  ***************************************

// To use the Toast component, make sure to wrap your app with <ToastProvider> in the App (App.tsx).

// To modify the default styles to your own styles:
// 1. create 'toastStyles.tsx' in styles folder, add below code

// ```
// import { registerToastTheme } from "@/components/ui/components";
//
// registerToastTheme({
//   base: "",
//   className: "",
//   title: {
//     base: "",
//     className: "",
//   },
//   description: {
//     base: "",
//     className: "",
//   },
//   action: {
//     base: "",
//     className: "",
//   },
//   dismissible: {
//     base: "",
//     className: "",
//   },
//   variants: {
//     success: {
//       icon: <Icon />,
//       title: "className",
//       description: "className",
//       action: "className",
//     },
//     // ... other variants
//   },
// });
// ```

// 2. add `import './styles/toastStyles'` into main.tsx

// *****************************************************************************

const TOAST_STYLES = {
  base: "shadow-md max-w-sm w-full p-4 rounded-lg bg-surfaceContainerHighest text-onSurface",
  className: "",
  title: {
    base: "text-onSurface label-medium-bold",
    className: "",
  },
  description: {
    base: "text-onSurfaceVariant label-small mt-1",
    className: "",
  },
  action: {
    base: "label-medium-bold text-primary hover:text-primary/80 focus:outline-none cursor-pointer mr-2",
    className: "",
  },
  dismissible: {
    base: "hover:opacity-80 focus:outline-none transition-colors cursor-pointer",
    className: "",
  },
};

const TOAST_VARIANTS: Record<
  string,
  {
    icon: ReactNode;
    title: string;
    description: string;
    action: string;
  }
> = {
  success: {
    icon: (
      <CircleCheckFilled
        className={"w-5 h-5 flex-shrink-0 mr-3 text-green-500"}
      />
    ),
    title: "",
    description: "",
    action: "",
  },
  error: {
    icon: (
      <CircleXFilled className={"w-5 h-5 flex-shrink-0 mr-3 text-red-500"} />
    ),
    title: "",
    description: "",
    action: "",
  },
  warning: {
    icon: (
      <AlertTriangleFilled
        className={"w-5 h-5 flex-shrink-0 mr-3 text-yellow-500"}
      />
    ),
    title: "",
    description: "",
    action: "",
  },
  info: {
    icon: (
      <InfoCircleFilled
        className={"w-5 h-5 flex-shrink-0 mr-3 text-blue-500"}
      />
    ),
    title: "",
    description: "",
    action: "",
  },
  loading: {
    icon: (
      <div
        className={
          "w-5 h-5 flex-shrink-0 mr-3 text-onSurface animate-spin rounded-full border-2 border-current border-t-transparent"
        }
      />
    ),
    title: "",
    description: "",
    action: "",
  },
};

const registerToastTheme = (config: {
  base?: string;
  className?: string;
  title?: {
    base?: string;
    className?: string;
  };
  description?: {
    base?: string;
    className?: string;
  };
  action?: {
    base?: string;
    className?: string;
  };
  dismissible?: {
    base?: string;
    className?: string;
  };
  variants?: Partial<
    Record<
      ToastVariant | (string & {}),
      {
        icon?: React.ReactNode;
        title?: string;
        description?: string;
        action?: string;
      }
    >
  >;
}) => {
  if (config.base) TOAST_STYLES.base = config.base;
  if (config.className) TOAST_STYLES.className = config.className;

  if (config.title?.base) TOAST_STYLES.title.base = config.title.base;
  if (config.title?.className) TOAST_STYLES.title.className = config.title.className;

  if (config.description?.base) TOAST_STYLES.description.base = config.description.base;
  if (config.description?.className) TOAST_STYLES.description.className = config.description.className;

  if (config.action?.base) TOAST_STYLES.action.base = config.action.base;
  if (config.action?.className) TOAST_STYLES.action.className = config.action.className;

  if (config.dismissible?.base) TOAST_STYLES.dismissible.base = config.dismissible.base;
  if (config.dismissible?.className) TOAST_STYLES.dismissible.className = config.dismissible.className;

  if (config.variants) {
    for (const [variant, variantConfig] of Object.entries(config.variants)) {
      if (!variantConfig) continue;

      TOAST_VARIANTS[variant as ToastVariant] = {
        icon: variantConfig.icon ??
            TOAST_VARIANTS[variant as ToastVariant]?.icon ??
            null,
        title: variantConfig.title ?? "",
        description: variantConfig.description ?? "",
        action: variantConfig.action ?? "",
      };
    }
  }
};

// --------------------------------
//
// --------- Components -----------
//
// --------------------------------

const positionClass: Record<ToastPosition, string> = {
  top: "top-4 left-1/2 -translate-x-1/2",
  bottom: "bottom-4 left-1/2 -translate-x-1/2",
  topLeft: "top-4 left-4",
  topRight: "top-4 right-4",
  bottomLeft: "bottom-4 left-4",
  bottomRight: "bottom-4 right-4",
};

const getEnterClass = (position: ToastPosition = "bottomRight") => {
  switch (position) {
    case "top":
    case "bottom":
      return "translate-y-0 opacity-100";
    case "topLeft":
    case "bottomLeft":
      return "translate-x-0 opacity-100";
    default:
      return "translate-x-0 opacity-100"; // topRight, bottomRight
  }
};

const getExitClass = (position: ToastPosition = "bottomRight") => {
  switch (position) {
    case "top":
      return "-translate-y-full opacity-0";
    case "bottom":
      return "translate-y-full opacity-0";
    case "topLeft":
    case "bottomLeft":
      return "-translate-x-full opacity-0";
    default:
      return "translate-x-full opacity-0"; // topRight, bottomRight
  }
};

const ToastItem = ({ toast }: { toast: Toast }) => {
  const { removeToast } = useToast();
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const variantStyles = TOAST_VARIANTS[toast.variant];
  const enterClass = getEnterClass(toast.position);
  const exitClass = getExitClass(toast.position);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleRemove = () => {
    setIsExiting(true);
    setTimeout(() => {
      removeToast(toast.id);
    }, 300);
  };

  return (
    <div
      className={cn(
        TOAST_STYLES.base,
        "transition-all duration-300 ease-in-out",
        isVisible && !isExiting ? enterClass : exitClass,
        TOAST_STYLES.className
      )}
    >
      <div className="flex items-start">
        {variantStyles.icon ?? null}

        <div className="flex-1 mr-2 w-full">
          <p
            className={cn(
              TOAST_STYLES.title.base,
              TOAST_STYLES.title.className,
              variantStyles.title
            )}
          >
            {toast.title}
          </p>
          {toast.description && (
            <p
              className={cn(
                TOAST_STYLES.description.base,
                TOAST_STYLES.description.className,
                variantStyles.description
              )}
            >
              {toast.description}
            </p>
          )}

          {toast.action && (
            <div className="flex flex-wrap gap-2 items-center mt-2">
              {toast.action?.map((action, index) => (
                <button
                  key={index}
                  disabled={action.disabled}
                  onClick={action.onClick}
                  className={cn(
                    TOAST_STYLES.action.base,
                    TOAST_STYLES.action.className,
                    variantStyles.action,
                    action.className
                  )}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {toast.dismissible && (
          <button
            onClick={handleRemove}
            className={cn(
              TOAST_STYLES.dismissible.base,
              TOAST_STYLES.dismissible.className
            )}
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

const ToastContainer = () => {
  const { toasts } = useToast();

  const grouped = toasts.reduce<Record<ToastPosition, Toast[]>>(
    (acc, toast) => {
      const pos = toast.position ?? "bottomRight";
      if (!acc[pos]) acc[pos] = [];
      acc[pos].push(toast);
      return acc;
    },
    {
      top: [],
      bottom: [],
      topLeft: [],
      topRight: [],
      bottomLeft: [],
      bottomRight: [],
    }
  );

  return (
    <>
      {Object.entries(grouped).map(([position, toasts]) =>
        toasts.length ? (
          <div
            key={position}
            className={cn(
              "fixed z-90 flex flex-col space-y-2",
              positionClass[position as ToastPosition]
            )}
            style={{ maxHeight: "calc(100vh - 2rem)" }}
          >
            {toasts.map((toast) => (
              <ToastItem key={toast.id} toast={toast} />
            ))}
          </div>
        ) : null
      )}
    </>
  );
};

// Toast provider
function ToastProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(toastReducer, { toasts: [] });

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id =
      Math.random().toString(36).substring(2) + Date.now().toString(36);
    const newToast: Toast = {
      id,
      duration: 4000,
      dismissible: true,
      ...toast,
    };

    dispatch({ type: "ADD_TOAST", payload: newToast });

    if (typeof newToast.duration === "number") {
      setTimeout(() => {
        dispatch({ type: "REMOVE_TOAST", payload: id });
      }, newToast.duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    dispatch({ type: "REMOVE_TOAST", payload: id });
  }, []);

  const updateToast = useCallback((id: string, updates: Partial<Toast>) => {
    dispatch({ type: "UPDATE_TOAST", payload: { id, updates } });
  }, []);

  return (
    <ToastContext.Provider
      value={{ toasts: state.toasts, addToast, removeToast, updateToast }}
    >
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

export { registerToastTheme, ToastContainer, ToastProvider }