import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/*
 * Build estático (dist/) para subir por SFTP a DirectAdmin.
 *
 * El prerender NO vive acá: lo hace scripts/prerender.mjs, que llama a esta
 * misma config para el bundle de cliente y después construye un bundle SSR
 * aparte. El porqué de no usar un plugin está en DESIGN.md §3.
 */
export default defineConfig({
  plugins: [react()],
})
