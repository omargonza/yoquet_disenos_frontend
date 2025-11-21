import { createContext, useContext, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev.slice(-2), { id, message, type }]); // Máx. 3 toasts
    setTimeout(() => removeToast(id), 3000);
  };

  const removeToast = (id) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Contenedor */}
      <div className="fixed top-5 right-5 z-[300] flex flex-col gap-2 w-[90%] max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className={`pointer-events-auto shadow-md rounded-xl px-4 py-3 border 
                          text-sm font-medium flex items-center justify-between
                          
                          ${
                            toast.type === "success"
                              ? "bg-white text-[#3d2b1f] border-[#ffd85a]/50"
                              : toast.type === "error"
                              ? "bg-[#ffe5e5] text-[#6b2020] border-[#ff8a8a]/50"
                              : "bg-white text-[#3d2b1f] border-[#d4b978]/40"
                          }`}
            >
              <span>
                {toast.type === "success" && "✨ "}
                {toast.type === "error" && "⚠️ "}
                {toast.message}
              </span>

              <button
                onClick={() => removeToast(toast.id)}
                className="ml-3 text-lg font-bold opacity-50 hover:opacity-100 transition"
              >
                ×
              </button>

              {/* Micro-brillo pastel (ultraliviano) */}
              {toast.type === "success" && (
                <div className="absolute inset-0 rounded-xl pointer-events-none opacity-10 bg-gradient-to-r from-[#ff66b3] via-[#ffd85a] to-[#42e2b8]" />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
