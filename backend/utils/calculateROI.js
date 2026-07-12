/**
 * Calculate Return on Investment (ROI) as a percentage
 * Formula: ((totalRevenue - totalExpenses) / totalExpenses) * 100
 * 
 * @param {Object} params
 * @param {number} params.totalRevenue - Total revenue generated
 * @param {number} params.totalExpenses - Total expenses incurred
 * @returns {number} ROI as a percentage
 */
export const calculateROI = ({ totalRevenue, totalExpenses }) => {
  const revenue = Number(totalRevenue) || 0;
  const expenses = Number(totalExpenses) || 0;

  if (expenses <= 0) {
    if (revenue > 0) {
      console.warn('Warning: Division by zero or negative expenses in calculateROI. Returning 0.');
    }
    return 0;
  }

  const roi = ((revenue - expenses) / expenses) * 100;
  return Number(roi.toFixed(2));
};
