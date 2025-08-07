import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Plugin pour supprimer complètement les références problématiques
const removeReactIsPlugin = () => ({
  name: 'remove-react-is-issues',
  generateBundle(options, bundle) {
    // Parcourir tous les chunks pour remplacer les références problématiques
    Object.keys(bundle).forEach(fileName => {
      const chunk = bundle[fileName];
      if (chunk.type === 'chunk' && chunk.code) {
        // Remplacer les appels problématiques par la version correcte
        chunk.code = chunk.code.replace(
          /require\("\.\/cjs\/react-is\.production\.js"\)/g,
          'require("react-is")'
        );
        chunk.code = chunk.code.replace(
          /import.*from.*"\.\/cjs\/react-is\.production\.js"/g,
          'import * as ReactIs from "react-is"'
        );
      }
    });
  }
});



export default defineConfig({
  plugins: [react(), removeReactIsPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      './cjs/react-is.production.js': 'react-is',
      './cjs/react-is.development.js': 'react-is',
      'react-is/cjs/react-is.production.js': 'react-is',
      'react-is/cjs/react-is.development.js': 'react-is'
    },
    dedupe: ['react', 'react-dom', 'react-is']
  },
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    include: ['react/jsx-runtime', 'react', 'react-dom', 'react-is'],
    force: true
  },
  esbuild: {
    target: 'esnext',
    keepNames: true
  },
  server: {
    port: 3000,
    host: true,
    hmr: {
      overlay: false
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        timeout: 10000,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Proxy request:', req.url, '->', options.target + req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Proxy response:', req.url, '->', proxyRes.statusCode);
          });
        }
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: process.env.NODE_ENV === 'development',
    minify: 'esbuild',
    target: 'esnext',
    chunkSizeWarningLimit: 500, // Réduction pour forcer le chunking
    rollupOptions: {
      external: [],
      plugins: [
        {
          name: 'react-is-resolver',
          resolveId(id) {
            if (id.includes('react-is.production') || id === './cjs/react-is.production.js') {
              return 'react-is';
            }
          }
        }
      ],
      output: {
        manualChunks(id) {
          // Chunking dynamique amélioré - SUPPRESSION TOTALE de vendor-misc
          if (id.includes('node_modules')) {
            // Vendor UI - Material-UI (en premier pour éviter les conflits)
            if (id.includes('@mui') || id.includes('@emotion')) {
              return 'vendor-ui';
            }
            
            // Vendor Utils - Utilitaires
            if (id.includes('axios') || id.includes('moment') || id.includes('date-fns') || id.includes('lodash')) {
              return 'vendor-utils';
            }
            
            // Vendor Charts/Data
            if (id.includes('chart') || id.includes('d3') || id.includes('recharts')) {
              return 'vendor-charts';
            }
            
            // TOUT LE RESTE va dans vendor-react pour éviter vendor-misc
            return 'vendor-react';
          }
          
          // Chunking par feature business
          if (id.includes('/features/inventory/') || id.includes('/components/Stock') || id.includes('/components/Entry') || id.includes('/components/Exit')) {
            return 'feature-inventory';
          }
          
          if (id.includes('/features/catalog/') || id.includes('Nieuwkoop') || id.includes('Catalogue')) {
            return 'feature-catalog';
          }
          
          if (id.includes('/features/finance/') || id.includes('Comptabilite') || id.includes('Invoice') || id.includes('Expense')) {
            return 'feature-finance';
          }
          
          if (id.includes('/features/auth/') || id.includes('Login') || id.includes('Signup')) {
            return 'feature-auth';
          }
          
          if (id.includes('/features/planning/') || id.includes('Planning') || id.includes('intervention')) {
            return 'feature-planning';
          }
          
          if (id.includes('/features/dashboard/') || id.includes('Dashboard') || id.includes('Home')) {
            return 'feature-dashboard';
          }
          
          // Shared components
          if (id.includes('/shared/') || id.includes('/components/') && !id.includes('/features/')) {
            return 'shared-components';
          }
          
          // Utilities et hooks
          if (id.includes('/utils/') || id.includes('/hooks/') || id.includes('/api/')) {
            return 'shared-utils';
          }
        },
        
        // Optimisation des noms de fichiers
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  }
});