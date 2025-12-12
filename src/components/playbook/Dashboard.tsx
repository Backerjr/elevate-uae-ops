import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { tours, vehicleRates, whatsappScripts, comboPackages, brandPillars, type Tour } from '@/data/playbook-data';
import catalogData from '@/data/products.json';
import { QuickReference } from './QuickReference';
import { 
  Map, 
  Calculator, 
  MessageSquare, 
  TrendingUp, 
  Clock, 
  Target,
  Sparkles,
  ArrowRight,
  BookOpen,
  Zap
} from 'lucide-react';
type TabId = 'tours' | 'calculator' | 'scripts' | 'pricing' | 'reference';

interface DashboardProps {
  onNavigate: (tab: TabId) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'tours' | 'catalog' | 'scripts' | 'combos' | 'vehicles'>('tours');

  const mapCatalogCategory = (category: string): Tour['category'] => {
    const normalized = category.toLowerCase();
    if (normalized.includes('adventure')) return 'adventure';
    if (normalized.includes('desert')) return 'desert';
    if (normalized.includes('cruise')) return 'cruise';
    if (normalized.includes('dubai') || normalized.includes('sightseeing')) return 'dubai';
    if (normalized.includes('abu')) return 'abu-dhabi';
    return 'experience';
  };

  const mappedCatalogTours: Tour[] = catalogData.map((p) => ({
    id: p.product_id,
    name: p.product_name ?? p.title ?? "Catalog Product",
    category: mapCatalogCategory(p.category ?? ''),
    pickup: p.destination_city ?? 'UAE',
    duration: p.duration_hours ? `${p.duration_hours} hrs` : 'Approx 1-3 hrs',
    highlights: p.description_short ? [p.description_short] : [],
    inclusions: Array.isArray(p.inclusions) ? p.inclusions : [],
    requirements: [],
    proTip: undefined,
    note: undefined,
    dressCode: undefined,
    visualCues: ['🧭'],
    margin: 'medium',
    difficulty: 'easy',
    idealFor: [p.category || 'Guests'],
    waiverUrl: undefined,
  }));

  const allTours = [...tours, ...mappedCatalogTours];
  const mappedCatalogProducts = catalogData.map((p) => ({
    id: p.product_id,
    title: p.product_name ?? p.title ?? 'Catalog Product',
    category: p.category ?? 'Catalog',
    price: p.pricing?.[0]?.price_aed,
    description: p.description_short ?? '',
    city: p.destination_city ?? 'UAE',
  }));

  const quickStats = [
    { label: 'Tours Available', value: allTours.length, icon: Map, color: 'text-info' },
    { label: 'Script Templates', value: whatsappScripts.length, icon: MessageSquare, color: 'text-success' },
    { label: 'Combo Packages', value: comboPackages.length, icon: TrendingUp, color: 'text-primary' },
    { label: 'Vehicle Options', value: vehicleRates.length, icon: Calculator, color: 'text-accent' },
    { label: 'Catalog Products', value: catalogData.length, icon: BookOpen, color: 'text-warning' },
  ];

  const trainingModules = [
    { 
      title: 'Tour Catalog Mastery', 
      description: 'Learn all tours, highlights, and ideal customer profiles',
      progress: 100,
      tab: 'tours' as TabId,
      icon: Map
    },
    { 
      title: 'Quote Building', 
      description: 'Master zone pricing and create instant quotes',
      progress: 75,
      tab: 'calculator' as TabId,
      icon: Calculator
    },
    { 
      title: 'Client Communication', 
      description: 'Use proven scripts for every scenario',
      progress: 50,
      tab: 'scripts' as TabId,
      icon: MessageSquare
    },
    { 
      title: 'Pricing & Margins', 
      description: 'Understand markup structures and profit optimization',
      progress: 25,
      tab: 'pricing' as TabId,
      icon: TrendingUp
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'tours':
        return (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {tours.map((tour) => (
              <Card key={tour.id} variant="muted" className="h-full">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <Badge variant="info">{tour.category}</Badge>
                      <CardTitle className="text-base">{tour.name}</CardTitle>
                    </div>
                    <span className="text-lg font-semibold text-primary">{tour.duration}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {tour.highlights?.[0] && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{tour.highlights[0]}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        );
      case 'catalog':
        return (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {mappedCatalogProducts.map((prod) => {
              const badgeVariant =
                prod.category.toLowerCase().includes('adventure') ? 'warning' :
                prod.category.toLowerCase().includes('luxury') ? 'gold' :
                'info';
              return (
                <Card key={prod.id} variant="muted" className="h-full">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <Badge variant={badgeVariant}>{prod.category}</Badge>
                        <CardTitle className="text-base">{prod.title}</CardTitle>
                        <p className="text-xs text-muted-foreground">{prod.city}</p>
                      </div>
                      {prod.price !== undefined && (
                        <span className="text-lg font-semibold text-primary">AED {prod.price}</span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {prod.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{prod.description}</p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        );
      case 'scripts':
        return <QuickReference />;
      case 'combos':
        return (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {comboPackages.map((combo) => (
              <Card key={combo.id} variant="elevated">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{combo.name}</CardTitle>
                  <CardDescription>{combo.items.join(' + ')}</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <Badge variant="gold">AED {combo.totalPrice}</Badge>
                  <Badge variant="success">{combo.margin}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        );
      case 'vehicles':
        return (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 font-semibold">Vehicle</th>
                  <th className="text-left py-3 font-semibold">Capacity</th>
                  <th className="text-right py-3 font-semibold">Full Day Dubai</th>
                  <th className="text-right py-3 font-semibold">Full Day Abu Dhabi</th>
                  <th className="text-right py-3 font-semibold">Half Day Dubai</th>
                  <th className="text-right py-3 font-semibold">Transfer (DXB)</th>
                </tr>
              </thead>
              <tbody>
                {vehicleRates.map((v) => (
                  <tr key={v.vehicle} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                    <td className="py-3 font-medium">{v.vehicle}</td>
                    <td className="py-3">{v.capacity} guests</td>
                    <td className="py-3 text-right">AED {v.fullDayDubai}</td>
                    <td className="py-3 text-right">AED {v.fullDayAbuDhabi}</td>
                    <td className="py-3 text-right">AED {v.halfDayDubai}</td>
                    <td className="py-3 text-right">AED {v.transferDXB}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-8 md:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent" />
        <div className="absolute -right-20 -bottom-20 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 space-y-6 max-w-4xl">
          <Badge variant="gold" className="mb-2 inline-flex items-center gap-2 backdrop-blur-lg bg-white/10 border border-white/10">
            <Sparkles className="h-3 w-3" />
            Training Playbook v2025.12
          </Badge>

          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 md:p-10 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-white drop-shadow-lg">
              Curating the Extraordinary.
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl leading-relaxed mt-3">
              Your command center for crafting world-class UAE journeys. Quote faster, upsell smarter, and deliver perfection.
            </p>

            <div className="flex flex-wrap gap-3 mt-6">
              <Button
                size="lg"
                onClick={() => onNavigate('calculator')}
                className="bg-gradient-to-r from-amber-400 to-orange-500 text-black font-semibold shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:scale-105 transition-all"
              >
                <Calculator className="h-4 w-4 mr-2" />
                Start Quoting
              </Button>
              <Button
                size="lg"
                onClick={() => onNavigate('tours')}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Explore Tours
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Tabs */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Dashboard Views
          </CardTitle>
          <CardDescription>Switch between core data sets</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
            <TabsList className="flex flex-wrap gap-2">
              <TabsTrigger value="tours">Tours Available</TabsTrigger>
              <TabsTrigger value="catalog">Catalog Products</TabsTrigger>
              <TabsTrigger value="scripts">Script Templates</TabsTrigger>
              <TabsTrigger value="combos">Combo Packages</TabsTrigger>
              <TabsTrigger value="vehicles">Vehicle Options</TabsTrigger>
            </TabsList>
            <div className="pt-4">{renderContent()}</div>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <Card 
            key={stat.label} 
            variant="elevated" 
            className={`animate-spring-in hover:shadow-elevated transition-all duration-300 cursor-pointer group delay-${index}`}
          >
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-muted ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-3xl font-display font-bold group-hover:text-primary transition-colors">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Brand Philosophy Quick View */}
      <Card variant="gradient">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Brand Philosophy — ATIS Essentials
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {brandPillars.map((pillar) => (
              <div key={pillar.name} className="text-center p-4">
                <div className="text-3xl mb-2">{pillar.icon}</div>
                <h4 className="font-semibold">{pillar.name}</h4>
                <p className="text-xs text-muted-foreground mt-1">{pillar.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Training Modules */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Training Modules
            </CardTitle>
            <CardDescription>Your learning progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {trainingModules.map((module, index) => (
              <div 
                key={module.title}
                className={`p-4 rounded-lg bg-muted/50 hover:bg-muted hover:shadow-soft transition-all duration-300 cursor-pointer animate-slide-up hover:scale-[1.02] delay-${index}`}
                onClick={() => onNavigate(module.tab)}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-background">
                    <module.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-sm">{module.title}</h4>
                      <span className="text-xs text-muted-foreground">{module.progress}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{module.description}</p>
                    <Progress value={module.progress} className="h-1.5" />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Jump to frequently used tools</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-between group"
              onClick={() => onNavigate('calculator')}
            >
              <span className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Build a Quote
              </span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-between group"
              onClick={() => onNavigate('scripts')}
            >
              <span className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Copy WhatsApp Script
              </span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-between group"
              onClick={() => onNavigate('tours')}
            >
              <span className="flex items-center gap-2">
                <Map className="h-4 w-4" />
                Browse Tours
              </span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-between group"
              onClick={() => onNavigate('reference')}
            >
              <span className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                SOPs & Policies
              </span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Today's Focus */}
      <Card variant="navy">
        <CardHeader>
          <CardTitle className="text-sidebar-foreground flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Daily Reminder
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sidebar-foreground/80">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg bg-sidebar-accent">
              <h4 className="font-semibold mb-1">Before Quoting</h4>
              <p className="text-sm text-sidebar-foreground/70">Always verify the client's pickup zone first</p>
            </div>
            <div className="p-4 rounded-lg bg-sidebar-accent">
              <h4 className="font-semibold mb-1">Top Margin Tours</h4>
              <p className="text-sm text-sidebar-foreground/70">Hot Air Balloon + Buggy combos yield highest profits</p>
            </div>
            <div className="p-4 rounded-lg bg-sidebar-accent">
              <h4 className="font-semibold mb-1">Service Standard</h4>
              <p className="text-sm text-sidebar-foreground/70">Luxury • Warmth • Clarity • Diplomacy</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
