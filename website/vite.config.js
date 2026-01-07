import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "@shared": path.resolve(__dirname, "../frontend/src"),
      react: path.resolve(__dirname, "node_modules/react"),
      "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
    },
    dedupe: ["react", "react-dom"],
  },

  server: {
    fs: {
      allow: [".."],
    },
  },

  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom", "axios", "react-icons"],
  },
});
