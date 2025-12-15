/* src/frontend/components/playbook/ObjectionLibrary.tsx */
import React from 'react';

/**
 * Objection Handling Library
 * Provides strategies for overcoming client objections.
 *
 * NOTE: Switched to `export function` to create a named export, fixing test failures.
 */
export function ObjectionLibrary() {
  return (
    <div className="glass-card p-6 rounded-lg">
      <h3 className="text-2xl font-display text-primary mb-4">Objection Handling Library</h3>
      <p className="text-white/80">
        Browse proven responses to common client concerns regarding price, timing, and value.
      </p>
      {/* Placeholder for library content */}
    </div>
  );
}
