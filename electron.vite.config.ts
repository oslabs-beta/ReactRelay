import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({

  main: {
    build: {
      rollupOptions: {
        input: {
          // Backend entry point
          backend: resolve("server/server.ts"),
        },
    },
  },
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    build: {
      rollupOptions: {
        input: {
          // Frontend entry point
          index: resolve("src/renderer/src/main.tsx"),
        },
    },
  },
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [react()]
  }
})

