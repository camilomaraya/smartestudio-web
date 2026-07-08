import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Build estático (dist/) para subir por SFTP a DirectAdmin.
export default defineConfig({
  plugins: [react()],
})
