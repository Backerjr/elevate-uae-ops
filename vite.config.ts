import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  // Default to "/" for Vercel/local. Only use a subdirectory when explicitly set (e.g. GitHub Pages).
  base: process.env.VITE_BASE_PATH || "/",
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
