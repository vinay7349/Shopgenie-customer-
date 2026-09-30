import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { 
  INITIAL_SHOPS, 
  INITIAL_PRODUCTS, 
  INITIAL_OFFERS, 
  INITIAL_FEED_POSTS, 
  INITIAL_LOYALTY_CARDS 
} from './src/data/mockData';

const mockDjangoApiPlugin = (): Plugin => ({
  name: 'mock-django-api',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const url = req.url || '';
      if (!url.startsWith('/api')) {
        return next();
      }

      const cleanUrl = url.split('?')[0].replace(/\/+$/, '');
      const searchParams = new URL(url, 'http://localhost:3000').searchParams;

      res.setHeader('Content-Type', 'application/json');

      if (cleanUrl === '/api' || cleanUrl === '') {
        res.end(JSON.stringify({
          status: 'online',
          service: 'ShopGenie Django REST Framework API',
          version: '1.0.0',
          endpoints: [
            '/api/shops/',
            '/api/products/',
            '/api/offers/',
            '/api/feed/',
            '/api/loyalty/',
            '/api/orders/'
          ]
        }));
        return;
      }

      if (cleanUrl === '/api/shops') {
        const cat = searchParams.get('category');
        const area = searchParams.get('area');
        const search = searchParams.get('search')?.toLowerCase();

        let filtered = INITIAL_SHOPS;
        if (cat && cat !== 'All') {
          filtered = filtered.filter(s => s.category.toLowerCase().includes(cat.toLowerCase()));
        }
        if (area) {
          filtered = filtered.filter(s => s.area.toLowerCase().includes(area.toLowerCase()));
        }
        if (search) {
          filtered = filtered.filter(s => s.name.toLowerCase().includes(search) || s.category.toLowerCase().includes(search));
        }
        res.end(JSON.stringify(filtered));
        return;
      }

      if (cleanUrl === '/api/products') {
        const shopId = searchParams.get('shop_id');
        const search = searchParams.get('search')?.toLowerCase();
        let filtered = INITIAL_PRODUCTS;
        if (shopId) {
          filtered = filtered.filter(p => p.shopId === shopId);
        }
        if (search) {
          filtered = filtered.filter(p => p.name.toLowerCase().includes(search));
        }
        res.end(JSON.stringify(filtered));
        return;
      }

      if (cleanUrl === '/api/products/lookup_barcode') {
        const barcode = searchParams.get('barcode');
        const found = INITIAL_PRODUCTS.find(p => p.barcode === barcode);
        if (found) {
          res.end(JSON.stringify(found));
        } else {
          res.statusCode = 404;
          res.end(JSON.stringify({ error: 'Product not found for barcode' }));
        }
        return;
      }

      if (cleanUrl === '/api/offers') {
        res.end(JSON.stringify(INITIAL_OFFERS));
        return;
      }

      if (cleanUrl === '/api/feed') {
        res.end(JSON.stringify(INITIAL_FEED_POSTS));
        return;
      }

      if (cleanUrl === '/api/loyalty') {
        res.end(JSON.stringify(INITIAL_LOYALTY_CARDS));
        return;
      }

      if (cleanUrl === '/api/orders') {
        res.statusCode = 201;
        res.end(JSON.stringify({
          id: 'ORD-' + Math.floor(Math.random() * 89999 + 10000),
          status: 'confirmed',
          created_at: new Date().toISOString()
        }));
        return;
      }

      if (cleanUrl.endsWith('/verify_exit_pass')) {
        res.end(JSON.stringify({
          verified: true,
          timestamp: new Date().toISOString(),
          message: 'Exit pass verified by store terminal'
        }));
        return;
      }

      // Default fallback for any other api route
      res.end(JSON.stringify({ status: 'ok', fallback: true }));
    });
  }
});

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      mockDjangoApiPlugin(),
    ],
    resolve: {
      dedupe: ['react', 'react-dom'],
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react/jsx-runtime'],
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
