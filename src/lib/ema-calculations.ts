import { EMACalculatorInputs, CalculationResults, YearlyCalculation, ScenarioInputs, ScenarioResults } from '@/types/ema-calculator';

const WORKING_MINUTES_PER_YEAR = 124800; // 250 workdays × 8 hours × 60 minutes

export function calculateEMASavings(inputs: EMACalculatorInputs): CalculationResults {
  // Convert local salary to USD
  const salaryUSD = inputs.averageAnnualSalary / inputs.fxRate;
  
  // Calculate all-in annual cost per rep
  const allInCostPerRep = salaryUSD * inputs.benefitsMultiplier;
  
  // Calculate annual queries
  const annualQueries = inputs.monthlyQueryVolume * 12;
  
  // Calculate reps needed
  const repsNeeded100 = (annualQueries * 1000000 * inputs.averageHandlingTime) / WORKING_MINUTES_PER_YEAR;
  const totalReps = repsNeeded100 * (1 + inputs.capacityBuffer);
  
  // Calculate cost per query
  const costPerQuery = (allInCostPerRep * totalReps) / (annualQueries * 1000000);
  const pricePerHumanQuery = costPerQuery * inputs.partnerOverheadMultiplier;
  
  // Customer price per EMA query
  const emaCustomerPrice = inputs.emaPricePerQuery * (1 + inputs.partnerProfitMargin);
  
  const yearlyBreakdown: YearlyCalculation[] = [];
  
  for (let year = 1; year <= 3; year++) {
    // Query growth
    const queries = annualQueries * Math.pow(1 + inputs.companyGrowthRate, year - 1);
    
    // EMA containment ramp
    const emaContainmentRate = inputs.finalYearContainmentRate * (year / 3);
    
    // Productivity gain ramp
    let productivityGain = inputs.year1ProductivityGain;
    if (year >= 2) {
      productivityGain = inputs.year1ProductivityGain * (4/3);
    }
    
    // Pre-EMA cost
    const preEMACost = queries * 1000000 * pricePerHumanQuery;
    
    // Post-EMA cost calculation
    const emaQueries = queries * 1000000 * emaContainmentRate;
    const humanQueries = queries * 1000000 * (1 - emaContainmentRate);
    const postEMAHumanCostPerQuery = pricePerHumanQuery * (1 - productivityGain);
    
    const emaCost = emaQueries * emaCustomerPrice;
    const humanCost = humanQueries * postEMAHumanCostPerQuery;
    const postEMACost = emaCost + humanCost;
    
    // Calculate savings
    const savings = preEMACost - postEMACost;
    let netSavings = savings;
    
    // Apply implementation cost in Year 1
    if (year === 1) {
      netSavings = savings - (inputs.implementationCost * 1000000);
    }
    
    yearlyBreakdown.push({
      year,
      queries: queries * 1000000,
      emaContainmentRate,
      productivityGain,
      preEMACost,
      postEMACost,
      emaCost,
      humanCostPerQuery: postEMAHumanCostPerQuery,
      savings,
      netSavings
    });
  }
  
  // Calculate total savings
  const totalSavings = yearlyBreakdown.reduce((sum, year) => sum + year.netSavings, 0);
  
  return {
    yearlyBreakdown,
    totalSavings,
    implementationCost: inputs.implementationCost * 1000000
  };
}

export function populateBullFromBase(baseInputs: EMACalculatorInputs): EMACalculatorInputs {
  // Copy unchanged fields
  const bullInputs: EMACalculatorInputs = {
    ...baseInputs,
    // Transform specific fields for Bull scenario
    finalYearContainmentRate: Math.min(0.90, baseInputs.finalYearContainmentRate * 1.25),
    year1ProductivityGain: Math.min(1.0, baseInputs.year1ProductivityGain + 0.05) // +5 percentage points
  };
  
  return bullInputs;
}

export function calculateScenarioResults(scenarios: ScenarioInputs): ScenarioResults {
  return {
    base: calculateEMASavings(scenarios.base),
    bull: calculateEMASavings(scenarios.bull)
  };
}