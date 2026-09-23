import React, { useState } from 'react';
import { useShopGenie } from '../../context/ShopGenieContext';
import { Heart, Share2, Tag, MapPin, Store, MessageSquarePlus } from 'lucide-react';

export const LocalFeedScreen: React.FC = () => {
  const {
    feedPosts,
    toggleLikePost,
    setSelectedShopId,
    followedShopIds,
    currentArea,
    showSnackbar,
    currentUser
  } = useShopGenie();

  const [feedFilter, setFeedFilter] = useState<'all' | 'following'>('all');

  const displayedPosts = feedFilter === 'all'
    ? feedPosts
    : feedPosts.filter((p) => followedShopIds.includes(p.shopId));

  const handleSharePost = (postText: string, shopName: string) => {
    navigator.clipboard?.writeText?.(`${shopName}: "${postText}" via ShopGenie`);
    showSnackbar({ message: 'Update link copied to clipboard', type: 'info' });
  };

  return (
    <div className="pb-28 max-w-xl mx-auto px-4 pt-2">
      {/* 1. Header & Area */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="font-heading font-extrabold text-lg text-[#0F1F1C] dark:text-[#E8F0EE]">
            Neighbourhood Feed
          </h2>
          <p className="text-xs text-[#5B6B67] dark:text-[#9DB0AB] flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[#0F766E]" />
            <span>Live updates around {currentArea.split(',')[0]}</span>
          </p>
        </div>

        {/* Filter Pill */}
        <div className="flex rounded-full bg-white dark:bg-[#171D1B] p-0.5 border border-[#CBD5D2]/50 dark:border-[#3A4642] text-xs">
          <button
            onClick={() => setFeedFilter('all')}
            className={`px-3 py-1 rounded-full font-medium transition-all ${
              feedFilter === 'all'
                ? 'bg-[#0F766E] text-white shadow-2xs'
                : 'text-[#5B6B67] dark:text-[#9DB0AB]'
            }`}
          >
            Nearby
          </button>
          <button
            onClick={() => setFeedFilter('following')}
            className={`px-3 py-1 rounded-full font-medium transition-all ${
              feedFilter === 'following'
                ? 'bg-[#0F766E] text-white shadow-2xs'
                : 'text-[#5B6B67] dark:text-[#9DB0AB]'
            }`}
          >
            Following
          </button>
        </div>
      </div>

      {/* 2. Posts List */}
      <div className="space-y-4">
        {displayedPosts.map((post) => (
          <article
            key={post.id}
            className="bg-white dark:bg-[#171D1B] rounded-3xl p-4 border border-[#CBD5D2]/50 dark:border-[#3A4642]/60 shadow-2xs hover:shadow-xs transition-shadow"
          >
            {/* Author / Store Header */}
            <div className="flex items-center justify-between gap-3 mb-3">
              <button
                onClick={() => setSelectedShopId(post.shopId)}
                className="flex items-center gap-2.5 text-left group"
              >
                <div className="w-10 h-10 rounded-2xl bg-teal-500/15 text-teal-800 dark:text-teal-200 font-bold flex items-center justify-center shrink-0 border border-teal-500/20 group-hover:scale-105 transition-transform">
                  <Store className="w-5 h-5 text-[#0F766E] dark:text-[#5EEAD4]" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-xs sm:text-sm text-[#0F1F1C] dark:text-[#E8F0EE] group-hover:text-[#0F766E] transition-colors truncate">
                    {post.shopName}
                  </h4>
                  <p className="text-[11px] text-[#5B6B67] dark:text-[#9DB0AB]">
                    {post.area} · {post.timeAgo}
                  </p>
                </div>
              </button>

              {post.offerTag && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1 shrink-0">
                  <Tag className="w-2.5 h-2.5" />
                  {post.offerTag}
                </span>
              )}
            </div>

            {/* Post Content */}
            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
              {post.text}
            </p>

            {/* Card Action Row */}
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-[#5B6B67] dark:text-[#9DB0AB]">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleLikePost(post.id)}
                  className={`flex items-center gap-1.5 transition-colors ${
                    post.isLiked ? 'text-rose-500 font-bold' : 'hover:text-rose-500'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                  <span>{post.likes}</span>
                </button>

                <button
                  onClick={() => handleSharePost(post.text, post.shopName)}
                  className="flex items-center gap-1.5 hover:text-[#0F766E] transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>

              <button
                onClick={() => setSelectedShopId(post.shopId)}
                className="text-[11px] font-semibold text-[#0F766E] dark:text-[#5EEAD4] hover:underline"
              >
                Visit Shop
              </button>
            </div>
          </article>
        ))}

        {displayedPosts.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-[#171D1B] rounded-3xl border border-[#CBD5D2]/50 dark:border-[#3A4642]/60 p-6">
            <MessageSquarePlus className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="font-heading font-bold text-sm text-[#0F1F1C] dark:text-[#E8F0EE]">
              No updates in this tab
            </h4>
            <p className="text-xs text-[#5B6B67] dark:text-[#9DB0AB] mt-1 max-w-xs mx-auto">
              Follow your favourite neighbourhood shops to see their live offers and new drops right here!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
