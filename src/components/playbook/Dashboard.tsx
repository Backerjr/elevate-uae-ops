import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { tours, vehicleRates, whatsappScripts, comboPackages, brandPillars } from '@/data/playbook-data';
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
import './Dashboard.css';

type TabId = 'tours' | 'calculator' | 'scripts' | 'pricing' | 'reference';

interface DashboardProps {
  onNavigate: (tab: TabId) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const quickStats = [
    { label: 'Tours Available', value: tours.length, icon: Map, color: 'text-info' },
    { label: 'Script Templates', value: whatsappScripts.length, icon: MessageSquare, color: 'text-success' },
    { label: 'Combo Packages', value: comboPackages.length, icon: TrendingUp, color: 'text-primary' },
    { label: 'Vehicle Options', value: vehicleRates.length, icon: Calculator, color: 'text-accent' },
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

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-hero p-8 md:p-12">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L2c+PC9zdmc+')] opacity-30" />
        
        <div className="relative z-10">
          <Badge variant="gold" className="mb-4">
            <Sparkles className="h-3 w-3 mr-1" />
            Training Playbook v2025.12
          </Badge>
          
          <h1 className="text-3xl md:text-4xl font-display font-bold text-sidebar-foreground mb-3">
            Welcome to Ahmed Travel
          </h1>
          <p className="text-sidebar-foreground/80 max-w-xl mb-6">
            Master high-touch, luxury travel experiences in the UAE. This playbook is your foundation for quoting fluently, upselling naturally, and coordinating seamless journeys.
          </p>
          
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="gold" 
              size="lg" 
              onClick={() => onNavigate('calculator')}
              className="shadow-glow hover:shadow-elevated transition-all duration-300 hover:scale-105"
            >
              <Calculator className="h-4 w-4 mr-2" />
              Start Quoting
            </Button>
            <Button 
              variant="glass-dark" 
              size="lg" 
              onClick={() => onNavigate('tours')}
              className="hover:bg-sidebar-accent/90 transition-all duration-300"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Explore Tours
            </Button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute right-20 top-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl animate-float" />
      </div>

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
