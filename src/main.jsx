import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { ToastProvider } from "./context/ToastContext";
import { CarritoProvider } from "./context/CarritoContext";
import { AmbientProvider } from "./context/AmbientContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AmbientProvider>
      <CarritoProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </CarritoProvider>
    </AmbientProvider>
  </BrowserRouter>
);
