import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  // DYNAMIC BASE: GitHub Pages subpath in production, root otherwise
  base: mode === "production" ? "/elevate-uae-ops/" : "/",
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src/frontend"),
      "@data": path.resolve(__dirname, "./src/data"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/frontend/test/setup.ts",
  },
}));

const resolvePath = (path: string) => {
  const base = import.meta.env.BASE_URL;
  // Remove leading slash from path if base already has trailing slash to avoid double //
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${base}${cleanPath}`;
};
