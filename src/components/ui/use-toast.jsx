import { useState, useEffect } from "react";

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const toast = ({ title, description, duration = 3000 }) => {
    const id = Date.now();
    setToasts((prevToasts) => [
      ...prevToasts,
      { id, title, description, duration },
    ]);
  };

  const dismissToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  useEffect(() => {
    const timers = toasts.map((toast) => {
      return setTimeout(() => dismissToast(toast.id), toast.duration);
    });

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [toasts]);

  return { toast, toasts, dismissToast };
}
