import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5173,
    host: true,
    // 明确禁止访问敏感文件
    middlewareMode: false,
    fs: {
      // 严格限制文件访问
      strict: true,
      // 明确拒绝访问的文件类型
      deny: [
        '**/.env*',
        '**/config.json',
        '**/config.*.json',
        '**/server/**',
        '**/*.key',
        '**/*.pem',
        '**/*.p12'
      ]
    }
  },
  build: {
    outDir: 'dist'
  },
  // 预防通过别名访问敏感文件
  resolve: {
    alias: {
      // 禁止通过别名访问 server 目录
      '@server': false,
      '@config': false
    }
  }
})
