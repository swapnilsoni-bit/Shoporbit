/**
 * Retry utility with exponential backoff
 * Industry-standard retry logic for API calls
 */

export interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  retryable?: (error: any) => boolean;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffMultiplier: 2,
  retryable: (error: any) => {
    // Don't retry canceled errors (they're intentional cancellations)
    if (error.code === 'ERR_CANCELED' || error.__CANCEL__ || error.message?.includes('cancelled')) {
      return false;
    }
    
    // Retry on network errors (no response) or 5xx server errors
    // Check for network error flag or missing response
    if (error.isNetworkError || !error.response) {
      return true; // Network error - always retry
    }
    const status = error.response?.status;
    // Retry on server errors (5xx) or timeout errors (408)
    return status >= 500 && status < 600 || status === 408;
  },
};

/**
 * Retry a function with exponential backoff
 * @param fn - Function to retry
 * @param options - Retry configuration
 * @returns Promise that resolves with the function result
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const config = { ...DEFAULT_OPTIONS, ...options };
  let lastError: any;

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      // Don't retry if it's the last attempt or error is not retryable
      if (attempt === config.maxRetries || !config.retryable(error)) {
        // Don't wrap canceled errors - they're intentional
        if (error.code === 'ERR_CANCELED' || error.__CANCEL__ || error.message?.includes('cancelled')) {
          throw error; // Throw canceled error as-is
        }
        
        // If it's a network error after all retries, provide a helpful message
        if (error.isNetworkError || !error.response) {
          const networkError = new Error(
            `Network error after ${attempt + 1} attempts. Please check your internet connection and try again.`
          );
          (networkError as any).originalError = error;
          throw networkError;
        }
        throw error;
      }

      // Log retry attempt in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`Retrying request (attempt ${attempt + 1}/${config.maxRetries})...`);
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(
        config.initialDelay * Math.pow(config.backoffMultiplier, attempt),
        config.maxDelay
      );

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

