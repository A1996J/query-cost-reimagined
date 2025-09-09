export type Scenario = 'base' | 'bull';

export interface EMACalculatorInputs {
  // Currency & Country
  country: string;
  currency: string;
  fxRate: number;

  // Human Agent Cost Assumptions  
  averageAnnualSalary: number;
  benefitsMultiplier: number;
  monthlyQueryVolume: number; // Now in thousands
  averageHandlingTime: number;
  capacityBuffer: number;
  partnerOverheadMultiplier: number;

  // EMA Cost & Performance
  emaPricePerQuery: number;
  partnerProfitMargin: number;
  implementationCost: number; // Now in thousands
  implementationCostMultiplier: number; // New field for $K per rep
  companyGrowthRate: number;
  finalYearContainmentRate: number;
  year1ProductivityGain: number;

  // Additional Savings Inputs
  duplicateQueriesPercent: number;
  annualComplianceCostReduction: number; // Now in thousands
  customerExperienceAsPercentOfRevenue: number;
  upsellPercentOfRevenue: number;
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
  upsellBenefit: number;
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