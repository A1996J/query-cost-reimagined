import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Target, DollarSign } from 'lucide-react';
import { ScenarioResults, ScenarioInputs } from '@/types/ema-calculator';

interface ReportKeyPerformanceIndicatorsProps {
  scenarioResults: ScenarioResults;
  scenarios: ScenarioInputs;
}

export const ReportKeyPerformanceIndicators: React.FC<ReportKeyPerformanceIndicatorsProps> = ({ 
  scenarioResults, 
  scenarios 
}) => {
  const formatCurrency = (amount: number, inMillions?: boolean) => {
    if (inMillions) {
      return (amount / 1000000).toFixed(1);
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: scenarios.base.currency,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const baseResults = scenarioResults.base;
  const bullResults = scenarioResults.bull;

  // Calculate base case values
  const baseROI = (baseResults.totalAllInSavings / baseResults.implementationCost).toFixed(1);
  const baseAvgAnnual = formatCurrency(baseResults.totalAllInSavings / 3, true);
  const basePayback = ((baseResults.implementationCost / (baseResults.totalSavings / 3)) * 12).toFixed(1);

  // Calculate bull case values
  const bullROI = (bullResults.totalAllInSavings / bullResults.implementationCost).toFixed(1);
  const bullAvgAnnual = formatCurrency(bullResults.totalAllInSavings / 3, true);
  const bullPayback = ((bullResults.implementationCost / (bullResults.totalSavings / 3)) * 12).toFixed(1);

  // Order payback periods from smallest to largest
  const basePaybackNum = parseFloat(basePayback);
  const bullPaybackNum = parseFloat(bullPayback);
  const minPayback = Math.min(basePaybackNum, bullPaybackNum).toFixed(1);
  const maxPayback = Math.max(basePaybackNum, bullPaybackNum).toFixed(1);

  return (
    <Card className="shadow-soft">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-finance-primary">
          <TrendingUp className="h-5 w-5" />
          Quick Payback with top-notch ROI
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-finance-subtle rounded-lg">
            <Target className="h-8 w-8 mx-auto mb-2 text-finance-success" />
            <div className="text-2xl font-bold text-finance-success">
              {minPayback} - {maxPayback}
            </div>
            <div className="text-sm text-muted-foreground">
              Payback Period (Months)
              <div className="text-xs text-muted-foreground/80 mt-1">
                Based on direct savings only
              </div>
            </div>
          </div>
          <div className="text-center p-4 bg-finance-subtle rounded-lg">
            <DollarSign className="h-8 w-8 mx-auto mb-2 text-finance-primary" />
            <div className="text-2xl font-bold text-finance-primary">
              {baseROI}x - {bullROI}x
            </div>
            <div className="text-sm text-muted-foreground">All-In ROI Multiple</div>
          </div>
          <div className="text-center p-4 bg-finance-subtle rounded-lg">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-finance-success" />
            <div className="text-2xl font-bold text-finance-success">
              {baseAvgAnnual}M - {bullAvgAnnual}M
            </div>
            <div className="text-sm text-muted-foreground">Avg Annual All-In Savings</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};