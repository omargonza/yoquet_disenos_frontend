import { createContext, useContext, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  // ✨ Muestra un toast (limitamos a 3 simultáneos para evitar saturación)
  const showToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => {
      const updated = [...prev, { id, message, type }];
      return updated.slice(-3); // mantiene los últimos 3
    });
    setTimeout(() => removeToast(id), 3500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* 📍 Contenedor superior con alineación en cascada */}
      <div className="fixed top-6 right-6 z-[300] flex flex-col gap-2 w-[90%] max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast, index) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.95 }}
              transition={{
                duration: 0.35,
                ease: "easeOut",
                delay: index * 0.07, // ⚡ cascada fluida
              }}
              layout // organiza la animación entre toasts suavemente
              className={`relative flex items-center justify-between gap-3 rounded-xl shadow-md px-5 py-3 border font-medium text-sm backdrop-blur-lg pointer-events-auto transition-all
                ${
                  toast.type === "success"
                    ? "bg-[#fff8e2]/90 border-[#d4b978]/70 text-[#3f3524]"
                    : toast.type === "error"
                    ? "bg-[#fceaea]/95 border-[#f1a0a3]/70 text-[#6b2020]"
                    : "bg-[#f7f6f2]/95 border-[#e0d3aa]/60 text-[#3f3524]"
                }`}
            >
              <div className="flex items-center gap-2">
                {toast.type === "success" && <span className="text-lg">✅</span>}
                {toast.type === "error" && <span className="text-lg">⚠️</span>}
                {toast.type === "info" && <span className="text-lg">💬</span>}
                <p className="leading-tight">{toast.message}</p>
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="text-base font-semibold opacity-60 hover:opacity-100 transition"
              >
                ×
              </button>

              {/* ✨ Glow dorado solo en success */}
              {toast.type === "success" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0, 0.45, 0],
                    scale: [0.95, 1.05, 1],
                  }}
                  transition={{
                    duration: 1.6,
                    ease: "easeInOut",
                    repeat: 0,
                  }}
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#d4b978]/40 via-transparent to-[#d4b978]/40 blur-lg pointer-events-none"
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
