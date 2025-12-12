export const whatsappScripts = [
  {
    id: "wa_warm_welcome",
    title: "Warm Welcome (Inbound)",
    category: "Outreach",
    content:
      "Hi [Name]! 👋 This is [Agent Name] from Rayna Tours. I received your request for the [Tour Name]. \n\nI’m reviewing the availability now—are you looking for a standard experience or would you prefer the VIP upgrade with private transfers? 🚗✨",
    tags: ["Inbound", "Qualifying"],
  },
  {
    id: "wa_price_drop",
    title: "Price Drop Alert (Re-engagement)",
    category: "Follow-up",
    content:
      "Hi [Name], quick update! 🚨 We just had a price drop for the [Tour Name] on [Date]. \n\nIt’s now available for [New Price] instead of [Old Price]. 📉\n\nI can hold this rate for you until 5 PM today. Shall I send the booking link?",
    tags: ["Urgency", "Discount"],
  },
  {
    id: "wa_concierge_close",
    title: "The 'Concierge' Close",
    category: "Closing",
    content:
      "Great choice, [Name]. I’ve drafted your itinerary. 📝\n\nTo finalize the [Tour Name], I just need a quick confirmation on the pickup time: \nOption A: 2:00 PM (Leisurely start)\nOption B: 3:30 PM (Catch the sunset directly)\n\nWhich works better for you?",
    tags: ["Closing", "Options"],
  },
  {
    id: "wa_payment_link",
    title: "Payment Link Delivery",
    category: "Closing",
    content:
      "All set, [Name]! 🎟️\n\nHere is your secure payment link for the [Tour Name]: [Link]\n\nOnce completed, you’ll receive the voucher instantly on WhatsApp. Let me know if you have any trouble!",
    tags: ["Transaction", "Admin"],
  },
] as const;
