/* src/frontend/components/playbook/QuickReference.tsx */
import React from 'react';

/**
 * Quick Reference Guide Component
 * A searchable knowledge base for agents.
 *
 * NOTE: Changed to a named export to ensure compatibility with the test suite.
 */
export function QuickReference() {
  return (
    <div className="glass-card p-6 rounded-lg">
      <h3 className="text-2xl font-display text-primary mb-4">Quick Reference Guide</h3>
      <p className="text-white/80">
        Find instant answers to common questions about destinations, policies, and procedures.
      </p>
      {/* Placeholder for search bar and content */}
    </div>
  );
}
