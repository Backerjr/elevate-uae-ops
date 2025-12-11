import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { whatsappScripts, type WhatsAppScript } from '@/data/playbook-data';
import { MessageSquare, Copy, Check, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const categoryIcons: Record<string, string> = {
  'inquiry': '💬',
  'culture': '🕌',
  'price': '💰',
  'objection': '🤝',
  'upsell': '⬆️',
  'confirmation': '✅',
  'emergency': '🚨',
};

const categoryColors: Record<string, any> = {
  'inquiry': 'info',
  'culture': 'success',
  'price': 'gold',
  'objection': 'warning',
  'upsell': 'default',
  'confirmation': 'success',
  'emergency': 'destructive',
};

export function ScriptLibrary() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const filteredScripts = whatsappScripts.filter(script => {
    const matchesSearch = 
      script.scenario.toLowerCase().includes(searchQuery.toLowerCase()) ||
      script.script.toLowerCase().includes(searchQuery.toLowerCase()) ||
      script.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !filterCategory || script.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(whatsappScripts.map(s => s.category)));

  const copyScript = (script: WhatsAppScript) => {
    navigator.clipboard.writeText(script.script);
    setCopiedId(script.id);
    toast.success('Script copied! Ready to paste in WhatsApp');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-display font-semibold flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            WhatsApp Script Library
          </h2>
          <p className="text-muted-foreground mt-1">
            Sales-ready replies for every scenario. Click to copy.
          </p>
        </div>
        
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search scripts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filterCategory === null ? 'gold' : 'outline'}
          size="sm"
          onClick={() => setFilterCategory(null)}
        >
          <Filter className="h-3.5 w-3.5 mr-1.5" />
          All
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

      {/* Scripts Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredScripts.map((script, index) => (
          <Card 
            key={script.id} 
            variant="elevated"
            className="animate-slide-up cursor-pointer group hover:scale-[1.01] transition-all duration-300"
            style={{ animationDelay: `${index * 0.05}s` }}
            onClick={() => copyScript(script)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{categoryIcons[script.category]}</span>
                    <Badge variant={categoryColors[script.category]}>
                      {script.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-base">{script.scenario}</CardTitle>
                </div>
                <Button
                  variant={copiedId === script.id ? 'success' : 'ghost'}
                  size="icon-sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    copyScript(script);
                  }}
                >
                  {copiedId === script.id ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed bg-muted/50 rounded-lg p-3">
                "{script.script}"
              </p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {script.tags.map(tag => (
                  <Badge key={tag} variant="muted" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredScripts.length === 0 && (
        <Card variant="muted" className="py-12 text-center">
          <p className="text-muted-foreground">No scripts found matching your search.</p>
        </Card>
      )}
    </div>
  );
}
