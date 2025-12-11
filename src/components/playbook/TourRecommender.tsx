import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { tours, comboPackages } from '@/data/playbook-data';
import { ArrowRight, RotateCcw, Sparkles, Users, Clock, DollarSign, Heart } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  options: { label: string; value: string; icon: string }[];
}

const questions: Question[] = [
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

interface Recommendation {
  tours: typeof tours;
  combos: typeof comboPackages;
  tips: string[];
}

function getRecommendations(answers: Record<string, string>): Recommendation {
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
    if (answers.group === 'family' && combo.idealFor.includes('Families')) return true;
    if (answers.interest === 'culture' && combo.items.some(i => i.includes('Qasr') || i.includes('Abu Dhabi'))) return true;
    return combo.idealFor.some(ideal => 
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

export function TourRecommender() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResults(true);
    }
  };

  const reset = () => {
    setCurrentStep(0);
    setAnswers({});
    setShowResults(false);
  };

  const recommendations = showResults ? getRecommendations(answers) : null;

  return (
    <Card variant="elevated" className="overflow-hidden">
      <CardHeader className="bg-gradient-gold text-primary-foreground">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Smart Tour Recommender
        </CardTitle>
        <CardDescription className="text-primary-foreground/80">
          Answer a few questions to get personalized tour suggestions
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
        {!showResults ? (
          <div className="space-y-6">
            {/* Progress */}
            <div className="flex gap-2">
              {questions.map((_, i) => (
                <div 
                  key={i}
                  className={`h-2 flex-1 rounded-full transition-colors ${
                    i <= currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>

            {/* Current Question */}
            <div className="animate-fade-in">
              <h3 className="text-xl font-display font-semibold mb-6">
                {questions[currentStep].question}
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                {questions[currentStep].options.map(option => (
                  <Button
                    key={option.value}
                    variant="outline"
                    className="h-auto py-4 px-6 flex flex-col items-center gap-2 hover:border-primary hover:bg-primary/5 transition-all"
                    onClick={() => handleAnswer(questions[currentStep].id, option.value)}
                  >
                    <span className="text-2xl">{option.icon}</span>
                    <span className="font-medium">{option.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Previous Answers */}
            {currentStep > 0 && (
              <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
                {Object.entries(answers).map(([key, value]) => {
                  const q = questions.find(q => q.id === key);
                  const opt = q?.options.find(o => o.value === value);
                  return (
                    <Badge key={key} variant="muted" className="py-1">
                      {opt?.icon} {opt?.label}
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>
        ) : recommendations && (
          <div className="space-y-6 animate-slide-up">
            {/* Recommended Tours */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Heart className="h-4 w-4 text-primary" />
                Recommended Tours
              </h3>
              <div className="space-y-3">
                {recommendations.tours.map(tour => (
                  <div key={tour.id} className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{tour.name}</h4>
                        <p className="text-sm text-muted-foreground flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {tour.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {tour.idealFor[0]}
                          </span>
                        </p>
                      </div>
                      <div className="text-xl">{tour.visualCues[0]}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Combo Suggestions */}
            {recommendations.combos.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-success" />
                  Upsell Combos
                </h3>
                <div className="space-y-2">
                  {recommendations.combos.map(combo => (
                    <div key={combo.id} className="p-3 rounded-lg border border-success/30 bg-success/5">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{combo.name}</span>
                        <Badge variant="success">AED {combo.totalPrice}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sales Tips */}
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <h3 className="font-semibold mb-2 text-primary">💡 Sales Tips</h3>
              <ul className="space-y-1">
                {recommendations.tips.map((tip, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* Reset Button */}
            <Button variant="outline" className="w-full" onClick={reset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Start Over
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
