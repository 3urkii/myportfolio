/// <reference types="vitest/config" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "out",
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        desktop: path.resolve(__dirname, "desktop/index.html"),
      },
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "infra/lambda/**/*.test.mjs"],
  },
});
