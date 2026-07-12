export const validateCreateDriver = (data) => {
  const errors = [];
  if (!data.fullName) errors.push('Full name is required');
  if (!data.licenseNumber) errors.push('License number is required');
  if (!data.licenseCategory) errors.push('License category is required');
  if (!data.licenseExpiryDate) errors.push('License expiry date is required');
  if (!data.contactNumber) errors.push('Contact number is required');
  
  if (data.email && !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(data.email)) {
    errors.push('Invalid email address format');
  }

  if (data.safetyScore !== undefined && (data.safetyScore < 0 || data.safetyScore > 100)) {
    errors.push('Safety score must be between 0 and 100');
  }

  const validStatuses = ['Available', 'On Trip', 'Off Duty', 'Suspended'];
  if (data.status && !validStatuses.includes(data.status)) {
    errors.push('Invalid driver status');
  }

  return errors;
};
