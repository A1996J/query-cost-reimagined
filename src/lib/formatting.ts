export const formatCurrencyAuto = (amount: number) => {
  if (amount < 1000000) {
    // Display in $K
    const valueK = amount / 1000;
    return `$${valueK.toFixed(1)}K`;
  } else {
    // Display in $M  
    const valueM = amount / 1000000;
    return `$${valueM.toFixed(1)}M`;
  }
};

export const formatCurrency = (amount: number, inMillions = false, inThousands = false) => {
  let value = amount;
  if (inMillions) value = amount / 1000000;
  if (inThousands) value = amount / 1000;
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: inMillions || inThousands ? 1 : 0,
    maximumFractionDigits: inMillions || inThousands ? 1 : 0,
  }).format(value);
};

export const formatPercentage = (value: number) => {
  return `${(value * 100).toFixed(1)}%`;
};

export const formatNumber = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};