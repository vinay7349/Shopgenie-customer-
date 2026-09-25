import React, { useState, useEffect } from 'react';
import { useShopGenie } from '../../context/ShopGenieContext';
import { djangoApi, DjangoHealthStatus } from '../../services/djangoApi';
import { 
  Server, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Copy, 
  Check, 
  X, 
  Terminal, 
  Layers, 
  Database, 
  ExternalLink,
  Code2,
  Cpu
} from 'lucide-react';

interface DjangoBackendModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DjangoBackendModal: React.FC<DjangoBackendModalProps> = ({ isOpen, onClose }) => {
  const { showSnackbar } = useShopGenie();
  const [health, setHealth] = useState<DjangoHealthStatus>({
    online: false,
    message: 'Checking status...',
    url: djangoApi.getBaseUrl()
  });
  const [isChecking, setIsChecking] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'models' | 'postgres' | 'endpoints' | 'run'>('overview');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const checkStatus = async () => {
    setIsChecking(true);
    try {
      const res = await djangoApi.checkHealth();
      setHealth(res);
    } catch {
      setHealth({
        online: false,
        message: 'Could not connect to Django backend',
        url: djangoApi.getBaseUrl()
      });
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      checkStatus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    showSnackbar({ message: 'Copied to clipboard!', type: 'success' });
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const ENDPOINTS = [
    { method: 'GET', path: '/api/users/', desc: 'Shopper and merchant accounts, roles & wallet balance' },
    { method: 'GET', path: '/api/shops/', desc: 'List all shops with category, area, & search filters' },
    { method: 'GET', path: '/api/shops/{id}/products/', desc: 'Retrieve catalog of products specific to a shop' },
    { method: 'GET', path: '/api/products/lookup_barcode/?barcode=...', desc: 'Instant barcode scan match for self-checkout' },
    { method: 'GET', path: '/api/offers/', desc: 'List active flash deals and discount promo codes' },
    { method: 'POST', path: '/api/orders/', desc: 'Submit completed self-checkout order with receipt & pass' },
    { method: 'POST', path: '/api/orders/{id}/verify_exit_pass/', desc: 'Store cashier verification of customer QR exit pass' },
    { method: 'GET', path: '/api/transactions/', desc: 'Financial transactions ledger & UPI settlements' },
    { method: 'GET', path: '/api/loyalty/', desc: 'Customer loyalty points, tier perks & rewards history' },
    { method: 'GET', path: '/api/feed/', desc: 'Hyper-local community and merchant updates' },
    { method: 'GET', path: '/admin/', desc: 'Django Admin Portal for store inventory and order management' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl max-h-[90vh] bg-slate-950 text-slate-100 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">
                  ShopGenie Django REST Backend
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold">
                  Django 5.x & DRF
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Python REST API service located in <code className="text-emerald-400 font-mono">backend_django/</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={checkStatus}
              disabled={isChecking}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
              <span>Ping API</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Status Strip */}
        <div className={`px-5 py-3 border-b flex items-center justify-between text-xs ${
          health.online 
            ? 'bg-emerald-950/40 border-emerald-800/40 text-emerald-300' 
            : 'bg-amber-950/30 border-amber-800/40 text-amber-300'
        }`}>
          <div className="flex items-center gap-2">
            {health.online ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 text-amber-400 shrink-0" />
            )}
            <span>
              <strong>Status:</strong> {health.online ? 'Online & Connected' : 'Local / Standalone Mode (API server not running on port 8000)'}
            </span>
          </div>
          <span className="font-mono text-[11px] opacity-80">
            Target URL: {health.url}
          </span>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 pt-3 bg-slate-900/60 border-b border-slate-800 flex gap-2 overflow-x-auto">
          {(['overview', 'models', 'postgres', 'endpoints', 'run'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2.5 px-3 text-xs font-bold capitalize transition-colors relative shrink-0 ${
                activeTab === tab 
                  ? 'text-emerald-400 border-b-2 border-emerald-400' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab === 'run' ? 'How to Run (Docker / Python)' : tab === 'postgres' ? 'PostgreSQL Setup' : tab === 'models' ? 'PostgreSQL Models' : tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {activeTab === 'overview' && (
            <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                    <Database className="w-4 h-4" /> Relational Architecture
                  </div>
                  <div className="text-xl font-bold text-white mt-1">SQLite & Postgres</div>
                  <div className="text-xs text-slate-400">ORM models for shops, inventory, offers, and receipts</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
                    <Layers className="w-4 h-4" /> Django REST Framework
                  </div>
                  <div className="text-xl font-bold text-white mt-1">REST API & CORS</div>
                  <div className="text-xs text-slate-400">Pre-configured with django-cors-headers and JSON serializers</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider">
                    <Cpu className="w-4 h-4" /> Self-Checkout Engine
                  </div>
                  <div className="text-xl font-bold text-white mt-1">Barcode Lookup</div>
                  <div className="text-xs text-slate-400">Instant barcode indexing & exit-pass verification actions</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <h4 className="font-bold text-white text-sm">Where the Django backend files live</h4>
                <p className="text-xs text-slate-400">
                  All Django code is located inside the <code className="text-emerald-300 font-mono">/backend_django</code> directory of this repository:
                </p>
                <div className="font-mono text-xs bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-300 space-y-1">
                  <div>📁 backend_django/</div>
                  <div className="pl-4">├── 📄 manage.py &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-slate-500"># Django CLI entry point</span></div>
                  <div className="pl-4">├── 📄 requirements.txt &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-slate-500"># Django, DRF, django-cors-headers</span></div>
                  <div className="pl-4">├── 📄 docker-compose.yml &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-slate-500"># One-command Dockerized deployment</span></div>
                  <div className="pl-4">├── 📄 Dockerfile &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-slate-500"># Production container definition</span></div>
                  <div className="pl-4">├── 📄 run_django.sh &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-slate-500"># Automated virtualenv + migration script</span></div>
                  <div className="pl-4">├── 📁 shopgenie_backend/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-slate-500"># settings.py, urls.py, wsgi.py</span></div>
                  <div className="pl-4">└── 📁 api/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-slate-500"># models.py, serializers.py, views.py, urls.py, seed_data.py</span></div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'endpoints' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-400">
                The Django REST API exposes the following endpoints with automatic JSON serialization and CORS support:
              </div>
              <div className="space-y-2">
                {ENDPOINTS.map((ep, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`px-2 py-0.5 rounded-md font-mono font-bold text-[10px] ${
                        ep.method === 'GET' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {ep.method}
                      </span>
                      <span className="font-mono text-slate-200 font-semibold truncate">{ep.path}</span>
                    </div>
                    <span className="text-slate-400 text-right shrink-0 max-w-[40%] truncate hidden sm:inline">
                      {ep.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'models' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-400">
                  Core models defined in <code className="text-emerald-300 font-mono">backend_django/api/models.py</code> (PostgreSQL JSONB, NUMERIC & B-Tree indexed):
                </div>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold">
                  PostgreSQL & SQLite Compatible
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* User Model */}
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                  <div className="font-bold text-white flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      1. User Model
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">api_users</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Shoppers, store merchants, cashiers, & admins. Includes wallet_balance (<code className="text-slate-300">NUMERIC</code>), indexed email/phone, and PostgreSQL JSONB preferences.
                  </p>
                </div>

                {/* Shop Model */}
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                  <div className="font-bold text-white flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-400" />
                      2. Shop Model
                    </span>
                    <span className="text-[10px] font-mono text-blue-400">api_shops</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Hyperlocal retail store metadata, owner FK, geocoordinates (<code className="text-slate-300">lat/lng</code>), hours, self-checkout capability, and JSONB payment methods.
                  </p>
                </div>

                {/* Product Model */}
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                  <div className="font-bold text-white flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      3. Product Model
                    </span>
                    <span className="text-[10px] font-mono text-amber-400">api_products</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Indexed barcode (<code className="text-slate-300">db_index=True</code>) for instant self-checkout camera scanning, NUMERIC selling price/MRP, stock, and JSONB image arrays.
                  </p>
                </div>

                {/* LoyaltyPoints Model */}
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                  <div className="font-bold text-white flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-purple-400" />
                      4. LoyaltyPoints Model
                    </span>
                    <span className="text-[10px] font-mono text-purple-400">api_loyalty</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Customer loyalty pass per shop, tier progression (Bronze/Silver/Gold/Diamond), points balance, JSONB reward vouchers, and points audit log.
                  </p>
                </div>

                {/* Transaction Model */}
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                  <div className="font-bold text-white flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-400" />
                      5. Transaction Model
                    </span>
                    <span className="text-[10px] font-mono text-rose-400">api_transactions</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Immutable financial ledger for purchases, refunds, and top-ups with high-precision <code className="text-slate-300">NUMERIC(12,2)</code> amounts and payment gateway metadata.
                  </p>
                </div>

                {/* Order & OrderItem */}
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                  <div className="font-bold text-white flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-teal-400" />
                      Order & Exit Pass
                    </span>
                    <span className="text-[10px] font-mono text-teal-400">api_orders</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Scanned cart line items, cryptographic exit pass QR string, cashier verification flags, and UPI payment reconciliation.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'postgres' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-sm text-white flex items-center gap-2">
                    <Database className="w-4 h-4 text-blue-400" />
                    Connecting Django to PostgreSQL
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold">
                    Zero-Code Configuration
                  </span>
                </div>
                <p className="text-slate-300 text-xs">
                  <code className="text-emerald-300 font-mono">settings.py</code> is pre-wired to auto-detect PostgreSQL via <code className="text-slate-200">DATABASE_URL</code> or standard PostgreSQL environment variables:
                </p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between font-semibold text-slate-200 text-xs">
                    <span>Option A: Connection String URL</span>
                    <button
                      onClick={() => copyToClipboard('DATABASE_URL=postgresql://postgres:password@localhost:5432/shopgenie_db', 'db_url')}
                      className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1"
                    >
                      {copiedKey === 'db_url' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>Copy</span>
                    </button>
                  </div>
                  <div className="font-mono bg-slate-950 p-3 rounded-xl border border-slate-800 text-blue-300 text-[11px]">
                    export DATABASE_URL="postgresql://postgres:password@localhost:5432/shopgenie_db"
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between font-semibold text-slate-200 text-xs">
                    <span>Option B: Standard PostgreSQL Env Variables</span>
                  </div>
                  <div className="font-mono bg-slate-950 p-3 rounded-xl border border-slate-800 text-emerald-300 text-[11px] space-y-1">
                    <div>export POSTGRES_DB=shopgenie_db</div>
                    <div>export POSTGRES_USER=postgres</div>
                    <div>export POSTGRES_PASSWORD=your_secure_password</div>
                    <div>export POSTGRES_HOST=localhost</div>
                    <div>export POSTGRES_PORT=5432</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800/40 text-blue-300 text-[11px] space-y-1">
                  <div className="font-bold">✨ PostgreSQL Native Features Enabled:</div>
                  <ul className="list-disc pl-4 space-y-0.5 text-blue-200">
                    <li><strong className="text-white">JSONB Fields:</strong> Used for user preferences, payment method lists, reward catalogues, and gateway metadata.</li>
                    <li><strong className="text-white">NUMERIC(10,2) / NUMERIC(12,2):</strong> Eliminates floating point rounding issues on customer carts and wallet balances.</li>
                    <li><strong className="text-white">B-Tree Indexes:</strong> Fast sub-millisecond barcode lookups and customer phone number searches.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'run' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-sm text-white flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    Option 1: Quickstart via Python Bash Script
                  </div>
                  <button
                    onClick={() => copyToClipboard('cd backend_django && ./run_django.sh', 'opt1')}
                    className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 text-[11px]"
                  >
                    {copiedKey === 'opt1' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>Copy</span>
                  </button>
                </div>
                <div className="font-mono bg-slate-950 p-3 rounded-xl border border-slate-800 text-emerald-300">
                  cd backend_django<br />
                  chmod +x run_django.sh<br />
                  ./run_django.sh
                </div>
                <p className="text-slate-400 text-[11px]">
                  This automatically creates a virtual environment, installs dependencies from <code className="text-slate-200">requirements.txt</code>, runs database migrations, seeds retail catalog data, and starts the development server on port 8000.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-sm text-white flex items-center gap-2">
                    <Database className="w-4 h-4 text-blue-400" />
                    Option 2: Run with Docker Compose
                  </div>
                  <button
                    onClick={() => copyToClipboard('cd backend_django && docker-compose up --build', 'opt2')}
                    className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 text-[11px]"
                  >
                    {copiedKey === 'opt2' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>Copy</span>
                  </button>
                </div>
                <div className="font-mono bg-slate-950 p-3 rounded-xl border border-slate-800 text-blue-300">
                  cd backend_django<br />
                  docker-compose up --build
                </div>
                <p className="text-slate-400 text-[11px]">
                  Launches a containerized Django service with port 8000 mapped, database migrated, and catalog pre-seeded.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div>
            API Base: <code className="text-emerald-400 font-mono">{djangoApi.getBaseUrl()}</code>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
