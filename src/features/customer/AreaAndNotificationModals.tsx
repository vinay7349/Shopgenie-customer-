import React from 'react';
import { useShopGenie } from '../../context/ShopGenieContext';
import { X, MapPin, Check, Compass, Bell, Tag, Sparkles, CheckCircle2 } from 'lucide-react';

// 1. Area Picker Modal
export const AreaPickerModal: React.FC = () => {
  const {
    isAreaPickerOpen,
    setIsAreaPickerOpen,
    currentArea,
    setCurrentArea,
    availableAreas,
    showSnackbar
  } = useShopGenie();

  if (!isAreaPickerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-sm bg-white dark:bg-[#171D1B] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#0F766E]" />
            <h3 className="font-heading font-bold text-sm text-[#0F1F1C] dark:text-[#E8F0EE]">
              Select Neighbourhood
            </h3>
          </div>
          <button
            onClick={() => setIsAreaPickerOpen(false)}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 space-y-1.5 max-h-80 overflow-y-auto">
          {availableAreas.map((area) => {
            const isSelected = area === currentArea;
            return (
              <button
                key={area}
                onClick={() => {
                  setCurrentArea(area);
                  setIsAreaPickerOpen(false);
                  showSnackbar({
                    message: `Discovery location updated to ${area.split(',')[0]}`,
                    type: 'info'
                  });
                }}
                className={`w-full p-3 rounded-2xl text-left flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'bg-teal-50 dark:bg-teal-950/40 text-[#0F766E] dark:text-[#5EEAD4] font-semibold border border-teal-200 dark:border-teal-800/40'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MapPin className={`w-4 h-4 ${isSelected ? 'text-[#0F766E]' : 'text-slate-400'}`} />
                  <span className="text-xs">{area}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-[#0F766E]" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// 2. Notifications Drawer
export const NotificationsDrawer: React.FC = () => {
  const {
    isNotificationsOpen,
    setIsNotificationsOpen,
    notifications,
    markAllNotificationsRead,
    unreadNotificationsCount
  } = useShopGenie();

  if (!isNotificationsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-sm h-full bg-white dark:bg-[#171D1B] shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#0F766E]" />
            <h3 className="font-heading font-bold text-sm text-[#0F1F1C] dark:text-[#E8F0EE]">
              Notifications ({unreadNotificationsCount})
            </h3>
          </div>
          <button
            onClick={() => setIsNotificationsOpen(false)}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {unreadNotificationsCount > 0 && (
          <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              onClick={markAllNotificationsRead}
              className="text-[11px] font-semibold text-[#0F766E] dark:text-[#5EEAD4] hover:underline"
            >
              Mark all as read
            </button>
          </div>
        )}

        <div className="p-3 overflow-y-auto flex-1 space-y-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-3.5 rounded-2xl border transition-all text-xs ${
                n.read
                  ? 'bg-slate-50/60 dark:bg-slate-900/30 border-slate-100 dark:border-slate-800 text-[#5B6B67] dark:text-[#9DB0AB]'
                  : 'bg-teal-50/40 dark:bg-teal-950/20 border-teal-200 dark:border-teal-800/40 text-slate-800 dark:text-slate-100 shadow-2xs'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="font-heading font-bold text-xs truncate">
                  {n.title}
                </span>
                <span className="text-[10px] text-[#5B6B67] dark:text-[#9DB0AB] shrink-0">
                  {n.timestamp}
                </span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                {n.message}
              </p>
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="text-center py-16 text-xs text-[#5B6B67] dark:text-[#9DB0AB]">
              No notifications yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
