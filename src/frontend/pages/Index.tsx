import { useState, useEffect } from 'react';
import { Navigation } from '@/components/playbook/Navigation';
import type { TabId } from '@/lib/navigation-utils';
import { Dashboard } from '@/components/playbook/Dashboard';
import { TourCatalog } from '@/components/playbook/TourCatalog';
import { QuoteCalculator } from '@/components/playbook/QuoteCalculator';
import { ScriptLibrary } from '@/components/playbook/ScriptLibrary';
import { ObjectionLibrary } from '@/components/playbook/ObjectionLibrary';
import { PricingMatrix } from '@/components/playbook/PricingMatrix';
import { QuickReference } from '@/components/playbook/QuickReference';
import { TourComparison } from '@/components/playbook/TourComparison';
import { TourRecommender } from '@/components/playbook/TourRecommender';
import { CommunicationLibrary } from '@/components/playbook/CommunicationLibrary';
import { Sparkles, Command, Sun, Moon, CloudSun, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'day' | 'evening'>('day');
  const [scrolled, setScrolled] = useState(false);

  // --- ATMOSPHERIC ENGINE ---
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) setTimeOfDay('morning');
    else if (hour >= 11 && hour < 17) setTimeOfDay('day');
    else setTimeOfDay('evening');

    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard onNavigate={setActiveTab} />;
      case 'tours': return <TourCatalog />;
      case 'calculator': return <QuoteCalculator />;
      case 'scripts': return <ScriptLibrary />;
      case 'objections': return <ObjectionLibrary />;
      case 'pricing': return <PricingMatrix />;
      case 'quick-ref': return <QuickReference />;
      case 'comparison': return <TourComparison />;
      case 'recommender': return <TourRecommender />;
      case 'communication': return <CommunicationLibrary />;
      default: return <Dashboard onNavigate={setActiveTab} />;
    }
  };

  // Dynamic Moods
  const getAtmosphere = () => {
    switch (timeOfDay) {
      case 'morning': return 'from-blue-950 via-slate-900 to-black';
      case 'day': return 'from-amber-950/40 via-black to-black';
      case 'evening': return 'from-purple-950/30 via-[#02040A] to-[#02040A]'; 
    }
  };

  return (
    <div className={cn(
      "min-h-screen text-white font-sans selection:bg-amber-500/30 selection:text-amber-100 overflow-x-hidden transition-colors duration-[3000ms] bg-gradient-to-b",
      getAtmosphere()
    )}>
      
      {/* Cinematic Noise Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* Floating HUD Header */}
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 h-20 flex items-center justify-between px-8 transition-all duration-500",
        scrolled ? "bg-black/80 backdrop-blur-xl border-b border-white/5" : "bg-transparent"
      )}>
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_15px_#22c55e] animate-pulse" />
          <span className="text-sm font-mono text-white/60 tracking-[0.2em] uppercase group-hover:text-white transition-colors">
            AHMED<span className="text-amber-500">.OPS</span>
          </span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/5 backdrop-blur-md">
            {timeOfDay === 'morning' && <CloudSun className="w-4 h-4 text-blue-300" />}
            {timeOfDay === 'day' && <Sun className="w-4 h-4 text-amber-400" />}
            {timeOfDay === 'evening' && <Moon className="w-4 h-4 text-purple-400" />}
            <span className="text-xs font-mono text-white/60 uppercase tracking-widest">
              {timeOfDay}_PROTOCOL
            </span>
          </div>
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 border-2 border-white/10 shadow-lg cursor-pointer hover:scale-105 transition-transform" />
        </div>
      </header>

      {/* Main Stage */}
      <main className="relative z-10 pt-32 pb-32 px-4 lg:px-12 max-w-[1800px] mx-auto min-h-screen flex flex-col">
        
        {/* HERO SECTION (Dashboard Only) */}
        {activeTab === 'dashboard' && (
          <div className="relative mb-20 overflow-hidden rounded-[2.5rem] border border-white/10 p-1 group">
            {/* Parallax Background */}
            <div className="absolute inset-0 bg-black z-0">
              <div className={cn(
                "absolute inset-0 bg-cover bg-center opacity-60 mix-blend-overlay transition-all duration-[3s] scale-105 group-hover:scale-100",
                timeOfDay === 'morning' ? "bg-[url('https://images.unsplash.com/photo-1545199583-026ccb2323e2?q=80&w=2000')]" :
                timeOfDay === 'day' ? "bg-[url('https://images.unsplash.com/photo-1512453979798-5ea90b7cadc9?q=80&w=2000')]" :
                "bg-[url('https://images.unsplash.com/photo-1512632500708-1b2177c27f29?q=80&w=2000')]"
              )} />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            </div>
            
            <div className="relative z-10 py-24 px-6 md:px-20 flex flex-col items-center text-center space-y-8">
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-[0.3em] shadow-[0_0_40px_-10px_rgba(245,158,11,0.4)] animate-in fade-in slide-in-from-top-4 duration-1000">
                <Sparkles className="w-3 h-3" />
                <span>The Apotheosis Protocol</span>
              </div>
              
              <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-white drop-shadow-2xl animate-in zoom-in-95 duration-1000 delay-100">
                DREAM. <span className="text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-600">MANIFEST.</span>
              </h1>
              
              <p className="max-w-2xl text-xl text-white/70 font-light leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
                The desert is waiting, Architect. <br/>
                <span className="text-white font-medium">Tell us what your soul requires.</span>
              </p>

              <div className="pt-10 flex flex-col sm:flex-row gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                <button 
                  onClick={() => setActiveTab('recommender')}
                  className="group relative px-10 py-5 bg-white text-black font-bold rounded-2xl overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-200 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="relative flex items-center gap-3 text-lg">
                    <Sparkles className="w-5 h-5" /> Consult AI Concierge
                  </span>
                </button>
                
                <button 
                  onClick={() => setActiveTab('tours')}
                  className="group px-10 py-5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold rounded-2xl transition-all hover:border-white/30 backdrop-blur-md"
                >
                  <span className="flex items-center gap-3 text-lg">
                    <Command className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" /> 
                    Access Catalog
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Viewport */}
        <div className="flex-1 w-full animate-in fade-in slide-in-from-bottom-12 duration-700 ease-out">
          {renderContent()}
        </div>

      </main>

      {/* Navigation Dock */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
    </div>
  );
};

export default Index;