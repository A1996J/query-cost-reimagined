import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScenarioResults } from '@/types/ema-calculator';
import { BarChart3 } from 'lucide-react';

interface SavingsWaterfallChartProps {
  scenarioResults: ScenarioResults;
}

export const SavingsWaterfallChart: React.FC<SavingsWaterfallChartProps> = ({ scenarioResults }) => {
  const { base, bull } = scenarioResults;

  // Calculate totals for 3 years
  const baseTotalPreEMA = base.yearlyBreakdown.reduce((sum, year) => sum + year.preEMACost, 0);
  const bullTotalPreEMA = bull.yearlyBreakdown.reduce((sum, year) => sum + year.preEMACost, 0);

  // Calculate percentage of baseline for each category
  const baseDirectPercent = (base.totalSavings / baseTotalPreEMA) * 100;
  const bullDirectPercent = (bull.totalSavings / bullTotalPreEMA) * 100;
  
  const baseAdditionalPercent = (base.totalAdditionalSavings / baseTotalPreEMA) * 100;
  const bullAdditionalPercent = (bull.totalAdditionalSavings / bullTotalPreEMA) * 100;

  const basePostEMAPercent = 100 - baseDirectPercent - baseAdditionalPercent;
  const bullPostEMAPercent = 100 - bullDirectPercent - bullAdditionalPercent;

  // Average heights for the chart
  const directHeight = (baseDirectPercent + bullDirectPercent) / 2;
  const additionalHeight = (baseAdditionalPercent + bullAdditionalPercent) / 2;
  const postEMAFilledHeight = (basePostEMAPercent + bullPostEMAPercent) / 2;

  const formatRange = (baseValue: number, bullValue: number) => {
    return `${baseValue.toFixed(1)}%–${bullValue.toFixed(1)}%`;
  };

  return (
    <Card className="shadow-soft">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-finance-primary text-center">
          <BarChart3 className="h-5 w-5" />
          3Y Savings Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-96 flex items-end justify-center space-x-8 p-4">
          {/* Pre-EMA Cost Bar */}
          <div className="flex flex-col items-center">
            <div className="relative w-16 bg-muted h-80 rounded-sm border">
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs font-medium text-muted-foreground rotate-90 whitespace-nowrap">
                100%
              </div>
            </div>
            <div className="mt-2 text-sm font-medium text-center">Pre-EMA<br/>Cost</div>
          </div>

          {/* Direct Savings Bar */}
          <div className="flex flex-col items-center">
            <div className="relative w-16 h-80 rounded-sm border overflow-hidden">
              {/* Full height background */}
              <div className="absolute inset-0 bg-muted"></div>
              {/* Direct savings portion - waterfall from top */}
              <div 
                className="absolute top-0 w-full bg-finance-success rounded-sm flex items-center justify-center"
                style={{ height: `${directHeight * 3.2}px` }}
              >
                <div className="text-xs font-medium text-white text-center px-1">
                  {formatRange(baseDirectPercent, bullDirectPercent)}
                </div>
              </div>
            </div>
            <div className="mt-2 text-sm font-medium text-center">Direct<br/>Savings</div>
          </div>

          {/* Additional Savings Bar */}
          <div className="flex flex-col items-center">
            <div className="relative w-16 h-80 rounded-sm border overflow-hidden">
              {/* Full height background */}
              <div className="absolute inset-0 bg-muted"></div>
              {/* Additional savings portion - waterfall continues from direct savings */}
              <div 
                className="absolute w-full bg-finance-success rounded-sm flex items-center justify-center"
                style={{ 
                  top: `${directHeight * 3.2}px`,
                  height: `${additionalHeight * 3.2}px` 
                }}
              >
                <div className="text-xs font-medium text-white text-center px-1">
                  {formatRange(baseAdditionalPercent, bullAdditionalPercent)}
                </div>
              </div>
            </div>
            <div className="mt-2 text-sm font-medium text-center">Additional<br/>Savings</div>
          </div>

          {/* Post-EMA Cost Bar */}
          <div className="flex flex-col items-center">
            <div className="relative w-16 h-80 rounded-sm border overflow-hidden">
              {/* Dashed outline showing range */}
              <div 
                className="absolute bottom-0 w-full border-2 border-dashed border-finance-success bg-finance-success/10"
                style={{ height: `${Math.max(postEMAFilledHeight, Math.min(basePostEMAPercent, bullPostEMAPercent)) * 3.2}px` }}
              >
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-xs font-medium text-finance-primary text-center">
                  {formatRange(basePostEMAPercent, bullPostEMAPercent)}
                </div>
              </div>
              {/* Solid filled portion */}
              <div 
                className="absolute bottom-0 w-full bg-finance-primary rounded-sm"
                style={{ height: `${postEMAFilledHeight * 3.2}px` }}
              />
            </div>
            <div className="mt-2 text-sm font-medium text-center">Post-EMA<br/>Cost</div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-muted rounded"></div>
            <span>Baseline Cost</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-finance-success rounded"></div>
            <span>Savings</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-finance-primary rounded"></div>
            <span>Remaining Cost</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border-2 border-dashed border-finance-success bg-finance-success/10 rounded"></div>
            <span>Savings Range</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};