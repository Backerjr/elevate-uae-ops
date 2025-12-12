/**
 * Tour Comparison UI
 * Standalone module for comparing multiple tours side-by-side
 * Isolated, non-intrusive, backward-compatible
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { tours, type Tour } from '@/data/playbook-data';
import { Scale, X, Plus, Check } from 'lucide-react';
import { addTour, removeTour, getAvailableTours, MAX_TOURS_TO_COMPARE } from '@/lib/tour-comparison-utils';

export function TourComparison() {
  const [selectedTours, setSelectedTours] = useState<Tour[]>([]);
  const [selectingTour, setSelectingTour] = useState<string>('');

  const handleAddTour = (tourId: string) => {
    const updatedTours = addTour(tourId, tours, selectedTours);
    if (updatedTours) {
      setSelectedTours(updatedTours);
      setSelectingTour('');
    }
  };

  const handleRemoveTour = (tourId: string) => {
    setSelectedTours(removeTour(tourId, selectedTours));
  };

  const handleClearComparison = () => {
    setSelectedTours([]);
  };

  const availableTours = getAvailableTours(tours, selectedTours);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-display font-semibold flex items-center gap-2">
            <Scale className="h-6 w-6 text-primary" />
            Tour Comparison
          </h2>
          <p className="text-muted-foreground mt-1">
            Compare up to {MAX_TOURS_TO_COMPARE} tours side-by-side to help clients choose
          </p>
        </div>

        <div className="flex gap-2">
          <Select value={selectingTour} onValueChange={handleAddTour}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Add tour to compare..." />
            </SelectTrigger>
            <SelectContent>
              {availableTours.map(tour => (
                <SelectItem key={tour.id} value={tour.id}>
                  {tour.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedTours.length > 0 && (
            <Button variant="outline" size="icon" onClick={handleClearComparison}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Comparison Grid */}
      {selectedTours.length === 0 ? (
        <Card variant="muted" className="py-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <Scale className="h-12 w-12 text-muted-foreground/50" />
            <div>
              <p className="text-lg font-semibold mb-1">No tours selected</p>
              <p className="text-sm text-muted-foreground">
                Select tours from the dropdown above to start comparing
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {selectedTours.map((tour, index) => (
            <Card 
              key={tour.id} 
              variant="elevated"
              className="animate-spring-in hover:shadow-elevated transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{tour.name}</CardTitle>
                    <CardDescription className="mt-1">{tour.category}</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleRemoveTour(tour.id)}
                    className="hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Duration */}
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Duration</p>
                  <p className="font-semibold">{tour.duration}</p>
                </div>

                {/* Pricing */}
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Pricing Range</p>
                  <p className="font-semibold text-primary">
                    AED {tour.priceRange.min} - {tour.priceRange.max}
                  </p>
                </div>

                {/* Best For */}
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Best For</p>
                  <p className="text-sm">{tour.bestFor}</p>
                </div>

                {/* Highlights */}
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Highlights</p>
                  <div className="space-y-1">
                    {tour.highlights.slice(0, 3).map((highlight, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                    {tour.highlights.length > 3 && (
                      <p className="text-xs text-muted-foreground pl-6">
                        +{tour.highlights.length - 3} more
                      </p>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-2 border-t">
                  {tour.tags.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="muted" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Add More Placeholder */}
          {selectedTours.length < MAX_TOURS_TO_COMPARE && (
            <Card 
              variant="muted" 
              className="flex items-center justify-center min-h-[400px] cursor-pointer hover:bg-muted/80 transition-colors"
              onClick={() => document.querySelector<HTMLButtonElement>('[role="combobox"]')?.click()}
            >
              <div className="text-center">
                <Plus className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  Add another tour to compare
                </p>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Comparison Tips */}
      {selectedTours.length > 0 && (
        <Card variant="gradient">
          <CardHeader>
            <CardTitle className="text-base">Comparison Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Use this comparison to help clients visualize differences in duration, pricing, and experiences</li>
              <li>• Highlight the unique value proposition of each tour based on client preferences</li>
              <li>• Consider combining complementary tours for multi-day packages</li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
