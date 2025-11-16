/**
 * Request cancellation utility
 * Allows canceling in-flight requests to prevent memory leaks and unnecessary processing
 */

import axios, { CancelTokenSource, CancelToken } from 'axios';

// Map to store cancel tokens by request key
const cancelTokens = new Map<string, CancelTokenSource>();

/**
 * Get or create a cancel token for a request
 * If a request with the same key is already pending, cancel it first
 * 
 * @param key - Unique key for the request
 * @returns CancelToken for the request
 */
export function getCancelToken(key: string): CancelToken {
  // Cancel existing request with the same key
  const existing = cancelTokens.get(key);
  if (existing) {
    existing.cancel('Request cancelled: new request with same key');
    cancelTokens.delete(key);
  }

  // Create new cancel token
  const source = axios.CancelToken.source();
  cancelTokens.set(key, source);

  return source.token;
}

/**
 * Cancel a specific request by key
 * 
 * @param key - Request key to cancel
 * @param reason - Optional cancellation reason
 */
export function cancelRequest(key: string, reason?: string): void {
  const source = cancelTokens.get(key);
  if (source) {
    source.cancel(reason || 'Request cancelled by user');
    cancelTokens.delete(key);
  }
}

/**
 * Cancel all pending requests
 * Useful when navigating away or cleaning up
 */
export function cancelAllRequests(reason?: string): void {
  for (const [key, source] of cancelTokens.entries()) {
    source.cancel(reason || 'All requests cancelled');
  }
  cancelTokens.clear();
}

/**
 * Clean up completed requests from the map
 * This is called automatically when requests complete
 * 
 * @param key - Request key to clean up
 */
export function cleanupRequest(key: string): void {
  cancelTokens.delete(key);
}

