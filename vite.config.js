import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

// `npm run dev` has no Vercel functions, so serve /api/brief from the same
// code here. It uses SUPABASE_* / RESEND_* from .env.local when present.
function devApi(mode) {
  return {
    name: "dev-api",
    configureServer(server) {
      server.middlewares.use("/api/brief", async (req, res) => {
        const send = (status, body) => {
          res.statusCode = status;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(body));
        };
        if (req.method !== "POST") return send(405, { ok: false, error: "method_not_allowed" });
        let raw = "";
        for await (const chunk of req) raw += chunk;
        let body = {};
        try {
          body = JSON.parse(raw || "{}");
        } catch {
          /* empty body */
        }
        const { handleBrief } = await server.ssrLoadModule("/api/_brief.js");
        const env = { ...process.env, ...loadEnv(mode, process.cwd(), "") };
        const result = await handleBrief(body, { ip: req.socket.remoteAddress ?? "", env });
        return send(result.status, result.body);
      });
    },
  };
}

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
    plugins: [react(), devApi(mode)],
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
