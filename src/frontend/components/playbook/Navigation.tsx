import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type TabId, navigationItems } from "@/lib/navigation-utils";

interface NavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border h-16 flex items-center px-4 lg:px-8">
      <div className="flex items-center gap-2 mr-8">
        <span className="text-xl font-display font-bold text-primary">ATIS</span>
        <span className="text-sm text-muted-foreground hidden sm:inline">Playbook</span>
      </div>
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar mask-gradient-x">
        {navigationItems.map((item) => (
          <Button
            key={item.id}
            variant={activeTab === item.id ? "default" : "ghost"}
            size="sm"
            onClick={() => onTabChange(item.id)}
            className={cn(
              "gap-2 transition-all duration-300",
              activeTab === item.id ? "bg-primary text-primary-foreground shadow-glow" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            <span className="hidden md:inline">{item.label}</span>
          </Button>
        ))}
      </div>
    </nav>
  );
}
