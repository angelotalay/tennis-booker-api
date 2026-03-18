import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@generated": path.resolve(__dirname, "./generated"),
      "@tests": path.resolve(__dirname, "./tests"),
    },
  },
  test: {
    environment: "node",
  },
});
