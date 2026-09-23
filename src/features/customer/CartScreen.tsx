import React, { useState } from 'react';
import { useShopGenie } from '../../context/ShopGenieContext';
import { QuantityStepper, PriceText } from '../../components/common/Components';
import { 
  ShoppingBag, 
  Trash2, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  QrCode, 
  CreditCard, 
  Smartphone, 
  Banknote,
  ShieldCheck,
  ChevronRight,
  X
} from 'lucide-react';
import { Order, PaymentMethod } from '../../types';

export const CartScreen: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    createOrder,
    loyaltyCards,
    setCustomerTab,
    showSnackbar
  } = useShopGenie();

  const [useLoyaltyPoints, setUseLoyaltyPoints] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('upi');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Totals calculation
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discount = useLoyaltyPoints ? Math.min(100, Math.floor(subtotal * 0.15)) : 0;
  const tax = Math.round(subtotal * 0.05);
  const total = Math.max(0, subtotal - discount + tax);

  const primaryShop = cart[0]?.shop;
  const shopLoyaltyCard = loyaltyCards.find((c) => c.shopId === primaryShop?.id);
  const canUseLoyalty = (shopLoyaltyCard?.points || 0) >= 100;

  const handleProcessPayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      const newOrder = createOrder(selectedPayment, useLoyaltyPoints);
      setCompletedOrder(newOrder);
      setIsCheckingOut(false);
    }, 1200);
  };

  // If cart is empty and no modal open
  if (cart.length === 0 && !completedOrder) {
    return (
      <div className="pb-28 max-w-md mx-auto px-4 pt-16 text-center">
        <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h3 className="font-heading font-bold text-lg text-[#0F1F1C] dark:text-[#E8F0EE]">
          Your cart is empty
        </h3>
        <p className="text-xs text-[#5B6B67] dark:text-[#9DB0AB] mt-1.5 leading-relaxed max-w-xs mx-auto">
          Scan barcodes inside a nearby store or browse our curated catalogues to add items.
        </p>
        <div className="mt-6 flex flex-col gap-2.5 max-w-xs mx-auto">
          <button
            onClick={() => setCustomerTab('scan')}
            className="w-full py-3 rounded-2xl bg-[#0F766E] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all"
          >
            <QrCode className="w-4 h-4" />
            <span>Open Barcode Scanner</span>
          </button>
          <button
            onClick={() => setCustomerTab('home')}
            className="w-full py-3 rounded-2xl bg-white dark:bg-[#171D1B] border border-[#CBD5D2] dark:border-[#3A4642] text-xs font-semibold text-[#0F1F1C] dark:text-[#E8F0EE] hover:bg-slate-50 transition-colors"
          >
            Browse Nearby Stores
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-32 max-w-xl mx-auto px-4 pt-2">
      {/* 1. Shop Context Header */}
      {primaryShop && (
        <div className="mb-4 bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/40 rounded-2xl p-3 flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] font-bold text-[#0F766E] dark:text-[#5EEAD4] uppercase tracking-wider">
              Self-Checkout Cart
            </span>
            <h4 className="font-heading font-bold text-sm text-[#0F1F1C] dark:text-[#E8F0EE] truncate">
              {primaryShop.name}
            </h4>
          </div>
          <button
            onClick={clearCart}
            className="text-rose-500 hover:text-rose-600 font-semibold text-xs flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear
          </button>
        </div>
      )}

      {/* 2. Items List */}
      <div className="space-y-3 mb-6">
        {cart.map((item) => (
          <div
            key={item.product.id}
            className="bg-white dark:bg-[#171D1B] rounded-2xl p-3.5 border border-[#CBD5D2]/50 dark:border-[#3A4642]/60 shadow-2xs flex items-center justify-between gap-3"
          >
            <div className="flex-1 min-w-0">
              <h4 className="font-heading font-semibold text-xs sm:text-sm text-[#0F1F1C] dark:text-[#E8F0EE] truncate">
                {item.product.name}
              </h4>
              <p className="text-[11px] font-mono text-[#5B6B67] dark:text-[#9DB0AB] mt-0.5">
                Barcode: {item.product.barcode}
              </p>
              <div className="mt-1">
                <PriceText price={item.product.price} size="sm" />
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <QuantityStepper
                quantity={item.quantity}
                max={item.product.stock}
                onIncrease={() => updateCartQuantity(item.product.id, +1)}
                onDecrease={() => updateCartQuantity(item.product.id, -1)}
              />
              <button
                onClick={() => removeFromCart(item.product.id)}
                className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                aria-label="Remove item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Loyalty Points Toggle */}
      {canUseLoyalty && (
        <div className="mb-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-[#F59E0B] shrink-0" />
            <div>
              <h5 className="font-heading font-bold text-xs text-amber-900 dark:text-amber-200">
                Redeem 100 Genie Points
              </h5>
              <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80">
                Balance: {shopLoyaltyCard?.points} pts · Saves ₹100
              </p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={useLoyaltyPoints}
            onChange={(e) => setUseLoyaltyPoints(e.target.checked)}
            className="w-5 h-5 accent-[#0F766E] rounded cursor-pointer"
          />
        </div>
      )}

      {/* 4. Bill Summary Breakdown */}
      <div className="bg-white dark:bg-[#171D1B] rounded-3xl p-4 border border-[#CBD5D2]/50 dark:border-[#3A4642]/60 shadow-xs space-y-2.5 text-xs text-[#5B6B67] dark:text-[#9DB0AB] mb-6">
        <h4 className="font-heading font-bold text-sm text-[#0F1F1C] dark:text-[#E8F0EE] mb-1">
          Payment Breakdown
        </h4>

        <div className="flex items-center justify-between">
          <span>Items Subtotal</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">₹{subtotal}</span>
        </div>

        {useLoyaltyPoints && (
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
            <span>Genie Loyalty Discount</span>
            <span>- ₹{discount}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span>GST / Store Taxes (5%)</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">₹{tax}</span>
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between font-heading font-bold text-sm sm:text-base text-[#0F1F1C] dark:text-[#E8F0EE]">
          <span>Total Payable</span>
          <span className="text-[#0F766E] dark:text-[#5EEAD4]">₹{total}</span>
        </div>
      </div>

      {/* 5. Sticky Proceed to Checkout Action */}
      <div className="fixed bottom-16 left-0 right-0 z-30 p-4 bg-white/95 dark:bg-[#171D1B]/95 backdrop-blur-md border-t border-[#CBD5D2]/50 dark:border-[#3A4642]/60">
        <div className="max-w-md mx-auto flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] text-[#5B6B67] dark:text-[#9DB0AB] uppercase tracking-wider block font-medium">
              Total ({cart.reduce((a, b) => a + b.quantity, 0)} items)
            </span>
            <span className="font-heading font-extrabold text-lg text-[#0F1F1C] dark:text-[#E8F0EE]">
              ₹{total}
            </span>
          </div>

          <button
            onClick={() => setIsCheckingOut(true)}
            className="flex-1 h-12 rounded-2xl bg-[#0F766E] hover:bg-[#0c615b] text-white font-bold text-sm flex items-center justify-center gap-2 active:scale-95 shadow-md transition-all"
          >
            <span>Proceed to Pay</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 6. Checkout Sheet Modal */}
      {isCheckingOut && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#171D1B] rounded-t-3xl sm:rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in slide-in-from-bottom-6 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-heading font-bold text-base text-[#0F1F1C] dark:text-[#E8F0EE]">
                Choose Payment Method
              </h3>
              <button
                onClick={() => setIsCheckingOut(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Payment Method Options */}
            <div className="space-y-2.5">
              <label
                onClick={() => setSelectedPayment('upi')}
                className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  selectedPayment === 'upi'
                    ? 'border-[#0F766E] bg-teal-50/60 dark:bg-teal-950/30 text-[#0F766E]'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-[#0F766E]" />
                  <div>
                    <span className="font-heading font-semibold text-xs sm:text-sm block text-[#0F1F1C] dark:text-[#E8F0EE]">
                      Instant UPI (GPay / PhonePe / Paytm)
                    </span>
                    <span className="text-[11px] text-[#5B6B67] dark:text-[#9DB0AB]">
                      Zero fees, instant exit pass generated
                    </span>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={selectedPayment === 'upi'}
                  onChange={() => setSelectedPayment('upi')}
                  className="accent-[#0F766E]"
                />
              </label>

              <label
                onClick={() => setSelectedPayment('card')}
                className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  selectedPayment === 'card'
                    ? 'border-[#0F766E] bg-teal-50/60 dark:bg-teal-950/30 text-[#0F766E]'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-[#0F766E]" />
                  <div>
                    <span className="font-heading font-semibold text-xs sm:text-sm block text-[#0F1F1C] dark:text-[#E8F0EE]">
                      Credit / Debit Card / Tap & Pay
                    </span>
                    <span className="text-[11px] text-[#5B6B67] dark:text-[#9DB0AB]">
                      Visa, Mastercard, RuPay
                    </span>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={selectedPayment === 'card'}
                  onChange={() => setSelectedPayment('card')}
                  className="accent-[#0F766E]"
                />
              </label>

              <label
                onClick={() => setSelectedPayment('counter_cash')}
                className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  selectedPayment === 'counter_cash'
                    ? 'border-[#0F766E] bg-teal-50/60 dark:bg-teal-950/30 text-[#0F766E]'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Banknote className="w-5 h-5 text-[#0F766E]" />
                  <div>
                    <span className="font-heading font-semibold text-xs sm:text-sm block text-[#0F1F1C] dark:text-[#E8F0EE]">
                      Pay Cash at Exit Desk
                    </span>
                    <span className="text-[11px] text-[#5B6B67] dark:text-[#9DB0AB]">
                      Cash counter assistant will confirm bill
                    </span>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={selectedPayment === 'counter_cash'}
                  onChange={() => setSelectedPayment('counter_cash')}
                  className="accent-[#0F766E]"
                />
              </label>
            </div>

            <div className="pt-2">
              <button
                onClick={handleProcessPayment}
                disabled={isProcessingPayment}
                className="w-full h-12 rounded-2xl bg-[#0F766E] text-white font-bold text-sm flex items-center justify-center gap-2 active:scale-95 shadow-md disabled:opacity-50"
              >
                {isProcessingPayment ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing Payment ₹{total}...
                  </span>
                ) : (
                  <span>Authorize & Pay ₹{total}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Success Screen & Instant Exit Pass Modal */}
      {completedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#171D1B] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-4 animate-in zoom-in-95 duration-200">
            {/* Animated Tick Icon */}
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 animate-pulse" />
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                Payment Authorized
              </span>
              <h2 className="font-heading font-extrabold text-xl text-[#0F1F1C] dark:text-[#E8F0EE] mt-0.5">
                Self-Checkout Granted!
              </h2>
              <p className="text-xs text-[#5B6B67] dark:text-[#9DB0AB] mt-1">
                Order #{completedOrder.id} · {completedOrder.shopName}
              </p>
            </div>

            {/* The QR Exit Pass Box */}
            <div className="bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-[#0F766E] rounded-2xl p-4">
              <div className="w-36 h-36 mx-auto bg-white p-2 rounded-xl shadow-xs border border-slate-200 flex flex-col items-center justify-center">
                {/* Clean QR vector representation */}
                <QrCode className="w-28 h-28 text-slate-950" />
                <span className="text-[9px] font-mono font-bold text-slate-800 mt-1">
                  {completedOrder.exitPassQr}
                </span>
              </div>
              <p className="text-[11px] font-semibold text-[#0F766E] dark:text-[#5EEAD4] mt-2.5">
                Show this QR Pass to the assistant at the store gate
              </p>
            </div>

            {/* Total Paid & Items overview */}
            <div className="flex items-center justify-between text-xs px-2 text-[#5B6B67] dark:text-[#9DB0AB]">
              <span>Amount Paid:</span>
              <span className="font-bold text-sm text-[#0F1F1C] dark:text-[#E8F0EE]">
                ₹{completedOrder.total}
              </span>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setCompletedOrder(null);
                  setCustomerTab('home');
                }}
                className="w-full h-11 rounded-2xl bg-[#0F766E] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>Done & Return Home</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
