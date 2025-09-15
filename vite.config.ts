import { ConfigEnv, defineConfig, UserConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const isDev = mode === "development";
  return {
    build: {
      outDir: "dist",
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            "react-vendor": ["react", "react-dom"],
            vendor: ["moment"],
          },
        },
      },
    },
    plugins: [react()],
    define: {
      "process.env.NODE_ENV": JSON.stringify(isDev ? "development" : "production"),
    },
    server: {
      port: 3000,
      host: "localhost",
      open: true,
    },
    optimizeDeps: {
      include: ["react", "react-dom", "zustand", "use-sync-external-store/shim/with-selector"],
      force: true,
    },
    resolve: {
      dedupe: ["react", "react-dom"],
    },
  };
});
