import { defineConfig } from 'vite';

import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	server: {
		host: true,   // binds to 0.0.0.0 — makes app reachable on LAN
		port: 5173,
	},
});
