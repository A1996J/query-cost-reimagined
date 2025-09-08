import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp, DollarSign, Target, Award, PercentIcon } from 'lucide-react';
import { CalculationResults, ScenarioResults, ScenarioInputs } from '@/types/ema-calculator';

interface ResultsDisplayProps {
  results: CalculationResults;
  currency: string;
  scenario?: string;
  scenarioResults?: ScenarioResults;
  scenarios?: ScenarioInputs;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, currency, scenario = 'base', scenarioResults, scenarios }) => {
  const formatCurrency = (amount: number, inMillions = false) => {
    const value = inMillions ? amount / 1000000 : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency === 'USD' ? 'USD' : 'USD', // Force USD for now
      minimumFractionDigits: inMillions ? 2 : 0,
      maximumFractionDigits: inMillions ? 2 : 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Main Result Card */}
      <Card className="shadow-strong bg-finance-gradient text-white overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Award className="h-6 w-6" />
            Total All-In EMA Savings ({scenario.toUpperCase()})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">
              {formatCurrency(results.totalAllInSavings, true)}M
            </div>
            <p className="text-white/90 text-lg">
              3-Year All-In Savings (Direct + Additional)
            </p>
          </div>
          
          <div className="mt-6 pt-4 border-t border-white/20 space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span>Direct Savings:</span>
              <span>{formatCurrency(results.totalSavings, true)}M</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span>Additional Savings:</span>
              <span>{formatCurrency(results.totalAdditionalSavings, true)}M</span>
            </div>
            <div className="flex justify-between items-center text-sm border-t border-white/20 pt-2">
              <span>Implementation Cost:</span>
              <span>{formatCurrency(results.implementationCost, true)}M</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Yearly Breakdown */}
      <Card className="shadow-soft">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-finance-primary">
            <TrendingUp className="h-5 w-5" />
            Year-by-Year Breakdown ({scenario.toUpperCase()})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {results.yearlyBreakdown.map((year) => (
              <Card key={year.year} className="p-4 bg-finance-subtle border-finance-primary/20">
                <div className="text-center">
                  <Badge variant="outline" className="mb-2 border-finance-primary text-finance-primary">
                    Year {year.year}
                  </Badge>
                  <div className="text-2xl font-bold text-finance-primary mb-1">
                    {formatCurrency(year.allInSavings, true)}M
                  </div>
                  <div className="text-sm text-muted-foreground">
                    All-In Savings
                  </div>
                  <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                    <div>EMA: {formatPercentage(year.emaContainmentRate)}</div>
                    <div>Productivity: {formatPercentage(year.productivityGain)}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Detailed Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Year</TableHead>
                  <TableHead className="text-right">Pre-EMA Cost ($M)</TableHead>
                  <TableHead className="text-right">Direct Savings ($M)</TableHead>
                  <TableHead className="text-right">% Baseline</TableHead>
                  <TableHead className="text-right">Additional Savings ($M)</TableHead>
                  <TableHead className="text-right">% Baseline</TableHead>
                  <TableHead className="text-right">All-In Savings ($M)</TableHead>
                  <TableHead className="text-right">% Baseline</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.yearlyBreakdown.map((year) => (
                  <TableRow key={year.year}>
                    <TableCell className="font-medium">Y{year.year}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(year.preEMACost, true)}M
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(year.netSavings, true)}M
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPercentage(year.directSavingsPercentOfBaseline)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(year.totalAdditionalSavings, true)}M
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPercentage(year.additionalSavingsPercentOfBaseline)}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-finance-success">
                      {formatCurrency(year.allInSavings, true)}M
                    </TableCell>
                    <TableCell className="text-right font-semibold text-finance-success">
                      {formatPercentage(year.allInSavingsPercentOfBaseline)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-finance-subtle font-semibold">
                  <TableCell>Total</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(results.yearlyBreakdown.reduce((sum, year) => sum + year.preEMACost, 0), true)}M
                  </TableCell>
                  <TableCell className="text-right text-finance-primary">
                    {formatCurrency(results.totalSavings, true)}M
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-right text-finance-primary">
                    {formatCurrency(results.totalAdditionalSavings, true)}M
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-right text-finance-primary">
                    {formatCurrency(results.totalAllInSavings, true)}M
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <Card className="shadow-soft">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-finance-primary">
            <Target className="h-5 w-5" />
            Key Performance Indicators
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-finance-subtle rounded-lg">
              <DollarSign className="h-8 w-8 mx-auto mb-2 text-finance-primary" />
              <div className="text-2xl font-bold text-finance-primary">
                {((results.totalAllInSavings / results.implementationCost) - 1).toFixed(1)}x
              </div>
              <div className="text-sm text-muted-foreground">All-In ROI Multiple</div>
            </div>
            <div className="text-center p-4 bg-finance-subtle rounded-lg">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-finance-success" />
              <div className="text-2xl font-bold text-finance-success">
                {(results.totalAllInSavings / 3 / 1000000).toFixed(1)}M
              </div>
              <div className="text-sm text-muted-foreground">Avg Annual All-In Savings</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3-Year Baseline Totals */}
      <Card className="shadow-soft">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-finance-primary">
            <PercentIcon className="h-5 w-5" />
            3-Year Baseline Savings Summary ({scenario.toUpperCase()})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-finance-subtle rounded-lg">
              <div className="text-2xl font-bold text-finance-primary mb-1">
                {((results.totalSavings / results.yearlyBreakdown.reduce((sum, year) => sum + year.preEMACost, 0)) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Direct Savings<br/>% of Baseline</div>
              <div className="text-xs text-finance-primary mt-1">
                {formatCurrency(results.totalSavings, true)}M Total
              </div>
            </div>
            <div className="text-center p-4 bg-finance-subtle rounded-lg">
              <div className="text-2xl font-bold text-finance-accent mb-1">
                {((results.totalAdditionalSavings / results.yearlyBreakdown.reduce((sum, year) => sum + year.preEMACost, 0)) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Additional Savings<br/>% of Baseline</div>
              <div className="text-xs text-finance-accent mt-1">
                {formatCurrency(results.totalAdditionalSavings, true)}M Total
              </div>
            </div>
            <div className="text-center p-4 bg-finance-subtle rounded-lg">
              <div className="text-2xl font-bold text-finance-success mb-1">
                {((results.totalAllInSavings / results.yearlyBreakdown.reduce((sum, year) => sum + year.preEMACost, 0)) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">All-In Savings<br/>% of Baseline</div>
              <div className="text-xs text-finance-success mt-1">
                {formatCurrency(results.totalAllInSavings, true)}M Total
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
};