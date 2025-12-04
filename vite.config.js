import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/industrial-llm-demo/', // 这里的名字必须和你在GitHub上创建的仓库名一致！
})