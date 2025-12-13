export interface Script {
  id: string;
  title: string;
  category: "Introduction" | "Objection Handling" | "Closing" | "Follow Up" | "VIP";
  text: string;
  tags?: string[];
}

export const whatsappScripts: Script[] = [
  {
    id: "intro_ahmed",
    title: "1. Warm Welcome (Ahmed Style)",
    category: "Introduction",
    text: "Hey! Welcome to Dubai, I'm Ahmed with Rayna Tours. You tell me what you want, I'll make it happen—no pressure, no chaos. I'll handle everything, you just enjoy.",
    tags: ["New Lead", "Casual"],
  },
  {
    id: "objection_price",
    title: "2. Price Doubt Killer",
    category: "Objection Handling",
    text: "I know you'll find cheaper out there—I won't lie. But you won't find *me* out there. I make sure everything runs smooth, no last-minute stress, and I'm always one message away. That's the difference.",
    tags: ["High Price", "Trust"],
  },
  {
    id: "closing_locked",
    title: "3. Booking Confirmation Hype",
    category: "Closing",
    text: "Alright, we're locked in! I'll personally follow up to make sure your experience is as smooth as your dune ride's gonna be. You're in good hands.",
    tags: ["Confirmed"],
  },
  {
    id: "followup_post_trip",
    title: "4. Post-Experience Check-in",
    category: "Follow Up",
    text: "Hey! Hope you had the best time today. Just checking in to see how everything went. And hey—if you need anything else while you're in Dubai, you already know who to message.",
    tags: ["Review"],
  },
  {
    id: "urgency_snooze",
    title: "5. Urgency (Snooze = Lose)",
    category: "Follow Up",
    text: "Hey hey—quick heads-up, spots are filling fast, so if you're still thinking about it, let me know. I'd hate for you to miss out on a perfect day just 'cause we waited too long.",
    tags: ["Urgency"],
  },
  {
    id: "upsell_luxury",
    title: "6. Luxury Recommendation",
    category: "VIP",
    text: "For my premium guests, I always recommend this one—everything's done right, smooth, and no surprises. If you're looking for comfort and quality, this is the one.",
    tags: ["Premium", "Upsell"],
  },
  {
    id: "upsell_exclusive",
    title: "7. VIP Flattery",
    category: "VIP",
    text: "I saved this option just for you, because honestly? It fits your style. It's classy, private, and guaranteed to impress—just like you. Let me know if I should lock it in.",
    tags: ["VIP", "High Net Worth"],
  },
  {
    id: "sign_off",
    title: "Bonus: Signature Sign-Off",
    category: "Closing",
    text: "If you want it done right—done smooth—you already know. Just message me. I'm Ahmed, and I've got you covered.",
    tags: ["Branding"],
  },
];
