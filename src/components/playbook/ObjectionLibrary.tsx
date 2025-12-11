import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';

interface ObjectionHandler {
  id: string;
  objection: string;
  category: 'price' | 'trust' | 'timing' | 'comparison' | 'indecision';
  severity: 'common' | 'tricky' | 'rare';
  response: string;
  followUp: string;
  proTip: string;
}

const objectionHandlers: ObjectionHandler[] = [
  {
    id: 'too-expensive',
    objection: "It's too expensive / That's more than I expected",
    category: 'price',
    severity: 'common',
    response: "I completely understand! Many guests feel the same initially. Our pricing includes premium private service, expert guides, and all-inclusive experiences. Let me show you our sharing-basis options that offer the same quality at better value — would that interest you?",
    followUp: "What budget range were you thinking? I can customize a package that gives you the best experience within that.",
    proTip: "Never immediately discount. First, highlight value. If needed, offer sharing basis or remove add-ons."
  },
  {
    id: 'found-cheaper',
    objection: "I found the same tour cheaper elsewhere",
    category: 'comparison',
    severity: 'tricky',
    response: "Thank you for sharing that! I'd love to understand what's included in that offer. Often, lower prices mean shared vehicles with many strangers, no English guides, or hidden fees. Our tours include private transfers, certified guides, and full transparency. May I ask what's included in the other offer?",
    followUp: "Would you like me to match their offer while maintaining our premium service standards?",
    proTip: "Ask what's included. Usually competitors skip pickup, use shared buses, or have hidden costs."
  },
  {
    id: 'need-time',
    objection: "I need to think about it / discuss with family",
    category: 'indecision',
    severity: 'common',
    response: "Of course, take your time! Many of our best experiences book out quickly, especially during peak season. Shall I hold this slot for 24 hours while you decide? No payment needed yet.",
    followUp: "Is there anything specific I can clarify that would help with the decision?",
    proTip: "Create urgency without pressure. Offer to hold slots. Ask what information would help them decide."
  },
  {
    id: 'not-sure-tour',
    objection: "I'm not sure which tour to choose",
    category: 'indecision',
    severity: 'common',
    response: "That's completely normal — we have so many amazing options! Let me help narrow it down. What excites you most: culture and history, adventure and thrills, or scenic photography? And how much time do you have?",
    followUp: "Based on what you've told me, I'd recommend [X] — it's perfect for [reason]. Would you like more details?",
    proTip: "Use the Tour Recommender tool to quickly find the best match based on their preferences."
  },
  {
    id: 'bad-reviews',
    objection: "I've read some bad reviews about tours in Dubai",
    category: 'trust',
    severity: 'tricky',
    response: "I appreciate you bringing that up — it shows you're doing your research! Unfortunately, there are some operators who cut corners. Ahmed Travel has a 4.9★ rating because we prioritize quality over quantity. Every guide is certified, every vehicle is premium, and every guest gets personalized attention. Would you like to see some recent testimonials?",
    followUp: "I can also share photos from recent tours if that helps!",
    proTip: "Acknowledge concerns, differentiate your service, and offer social proof."
  },
  {
    id: 'weather-concern',
    objection: "What if the weather is bad?",
    category: 'timing',
    severity: 'common',
    response: "Great question! For outdoor activities like hot air balloons, your safety is our priority — if weather prevents the activity, you get a full refund or free rebooking. For city tours, rain is rare in UAE, but even then, many attractions are indoor. Rest assured, you're protected.",
    followUp: "Would you like me to check the weather forecast for your dates?",
    proTip: "Always reassure about refund/rebooking policies. UAE weather is generally excellent."
  },
  {
    id: 'kids-friendly',
    objection: "Is this suitable for kids?",
    category: 'trust',
    severity: 'common',
    response: "Absolutely! We specialize in family experiences. Our private vehicles have child seats available, guides are trained to engage kids, and we can customize timing around nap schedules. Which ages are your little ones?",
    followUp: "For families, I especially recommend [tour] — kids love the [specific feature]!",
    proTip: "Always ask ages. Some activities have restrictions (balloons: 5+, quads: 16+). Recommend family-friendly alternatives."
  },
  {
    id: 'last-minute',
    objection: "Can I book for tomorrow?",
    category: 'timing',
    severity: 'rare',
    response: "Let me check availability right now! While some experiences need advance booking, we often have last-minute slots. Give me one moment... [check]. Great news — I can confirm [tour] for tomorrow. Shall I reserve it?",
    followUp: "Payment can be processed immediately via our secure link.",
    proTip: "Never say no immediately. Check availability. If unavailable, offer alternatives."
  }
];

const categoryIcons: Record<string, string> = {
  price: '💰',
  trust: '🤝',
  timing: '⏰',
  comparison: '⚖️',
  indecision: '🤔',
};

const severityColors = {
  common: 'muted',
  tricky: 'warning',
  rare: 'info',
} as const;

export function ObjectionLibrary() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const filteredHandlers = filterCategory
    ? objectionHandlers.filter(h => h.category === filterCategory)
    : objectionHandlers;

  const categories = Array.from(new Set(objectionHandlers.map(h => h.category)));

  const copyResponse = (handler: ObjectionHandler) => {
    navigator.clipboard.writeText(handler.response);
    setCopiedId(handler.id);
    toast.success('Response copied!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-semibold flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          Objection Handling Playbook
        </h2>
        <p className="text-muted-foreground mt-1">
          Turn objections into opportunities with proven responses
        </p>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filterCategory === null ? 'gold' : 'outline'}
          size="sm"
          onClick={() => setFilterCategory(null)}
        >
          All Objections
        </Button>
        {categories.map(cat => (
          <Button
            key={cat}
            variant={filterCategory === cat ? 'gold' : 'outline'}
            size="sm"
            onClick={() => setFilterCategory(cat)}
          >
            {categoryIcons[cat]} {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </Button>
        ))}
      </div>

      {/* Objection Cards */}
      <div className="space-y-4">
        {filteredHandlers.map((handler, index) => (
          <Card 
            key={handler.id}
            variant="elevated"
            className={`animate-slide-up transition-all duration-300 ${
              expandedId === handler.id ? 'ring-2 ring-primary/30' : ''
            }`}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <CardHeader 
              className="cursor-pointer"
              onClick={() => setExpandedId(expandedId === handler.id ? null : handler.id)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xl">{categoryIcons[handler.category]}</span>
                    <Badge variant={severityColors[handler.severity]}>
                      {handler.severity}
                    </Badge>
                  </div>
                  <CardTitle className="text-base">"{handler.objection}"</CardTitle>
                </div>
                <Button variant="ghost" size="icon-sm">
                  {expandedId === handler.id ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>

            {expandedId === handler.id && (
              <CardContent className="space-y-4 animate-fade-in">
                {/* Main Response */}
                <div className="relative">
                  <div className="p-4 rounded-lg bg-success/5 border border-success/20">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-xs font-semibold text-success uppercase tracking-wide">
                        Your Response
                      </span>
                      <Button
                        variant={copiedId === handler.id ? 'success' : 'ghost'}
                        size="icon-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyResponse(handler);
                        }}
                      >
                        {copiedId === handler.id ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </div>
                    <p className="text-sm leading-relaxed">{handler.response}</p>
                  </div>
                </div>

                {/* Follow-up */}
                <div className="p-3 rounded-lg bg-info/5 border border-info/20">
                  <span className="text-xs font-semibold text-info uppercase tracking-wide">
                    Follow-up Question
                  </span>
                  <p className="text-sm mt-1">{handler.followUp}</p>
                </div>

                {/* Pro Tip */}
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                    💡 Pro Tip
                  </span>
                  <p className="text-sm text-muted-foreground mt-1">{handler.proTip}</p>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
