import React from "react";
import { useToast } from "./use-toast";
import { X } from "lucide-react";

export function Toaster() {
  const { toasts, dismissToast } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-white rounded-lg shadow-lg p-4 max-w-sm w-full transition-all duration-300 ease-in-out"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-900">{toast.title}</h3>
              <p className="mt-1 text-sm text-gray-500">{toast.description}</p>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-gray-400 hover:text-gray-500"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
