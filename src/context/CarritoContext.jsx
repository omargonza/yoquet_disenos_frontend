import { createContext, useContext, useEffect, useState } from "react";

const CarritoContext = createContext();

export function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState([]);

  // 🔄 Cargar carrito desde localStorage
  useEffect(() => {
    const guardado = localStorage.getItem("carrito");
    if (guardado) {
      try {
        const data = JSON.parse(guardado);
        if (Array.isArray(data)) setCarrito(data);
      } catch {
        setCarrito([]);
      }
    }
  }, []);

  // 💾 Guardar carrito automáticamente
  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  // ➕ Agregar al carrito
  const agregarAlCarrito = (producto) => {
    setCarrito((prev) => {
      const existe = prev.find((p) => p.id === producto.id);
      if (existe) {
        return prev.map((p) =>
          p.id === producto.id
            ? { ...p, cantidad: p.cantidad + 1 }
            : p
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  // ➖ Eliminar 1 unidad o producto completo
  const eliminarDelCarrito = (id) => {
    setCarrito((prev) =>
      prev
        .map((p) =>
          p.id === id ? { ...p, cantidad: p.cantidad - 1 } : p
        )
        .filter((p) => p.cantidad > 0)
    );
  };

  // 🗑️ Eliminar producto completo
  const quitarProducto = (id) => {
    setCarrito((prev) => prev.filter((p) => p.id !== id));
  };

  // 🚮 Vaciar todo
  const vaciarCarrito = () => setCarrito([]);

  // 🧮 Totales
  const totalItems = carrito.reduce((acc, p) => acc + p.cantidad, 0);
  const totalPrecio = carrito.reduce(
    (acc, p) => acc + p.cantidad * p.precio,
    0
  );

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        agregarAlCarrito,
        eliminarDelCarrito,
        quitarProducto,
        vaciarCarrito,
        totalItems,
        totalPrecio,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

export const useCarrito = () => useContext(CarritoContext);
