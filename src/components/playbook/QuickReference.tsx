import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { sopRules, cheatCodes, brandPillars } from '@/data/playbook-data';
import { AlertTriangle, Lightbulb, Heart, Shield, Zap, Target } from 'lucide-react';

const importanceColors = {
  critical: 'destructive',
  important: 'warning',
  standard: 'muted',
} as const;

const categoryIcons: Record<string, React.ReactNode> = {
  policy: <Shield className="h-4 w-4" />,
  process: <Zap className="h-4 w-4" />,
  communication: <Heart className="h-4 w-4" />,
  safety: <AlertTriangle className="h-4 w-4" />,
};

const cheatTypeColors = {
  value: 'success',
  margin: 'gold',
  budget: 'info',
  upsell: 'default',
} as const;

export function QuickReference() {
  return (
    <div className="space-y-8">
      {/* Brand Philosophy */}
      <Card variant="gradient">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Brand Philosophy — ATIS Essentials
          </CardTitle>
          <CardDescription>Our service standards rooted in four pillars</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {brandPillars.map((pillar, index) => (
              <div 
                key={pillar.name}
                className="p-4 rounded-xl bg-card shadow-soft hover:shadow-elevated transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-3xl mb-3">{pillar.icon}</div>
                <h4 className="font-display font-semibold text-lg mb-1">{pillar.name}</h4>
                <p className="text-sm text-muted-foreground">{pillar.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Essential SOPs */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Essential SOPs
          </CardTitle>
          <CardDescription>Critical policies and procedures to memorize</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {sopRules.map((rule, index) => (
              <div 
                key={rule.id}
                className={`p-4 rounded-lg border-l-4 bg-muted/30 animate-slide-up ${
                  rule.importance === 'critical' 
                    ? 'border-l-destructive' 
                    : rule.importance === 'important'
                      ? 'border-l-warning'
                      : 'border-l-border'
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-background">
                    {categoryIcons[rule.category]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm">{rule.title}</h4>
                      <Badge variant={importanceColors[rule.importance]} className="text-xs">
                        {rule.importance}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{rule.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cheat Codes */}
      <Card variant="navy">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sidebar-foreground">
            <Lightbulb className="h-5 w-5 text-primary" />
            Internal Cheat Codes
          </CardTitle>
          <CardDescription className="text-sidebar-foreground/70">
            Sales & margin tips for quick wins
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {cheatCodes.map((code, index) => (
              <div 
                key={code.id}
                className="p-4 rounded-lg bg-sidebar-accent animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={cheatTypeColors[code.type]}>
                    {code.type === 'value' && '🎯'}
                    {code.type === 'margin' && '💰'}
                    {code.type === 'budget' && '💵'}
                    {code.type === 'upsell' && '⬆️'}
                    {code.type.charAt(0).toUpperCase() + code.type.slice(1)}
                  </Badge>
                </div>
                <h4 className="font-semibold text-sidebar-foreground mb-1">{code.title}</h4>
                <p className="text-sm text-sidebar-foreground/80">{code.details}</p>
                {code.priceRange && (
                  <p className="text-sm font-medium text-primary mt-2">{code.priceRange}</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contacts Card */}
      <Card variant="outline" className="border-destructive/30">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Emergency Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/20">
              <h4 className="font-semibold text-sm mb-1">Cancellation Requests</h4>
              <p className="text-sm text-muted-foreground">
                Email: <span className="font-mono text-primary">online@raynab2b.com</span>
              </p>
            </div>
            <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/20">
              <h4 className="font-semibold text-sm mb-1">Activity Waivers</h4>
              <p className="text-sm text-muted-foreground">
                <a href="https://raynawaiver.raynab2b.com/" target="_blank" rel="noopener" className="text-primary hover:underline">
                  raynawaiver.raynab2b.com
                </a>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
