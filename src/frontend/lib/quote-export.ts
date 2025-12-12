/**
 * Quote Export Utility
 * Isolated module for exporting quotes as PDF or Image
 * Backward-compatible, non-intrusive
 */

export interface QuoteData {
  tourType: string;
  vehicle: string;
  zone: string;
  zoneName?: string;
  guests: number;
  vehicleRate: number;
  pickupRate: number;
  attractionsCost: number;
  total: number;
  perPerson: number;
  attractions?: string[];
}

/**
 * Export quote as formatted text for clipboard
 */
export function exportQuoteAsText(data: QuoteData): string {
  return `
🌟 Ahmed Travel Quote
━━━━━━━━━━━━━━━━━━

📍 Tour: ${data.tourType}
🚐 Vehicle: ${data.vehicle}
📍 Pickup Zone: Zone ${data.zone}${data.zoneName ? ` (${data.zoneName})` : ''}
👥 Guests: ${data.guests}

💰 Breakdown:
• Vehicle: AED ${data.vehicleRate}
• Pickup: AED ${data.pickupRate}
${data.attractionsCost > 0 ? `• Attractions: AED ${data.attractionsCost}` : ''}

━━━━━━━━━━━━━━━━━━
✨ Total: AED ${data.total}
👤 Per Person: AED ${data.perPerson}

Thank you for choosing Ahmed Travel! ✈️
  `.trim();
}

/**
 * Export quote as HTML for image generation
 */
export function exportQuoteAsHTML(data: QuoteData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: 'Inter', system-ui, sans-serif;
      background: linear-gradient(135deg, #1a1f3a 0%, #2a2f4a 50%, #3a3020 100%);
      color: #f5f5f5;
      padding: 40px;
      margin: 0;
    }
    .quote-container {
      max-width: 600px;
      margin: 0 auto;
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(20px);
      border-radius: 16px;
      padding: 32px;
      box-shadow: 0 12px 40px -8px rgba(0, 0, 0, 0.3);
    }
    .header {
      text-align: center;
      margin-bottom: 24px;
    }
    .title {
      font-size: 28px;
      font-weight: 700;
      color: #f59e0b;
      margin-bottom: 8px;
    }
    .divider {
      height: 2px;
      background: linear-gradient(90deg, transparent, #f59e0b, transparent);
      margin: 16px 0;
    }
    .section {
      margin: 16px 0;
    }
    .row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 16px;
    }
    .label {
      color: #d1d5db;
    }
    .value {
      font-weight: 600;
      color: #ffffff;
    }
    .total {
      font-size: 24px;
      font-weight: 700;
      color: #f59e0b;
    }
    .footer {
      text-align: center;
      margin-top: 24px;
      font-size: 14px;
      color: #9ca3af;
    }
  </style>
</head>
<body>
  <div class="quote-container">
    <div class="header">
      <div class="title">🌟 Ahmed Travel Quote</div>
    </div>
    <div class="divider"></div>
    <div class="section">
      <div class="row">
        <span class="label">📍 Tour:</span>
        <span class="value">${data.tourType}</span>
      </div>
      <div class="row">
        <span class="label">🚐 Vehicle:</span>
        <span class="value">${data.vehicle}</span>
      </div>
      <div class="row">
        <span class="label">📍 Pickup Zone:</span>
        <span class="value">Zone ${data.zone}</span>
      </div>
      <div class="row">
        <span class="label">👥 Guests:</span>
        <span class="value">${data.guests}</span>
      </div>
    </div>
    <div class="divider"></div>
    <div class="section">
      <div class="row">
        <span class="label">Vehicle:</span>
        <span class="value">AED ${data.vehicleRate}</span>
      </div>
      <div class="row">
        <span class="label">Pickup:</span>
        <span class="value">AED ${data.pickupRate}</span>
      </div>
      ${data.attractionsCost > 0 ? `
      <div class="row">
        <span class="label">Attractions:</span>
        <span class="value">AED ${data.attractionsCost}</span>
      </div>
      ` : ''}
    </div>
    <div class="divider"></div>
    <div class="section">
      <div class="row">
        <span class="label">✨ Total:</span>
        <span class="total">AED ${data.total}</span>
      </div>
      <div class="row">
        <span class="label">👤 Per Person:</span>
        <span class="value">AED ${data.perPerson}</span>
      </div>
    </div>
    <div class="footer">
      Thank you for choosing Ahmed Travel! ✈️
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Download quote as HTML file
 */
export function downloadQuoteAsHTML(data: QuoteData, filename = 'ahmed-travel-quote.html'): void {
  const html = exportQuoteAsHTML(data);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Copy quote to clipboard
 */
export function copyQuoteToClipboard(data: QuoteData): Promise<void> {
  const text = exportQuoteAsText(data);
  return navigator.clipboard.writeText(text);
}
