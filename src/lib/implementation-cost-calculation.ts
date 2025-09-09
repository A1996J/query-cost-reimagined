import { EMACalculatorInputs } from '@/types/ema-calculator';

const WORKING_MINUTES_PER_YEAR = 124800; // 250 workdays × 8 hours × 60 minutes

export function calculateImplementationCost(inputs: EMACalculatorInputs): number {
  // Calculate total reps needed
  const annualQueries = inputs.monthlyQueryVolume * 12; // Now in thousands
  const repsNeeded100 = (annualQueries * 1000 * inputs.averageHandlingTime) / WORKING_MINUTES_PER_YEAR;
  const totalReps = repsNeeded100 * (1 + inputs.capacityBuffer);
  
  // Calculate implementation cost in $K: Total Reps × $1000 per rep / 1000 to get $K
  return totalReps * (inputs.implementationCostMultiplier || 1000) / 1000;
}

export function updateImplementationCostIfNeeded(inputs: EMACalculatorInputs, onUpdateInput: (field: keyof EMACalculatorInputs, value: number) => void) {
  // Only auto-update if user hasn't manually set implementation cost higher than calculated
  const calculatedCost = calculateImplementationCost(inputs);
  
  // If the current implementation cost is 0, or if it matches what would be calculated, update it
  if (inputs.implementationCost === 0 || Math.abs(inputs.implementationCost - calculatedCost) < 0.01) {
    onUpdateInput('implementationCost', calculatedCost);
  }
}