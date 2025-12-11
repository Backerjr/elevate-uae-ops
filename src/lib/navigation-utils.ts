/**
 * Navigation Utilities
 * Types and interfaces for the Navigation component
 */

export type TabId = 'dashboard' | 'tours' | 'calculator' | 'scripts' | 'pricing' | 'reference';

export interface NavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export interface NavItem {
  id: TabId;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}
