import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  // The Supabase ↔ Vercel integration sets NEXT_PUBLIC_SUPABASE_URL and
  // NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. Expose exactly those two public
  // values (never the integration's secret ones) as a fallback for the
  // VITE_ names used locally.
  const env = { ...loadEnv(mode, process.cwd(), ""), ...process.env };
  const supabaseUrl = env.VITE_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey =
    env.VITE_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  return {
    define: {
      "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(supabaseUrl),
      "import.meta.env.VITE_SUPABASE_ANON_KEY": JSON.stringify(supabaseKey),
    },
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
  };
});
