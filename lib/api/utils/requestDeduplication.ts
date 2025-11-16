/**
 * Request deduplication utility
 * Prevents duplicate API calls when multiple components request the same data
 */

type RequestKey = string;
type PendingRequest<T> = {
  promise: Promise<T>;
  timestamp: number;
};

// Map to store pending requests
const pendingRequests = new Map<RequestKey, PendingRequest<any>>();

// Cleanup old requests (older than 5 minutes)
const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes
const MAX_AGE = 5 * 60 * 1000; // 5 minutes

// Cleanup function
function cleanupOldRequests() {
  const now = Date.now();
  for (const [key, request] of pendingRequests.entries()) {
    if (now - request.timestamp > MAX_AGE) {
      pendingRequests.delete(key);
    }
  }
}

// Run cleanup periodically
if (typeof window !== 'undefined') {
  setInterval(cleanupOldRequests, CLEANUP_INTERVAL);
}

/**
 * Deduplicate a request by key
 * If a request with the same key is already pending, return the existing promise
 * Otherwise, execute the request and cache it
 * 
 * @param key - Unique key for the request
 * @param requestFn - Function that returns a promise
 * @returns Promise that resolves with the request result
 */
export function deduplicateRequest<T>(
  key: RequestKey,
  requestFn: () => Promise<T>
): Promise<T> {
  // Cleanup old requests
  cleanupOldRequests();

  // Check if request is already pending
  const existing = pendingRequests.get(key);
  if (existing) {
    return existing.promise;
  }

  // Create new request
  const promise = requestFn()
    .then((result) => {
      // Remove from cache after completion
      pendingRequests.delete(key);
      return result;
    })
    .catch((error) => {
      // Remove from cache on error
      pendingRequests.delete(key);
      throw error;
    });

  // Cache the request
  pendingRequests.set(key, {
    promise,
    timestamp: Date.now(),
  });

  return promise;
}

/**
 * Generate a request key from URL and params
 */
export function generateRequestKey(
  url: string,
  params?: Record<string, any>
): string {
  const sortedParams = params
    ? Object.keys(params)
        .sort()
        .map((key) => `${key}=${JSON.stringify(params[key])}`)
        .join('&')
    : '';
  return `${url}${sortedParams ? `?${sortedParams}` : ''}`;
}

/**
 * Clear all pending requests (useful for testing or cleanup)
 */
export function clearPendingRequests() {
  pendingRequests.clear();
}

