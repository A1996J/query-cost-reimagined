// Calculate implementation cost based on total reps needed
export function calculateImplementationCost(
  monthlyQueryVolume: number,
  averageHandlingTime: number,
  capacityBuffer: number,
  averageAnnualSalary: number,
  benefitsMultiplier: number,
  fxRate: number
): number {
  const WORKING_MINUTES_PER_YEAR = 124800; // 250 workdays × 8 hours × 60 minutes
  
  // Calculate reps needed using the same logic as ema-calculations.ts
  const annualQueries = monthlyQueryVolume * 12;
  const repsNeeded100 = (annualQueries * 1000000 * averageHandlingTime) / WORKING_MINUTES_PER_YEAR;
  const totalReps = repsNeeded100 * (1 + capacityBuffer);
  
  // Implementation cost = Total Reps × 1 (in $K)
  return Math.round(totalReps * 1);
}