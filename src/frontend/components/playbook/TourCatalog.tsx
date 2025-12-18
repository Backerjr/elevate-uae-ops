import React, { useState, useMemo, useEffect } from 'react';
import { tours, type Tour } from '@/data/playbook-data';
import { ChevronDown, ChevronUp, Clock, MapPin, Search, Filter, Sparkles, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// --- Visual Logic ---
const getDifficultyColor = (diff: string) => {
  switch (diff) {
    case 'easy': return 'bg-green-500/10 text-green-500 border-green-500/20';
    case 'moderate': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    case 'complex': return 'bg-red-500/10 text-red-500 border-red-500/20';
    default: return 'bg-primary/10 text-primary';
  }
};

// --- Featured Hero Component ---
const FeaturedHero = ({ tour }: { tour: Tour }) => (
  <div className="relative w-full h-80 md:h-96 rounded-3xl overflow-hidden mb-12 group border border-white/10 shadow-2xl">
    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
    <img 
      src={tour.image} 
      alt={tour.name} 
      className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[2s] ease-out"
    />
    <div className="absolute bottom-0 left-0 p-8 z-20 max-w-3xl">
      <div className="flex items-center gap-3 mb-3">
        <Badge className="bg-amber-500 text-black font-bold animate-pulse">
          <Star className="w-3 h-3 mr-1 fill-black" /> FEATURED EXPERIENCE
        </Badge>
        <Badge variant="outline" className="text-white border-white/30 backdrop-blur-md uppercase tracking-wider">
          {tour.category}
        </Badge>
      </div>
      <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4 drop-shadow-xl font-display">
        {tour.name}
      </h2>
      <p className="text-white/80 text-lg line-clamp-2 max-w-2xl mb-6">
        {tour.proTip || tour.highlights.join(' • ')}
      </p>
    </div>
  </div>
);

// --- Tour Card Component ---
const TourCard: React.FC<{ tour: Tour }> = ({ tour }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="group relative bg-card/50 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 ease-out flex flex-col h-full">
      {/* Hero Section */}
      <div className="relative h-56 overflow-hidden">
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
        <img
          src={tour.image || '/assets/placeholders/hero.svg'}
          alt={tour.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          loading={typeof HTMLImageElement !== 'undefined' && 'loading' in HTMLImageElement.prototype ? 'lazy' : undefined}
        />
        
        {/* Margin Badge (Top Right) */}
        <div className="absolute top-4 right-4 z-20">
          {tour.margin === 'high' && (
            <Badge className="bg-amber-500/90 hover:bg-amber-500 text-black border-none shadow-lg shadow-amber-500/20 backdrop-blur-sm">
              <Sparkles className="w-3 h-3 mr-1" /> High Margin
            </Badge>
          )}
        </div>

        {/* Category Badge (Bottom Left) */}
        <div className="absolute bottom-4 left-4 z-20">
          <Badge variant="outline" className="bg-black/60 backdrop-blur-md text-white border-white/20 capitalize">
            {tour.category.replace('-', ' ')}
          </Badge>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-4">
          <h3 className="text-xl font-display font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {tour.name}
          </h3>
          
          {/* Quick Stats Row */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-3">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-primary/80" />
              <span>{tour.duration}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-primary/80" />
              <span>{tour.pickup}</span>
            </div>
          </div>
        </div>

        {/* Highlights Preview */}
        <div className="flex-grow space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Highlights</p>
          <ul className="space-y-2">
            {tour.highlights.slice(0, 3).map((highlight, idx) => (
              <li key={idx} className="flex items-start text-sm text-foreground/80">
                <span className="mr-2 text-primary">•</span>
                <span className="line-clamp-1">{highlight}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Collapsible Details */}
        <div className={cn(
          "grid transition-all duration-300 ease-in-out overflow-hidden",
          isExpanded ? "grid-rows-[1fr] opacity-100 mt-6 pt-6 border-t border-white/10" : "grid-rows-[0fr] opacity-0"
        )}>
          <div className="min-h-0 space-y-6">
            {/* Pro Tip Box */}
            {tour.proTip && (
              <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 relative">
                <div className="absolute -top-2 -left-2 bg-primary text-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Pro Tip
                </div>
                <p className="text-sm text-primary/90 italic">"{tour.proTip}"</p>
              </div>
            )}

            {/* Inclusions */}
            {tour.inclusions && tour.inclusions.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                  What's Included
                </h4>
                <div className="flex flex-wrap gap-2">
                  {tour.inclusions.map((inc, i) => (
                    <span key={i} className="text-xs bg-muted/50 px-2.5 py-1 rounded-md text-muted-foreground border border-white/5">
                      {inc}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Difficulty & Ideal For */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-muted-foreground block mb-1">Difficulty</span>
                <Badge variant="outline" className={getDifficultyColor(tour.difficulty)}>
                  {tour.difficulty}
                </Badge>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block mb-1">Ideal For</span>
                <div className="text-xs font-medium text-foreground">
                  {tour.idealFor.join(', ')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Toggle Button */}
        <Button
          variant="ghost"
          className="w-full mt-4 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 h-8"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <span className="flex items-center">Close Details <ChevronUp className="ml-2 w-3 h-3" /></span>
          ) : (
            <span className="flex items-center">View Full Details <ChevronDown className="ml-2 w-3 h-3" /></span>
          )}
        </Button>
      </div>
    </div>
  );
};

// --- Main Catalog Component ---
export const TourCatalog: React.FC = () => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract unique categories for tabs
  const categories = useMemo(() => {
    const cats = new Set(tours.map(t => t.category));
    return ['all', ...Array.from(cats)];
  }, []);

  // Filter Logic
  const filteredTours = useMemo(() => {
    return tours.filter(tour => {
      const matchesCategory = filterCategory === 'all' || tour.category === filterCategory;
      const matchesSearch = tour.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            tour.highlights.some(h => h.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [filterCategory, searchQuery]);

  // Featured Tour Logic (Rotate randomly or pick highest margin)
  const featuredTour = useMemo(() => {
    return tours.find(t => t.margin === 'high' && t.category === 'desert') || tours[0];
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Featured Hero Section */}
      {filterCategory === 'all' && !searchQuery && <FeaturedHero tour={featuredTour} />}

      {/* Controls Header */}
      <div className="sticky top-20 z-30 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-black/80 p-4 rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl">
        
        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search tours, highlights..." 
            className="pl-10 bg-white/5 border-white/10 focus:border-primary/50 transition-all text-white placeholder:text-white/40"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar mask-gradient-x">
          <Filter className="w-4 h-4 text-muted-foreground mr-2 shrink-0" />
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap border",
                filterCategory === cat
                  ? "bg-primary text-black border-primary shadow-glow scale-105"
                  : "bg-transparent text-muted-foreground border-transparent hover:bg-white/5 hover:text-foreground"
              )}
            >
              {cat === 'all' ? 'All Tours' : cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTours.length > 0 ? (
          filteredTours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))
        ) : (
          <div className="col-span-full text-center py-20 text-muted-foreground">
            <p className="text-lg">No tours found matching your criteria.</p>
            <Button 
              variant="link" 
              onClick={() => { setFilterCategory('all'); setSearchQuery(''); }}
              className="mt-2 text-primary"
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TourCatalog;