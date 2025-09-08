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
}

export interface CalculationResults {
  yearlyBreakdown: YearlyCalculation[];
  totalSavings: number;
  implementationCost: number;
}

export interface CountryData {
  code: string;
  name: string;
  currency: string;
}

export interface CurrencyRate {
  [key: string]: number;
}