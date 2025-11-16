/**
 * Form Validation Utilities
 * Provides consistent validation across the application
 */

/**
 * Prevent native HTML5 validation and use custom validation instead
 */
export function preventNativeValidation(e: React.FormEvent): void {
  e.preventDefault();
  e.stopPropagation();
}

/**
 * Validate required field
 */
export function validateRequired(value: string, fieldName: string): string | null {
  if (!value || !value.trim()) {
    return `Please enter ${fieldName}`;
  }
  return null;
}

/**
 * Validate minimum length
 */
export function validateMinLength(
  value: string,
  minLength: number,
  fieldName: string
): string | null {
  if (value.trim().length < minLength) {
    return `${fieldName} must be at least ${minLength} characters long`;
  }
  return null;
}

/**
 * Validate email format
 */
export function validateEmail(email: string): string | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return null;
}

/**
 * Focus on first error field
 */
export function focusFirstError(errors: Record<string, string | undefined>): void {
  setTimeout(() => {
    const firstErrorKey = Object.keys(errors).find((key) => errors[key]);
    if (firstErrorKey) {
      // Try to find the input/textarea associated with the error
      const field = document.querySelector<HTMLElement>(
        `[data-field="${firstErrorKey}"], input[name="${firstErrorKey}"], textarea[name="${firstErrorKey}"]`
      );
      if (field) {
        field.focus();
        field.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, 0);
}

