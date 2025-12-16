import type { LucideIcon } from "lucide-react";
import { Calculator, DollarSign, LayoutDashboard, Map, MessageSquare, BookOpen } from "lucide-react";

/**
 * Navigation utilities and shared types for the Playbook shell.
 */
export type TabId = "dashboard" | "tours" | "calculator" | "scripts" | "pricing" | "reference";

export interface NavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export interface NavItem {
  id: TabId;
  label: string;
  icon: LucideIcon;
  badge?: string;
}

export const navigationItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "tours", label: "Tour Catalog", icon: Map },
  { id: "calculator", label: "Quote Builder", icon: Calculator, badge: "Smart" },
  { id: "scripts", label: "Scripts", icon: MessageSquare },
  { id: "pricing", label: "Pricing Matrix", icon: DollarSign },
  { id: "reference", label: "Quick Ref", icon: BookOpen },
];
