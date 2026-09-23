import React, { useState } from 'react';
import { useShopGenie } from '../../context/ShopGenieContext';
import { X, Award, Sparkles, Barcode, ChevronRight, Gift, Check, Clock } from 'lucide-react';
import { LoyaltyCard } from '../../types';

export const LoyaltyWalletModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const { loyaltyCards, redeemLoyaltyReward } = useShopGenie();
  const [selectedCardId, setSelectedCardId] = useState<string>(loyaltyCards[0]?.shopId || '');

  if (!isOpen) return null;

  const currentCard = loyaltyCards.find((c) => c.shopId === selectedCardId) || loyaltyCards[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white dark:bg-[#171D1B] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm text-[#0F1F1C] dark:text-[#E8F0EE]">
                Loyalty & Rewards Wallet
              </h3>
              <p className="text-[11px] text-[#5B6B67] dark:text-[#9DB0AB]">
                Collect points at your neighbourhood stores
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center hover:text-slate-800 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Store Card Picker Tabs */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900/50 flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-slate-100 dark:border-slate-800">
          {loyaltyCards.map((card) => (
            <button
              key={card.shopId}
              onClick={() => setSelectedCardId(card.shopId)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                card.shopId === currentCard.shopId
                  ? 'bg-[#0F766E] text-white shadow-xs'
                  : 'bg-white dark:bg-[#171D1B] text-[#5B6B67] dark:text-[#9DB0AB] border border-slate-200 dark:border-slate-700'
              }`}
            >
              <span>{card.shopName}</span>
              <span className="font-mono text-[10px] opacity-80">({card.points} pts)</span>
            </button>
          ))}
        </div>

        {/* Selected Card View */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Digital Membership Pass Card */}
          <div className="relative rounded-3xl p-5 text-white shadow-lg overflow-hidden bg-gradient-to-tr from-slate-950 via-teal-950 to-[#0F766E] border border-teal-500/30">
            {/* Sparkle Watermark */}
            <Sparkles className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 text-white pointer-events-none" />

            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-300 bg-white/10 px-2.5 py-0.5 rounded-full backdrop-blur-md">
                {currentCard.tier} Member
              </span>
              <span className="text-xs font-medium text-slate-300">ShopGenie Pass</span>
            </div>

            <h4 className="font-heading font-extrabold text-lg tracking-tight">
              {currentCard.shopName}
            </h4>

            {/* Points & Progress */}
            <div className="my-4">
              <div className="flex items-baseline justify-between mb-1.5">
                <span className="text-xs text-teal-200">Current Balance</span>
                <span className="font-mono font-extrabold text-2xl text-amber-300">
                  {currentCard.points} <span className="text-xs text-white font-normal">pts</span>
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-200 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (currentCard.points / currentCard.nextRewardAt) * 100)}%`
                  }}
                />
              </div>
              <span className="text-[10px] text-teal-200/80 mt-1 block">
                {Math.max(0, currentCard.nextRewardAt - currentCard.points)} points to next tier
              </span>
            </div>

            {/* Barcode Pass */}
            <div className="mt-4 pt-3 border-t border-white/15 bg-black/40 -mx-5 -mb-5 px-5 py-3 flex items-center justify-between">
              <div>
                <span className="text-[9px] text-slate-400 block uppercase">In-Store Counter Code</span>
                <span className="font-mono text-xs font-bold text-slate-200">
                  {currentCard.barcode}
                </span>
              </div>
              <Barcode className="w-12 h-6 text-slate-200" />
            </div>
          </div>

          {/* Available Rewards Redeem Section */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-[#5B6B67] dark:text-[#9DB0AB] flex items-center gap-1.5">
              <Gift className="w-3.5 h-3.5 text-[#0F766E]" />
              Redeemable Rewards
            </h4>

            <div className="space-y-2">
              {currentCard.availableRewards.map((reward) => {
                const canRedeem = currentCard.points >= reward.pointsRequired;
                return (
                  <div
                    key={reward.id}
                    className="p-3.5 rounded-2xl bg-white dark:bg-[#171D1B] border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div>
                      <h5 className="font-heading font-semibold text-xs text-[#0F1F1C] dark:text-[#E8F0EE]">
                        {reward.title}
                      </h5>
                      <p className="text-[11px] text-[#5B6B67] dark:text-[#9DB0AB] mt-0.5">
                        {reward.description}
                      </p>
                      <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 mt-1 inline-block">
                        Costs {reward.pointsRequired} pts
                      </span>
                    </div>

                    <button
                      onClick={() => redeemLoyaltyReward(currentCard.shopId, reward.id)}
                      disabled={!canRedeem}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all disabled:opacity-40 shrink-0 bg-[#0F766E] text-white hover:bg-[#0c615b] active:scale-95 shadow-2xs"
                    >
                      {canRedeem ? 'Redeem' : 'Locked'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Points History */}
          <div className="space-y-2 pt-2">
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-[#5B6B67] dark:text-[#9DB0AB] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#0F766E]" />
              Recent Points Activity
            </h4>
            <div className="space-y-1.5">
              {currentCard.history.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 dark:border-slate-800"
                >
                  <div>
                    <span className="font-medium text-slate-800 dark:text-slate-200 block">
                      {item.description}
                    </span>
                    <span className="text-[10px] text-[#5B6B67] dark:text-[#9DB0AB]">{item.date}</span>
                  </div>
                  <span
                    className={`font-mono font-bold ${
                      item.type === 'earned'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-rose-500'
                    }`}
                  >
                    {item.points > 0 ? `+${item.points}` : item.points} pts
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
