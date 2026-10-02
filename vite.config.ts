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

let userState = {
  id: 'usr-8921',
  name: 'Vinay Kharvik',
  phone: '+91 98450 12345',
  email: 'vinaykharvik09@gmail.com',
  role: 'customer',
  roles: ['customer', 'verifier'],
  avatarUrl: '',
  savedArea: 'Koramangala 4th Block, Bengaluru',
  memberSince: 'October 2024',
  employeeId: 'VER-8821',
  department: 'Loss Prevention & Security Operations',
  savedProductIds: ['prod-1', 'prod-2', 'p1'],
  addresses: [
    { id: 'addr-1', label: 'Home', address: 'Flat 402, Green Glen Layout, Koramangala 4th Block, Bengaluru', landmark: 'Near Sony World Signal', isDefault: true },
    { id: 'addr-2', label: 'Work', address: 'Prestige Tech Park, Marathahalli-Sarjapur Ring Rd, Bengaluru', landmark: 'Building 2B', isDefault: false }
  ],
  paymentMethods: [
    { id: 'pay-1', type: 'upi', title: 'Google Pay (UPI)', subtitle: 'vinaykharvik@okhdfcbank', isDefault: true },
    { id: 'pay-2', type: 'card', title: 'HDFC Millennia Credit Card', subtitle: '•••• •••• •••• 4092 (Expires 08/28)', isDefault: false },
    { id: 'pay-3', type: 'wallet', title: 'ShopGenie Cash Wallet', subtitle: '₹250.00 Cashback Balance', isDefault: false }
  ],
  notificationsConfig: {
    pushEnabled: true,
    orderUpdates: true,
    storeOffers: true,
    localEvents: false
  }
};

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

      // User endpoints
      if (cleanUrl === '/api/users/me') {
        res.end(JSON.stringify({
          user: userState,
          status: 'authenticated'
        }));
        return;
      }

      if (cleanUrl === '/api/users/update_profile') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
          try {
            const data = JSON.parse(body || '{}');
            userState = { ...userState, ...data };
            res.end(JSON.stringify({ success: true, user: userState }));
          } catch {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Invalid JSON' }));
          }
        });
        return;
      }

      if (cleanUrl === '/api/users/switch_role') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
          try {
            const data = JSON.parse(body || '{}');
            if (data.role) {
              userState.role = data.role;
              if (!userState.roles.includes(data.role)) {
                userState.roles.push(data.role);
              }
            }
            res.end(JSON.stringify({ success: true, user: userState }));
          } catch {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Invalid JSON' }));
          }
        });
        return;
      }

      if (cleanUrl === '/api/users/become_shop_owner') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
          try {
            const data = JSON.parse(body || '{}');
            if (!userState.roles.includes('owner')) {
              userState.roles.push('owner');
            }
            res.end(JSON.stringify({ 
              success: true, 
              message: 'Shop registration submitted successfully. Shop Owner role authorized.',
              user: userState 
            }));
          } catch {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Invalid JSON' }));
          }
        });
        return;
      }

      if (cleanUrl === '/api/users/saved_products/toggle') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
          try {
            const { productId } = JSON.parse(body || '{}');
            if (productId) {
              if (userState.savedProductIds.includes(productId)) {
                userState.savedProductIds = userState.savedProductIds.filter(id => id !== productId);
              } else {
                userState.savedProductIds.push(productId);
              }
            }
            res.end(JSON.stringify({ success: true, savedProductIds: userState.savedProductIds }));
          } catch {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Invalid JSON' }));
          }
        });
        return;
      }

      if (cleanUrl === '/api/users/delete_account') {
        res.end(JSON.stringify({ success: true, message: 'Account data purged' }));
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
