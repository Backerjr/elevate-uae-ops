import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, RotateCcw, Sparkles, Users, Clock, DollarSign, Heart } from 'lucide-react';
import { questions, getRecommendations } from '@/lib/tour-recommender-utils';

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
