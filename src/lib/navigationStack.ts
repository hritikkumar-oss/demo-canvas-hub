/**
 * Navigation stack utilities for consistent back button behavior
 * Stores navigation history in sessionStorage to persist across page reloads
 */

const NAVIGATION_STACK_KEY = 'navigation_stack';
const MAX_STACK_SIZE = 10;

export interface NavigationEntry {
  path: string;
  timestamp: number;
}

/**
 * Get the current navigation stack from sessionStorage
 */
export const getNavigationStack = (): NavigationEntry[] => {
  try {
    const stack = sessionStorage.getItem(NAVIGATION_STACK_KEY);
    return stack ? JSON.parse(stack) : [];
  } catch {
    return [];
  }
};

/**
 * Push a new route to the navigation stack
 * Skips duplicates and caps the stack size
 */
export const pushToNavigationStack = (path: string): void => {
  try {
    const stack = getNavigationStack();
    
    // Skip if the last entry is the same path (avoid duplicates)
    if (stack.length > 0 && stack[stack.length - 1].path === path) {
      return;
    }
    
    // Add new entry
    const newEntry: NavigationEntry = {
      path,
      timestamp: Date.now()
    };
    
    stack.push(newEntry);
    
    // Cap the stack size
    if (stack.length > MAX_STACK_SIZE) {
      stack.shift(); // Remove oldest entry
    }
    
    sessionStorage.setItem(NAVIGATION_STACK_KEY, JSON.stringify(stack));
  } catch (error) {
    console.warn('Failed to push to navigation stack:', error);
  }
};

/**
 * Pop the most recent route from the navigation stack
 * Returns the previous route or null if stack is empty
 */
export const popFromNavigationStack = (): string | null => {
  try {
    const stack = getNavigationStack();
    
    if (stack.length === 0) {
      return null;
    }
    
    // Remove the current page (last entry)
    stack.pop();
    
    // Get the previous page
    const previousEntry = stack.length > 0 ? stack[stack.length - 1] : null;
    
    // Update storage
    sessionStorage.setItem(NAVIGATION_STACK_KEY, JSON.stringify(stack));
    
    return previousEntry?.path || null;
  } catch (error) {
    console.warn('Failed to pop from navigation stack:', error);
    return null;
  }
};

/**
 * Clear the navigation stack
 */
export const clearNavigationStack = (): void => {
  try {
    sessionStorage.removeItem(NAVIGATION_STACK_KEY);
  } catch (error) {
    console.warn('Failed to clear navigation stack:', error);
  }
};

/**
 * Initialize navigation tracking for the app
 * Call this once in your root component
 */
export const initializeNavigationTracking = (): void => {
  // Track initial page load
  const currentPath = window.location.pathname;
  pushToNavigationStack(currentPath);
  
  // Track navigation changes
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;
  
  history.pushState = function(...args) {
    originalPushState.apply(history, args);
    const newPath = window.location.pathname;
    pushToNavigationStack(newPath);
  };
  
  history.replaceState = function(...args) {
    originalReplaceState.apply(history, args);
    // Don't track replace state as it's not a new navigation
  };
  
  // Track popstate (back/forward button)
  window.addEventListener('popstate', () => {
    const currentPath = window.location.pathname;
    pushToNavigationStack(currentPath);
  });
};