import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { whatsappScripts } from '@/data';
import { Check, Copy } from 'lucide-react';

export function ScriptLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string>('');

  const categories = useMemo(
    () => Array.from(new Set(whatsappScripts.map((s) => s.category))),
    []
  );

  const filteredScripts = useMemo(() => {
    return whatsappScripts.filter((script) => {
      const matchesSearch =
        script.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        script.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (script.tags || []).some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = !filterCategory || script.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, filterCategory]);

  const handleCopyScript = (scriptId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(scriptId);
    setTimeout(() => setCopiedId(''), 1800);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div>
          <h3 className="text-2xl font-display text-primary">Sales Script Library</h3>
          <p className="text-muted-foreground text-sm">Copy-ready WhatsApp templates with fast filtering.</p>
        </div>
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <Input
            placeholder="Search scripts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="md:w-64"
          />
          <select
            className="border border-input bg-background rounded-md px-3 py-2 text-sm"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            aria-label="Filter by category"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filteredScripts.map((script, index) => (
          <Card
            key={script.id}
            className="group h-full"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <Badge variant="outline">{script.category}</Badge>
                  <CardTitle className="text-base">{script.title}</CardTitle>
                </div>
                <Button
                  variant={copiedId === script.id ? 'success' : 'ghost'}
                  size="icon-sm"
                  aria-label="Copy script"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyScript(script.id, script.text);
                  }}
                >
                  {copiedId === script.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed bg-muted/50 rounded-lg p-3">
                "{script.text}"
              </p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {(script.tags || []).map((tag) => (
                  <Badge key={tag} variant="muted" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredScripts.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="py-6 text-center text-muted-foreground">
              No scripts match your filters.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
