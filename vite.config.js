import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/retreat-app/',
  plugins: [react()],
  build: {
    sourcemap: true, // 소스맵 생성
  },
});
