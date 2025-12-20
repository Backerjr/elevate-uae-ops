import { useState } from 'react';
import { whatsappScripts, sopRules, type WhatsAppScript } from '@/data/playbook-data';
import { Search, Copy, Check, MessageSquare, Shield, AlertTriangle, Zap, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function CommunicationLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // --- FILTER LOGIC ---
  const categories = ['all', 'inquiry', 'objection', 'upsell', 'confirmation', 'culture', 'emergency'];

  const filteredScripts = whatsappScripts.filter(script => {
    const matchesCategory = activeCategory === 'all' || script.category === activeCategory;
    const matchesSearch = script.scenario.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          script.script.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Script copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER SECTION */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0A0C14] p-8 md:p-12">
        <div className="absolute top-0 right-0 p-4 opacity-20">
          <MessageSquare className="w-32 h-32 text-amber-500" />
        </div>
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest">
            <Zap className="w-3 h-3" />
            <span>Tactical Comms</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            COMMUNICATION <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-600">MATRIX</span>
          </h1>
          <p className="text-white/60 max-w-xl text-lg font-light">
            Precision-engineered scripts for every scenario. Eliminate hesitation. Dominate the conversation.
          </p>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="sticky top-24 z-30 bg-[#02040A]/90 backdrop-blur-xl border-y border-white/5 py-4 -mx-4 px-4 md:mx-0 md:px-0 md:bg-transparent md:backdrop-blur-none md:border-none">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar mask-gradient-x">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap border",
                  activeCategory === cat
                    ? "bg-amber-500 text-black border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                    : "bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:text-white"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input 
              placeholder="Search scripts..." 
              className="pl-10 bg-[#0A0C14] border-white/10 focus:border-amber-500/50 focus:bg-white/5 transition-all text-white placeholder:text-gray-600 rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* SCRIPTS COLUMN (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-bold text-white tracking-wide">ACTIVE SCRIPTS</h2>
          </div>
          
          <div className="grid gap-4">
            {filteredScripts.length > 0 ? (
              filteredScripts.map((script) => (
                <Card 
                  key={script.id} 
                  className="group relative bg-[#0A0C14] border border-white/5 hover:border-amber-500/30 transition-all duration-300 hover:shadow-lg overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-[10px] border-white/10 text-gray-400 uppercase">
                            {script.category}
                          </Badge>
                          {script.tags.map(tag => (
                            <span key={tag} className="text-[10px] text-amber-500/80 font-mono">#{tag}</span>
                          ))}
                        </div>
                        <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                          {script.scenario}
                        </h3>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleCopy(script.script, script.id)}
                        className="text-gray-400 hover:text-white hover:bg-white/10"
                      >
                        {copiedId === script.id ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                      </Button>
                    </div>
                    
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5 relative group-hover:bg-white/[0.07] transition-colors">
                      <p className="text-gray-300 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                        {script.script}
                      </p>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
                <Filter className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                <p className="text-gray-500">No signals found matching your parameters.</p>
              </div>
            )}
          </div>
        </div>

        {/* SOP SIDEBAR (1/3 width) */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-red-500" />
            <h2 className="text-xl font-bold text-white tracking-wide">CRITICAL PROTOCOLS (SOP)</h2>
          </div>

          <div className="space-y-4">
            {sopRules.map((rule) => (
              <Card 
                key={rule.id} 
                className={cn(
                  "bg-[#0A0C14] border p-5 transition-all duration-300",
                  rule.importance === 'critical' ? "border-red-500/30 hover:border-red-500/60" : "border-white/5 hover:border-white/20"
                )}
              >
                <div className="flex items-start gap-3">
                  {rule.importance === 'critical' ? (
                    <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  ) : (
                    <Shield className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h4 className={cn(
                      "text-sm font-bold uppercase tracking-wider mb-1",
                      rule.importance === 'critical' ? "text-red-400" : "text-white"
                    )}>
                      {rule.title}
                    </h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {rule.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
            
            {/* Quick Tips Box */}
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6 mt-8">
              <h4 className="text-amber-500 font-bold uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
                <Zap className="w-3 h-3" />
                Pro Operator Tip
              </h4>
              <p className="text-amber-100/80 text-sm italic">
                "Always confirm the pickup zone BEFORE quoting the final price. A Mis-quoted transfer is a loss on your margin."
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}