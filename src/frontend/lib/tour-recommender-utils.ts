/**
 * Tour Recommender Utilities
 * Types, questions, and recommendation logic for the TourRecommender component
 */

import { tours, comboPackages } from '@/data/playbook-data';

export interface Question {
  id: string;
  question: string;
  options: { label: string; value: string; icon: string }[];
}

export const questions: Question[] = [
  {
    id: 'group',
    question: "What's the group composition?",
    options: [
      { label: 'Couple', value: 'couple', icon: '💑' },
      { label: 'Family with kids', value: 'family', icon: '👨‍👩‍👧‍👦' },
      { label: 'Friends group', value: 'friends', icon: '👥' },
      { label: 'Solo traveler', value: 'solo', icon: '🧳' },
    ]
  },
  {
    id: 'interest',
    question: "What's their main interest?",
    options: [
      { label: 'Culture & History', value: 'culture', icon: '🕌' },
      { label: 'Adventure & Thrills', value: 'adventure', icon: '🏜️' },
      { label: 'Relaxation & Luxury', value: 'luxury', icon: '✨' },
      { label: 'Photography & Views', value: 'photo', icon: '📸' },
    ]
  },
  {
    id: 'budget',
    question: "What's their budget level?",
    options: [
      { label: 'Budget-friendly', value: 'budget', icon: '💵' },
      { label: 'Mid-range', value: 'mid', icon: '💰' },
      { label: 'Premium', value: 'premium', icon: '💎' },
    ]
  },
  {
    id: 'time',
    question: 'How much time do they have?',
    options: [
      { label: 'Half day (4-5 hrs)', value: 'half', icon: '⏱️' },
      { label: 'Full day (8-10 hrs)', value: 'full', icon: '🌅' },
      { label: 'Multi-day', value: 'multi', icon: '📅' },
    ]
  },
];

export interface Recommendation {
  tours: typeof tours;
  combos: typeof comboPackages;
  tips: string[];
}

export function getRecommendations(answers: Record<string, string>): Recommendation {
  const recommendedTours = tours.filter(tour => {
    // Interest matching
    if (answers.interest === 'culture' && !['abu-dhabi', 'dubai'].includes(tour.category)) return false;
    if (answers.interest === 'adventure' && !['adventure', 'desert'].includes(tour.category)) return false;
    if (answers.interest === 'luxury' && tour.margin === 'low') return false;
    if (answers.interest === 'photo' && !tour.visualCues.includes('📸') && !tour.highlights.some(h => h.toLowerCase().includes('photo'))) {
      // Still include scenic tours
      if (!['experience', 'cruise'].includes(tour.category)) return false;
    }

    // Budget matching
    if (answers.budget === 'budget' && tour.margin === 'high') return false;
    if (answers.budget === 'premium' && tour.margin === 'low') return false;

    // Time matching
    if (answers.time === 'half' && tour.duration.includes('10 hours')) return false;

    // Group matching
    if (answers.group === 'family' && tour.requirements?.some(r => r.includes('16+') || r.includes('20+'))) return false;

    return true;
  }).slice(0, 3);

  const recommendedCombos = comboPackages.filter(combo => {
    if (answers.budget === 'budget' && combo.margin === 'high') return false;
    if (answers.group === 'family' && (combo.idealFor ?? []).includes('Families')) return true;
    if (answers.interest === 'culture' && combo.items.some(i => i.includes('Qasr') || i.includes('Abu Dhabi'))) return true;
    return (combo.idealFor ?? []).some(ideal => 
      (answers.group === 'couple' && ideal.includes('Couple')) ||
      (answers.budget === 'budget' && ideal.includes('Budget')) ||
      (answers.interest === 'adventure' && ideal.includes('Adventure'))
    );
  }).slice(0, 2);

  const tips: string[] = [];
  
  if (answers.group === 'family') tips.push('Recommend private vehicle for comfort with kids');
  if (answers.group === 'couple') tips.push('Upsell romantic dinner cruise or balloon ride');
  if (answers.interest === 'culture') tips.push('Remind about mosque dress code requirements');
  if (answers.interest === 'adventure') tips.push('Check age requirements and send waiver links');
  if (answers.budget === 'premium') tips.push('Push private 4x4 and VIP experiences');
  if (answers.time === 'multi') tips.push('Create custom multi-day itinerary package');

  return {
    tours: recommendedTours,
    combos: recommendedCombos,
    tips
  };
}
