import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { ToastProvider } from "./context/ToastContext";
import { CarritoProvider } from "./context/CarritoContext";
import { AmbientProvider } from "./context/AmbientContext";
import { registerServiceWorker } from "./registerSW";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter basename="/">
    <AmbientProvider>
      <CarritoProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </CarritoProvider>
    </AmbientProvider>
  </BrowserRouter>
);

// 💡 SW se registra al final, después de renderizar la app
registerServiceWorker();
