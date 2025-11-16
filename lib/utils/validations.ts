// Validation helper functions

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  // At least 6 characters
  return password.length >= 6;
};

export const validateUsername = (username: string): boolean => {
  // At least 3 characters, alphanumeric and underscores
  const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
  return usernameRegex.test(username);
};

export const validatePrice = (price: number): boolean => {
  return price >= 0 && price <= 10000;
};

export const validateRating = (rating: number): boolean => {
  return rating >= 0 && rating <= 5;
};

