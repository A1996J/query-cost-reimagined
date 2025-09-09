import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScenarioResults, ScenarioInputs, EMACalculatorInputs } from '@/types/ema-calculator';
import { Activity } from 'lucide-react';

interface SensitivityHeatmapProps {
  scenarioResults: ScenarioResults;
  scenarios: ScenarioInputs;
}

export const SensitivityHeatmap: React.FC<SensitivityHeatmapProps> = ({ scenarioResults, scenarios }) => {
  const { base: baseResults } = scenarioResults;
  const { base: baseInputs, bull: bullInputs } = scenarios;

  // Get the actual input values from the scenarios
  const baseContainmentRate = baseInputs.finalYearContainmentRate;
  const bullContainmentRate = bullInputs.finalYearContainmentRate;
  
  const baseProductivityGain = baseInputs.year1ProductivityGain;
  const bullProductivityGain = bullInputs.year1ProductivityGain;

  // Generate 5 evenly spaced values for each axis
  const generateAxisValues = (min: number, max: number): number[] => {
    const values = [];
    for (let i = 0; i < 5; i++) {
      values.push(min + (max - min) * (i / 4));
    }
    return values;
  };

  const containmentRates = generateAxisValues(baseContainmentRate, bullContainmentRate);
  const productivityGains = generateAxisValues(baseProductivityGain, bullProductivityGain);

  // Calculate direct savings in millions using proper Ema calculation logic
  const calculateDirectSavingsMillions = (finalYearContainmentRate: number, year1ProductivityGain: number): number => {
    // Create modified inputs based on the sensitivity parameters
    const modifiedInputs: EMACalculatorInputs = {
      ...baseInputs,
      finalYearContainmentRate,
      year1ProductivityGain
    };
    
    // Constants from ema-calculations.ts
    const WORKING_MINUTES_PER_YEAR = 124800;
    
    // Calculate base values (using same logic as ema-calculations.ts)
    const salaryUSD = modifiedInputs.averageAnnualSalary / modifiedInputs.fxRate;
    const allInCostPerRep = salaryUSD * modifiedInputs.benefitsMultiplier;
    const annualQueries = modifiedInputs.monthlyQueryVolume * 12;
    const repsNeeded100 = (annualQueries * 1000000 * modifiedInputs.averageHandlingTime) / WORKING_MINUTES_PER_YEAR;
    const totalReps = repsNeeded100 * (1 + modifiedInputs.capacityBuffer);
    const costPerQuery = (allInCostPerRep * totalReps) / (annualQueries * 1000000);
    const pricePerHumanQuery = costPerQuery * modifiedInputs.partnerOverheadMultiplier;
    const emaCustomerPrice = modifiedInputs.emaPricePerQuery * (1 + modifiedInputs.partnerProfitMargin);
    
    let totalDirectSavings = 0;
    let totalPreEMACost = 0;
    
    // Calculate for 3 years using exact same logic as ema-calculations.ts
    for (let year = 1; year <= 3; year++) {
      // Query growth
      const queries = annualQueries * Math.pow(1 + modifiedInputs.companyGrowthRate, year - 1);
      
      // EMA containment ramp (exact same formula)
      const emaContainmentRate = modifiedInputs.finalYearContainmentRate * (year / 3);
      
      // Productivity gain ramp (exact same formula)
      let productivityGain = modifiedInputs.year1ProductivityGain;
      if (year >= 2) {
        productivityGain = modifiedInputs.year1ProductivityGain * (4/3);
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
      
      // Calculate direct savings (before implementation cost)
      let yearSavings = preEMACost - postEMACost;
      
      // Apply implementation cost in Year 1 (CRITICAL: This was missing!)
      if (year === 1) {
        yearSavings = yearSavings - (modifiedInputs.implementationCost * 1000000);
      }
      
      totalDirectSavings += yearSavings;
      totalPreEMACost += preEMACost;
    }
    
    const result = totalDirectSavings / 1000000; // Convert to millions
    return result;
  };

  // Generate heatmap data (fix Y-axis ordering to be ascending)
  const heatmapData: number[][] = [];
  for (let i = 0; i < 5; i++) {
    const row: number[] = [];
    for (let j = 0; j < 5; j++) {
      row.push(calculateDirectSavingsMillions(containmentRates[j], productivityGains[i]));
    }
    heatmapData.push(row);
  }

  // Find min and max values for color scaling
  const allValues = heatmapData.flat();
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);

  // Color function - softer, more muted colors for better text readability
  const getColor = (value: number): string => {
    const normalized = (value - minValue) / (maxValue - minValue);
    if (normalized < 0.33) {
      // Soft Red to Orange
      const r = 200;
      const g = Math.round(120 + 80 * (normalized / 0.33));
      const b = 100;
      return `rgb(${r}, ${g}, ${b})`;
    } else if (normalized < 0.67) {
      // Orange to Light Yellow-Green  
      const r = Math.round(200 - 80 * ((normalized - 0.33) / 0.34));
      const g = 200;
      const b = 100;
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      // Light Yellow-Green to Medium Green
      const r = 120;
      const g = Math.round(200 - 50 * ((normalized - 0.67) / 0.33));
      const b = 100;
      return `rgb(${r}, ${g}, ${b})`;
    }
  };

  const formatPercentage = (value: number) => `${(value * 100).toFixed(0)}%`;

  return (
    <Card className="shadow-soft">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-finance-primary">
          <Activity className="h-5 w-5" />
          Range of Possible Direct Savings
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          3-Year Direct Savings ($M) basis Ema-handled queries % and Human Efficiency from Ema 
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            {/* Table */}
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border border-border p-2 bg-muted text-sm font-medium">
                    Y1 Human Productivity Gains (%) ↓ / Y3 Ema-handled Queries (%)
                  {containmentRates.map((rate, idx) => (
                    <th key={idx} className="border border-border p-2 bg-muted text-sm font-medium min-w-20">
                      {formatPercentage(rate)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {heatmapData.map((row, rowIdx) => (
                  <tr key={rowIdx}>
                    <td className="border border-border p-2 bg-muted text-sm font-medium text-right">
                      {formatPercentage(productivityGains[rowIdx])}
                    </td>
                    {row.map((value, colIdx) => (
                      <td 
                        key={colIdx} 
                        className="border border-border p-2 text-center text-sm font-medium text-white min-w-20"
                        style={{ backgroundColor: getColor(value) }}
                        title={`3-Year Direct Savings: $${value.toFixed(1)}M`}
                      >
                        ${value.toFixed(1)}M
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Legend */}
        <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>Low Savings</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span>Medium Savings</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>High Savings</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};