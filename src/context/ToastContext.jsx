import { createContext, useContext, useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [celebration, setCelebration] = useState(null);
  const panelRef = useRef(null);
  const offset = useRef({ x: 0, y: 0 });

  // 🌓 Detecta modo oscuro
  useEffect(() => {
    const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(darkQuery.matches);
    const listener = (e) => setIsDarkMode(e.matches);
    darkQuery.addEventListener("change", listener);
    return () => darkQuery.removeEventListener("change", listener);
  }, []);

  // 🎵 Tono básico (para todos los toasts)
  const playTone = (freq = 880, duration = 0.25, volume = 0.08) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (err) {
      console.warn("Audio no soportado:", err);
    }
  };

  // 🎶 Tono de celebración (armonía elegante)
  const playCelebration = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const freqs = [523, 659, 784, 1046]; // Do - Mi - Sol - Do
      const now = ctx.currentTime;
      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(f, now + i * 0.15);
        gain.gain.setValueAtTime(0.07, now + i * 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.15);
        osc.stop(now + i * 0.15 + 0.25);
      });
    } catch (err) {
      console.warn("Celebration sound error:", err);
    }
  };

  // ✨ Muestra toast
  const showToast = (message, type = "info", { persistent = false } = {}) => {
    // 🎉 Celebración especial
    if (type === "celebration") {
      playCelebration();
      setCelebration(message);
      setTimeout(() => setCelebration(null), 3000);
      return;
    }

    setToasts((prev) => {
      const existing = prev.find(
        (t) => t.message === message && t.type === type && !t.persistent
      );
      if (existing) {
        return prev.map((t) =>
          t.id === existing.id
            ? { ...t, count: (t.count || 1) + 1, key: Date.now() }
            : t
        );
      }

      const id = Date.now();

      // Sonido según tipo
      if (type === "success") playTone(900, 0.25, 0.07);
      if (type === "error") playTone(220, 0.3, 0.1);
      if (type === "info") playTone(600, 0.2, 0.06);
      if (type === "error" && "vibrate" in navigator) navigator.vibrate(120);

      const newToast = {
        id,
        message,
        type,
        persistent,
        count: 1,
        timestamp: new Date().toLocaleTimeString(),
      };

      setHistory((h) => [newToast, ...h].slice(0, 15));
      if (!persistent) setTimeout(() => removeToast(id), 4000);
      return [...prev, newToast];
    });
  };

  const removeToast = (id) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  const clearHistory = () => setHistory([]);

  // 🖱️ Arrastre del panel flotante
  const startDrag = (e) => {
    if (isPinned) return;
    const panel = panelRef.current;
    if (!panel) return;
    const rect = panel.getBoundingClientRect();
    offset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    document.addEventListener("mousemove", handleDrag);
    document.addEventListener("mouseup", stopDrag);
  };
  const handleDrag = (e) => {
    const panel = panelRef.current;
    if (!panel) return;
    panel.style.left = `${e.clientX - offset.current.x}px`;
    panel.style.top = `${e.clientY - offset.current.y}px`;
  };
  const stopDrag = () => {
    document.removeEventListener("mousemove", handleDrag);
    document.removeEventListener("mouseup", stopDrag);
  };

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}

      {/* 🧭 Botón flotante historial */}
      <motion.button
        onClick={() => setShowHistory((s) => !s)}
        className="fixed bottom-8 left-6 bg-gradient-to-r from-[#d4b978] to-[#b9994b] text-[#3f2e13] dark:from-[#8b7531] dark:to-[#c8a85e] dark:text-[#fff8e5] shadow-lg rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold hover:scale-110 transition-transform z-[100]"
        whileTap={{ scale: 0.95 }}
        title="Ver historial de notificaciones"
      >
        🧭
      </motion.button>

      {/* 🪩 Toasts activos */}
      <div className="fixed bottom-8 right-5 z-50 flex flex-col gap-3 w-80">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.key || toast.id}
              initial={{ opacity: 0, y: 60, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className={`relative px-5 py-3 rounded-xl shadow-lg border text-sm font-medium flex items-center justify-between gap-3 backdrop-blur-sm ${
                toast.type === "success"
                  ? "bg-gradient-to-r from-[#d4b978] via-[#e8d29a] to-[#b9994b] text-[#3f2e13]"
                  : toast.type === "error"
                  ? "bg-gradient-to-r from-[#f8d7da] via-[#f5b5b8] to-[#f1a0a3] text-[#7a1c1c]"
                  : "bg-gradient-to-r from-[#faf7f1] via-[#f4efe6] to-[#f9f4e9] text-[#3f3524]"
              }`}
            >
              <div className="flex items-center gap-2">
                {toast.type === "success" && <span>🛍️</span>}
                {toast.type === "error" && <span>⚠️</span>}
                {toast.type === "info" && <span>💡</span>}
                <p>
                  {toast.message}
                  {toast.count > 1 && (
                    <span className="ml-2 text-xs font-semibold text-[#6b572e]">
                      (+{toast.count})
                    </span>
                  )}
                </p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-lg font-semibold opacity-70 hover:opacity-100 transition"
              >
                ✖
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 🎊 Celebración (efecto especial) */}
      <AnimatePresence>
        {celebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 flex flex-col items-center justify-center z-[120] pointer-events-none"
          >
            <motion.h2
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-[#b08c4e] drop-shadow-xl bg-white/50 backdrop-blur-sm px-6 py-3 rounded-xl border border-[#e7dcc5]"
            >
              ✨ {celebration} ✨
            </motion.h2>

            {/* confeti */}
            {[...Array(25)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: -20, x: Math.random() * 400 - 200 }}
                animate={{
                  y: "100vh",
                  rotate: 360,
                  x: Math.random() * 300 - 150,
                }}
                transition={{
                  duration: 2.5 + Math.random(),
                  repeat: 0,
                }}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  backgroundColor: [
                    "#d4b978",
                    "#e8d29a",
                    "#b9994b",
                    "#fff3c4",
                  ][i % 4],
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </ToastContext.Provider>
  );
}

// Hook
export const useToast = () => useContext(ToastContext);
