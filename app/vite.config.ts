import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import ViteYaml from '@modyfi/vite-plugin-yaml';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), ViteYaml()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
});
