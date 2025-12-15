/* src/frontend/components/playbook/PricingMatrix.tsx */
import React from 'react';

/**
 * Pricing Matrix Component
 * Displays dynamic pricing for various tours and packages.
 *
 * NOTE: Refactored to a named export `export function` to fix undefined import.
 */
export function PricingMatrix() {
  return (
    <div className="glass-card p-6 rounded-lg">
      <h3 className="text-2xl font-display text-primary mb-4">Dynamic Pricing Matrix</h3>
      <p className="text-white/80">
        View real-time pricing, commission structures, and seasonal adjustments.
      </p>
      {/* Placeholder for pricing table */}
    </div>
  );
}
