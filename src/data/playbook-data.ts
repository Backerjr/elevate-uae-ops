// Ahmed Travel | New Hire Training Playbook Data
// Complete data model for the UAE travel operations training system

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
  waiverUrl?: string;
}

export const tours: Tour[] = [
  {
    id: 'dubai-full-day',
    name: 'Dubai Full-Day Explore Tour',
    category: 'dubai',
    pickup: '10:00–10:30 AM',
    duration: '~10 hours (Drop-off ~8:30 PM)',
    highlights: [
      'Zabeel Palace (Photo stop)',
      'Museum of the Future, Dubai Frame (Photo stops)',
      'Bastakiya Heritage District + Abra Ride',
      'Gold & Spice Souks',
      'Farooq Omar Bin Al Khatib Mosque',
      'Monorail to Atlantis + Zabeel Saray Photo Stop',
      'Dubai Mall Waterfall & Fountain Show'
    ],
    visualCues: ['🌆', '🛶', '🚝', '✨'],
    proTip: 'Perfect all-in-one overview for first-time Dubai visitors.',
    margin: 'medium',
    difficulty: 'easy',
    idealFor: ['First-timers', 'Families', 'Culture lovers']
  },
  {
    id: 'desert-safari-sharing',
    name: 'Premium Desert Safari (Sharing Basis)',
    category: 'desert',
    pickup: '3:00 PM',
    duration: '~6 hours',
    highlights: [
      'Dune bashing in 4x4',
      'Desert sunset experience',
      'Traditional entertainment'
    ],
    inclusions: [
      '4x4 transfers',
      'Dune bashing',
      'Camel ride | Henna | Arabic dress photo',
      'International buffet dinner',
      'Tanoura & Fire Show'
    ],
    note: 'Recommend sneakers; avoid open sandals. Max 6 guests per vehicle.',
    visualCues: ['🏜️', '🐪', '🎭', '🌅'],
    margin: 'medium',
    difficulty: 'easy',
    idealFor: ['Adventure seekers', 'Couples', 'Groups']
  },
  {
    id: 'abu-dhabi-city',
    name: 'Abu Dhabi City Tour',
    category: 'abu-dhabi',
    pickup: '8:30 AM',
    duration: '~11.5 hours (Return ~8:00 PM)',
    highlights: [
      'Sheikh Zayed Grand Mosque',
      'BAPS Mandir (closed Mondays)',
      'Heritage Village',
      'Corniche',
      'Emirates Palace (Photo stop)'
    ],
    dressCode: 'Covered shoulders/knees; women require a headscarf.',
    visualCues: ['🕌', '🏛️', '🌴'],
    proTip: 'Add Ferrari World, Qasr Al Watan, or Louvre for premium packages.',
    margin: 'high',
    difficulty: 'easy',
    idealFor: ['Culture lovers', 'History buffs', 'Families']
  },
  {
    id: 'hot-air-balloon',
    name: 'Hot Air Balloon Experience',
    category: 'experience',
    pickup: 'Early morning (time varies by season)',
    duration: '~4 hours total',
    highlights: [
      'Sunrise desert flight',
      'Aerial views of dunes & wildlife',
      'Once-in-a-lifetime photo ops'
    ],
    requirements: [
      'Valid ID mandatory',
      'Age restrictions: 5–80 years',
      'Not permitted for pregnant guests',
      'Weight limits may apply'
    ],
    waiverUrl: 'https://raynawaiver.raynab2b.com/',
    visualCues: ['🎈', '🌅', '📸'],
    margin: 'high',
    difficulty: 'complex',
    idealFor: ['Couples', 'Special occasions', 'Adventure seekers']
  },
  {
    id: 'dhow-cruise-marina',
    name: 'Dhow Cruise – Dubai Marina (Upper Deck)',
    category: 'cruise',
    pickup: '7:30 PM',
    duration: '90 minutes cruise',
    highlights: [
      'Marina skyline views',
      'Traditional dhow experience',
      'Evening entertainment'
    ],
    inclusions: [
      'Buffet dinner',
      'Tanoura Show',
      'Marina Skyline Views'
    ],
    visualCues: ['🚢', '🎩', '🌊', '🌃'],
    margin: 'medium',
    difficulty: 'easy',
    idealFor: ['Couples', 'Families', 'Romantic evenings']
  },
  {
    id: 'buggy-quad',
    name: 'DTT Buggy / Quad Adventure',
    category: 'adventure',
    pickup: '5:30–6:00 AM (Sunrise)',
    duration: '~4 hours',
    highlights: [
      'Guided buggy or quad ride',
      'Dune bashing experience',
      'Desert sunrise'
    ],
    inclusions: [
      'Guided buggy or quad ride',
      'Dune bashing',
      'Camel ride & refreshments'
    ],
    requirements: [
      'Buggy: 20+ with valid license',
      'Quad: 16+ years',
      'Helmet mandatory'
    ],
    visualCues: ['🚙', '🪖', '🐫', '🌅'],
    margin: 'high',
    difficulty: 'moderate',
    idealFor: ['Adventure seekers', 'Young adults', 'Thrill seekers']
  }
];

export interface VehicleRate {
  vehicle: string;
  capacity: number;
  fullDayDubai: number;
  fullDayAbuDhabi: number;
  halfDayDubai: number;
  extraHourMin: number;
  extraHourMax: number;
}

export const vehicleRates: VehicleRate[] = [
  { vehicle: '7-Seater', capacity: 7, fullDayDubai: 720, fullDayAbuDhabi: 999, halfDayDubai: 456, extraHourMin: 80, extraHourMax: 100 },
  { vehicle: '12-Seater', capacity: 12, fullDayDubai: 960, fullDayAbuDhabi: 1100, halfDayDubai: 470, extraHourMin: 100, extraHourMax: 130 },
  { vehicle: '22-Seater', capacity: 22, fullDayDubai: 1040, fullDayAbuDhabi: 1900, halfDayDubai: 640, extraHourMin: 130, extraHourMax: 160 }
];

export interface Zone {
  zone: number;
  name: string;
  areas: string[];
  rates: {
    seater7: number;
    seater12: number;
    seater22: number;
  };
}

export const zones: Zone[] = [
  { zone: 1, name: 'Central Dubai', areas: ['Deira', 'Bur Dubai'], rates: { seater7: 136, seater12: 176, seater22: 480 } },
  { zone: 2, name: 'Downtown & Beach', areas: ['Downtown', 'SZR', 'Jumeirah'], rates: { seater7: 144, seater12: 184, seater22: 504 } },
  { zone: 3, name: 'Marina & Palm', areas: ['Marina', 'Palm Jumeirah', 'Barsha'], rates: { seater7: 168, seater12: 192, seater22: 560 } },
  { zone: 4, name: 'South Dubai', areas: ['DIP', 'Jebel Ali', 'Dubai South'], rates: { seater7: 288, seater12: 304, seater22: 656 } },
  { zone: 5, name: 'Desert Resorts', areas: ['Al Maha', 'Bab Al Shams'], rates: { seater7: 384, seater12: 480, seater22: 656 } }
];

export interface Attraction {
  id: string;
  name: string;
  publicRate: number;
  sellPrice: number;
  category: 'observation' | 'theme-park' | 'show' | 'aquarium' | 'museum';
  location: 'dubai' | 'abu-dhabi';
  notes?: string;
}

export const attractions: Attraction[] = [
  { id: 'burj-khalifa', name: 'Burj Khalifa (Non-Prime)', publicRate: 159, sellPrice: 254, category: 'observation', location: 'dubai' },
  { id: 'dubai-aquarium', name: 'Dubai Aquarium Explorer', publicRate: 199, sellPrice: 318, category: 'aquarium', location: 'dubai' },
  { id: 'aquaventure', name: 'Atlantis Aquaventure', publicRate: 299, sellPrice: 478, category: 'theme-park', location: 'dubai' },
  { id: 'sky-views', name: 'Sky Views Observatory', publicRate: 85, sellPrice: 136, category: 'observation', location: 'dubai' },
  { id: 'view-palm', name: 'The View at The Palm', publicRate: 100, sellPrice: 160, category: 'observation', location: 'dubai' },
  { id: 'dubai-frame', name: 'Dubai Frame', publicRate: 50, sellPrice: 80, category: 'observation', location: 'dubai' },
  { id: 'la-perle', name: 'La Perle (Silver)', publicRate: 369, sellPrice: 590, category: 'show', location: 'dubai' },
  { id: 'seaworld', name: 'SeaWorld Abu Dhabi', publicRate: 375, sellPrice: 600, category: 'theme-park', location: 'abu-dhabi' }
];

export interface ComboPackage {
  id: string;
  name: string;
  items: string[];
  totalPrice: number;
  savings: number;
  idealFor: string[];
  margin: 'high' | 'medium';
}

export const comboPackages: ComboPackage[] = [
  { id: 'burj-aquarium', name: 'Burj Khalifa + Aquarium', items: ['Burj Khalifa', 'Dubai Aquarium Explorer'], totalPrice: 572, savings: 50, idealFor: ['First-timers', 'Families'], margin: 'medium' },
  { id: 'aquaventure-cruise', name: 'Atlantis + Marina Cruise', items: ['Atlantis Aquaventure', 'Marina Dhow Cruise'], totalPrice: 956, savings: 75, idealFor: ['Couples', 'Luxury seekers'], margin: 'high' },
  { id: 'frame-safari', name: 'Dubai Frame + Desert Safari', items: ['Dubai Frame', 'Premium Desert Safari'], totalPrice: 640, savings: 60, idealFor: ['Budget-conscious', 'Adventure + Culture'], margin: 'medium' },
  { id: 'qasr-seaworld', name: 'Qasr Al Watan + SeaWorld', items: ['Qasr Al Watan', 'SeaWorld Abu Dhabi'], totalPrice: 1200, savings: 100, idealFor: ['Families', 'Abu Dhabi focus'], margin: 'high' },
  { id: 'ski-laperle', name: 'Ski Dubai + La Perle', items: ['Ski Dubai', 'La Perle Show'], totalPrice: 1022, savings: 80, idealFor: ['Unique experiences', 'Entertainment lovers'], margin: 'high' }
];

export interface WhatsAppScript {
  id: string;
  category: 'inquiry' | 'culture' | 'price' | 'objection' | 'upsell' | 'confirmation' | 'emergency';
  scenario: string;
  script: string;
  tags: string[];
}

export const whatsappScripts: WhatsAppScript[] = [
  {
    id: 'unique-experience',
    category: 'inquiry',
    scenario: 'Curious / Wants Something Unique',
    script: "You might love our sunrise hot air balloon or dune buggy experience — both are unforgettable Dubai moments. Shall I check availability?",
    tags: ['adventure', 'unique', 'first-contact']
  },
  {
    id: 'culture-focused',
    category: 'culture',
    scenario: 'Culture-Focused Client',
    script: "Abu Dhabi offers a beautiful mix of culture — Mosque, Qasr Al Watan, and Louvre. Would you like me to secure tomorrow's seats?",
    tags: ['culture', 'abu-dhabi', 'history']
  },
  {
    id: 'price-inquiry',
    category: 'price',
    scenario: 'Price Inquiry',
    script: "Pricing depends on your hotel zone and date, but we always provide premium service at great value. Would you like a quote including pickup?",
    tags: ['pricing', 'quote', 'value']
  },
  {
    id: 'budget-conscious',
    category: 'objection',
    scenario: 'Client Says Too Expensive',
    script: "I understand budget matters! Our sharing-basis tours offer the same premium experience at better value. Would you like to explore those options?",
    tags: ['objection', 'budget', 'sharing']
  },
  {
    id: 'family-package',
    category: 'upsell',
    scenario: 'Family Traveling Together',
    script: "For families, I'd recommend our private vehicle option — more comfort, flexible timing, and your own guide. Shall I create a family package quote?",
    tags: ['family', 'upsell', 'private']
  },
  {
    id: 'booking-confirm',
    category: 'confirmation',
    scenario: 'Confirming Booking',
    script: "Your booking is confirmed! ✨ Our driver will contact you 30 minutes before pickup. Please keep your phone accessible. Have an amazing experience!",
    tags: ['confirmation', 'logistics']
  },
  {
    id: 'no-show-policy',
    category: 'emergency',
    scenario: 'Client Missed Tour / No-Show',
    script: "We're sorry you couldn't make it. As per our policy, no-shows are non-refundable, but we'd love to reschedule for a future date. How can I help?",
    tags: ['no-show', 'policy', 'rebooking']
  },
  {
    id: 'weather-delay',
    category: 'emergency',
    scenario: 'Weather / Safety Cancellation',
    script: "Due to weather conditions, today's hot air balloon is cancelled for safety. We'll offer a full refund or free rebooking. Which would you prefer?",
    tags: ['weather', 'cancellation', 'safety']
  }
];

export interface SOPRule {
  id: string;
  category: 'policy' | 'process' | 'communication' | 'safety';
  title: string;
  description: string;
  importance: 'critical' | 'important' | 'standard';
}

export const sopRules: SOPRule[] = [
  { id: 'no-show', category: 'policy', title: 'No-Show = No Refund', description: 'Guests who do not show up forfeit their booking. No exceptions without prior approval.', importance: 'critical' },
  { id: 'cancellation', category: 'process', title: 'Cancellation Process', description: 'All cancellation requests must be emailed to online@raynab2b.com', importance: 'critical' },
  { id: 'zone-verify', category: 'process', title: 'Verify Pickup Zone', description: 'Always verify the client\'s pickup zone before quoting to ensure accurate pricing.', importance: 'important' },
  { id: 'dropoff-time', category: 'communication', title: 'No Guaranteed Drop-off', description: 'Never guarantee exact drop-off times — traffic may vary significantly.', importance: 'important' },
  { id: 'dress-code', category: 'communication', title: 'Mosque Dress Code', description: 'Remind clients about covered shoulders/knees and headscarves for mosque visits.', importance: 'standard' },
  { id: 'waiver', category: 'safety', title: 'Adventure Activity Waivers', description: 'Hot air balloon and adventure activities require signed waivers before participation.', importance: 'critical' }
];

export interface CheatCode {
  id: string;
  type: 'value' | 'margin' | 'budget' | 'upsell';
  title: string;
  details: string;
  priceRange?: string;
}

export const cheatCodes: CheatCode[] = [
  { id: 'best-value', type: 'value', title: 'Best Value Combo', details: 'Abu Dhabi + Ferrari World', priceRange: '~550 AED' },
  { id: 'high-margin', type: 'margin', title: 'High Margin Winners', details: 'Buggy + Balloon combo' },
  { id: 'budget-choice', type: 'budget', title: 'Budget Champion', details: 'Full-Day Dubai (sharing)', priceRange: '200–350 AED' },
  { id: 'top-upsells', type: 'upsell', title: 'Top Upsells', details: 'Private 4x4 | VIP Marina Cruise | Louvre Ticket' }
];

// Brand Philosophy
export const brandPillars = [
  { icon: '✨', name: 'Luxury', description: 'Present premium quality in every message and interaction.' },
  { icon: '🤝', name: 'Warmth', description: 'Stay personable, attentive, and human.' },
  { icon: '💎', name: 'Clarity', description: 'Communicate simply and precisely.' },
  { icon: '🎯', name: 'Diplomacy', description: 'Handle all situations with calm professionalism.' }
];
