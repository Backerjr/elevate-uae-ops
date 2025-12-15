import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { whatsappScripts } from "@/data/whatsapp-scripts";
import { Check, Copy, MessageSquare } from "lucide-react";

export function QuickReference() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <Card variant="elevated" className="animate-slide-up">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Quick Reference Guide
        </CardTitle>
        <CardDescription>Templates and objection handling references</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="templates">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-2">
            <TabsTrigger value="templates">WhatsApp Templates</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="pt-4">
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {whatsappScripts.map((script) => (
                <Card key={script.id} variant="elevated" className="h-full flex flex-col">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <CardTitle className="text-base">{script.title}</CardTitle>
                        <Badge variant="info" className="mt-2">{script.category}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col gap-3">
                    <p className="text-sm text-muted-foreground line-clamp-4 whitespace-pre-line">{script.text}</p>

                    <div className="flex flex-wrap gap-1.5">
                      {(script.tags || []).map((tag) => (
                        <Badge key={tag} variant="muted" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="mt-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-between"
                        aria-label="Copy template"
                        onClick={() => handleCopy(script.id, script.text)}
                      >
                        <span className="flex items-center gap-2">
                          {copiedId === script.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          {copiedId === script.id ? "Copied" : "Copy to Clipboard"}
                        </span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="notes" className="pt-4">
            <p className="text-sm text-muted-foreground">Add quick notes or links here.</p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
