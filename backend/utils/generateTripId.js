/**
 * Generate a unique, human-readable trip ID
 * Format: TRIP-YYYYMMDD-XXXX (where XXXX is a random 4-digit number)
 * 
 * @returns {string} Generated Trip ID
 */
export const generateTripId = () => {
  const now = new Date();
  
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  
  const randomSuffix = Math.floor(1000 + Math.random() * 9000); // Generates a number between 1000 and 9999
  
  return `TRIP-${year}${month}${day}-${randomSuffix}`;
};
