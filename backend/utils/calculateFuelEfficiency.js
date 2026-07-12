/**
 * Calculate fuel efficiency in km/l (kilometers per liter)
 * Formula: distanceTravelled / fuelConsumed
 * 
 * @param {Object} params
 * @param {number} params.distanceTravelled - Distance travelled in km
 * @param {number} params.fuelConsumed - Fuel consumed in liters (or fuelQuantity)
 * @returns {number} Fuel efficiency in km/l
 */
export const calculateFuelEfficiency = ({ distanceTravelled, fuelConsumed }) => {
  const distance = Number(distanceTravelled) || 0;
  const fuel = Number(fuelConsumed) || 0;

  if (distance <= 0 || fuel <= 0) {
    return 0;
  }

  const efficiency = distance / fuel;
  return Number(efficiency.toFixed(2));
};
