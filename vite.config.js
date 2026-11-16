import { defineConfig } from 'vite';
// base './' permite publicar en Netlify, GitHub Pages (subcarpeta) o cualquier hosting estático.
export default defineConfig({ base: './', build: { target: 'es2020' } });
