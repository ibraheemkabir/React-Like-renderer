import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    setupFiles: ['.vitest/snapshot-serializer.setup.ts'],
    environment: 'happy-dom',
  },
})
