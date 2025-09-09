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
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Assumption</TableHead>
                <TableHead className="text-center font-semibold">Conservative Value</TableHead>
                <TableHead className="text-center font-semibold">Expected Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Monthly Queries (Millions)</TableCell>
                <TableCell className="text-center">{formatNumber(baseValues.monthlyQueries)}</TableCell>
                <TableCell className="text-center">{formatNumber(bullValues.monthlyQueries)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Avg Handling Time (Minutes)</TableCell>
                <TableCell className="text-center">{formatNumber(baseValues.averageHandlingTime)}</TableCell>
                <TableCell className="text-center">{formatNumber(bullValues.averageHandlingTime)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Reps Needed (Total)</TableCell>
                <TableCell className="text-center">{formatNumber(baseValues.totalReps, 0)}</TableCell>
                <TableCell className="text-center">{formatNumber(bullValues.totalReps, 0)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Rep Cost per Year (All-In, $)</TableCell>
                <TableCell className="text-center">{formatCurrency(baseValues.repCostPerYear)}</TableCell>
                <TableCell className="text-center">{formatCurrency(bullValues.repCostPerYear)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Share of Queries Handled by EMA (Y3)</TableCell>
                <TableCell className="text-center">{formatPercentage(baseValues.finalYearContainmentRate)}</TableCell>
                <TableCell className="text-center">{formatPercentage(bullValues.finalYearContainmentRate)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};