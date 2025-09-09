import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText } from 'lucide-react';
import { ScenarioInputs } from '@/types/ema-calculator';

interface KeyAssumptionsTableProps {
  scenarios: ScenarioInputs;
}

export const KeyAssumptionsTable: React.FC<KeyAssumptionsTableProps> = ({ scenarios }) => {
  const { base, bull } = scenarios;

  // Calculate derived values using the same logic as ema-calculations.ts
  const WORKING_MINUTES_PER_YEAR = 124800;
  
  const calculateDerivedValues = (inputs: typeof base) => {
    const salaryUSD = inputs.averageAnnualSalary / inputs.fxRate;
    const allInCostPerRep = salaryUSD * inputs.benefitsMultiplier;
    const annualQueries = inputs.monthlyQueryVolume * 12;
    const repsNeeded100 = (annualQueries * 1000000 * inputs.averageHandlingTime) / WORKING_MINUTES_PER_YEAR;
    const totalReps = repsNeeded100 * (1 + inputs.capacityBuffer);
    
    return {
      monthlyQueries: inputs.monthlyQueryVolume,
      averageHandlingTime: inputs.averageHandlingTime,
      totalReps: totalReps,
      repCostPerYear: allInCostPerRep,
      finalYearContainmentRate: inputs.finalYearContainmentRate
    };
  };

  const baseValues = calculateDerivedValues(base);
  const bullValues = calculateDerivedValues(bull);

  const formatNumber = (value: number, decimals = 1) => {
    return value.toFixed(decimals);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(0)}%`;
  };

  const formatComplianceCost = (value: number) => {
    return `$${value.toFixed(1)}M`;
  };

  const formatCurrencyWithUnits = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    } else {
      return `$${value.toFixed(1)}`;
    }
  };

  const createRangeValue = (baseValue: number, bullValue: number, formatter: (val: number) => string) => {
    if (baseValue === bullValue) {
      return formatter(baseValue);
    }
    const minValue = Math.min(baseValue, bullValue);
    const maxValue = Math.max(baseValue, bullValue);
    return `${formatter(minValue)} - ${formatter(maxValue)}`;
  };

  return (
    <Card className="shadow-soft">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-finance-primary">
          <FileText className="h-5 w-5" />
          Key Assumptions (Conservative vs Expected)
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Values used in output calculations for both scenarios
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          {/* Left Section */}
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Assumption</TableHead>
                  <TableHead className="text-center font-semibold">Conservative-Expected Values</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Monthly Queries (Millions)</TableCell>
                  <TableCell className="text-center">
                    {createRangeValue(baseValues.monthlyQueries, bullValues.monthlyQueries, formatNumber)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Avg Handling Time (Minutes)</TableCell>
                  <TableCell className="text-center">
                    {createRangeValue(baseValues.averageHandlingTime, bullValues.averageHandlingTime, formatNumber)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Reps Needed (Total)</TableCell>
                  <TableCell className="text-center">
                    {createRangeValue(baseValues.totalReps, bullValues.totalReps, (val) => formatNumber(val, 0))}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Rep Cost per Year (All-In, $)</TableCell>
                  <TableCell className="text-center">
                    {createRangeValue(baseValues.repCostPerYear, bullValues.repCostPerYear, formatCurrency)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Right Section */}
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Assumption</TableHead>
                  <TableHead className="text-center font-semibold">Conservative-Expected Values</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Share of Queries Handled by EMA (Y3)</TableCell>
                  <TableCell className="text-center">
                    {createRangeValue(baseValues.finalYearContainmentRate, bullValues.finalYearContainmentRate, formatPercentage)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Productivity Gain for Human Agents (%)</TableCell>
                  <TableCell className="text-center">
                    {createRangeValue(base.year1ProductivityGain, bull.year1ProductivityGain, formatPercentage)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Annual Compliance Cost Reduction (Additional Savings)</TableCell>
                  <TableCell className="text-center">
                    {createRangeValue(base.annualComplianceCostReduction, bull.annualComplianceCostReduction, formatComplianceCost)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">% Duplicate Calls Today (Additional Savings)</TableCell>
                  <TableCell className="text-center">
                    {createRangeValue(base.duplicateQueriesPercent, bull.duplicateQueriesPercent, formatPercentage)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};