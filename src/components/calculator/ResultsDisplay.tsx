import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp, DollarSign, Target, Award } from 'lucide-react';
import { CalculationResults } from '@/types/ema-calculator';

interface ResultsDisplayProps {
  results: CalculationResults;
  currency: string;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, currency }) => {
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
            Total EMA Savings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">
              {formatCurrency(results.totalSavings, true)}M
            </div>
            <p className="text-white/90 text-lg">
              3-Year Direct Cost Savings
            </p>
          </div>
          
          <div className="mt-6 pt-4 border-t border-white/20">
            <div className="flex justify-between items-center text-sm">
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
            Year-by-Year Breakdown
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
                    {formatCurrency(year.netSavings, true)}M
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Net Savings
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
                  <TableHead className="text-right">Queries (M)</TableHead>
                  <TableHead className="text-right">EMA %</TableHead>
                  <TableHead className="text-right">Pre-EMA Cost</TableHead>
                  <TableHead className="text-right">Post-EMA Cost</TableHead>
                  <TableHead className="text-right">Savings</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.yearlyBreakdown.map((year) => (
                  <TableRow key={year.year}>
                    <TableCell className="font-medium">Y{year.year}</TableCell>
                    <TableCell className="text-right">
                      {(year.queries / 1000000).toFixed(1)}M
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPercentage(year.emaContainmentRate)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(year.preEMACost, true)}M
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(year.postEMACost, true)}M
                    </TableCell>
                    <TableCell className="text-right font-semibold text-finance-success">
                      {formatCurrency(year.netSavings, true)}M
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-finance-subtle font-semibold">
                  <TableCell>Total</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-right text-finance-primary">
                    {formatCurrency(results.totalSavings, true)}M
                  </TableCell>
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
                {((results.totalSavings / results.implementationCost) - 1).toFixed(1)}x
              </div>
              <div className="text-sm text-muted-foreground">ROI Multiple</div>
            </div>
            <div className="text-center p-4 bg-finance-subtle rounded-lg">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-finance-success" />
              <div className="text-2xl font-bold text-finance-success">
                {(results.totalSavings / 3 / 1000000).toFixed(1)}M
              </div>
              <div className="text-sm text-muted-foreground">Avg Annual Savings</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};