// APOTHEOSIS PROTOCOL: RECTIFICATION INITIATED
import { useState } from 'react';
import { tours, type Tour } from '@/data/playbook-data';
import { Send, Sparkles, Loader2, Zap, Heart, Wind, Clock, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

// --- THE FORESIGHT ENGINE ---
// Advanced Heuristics to Map Abstract Desire to Operational Reality
const manifestItinerary = (input: string): Tour[] => {
  const text = input.toLowerCase();
  
  // 1. Deconstruct the Dream (Identify Core Vectors)
  const wantsSpeed = text.match(/(fast|speed|thrill|adrenaline|rush|race|drive|buggy|quad|ferrari)/);
  const wantsSilence = text.match(/(quiet|silence|peace|calm|serene|private|relax|slow|gentle)/);
  const wantsRomance = text.match(/(love|romantic|couple|dinner|date|intimate)/);
  const wantsCulture = text.match(/(history|culture|museum|art|mosque|heritage|old)/);
  
  // 2. Identify Temporal Anchors
  const timeMorning = text.match(/(morning|sunrise|early|day|am)/);
  const timeNight = text.match(/(night|evening|sunset|dinner|pm|dark|stars)/);

  const scores = tours.map(tour => {
    let score = 0;
    const meta = [
      tour.name, 
      tour.category, 
      tour.pickup, 
      ...tour.highlights, 
      ...tour.visualCues,
      ...(tour.tags || [])
    ].join(' ').toLowerCase();

    // --- VECTOR SCORING ---

    // Speed Vector
    if (wantsSpeed) {
      if (meta.includes('buggy') || meta.includes('ferrari') || meta.includes('jet') || meta.includes('adventure')) score += 5;
      if (tour.difficulty === 'moderate' || tour.difficulty === 'complex') score += 2;
    }

    // Silence/Serenity Vector
    if (wantsSilence) {
      if (meta.includes('balloon') || meta.includes('cruise') || meta.includes('private') || meta.includes('view')) score += 5;
      if (meta.includes('desert') && !meta.includes('bash')) score += 3; // Quiet desert
    }

    // Romance Vector
    if (wantsRomance) {
      if (meta.includes('dinner') || meta.includes('dhow') || meta.includes('sunset') || meta.includes('couple')) score += 5;
    }

    // Culture Vector
    if (wantsCulture) {
      if (meta.includes('mosque') || meta.includes('louvre') || meta.includes('frame') || meta.includes('heritage')) score += 5;
    }

    // --- TEMPORAL SYNCHRONIZATION ---
    
    // If user asked for Morning, boost Morning tours
    if (timeMorning) {
      if (meta.includes('sunrise') || meta.includes('morning') || meta.includes('10:00')) score += 4;
    }

    // If user asked for Night, boost Night tours
    if (timeNight) {
      if (meta.includes('evening') || meta.includes('night') || meta.includes('sunset') || meta.includes('dinner') || meta.includes('7:30 pm')) score += 4;
    }

    // --- CONTEXTUAL RESONANCE ---
    // If the query is complex (Speed AND Silence), we need to make sure we don't punish "Speed" tours for not being "Silent"
    // The scorer allows high-scoring matches for *parts* of the query to bubble up.

    return { tour, score };
  });

  // 3. The Selection (Filter & Sort)
  return scores
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3) // Manifest the top 3 realities
    .map(s => s.tour);
};

export function TourRecommender() {
  const [query, setQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [results, setResults] = useState<Tour[] | null>(null);
  const [step, setStep] = useState<'idle' | 'analyzing' | 'presenting'>('idle');

  const handleManifest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setStep('analyzing');
    setIsThinking(true);

    // AI Processing Simulation
    setTimeout(() => {
      const itinerary = manifestItinerary(query);
      setResults(itinerary);
      setIsThinking(false);
      setStep('presenting');
    }, 1200);
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center relative w-full max-w-6xl mx-auto px-4">
      
      {/* ATMOSPHERIC BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-[120px] animate-pulse-slow" />
      </div>

      {/* STAGE 1: THE PROMPT */}
      {step === 'idle' && (
        <div className="z-10 w-full max-w-2xl text-center space-y-10 animate-in fade-in zoom-in-95 duration-700">
          <div className="space-y-6">
            <Badge className="bg-white/10 hover:bg-white/20 text-amber-400 border-amber-500/30 px-6 py-2 uppercase tracking-[0.4em] backdrop-blur-md shadow-[0_0_30px_rgba(245,158,11,0.2)]">
              <Sparkles className="w-4 h-4 mr-3" />
              Concierge AI v2.0
            </Badge>
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter drop-shadow-2xl leading-[0.9]">
              DREAM. <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-500 to-amber-700">MANIFEST.</span>
            </h1>
            <p className="text-xl text-white/60 font-light max-w-lg mx-auto leading-relaxed">
              The catalog is vast. Your time is finite. <br/>
              Tell me exactly what your soul requires.
            </p>
          </div>

          <form onSubmit={handleManifest} className="relative group max-w-xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-amber-200 rounded-2xl opacity-20 group-hover:opacity-50 blur-lg transition duration-500" />
            <div className="relative flex items-center bg-[#0A0C14] border border-white/10 rounded-2xl p-2 shadow-2xl">
              <Input 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., Speed in the morning, silence at night..." 
                className="border-none bg-transparent text-xl p-4 text-white placeholder:text-white/20 focus-visible:ring-0 font-light"
                autoFocus
              />
              <Button size="icon" type="submit" className="h-12 w-12 rounded-xl bg-white text-black hover:bg-amber-400 hover:scale-105 transition-all duration-300">
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </form>

          {/* Inspiration Chips */}
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { icon: Zap, text: "High Octane" },
              { icon: Moon, text: "Nocturnal Silence" },
              { icon: Heart, text: "Deep Romance" }
            ].map((chip, i) => (
              <button 
                key={i}
                onClick={() => setQuery(chip.text)}
                className="flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 hover:border-amber-500/50 text-sm font-medium text-white/50 hover:text-white transition-all duration-300"
              >
                <chip.icon className="w-3 h-3" />
                {chip.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STAGE 2: THE PROCESSING */}
      {step === 'analyzing' && (
        <div className="z-10 flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-500">
          <div className="relative">
            <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-2xl animate-ping" />
            <Loader2 className="w-20 h-20 text-amber-400 animate-spin relative z-10" />
          </div>
          <div className="text-center space-y-2">
            <p className="text-2xl font-mono text-amber-100 tracking-widest uppercase animate-pulse">
              Consulting the Playbook...
            </p>
            <p className="text-sm text-amber-500/60 font-mono tracking-widest">
              MATCHING VECTORS: [TEMPORAL] [EMOTIONAL]
            </p>
          </div>
        </div>
      )}

      {/* STAGE 3: THE REVELATION */}
      {step === 'presenting' && results && (
        <div className="z-10 w-full animate-in fade-in slide-in-from-bottom-12 duration-700">
          <div className="flex items-center justify-between mb-10 px-4">
            <div>
              <h2 className="text-3xl font-light text-white">
                Your <span className="text-amber-400 font-bold font-display">Reality</span> is Ready.
              </h2>
              <p className="text-white/40 mt-1">Based on your desire: "{query}"</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => { setStep('idle'); setQuery(''); }} 
              className="border-white/10 text-white hover:bg-white hover:text-black hover:border-white transition-all"
            >
              Manifest New Dream
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {results.length > 0 ? (
              results.map((tour, idx) => (
                <Card 
                  key={tour.id} 
                  className="group relative h-[500px] overflow-hidden border-none bg-[#0A0C14] hover:shadow-[0_0_50px_-10px_rgba(245,158,11,0.2)] transition-all duration-700"
                  style={{ animationDelay: `${idx * 150}ms` }}
                >
                  {/* Cinematic Image Layer */}
                  <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
                    <img 
                      src={tour.image} 
                      alt={tour.name} 
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[2s] ease-out" 
                    />
                  </div>
                  
                  {/* Content Layer */}
                  <div className="relative z-20 h-full flex flex-col justify-end p-8">
                    <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                      {/* Match Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <Badge className="bg-amber-500 text-black font-bold backdrop-blur-xl border-none">
                          {(98 - idx * 4)}% RESONANCE
                        </Badge>
                        {/* Temporal Indicator */}
                        {tour.pickup.toLowerCase().includes('am') || tour.pickup.toLowerCase().includes('morning') ? (
                          <Sun className="w-5 h-5 text-amber-300 animate-pulse" />
                        ) : (
                          <Moon className="w-5 h-5 text-purple-300 animate-pulse" />
                        )}
                      </div>

                      <h3 className="text-3xl font-black text-white mb-3 leading-[0.9] uppercase font-display drop-shadow-lg">
                        {tour.name}
                      </h3>
                      
                      <div className="space-y-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        <p className="text-white/80 text-sm leading-relaxed line-clamp-2">
                          {tour.proTip || tour.highlights.join(' • ')}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs font-mono text-amber-500/80 uppercase tracking-wider">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {tour.duration}</span>
                          <span className="flex items-center gap-1"><Wind className="w-3 h-3" /> {tour.category}</span>
                        </div>

                        <Button className="w-full bg-white text-black hover:bg-amber-500 hover:text-black font-bold py-6 text-lg transition-all transform hover:-translate-y-1">
                          Lock In This Reality
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-32 border border-dashed border-white/10 rounded-3xl">
                <Wind className="w-16 h-16 text-white/10 mb-4" />
                <p className="text-white/40 text-xl font-light">The signal is weak.</p>
                <Button variant="link" onClick={() => { setStep('idle'); setQuery(''); }} className="text-amber-500 mt-2">
                  Recalibrate Sensors
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}