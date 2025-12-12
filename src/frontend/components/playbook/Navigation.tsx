import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  Map, 
  Calculator, 
  MessageSquare, 
  DollarSign, 
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { type NavigationProps, type NavItem } from '@/lib/navigation-utils';

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
  { id: 'tours', label: 'Tour Catalog', icon: <Map className="h-5 w-5" /> },
  { id: 'calculator', label: 'Quote Builder', icon: <Calculator className="h-5 w-5" />, badge: 'Smart' },
  { id: 'scripts', label: 'Scripts', icon: <MessageSquare className="h-5 w-5" /> },
  { id: 'pricing', label: 'Pricing Matrix', icon: <DollarSign className="h-5 w-5" /> },
  { id: 'reference', label: 'Quick Ref', icon: <BookOpen className="h-5 w-5" /> },
];

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-sidebar border-b border-sidebar-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="glass-dark"
            size="icon-sm"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-display text-sidebar-foreground font-semibold">Ahmed Travel</span>
          </div>
        </div>
        <Badge variant="gold" className="text-xs">v2025.12</Badge>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-foreground/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed top-0 left-0 h-screen bg-sidebar border-r border-sidebar-border z-50 transition-all duration-300",
          "flex flex-col",
          isCollapsed ? "w-20" : "w-64",
          "lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className={cn(
          "p-6 border-b border-sidebar-border",
          isCollapsed && "px-4"
        )}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center shadow-glow">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            {!isCollapsed && (
              <div className="animate-fade-in">
                <h1 className="font-display text-lg font-semibold text-sidebar-foreground">
                  Ahmed Travel
                </h1>
                <p className="text-xs text-sidebar-foreground/60">Training Playbook</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? 'gold' : 'glass-dark'}
              className={cn(
                "w-full justify-start gap-3 transition-all duration-200",
                isCollapsed && "justify-center px-2",
                activeTab === item.id && "shadow-glow"
              )}
              onClick={() => {
                onTabChange(item.id);
                setIsMobileOpen(false);
              }}
            >
              {item.icon}
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <Badge variant="navy" className="text-xs">{item.badge}</Badge>
                  )}
                </>
              )}
            </Button>
          ))}
        </nav>

        {/* Footer */}
        <div className={cn(
          "p-4 border-t border-sidebar-border",
          isCollapsed && "px-2"
        )}>
          {!isCollapsed && (
            <div className="mb-4 p-3 rounded-lg bg-sidebar-accent animate-fade-in">
              <p className="text-xs text-sidebar-foreground/80">
                <span className="font-semibold text-primary">Pro Tip:</span> Use the Quote Builder for instant pricing calculations!
              </p>
            </div>
          )}
          
          {/* Collapse Toggle - Desktop only */}
          <Button
            variant="ghost"
            size={isCollapsed ? "icon" : "default"}
            className="w-full hidden lg:flex text-sidebar-foreground/60 hover:text-sidebar-foreground"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Collapse
              </>
            )}
          </Button>
        </div>
      </aside>

      {/* Main content spacer */}
      <div className={cn(
        "transition-all duration-300",
        isCollapsed ? "lg:ml-20" : "lg:ml-64",
        "mt-14 lg:mt-0"
      )} />
    </>
  );
}
