/**
 * Tour Comparison Utilities
 * Helper functions for the TourComparison component
 */

import type { Tour } from '@/data/playbook-data';

export const MAX_TOURS_TO_COMPARE = 3;

export function addTour(
  tourId: string,
  allTours: Tour[],
  selectedTours: Tour[]
): Tour[] | null {
  const tour = allTours.find(t => t.id === tourId);
  if (tour && !selectedTours.find(t => t.id === tourId) && selectedTours.length < MAX_TOURS_TO_COMPARE) {
    return [...selectedTours, tour];
  }
  return null;
}

export function removeTour(tourId: string, selectedTours: Tour[]): Tour[] {
  return selectedTours.filter(t => t.id !== tourId);
}

export function getAvailableTours(allTours: Tour[], selectedTours: Tour[]): Tour[] {
  return allTours.filter(t => !selectedTours.find(st => st.id === t.id));
}
