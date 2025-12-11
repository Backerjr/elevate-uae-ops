import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { tours, type Tour } from '@/data/playbook-data';
import { Clock, MapPin, Users, Star, ChevronDown, ChevronUp, Lightbulb, AlertCircle } from 'lucide-react';
import { categoryLabels, marginColors } from '@/lib/tour-catalog-utils';

interface TourCardProps {
  tour: Tour;
  isExpanded: boolean;
  onToggle: () => void;
  delay: number;
}

function TourCard({ tour, isExpanded, onToggle, delay }: TourCardProps) {
  return (
    <Card 
      variant="elevated" 
      className={`animate-slide-up cursor-pointer hover:scale-[1.02] transition-all duration-300`}
      style={{ animationDelay: `${delay * 0.1}s` }}
      onClick={onToggle}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1.5">
              <Badge variant={tour.category}>{categoryLabels[tour.category]}</Badge>
              <Badge variant={marginColors[tour.margin]}>
                {tour.margin === 'high' ? '💰 High Margin' : tour.margin === 'medium' ? 'Med Margin' : 'Budget'}
              </Badge>
            </div>
            <CardTitle className="text-lg">{tour.name}</CardTitle>
          </div>
          <div className="text-2xl">{tour.visualCues[0]}</div>
        </div>
        <CardDescription className="flex flex-wrap items-center gap-3 mt-2">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {tour.duration}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {tour.pickup}
          </span>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Visual Cues */}
        <div className="flex gap-2 text-xl">
          {tour.visualCues.map((cue, i) => (
            <span key={i}>{cue}</span>
          ))}
        </div>

        {/* Ideal For */}
        <div className="flex flex-wrap gap-1.5">
          {tour.idealFor.map(tag => (
            <Badge key={tag} variant="muted" className="text-xs">
              <Users className="h-3 w-3 mr-1" />
              {tag}
            </Badge>
          ))}
        </div>

        {/* Expandable Details */}
        {isExpanded && (
          <div className="pt-4 border-t border-border space-y-4 animate-fade-in">
            {/* Highlights */}
            <div>
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-1.5">
                <Star className="h-4 w-4 text-primary" />
                Highlights
              </h4>
              <ul className="space-y-1">
                {tour.highlights.map((h, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>

            {/* Inclusions */}
            {tour.inclusions && (
              <div>
                <h4 className="font-semibold text-sm mb-2">Inclusions</h4>
                <ul className="space-y-1">
                  {tour.inclusions.map((inc, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-success mt-0.5">✓</span>
                      {inc}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {tour.requirements && (
              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4 text-warning" />
                  Requirements
                </h4>
                <ul className="space-y-1">
                  {tour.requirements.map((req, i) => (
                    <li key={i} className="text-sm text-muted-foreground">• {req}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Pro Tip / Notes */}
            {(tour.proTip || tour.note || tour.dressCode) && (
              <div className="bg-primary/5 rounded-lg p-3">
                {tour.proTip && (
                  <p className="text-sm flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span><strong>Pro Tip:</strong> {tour.proTip}</span>
                  </p>
                )}
                {tour.note && (
                  <p className="text-sm text-muted-foreground mt-1">
                    <strong>Note:</strong> {tour.note}
                  </p>
                )}
                {tour.dressCode && (
                  <p className="text-sm text-muted-foreground mt-1">
                    <strong>Dress Code:</strong> {tour.dressCode}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Toggle Button */}
        <Button variant="ghost" size="sm" className="w-full" onClick={(e) => { e.stopPropagation(); onToggle(); }}>
          {isExpanded ? (
            <>Less Details <ChevronUp className="h-4 w-4 ml-1" /></>
          ) : (
            <>More Details <ChevronDown className="h-4 w-4 ml-1" /></>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

export function TourCatalog() {
  const [expandedTour, setExpandedTour] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const filteredTours = filterCategory 
    ? tours.filter(tour => tour.category === filterCategory)
    : tours;

  const categories = Array.from(new Set(tours.map(t => t.category)));

  return (
    <div className="space-y-6">
      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filterCategory === null ? 'gold' : 'outline'}
          size="sm"
          onClick={() => setFilterCategory(null)}
        >
          All Tours
        </Button>
        {categories.map(cat => (
          <Button
            key={cat}
            variant={filterCategory === cat ? 'gold' : 'outline'}
            size="sm"
            onClick={() => setFilterCategory(cat)}
          >
            {categoryLabels[cat]}
          </Button>
        ))}
      </div>

      {/* Tour Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTours.map((tour, index) => (
          <TourCard 
            key={tour.id} 
            tour={tour} 
            isExpanded={expandedTour === tour.id}
            onToggle={() => setExpandedTour(expandedTour === tour.id ? null : tour.id)}
            delay={index}
          />
        ))}
      </div>
    </div>
  );
}
