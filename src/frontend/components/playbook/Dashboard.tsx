/* src/frontend/components/playbook/Dashboard.tsx */
import React from 'react';

// Props interface remains the same
interface DashboardProps {
  onNavigate: (view: string) => void;
}

/**
 * Main Dashboard Component
 * Serves as the central navigation hub for the agent.
 *
 * NOTE: Changed to a named export `export function Dashboard` to fix build errors.
 */
export function Dashboard({ onNavigate }: DashboardProps) {
  return (
    <div className="glass-card p-6 rounded-lg">
      <h3 className="text-2xl font-display text-primary mb-4">Agent Dashboard</h3>
      <p className="text-white/80 mb-4">
        Quick access to your most used tools and resources.
      </p>
      <div className="grid grid-cols-2 gap-4">
        {/* Example navigation buttons */}
        <button onClick={() => onNavigate('tour-catalog')} className="text-primary hover:underline">View Tour Catalog</button>
        <button onClick={() => onNavigate('pricing-matrix')} className="text-primary hover:underline">Open Pricing Matrix</button>
      </div>
    </div>
  );
}
