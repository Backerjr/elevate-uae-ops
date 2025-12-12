/**
 * Recent Quotes Storage
 * Isolated localStorage-based module for tracking recent quotes
 * Backward-compatible, non-intrusive
 */

export interface RecentQuote {
  id: string;
  timestamp: number;
  tourType: string;
  vehicle: string;
  zone: string;
  guests: number;
  total: number;
  perPerson: number;
}

const STORAGE_KEY = 'ahmed-travel-recent-quotes';
const MAX_RECENT_QUOTES = 10;

/**
 * Get all recent quotes from localStorage
 */
export function getRecentQuotes(): RecentQuote[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const quotes = JSON.parse(stored) as RecentQuote[];
    return quotes.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Failed to load recent quotes:', error);
    return [];
  }
}

/**
 * Save a new quote to recent quotes
 */
export function saveRecentQuote(quote: Omit<RecentQuote, 'id' | 'timestamp'>): void {
  try {
    const quotes = getRecentQuotes();
    const newQuote: RecentQuote = {
      ...quote,
      id: `quote-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };
    
    // Add to beginning and limit to MAX_RECENT_QUOTES
    const updatedQuotes = [newQuote, ...quotes].slice(0, MAX_RECENT_QUOTES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedQuotes));
  } catch (error) {
    console.error('Failed to save recent quote:', error);
  }
}

/**
 * Delete a specific quote by ID
 */
export function deleteRecentQuote(id: string): void {
  try {
    const quotes = getRecentQuotes();
    const filtered = quotes.filter(q => q.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to delete recent quote:', error);
  }
}

/**
 * Clear all recent quotes
 */
export function clearRecentQuotes(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear recent quotes:', error);
  }
}

/**
 * Format timestamp to readable date
 */
export function formatQuoteDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
  });
}
