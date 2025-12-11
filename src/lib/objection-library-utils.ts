/**
 * Objection Library Utilities
 * Types, constants, and data for the ObjectionLibrary component
 */

export interface ObjectionHandler {
  id: string;
  objection: string;
  category: 'price' | 'trust' | 'timing' | 'comparison' | 'indecision';
  severity: 'common' | 'tricky' | 'rare';
  response: string;
  followUp: string;
  proTip: string;
}

export const objectionHandlers: ObjectionHandler[] = [
  {
    id: 'too-expensive',
    objection: "It's too expensive / That's more than I expected",
    category: 'price',
    severity: 'common',
    response: "I completely understand! Many guests feel the same initially. Our pricing includes premium private service, expert guides, and all-inclusive experiences. Let me show you our sharing-basis options that offer the same quality at better value — would that interest you?",
    followUp: "What budget range were you thinking? I can customize a package that gives you the best experience within that.",
    proTip: "Never immediately discount. First, highlight value. If needed, offer sharing basis or remove add-ons."
  },
  {
    id: 'found-cheaper',
    objection: "I found the same tour cheaper elsewhere",
    category: 'comparison',
    severity: 'tricky',
    response: "Thank you for sharing that! I'd love to understand what's included in that offer. Often, lower prices mean shared vehicles with many strangers, no English guides, or hidden fees. Our tours include private transfers, certified guides, and full transparency. May I ask what's included in the other offer?",
    followUp: "Would you like me to match their offer while maintaining our premium service standards?",
    proTip: "Ask what's included. Usually competitors skip pickup, use shared buses, or have hidden costs."
  },
  {
    id: 'need-time',
    objection: "I need to think about it / discuss with family",
    category: 'indecision',
    severity: 'common',
    response: "Of course, take your time! Many of our best experiences book out quickly, especially during peak season. Shall I hold this slot for 24 hours while you decide? No payment needed yet.",
    followUp: "Is there anything specific I can clarify that would help with the decision?",
    proTip: "Create urgency without pressure. Offer to hold slots. Ask what information would help them decide."
  },
  {
    id: 'not-sure-tour',
    objection: "I'm not sure which tour to choose",
    category: 'indecision',
    severity: 'common',
    response: "That's completely normal — we have so many amazing options! Let me help narrow it down. What excites you most: culture and history, adventure and thrills, or scenic photography? And how much time do you have?",
    followUp: "Based on what you've told me, I'd recommend [X] — it's perfect for [reason]. Would you like more details?",
    proTip: "Use the Tour Recommender tool to quickly find the best match based on their preferences."
  },
  {
    id: 'bad-reviews',
    objection: "I've read some bad reviews about tours in Dubai",
    category: 'trust',
    severity: 'tricky',
    response: "I appreciate you bringing that up — it shows you're doing your research! Unfortunately, there are some operators who cut corners. Ahmed Travel has a 4.9★ rating because we prioritize quality over quantity. Every guide is certified, every vehicle is premium, and every guest gets personalized attention. Would you like to see some recent testimonials?",
    followUp: "I can also share photos from recent tours if that helps!",
    proTip: "Acknowledge concerns, differentiate your service, and offer social proof."
  },
  {
    id: 'weather-concern',
    objection: "What if the weather is bad?",
    category: 'timing',
    severity: 'common',
    response: "Great question! For outdoor activities like hot air balloons, your safety is our priority — if weather prevents the activity, you get a full refund or free rebooking. For city tours, rain is rare in UAE, but even then, many attractions are indoor. Rest assured, you're protected.",
    followUp: "Would you like me to check the weather forecast for your dates?",
    proTip: "Always reassure about refund/rebooking policies. UAE weather is generally excellent."
  },
  {
    id: 'kids-friendly',
    objection: "Is this suitable for kids?",
    category: 'trust',
    severity: 'common',
    response: "Absolutely! We specialize in family experiences. Our private vehicles have child seats available, guides are trained to engage kids, and we can customize timing around nap schedules. Which ages are your little ones?",
    followUp: "For families, I especially recommend [tour] — kids love the [specific feature]!",
    proTip: "Always ask ages. Some activities have restrictions (balloons: 5+, quads: 16+). Recommend family-friendly alternatives."
  },
  {
    id: 'last-minute',
    objection: "Can I book for tomorrow?",
    category: 'timing',
    severity: 'rare',
    response: "Let me check availability right now! While some experiences need advance booking, we often have last-minute slots. Give me one moment... [check]. Great news — I can confirm [tour] for tomorrow. Shall I reserve it?",
    followUp: "Payment can be processed immediately via our secure link.",
    proTip: "Never say no immediately. Check availability. If unavailable, offer alternatives."
  }
];

export const categoryIcons: Record<string, string> = {
  price: '💰',
  trust: '🤝',
  timing: '⏰',
  comparison: '⚖️',
  indecision: '🤔',
};

export const severityColors = {
  common: 'muted',
  tricky: 'warning',
  rare: 'info',
} as const;

export function copyObjectionResponse(
  handler: ObjectionHandler,
  onCopied: (handlerId: string) => void,
  onSuccess?: (message: string) => void
): void {
  navigator.clipboard.writeText(handler.response);
  onCopied(handler.id);
  if (onSuccess) {
    onSuccess('Response copied!');
  }
  setTimeout(() => onCopied(''), 2000);
}
