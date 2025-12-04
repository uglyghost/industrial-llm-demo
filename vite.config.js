import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // ⚠️ 注意：这里的名称必须与您的 GitHub 仓库名称完全一致！
  // 例如您的仓库地址是 https://github.com/user/my-project
  // 那么这里就填 '/my-project/'
  base: '/industrial-llm-demo/',
})