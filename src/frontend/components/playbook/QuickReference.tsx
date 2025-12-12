import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { sopRules, cheatCodes, brandPillars } from '@/data/playbook-data';
import { whatsappScripts, objectionHandlers } from '@/data';
import { AlertTriangle, Lightbulb, Target, Copy, Check, ShieldAlert, MessageSquare } from 'lucide-react';
import { importanceColors, categoryIcons, cheatTypeColors } from '@/lib/quick-reference-utils';

export function QuickReference() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

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
            <Lightbulb className="h-5 w-5 text-primary" />
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

      {/* Sales Tools */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Sales Tools — Communication & Objections
          </CardTitle>
          <CardDescription>Copy-ready WhatsApp templates and objection handling scripts</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="templates">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="templates">WhatsApp Templates</TabsTrigger>
              <TabsTrigger value="objections">Objection Handling</TabsTrigger>
            </TabsList>

            <TabsContent value="templates" className="pt-4">
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {whatsappScripts.map((script) => (
                  <Card key={script.id} variant="elevated" className="h-full flex flex-col">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <CardTitle className="text-base">{script.title}</CardTitle>
                          <Badge variant="info" className="mt-2">{script.category}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col gap-3">
                      <p className="text-sm text-muted-foreground line-clamp-4 whitespace-pre-line">{script.content}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {script.tags.map((tag) => (
                          <Badge key={tag} variant="muted" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="mt-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-between"
                          onClick={() => handleCopy(script.id, script.content)}
                        >
                          <span className="flex items-center gap-2">
                            {copiedId === script.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            {copiedId === script.id ? "Copied" : "Copy to Clipboard"}
                          </span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="objections" className="pt-4">
              <Accordion type="single" collapsible className="space-y-2">
                {objectionHandlers.map((item) => (
                  <AccordionItem value={item.id} key={item.id} className="border border-border rounded-lg px-3">
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="h-4 w-4 text-warning" />
                        <span>{item.objection}</span>
                        <Badge variant="warning" className="ml-2">{item.category}</Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3 pb-4">
                      <p className="text-sm text-foreground">{item.response}</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {item.bulletPoints.map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
