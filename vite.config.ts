import { ConfigEnv, defineConfig, UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import momentTimezonePlugin from "vite-plugin-moment-timezone";

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
    plugins: [
      react(),
      momentTimezonePlugin({
        zones: ["Europe/Berlin"],
        startYear: 2020,
        endYear: 2030,
      }),
    ],
    define: {
      "process.env.NODE_ENV": JSON.stringify(isDev ? "development" : "production"),
    },
    server: {
      port: 3000,
      host: "localhost",
      open: true,
    },
    optimizeDeps: {
      include: ["react", "react-dom", "moment-timezone"],
      force: true,
    },
    resolve: {
      dedupe: ["react", "react-dom"],
    },
  };
});
