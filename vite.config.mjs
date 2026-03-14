import { resolve } from 'node:path';
import viteFastify from '@fastify/vite/plugin';
import viteReact from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

export default {
    root: resolve(import.meta.dirname, 'src', 'client'),
    plugins: [
        viteFastify({ spa: true, useRelativePaths: true }),
        viteReact(),
        tailwindcss(),
    ],
    build: {
        emptyOutDir: true,
        outDir: resolve(import.meta.dirname, 'build'),
    },
    resolve: {
        alias: {
            '#': path.resolve(path.dirname(''), './src/client/src'),
            '@': path.resolve(path.dirname(''), './src'),
        },
    },
};
