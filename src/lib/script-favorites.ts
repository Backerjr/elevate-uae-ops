/**
 * Script Favorites Storage
 * Isolated localStorage-based module for managing favorite scripts
 * Backward-compatible, non-intrusive
 */

const STORAGE_KEY = 'ahmed-travel-favorite-scripts';

/**
 * Get all favorited script IDs from localStorage
 */
export function getFavoriteScripts(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as string[];
  } catch (error) {
    console.error('Failed to load favorite scripts:', error);
    return [];
  }
}

/**
 * Check if a script is favorited
 */
export function isScriptFavorited(scriptId: string): boolean {
  const favorites = getFavoriteScripts();
  return favorites.includes(scriptId);
}

/**
 * Toggle favorite status of a script
 */
export function toggleScriptFavorite(scriptId: string): boolean {
  try {
    const favorites = getFavoriteScripts();
    const isFavorited = favorites.includes(scriptId);
    
    let updatedFavorites: string[];
    if (isFavorited) {
      // Remove from favorites
      updatedFavorites = favorites.filter(id => id !== scriptId);
    } else {
      // Add to favorites
      updatedFavorites = [...favorites, scriptId];
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFavorites));
    return !isFavorited; // Return new state
  } catch (error) {
    console.error('Failed to toggle script favorite:', error);
    return false;
  }
}

/**
 * Add a script to favorites
 */
export function addScriptToFavorites(scriptId: string): void {
  try {
    const favorites = getFavoriteScripts();
    if (!favorites.includes(scriptId)) {
      const updatedFavorites = [...favorites, scriptId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFavorites));
    }
  } catch (error) {
    console.error('Failed to add script to favorites:', error);
  }
}

/**
 * Remove a script from favorites
 */
export function removeScriptFromFavorites(scriptId: string): void {
  try {
    const favorites = getFavoriteScripts();
    const updatedFavorites = favorites.filter(id => id !== scriptId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFavorites));
  } catch (error) {
    console.error('Failed to remove script from favorites:', error);
  }
}

/**
 * Clear all favorite scripts
 */
export function clearFavoriteScripts(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear favorite scripts:', error);
  }
}

/**
 * Get count of favorited scripts
 */
export function getFavoriteScriptsCount(): number {
  return getFavoriteScripts().length;
}
