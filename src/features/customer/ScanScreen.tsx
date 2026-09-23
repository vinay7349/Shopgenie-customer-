import React, { useState, useEffect, useRef } from 'react';
import { useShopGenie } from '../../context/ShopGenieContext';
import { 
  Zap, 
  SwitchCamera, 
  QrCode, 
  Barcode, 
  Sparkles, 
  ShoppingBag, 
  Check, 
  X,
  AlertCircle,
  Store
} from 'lucide-react';
import { Product } from '../../types';

export const ScanScreen: React.FC = () => {
  const {
    products,
    shops,
    addToCart,
    activeSelfCheckoutShop,
    setActiveSelfCheckoutShop,
    setCustomerTab,
    showSnackbar,
    cart
  } = useShopGenie();

  const [scanMode, setScanMode] = useState<'product' | 'store'>('product');
  const [torchOn, setTorchOn] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(false);
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const [cameraActive, setCameraActive] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Attempt real webcam stream if available
  useEffect(() => {
    let stream: MediaStream | null = null;
    const startCam = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: isFrontCamera ? 'user' : 'environment' }
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        }
      } catch (err) {
        // Fallback gracefully to high-fidelity simulated viewfinder
        console.info('Webcam stream not accessible, using simulated viewfinder:', err);
      }
    };

    if (cameraActive) {
      startCam();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraActive, isFrontCamera]);

  // Handle barcode hit
  const handleBarcodeScanned = (barcode: string) => {
    if (scanMode === 'store') {
      const matchedShop = shops.find((s) => s.id === barcode || barcode.includes(s.id));
      if (matchedShop) {
        setActiveSelfCheckoutShop(matchedShop);
        setScanMode('product');
        showSnackbar({
          message: `Entered self-checkout for ${matchedShop.name}`,
          type: 'success'
        });
      } else {
        showSnackbar({ message: 'Store QR not recognized', type: 'error' });
      }
      return;
    }

    const found = products.find((p) => p.barcode === barcode);
    if (found) {
      setScannedProduct(found);
    } else {
      showSnackbar({ message: `No item found for barcode ${barcode}`, type: 'warning' });
    }
  };

  const handleConfirmAddToCart = () => {
    if (scannedProduct) {
      const parentShop = activeSelfCheckoutShop || shops.find((s) => s.id === scannedProduct.shopId);
      addToCart(scannedProduct, parentShop);
      setScannedProduct(null);
    }
  };

  // Sample items for instant 1-tap testing
  const sampleTestItems = [
    { label: 'Arabica Coffee', barcode: '890100100101' },
    { label: 'Butter Croissant', barcode: '890100100102' },
    { label: 'Organic Spinach', barcode: '890100200201' },
    { label: 'Hass Avocados', barcode: '890100200202' },
    { label: '67W GaN Charger', barcode: '890100300303' },
    { label: 'Store: Old Coffee', barcode: 'shop-1' }
  ];

  return (
    <div className="relative h-[calc(100vh-140px)] min-h-[520px] max-w-lg mx-auto bg-black text-white flex flex-col justify-between overflow-hidden rounded-3xl mx-2 sm:mx-auto mt-2 border border-white/10 shadow-2xl">
      {/* Real Video or Cyber Matrix Background Viewfinder */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-slate-950">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover opacity-60"
        />

        {/* Ambient Dark Overlay with grid texture */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, transparent 40%, rgba(0,0,0,0.85) 90%), linear-gradient(rgba(15, 118, 110, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 118, 110, 0.1) 1px, transparent 1px)`,
            backgroundSize: '100% 100%, 30px 30px, 30px 30px'
          }}
        />

        {/* Laser Scanning Animation Beam */}
        <div className="absolute inset-x-8 top-1/4 h-0.5 bg-gradient-to-r from-transparent via-[#5EEAD4] to-transparent shadow-[0_0_15px_#5EEAD4] animate-[bounce_2.5s_infinite]" />
      </div>

      {/* 1. Top Controls Bar */}
      <div className="relative z-10 p-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
        {/* Mode Selector Pill */}
        <div className="flex rounded-full bg-black/60 p-1 border border-white/20 backdrop-blur-md">
          <button
            onClick={() => setScanMode('product')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              scanMode === 'product'
                ? 'bg-[#0F766E] text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Barcode className="w-3.5 h-3.5" />
            Product
          </button>
          <button
            onClick={() => setScanMode('store')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              scanMode === 'store'
                ? 'bg-[#F59E0B] text-slate-950 shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            Store QR
          </button>
        </div>

        {/* Torch & Flip */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setTorchOn(!torchOn);
              showSnackbar({ message: torchOn ? 'Torch turned off' : 'Torch turned on', type: 'info' });
            }}
            className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${
              torchOn ? 'bg-amber-400 text-black shadow-md' : 'bg-black/50 text-white hover:bg-black/70'
            }`}
            aria-label="Toggle Torch"
          >
            <Zap className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsFrontCamera(!isFrontCamera)}
            className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md transition-colors"
            aria-label="Switch Camera"
          >
            <SwitchCamera className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Active Self-Checkout Store Session Indicator */}
      {activeSelfCheckoutShop && (
        <div className="relative z-10 mx-4 -mt-2 p-2.5 rounded-2xl bg-teal-950/80 border border-teal-500/40 backdrop-blur-md flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-teal-200 truncate">
              {activeSelfCheckoutShop.name}
            </span>
          </div>
          <button
            onClick={() => setActiveSelfCheckoutShop(null)}
            className="text-[11px] text-teal-400 hover:underline"
          >
            Exit store
          </button>
        </div>
      )}

      {/* 2. Target Reticle Frame */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6">
        <div className="relative w-64 h-64 rounded-3xl border-2 border-white/30 flex items-center justify-center">
          {/* Target Corners */}
          <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-[#5EEAD4] rounded-tl-xl" />
          <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-[#5EEAD4] rounded-tr-xl" />
          <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-[#5EEAD4] rounded-bl-xl" />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-[#5EEAD4] rounded-br-xl" />

          {/* Central Target Crosshair */}
          <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#5EEAD4]" />
          </div>
        </div>

        <p className="text-xs text-slate-300 font-medium tracking-wide mt-4 text-center bg-black/60 px-4 py-1.5 rounded-full backdrop-blur-md">
          {scanMode === 'product'
            ? 'Align barcode inside frame to add to cart'
            : 'Point at store counter QR to enter self-checkout'}
        </p>
      </div>

      {/* 3. Bottom Simulator Bar & Quick Test Chips */}
      <div className="relative z-10 p-4 bg-gradient-to-t from-black via-black/90 to-transparent space-y-3">
        {/* Quick Test Barcodes */}
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1 mb-1.5">
            <Sparkles className="w-3 h-3 text-[#F59E0B]" /> Quick Tester Chips (Click to simulate scan)
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {sampleTestItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleBarcodeScanned(item.barcode)}
                className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-[11px] font-medium text-slate-200 whitespace-nowrap active:scale-95 transition-all"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scanned Item Confirmation Sheet */}
        {scannedProduct && (
          <div className="bg-slate-900 border border-teal-500/50 rounded-2xl p-4 shadow-xl animate-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">
                  Barcode Scanned: {scannedProduct.barcode}
                </span>
                <h4 className="font-heading font-bold text-sm text-white truncate mt-0.5">
                  {scannedProduct.name}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-bold text-sm text-white">₹{scannedProduct.price}</span>
                  {scannedProduct.mrp > scannedProduct.price && (
                    <span className="text-xs text-slate-400 line-through">
                      ₹{scannedProduct.mrp}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => setScannedProduct(null)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
                aria-label="Dismiss scan"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={() => setScannedProduct(null)}
                className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAddToCart}
                className="flex-1 py-2 rounded-xl bg-[#0F766E] hover:bg-[#0c615b] text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                Add to Cart
              </button>
            </div>
          </div>
        )}

        {/* View Cart shortcut */}
        {cart.length > 0 && (
          <button
            onClick={() => setCustomerTab('cart')}
            className="w-full py-3 rounded-2xl bg-teal-500/20 border border-teal-500/40 text-teal-200 text-xs font-bold flex items-center justify-center gap-2 hover:bg-teal-500/30 transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>View Cart ({cart.reduce((a, b) => a + b.quantity, 0)} items)</span>
          </button>
        )}
      </div>
    </div>
  );
};
