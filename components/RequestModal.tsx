
import React, { useState } from 'react';
import { X, CheckCircle2, ChevronRight, ChevronLeft, Loader2, AlertCircle } from 'lucide-react';

interface RequestModalProps {
  onClose: () => void;
  initialData?: any;
}

const RequestModal: React.FC<RequestModalProps> = ({ onClose, initialData }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [form, setForm] = useState({
    brandName: initialData?.brandName || '',
    email: '',
    service: '',
    budget: '',
    message: initialData ? `AI Creative Idea: ${initialData.title}\n\nConcept: ${initialData.concept}` : '',
  });

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('https://formspree.io/f/mnjnnzvb', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          brand: form.brandName,
          email: form.email,
          service: form.service,
          budget: form.budget,
          message: form.message
        })
      });

      if (response.ok) {
        setSubmitStatus('success');
        setStep(4); // Move to success view
      } else {
        throw new Error('Submission failed');
      }
    } catch (err) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isComplete = step > 3 && submitStatus === 'success';

  const services = ['COMMERCIAL', 'AI ART', 'INTERVIEW', 'MAKING'];
  const budgets = [
    '500만원 이하',
    '1000만원 이하',
    '1500만원 이하',
    '2000만원 이상'
  ];

  return (
    <div className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
      <div className="w-full max-w-xl bg-[#111] border border-white/10 p-8 md:p-12 relative rounded-sm shadow-2xl">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-neutral-600 hover:text-white transition-colors"
          disabled={isSubmitting}
        >
          <X size={24} />
        </button>

        {!isComplete ? (
          <>
            <div className="mb-12">
              <div className="h-1 w-full bg-neutral-900 rounded-full mb-6">
                <div 
                  className="h-full bg-white transition-all duration-500"
                  style={{ width: `${(step / 3) * 100}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-[0.3em]">Step {step} of 3</p>
            </div>

            <div className="min-h-[320px] animate-in slide-in-from-bottom duration-500">
              {step === 1 && (
                <div>
                  <h2 className="font-heading text-4xl font-black mb-10 text-white tracking-tighter uppercase">Category</h2>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    {services.map(s => (
                      <button
                        key={s}
                        onClick={() => setForm({ ...form, service: s })}
                        className={`py-8 px-4 border text-[11px] font-bold tracking-[0.2em] transition-all duration-300 h-24 flex items-center justify-center text-center
                          ${form.service === s 
                            ? 'border-white bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.1)]' 
                            : 'border-white/5 bg-neutral-900/50 text-neutral-500 hover:border-white/20'
                          }
                        `}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <div className="mt-10">
                    <label className="block text-[10px] text-neutral-600 uppercase tracking-widest mb-3">Brand / Company Name</label>
                    <input
                      type="text"
                      placeholder="Enter your brand"
                      value={form.brandName}
                      onChange={(e) => setForm({ ...form, brandName: e.target.value })}
                      className="w-full bg-transparent border-b border-white/10 pb-4 text-xl text-white focus:outline-none focus:border-white transition-colors placeholder:text-neutral-800"
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="font-heading text-4xl font-black mb-10 text-white tracking-tighter uppercase">Project Budget</h2>
                  <div className="space-y-3">
                    {budgets.map(b => (
                      <button
                        key={b}
                        onClick={() => setForm({ ...form, budget: b })}
                        className={`w-full p-6 border text-left flex justify-between items-center transition-all duration-300 group
                          ${form.budget === b 
                            ? 'border-white bg-white/5 text-white' 
                            : 'border-white/5 bg-neutral-900/50 text-neutral-500 hover:border-white/20'
                          }
                        `}
                      >
                        <span className="font-bold tracking-widest text-sm uppercase">{b}</span>
                        {form.budget === b && <CheckCircle2 size={18} className="text-white" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="font-heading text-4xl font-black mb-10 text-white tracking-tighter uppercase">Briefing & Contact</h2>
                  
                  <div className="mb-6">
                    <label className="block text-[10px] text-neutral-600 uppercase tracking-widest mb-3">Contact Email</label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-transparent border-b border-white/10 pb-4 text-lg text-white focus:outline-none focus:border-white transition-colors placeholder:text-neutral-800"
                    />
                  </div>

                  <label className="block text-[10px] text-neutral-600 uppercase tracking-widest mb-3">Project vision</label>
                  <textarea
                    rows={5}
                    placeholder="Tell us about your project vision..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-neutral-900/50 border border-white/10 p-6 text-white text-sm focus:outline-none focus:border-white transition-colors rounded-sm placeholder:text-neutral-700"
                  ></textarea>

                  {submitStatus === 'error' && (
                    <div className="mt-4 flex items-center gap-2 text-red-500 text-[10px] font-bold tracking-widest uppercase bg-red-500/10 p-4 rounded-sm">
                      <AlertCircle size={14} /> Failed to send. Please check your connection and try again.
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-between mt-12 pt-8 border-t border-white/5">
              {step > 1 ? (
                <button 
                  onClick={prevStep} 
                  disabled={isSubmitting}
                  className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors font-bold tracking-widest text-[10px] uppercase disabled:opacity-20"
                >
                  <ChevronLeft size={14} /> Back
                </button>
              ) : <div></div>}
              
              <button 
                onClick={step === 3 ? handleSubmit : nextStep}
                disabled={isSubmitting || (step === 1 ? !form.brandName || !form.service : step === 2 ? !form.budget : (!form.message || !form.email))}
                className="flex items-center gap-3 text-white bg-white/5 border border-white/20 px-10 py-4 font-bold tracking-[0.2em] text-[10px] uppercase hover:bg-white hover:text-black hover:border-white transition-all disabled:opacity-20 disabled:cursor-not-allowed group min-w-[1800px] justify-center"
              >
                {isSubmitting ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <>
                    {step === 3 ? 'Send Request' : 'Continue'} 
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-12 animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-[#84cc16] rounded-full flex items-center justify-center mx-auto mb-10 text-white shadow-[0_0_30px_rgba(132,204,22,0.3)]">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="font-heading text-5xl font-black text-white mb-6 tracking-tighter">INQUIRY SENT</h2>
            <p className="text-neutral-500 text-sm leading-relaxed mb-12 max-w-xs mx-auto">
              Our production team will analyze your request and reach out to <strong>{form.email}</strong> via Formspree.
            </p>
            <button 
              onClick={onClose}
              className="w-full py-5 border border-white text-white font-bold tracking-widest hover:bg-white hover:text-black transition-all text-xs uppercase"
            >
              Close Window
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestModal;
