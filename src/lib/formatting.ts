/**
 * Smart formatting utility for displaying monetary values
 * - Values < $1,000,000 are displayed in $K format
 * - Values >= $1,000,000 are displayed in $M format
 */

export function formatCurrency(value: number, options: { 
  alwaysShowSign?: boolean;
  decimalPlaces?: number;
} = {}): string {
  const { alwaysShowSign = false, decimalPlaces } = options;
  
  if (Math.abs(value) >= 1000000) {
    // Display in millions
    const millions = value / 1000000;
    const decimals = decimalPlaces !== undefined ? decimalPlaces : 1;
    const formatted = millions.toFixed(decimals);
    const sign = alwaysShowSign && value > 0 ? '+' : '';
    return `${sign}$${formatted}M`;
  } else {
    // Display in thousands
    const thousands = value / 1000;
    const decimals = decimalPlaces !== undefined ? decimalPlaces : 1;
    const formatted = thousands.toFixed(decimals);
    const sign = alwaysShowSign && value > 0 ? '+' : '';
    return `${sign}$${formatted}K`;
  }
}

export function formatPercentage(value: number, decimalPlaces: number = 1): string {
  return `${(value * 100).toFixed(decimalPlaces)}%`;
}

export function formatNumber(value: number, decimalPlaces: number = 0): string {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces
  });
}