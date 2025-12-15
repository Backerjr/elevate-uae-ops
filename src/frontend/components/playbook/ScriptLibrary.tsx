/* src/frontend/components/playbook/ScriptLibrary.tsx */
import React from 'react';

/**
 * Script Library Component
 * Contains approved scripts for client interactions.
 *
 * NOTE: Switched to a named export to align with the application's import strategy.
 */
export function ScriptLibrary() {
  return (
    <div className="glass-card p-6 rounded-lg">
      <h3 className="text-2xl font-display text-primary mb-4">Sales Script Library</h3>
      <p className="text-white/80">
        Access best-practice scripts for calls, emails, and follow-ups.
      </p>
      {/* Placeholder for script content */}
    </div>
  );
}
