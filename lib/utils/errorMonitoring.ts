/**
 * Error Monitoring Setup
 * Sentry integration for error tracking
 */

// This is a placeholder for Sentry integration
// To use Sentry, install @sentry/nextjs and configure it

export function initErrorMonitoring(): void {
  if (typeof window === 'undefined') return;

  // Only initialize in production
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  // Sentry initialization would go here
  // Example:
  // if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  //   Sentry.init({
  //     dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  //     tracesSampleRate: 1.0,
  //   });
  // }

  // For now, log errors to console in development
  if (process.env.NODE_ENV === 'development') {
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error);
    });

    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
    });
  }
}

/**
 * Capture exception manually
 */
export function captureException(error: Error, context?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === 'development') {
    console.error('Captured exception:', error, context);
  }
  // Sentry.captureException(error, { contexts: { custom: context } });
}

/**
 * Capture message manually
 */
export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info'): void {
  if (process.env.NODE_ENV === 'development') {
    console[level === 'error' ? 'error' : level === 'warning' ? 'warn' : 'log']('Captured message:', message);
  }
  // Sentry.captureMessage(message, level);
}

