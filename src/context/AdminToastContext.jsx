import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

import AdminToast from "../admin/components/common/AdminToast";

const AdminToastContext = createContext(null);

export function AdminToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const toastId = useRef(0);

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type = "info", title = "تنبيه", message = "", duration = 3500 }) => {
      const id = ++toastId.current;

      setToasts((current) => [
        ...current.slice(-3),
        {
          id,
          type,
          title,
          message,
          duration,
        },
      ]);

      return id;
    },
    [],
  );

  return (
    <AdminToastContext.Provider value={{ showToast, removeToast }}>
      {children}

      <AdminToast toasts={toasts} onRemove={removeToast} />
    </AdminToastContext.Provider>
  );
}

export function useAdminToast() {
  const context = useContext(AdminToastContext);

  if (!context) {
    throw new Error("useAdminToast must be used inside AdminToastProvider");
  }

  return context;
}
