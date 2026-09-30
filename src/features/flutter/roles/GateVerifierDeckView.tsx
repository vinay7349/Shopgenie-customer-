import React, { useState } from 'react';
import { 
  ShieldCheck, 
  QrCode, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Unlock, 
  Lock, 
  Check, 
  History, 
  Radio, 
  Clock, 
  Sparkles,
  Camera,
  Flashlight
} from 'lucide-react';
import { DeckOrder, AuditLogEntry } from '../flutterDeckTypes';

interface GateVerifierDeckViewProps {
  orders: DeckOrder[];
  setOrders: React.Dispatch<React.SetStateAction<DeckOrder[]>>;
  auditLogs: AuditLogEntry[];
  setAuditLogs: React.Dispatch<React.SetStateAction<AuditLogEntry[]>>;
  showToast: (msg: string) => void;
}

export const GateVerifierDeckView: React.FC<GateVerifierDeckViewProps> = ({
  orders,
  setOrders,
  auditLogs,
  setAuditLogs,
  showToast
}) => {
  const [verifierTab, setVerifierTab] = useState<'scanner' | 'audit' | 'turnstile'>('scanner');
  const [selectedPassCode, setSelectedPassCode] = useState<string>(
    orders.find(o => o.status === 'pending_gate')?.passCode || orders[0]?.passCode || ''
  );
  const [isGateUnlocked, setIsGateUnlocked] = useState(false);
  const [searchAudit, setSearchAudit] = useState('');

  const activeOrder = orders.find(o => o.passCode === selectedPassCode);

  const handleAuthorizeExit = () => {
    if (!activeOrder) return;
    
    // Update order status
    setOrders(prev => prev.map(o => {
      if (o.passCode === activeOrder.passCode) {
        return {
          ...o,
          status: 'verified_exit',
          verifiedAt: 'Just now',
          verifiedBy: 'Officer Ramesh K. (Gate #1)'
        };
      }
      return o;
    }));

    // Add to audit log
    const newAudit: AuditLogEntry = {
      id: `audit-${Date.now()}`,
      orderId: activeOrder.passCode,
      customerName: activeOrder.customerName,
      storeName: activeOrder.storeName,
      itemCount: activeOrder.items.reduce((acc, i) => acc + i.quantity, 0),
      totalAmount: activeOrder.total,
      verifiedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      officerName: 'Officer Ramesh K.',
      gateNumber: 'Turnstile A-1'
    };
    setAuditLogs(prev => [newAudit, ...prev]);

    // Animate gate unlock
    setIsGateUnlocked(true);
    showToast(`Pass ${activeOrder.passCode} verified! Turnstile unlocked.`);
    setTimeout(() => {
      setIsGateUnlocked(false);
    }, 3500);
  };

  const handleSimulateScan = (passCode: string) => {
    setSelectedPassCode(passCode);
    showToast(`Scanned customer pass ${passCode}`);
  };

  const pendingGateOrders = orders.filter(o => o.status === 'pending_gate');

  return (
    <div className="flex-1 flex flex-col pt-10 overflow-y-auto pb-16">
      {/* Gate Verifier Header */}
      <div className="bg-white dark:bg-[#141C1A] px-4 py-3 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/15 text-indigo-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">Exit Gate Guard</h2>
                <span className="px-1.5 py-0.2 rounded-md bg-blue-500/10 text-blue-600 text-[10px] font-bold">Turnstile A-1</span>
              </div>
              <p className="text-[11px] text-slate-500">GreenLeaf Organic Grocers · Exit Checkpoint</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${isGateUnlocked ? 'bg-emerald-500 animate-ping' : 'bg-blue-600'}`} />
            <span className="text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300">
              {isGateUnlocked ? 'GATE OPEN' : 'ARMED'}
            </span>
          </div>
        </div>

        {/* Subtabs */}
        <div className="flex gap-1 mt-3 bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-xl text-xs font-bold">
          <button
            onClick={() => setVerifierTab('scanner')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              verifierTab === 'scanner'
                ? 'bg-white dark:bg-[#141C1A] text-[#0F766E] dark:text-[#5EEAD4] shadow-2xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Gate Scanner ({pendingGateOrders.length})
          </button>
          <button
            onClick={() => setVerifierTab('audit')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              verifierTab === 'audit'
                ? 'bg-white dark:bg-[#141C1A] text-[#0F766E] dark:text-[#5EEAD4] shadow-2xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Audit Log ({auditLogs.length})
          </button>
          <button
            onClick={() => setVerifierTab('turnstile')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              verifierTab === 'turnstile'
                ? 'bg-white dark:bg-[#141C1A] text-[#0F766E] dark:text-[#5EEAD4] shadow-2xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Turnstile Status
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {verifierTab === 'scanner' && (
          <>
            {/* Quick Customer Simulator Barcode Selector */}
            <div className="bg-white dark:bg-[#141C1A] p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Select Customer Pass to Verify:
              </div>
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
                {orders.map(order => (
                  <button
                    key={order.id}
                    onClick={() => handleSimulateScan(order.passCode)}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      selectedPassCode === order.passCode
                        ? 'bg-[#0F766E] text-white shadow-2xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>{order.passCode}</span>
                    <span className={`w-1.5 h-1.5 rounded-full ${order.status === 'verified_exit' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Verification Card */}
            {activeOrder ? (
              <div className="bg-white dark:bg-[#141C1A] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600">
                      DIGITAL EXIT PASS
                    </span>
                    <h3 className="text-base font-bold text-slate-800 dark:text-white mt-1">
                      {activeOrder.passCode}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Shopper: {activeOrder.customerName} ({activeOrder.customerPhone})
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    activeOrder.status === 'verified_exit'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 animate-pulse'
                  }`}>
                    {activeOrder.status === 'verified_exit' ? 'ALREADY CLEARED' : 'VALID · READY TO AUDIT'}
                  </span>
                </div>

                {/* Scanned Bag Items Audit */}
                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl space-y-2 text-xs">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Scanned Bag Contents ({activeOrder.items.reduce((sum, i) => sum + i.quantity, 0)} items)
                  </div>
                  <div className="space-y-1.5">
                    {activeOrder.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span>{item.emoji}</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{item.name}</span>
                          <span className="text-slate-400 font-mono text-[10px]">× {item.quantity}</span>
                        </div>
                        <span className="font-bold font-mono">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-slate-200 dark:border-slate-800 pt-2 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-500">Payment Verified:</span>
                      <span className="font-bold ml-1 text-slate-700 dark:text-slate-200">{activeOrder.paymentMethod}</span>
                    </div>
                    <div className="font-extrabold text-sm text-[#0F766E] dark:text-[#5EEAD4]">
                      ${activeOrder.total.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Authorization Action */}
                {activeOrder.status === 'pending_gate' ? (
                  <button
                    onClick={handleAuthorizeExit}
                    disabled={isGateUnlocked}
                    className={`w-full py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
                      isGateUnlocked
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#0F766E] hover:bg-[#115E59] text-white'
                    }`}
                  >
                    {isGateUnlocked ? (
                      <>
                        <Unlock className="w-4 h-4 animate-bounce" />
                        <span>TURNSTILE UNLOCKED · CLEAR TO EXIT</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Authorize Exit & Unlock Gate</span>
                      </>
                    )}
                  </button>
                ) : (
                  <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 text-center text-xs font-semibold flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>Authorized by {activeOrder.verifiedBy || 'Officer'} · {activeOrder.verifiedAt}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center bg-white dark:bg-[#141C1A] rounded-3xl border border-slate-200 dark:border-slate-800">
                <QrCode className="w-12 h-12 mx-auto text-slate-400 mb-2" />
                <div className="text-xs font-bold text-slate-700 dark:text-slate-200">No Pass Selected</div>
                <p className="text-[11px] text-slate-500 mt-1">Tap a pass code above or simulate scan</p>
              </div>
            )}
          </>
        )}

        {verifierTab === 'audit' && (
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchAudit}
                onChange={e => setSearchAudit(e.target.value)}
                placeholder="Search audit by pass code or customer..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-[#141C1A] border border-slate-200 dark:border-slate-800 text-xs focus:ring-2 focus:ring-[#0F766E]"
              />
            </div>

            <div className="space-y-2">
              {auditLogs.filter(a => 
                a.orderId.toLowerCase().includes(searchAudit.toLowerCase()) ||
                a.customerName.toLowerCase().includes(searchAudit.toLowerCase())
              ).map(log => (
                <div
                  key={log.id}
                  className="p-3 bg-white dark:bg-[#141C1A] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
                      <Check className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                        <span>{log.customerName}</span>
                        <span className="font-mono text-[10px] text-[#0F766E]">{log.orderId}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {log.itemCount} items · ${log.totalAmount.toFixed(2)} · {log.gateNumber}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 font-bold">{log.verifiedTime}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {verifierTab === 'turnstile' && (
          <div className="bg-white dark:bg-[#141C1A] p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
              Physical Barrier & Turnstile Sensors
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="font-medium text-slate-600 dark:text-slate-300">Turnstile Arm Status</span>
                <span className={`font-bold font-mono px-2 py-0.5 rounded text-[11px] ${
                  isGateUnlocked ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {isGateUnlocked ? 'UNLOCKED / PASS THROUGH' : 'LOCKED / SECURED'}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="font-medium text-slate-600 dark:text-slate-300">Optical Sensors</span>
                <span className="text-emerald-600 font-bold">4/4 Beams Clear</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="font-medium text-slate-600 dark:text-slate-300">Anti-Tailgating System</span>
                <span className="text-indigo-600 font-bold">ARMED · IR Active</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="font-medium text-slate-600 dark:text-slate-300">Backup Battery</span>
                <span className="text-emerald-600 font-bold font-mono">100% · AC Mains</span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsGateUnlocked(!isGateUnlocked);
                showToast(isGateUnlocked ? 'Turnstile re-locked' : 'Emergency manual unlock activated');
              }}
              className="w-full py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
            >
              {isGateUnlocked ? 'Lock Turnstile Now' : 'Manual Emergency Unlock'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
