export const objectionHandlers = [
  {
    id: "obj_expensive",
    objection: "It's too expensive / I found it cheaper online.",
    category: "Price",
    response:
      "I completely understand that budget is key. The reason this package is priced higher is that it includes [Premium Feature 1] and [Premium Feature 2] which standard online tickets exclude.",
    bulletPoints: [
      "Highlight 'No Hidden Costs' (transfers, food, tax included).",
      "Mention the 'Private' aspect vs. crowded buses.",
      "Ask: 'Is the cheaper option including hotel pickup?'",
    ],
  },
  {
    id: "obj_think_about_it",
    objection: "I need to think about it.",
    category: "Timing",
    response:
      "Of course, take your time. However, just a heads-up that [Tour Name] is our most popular sunset slot and we typically sell out 48 hours in advance.",
    bulletPoints: [
      "Create soft urgency (availability vs. price).",
      "Offer a 'Risk-Free' hold if applicable.",
      "Ask: 'Is there a specific detail you are unsure about?'",
    ],
  },
  {
    id: "obj_trust",
    objection: "Is it safe / reliable?",
    category: "Trust",
    response:
      "Safety is our #1 priority. We use only licensed, insurance-covered 4x4s and our drivers are professionally certified for desert driving. We've safely guided over 10,000 guests this year alone.",
    bulletPoints: [
      "Mention insurance coverage.",
      "Cite TripAdvisor rating or recent guest count.",
      "Reassure about 24/7 support line.",
    ],
  },
] as const;
