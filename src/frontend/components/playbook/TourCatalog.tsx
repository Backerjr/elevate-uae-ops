/* src/frontend/components/playbook/TourCatalog.tsx */
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, MapPin, Tag } from 'lucide-react';

// --- Type Definitions for Tour Data ---
interface Inclusion {
  id: number;
  name: string;
}

interface TourHighlight {
  id: number;
  name: string;
}

interface Tour {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'archived' | 'pending';
  destination: string;
  duration: string;
  heroImageUrl?: string;
  highlights: TourHighlight[];
  inclusions: Inclusion[];
}

// --- Mock Data (for demonstration purposes) ---
const mockTours: Tour[] = [
  {
    id: 'T1001',
    title: 'Arabian Sands Adventure',
    description: 'Experience the majesty of the desert with a thrilling 4x4 dune bashing adventure and a serene sunset camel ride.',
    status: 'active',
    destination: 'Dubai Desert Conservation Reserve',
    duration: '6 hours',
    heroImageUrl: '/assets/placeholders/hero_desert_1.jpg',
    highlights: [{ id: 1, name: 'Private Dune Buggy' }, { id: 2, name: 'Sunset Camel Ride' }],
    inclusions: [{ id: 1, name: 'Gourmet Dinner' }, { id: 2, name: 'Transportation' }],
  },
  {
    id: 'T1002',
    title: 'Opulent Cityscape Tour',
    description: 'A luxurious journey through Dubai\'s iconic landmarks, from the Burj Khalifa to the Palm Jumeirah.',
    status: 'pending',
    destination: 'Downtown Dubai',
    duration: '4 hours',
    heroImageUrl: '/assets/placeholders/hero_city_2.jpg',
    highlights: [{ id: 1, name: 'Burj Khalifa Access' }, { id: 2, name: 'Luxury Yacht Cruise' }],
    inclusions: [{ id: 1, name: 'Personal Photographer' }, { id: 2, name: 'Champagne Toast' }],
  },
  {
    id: 'T1003',
    title: 'Underwater Sanctuary',
    description: 'Discover the vibrant marine life of the Arabian Gulf. Snorkeling or diving in crystal clear waters.',
    status: 'active',
    destination: 'Fujairah Coast',
    duration: 'Full Day',
    heroImageUrl: '/assets/placeholders/hero_water_3.jpg',
    highlights: [{ id: 1, name: 'Guided Snorkeling Tour' }, { id: 2, name: 'PADI Certified Instructors' }],
    inclusions: [{ id: 1, name: 'Equipment Rental' }, { id: 2, name: 'Beachfront Lunch' }],
  },
];

// --- Tour Card Component (Redesigned) ---
const TourCard: React.FC<{ tour: Tour }> = ({ tour }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Define hover styles for glassmorphism and gold glow
  const cardStyles = `
    glass-card rounded-xl overflow-hidden
    transition-all duration-300 ease-in-out
    hover:scale-[1.02] hover:shadow-primary/50 hover:shadow-2xl
  `;

  // Determine badge style based on status
  const badgeClass = tour.status === 'active'
    ? 'border-primary text-primary'
    : 'border-white/50 text-white/70';

  return (
    <div className={cardStyles}>
      {/* --- Card Header: Hero Image with Gold Overlay --- */}
      <div className="relative h-64">
        <img
          src={tour.heroImageUrl || '/assets/placeholders/hero.svg'} // Placeholder image
          alt={tour.title}
          className="w-full h-full object-cover"
        />
        {/* Gold Accent Overlay and Status Badge */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-60"></div>
        <div className="absolute bottom-0 left-0 p-4 w-full flex justify-between items-end">
          <span className={`px-4 py-1 text-sm font-semibold rounded-full border ${badgeClass}`}>
            {tour.status}
          </span>
        </div>
      </div>

      {/* --- Card Content --- */}
      <div className="p-6">
        {/* Tour Title - Use font-display for luxury aesthetic */}
        <h3 className="text-3xl font-display text-primary mb-2 leading-tight">
          {tour.title}
        </h3>
        {/* Tour Description */}
        <p className="text-white/80 line-clamp-3 mb-4">{tour.description}</p>

        {/* --- Key Details (Iconography) --- */}
        <div className="space-y-3 mb-4 text-white/90">
          <div className="flex items-center space-x-3">
            <MapPin className="w-5 h-5 text-primary" />
            <span className="text-sm">{tour.destination}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-primary" />
            <span className="text-sm">{tour.duration}</span>
          </div>
        </div>

        {/* --- Collapsible Details Area --- */}
        {isExpanded && (
          <div className="space-y-4 pt-4 border-t border-muted">
            {/* Highlights Section */}
            <div>
              <h4 className="text-md font-display text-primary mb-2">Highlights</h4>
              <ul className="grid grid-cols-2 gap-y-2 text-sm text-white/80">
                {tour.highlights.map(h => (
                  <li key={h.id} className="flex items-center">
                    <div className="w-1 h-1 bg-primary rounded-full mr-2"></div>
                    {h.name}
                  </li>
                ))}
              </ul>
            </div>
            {/* Inclusions Section */}
            <div>
              <h4 className="text-md font-display text-primary mb-2">Inclusions</h4>
              <ul className="grid grid-cols-2 gap-y-2 text-sm text-white/80">
                {tour.inclusions.map(i => (
                  <li key={i.id} className="flex items-center">
                    <div className="w-1 h-1 bg-primary rounded-full mr-2"></div>
                    {i.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* --- Expand/Collapse Toggle Button --- */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full mt-4 flex justify-center items-center text-sm font-semibold text-primary/80 hover:text-primary transition-colors duration-200"
        >
          {isExpanded ? (
            <>
              Show Less <ChevronUp className="w-4 h-4 ml-2" />
            </>
          ) : (
            <>
              Show More <ChevronDown className="w-4 h-4 ml-2" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// --- Tour Catalog Component ---
/**
 * Exported as both a named and default export so consumers can import it either way:
 * - `import TourCatalog from ...`
 * - `import { TourCatalog } from ...`
 */
export const TourCatalog: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Grid Layout: 1 column on mobile, 2 on tablet, 3 on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mockTours.map(tour => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>
    </div>
  );
};

export default TourCatalog;
