import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScenarioResults } from '@/types/ema-calculator';
import { Activity } from 'lucide-react';

interface SensitivityHeatmapProps {
  scenarioResults: ScenarioResults;
}

export const SensitivityHeatmap: React.FC<SensitivityHeatmapProps> = ({ scenarioResults }) => {
  const { base, bull } = scenarioResults;

  // Get the base inputs from the calculation results
  // We need to reverse-engineer these from the yearly breakdown
  const baseContainmentRate = base.yearlyBreakdown[2]?.emaContainmentRate || 0.8;
  const bullContainmentRate = bull.yearlyBreakdown[2]?.emaContainmentRate || 0.9;
  
  const baseProductivityGain = base.yearlyBreakdown[0]?.productivityGain || 0.1;
  const bullProductivityGain = bull.yearlyBreakdown[0]?.productivityGain || 0.2;

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

  // Calculate direct savings percentage for each combination
  const calculateDirectSavingsPercent = (containmentRate: number, productivityGain: number): number => {
    // Simplified calculation based on the logic pattern from the actual calculations
    // This is an approximation - ideally we'd have access to the full input parameters
    const baselineQuery = base.yearlyBreakdown[0]?.queries || 100000;
    const baselinePreEMACost = base.yearlyBreakdown.reduce((sum, year) => sum + year.preEMACost, 0);
    const humanCostPerQuery = base.yearlyBreakdown[0]?.humanCostPerQuery || 5;
    
    let totalDirectSavings = 0;
    
    // Calculate for 3 years
    for (let year = 1; year <= 3; year++) {
      const yearlyQueries = baselineQuery * Math.pow(1.1, year - 1); // Assuming 10% growth
      const yearContainmentRate = containmentRate * (0.5 + 0.3 * (year - 1)); // Ramp up over years
      const yearProductivityGain = productivityGain * (0.7 + 0.15 * (year - 1)); // Ramp up
      
      const humanQueriesHandled = yearlyQueries * (1 - yearContainmentRate);
      const adjustedHumanCost = humanCostPerQuery * (1 - yearProductivityGain);
      const emaCost = yearlyQueries * yearContainmentRate * 0.5; // Assuming $0.5 per EMA query
      
      const preEMACost = yearlyQueries * humanCostPerQuery;
      const postEMACost = humanQueriesHandled * adjustedHumanCost + emaCost;
      
      totalDirectSavings += (preEMACost - postEMACost);
    }
    
    return (totalDirectSavings / baselinePreEMACost) * 100;
  };

  // Generate heatmap data
  const heatmapData: number[][] = [];
  for (let i = 0; i < 5; i++) {
    const row: number[] = [];
    for (let j = 0; j < 5; j++) {
      row.push(calculateDirectSavingsPercent(containmentRates[j], productivityGains[4 - i]));
    }
    heatmapData.push(row);
  }

  // Find min and max values for color scaling
  const allValues = heatmapData.flat();
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);

  // Color function
  const getColor = (value: number): string => {
    const normalized = (value - minValue) / (maxValue - minValue);
    if (normalized < 0.33) {
      // Red to Yellow
      const r = 255;
      const g = Math.round(255 * (normalized / 0.33));
      const b = 0;
      return `rgb(${r}, ${g}, ${b})`;
    } else if (normalized < 0.67) {
      // Yellow to Light Green  
      const r = Math.round(255 * (1 - (normalized - 0.33) / 0.34));
      const g = 255;
      const b = 0;
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      // Light Green to Dark Green
      const r = 0;
      const g = Math.round(255 - 100 * ((normalized - 0.67) / 0.33));
      const b = 0;
      return `rgb(${r}, ${g}, ${b})`;
    }
  };

  const formatPercentage = (value: number) => `${(value * 100).toFixed(0)}%`;

  return (
    <Card className="shadow-soft">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-finance-primary">
          <Activity className="h-5 w-5" />
          Direct Savings Sensitivities
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          3-Year Direct Savings (% of Pre-EMA Cost) by Final Year EMA Containment Rate and Y1 Human Productivity Benefit
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
                    Y1 Productivity ↓ / EMA Containment →
                  </th>
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
                    <td className="border border-border p-2 bg-muted text-sm font-medium">
                      {formatPercentage(productivityGains[4 - rowIdx])}
                    </td>
                    {row.map((value, colIdx) => (
                      <td 
                        key={colIdx} 
                        className="border border-border p-2 text-center text-sm font-medium text-white min-w-20"
                        style={{ backgroundColor: getColor(value) }}
                        title={`Direct Savings: ${value.toFixed(2)}%`}
                      >
                        {value.toFixed(2)}%
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