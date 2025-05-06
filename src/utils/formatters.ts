
/**
 * Format currency values for display
 * @param amount Number to format as currency
 * @param includeSymbol Whether to include the ₹ symbol
 * @returns Formatted string
 */
export const formatCurrency = (amount: number, includeSymbol: boolean = true): string => {
  if (amount >= 10000000) {
    return `${includeSymbol ? '₹' : ''}${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `${includeSymbol ? '₹' : ''}${(amount / 100000).toFixed(2)} Lac`;
  } else {
    return `${includeSymbol ? '₹' : ''}${amount.toLocaleString()}`;
  }
};

/**
 * Format area values for display
 * @param area Area in square meters
 * @returns Formatted string
 */
export const formatArea = (area: number): string => {
  if (area >= 10000) {
    return `${(area / 10000).toFixed(2)} Hectares`;
  } else {
    return `${area.toLocaleString()} sq.m`;
  }
};

/**
 * Format percentage values for display
 * @param value Percentage value
 * @param decimalPlaces Number of decimal places
 * @returns Formatted string
 */
export const formatPercentage = (value: number, decimalPlaces: number = 1): string => {
  return `${value.toFixed(decimalPlaces)}%`;
};

/**
 * Format date values for display
 * @param date Date object or string
 * @returns Formatted date string
 */
export const formatDate = (date: Date | string | null): string => {
  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};
