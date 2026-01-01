"use client";
import { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();
  
  // STATE
  const [credits, setCredits] = useState(10);
  const maxCredits = 10;
  const level = 1;
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'block' | 'item' | 'creature'>('block');

  const COST = 2;

  // Modal schließen wenn eingeloggt
  useEffect(() => {
    if (status === "authenticated") {
      setShowLoginModal(false);
    }
  }, [status]);

  const handleGenerate = () => {
    if (status !== "authenticated") { setShowLoginModal(true); return; }
    if (credits < COST) { alert("Nicht genug Essence!"); return; }
    if (!prompt) return;

    setIsLoading(true);
    setTimeout(() => {
      setCredits(prev => prev - COST);
      setIsLoading(false);
      alert("Asset erfolgreich geschmiedet! (Code würde hier erscheinen)"); 
    }, 2000);
  };

  const manaPercent = (credits / maxCredits) * 100;

  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden bg-[#0b0f19]">
      
      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-green-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      {/* --- NAVBAR --- */}
      <nav className="relative z-10 flex justify-between items-center px-8 py-6 border-b border-slate-800/60 backdrop-blur-md bg-[#0b0f19]/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-linear-to-br from-green-500 to-emerald-700 rounded-lg shadow-[0_0_15px_rgba(34,197,94,0.4)] flex items-center justify-center text-white font-bold text-xl rpg-font">
            G
          </div>
          <span className="text-2xl font-bold text-white rpg-font tracking-widest">GaiaForge</span>
        </div>

        {status === "authenticated" && session?.user ? (
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end w-48">
              <div className="flex justify-between w-full text-xs text-green-400 font-bold mb-1 uppercase tracking-wider">
                <span>Essence</span>
                <span>{credits} / {maxCredits}</span>
              </div>
              <div className="w-full h-3 bg-slate-900 rounded-full border border-slate-700 overflow-hidden relative">
                <div 
                  className="h-full bg-linear-to-r from-green-600 to-green-400 shadow-[0_0_10px_#4ade80] transition-all duration-500 ease-out"
                  style={{ width: `${manaPercent}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 bg-slate-800/50 border border-slate-700 px-4 py-2 rounded-lg">
                <div className="w-8 h-8 rounded bg-linear-to-tr from-purple-600 to-blue-600 flex items-center justify-center font-bold text-xs border border-white/20">
                  {level}
                </div>
                <span className="font-semibold text-slate-200">{session.user.name}</span>
              </div>
              <button onClick={() => signOut()} className="text-xs text-slate-500 hover:text-red-400 uppercase font-bold">
                Logout
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowLoginModal(true)} className="px-6 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold rounded uppercase text-xs">
            Log In
          </button>
        )}
      </nav>

      {/* --- HERO --- */}
      <div className="relative z-10 flex flex-col items-center mt-16 px-4 w-full max-w-5xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold text-center text-white mb-6 drop-shadow-2xl rpg-font">
          Forge your <span className="text-transparent bg-clip-text bg-linear-to-r from-green-400 to-emerald-600">World</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl text-center mb-12 font-light">
          Generate Hytale assets instantly with AI. Log in to save your creations.
        </p>

        {/* --- MAIN CARD --- */}
        <div className="w-full bg-[#151b2b] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm">
          <div className="flex border-b border-slate-700 bg-[#0f1522]">
            {['block', 'item', 'creature'].map((mode) => (
              <button
                key={mode}
                onClick={() => setActiveTab(mode as any)}
                className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-all relative ${
                  activeTab === mode ? 'text-green-400 bg-[#151b2b]' : 'text-slate-500 hover:text-slate-300 hover:bg-[#1a2236]'
                }`}
              >
                {mode}
                {activeTab === mode && <div className="absolute top-0 left-0 w-full h-0.5 bg-green-500 shadow-[0_0_8px_#22c55e]"></div>}
              </button>
            ))}
          </div>

          <div className="p-6 md:p-8 min-h-[300px] flex flex-col">
            {activeTab === 'block' ? (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full h-48 bg-[#0b0f19] border-2 border-slate-700 rounded-xl p-5 text-lg text-slate-200 focus:border-green-500/50 focus:shadow-[0_0_20px_rgba(34,197,94,0.1)] focus:outline-none transition-all resize-none placeholder-slate-600 font-medium"
                  placeholder="Describe the block (e.g., 'Ancient Runestone with glowing blue cracks')..."
                />
                <div className="flex justify-between items-center mt-6">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span>Model: Gaia-Core v0.9</span>
                  </div>
                  <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className={`px-8 py-3 rounded-lg font-bold text-white transition-all transform hover:scale-105 active:scale-95 shadow-lg ${
                      isLoading ? 'bg-slate-700 cursor-wait' : 'bg-linear-to-r from-green-600 to-emerald-600 hover:shadow-[0_0_15px_#22c55e] border border-green-400/30'
                    }`}
                  >
                    {isLoading ? "Forging..." : "GENERATE ASSET"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-12 animate-in zoom-in-95 duration-300">
                <div className="w-16 h-16 mb-4 rounded-full bg-slate-800 flex items-center justify-center border border-slate-600 text-3xl opacity-50">🔒</div>
                <h3 className="text-xl font-bold text-white mb-2 rpg-font">Module in Stasis</h3>
                <p className="text-slate-400 text-center max-w-md mb-6">The <span className="text-green-400 font-bold capitalize">{activeTab}</span> generator requires the Hytale Modding API.</p>
                <div className="px-4 py-2 bg-slate-900/50 border border-slate-700 rounded text-xs text-slate-500 uppercase tracking-widest">Unlocks with Hytale Beta</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- LOGIN MODAL --- */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-[#151b2b] border border-slate-700 p-8 w-full max-w-sm shadow-2xl rounded-2xl relative">
            <button onClick={() => setShowLoginModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white">✕</button>
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-linear-to-br from-green-500 to-emerald-700 rounded-lg mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl rpg-font shadow-lg">G</div>
              <h2 className="text-2xl font-bold text-white rpg-font">Create Account</h2>
              <p className="text-slate-400 text-sm mt-2">Join GaiaForge to use the Void Engine.</p>
            </div>
            <div className="space-y-3">
              <button onClick={() => signIn('google')} className="w-full py-3 bg-white hover:bg-gray-100 text-slate-900 font-bold rounded-lg transition-all flex items-center justify-center gap-3">
                 <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                Continue with Google
              </button>
               <button onClick={() => signIn('discord')} className="w-full py-3 bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold rounded-lg transition-all flex items-center justify-center gap-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 127.14 96.36"><path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.11,77.11,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.89,105.89,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/></svg>
                Continue with Discord
              </button>
            </div>
            <div className="mt-6 text-center text-xs text-slate-500">
              By continuing, you agree to our <a href="#" className="underline hover:text-green-400">Terms of Service</a>.
            </div>
          </div>
        </div>
      )}
    </main>
  );
}