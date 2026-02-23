import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
import { dirname, resolve } from "node:path";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    include: ["tests/**/*.test.ts"],
    environment: "node",
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./"),
    },
  },
});
