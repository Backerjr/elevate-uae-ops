import { LayoutDashboard, Car, Calculator, FileText, ShieldAlert, BadgeDollarSign, BookOpen, GitCompare, ThumbsUp, MessageSquare, type LucideIcon } from "lucide-react";

export type TabId = 
  | 'dashboard' 
  | 'tours' 
  | 'calculator' 
  | 'scripts' 
  | 'objections' 
  | 'pricing' 
  | 'quick-ref' 
  | 'comparison' 
  | 'recommender' 
  | 'communication';

export interface NavigationItem {
  id: TabId;
  label: string;
  icon: LucideIcon;
}

export const navigationItems: NavigationItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'tours', label: 'Tours', icon: Car },
  { id: 'calculator', label: 'Quote', icon: Calculator },
  { id: 'scripts', label: 'Scripts', icon: FileText },
  { id: 'objections', label: 'Objections', icon: ShieldAlert },
  { id: 'pricing', label: 'Pricing', icon: BadgeDollarSign },
  { id: 'quick-ref', label: 'Quick Ref', icon: BookOpen },
  { id: 'comparison', label: 'Compare', icon: GitCompare },
  { id: 'recommender', label: 'Match', icon: ThumbsUp },
  { id: 'communication', label: 'Comm', icon: MessageSquare },
];