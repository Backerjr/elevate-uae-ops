// Ahmed Travel | New Hire Training Playbook Data (30% retail markup applied)

import catalogData from "@data/products.json";

export interface Tour {
  id: string;
  name: string;
  category: 'dubai' | 'abu-dhabi' | 'desert' | 'adventure' | 'cruise' | 'experience';
  pickup: string;
  duration: string;
  highlights: string[];
  inclusions?: string[];
  requirements?: string[];
  proTip?: string;
  note?: string;
  dressCode?: string;
  visualCues: string[];
  margin: 'high' | 'medium' | 'low';
  difficulty: 'easy' | 'moderate' | 'complex';
  idealFor: string[];
  priceRange?: { min: number; max: number };
  bestFor?: string;
  tags?: string[];
  waiverUrl?: string;
  image?: string; // New Visual Asset Field
}

// --- SMART VISUAL RESOLVER ENGINE ---
// Maps specific keywords in tour titles to high-fidelity Unsplash visuals
const resolveHeroImage = (title: string, category: string): string => {
  const t = title.toLowerCase();

  // 1. Specific Landmarks & Attractions
  if (t.includes('burj khalifa')) return 'https://images.unsplash.com/photo-1582657233895-0f37a3ec7179?q=80&w=2070&auto=format&fit=crop'; // Tall tower shot
  if (t.includes('museum of the future')) return 'https://images.unsplash.com/photo-1662668862763-8360822a9792?q=80&w=2070&auto=format&fit=crop'; // Calligraphy building
  if (t.includes('ferrari')) return 'https://images.unsplash.com/photo-1583236270830-4cf92497047f?q=80&w=2070&auto=format&fit=crop'; // Red coaster/speed
  if (t.includes('louvre')) return 'https://images.unsplash.com/photo-1577712396677-4df3306eb8e6?q=80&w=2070&auto=format&fit=crop'; // Louvre dome
  if (t.includes('mosque') || t.includes('sheikh zayed')) return 'https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?q=80&w=2070&auto=format&fit=crop'; // Grand Mosque
  if (t.includes('frame')) return 'https://images.unsplash.com/photo-1605645398256-4c9299496732?q=80&w=2070&auto=format&fit=crop'; // Dubai Frame
  if (t.includes('atlantis') || t.includes('aquaventure')) return 'https://images.unsplash.com/photo-1623232873157-194361514781?q=80&w=2070&auto=format&fit=crop'; // Atlantis Palm
  if (t.includes('global village')) return 'https://images.unsplash.com/photo-1582236967757-935dfa97b2fb?q=80&w=2070&auto=format&fit=crop'; // Colorful pavilions

  // 2. Adventure Activities
  if (t.includes('buggy') || t.includes('dune buggy')) return 'https://images.unsplash.com/photo-1533240332313-0db49b459ad6?q=80&w=2070&auto=format&fit=crop'; // Action buggy
  if (t.includes('quad') || t.includes('bike')) return 'https://images.unsplash.com/photo-1599384733470-c36b8032b842?q=80&w=2070&auto=format&fit=crop'; // Quad bike
  if (t.includes('jet ski') || t.includes('jetski')) return 'https://images.unsplash.com/photo-1606927943468-d01729b46c64?q=80&w=2070&auto=format&fit=crop'; // Jet ski splash
  if (t.includes('balloon')) return 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=2070&auto=format&fit=crop'; // Hot air balloon
  if (t.includes('helicopter')) return 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=2070&auto=format&fit=crop'; // Aerial view

  // 3. Water & Cruises
  if (t.includes('yacht')) return 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?q=80&w=2070&auto=format&fit=crop'; // Luxury yacht
  if (t.includes('dhow') || t.includes('dinner cruise')) return 'https://images.unsplash.com/photo-1512632500708-1b2177c27f29?q=80&w=2070&auto=format&fit=crop'; // Marina night cruise
  if (t.includes('boat')) return 'https://images.unsplash.com/photo-1522542194-295166b70c84?q=80&w=2070&auto=format&fit=crop'; // Speedboat

  // 4. Desert Specifics
  if (t.includes('morning') && t.includes('desert')) return 'https://images.unsplash.com/photo-1545199583-026ccb2323e2?q=80&w=2070&auto=format&fit=crop'; // Bright desert
  if (t.includes('overnight') || t.includes('camping')) return 'https://images.unsplash.com/photo-1495954484750-af469f2f9be5?q=80&w=2070&auto=format&fit=crop'; // Tent/Stars
  if (t.includes('safari')) return 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?q=80&w=2070&auto=format&fit=crop'; // Classic Land Cruiser

  // 5. Category Fallbacks (Last Resort)
  switch(category) {
    case 'abu-dhabi': return 'https://images.unsplash.com/photo-1511923985923-277ba002220d?q=80&w=2070&auto=format&fit=crop';
    case 'dubai': return 'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=2070&auto=format&fit=crop';
    case 'cruise': return 'https://images.unsplash.com/photo-1597659840241-37e2b9c2f55f?q=80&w=2070&auto=format&fit=crop';
    default: return 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?q=80&w=2070&auto=format&fit=crop'; // Generic luxe travel
  }
};

const hardcodedTours: Tour[] = [
  {
    id: 'dubai-full-day',
    name: 'Dubai Full-Day Explore Tour',
    category: 'dubai',
    pickup: '10:00–10:30 AM',
    duration: '~10 hours (Drop-off ~8:30 PM)',
    highlights: ['Zabeel Palace', 'Museum of the Future', 'Bastakiya', 'Gold & Spice Souks', 'Palm Monorail'],
    visualCues: ['🌆', '🛶', '🚝', '✨'],
    proTip: 'Perfect all-in-one overview for first-time Dubai visitors.',
    margin: 'medium',
    difficulty: 'easy',
    idealFor: ['First-timers', 'Families'],
    image: resolveHeroImage('Dubai Full-Day Explore Tour', 'dubai')
  },
  {
    id: 'desert-safari-sharing',
    name: 'Premium Desert Safari (Sharing Basis)',
    category: 'desert',
    pickup: '3:00 PM',
    duration: '~6 hours',
    highlights: ['Dune bashing', 'Sunset photo', 'BBQ Dinner', 'Fire Show'],
    inclusions: ['4x4 transfers', 'Camel ride', 'Henna', 'Buffet dinner'],
    note: 'Max 6 guests per vehicle.',
    visualCues: ['🏜️', '🐪', '🎭'],
    margin: 'medium',
    difficulty: 'easy',
    idealFor: ['Adventure seekers', 'Groups'],
    image: resolveHeroImage('Premium Desert Safari', 'desert')
  },
  {
    id: 'abu-dhabi-city',
    name: 'Abu Dhabi City Tour',
    category: 'abu-dhabi',
    pickup: '8:30 AM',
    duration: '~11.5 hours',
    highlights: ['Sheikh Zayed Grand Mosque', 'Heritage Village', 'Corniche'],
    dressCode: 'Strict: Covered shoulders/knees.',
    visualCues: ['🕌', '🏛️', '🌴'],
    margin: 'high',
    difficulty: 'easy',
    idealFor: ['Culture lovers'],
    image: resolveHeroImage('Sheikh Zayed Grand Mosque', 'abu-dhabi')
  },
  {
    id: 'hot-air-balloon',
    name: 'Hot Air Balloon Experience',
    category: 'experience',
    pickup: 'Early morning',
    duration: '~4 hours',
    highlights: ['Sunrise flight', 'Dune views', 'Falcon show'],
    requirements: ['ID mandatory', 'Age 5-80'],
    waiverUrl: 'https://raynawaiver.raynab2b.com/',
    visualCues: ['🎈', '🌅'],
    margin: 'high',
    difficulty: 'complex',
    idealFor: ['Couples', 'VIP'],
    image: resolveHeroImage('Hot Air Balloon', 'experience')
  },
  {
    id: 'dhow-cruise-marina',
    name: 'Dhow Cruise – Dubai Marina',
    category: 'cruise',
    pickup: '7:30 PM',
    duration: '90 minutes',
    highlights: ['Skyline views', 'Buffet dinner', 'Tanoura Show'],
    visualCues: ['🚢', '🌃'],
    margin: 'medium',
    difficulty: 'easy',
    idealFor: ['Couples', 'Dinner'],
    image: resolveHeroImage('Dhow Cruise Marina', 'cruise')
  },
  {
    id: 'buggy-quad',
    name: 'DTT Buggy / Quad Adventure',
    category: 'adventure',
    pickup: 'Sunrise / Afternoon',
    duration: '~4 hours',
    highlights: ['Self-drive buggy', 'Dune bashing', 'Sandboarding'],
    requirements: ['License for Buggy', '16+ for Quad'],
    visualCues: ['🚙', '🪖', '🐫'],
    margin: 'high',
    difficulty: 'moderate',
    idealFor: ['Thrill seekers'],
    image: resolveHeroImage('Dune Buggy', 'adventure')
  }
];

type CatalogProduct = {
  product_id?: string;
  product_name?: string;
  title?: string;
  category?: string;
  destination_city?: string;
  duration_hours?: number;
  description_short?: string;
  inclusions?: unknown;
  pricing?: Array<{ price_aed?: number }>;
};

const mapCatalogCategory = (input?: string): Tour['category'] => {
  const normalized = (input ?? '').toLowerCase();
  if (normalized.includes('adventure')) return 'adventure';
  if (normalized.includes('desert')) return 'desert';
  if (normalized.includes('cruise')) return 'cruise';
  if (normalized.includes('dubai')) return 'dubai';
  if (normalized.includes('abu')) return 'abu-dhabi';
  return 'experience';
};

const mapCatalogProductToTour = (product: CatalogProduct, fallbackIndex: number): Tour => {
  const category = mapCatalogCategory(product.category);
  const name = product.product_name ?? product.title ?? 'Catalog Product';
  
  return {
    id: product.product_id ?? `catalog-${fallbackIndex}`,
    name: name,
    category: category,
    pickup: product.destination_city ?? 'UAE',
    duration: product.duration_hours ? `${product.duration_hours} hrs` : 'Approx 1–3 hrs',
    highlights: product.description_short ? [product.description_short] : [],
    inclusions: Array.isArray(product.inclusions) ? (product.inclusions as string[]) : [],
    requirements: [],
    proTip: undefined,
    note: product.pricing?.[0]?.price_aed ? `From AED ${product.pricing[0].price_aed}` : undefined,
    dressCode: undefined,
    visualCues: ['🧭'],
    margin: 'medium',
    difficulty: 'easy',
    idealFor: [product.category ?? 'Guests'],
    priceRange: product.pricing?.[0]?.price_aed
      ? { min: product.pricing[0].price_aed ?? 0, max: product.pricing[0].price_aed ?? 0 }
      : undefined,
    bestFor: product.category ?? undefined,
    tags: product.category ? [product.category] : [],
    waiverUrl: undefined,
    // VISION PROTOCOL: Resolve specific image based on product name
    image: resolveHeroImage(name, category)
  };
};

const mappedCatalogTours: Tour[] = (catalogData as CatalogProduct[]).map(mapCatalogProductToTour);

export const tours: Tour[] = [...hardcodedTours, ...mappedCatalogTours];

// ... (Exporting existing static datasets below without changes)
export interface VehicleRate { vehicle: string; capacity: number; fullDayDubai: number; halfDayDubai: number; fullDayAbuDhabi: number; transferDXB: number; }
export const vehicleRates: VehicleRate[] = [
  { vehicle: 'Lexus ES350 (Luxury Sedan)', capacity: 4, fullDayDubai: 650, halfDayDubai: 420, fullDayAbuDhabi: 780, transferDXB: 115 },
  { vehicle: '7 Seater (Standard)', capacity: 7, fullDayDubai: 585, halfDayDubai: 310, fullDayAbuDhabi: 650, transferDXB: 115 },
  { vehicle: 'Toyota Hiace (12 Seater)', capacity: 12, fullDayDubai: 620, halfDayDubai: 325, fullDayAbuDhabi: 685, transferDXB: 145 },
  { vehicle: 'Toyota Coaster (22 Seater)', capacity: 22, fullDayDubai: 845, halfDayDubai: 520, fullDayAbuDhabi: 975, transferDXB: 310 },
  { vehicle: 'Luxury Coach (35 Seater)', capacity: 35, fullDayDubai: 975, halfDayDubai: 585, fullDayAbuDhabi: 1105, transferDXB: 310 },
  { vehicle: 'Grand Coach (50 Seater)', capacity: 50, fullDayDubai: 1105, halfDayDubai: 715, fullDayAbuDhabi: 1235, transferDXB: 310 }
];

export interface Zone { zone: number; name: string; areas: string[]; rates: { seater4?: number; seater7: number; seater12: number; seater22: number; seater35?: number; seater50?: number; }; }
export const zones: Zone[] = [
  { zone: 1, name: 'Old Dubai', areas: ['Deira', 'Bur Dubai', 'Qusais', 'Al Nahda'], rates: { seater4: 115, seater7: 115, seater12: 145, seater22: 390, seater35: 425, seater50: 520 } },
  { zone: 2, name: 'Central Dubai', areas: ['DIFC', 'Sheikh Zayed Rd', 'Downtown', 'Jumeirah 1-3', 'Business Bay'], rates: { seater4: 120, seater7: 120, seater12: 150, seater22: 410, seater35: 455, seater50: 585 } },
  { zone: 3, name: 'New Dubai', areas: ['Al Barsha', 'Marina', 'JBR', 'Palm Jumeirah', 'Media City', 'Bluewaters'], rates: { seater4: 145, seater7: 140, seater12: 160, seater22: 455, seater35: 550, seater50: 645 } },
  { zone: 4, name: 'Far Dubai', areas: ['Jebel Ali', 'Dubai Parks', 'DIP', 'Expo City'], rates: { seater4: 230, seater7: 235, seater12: 250, seater22: 535, seater35: 615, seater50: 685 } }
];

export interface Attraction { id: string; name: string; sellPrice: number; netPrice: number; category: 'adventure' | 'culture' | 'luxury' | 'family'; }
export const attractions: Attraction[] = [
  { id: 'dtt-buggy', name: 'DTT Buggy Experience (1Hr)', sellPrice: 1040, netPrice: 845, category: 'adventure' },
  { id: 'dhow-marina', name: 'Dhow Cruise Marina (Upper Deck)', sellPrice: 195, netPrice: 120, category: 'luxury' },
  { id: 'ferrari-tix', name: 'Ferrari World Ticket', sellPrice: 450, netPrice: 385, category: 'adventure' },
  { id: 'burj-124', name: 'Burj Khalifa (124/125)', sellPrice: 235, netPrice: 205, category: 'culture' },
  { id: 'museum-future', name: 'Museum of the Future', sellPrice: 195, netPrice: 165, category: 'culture' },
  { id: 'aura-pool', name: 'Aura Skypool (Morning)', sellPrice: 325, netPrice: 260, category: 'luxury' },
  { id: 'frame', name: 'Dubai Frame', sellPrice: 75, netPrice: 60, category: 'culture' }
];

export interface ComboPackage { id: string; name: string; items: string[]; totalPrice: number; savings: string; tag: 'Best Seller' | 'VIP' | 'Family'; idealFor?: string[]; margin?: 'high' | 'medium' | 'low'; }
export const comboPackages: ComboPackage[] = [
  { id: 'abu-dhabi-ferrari', name: 'Abu Dhabi + Ferrari World', items: ['Private Transfer', 'Ferrari World Tix', 'Grand Mosque Visit', 'Dates Market'], totalPrice: 1105, savings: '10%', tag: 'Best Seller', idealFor: ['Families', 'Adventure seekers', 'Thrill fans'], margin: 'high' },
  { id: 'full-day-dubai', name: 'Full Day Dubai Ultimate', items: ['Bastakiya', 'Abra Ride', 'Gold Souq', 'Dubai Frame (Photo)', 'Atlantis (Photo)'], totalPrice: 650, savings: 'Custom', tag: 'Family', idealFor: ['Families', 'Culture lovers', 'First-timers'], margin: 'medium' },
  { id: 'dhow-dinner', name: 'Marina Dhow Dinner', items: ['90 Min Cruise', 'Intl Buffet', 'Tanura Dance', 'Private Transfer'], totalPrice: 260, savings: 'AED 50', tag: 'Family', idealFor: ['Couples', 'Families', 'Romantic evenings'], margin: 'medium' },
  { id: 'buggy-safari', name: 'Dune Buggy Safari', items: ['1hr Buggy (Self Drive)', 'Sand Boarding', 'Camel Ride', 'Refreshments'], totalPrice: 1235, savings: 'Adventure', tag: 'VIP', idealFor: ['Adventure seekers', 'VIP', 'Friends'], margin: 'high' }
];

export interface WhatsAppScript { id: string; category: 'inquiry' | 'culture' | 'price' | 'objection' | 'upsell' | 'confirmation' | 'emergency'; scenario: string; script: string; tags: string[]; }
export const whatsappScripts: WhatsAppScript[] = [
  { id: 'price-doubt', category: 'objection', scenario: 'Price Doubt Killer', script: "I know you'll find cheaper out there—I won't lie. But you won't find *me* out there. I make sure everything runs smooth, no last-minute stress, and I'm always one message away. That's the difference. 🤝", tags: ['closing', 'trust'] },
  { id: 'booking-hype', category: 'confirmation', scenario: 'Booking Confirmation Hype', script: "Alright, we're locked in! 🔒 I'll personally follow up to make sure your experience is as smooth as your dune ride's gonna be. You're in good hands. 🚙✨", tags: ['confirmation', 'excitement'] },
  { id: 'snooze-lose', category: 'upsell', scenario: "The 'You Snooze, You Lose' Follow-Up", script: "Hey hey—quick heads-up, spots are filling fast, so if you're still thinking about it, let me know. I'd hate for you to miss out on a perfect day just 'cause we waited too long. ⏳", tags: ['urgency', 'follow-up'] },
  { id: 'luxury-vibes', category: 'upsell', scenario: 'Luxury Vibes Guest (Classy)', script: "For my premium guests, I always recommend this one—everything's done right, smooth, and no surprises. If you're looking for comfort and quality, this is the one. 🥂", tags: ['vip', 'luxury'] },
  { id: 'vip-flattery', category: 'upsell', scenario: 'VIP Guest with Flattery', script: "I saved this option just for you, because honestly? It fits your style. It's classy, private, and guaranteed to impress—just like you. Let me know if I should lock it in.", tags: ['vip', 'persuasion'] },
  { id: 'post-exp', category: 'confirmation', scenario: 'Post-Experience Follow-Up', script: "Hey! Hope you had the best time today. Just checking in to see how everything went. And hey—if you need anything else while you're in Dubai, you already know who to message. 📲", tags: ['follow-up', 'relationship'] },
  { id: 'inq-general', category: 'inquiry', scenario: 'General Inquiry (Intro)', script: "Hi there! I'm [Name] from Ahmed Travel. You tell me what you want, I'll make it happen—no pressure, no chaos. I'll handle everything, you just enjoy. What dates are you looking at? 🗓️", tags: ['opener', 'friendly'] },
  { id: 'mosque-dress', category: 'culture', scenario: 'Mosque Dress Code', script: "Important for the Grand Mosque 🕌: \n• Ladies: Long sleeves, ankle-length trousers/skirt, and headscarf required.\n• Gents: Long trousers (no shorts) and sleeved shirts.\n\nLet me know if you need help arranging abayas!", tags: ['info', 'guidelines'] }
];

export interface SOPRule { id: string; category: 'policy' | 'process' | 'communication' | 'safety'; title: string; description: string; importance: 'critical' | 'important' | 'standard'; }
export const sopRules: SOPRule[] = [
  { id: 'no-show', category: 'policy', title: 'No-Show = No Refund', description: 'Guests who do not show up forfeit their booking. No exceptions without prior approval.', importance: 'critical' },
  { id: 'cancellation', category: 'process', title: 'Cancellation Process', description: 'All cancellation requests must be emailed to online@raynab2b.com', importance: 'critical' },
  { id: 'zone-verify', category: 'process', title: 'Verify Pickup Zone', description: 'Always verify the client\'s pickup zone before quoting to ensure accurate pricing.', importance: 'important' },
  { id: 'dropoff-time', category: 'communication', title: 'No Guaranteed Drop-off', description: 'Never guarantee exact drop-off times — traffic may vary significantly.', importance: 'important' },
  { id: 'dress-code', category: 'communication', title: 'Mosque Dress Code', description: 'Remind clients about covered shoulders/knees and headscarves for mosque visits.', importance: 'standard' },
  { id: 'waiver', category: 'safety', title: 'Adventure Activity Waivers', description: 'Hot air balloon and adventure activities require signed waivers before participation.', importance: 'critical' }
];

export interface CheatCode { id: string; type: 'value' | 'margin' | 'budget' | 'upsell'; title: string; details: string; priceRange?: string; }
export const cheatCodes: CheatCode[] = [
  { id: 'best-value', type: 'value', title: 'Best Value Combo', details: 'Abu Dhabi + Ferrari World', priceRange: '~550 AED' },
  { id: 'high-margin', type: 'margin', title: 'High Margin Winners', details: 'Buggy + Balloon combo' },
  { id: 'budget-choice', type: 'budget', title: 'Budget Champion', details: 'Full-Day Dubai (sharing)', priceRange: '200–350 AED' },
  { id: 'top-upsells', type: 'upsell', title: 'Top Upsells', details: 'Private 4x4 | VIP Marina Cruise | Louvre Ticket' }
];

export const brandPillars = [
  { icon: '✨', name: 'Luxury', description: 'Present premium quality in every message and interaction.' },
  { icon: '🤝', name: 'Warmth', description: 'Stay personable, attentive, and human.' },
  { icon: '💎', name: 'Clarity', description: 'Communicate simply and precisely.' },
  { icon: '🎯', name: 'Diplomacy', description: 'Handle all situations with calm professionalism.' }
];