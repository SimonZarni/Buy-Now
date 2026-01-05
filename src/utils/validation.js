// Validation utility functions

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Is valid email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (basic validation)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - Is valid phone
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

/**
 * Check if user is logged in
 * @returns {boolean} - Is user logged in
 */
export const isUserLoggedIn = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    return !!user?.id;
  } catch {
    return false;
  }
};
