import React, { useState } from 'react';
import { X, Sparkles, Wand2, Loader2, Send } from 'lucide-react';
import { generateVideoSynopsis } from '../services/gemini';
import { SynopsisResponse } from '../types';

interface AICreativeLabProps {
  onClose: () => void;
  onConnectIdea: (idea: SynopsisResponse) => void;
}

const AICreativeLab: React.FC<AICreativeLabProps> = ({ onClose, onConnectIdea }) => {
  const [brandName, setBrandName] = useState('');
  const [mood, setMood] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SynopsisResponse | null>(null);

  const moods = ['Sophisticated', 'Raw', 'Futuristic', 'Emotional', 'Surreal', 'Cyberpunk'];

  const handleAnalyze = async () => {
    if (!brandName || !mood) return;
    setLoading(true);
    setResult(null);
    try {
      const synopsis = await generateVideoSynopsis({ brandName, mood });
      setResult({ ...synopsis, brandName });
    } catch (error) {
      console.error("Gemini API Error:", error);
      alert('Neural link interrupted. Please verify your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="w-full max-w-5xl bg-[#0a0a0a] border border-white/10 rounded-sm overflow-hidden flex flex-col md:flex-row h-[85vh] shadow-[0_0_50px_rgba(0,0,0,1)] relative">
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-neutral-500 hover:text-white transition-colors z-[130]"
        >
          <X size={24} />
        </button>

        {/* Left: Input Control Center */}
        <div className="w-full md:w-[400px] p-8 md:p-12 border-r border-white/5 flex flex-col bg-neutral-900/30">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 rounded-full bg-[#84cc16] flex items-center justify-center text-black shadow-[0_0_20px_#84cc16]">
              <Sparkles size={24} />
            </div>
            <div>
              <h2 className="font-logo text-2xl font-black tracking-tighter text-white">AI STUDIO</h2>
              <p className="text-[9px] text-[#84cc16] uppercase tracking-[0.3em] font-black">Powered by Gemini Pro</p>
            </div>
          </div>

          <div className="space-y-10 flex-grow">
            <div>
              <label className="block text-[10px] text-neutral-500 uppercase tracking-[0.4em] mb-4 font-bold">Brand Entity</label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Enter Brand Name"
                className="w-full bg-black/50 border border-white/10 p-5 text-sm text-white focus:outline-none focus:border-[#84cc16] transition-all rounded-sm placeholder:text-neutral-700 font-medium"
              />
            </div>

            <div>
              <label className="block text-[10px] text-neutral-500 uppercase tracking-[0.4em] mb-4 font-bold">Visual Mood</label>
              <div className="grid grid-cols-2 gap-2">
                {moods.map((m) => (
                  <button
                    key={m}
                    onClick={() => setMood(m)}
                    className={`px-3 py-3 text-[9px] uppercase tracking-[0.2em] font-black border transition-all duration-300
                      ${mood === m ? 'bg-[#84cc16] text-black border-[#84cc16] shadow-[0_0_15px_rgba(132,204,22,0.3)]' : 'bg-transparent text-neutral-500 border-white/5 hover:border-white/20'}
                    `}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading || !brandName || !mood}
            className="mt-12 w-full py-5 bg-[#84cc16] text-black font-logo font-black tracking-widest flex items-center justify-center gap-3 hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed uppercase"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Wand2 size={20} />}
            Initialize Creative
          </button>
        </div>

        {/* Right: Output Terminal */}
        <div className="flex-grow p-8 md:p-16 overflow-y-auto bg-black relative">
          {!result && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-24 h-24 border border-white/5 rounded-full flex items-center justify-center animate-pulse">
                <Wand2 size={32} className="text-neutral-800" />
              </div>
              <p className="text-[11px] font-bold tracking-[0.5em] text-neutral-600 uppercase">System Ready: Input Parameters Required</p>
            </div>
          )}

          {loading && (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-[#84cc16]/20 blur-3xl animate-pulse rounded-full"></div>
                <Loader2 size={64} className="animate-spin text-[#84cc16] relative z-10" />
              </div>
              <p className="text-xs font-logo tracking-[0.6em] text-[#84cc16] animate-pulse uppercase">Syncing with Neural Engine...</p>
            </div>
          )}

          {result && (
            <div className="max-w-2xl mx-auto space-y-12 animate-in fade-in slide-in-from-right-10 duration-700">
              <div className="space-y-4">
                <p className="text-[9px] text-[#84cc16] uppercase tracking-[0.5em] font-black">Project Title</p>
                <h3 className="font-logo text-5xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none">{result.title}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <p className="text-[9px] text-neutral-500 uppercase tracking-[0.4em] font-bold">Core Concept</p>
                  <p className="text-white text-lg font-light leading-snug italic">"{result.concept}"</p>
                </div>
                <div className="space-y-3">
                  <p className="text-[9px] text-neutral-500 uppercase tracking-[0.4em] font-bold">Visual Hook</p>
                  <p className="text-[#84cc16] text-lg font-black tracking-tight uppercase leading-tight">{result.visualHook}</p>
                </div>
              </div>

              <div className="pt-10 border-t border-white/5 space-y-4">
                <p className="text-[9px] text-neutral-500 uppercase tracking-[0.4em] font-bold">Narrative Synopsis</p>
                <p className="text-neutral-400 leading-relaxed text-base font-light whitespace-pre-wrap">{result.synopsis}</p>
              </div>

              <div className="pt-12">
                <button 
                  onClick={() => onConnectIdea(result)}
                  className="w-full py-6 border border-[#84cc16]/50 text-[#84cc16] font-logo font-black tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-[#84cc16] hover:text-black hover:shadow-[0_0_30px_rgba(132,204,22,0.3)] transition-all uppercase group"
                >
                  Connect This Vision <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AICreativeLab;