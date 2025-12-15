import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";

// Fix: Inject the base path (e.g., "/elevate-uae-ops/") so the router knows where the app root is.
const baseUrl = import.meta.env.BASE_URL;

createRoot(document.getElementById("root")!).render(
  <BrowserRouter basename={baseUrl}>
    <App />
  </BrowserRouter>,
);
