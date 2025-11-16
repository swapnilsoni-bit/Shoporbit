/**
 * Performance Monitoring
 * Web Vitals tracking and performance metrics
 */

import { onCLS, onFCP, onLCP, onTTFB, onINP, Metric } from 'web-vitals';

type ReportHandler = (metric: Metric) => void;

/**
 * Send metrics to analytics or monitoring service
 */
function sendToAnalytics(metric: Metric): void {
  // Send to Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_category: 'Web Vitals',
      event_label: metric.id,
      non_interaction: true,
    });
  }

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${metric.name}:`, metric.value, metric.id);
  }
}

/**
 * Initialize Web Vitals tracking
 */
export function initWebVitals(reportHandler?: ReportHandler): void {
  if (typeof window === 'undefined') return;

  const handler = reportHandler || sendToAnalytics;

  try {
    onCLS(handler);
    onFCP(handler);
    onLCP(handler);
    onTTFB(handler);
    onINP(handler);
  } catch (error) {
    console.error('Error initializing Web Vitals:', error);
  }
}

/**
 * Performance budget checker
 */
export const performanceBudgets = {
  LCP: 2500, // Largest Contentful Paint (ms)
  CLS: 0.1, // Cumulative Layout Shift
  FCP: 1800, // First Contentful Paint (ms)
  TTFB: 800, // Time to First Byte (ms)
  INP: 200, // Interaction to Next Paint (ms) - replaces FID
};

/**
 * Check if metric meets performance budget
 */
export function checkPerformanceBudget(metric: Metric): boolean {
  const budget = performanceBudgets[metric.name as keyof typeof performanceBudgets];
  if (!budget) return true;

  const value = metric.name === 'CLS' ? metric.value : metric.value;
  return value <= budget;
}

