export const isExpired = (expiryDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  return expiry < today;
};

export const isExpiringWithin = (expiryDate, daysAhead = 7) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const futureDate = new Date(today);
  futureDate.setDate(futureDate.getDate() + daysAhead);

  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);

  return expiry >= today && expiry <= futureDate;
};

export const daysUntilExpiry = (expiryDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);

  const timeDiff = expiry - today;
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};
