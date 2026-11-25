import { defineConfig } from 'vite';

// 局域网访问：host 设为 true 监听 0.0.0.0，
// 同一 WiFi 下的设备可通过 http://<本机IP>:5173 访问（如 http://192.168.1.8:5173）
export default defineConfig({
  server: {
    host: true,
    port: 5173,
    strictPort: true,
  },
  preview: {
    host: true,
    port: 4173,
    strictPort: true,
  },
});
