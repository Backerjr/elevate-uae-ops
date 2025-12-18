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
import { Sparkles } from 'lucide-react';

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
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground flex flex-col">
      {/* Navigation Bar */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 pt-20 pb-12 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Hero Welcome Banner (Only visible on Dashboard) */}
          {activeTab === 'dashboard' && (
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[hsl(222,47%,11%)] to-[hsl(222,47%,15%)] border border-white/10 shadow-2xl">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl opacity-50 pointer-events-none" />
              <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-50 pointer-events-none" />
              
              <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" />
                    <span>Concierge Mode Active</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight">
                    Welcome back, <span className="text-primary">Agent.</span>
                  </h1>
                  <p className="text-muted-foreground max-w-xl text-lg">
                    Your premium toolkit for crafting unforgettable UAE experiences is ready.
                  </p>
                </div>
                
                {/* Quick Stats or Call to Action could go here */}
                <div className="hidden md:block">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">System Status</p>
                    <div className="flex items-center gap-2 text-green-400 font-mono text-sm">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                      Operational
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Dynamic Component Render */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;