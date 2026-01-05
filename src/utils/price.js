// Price calculation utilities

/**
 * Calculate discounted price
 * @param {number} price - Original price
 * @param {number} discount - Discount percentage
 * @returns {number} - Discounted price
 */
export const calculateDiscountedPrice = (price, discount) => {
  if (!discount || discount <= 0) {
    return parseFloat(price) || 0;
  }
  const originalPrice = parseFloat(price) || 0;
  return originalPrice - (originalPrice * discount / 100);
};

/**
 * Format price to currency string
 * @param {number} price - Price to format
 * @param {string} currency - Currency symbol (default: '$')
 * @returns {string} - Formatted price string
 */
export const formatPrice = (price, currency = '$') => {
  const numPrice = parseFloat(price) || 0;
  return `${currency}${numPrice.toFixed(2)}`;
};
