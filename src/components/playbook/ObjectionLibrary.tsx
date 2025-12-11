import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import {
  objectionHandlers,
  categoryIcons,
  severityColors,
  copyObjectionResponse,
  type ObjectionHandler
} from '@/lib/objection-library-utils';

export function ObjectionLibrary() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const filteredHandlers = filterCategory
    ? objectionHandlers.filter(h => h.category === filterCategory)
    : objectionHandlers;

  const categories = Array.from(new Set(objectionHandlers.map(h => h.category)));

  const handleCopyResponse = (handler: ObjectionHandler) => {
    copyObjectionResponse(
      handler,
      (id) => setCopiedId(id || null),
      (message) => toast.success(message)
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-semibold flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          Objection Handling Playbook
        </h2>
        <p className="text-muted-foreground mt-1">
          Turn objections into opportunities with proven responses
        </p>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filterCategory === null ? 'gold' : 'outline'}
          size="sm"
          onClick={() => setFilterCategory(null)}
        >
          All Objections
        </Button>
        {categories.map(cat => (
          <Button
            key={cat}
            variant={filterCategory === cat ? 'gold' : 'outline'}
            size="sm"
            onClick={() => setFilterCategory(cat)}
          >
            {categoryIcons[cat]} {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </Button>
        ))}
      </div>

      {/* Objection Cards */}
      <div className="space-y-4">
        {filteredHandlers.map((handler, index) => (
          <Card 
            key={handler.id}
            variant="elevated"
            className={`animate-slide-up transition-all duration-300 ${
              expandedId === handler.id ? 'ring-2 ring-primary/30' : ''
            }`}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <CardHeader 
              className="cursor-pointer"
              onClick={() => setExpandedId(expandedId === handler.id ? null : handler.id)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xl">{categoryIcons[handler.category]}</span>
                    <Badge variant={severityColors[handler.severity]}>
                      {handler.severity}
                    </Badge>
                  </div>
                  <CardTitle className="text-base">"{handler.objection}"</CardTitle>
                </div>
                <Button variant="ghost" size="icon-sm">
                  {expandedId === handler.id ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>

            {expandedId === handler.id && (
              <CardContent className="space-y-4 animate-fade-in">
                {/* Main Response */}
                <div className="relative">
                  <div className="p-4 rounded-lg bg-success/5 border border-success/20">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-xs font-semibold text-success uppercase tracking-wide">
                        Your Response
                      </span>
                      <Button
                        variant={copiedId === handler.id ? 'success' : 'ghost'}
                        size="icon-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyResponse(handler);
                        }}
                      >
                        {copiedId === handler.id ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </div>
                    <p className="text-sm leading-relaxed">{handler.response}</p>
                  </div>
                </div>

                {/* Follow-up */}
                <div className="p-3 rounded-lg bg-info/5 border border-info/20">
                  <span className="text-xs font-semibold text-info uppercase tracking-wide">
                    Follow-up Question
                  </span>
                  <p className="text-sm mt-1">{handler.followUp}</p>
                </div>

                {/* Pro Tip */}
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                    💡 Pro Tip
                  </span>
                  <p className="text-sm text-muted-foreground mt-1">{handler.proTip}</p>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
