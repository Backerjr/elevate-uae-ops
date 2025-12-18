import React, { useState, useMemo } from 'react';
import { tours, type Tour } from '@/data/playbook-data';
import { ChevronDown, ChevronUp, Clock, MapPin, Search, Filter, Sparkles, Star, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// --- Visual Logic ---
const getDifficultyColor = (diff: string) => {
  switch (diff) {
    case 'easy': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'moderate': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    case 'complex': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    default: return 'bg-primary/10 text-primary';
  }
};

// --- Featured Hero Component ---
const FeaturedHero = ({ tour }: { tour: Tour }) => (
  <div className="relative w-full h-[500px] rounded-3xl overflow-hidden mb-12 group border border-white/10 shadow-2xl">
    <div className="absolute inset-0 bg-gradient-to-t from-[#02040A] via-[#02040A]/60 to-transparent z-10" />
    <img 
      src={tour.image} 
      alt={tour.name} 
      className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[3s] ease-out"
    />
    <div className="absolute bottom-0 left-0 p-8 md:p-12 z-20 w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-3">
            <Badge className="bg-amber-500 text-black font-bold animate-pulse px-3 py-1">
              <Star className="w-3 h-3 mr-2 fill-black" /> FEATURED EXPERIENCE
            </Badge>
            <Badge variant="outline" className="text-white border-white/30 backdrop-blur-md uppercase tracking-wider px-3 py-1">
              {tour.category}
            </Badge>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white leading-[0.9] drop-shadow-xl font-display uppercase tracking-tight">
            {tour.name}
          </h2>
          <p className="text-white/80 text-lg md:text-xl font-light line-clamp-2 max-w-2xl">
            {tour.proTip || tour.highlights.join(' • ')}
          </p>
        </div>
        
        {/* Hero Price Block */}
        <div className="flex flex-col items-end">
          <span className="text-sm font-medium text-amber-400 uppercase tracking-widest mb-1">Starting From</span>
          <div className="text-5xl font-black text-white font-mono tracking-tighter">
            {tour.priceRange && tour.priceRange.min > 0 ? (
              <>
                <span className="text-2xl align-top mr-1 opacity-50">AED</span>
                {tour.priceRange.min}
              </>
            ) : (
              <span className="text-3xl">INQUIRE</span>
            )}
          </div>
          <Button className="mt-4 bg-white text-black hover:bg-amber-500 hover:text-black font-bold text-lg px-8 py-6 w-full md:w-auto transition-all transform hover:-translate-y-1">
            Book Experience
          </Button>
        </div>
      </div>
    </div>
  </div>
);

// --- Tour Card Component ---
const TourCard: React.FC<{ tour: Tour }> = ({ tour }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="group relative bg-[#0A0C14] border border-white/5 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all duration-500 ease-out flex flex-col h-full hover:shadow-[0_0_30px_-5px_rgba(245,158,11,0.1)]">
      {/* Hero Section */}
      <div className="relative h-64 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0A0C14] opacity-60 z-10" />
        <img
          src={tour.image || '/assets/placeholders/hero.svg'}
          alt={tour.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000"
        />
        
        {/* Badges */}
        <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">
          {tour.margin === 'high' && (
            <Badge className="bg-amber-500/90 text-black border-none shadow-lg backdrop-blur-sm font-bold">
              <Sparkles className="w-3 h-3 mr-1" /> HIGH MARGIN
            </Badge>
          )}
        </div>
        
        <div className="absolute bottom-4 left-4 z-20">
           <Badge variant="secondary" className="bg-black/60 text-white backdrop-blur-md border border-white/10">
             {tour.category.toUpperCase()}
           </Badge>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-6">
          <h3 className="text-2xl font-black text-white mb-3 group-hover:text-amber-500 transition-colors leading-tight font-display">
            {tour.name}
          </h3>
          
          <div className="flex flex-wrap gap-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-amber-500" />
              <span>{tour.duration}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-amber-500" />
              <span>{tour.pickup}</span>
            </div>
          </div>
        </div>

        {/* Highlights */}
        <div className="space-y-3 mb-6 flex-grow">
          {tour.highlights.slice(0, 3).map((highlight, idx) => (
            <div key={idx} className="flex items-start text-sm text-gray-300">
              <span className="w-1.5 h-1.5 rounded-full bg-white/20 mt-1.5 mr-3 shrink-0 group-hover:bg-amber-500 transition-colors" />
              <span className="line-clamp-1">{highlight}</span>
            </div>
          ))}
        </div>

        {/* Price & Action */}
        <div className="mt-auto pt-6 border-t border-white/5">
          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Price / Person</p>
              <div className="flex items-baseline gap-1">
                {tour.priceRange && tour.priceRange.min > 0 ? (
                  <>
                    <span className="text-sm text-amber-500 font-bold">AED</span>
                    <span className="text-3xl font-black text-white font-mono tracking-tighter">
                      {tour.priceRange.min}
                    </span>
                  </>
                ) : (
                  <span className="text-xl font-bold text-white/60">Ask Concierge</span>
                )}
              </div>
            </div>
            <Button size="icon" variant="outline" className="border-white/10 hover:bg-amber-500 hover:text-black hover:border-amber-500 rounded-full w-12 h-12 transition-all">
              <ShoppingCart className="w-5 h-5" />
            </Button>
          </div>

          {/* Toggle Details */}
          <Button
            variant="ghost"
            className="w-full text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white hover:bg-white/5 h-10 border border-transparent hover:border-white/10 rounded-lg transition-all"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <span className="flex items-center">Hide Intel <ChevronUp className="ml-2 w-3 h-3" /></span>
            ) : (
              <span className="flex items-center">View Intel <ChevronDown className="ml-2 w-3 h-3" /></span>
            )}
          </Button>
        </div>

        {/* Expanded Intel */}
        <div className={cn(
          "grid transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] overflow-hidden bg-white/[0.02] rounded-xl mx-[-1.5rem] mb-[-1.5rem]",
          isExpanded ? "grid-rows-[1fr] mt-6 border-t border-white/5" : "grid-rows-[0fr]"
        )}>
          <div className="min-h-0">
            <div className="p-6 space-y-6">
              
              {/* Pro Tip */}
              {tour.proTip && (
                <div className="flex gap-3 bg-amber-500/10 p-4 rounded-lg border border-amber-500/20">
                  <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs font-bold text-amber-500 uppercase tracking-wider mb-1">Insider Tip</span>
                    <p className="text-sm text-amber-100/80 leading-relaxed italic">"{tour.proTip}"</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-xs text-gray-500 uppercase font-bold mb-2">Difficulty</span>
                  <Badge variant="outline" className={cn("rounded-md", getDifficultyColor(tour.difficulty))}>
                    {tour.difficulty.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <span className="block text-xs text-gray-500 uppercase font-bold mb-2">Ideal For</span>
                  <p className="text-xs text-white font-medium">{tour.idealFor.join(', ')}</p>
                </div>
              </div>

              {tour.inclusions && (
                <div>
                  <span className="block text-xs text-gray-500 uppercase font-bold mb-3">Inclusions</span>
                  <div className="flex flex-wrap gap-2">
                    {tour.inclusions.map((inc, i) => (
                      <span key={i} className="text-[10px] bg-white/5 px-2 py-1 rounded text-gray-300 border border-white/5">
                        {inc}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Catalog Component ---
export const TourCatalog: React.FC = () => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = useMemo(() => {
    const cats = new Set(tours.map(t => t.category));
    return ['all', ...Array.from(cats)];
  }, []);

  const filteredTours = useMemo(() => {
    return tours.filter(tour => {
      const matchesCategory = filterCategory === 'all' || tour.category === filterCategory;
      const matchesSearch = tour.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            tour.highlights.some(h => h.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [filterCategory, searchQuery]);

  const featuredTour = useMemo(() => {
    return tours.find(t => t.margin === 'high' && t.category === 'desert') || tours[0];
  }, []);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
      
      {/* Featured Hero */}
      {filterCategory === 'all' && !searchQuery && <FeaturedHero tour={featuredTour} />}

      {/* Controls Sticky Header */}
      <div className="sticky top-24 z-30 bg-[#02040A]/80 backdrop-blur-xl border-y border-white/5 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
          
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mask-gradient-x flex-1">
            <Filter className="w-4 h-4 text-gray-500 mr-2 shrink-0" />
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={cn(
                  "px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap border",
                  filterCategory === cat
                    ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                    : "bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:text-white"
                )}
              >
                {cat === 'all' ? 'All Experiences' : cat.replace('-', ' ')}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-80 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input 
              placeholder="Search catalog..." 
              className="pl-10 bg-white/5 border-white/5 focus:border-amber-500/50 focus:bg-white/10 transition-all text-white placeholder:text-gray-600 rounded-xl h-10 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
        {filteredTours.length > 0 ? (
          filteredTours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-32 text-gray-500 border border-dashed border-white/10 rounded-3xl bg-white/[0.02]">
            <Search className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-xl font-light">No experiences found matching your criteria.</p>
            <Button 
              variant="link" 
              onClick={() => { setFilterCategory('all'); setSearchQuery(''); }}
              className="mt-4 text-amber-500"
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TourCatalog;