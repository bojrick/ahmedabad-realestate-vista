
/**
 * Formats currency values in Crores and Lakhs (Indian format)
 * @param amount The amount to format
 * @param includeSymbol Whether to include the ₹ symbol
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, includeSymbol: boolean = true): string => {
  if (!amount && amount !== 0) return 'N/A';
  
  const symbol = includeSymbol ? '₹' : '';
  
  if (amount >= 10000000) {
    return `${symbol}${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `${symbol}${(amount / 100000).toFixed(2)} Lac`;
  } else {
    return `${symbol}${amount.toLocaleString()}`;
  }
};

/**
 * Formats area values with appropriate units
 * @param area Area value in square meters
 * @returns Formatted area string
 */
export const formatArea = (area: number): string => {
  if (!area && area !== 0) return 'N/A';
  
  if (area >= 10000) {
    return `${(area / 10000).toFixed(2)} Hectares`;
  } else {
    return `${area.toLocaleString()} sq.m`;
  }
};

/**
 * Formats percentage values
 * @param value Percentage value
 * @param decimals Number of decimal places
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  if (value === undefined || value === null) return 'N/A';
  return `${value.toFixed(decimals)}%`;
};

/**
 * Formats date values
 * @param date Date to format
 * @param format Format style ('short', 'medium', 'full')
 * @returns Formatted date string
 */
export const formatDate = (date: Date | string | null, format: 'short' | 'medium' | 'full' = 'medium'): string => {
  if (!date) return 'Not specified';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  try {
    switch (format) {
      case 'short':
        return dateObj.toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short'
        });
      case 'full':
        return dateObj.toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          weekday: 'long'
        });
      case 'medium':
      default:
        return dateObj.toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });
    }
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid date';
  }
};

/**
 * Truncates text to specified length and adds ellipsis if needed
 * @param text Text to truncate
 * @param maxLength Maximum length before truncation
 * @returns Truncated text
 */
export const truncateText = (text: string, maxLength: number = 100): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength) + '...';
};
