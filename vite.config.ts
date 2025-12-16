import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => {
  // Load env vars (e.g., VITE_BASE_PATH from CI)
  const env = loadEnv(mode, process.cwd(), "");

  return {
    // If VITE_BASE_PATH is set (GH Pages), use it. Otherwise default to root (Vercel/Local).
    base: env.VITE_BASE_PATH || "/",
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
    build: {
      outDir: "dist",
      sourcemap: true,
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/frontend/test/setup.ts",
    },
  };
});
