/* src/frontend/pages/Index.tsx */
import React from 'react';
import TourCatalog from '../components/playbook/TourCatalog';

// --- Hero Banner Component ---
const HeroBanner: React.FC<{ agentName: string }> = ({ agentName }) => {
  return (
    <div className="p-8 md:p-12 lg:p-16 rounded-lg bg-gradient-hero mb-8 shadow-inner">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-display text-primary mb-2">
        Welcome, {agentName}.
      </h1>
      <p className="text-xl md:text-2xl font-sans text-white/90">
        Ready to elevate your clients' travel experiences?
      </p>
    </div>
  );
};

// --- Main Page Component ---
const IndexPage: React.FC = () => {
  // Mock user data for personalization
  const currentUser = { name: 'Aisha Al-Junaibi' };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto pt-8 px-4">
        {/* --- Luxury Hero Banner --- */}
        <HeroBanner agentName={currentUser.name} />

        {/* --- Tour Catalog Section --- */}
        <section className="py-8">
          <h2 className="text-4xl font-display text-white mb-6 border-b border-muted pb-2">
            Luxury Tour Collection
          </h2>
          <TourCatalog />
        </section>
      </div>
    </div>
  );
};

export default IndexPage;
