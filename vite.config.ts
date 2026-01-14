import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  // GitHub Pages (Project Pages) 默认路径是 /<repo>/
  // 如果你的仓库名不是 Color-Vault，把下面改成 '/你的仓库名/'
  base: mode === 'production' ? '/Color-Vault/' : '/',
  plugins: [react(), tailwindcss()],
}))
