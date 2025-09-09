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

  return (
    <div className="space-y-6">
      {/* Base Case KPIs */}
      <Card className="shadow-soft">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-finance-primary">
            <TrendingUp className="h-5 w-5" />
            Key Performance Indicators (BASE CASE)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-finance-subtle rounded-lg">
              <DollarSign className="h-8 w-8 mx-auto mb-2 text-finance-primary" />
              <div className="text-2xl font-bold text-finance-primary">
                {(baseResults.totalAllInSavings / baseResults.implementationCost).toFixed(1)}x
              </div>
              <div className="text-sm text-muted-foreground">All-In ROI Multiple</div>
            </div>
            <div className="text-center p-4 bg-finance-subtle rounded-lg">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-finance-success" />
              <div className="text-2xl font-bold text-finance-success">
                {formatCurrency(baseResults.totalAllInSavings / 3, true)}M
              </div>
              <div className="text-sm text-muted-foreground">Avg Annual All-In Savings</div>
            </div>
            <div className="text-center p-4 bg-finance-subtle rounded-lg">
              <Target className="h-8 w-8 mx-auto mb-2 text-finance-accent" />
              <div className="text-2xl font-bold text-finance-accent">
                {((baseResults.implementationCost / (baseResults.totalSavings / 3)) * 12).toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">
                Payback Period (Months)
                <div className="text-xs text-muted-foreground/80 mt-1">
                  Based on direct savings only
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bull Case KPIs */}
      <Card className="shadow-soft">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-finance-primary">
            <TrendingUp className="h-5 w-5" />
            Key Performance Indicators (BULL CASE)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-finance-subtle rounded-lg">
              <DollarSign className="h-8 w-8 mx-auto mb-2 text-finance-primary" />
              <div className="text-2xl font-bold text-finance-primary">
                {(bullResults.totalAllInSavings / bullResults.implementationCost).toFixed(1)}x
              </div>
              <div className="text-sm text-muted-foreground">All-In ROI Multiple</div>
            </div>
            <div className="text-center p-4 bg-finance-subtle rounded-lg">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-finance-success" />
              <div className="text-2xl font-bold text-finance-success">
                {formatCurrency(bullResults.totalAllInSavings / 3, true)}M
              </div>
              <div className="text-sm text-muted-foreground">Avg Annual All-In Savings</div>
            </div>
            <div className="text-center p-4 bg-finance-subtle rounded-lg">
              <Target className="h-8 w-8 mx-auto mb-2 text-finance-accent" />
              <div className="text-2xl font-bold text-finance-accent">
                {((bullResults.implementationCost / (bullResults.totalSavings / 3)) * 12).toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">
                Payback Period (Months)
                <div className="text-xs text-muted-foreground/80 mt-1">
                  Based on direct savings only
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};