import React, { useId, useState } from 'react';
import { Calendar, Check, ChevronDown, Shield, Users, X, Zap } from 'lucide-react';
import { FAQS, SAFETY_SPECS, SITE_CONFIG, VEHICLES } from '../data/landing-mock';

const SectionHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="text-center mb-12">
    <h2 className="text-3xl md:text-5xl font-black text-white mb-4 uppercase tracking-tight italic">{title}</h2>
    {subtitle && <p className="text-gray-400 max-w-2xl mx-auto text-lg">{subtitle}</p>}
  </div>
);

const ButtonPrimary = ({
  children,
  onClick,
  className = '',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) => (
  <button
    onClick={onClick}
    className={`bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-wider py-4 px-8 rounded-lg shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all transform hover:-translate-y-1 active:scale-95 ${className}`}
  >
    {children}
  </button>
);

const TrustTicker = () => (
  <div className="bg-zinc-900 border-y border-white/5 py-6 overflow-hidden relative">
    <div className="flex gap-12 items-center justify-center opacity-60 grayscale hover:grayscale-0 transition-all duration-500 flex-wrap px-4">
      {['TripAdvisor', 'Google Reviews', 'Safety Certified', 'Dubai Tourism'].map((brand) => (
        <div key={brand} className="flex items-center gap-2">
          <span className="text-lg font-bold text-white">{brand}</span>
          <div className="flex text-amber-500 text-xs">★★★★★</div>
        </div>
      ))}
    </div>
  </div>
);

const AdrenalineLanding = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const faqIdBase = useId();

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-amber-500 selection:text-black">
      <nav className="fixed top-0 w-full z-40 bg-zinc-950/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-2xl font-black italic tracking-tighter text-white">
            {SITE_CONFIG.brandName}
            <span className="text-amber-500">.</span>
          </div>
          <div className="hidden md:flex gap-6 items-center">
            <a href="#fleet" className="text-sm font-bold text-gray-300 hover:text-white uppercase">
              The Fleet
            </a>
            <ButtonPrimary onClick={() => setIsModalOpen(true)} className="!py-2 !px-6 !text-sm !shadow-none">
              Book Now
            </ButtonPrimary>
          </div>
        </div>
      </nav>

      <main className="pt-20">
        <section className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-zinc-900">
          <div className="absolute inset-0 z-0">
            <img
              src="/assets/placeholders/hero.svg"
              className="w-full h-full object-cover opacity-30"
              alt="Adrenaline desert hero"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />
          </div>

          <div className="relative z-10 text-center px-4 max-w-5xl mt-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 border border-amber-500/30 rounded-full bg-amber-500/10 backdrop-blur-md">
              <Zap className="w-4 h-4 text-amber-500" />
              <span className="text-amber-500 text-xs font-bold tracking-widest uppercase">Premium Self-Drive</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-white mb-6 tracking-tighter leading-[0.9]">
              CONQUER <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">THE VOID</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              No bus crowds. No speed limiters. Pure power.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <ButtonPrimary onClick={() => setIsModalOpen(true)} className="w-full md:w-auto min-w-[200px]">
                Check Availability
              </ButtonPrimary>
            </div>
          </div>
        </section>

        <TrustTicker />

        <section id="fleet" className="py-24 px-4 bg-zinc-950">
          <div className="max-w-7xl mx-auto">
            <SectionHeader title="The Garage" subtitle="2025 Models. Maintained by race engineers." />
            <div className="grid md:grid-cols-3 gap-8">
              {VEHICLES.map((v) => (
                <div
                  key={v.id}
                  className="group bg-zinc-900 rounded-2xl overflow-hidden border border-white/10 hover:border-amber-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col"
                >
                  <div className="relative aspect-[4/3] bg-zinc-800">
                    <img
                      src={v.image}
                      alt={v.name}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                    <div className="absolute top-4 right-4 bg-black/80 backdrop-blur px-3 py-1 rounded text-amber-500 text-xs font-bold uppercase border border-white/10">
                      {v.power}
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-2xl font-black text-white mb-2 italic">{v.name}</h3>
                    <p className="text-gray-400 text-sm mb-6 flex items-center gap-2">
                      <Users className="w-4 h-4" /> {v.type}
                    </p>
                    <ul className="space-y-3 mb-8 border-t border-white/5 pt-6 flex-1">
                      {v.specs.map((feat, i) => (
                        <li key={i} className="flex items-center text-gray-300 text-sm">
                          <Check className="w-4 h-4 text-amber-500 mr-3 flex-shrink-0" /> {feat}
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-end justify-between mt-auto">
                      <div>
                        <span className="text-xs text-gray-500 uppercase block">From</span>
                        <span className="text-2xl font-black text-white">
                          {SITE_CONFIG.currency} {v.price}
                        </span>
                      </div>
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-white hover:bg-amber-500 hover:text-black text-zinc-950 font-bold py-2 px-6 rounded-lg transition-colors"
                      >
                        Book
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 bg-zinc-900 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                <Shield className="w-6 h-6 text-amber-500" /> SAFETY SPECS
              </h3>
              <div className="space-y-4">
                {SAFETY_SPECS.map((spec, i) => (
                  <div
                    key={i}
                    className="bg-zinc-950 p-4 rounded-xl border border-white/5 flex items-center justify-between"
                  >
                    <span className="text-gray-300">{spec}</span>
                    <Check className="w-5 h-5 text-green-500" />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                <Zap className="w-6 h-6 text-amber-500" /> THE EXPERIENCE
              </h3>
              <div className="space-y-8 pl-4 border-l-2 border-white/5">
                {[
                  { title: 'VIP Pickup', desc: 'Private 4x4 from your hotel.' },
                  { title: 'Gear Up', desc: 'Helmets, goggles, briefing.' },
                  { title: 'Ride', desc: '60 mins open desert.' },
                  { title: 'Chill', desc: 'Cold drinks at base camp.' },
                ].map((step, i) => (
                  <div key={i} className="relative pl-8">
                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-zinc-800 border-2 border-amber-500" />
                    <h4 className="text-lg font-bold text-white">{step.title}</h4>
                    <p className="text-gray-400 text-sm">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-zinc-950">
          <div className="max-w-3xl mx-auto px-4">
            <SectionHeader title="Need to Know" />
            <div className="space-y-4">
              {FAQS.map((faq, i) => {
                const isOpen = openFaqIndex === i;
                const buttonId = `${faqIdBase}-faq-btn-${i}`;
                const panelId = `${faqIdBase}-faq-panel-${i}`;
                return (
                  <div key={i} className="group bg-zinc-900 border border-white/5 rounded-xl overflow-hidden">
                    <button
                      id={buttonId}
                      onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                      className="flex justify-between items-center w-full p-6 text-left"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                    >
                      <span className="text-lg font-bold text-white">{faq.q}</span>
                      <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpen && (
                      <div
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
                        className="px-6 pb-6 text-gray-400 leading-relaxed border-t border-white/5 pt-4 animate-in slide-in-from-top-2"
                      >
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-zinc-950 border-t border-white/10 py-12 text-center">
        <div className="text-2xl font-black italic tracking-tighter text-white opacity-50 mb-4">
          {SITE_CONFIG.brandName}.
        </div>
        <p className="text-gray-600 text-sm">© 2025 Elevate Operations. All rights reserved.</p>
      </footer>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black to-transparent md:hidden z-30 pt-12">
        <ButtonPrimary onClick={() => setIsModalOpen(true)} className="w-full shadow-xl">
          Book Adventure
        </ButtonPrimary>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in">
          <div className="bg-zinc-900 w-full max-w-md rounded-2xl border border-white/10 shadow-2xl relative p-8 text-center">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <X />
            </button>
            <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-8 h-8 text-amber-500" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">Check Availability</h3>
            <p className="text-gray-400 mb-8">This is a demo. In production, this opens the booking engine.</p>
            <ButtonPrimary className="w-full" onClick={() => setIsModalOpen(false)}>
              Proceed (Mock)
            </ButtonPrimary>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdrenalineLanding;

