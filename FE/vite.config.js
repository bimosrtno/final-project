import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        landing: resolve(__dirname, 'src/pages/LandingPage/LandingPage.html'),
        login: resolve(__dirname, 'src/pages/LoginPage/Login.html'),
        salesMarketing: resolve(__dirname, 'src/pages/AdminSales/SalesDashboard.html'),
        adminGudang: resolve(__dirname, 'src/pages/AdminGudang/GudangDashboard.html'),
        superuser: resolve(__dirname, 'src/pages/SuperAdmin/Dashboard.html'), 
      },
    },
  },
});