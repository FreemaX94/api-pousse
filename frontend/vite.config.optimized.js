// vite.config.optimized.js - Configuration optimisée pour réduire les bundles
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const isProd = process.env.NODE_ENV === 'production';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
      'react-dom/client',
    ],
    exclude: [
      // Exclure les libs lourdes pour forcer le chunking
      '@mui/x-data-grid',
      'recharts',
      '@fullcalendar/react'
    ]
  },
  server: {
    port: 3000,
    open: true,
    cors: true,
    proxy: isProd ? {} : {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
    hmr: {
      overlay: true,
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Désactiver en prod pour réduire la taille
    minify: 'esbuild', // Plus rapide que terser
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // 🚀 CHUNKING STRATEGY - Séparer les vendors lourds
        manualChunks: {
          // Vendor chunks
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui-mui': ['@mui/material', '@mui/icons-material', '@mui/x-data-grid'],
          'vendor-ui-antd': ['antd'],
          'vendor-animation': ['framer-motion'],
          'vendor-charts': ['recharts'],
          'vendor-calendar': [
            '@fullcalendar/react',
            '@fullcalendar/daygrid',
            '@fullcalendar/timegrid',
            '@fullcalendar/interaction',
            '@fullcalendar/google-calendar'
          ],
          'vendor-utils': ['axios', 'date-fns', 'lucide-react', 'react-icons'],
          
          // Feature chunks
          'feature-auth': [
            './src/features/auth/pages/Login',
            './src/features/auth/pages/Signup',
            './src/features/auth/components/PrivateRoute'
          ],
          'feature-finance': [
            './src/features/finance/pages/Comptabilite',
            './src/features/finance/components/ExpenseForm',
            './src/features/finance/components/InvoiceForm'
          ],
          'feature-inventory': [
            './src/features/inventory/pages/LivraisonList',
            './src/features/inventory/components/EntryForm',
            './src/features/inventory/components/ExitForm'
          ],
          'feature-fleet': [
            './src/features/fleet/pages/Vehicules',
            './src/features/fleet/components/VehicleForm'
          ],
          'feature-calendar': [
            './src/features/calendar/pages/Evenements'
          ],
          'feature-projects': [
            './src/features/projects/pages/Entretien',
            './src/features/projects/components/ProjetForm'
          ]
        },
        // 🎯 Optimiser les noms de fichiers
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split('/').pop().replace('.jsx', '').replace('.js', '')
            : 'chunk';
          return `js/${facadeModuleId}-[hash].js`;
        },
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    },
    // 🔧 Compression
    reportCompressedSize: true,
    // Parallel build
    cssCodeSplit: true,
  },
  // Performance hints
  esbuild: {
    // Tree shaking plus agressif
    treeShaking: true,
    // Remove console.log en production
    drop: isProd ? ['console', 'debugger'] : [],
  }
});