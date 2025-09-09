import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Percent } from 'lucide-react';
import { ScenarioResults, ScenarioInputs } from '@/types/ema-calculator';

interface ReportBaselineSavingsSummaryProps {
  scenarioResults: ScenarioResults;
  scenarios: ScenarioInputs;
}

export const ReportBaselineSavingsSummary: React.FC<ReportBaselineSavingsSummaryProps> = ({ 
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

  const baseBaseline = baseResults.yearlyBreakdown.reduce((sum, year) => sum + year.preEMACost, 0);
  const bullBaseline = bullResults.yearlyBreakdown.reduce((sum, year) => sum + year.preEMACost, 0);

  return (
    <div className="space-y-6">
      {/* Base Case Baseline Savings */}
      <Card className="shadow-soft">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-finance-primary">
            <Percent className="h-5 w-5" />
            3-Year Baseline Savings Summary (BASE CASE)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-finance-subtle rounded-lg">
              <div className="text-2xl font-bold text-finance-primary mb-1">
                {((baseResults.totalSavings / baseBaseline) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Direct Savings<br/>% of Baseline</div>
              <div className="text-xs text-finance-primary mt-1">
                {formatCurrency(baseResults.totalSavings, true)}M Total
              </div>
            </div>
            <div className="text-center p-4 bg-finance-subtle rounded-lg">
              <div className="text-2xl font-bold text-finance-accent mb-1">
                {((baseResults.totalAdditionalSavings / baseBaseline) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Additional Savings<br/>% of Baseline</div>
              <div className="text-xs text-finance-accent mt-1">
                {formatCurrency(baseResults.totalAdditionalSavings, true)}M Total
              </div>
            </div>
            <div className="text-center p-4 bg-finance-subtle rounded-lg">
              <div className="text-2xl font-bold text-finance-success mb-1">
                {((baseResults.totalAllInSavings / baseBaseline) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">All-In Savings<br/>% of Baseline</div>
              <div className="text-xs text-finance-success mt-1">
                {formatCurrency(baseResults.totalAllInSavings, true)}M Total
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bull Case Baseline Savings */}
      <Card className="shadow-soft">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-finance-primary">
            <Percent className="h-5 w-5" />
            3-Year Baseline Savings Summary (BULL CASE)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-finance-subtle rounded-lg">
              <div className="text-2xl font-bold text-finance-primary mb-1">
                {((bullResults.totalSavings / bullBaseline) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Direct Savings<br/>% of Baseline</div>
              <div className="text-xs text-finance-primary mt-1">
                {formatCurrency(bullResults.totalSavings, true)}M Total
              </div>
            </div>
            <div className="text-center p-4 bg-finance-subtle rounded-lg">
              <div className="text-2xl font-bold text-finance-accent mb-1">
                {((bullResults.totalAdditionalSavings / bullBaseline) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Additional Savings<br/>% of Baseline</div>
              <div className="text-xs text-finance-accent mt-1">
                {formatCurrency(bullResults.totalAdditionalSavings, true)}M Total
              </div>
            </div>
            <div className="text-center p-4 bg-finance-subtle rounded-lg">
              <div className="text-2xl font-bold text-finance-success mb-1">
                {((bullResults.totalAllInSavings / bullBaseline) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">All-In Savings<br/>% of Baseline</div>
              <div className="text-xs text-finance-success mt-1">
                {formatCurrency(bullResults.totalAllInSavings, true)}M Total
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};