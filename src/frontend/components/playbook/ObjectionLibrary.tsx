import React, { useState, useMemo } from 'react';
import { 
  ShieldAlert, 
  ChevronDown, 
  ChevronUp, 
  Zap, 
  AlertTriangle, 
  CheckCircle2, 
  Search 
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// --- Types ---
// In a real app, import this from your data file
interface Objection {
  id: string;
  category: 'price' | 'timing' | 'trust' | 'authority' | 'competition' | 'logistics';
  trigger: string;
  response: string;
  proTip?: string;
  severity: 'low' | 'medium' | 'high';
}

// --- Mock Data (Replace with import from @/data/objection-handling) ---
const objections: Objection[] = [
  {
    id: 'price-too-high',
    category: 'price',
    trigger: "It's too expensive compared to online sites.",
    response: "I totally get that price is a factor. The online rate often strips out the private transfer, the specific dune bashing timing (sunset), and the flexibility to leave when you want. With us, you're paying for the guarantee that your 3 PM pickup is actually at 3 PM, not a window.",
    proTip: "Pivot to 'Value vs Cost'. Ask if they've ever been stranded by a budget tour.",
    severity: 'high'
  },
  {
    id: 'timing-later',
    category: 'timing',
    trigger: "We want to book closer to the date.",
    response: "That's completely fine, but just a heads-up: our private fleet is allocated first-come, first-serve. If you wait until the day before, I might only have the standard vans left, not the Lexus or the Land Cruiser you wanted.",
    proTip: "Create scarcity based on vehicle availability, not just 'spots'.",
    severity: 'medium'
  },
  {
    id: 'competition-cheaper',
    category: 'competition',
    trigger: "I found a cheaper safari on Groupon.",
    response: "Groupon deals are great for saving money, but they usually mean sharing a car with 6 strangers and a rigid schedule. Since this is your honeymoon/special trip, did you want that level of unpredictability, or did you want me to handle the quality control?",
    severity: 'medium'
  },
  {
    id: 'trust-deposit',
    category: 'trust',
    trigger: "Why do I need to pay a deposit?",
    response: "The deposit secures the specific vehicle and guide for your slot. Without it, the system automatically releases the car to other agents. It's fully refundable up to 24 hours before.",
    severity: 'low'
  },
  {
    id: 'authority-spouse',
    category: 'authority',
    trigger: "I need to ask my husband/wife first.",
    response: "Of course! While you do that, do you want me to put a temporary 2-hour hold on this specific sunset slot? It's our most popular one.",
    proTip: "Soft close with a temporary hold to keep the lead alive.",
    severity: 'low'
  }
];

// --- Components ---

const SeverityBadge = ({ level }: { level: Objection['severity'] }) => {
  const colors = {
    low: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    high: "bg-red-500/10 text-red-400 border-red-500/20"
  };
  
  const icons = {
    low: <CheckCircle2 className="w-3 h-3 mr-1" />,
    medium: <AlertTriangle className="w-3 h-3 mr-1" />,
    high: <Zap className="w-3 h-3 mr-1" />
  };

  return (
    <Badge variant="outline" className={cn("capitalize border", colors[level])}>
      {icons[level]} {level} Severity
    </Badge>
  );
};

const ObjectionCard = ({ objection }: { objection: Objection }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="group overflow-hidden border-white/10 bg-card/40 hover:bg-card/60 transition-all duration-300 backdrop-blur-sm">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="p-5 cursor-pointer flex items-start justify-between gap-4"
      >
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="bg-white/5 text-muted-foreground hover:bg-white/10 capitalize">
              {objection.category}
            </Badge>
            <SeverityBadge level={objection.severity} />
          </div>
          <h3 className="text-lg font-medium text-foreground group-hover:text-primary transition-colors">
            "{objection.trigger}"
          </h3>
        </div>
        <Button size="icon" variant="ghost" className="text-muted-foreground shrink-0">
          {isOpen ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </div>

      <div className={cn(
        "grid transition-all duration-300 ease-in-out bg-black/20",
        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      )}>
        <div className="min-h-0 overflow-hidden">
          <div className="p-5 pt-0 border-t border-white/5 space-y-4">
            
            {/* The Script */}
            <div className="space-y-2 mt-4">
              <span className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                <Zap className="w-3 h-3" /> Recommended Script
              </span>
              <p className="text-base leading-relaxed text-white/90 bg-white/5 p-4 rounded-lg border-l-2 border-primary">
                "{objection.response}"
              </p>
            </div>

            {/* Pro Tip */}
            {objection.proTip && (
              <div className="flex items-start gap-3 text-sm text-muted-foreground bg-blue-500/5 p-3 rounded-md border border-blue-500/10">
                <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <p><span className="text-blue-400 font-semibold">Pro Tip:</span> {objection.proTip}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export function ObjectionLibrary() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Derive categories from data
  const categories = ['all', ...Array.from(new Set(objections.map(o => o.category)))];

  const filteredObjections = useMemo(() => {
    return objections.filter(obj => {
      const matchesSearch = obj.trigger.toLowerCase().includes(search.toLowerCase()) || 
                            obj.response.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeFilter === 'all' || obj.category === activeFilter;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeFilter]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card/30 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
        <div className="space-y-1">
          <h2 className="text-2xl font-display font-bold text-primary flex items-center gap-2">
            <ShieldAlert className="w-6 h-6" />
            Objection Dojo
          </h2>
          <p className="text-sm text-muted-foreground">
            Master the art of the pivot. Turn "No" into "Booked".
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search triggers..." 
            className="pl-10 bg-black/20 border-white/10 focus:border-primary/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-all capitalize border",
              activeFilter === cat
                ? "bg-primary text-black border-primary shadow-glow"
                : "bg-card/50 text-muted-foreground border-transparent hover:bg-white/10 hover:text-foreground"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredObjections.length > 0 ? (
          filteredObjections.map((obj) => (
            <ObjectionCard key={obj.id} objection={obj} />
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <ShieldAlert className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>No objections found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}