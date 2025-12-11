/**
 * useNavigation Hook
 * Custom hook for managing navigation state
 */

import { useState } from 'react';
import type { TabId } from '@/lib/navigation-utils';

export function useNavigation() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  return { activeTab, setActiveTab };
}
