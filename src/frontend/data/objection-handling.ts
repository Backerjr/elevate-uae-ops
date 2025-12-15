export const objectionHandlers = [
  {
    id: "obj_expensive",
    objection: "It's too expensive / I found it cheaper online.",
    category: "Price",
    severity: "High",
    response:
      "I completely understand that budget is key. The reason this package is priced higher is that it includes [Premium Feature 1] and [Premium Feature 2] which standard online tickets exclude.",
    followUp: "Have you checked if the cheaper option includes private 4x4 pickup?",
    proTip: "Focus on 'Value vs Cost' - cheaper often means crowded buses.",
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
    severity: "Medium",
    response:
      "Of course, take your time. However, just a heads-up that [Tour Name] is our most popular sunset slot and we typically sell out 48 hours in advance.",
    followUp: "Is there a specific detail you're unsure about?",
    proTip: "Use 'Soft Urgency' - availability is real leverage.",
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
    severity: "Critical",
    response:
      "Safety is our #1 priority. We use only licensed, insurance-covered 4x4s and our drivers are professionally certified for desert driving. We've safely guided over 10,000 guests this year alone.",
    followUp: "Would seeing our recent TripAdvisor reviews help give you peace of mind?",
    proTip: "Leaning on 'Certified' and 'Insurance' builds instant trust.",
    bulletPoints: [
      "Mention insurance coverage.",
      "Cite TripAdvisor rating or recent guest count.",
      "Reassure about 24/7 support line.",
    ],
  },
] as const;
