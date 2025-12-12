/**
 * Quick Reference Utilities
 * Constants for the QuickReference component
 */

import { AlertTriangle, Lightbulb, Heart, Shield, Zap } from 'lucide-react';

export const importanceColors = {
  critical: 'destructive',
  important: 'warning',
  standard: 'muted',
} as const;

export const categoryIcons: Record<string, React.ReactNode> = {
  policy: <Shield className="h-4 w-4" />,
  process: <Zap className="h-4 w-4" />,
  communication: <Heart className="h-4 w-4" />,
  safety: <AlertTriangle className="h-4 w-4" />,
};

export const cheatTypeColors = {
  value: 'success',
  margin: 'gold',
  budget: 'info',
  upsell: 'default',
} as const;
