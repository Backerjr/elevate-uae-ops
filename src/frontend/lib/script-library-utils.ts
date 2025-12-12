/**
 * Script Library Utilities
 * Constants and helpers for the ScriptLibrary component
 */

import type { WhatsAppScript } from '@/data/playbook-data';

export const categoryIcons: Record<string, string> = {
  'inquiry': '💬',
  'culture': '🕌',
  'price': '💰',
  'objection': '🤝',
  'upsell': '⬆️',
  'confirmation': '✅',
  'emergency': '🚨',
};

export const categoryColors: Record<string, string> = {
  'inquiry': 'info',
  'culture': 'success',
  'price': 'gold',
  'objection': 'warning',
  'upsell': 'default',
  'confirmation': 'success',
  'emergency': 'destructive',
};

export function copyScriptToClipboard(
  script: WhatsAppScript,
  onCopied: (scriptId: string) => void,
  onSuccess?: (message: string) => void
): void {
  navigator.clipboard.writeText(script.script);
  onCopied(script.id);
  if (onSuccess) {
    onSuccess('Script copied! Ready to paste in WhatsApp');
  }
  setTimeout(() => onCopied(''), 2000);
}
