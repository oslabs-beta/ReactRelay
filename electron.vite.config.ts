import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: 'src/main/index.ts',
        output: {
          dir: 'dist/main'  // Output directory for renderer process
        }
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        output: {
          dir: 'dist/preload'  // Output directory for renderer process
        }
      }
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [react()],
    build: {
      rollupOptions: {
        output: {
          dir: 'dist/renderer'  // Output directory for renderer process
        }
      }
    }
  },
})
