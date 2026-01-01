
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
    try {
      const synopsis = await generateVideoSynopsis({ brandName, mood });
      // Add the brand name to the result so it carries over to the contact form
      setResult({ ...synopsis, brandName });
    } catch (error) {
      console.error(error);
      alert('Failed to generate creative direction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in zoom-in duration-300">
      <div className="w-full max-w-4xl bg-[#1a1a1a] border border-white/10 rounded-sm overflow-hidden flex flex-col md:flex-row h-[80vh] shadow-2xl">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        {/* Input Panel */}
        <div className="w-full md:w-2/5 p-8 border-r border-white/5 flex flex-col bg-neutral-900/50">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-lime-400 flex items-center justify-center text-black">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="font-logo text-xl font-bold tracking-widest text-white">AI STUDIO</h2>
              <p className="text-[10px] text-lime-400 uppercase tracking-widest font-bold">Innovation Hub</p>
            </div>
          </div>

          <div className="space-y-6 flex-grow">
            <div>
              <label className="block text-[10px] text-neutral-500 uppercase tracking-[0.2em] mb-3">Brand Name</label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Enter your brand"
                className="w-full bg-black border border-white/10 p-4 text-sm text-white focus:outline-none focus:border-lime-400/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] text-neutral-500 uppercase tracking-[0.2em] mb-3">Select Vibe</label>
              <div className="flex flex-wrap gap-2">
                {moods.map((m) => (
                  <button
                    key={m}
                    onClick={() => setMood(m)}
                    className={`px-4 py-2 text-[10px] uppercase tracking-widest font-bold border transition-all duration-300
                      ${mood === m ? 'bg-lime-400 text-black border-lime-400' : 'bg-transparent text-neutral-400 border-white/10 hover:border-white/40'}
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
            className="mt-8 w-full py-4 bg-lime-400 text-black font-logo font-bold tracking-widest flex items-center justify-center gap-2 hover:bg-lime-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Wand2 size={20} />}
            ANALYZE WITH AI
          </button>
        </div>

        {/* Output Panel */}
        <div className="w-full md:w-3/5 p-8 overflow-y-auto bg-black flex flex-col">
          {!result && !loading ? (
            <div className="flex-grow flex flex-col items-center justify-center text-center opacity-40">
              <Wand2 size={48} className="mb-4 text-neutral-600" />
              <p className="text-sm font-logo tracking-widest text-neutral-500 uppercase">Awaiting Creative Parameters</p>
            </div>
          ) : loading ? (
            <div className="flex-grow flex flex-col items-center justify-center text-center">
              <Loader2 size={48} className="animate-spin mb-4 text-lime-400" />
              <p className="text-sm font-logo tracking-widest text-lime-400 animate-pulse uppercase">Neural Processing...</p>
            </div>
          ) : result ? (
            <div className="space-y-8 animate-in slide-in-from-right duration-500">
              <div>
                <p className="text-[10px] text-lime-400 uppercase tracking-[0.2em] mb-2 font-bold">Proposed Title</p>
                <h3 className="font-logo text-3xl font-bold text-white tracking-wider">{result.title}</h3>
              </div>

              <div>
                <p className="text-[10px] text-neutral-500 uppercase tracking-[0.2em] mb-2">Concept Essence</p>
                <p className="text-lime-400 font-logo italic tracking-widest">{result.concept}</p>
              </div>

              <div>
                <p className="text-[10px] text-neutral-500 uppercase tracking-[0.2em] mb-2">Narrative Synopsis</p>
                <p className="text-neutral-300 leading-relaxed text-sm whitespace-pre-wrap">{result.synopsis}</p>
              </div>

              <div className="bg-neutral-900 p-4 border-l-2 border-lime-400">
                <p className="text-[10px] text-neutral-500 uppercase tracking-[0.2em] mb-2">Visual Hook</p>
                <p className="text-white text-sm italic">"{result.visualHook}"</p>
              </div>

              <button 
                onClick={() => onConnectIdea(result)}
                className="w-full py-4 border border-lime-400/30 text-lime-400 font-logo font-bold tracking-widest flex items-center justify-center gap-2 hover:bg-lime-400 hover:text-black transition-all"
              >
                CONNECT THIS IDEA <Send size={16} />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default AICreativeLab;
