import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  css: {
    modules: {
      // styles.selectionBox instead of styles["selection-box"]
      localsConvention: "camelCaseOnly",
    },
  },
  build: {
    rollupOptions: {
      output: {
        // animation libraries change rarely — cache them separately from app code
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (/[\\/](gsap|@gsap|lenis|motion|framer-motion|motion-dom|motion-utils)[\\/]/.test(id)) return "motion";
          if (/[\\/]@fontsource/.test(id)) return undefined;
          return "vendor";
        },
      },
    },
  },
});
