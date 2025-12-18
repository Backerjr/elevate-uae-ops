import { useState } from 'react';
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
import { Sparkles, Command, Wifi } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');

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

  return (
    <div className="min-h-screen bg-[#02040A] text-white font-sans selection:bg-amber-500/30 selection:text-amber-100 overflow-x-hidden">
      
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-amber-500/5 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-blue-900/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      {/* Top Status Bar (HUD) */}
      <header className="fixed top-0 left-0 right-0 z-40 h-16 flex items-center justify-between px-6 border-b border-white/5 bg-[#02040A]/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e] animate-pulse" />
          <span className="text-xs font-mono text-white/40 tracking-[0.2em] uppercase">System Online</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-white/60">
            <Wifi className="w-3 h-3" />
            <span>LINK_ESTABLISHED</span>
          </div>
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 border border-white/20 shadow-lg" />
        </div>
      </header>

      {/* Main Content Stage */}
      <main className="relative z-10 pt-24 pb-32 px-4 lg:px-8 max-w-[1600px] mx-auto min-h-screen flex flex-col">
        
        {/* Cinematic Header (Only on Dashboard) */}
        {activeTab === 'dashboard' && (
          <div className="relative mb-12 overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-1">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542259659439-d42398d89cb0?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay grayscale hover:grayscale-0 transition-all duration-[2s] ease-in-out" />
            <div className="relative z-10 p-10 md:p-20 flex flex-col items-center text-center space-y-6">
              
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-[0.2em] shadow-[0_0_30px_-5px_rgba(245,158,11,0.3)]">
                <Sparkles className="w-3 h-3" />
                <span>Concierge Protocol v2.0</span>
              </div>
              
              <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40 drop-shadow-2xl">
                PROJECT <br className="md:hidden" /> CHIMERA
              </h1>
              
              <p className="max-w-2xl text-lg md:text-xl text-white/60 font-light leading-relaxed">
                Welcome back, Architect. The system is primed for high-value operations. 
                <span className="text-white/90 font-medium"> The desert is waiting.</span>
              </p>

              <div className="pt-8 flex gap-4">
                <button 
                  onClick={() => setActiveTab('tours')}
                  className="group relative px-8 py-4 bg-white text-black font-bold rounded-xl overflow-hidden transition-transform active:scale-95"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-200 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative flex items-center gap-2">
                    <Command className="w-4 h-4" /> Initialize Catalog
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Viewport */}
        <div className="flex-1 w-full animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
          {renderContent()}
        </div>

      </main>

      {/* Navigation Dock */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
    </div>
  );
};

export default Index;