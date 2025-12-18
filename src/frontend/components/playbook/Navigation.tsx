import { navigationItems, type TabId } from "@/lib/navigation-utils";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion"; // Assuming framer-motion is available, if not falling back to CSS

interface NavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-auto max-w-[95vw]">
      <div className="glass-panel flex items-center gap-1 p-2 rounded-full border border-white/10 bg-black/60 backdrop-blur-2xl shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)]">
        {navigationItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "relative flex flex-col items-center justify-center w-12 h-12 sm:w-16 sm:h-14 rounded-full transition-all duration-500 ease-out group",
                isActive 
                  ? "text-black" 
                  : "text-white/50 hover:text-white"
              )}
            >
              {/* Active Pill Background */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-tr from-amber-400 to-amber-200 rounded-full shadow-[0_0_20px_rgba(251,191,36,0.6)] animate-in zoom-in-90 duration-300" />
              )}

              {/* Icon Layer */}
              <div className="relative z-10 flex flex-col items-center gap-1">
                <item.icon 
                  className={cn(
                    "w-5 h-5 transition-transform duration-300",
                    isActive ? "scale-110 rotate-0" : "group-hover:scale-110 group-hover:-rotate-3"
                  )} 
                  strokeWidth={isActive ? 2.5 : 1.5}
                />
                <span className={cn(
                  "text-[9px] font-bold uppercase tracking-wider transition-all duration-300",
                  isActive ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 hidden sm:block"
                )}>
                  {isActive ? item.label.slice(0, 4) : ''}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}