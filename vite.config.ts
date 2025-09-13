import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      // This forces all imports of 'react' to resolve to the same file path.
      react: path.resolve(__dirname, './node_modules/react'),

      // This alias resolves the main SDK import.
      'contentstack-chat-sdk': path.resolve(__dirname, '../chat-sdk-type/src/index.ts'),

      // 4. ADD THIS NEW ALIAS
      // This explicitly resolves the import for the stylesheet.
      // We will point it directly to the source CSS file for better hot-reloading.
      'contentstack-chat-sdk/dist/style.css': path.resolve(__dirname, '../chat-sdk-type/src/styles/ChatWidget.css'),
    },
    // This tells Vite to respect the symbolic links created by `npm link`.
    preserveSymlinks: true,
  },
  // This tells Vite's dependency optimizer to not pre-bundle your linked SDK.
  optimizeDeps: {
    exclude: ['contentstack-chat-sdk'],
  },
})

