import { useState } from 'react';
import { Navigation } from '@/components/playbook/Navigation';
import { useNavigation } from '@/hooks/use-navigation';
import type { TabId } from '@/lib/navigation-utils';
import { Dashboard } from '@/components/playbook/Dashboard';
import { TourCatalog } from '@/components/playbook/TourCatalog';
import { QuoteCalculator } from '@/components/playbook/QuoteCalculator';
import { ScriptLibrary } from '@/components/playbook/ScriptLibrary';
import { PricingMatrix } from '@/components/playbook/PricingMatrix';
import { QuickReference } from '@/components/playbook/QuickReference';
import { TourRecommender } from '@/components/playbook/TourRecommender';
import { ObjectionLibrary } from '@/components/playbook/ObjectionLibrary';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const { activeTab, setActiveTab } = useNavigation();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveTab} />;
      case 'tours':
        return (
          <div className="space-y-8">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <TourCatalog />
              </div>
              <div>
                <TourRecommender />
              </div>
            </div>
          </div>
        );
      case 'calculator':
        return <QuoteCalculator />;
      case 'scripts':
        return (
          <Tabs defaultValue="scripts" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="scripts">WhatsApp Scripts</TabsTrigger>
              <TabsTrigger value="objections">Objection Handling</TabsTrigger>
            </TabsList>
            <TabsContent value="scripts">
              <ScriptLibrary />
            </TabsContent>
            <TabsContent value="objections">
              <ObjectionLibrary />
            </TabsContent>
          </Tabs>
        );
      case 'pricing':
        return <PricingMatrix />;
      case 'reference':
        return <QuickReference />;
      default:
        return <Dashboard onNavigate={setActiveTab} />;
    }
  };

  const getPageTitle = (): string => {
    switch (activeTab) {
      case 'dashboard': return 'Training Dashboard';
      case 'tours': return 'Tour Catalog & Recommender';
      case 'calculator': return 'Smart Quote Builder';
      case 'scripts': return 'Communication Library';
      case 'pricing': return 'Pricing Matrix';
      case 'reference': return 'Quick Reference';
      default: return 'Training Playbook';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className={cn(
        "transition-all duration-300",
        "lg:ml-64 p-6 lg:p-8",
        "pt-20 lg:pt-8"
      )}>
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          {activeTab !== 'dashboard' && (
            <div className="mb-8 animate-fade-in">
              <h1 className="text-2xl md:text-3xl font-display font-bold">{getPageTitle()}</h1>
              <div className="h-1 w-20 bg-gradient-gold rounded-full mt-3" />
            </div>
          )}

          {/* Main Content */}
          <div className="animate-fade-in">
            {renderContent()}
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p className="font-display">Ahmed Travel | The Travel Expert™ | The AI Concierge</p>
            <p className="mt-1">New Hire Training Playbook — Version 2025.12.11</p>
            <p className="mt-2 text-xs">Fully Polished & Standardized for Operational Excellence</p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Index;
