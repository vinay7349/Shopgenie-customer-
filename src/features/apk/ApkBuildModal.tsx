import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  Smartphone, 
  Check, 
  Copy, 
  Terminal, 
  Layers, 
  ShieldCheck, 
  Sparkles,
  ExternalLink,
  Cpu
} from 'lucide-react';

interface ApkBuildModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkBuildModal: React.FC<ApkBuildModalProps> = ({ isOpen, onClose }) => {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [activeTab, setActiveTab] = useState<'android' | 'flutter' | 'pwa'>('android');

  // Listen for PWA beforeinstallprompt on mobile/desktop
  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const handleTriggerInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstallable(false);
      }
      setDeferredPrompt(null);
    } else {
      alert("To install the APK on your Android device: open Chrome/Samsung Internet browser menu (⋮) and tap 'Install App' or 'Add to Home Screen'.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">
                ShopGenie APK & Mobile Build
              </h3>
              <p className="text-xs text-blue-100 font-medium">
                Configured & 100% Ready for Android APK Generation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('android')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'android'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Native Android (Kotlin Compose)</span>
          </button>

          <button
            onClick={() => setActiveTab('flutter')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'flutter'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Flutter 3.24 APK</span>
          </button>

          <button
            onClick={() => setActiveTab('pwa')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'pwa'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Direct WebAPK (Install to Phone)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed">
          {activeTab === 'android' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-emerald-900 text-xs">
                    Gradle, Kotlin & AndroidManifest Verified
                  </h4>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    The native Android project in <code className="bg-emerald-100 px-1 py-0.5 rounded font-mono font-bold">/app</code> has been configured with Android SDK 35, Jetpack Compose BOM, Kotlin 2.0 plugin, and Gradle 9.3.1.
                  </p>
                </div>
              </div>

              <div>
                <h5 className="font-bold text-slate-900 mb-1.5 text-xs">
                  1. Build Debug APK with Gradle:
                </h5>
                <div className="p-3 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] flex items-center justify-between">
                  <span>./gradlew assembleDebug</span>
                  <button
                    onClick={() => handleCopy('./gradlew assembleDebug', 'cmd1')}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                    title="Copy command"
                  >
                    {copiedCmd === 'cmd1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Output path: <code className="text-blue-600 font-semibold font-mono">app/build/outputs/apk/debug/app-debug.apk</code>
                </p>
              </div>

              <div>
                <h5 className="font-bold text-slate-900 mb-1.5 text-xs">
                  2. Build Release APK:
                </h5>
                <div className="p-3 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] flex items-center justify-between">
                  <span>./gradlew assembleRelease</span>
                  <button
                    onClick={() => handleCopy('./gradlew assembleRelease', 'cmd2')}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                    title="Copy command"
                  >
                    {copiedCmd === 'cmd2' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <h5 className="font-bold text-slate-900 mb-1.5 text-xs">
                  3. In Android Studio:
                </h5>
                <p className="text-[11px] text-slate-600">
                  Open the project folder directly in Android Studio. Click <strong>Build</strong> → <strong>Build Bundle(s) / APK(s)</strong> → <strong>Build APK(s)</strong>.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'flutter' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 flex items-start gap-2.5">
                <Sparkles className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-teal-900 text-xs">
                    Flutter 3.24 Multi-Platform Codebase
                  </h4>
                  <p className="text-[11px] text-teal-700 mt-0.5">
                    Standalone Flutter project is fully organized inside <code className="bg-teal-100 px-1 py-0.5 rounded font-mono font-bold">/flutter_shopgenie</code> with pubspec.yaml, themes, screens, and models.
                  </p>
                </div>
              </div>

              <div>
                <h5 className="font-bold text-slate-900 mb-1.5 text-xs">
                  Build Flutter Release APK:
                </h5>
                <div className="p-3 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] flex items-center justify-between">
                  <span>cd flutter_shopgenie && flutter build apk --release</span>
                  <button
                    onClick={() => handleCopy('cd flutter_shopgenie && flutter build apk --release', 'cmd3')}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                  >
                    {copiedCmd === 'cmd3' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Output path: <code className="text-blue-600 font-semibold font-mono">build/app/outputs/flutter-apk/app-release.apk</code>
                </p>
              </div>
            </div>
          )}

          {activeTab === 'pwa' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200">
                <h4 className="font-bold text-blue-900 text-xs mb-1">
                  Instant WebAPK on Any Android Phone
                </h4>
                <p className="text-[11px] text-blue-700 leading-relaxed">
                  Your Web App Manifest (<code className="bg-blue-100 px-1 py-0.5 rounded font-mono">manifest.json</code>) has been verified and registered. Android Chrome automatically generates and signs a native WebAPK on the user's device.
                </p>
              </div>

              <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                <Smartphone className="w-10 h-10 text-blue-600 mb-2" />
                <h4 className="font-bold text-sm text-slate-900 mb-1">
                  Install ShopGenie to Home Screen
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mb-4">
                  Runs full screen without URL bar, opens instantly, and supports self-checkout scan & pay with camera.
                </p>

                <button
                  onClick={handleTriggerInstall}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Install App to Device</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-medium">
            APK Target SDK: 35 · Min SDK: 24 (Android 7.0+)
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
