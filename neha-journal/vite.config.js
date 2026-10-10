import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // changes on every build, so browsers never keep an old or broken copy of a photo
  define: { __MEDIA_VERSION__: JSON.stringify(String(Date.now())) },
  build: { chunkSizeWarningLimit: 900 },
});
