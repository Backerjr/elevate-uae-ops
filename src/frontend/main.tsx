import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";

// Automatically picks up the base path configured in vite.config.ts
const baseUrl = import.meta.env.BASE_URL;

createRoot(document.getElementById("root")!).render(
  <BrowserRouter basename={baseUrl}>
    <App />
  </BrowserRouter>,
);
