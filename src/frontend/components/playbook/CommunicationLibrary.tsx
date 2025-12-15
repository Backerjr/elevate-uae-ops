import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { whatsappScripts, objectionHandlers } from "@/data";
import { Check, Copy, MessageSquare, ShieldAlert } from "lucide-react";

export function CommunicationLibrary() {
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
          Sales Communication Library
        </CardTitle>
        <CardDescription>Copy-ready WhatsApp templates and objection handling playbook</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="templates">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="templates">WhatsApp Templates</TabsTrigger>
            <TabsTrigger value="objections">Objection Handling</TabsTrigger>
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
                    <p className="text-sm text-muted-foreground line-clamp-4 whitespace-pre-line">{script.content}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {script.tags.map((tag) => (
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
                        onClick={() => handleCopy(script.id, script.content)}
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

          <TabsContent value="objections" className="pt-4">
            <Accordion type="single" collapsible className="space-y-2">
              {objectionHandlers.map((item) => (
                <AccordionItem value={item.id} key={item.id} className="border border-border rounded-lg px-3">
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="h-4 w-4 text-primary" />
                      <div className="text-left">
                        <div className="font-semibold">{item.title}</div>
                        <div className="text-xs text-muted-foreground">{item.category}</div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                    <div className="space-y-2">
                      {item.handlers.map((handler, idx) => (
                        <div key={idx} className="p-2 rounded-md bg-muted/40">
                          <div className="font-semibold">{handler.objection}</div>
                          <p className="mt-1 text-muted-foreground whitespace-pre-line">{handler.response}</p>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
