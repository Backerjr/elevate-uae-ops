import { useState, useRef, useEffect } from 'react';
import { tours, type Tour } from '@/data/playbook-data';
import { Send, Sparkles, Loader2, Play, Wind, Heart, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// --- SENTIENT LOGIC ENGINE ---
// Maps sensory keywords to catalog assets
const analyzeIntent = (input: string): Tour[] => {
  const text = input.toLowerCase();
  const scores = tours.map(tour => {
    let score = 0;
    const metadata = [
      tour.name, 
      tour.category, 
      ...tour.highlights, 
      ...tour.visualCues,
      ...(tour.tags || [])
    ].join(' ').toLowerCase();

    // 1. Thrill Vectors
    if (text.includes('fast') || text.includes('speed') || text.includes('thrill') || text.includes('adventure')) {
      if (metadata.includes('buggy') || metadata.includes('ferrari')) score += 5;
      if (metadata.includes('jet') || metadata.includes('quad')) score += 3;
    }

    // 2. Romance/Serenity Vectors (Added 'silence', 'peace')
    if (text.includes('quiet') || text.includes('romantic') || text.includes('love') || text.includes('couple') || text.includes('silence') || text.includes('peace')) {
      if (metadata.includes('balloon') || metadata.includes('dinner') || metadata.includes('private')) score += 5;
      if (metadata.includes('sunset') || metadata.includes('star')) score += 3;
    }

    // 3. Culture Vectors
    if (text.includes('history') || text.includes('culture') || text.includes('museum') || text.includes('art')) {
      if (metadata.includes('mosque') || metadata.includes('louvre') || metadata.includes('heritage')) score += 5;
    }

    // 4. Luxury Vectors
    if (text.includes('luxury') || text.includes('vip') || text.includes('expensive')) {
      if (tour.margin === 'high') score += 3;
      if (metadata.includes('yacht') || metadata.includes('limo')) score += 4;
    }

    // 5. Temporal Vectors (Morning vs Night)
    if (text.includes('morning') || text.includes('sunrise')) {
      if (metadata.includes('morning') || metadata.includes('sunrise')) score += 4;
    }
    if (text.includes('night') || text.includes('evening') || text.includes('dinner')) {
      if (metadata.includes('evening') || metadata.includes('dinner') || metadata.includes('sunset')) score += 4;
    }

    return { tour, score };
  });

  return scores
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3) // Return top 3 matches
    .map(s => s.tour);
};

export function TourRecommender() {
  const [query, setQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [results, setResults] = useState<Tour[] | null>(null);
  const [step, setStep] = useState<'idle' | 'analyzing' | 'presenting'>('idle');

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setStep('analyzing');
    setIsThinking(true);

    // Simulate AI "Thought Process"
    setTimeout(() => {
      const recommendations = analyzeIntent(query);
      setResults(recommendations);
      setIsThinking(false);
      setStep('presenting');
    }, 1500);
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center relative w-full max-w-5xl mx-auto px-4">
      
      {/* BACKGROUND ATMOSPHERE */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[100px] animate-pulse-slow" />
      </div>

      {/* IDLE STATE: THE PROMPT */}
      {step === 'idle' && (
        <div className="z-10 w-full max-w-2xl text-center space-y-8 animate-in fade-in zoom-in-95 duration-700">
          <div className="space-y-4">
            <Badge className="bg-white/10 hover:bg-white/20 text-amber-400 border-amber-500/30 px-4 py-1.5 uppercase tracking-[0.3em] backdrop-blur-md">
              <Sparkles className="w-3 h-3 mr-2" />
              Concierge AI
            </Badge>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter drop-shadow-2xl">
              DREAM. <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">MANIFEST.</span>
            </h1>
            <p className="text-lg text-white/50 font-light max-w-lg mx-auto leading-relaxed">
              Don't search. Just tell me what you feel. <br />
              <span className="italic text-white/80">"I want speed in the morning and silence at night."</span>
            </p>
          </div>

          <form onSubmit={handleSimulate} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-purple-600 rounded-2xl opacity-20 group-hover:opacity-40 blur transition duration-500" />
            <div className="relative flex items-center bg-[#0A0C14] border border-white/10 rounded-2xl p-2 shadow-2xl">
              <Input 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Describe your perfect day..." 
                className="border-none bg-transparent text-xl p-4 text-white placeholder:text-white/20 focus-visible:ring-0"
                autoFocus
              />
              <Button size="icon" type="submit" className="h-12 w-12 rounded-xl bg-white text-black hover:bg-amber-400 transition-colors">
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </form>

          {/* Quick Prompts */}
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            {[
              { icon: Zap, label: "Adrenaline Rush" },
              { icon: Heart, label: "Romantic Evening" },
              { icon: Wind, label: "Desert Silence" }
            ].map((item, i) => (
              <button
                key={i}
                onClick={() => setQuery(item.label)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 hover:border-amber-500/30 text-xs font-medium text-white/60 transition-all"
              >
                <item.icon className="w-3 h-3" />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ANALYZING STATE */}
      {step === 'analyzing' && (
        <div className="z-10 flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-500">
          <div className="relative">
            <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-xl animate-pulse" />
            <Loader2 className="w-16 h-16 text-amber-400 animate-spin relative z-10" />
          </div>
          <p className="text-xl font-mono text-amber-200/80 tracking-widest uppercase animate-pulse">
            Weaving Narrative...
          </p>
        </div>
      )}

      {/* PRESENTING STATE */}
      {step === 'presenting' && results && (
        <div className="z-10 w-full animate-in fade-in slide-in-from-bottom-12 duration-700">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-light text-white/80">
              I have curated <span className="text-amber-400 font-bold">{results.length} experiences</span> for you.
            </h2>
            <Button variant="ghost" onClick={() => { setStep('idle'); setQuery(''); }} className="text-white/40 hover:text-white">
              Dream Again
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {results.length > 0 ? (
              results.map((tour, idx) => (
                <Card 
                  key={tour.id} 
                  className="group relative overflow-hidden border-none bg-transparent hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-500"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black z-10" />
                  <img 
                    src={tour.image} 
                    alt={tour.name} 
                    className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[1.5s]" 
                  />
                  
                  <div className="relative z-20 h-96 flex flex-col justify-end p-6">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <Badge className="bg-amber-500/90 text-black mb-3 backdrop-blur-md">Match {(98 - idx * 5)}%</Badge>
                      <h3 className="text-2xl font-bold text-white mb-2 leading-tight">{tour.name}</h3>
                      <p className="text-white/70 text-sm line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        {tour.proTip || tour.highlights[0]}
                      </p>
                      <Button className="w-full bg-white/10 hover:bg-white text-white hover:text-black backdrop-blur-md border border-white/20">
                        View Itinerary
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <p className="text-white/40 text-lg">My vision is clouded. Try a different desire.</p>
                <Button variant="link" onClick={() => { setStep('idle'); setQuery(''); }} className="text-amber-500 mt-4">
                  Reset Vision
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}