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
import { Sparkles, Command, Wifi, Sun, Moon, CloudSun } from 'lucide-react';
import { cn } from '@/lib/utils';

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'day' | 'evening'>('day');

  // --- CHRONOBIOLOGICAL SIMULATION ---
  // In a real app, this would use new Date().getHours()
  // For the demo, we default to 'evening' for maximum KINO aesthetic, or toggle it.
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) setTimeOfDay('morning');
    else if (hour >= 11 && hour < 17) setTimeOfDay('day');
    else setTimeOfDay('evening');
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
      case 'recommender': return <TourRecommender />; // Now the Concierge AI
      case 'communication': return <CommunicationLibrary />;
      default: return <Dashboard onNavigate={setActiveTab} />;
    }
  };

  // Dynamic Backgrounds based on Time
  const getAtmosphere = () => {
    switch (timeOfDay) {
      case 'morning': return 'bg-gradient-to-br from-blue-900 via-slate-900 to-black'; // Azure Dawn
      case 'day': return 'bg-gradient-to-br from-amber-900/20 via-black to-black'; // Golden Sun
      case 'evening': return 'bg-[#02040A]'; // Obsidian Night
      default: return 'bg-[#02040A]';
    }
  };

  const getGreeting = () => {
    switch (timeOfDay) {
      case 'morning': return 'The desert is waking up.';
      case 'day': return 'The sun is high. Opportunities are everywhere.';
      case 'evening': return 'The city comes alive at night.';
    }
  };

  return (
    <div className={cn("min-h-screen text-white font-sans selection:bg-amber-500/30 selection:text-amber-100 overflow-x-hidden transition-colors duration-[2000ms]", getAtmosphere())}>
      
      {/* Ambient Atmospheric Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className={cn(
          "absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full blur-[120px] animate-pulse-slow transition-colors duration-[2000ms]",
          timeOfDay === 'morning' ? 'bg-blue-500/10' : timeOfDay === 'day' ? 'bg-amber-500/10' : 'bg-purple-900/10'
        )} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-blue-900/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      {/* Top Status Bar (HUD) */}
      <header className="fixed top-0 left-0 right-0 z-40 h-16 flex items-center justify-between px-6 border-b border-white/5 bg-black/50 backdrop-blur-md supports-[backdrop-filter]:bg-black/20">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e] animate-pulse" />
          <span className="text-xs font-mono text-white/40 tracking-[0.2em] uppercase">System Online</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-white/60">
            {timeOfDay === 'morning' && <CloudSun className="w-3 h-3" />}
            {timeOfDay === 'day' && <Sun className="w-3 h-3 text-amber-500" />}
            {timeOfDay === 'evening' && <Moon className="w-3 h-3 text-purple-400" />}
            <span className="uppercase">{timeOfDay}_MODE_ACTIVE</span>
          </div>
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 border border-white/20 shadow-lg" />
        </div>
      </header>

      {/* Main Content Stage */}
      <main className="relative z-10 pt-24 pb-32 px-4 lg:px-8 max-w-[1600px] mx-auto min-h-screen flex flex-col">
        
        {/* Cinematic Header (Dashboard Only) */}
        {activeTab === 'dashboard' && (
          <div className="relative mb-12 overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-1 transition-all duration-1000">
            {/* Dynamic Hero Image based on Time */}
            <div className={cn(
              "absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay transition-all duration-[2s] ease-in-out grayscale hover:grayscale-0",
              timeOfDay === 'morning' ? "bg-[url('https://images.unsplash.com/photo-1545199583-026ccb2323e2?q=80&w=2000')]" : // Bright Dune
              timeOfDay === 'day' ? "bg-[url('https://images.unsplash.com/photo-1512453979798-5ea90b7cadc9?q=80&w=2000')]" : // City Day
              "bg-[url('https://images.unsplash.com/photo-1512632500708-1b2177c27f29?q=80&w=2000')]" // Night City
            )} />
            
            <div className="relative z-10 p-10 md:p-20 flex flex-col items-center text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-[0.2em] shadow-[0_0_30px_-5px_rgba(245,158,11,0.3)]">
                <Sparkles className="w-3 h-3" />
                <span>Project Apotheosis</span>
              </div>
              
              <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40 drop-shadow-2xl">
                PROJECT <br className="md:hidden" /> CHIMERA
              </h1>
              
              <p className="max-w-2xl text-lg md:text-xl text-white/60 font-light leading-relaxed">
                Welcome back, Architect. {getGreeting()}
              </p>

              <div className="pt-8 flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => setActiveTab('tours')}
                  className="group relative px-8 py-4 bg-white text-black font-bold rounded-xl overflow-hidden transition-transform active:scale-95"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-200 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative flex items-center gap-2">
                    <Command className="w-4 h-4" /> Initialize Catalog
                  </span>
                </button>
                
                <button 
                  onClick={() => setActiveTab('recommender')}
                  className="group px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-xl transition-all"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" /> Consult AI Concierge
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