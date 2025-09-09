export type Scenario = 'base' | 'bull';

export interface EMACalculatorInputs {
  // Currency & Country
  country: string;
  currency: string;
  fxRate: number;

  // Human Agent Cost Assumptions  
  averageAnnualSalary: number;
  benefitsMultiplier: number;
  monthlyQueryVolume: number;
  averageHandlingTime: number;
  capacityBuffer: number;
  partnerOverheadMultiplier: number;

  // EMA Cost & Performance
  emaPricePerQuery: number;
  partnerProfitMargin: number;
  implementationCost: number;
  companyGrowthRate: number;
  finalYearContainmentRate: number;
  year1ProductivityGain: number;

  // Additional Savings Inputs
  duplicateQueriesPercent: number;
  annualComplianceCostReduction: number;
}

export interface ScenarioInputs {
  base: EMACalculatorInputs;
  bull: EMACalculatorInputs;
}

export interface YearlyCalculation {
  year: number;
  queries: number;
  emaContainmentRate: number;
  productivityGain: number;
  preEMACost: number;
  postEMACost: number;
  emaCost: number;
  humanCostPerQuery: number;
  savings: number;
  netSavings: number;
  // Additional savings breakdown
  firstCallResolutionBenefit: number;
  complianceSavings: number;
  totalAdditionalSavings: number;
  allInSavings: number;
  // Baseline percentages
  directSavingsPercentOfBaseline: number;
  additionalSavingsPercentOfBaseline: number;
  allInSavingsPercentOfBaseline: number;
}

export interface CalculationResults {
  yearlyBreakdown: YearlyCalculation[];
  totalSavings: number;
  totalAdditionalSavings: number;
  totalAllInSavings: number;
  implementationCost: number;
}

export interface ScenarioResults {
  base: CalculationResults;
  bull: CalculationResults;
}

export interface CountryData {
  code: string;
  name: string;
  currency: string;
}

export interface CurrencyRate {
  [key: string]: number;
}