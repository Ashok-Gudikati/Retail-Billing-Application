import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": "http://localhost:8080",
      // New proxy rule for images and other static assets
      "/images": "http://localhost:8080",
    },
  },
  plugins: [react()],
});
