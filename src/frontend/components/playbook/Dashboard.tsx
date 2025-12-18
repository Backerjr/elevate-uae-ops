import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { navigationItems, type TabId } from "@/lib/navigation-utils";
import { ArrowRight } from "lucide-react";

// FIX: Update onNavigate to strictly accept 'TabId' instead of 'string'
interface DashboardProps {
  onNavigate: (tab: TabId) => void; 
}

export function Dashboard({ onNavigate }: DashboardProps) {
  // Filter out the dashboard itself so we don't show a card for the current page
  const tools = navigationItems.filter(item => item.id !== 'dashboard');

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Card 
            key={tool.id} 
            className="group hover:shadow-lg transition-all duration-300 border-border/50 cursor-pointer bg-card/50 backdrop-blur-sm"
            onClick={() => onNavigate(tool.id)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium group-hover:text-primary transition-colors">
                {tool.label}
              </CardTitle>
              <tool.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground mt-2">
                <span>Open tool</span>
                <ArrowRight className="h-4 w-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}