import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText } from 'lucide-react';
import { ScenarioResults, ScenarioInputs } from '@/types/ema-calculator';

interface ExecutiveSummaryPart2Props {
  scenarioResults: ScenarioResults;
  scenarios: ScenarioInputs;
}

export const ExecutiveSummaryPart2: React.FC<ExecutiveSummaryPart2Props> = ({ scenarioResults, scenarios }) => {
  const formatCurrency = (value: number, decimals = 2) => {
    return `$${(value / 1000000).toFixed(decimals)}M`;
  };

  const formatPercentage = (value: number, decimals = 1) => {
    return `${(value * 100).toFixed(decimals)}%`;
  };

  const sections = [
    {
      title: "Direct Savings from EMA",
      rows: [
        {
          name: "Direct Savings from EMA",
          getValue: (scenario: keyof ScenarioInputs, year: number) => {
            const result = scenarioResults[scenario];
            return formatCurrency(result.yearlyBreakdown[year - 1]?.savings || 0);
          }
        },
        {
          name: "Net Savings (after EMA cost)",
          getValue: (scenario: keyof ScenarioInputs, year: number) => {
            const result = scenarioResults[scenario];
            return formatCurrency(result.yearlyBreakdown[year - 1]?.netSavings || 0);
          }
        }
      ]
    },
    {
      title: "Additional Savings",
      rows: [
        {
          name: "First Call Resolution Benefit",
          getValue: (scenario: keyof ScenarioInputs, year: number) => {
            const result = scenarioResults[scenario];
            return formatCurrency(result.yearlyBreakdown[year - 1]?.firstCallResolutionBenefit || 0);
          }
        },
        {
          name: "Compliance Savings",
          getValue: (scenario: keyof ScenarioInputs, year: number) => {
            const result = scenarioResults[scenario];
            return formatCurrency(result.yearlyBreakdown[year - 1]?.complianceSavings || 0);
          }
        },
        {
          name: "Total Additional Savings",
          getValue: (scenario: keyof ScenarioInputs, year: number) => {
            const result = scenarioResults[scenario];
            return formatCurrency(result.yearlyBreakdown[year - 1]?.totalAdditionalSavings || 0);
          }
        },
        {
          name: "All-In Savings",
          getValue: (scenario: keyof ScenarioInputs, year: number) => {
            const result = scenarioResults[scenario];
            return formatCurrency(result.yearlyBreakdown[year - 1]?.allInSavings || 0);
          }
        }
      ]
    },
    {
      title: "Percentage of Baseline Saved Over Three Years",
      rows: [
        {
          name: "Direct Savings % of Baseline",
          getValue: (scenario: keyof ScenarioInputs, year: number) => {
            const result = scenarioResults[scenario];
            return formatPercentage((result.yearlyBreakdown[year - 1]?.directSavingsPercentOfBaseline || 0) / 100);
          }
        },
        {
          name: "Additional Savings % of Baseline", 
          getValue: (scenario: keyof ScenarioInputs, year: number) => {
            const result = scenarioResults[scenario];
            return formatPercentage((result.yearlyBreakdown[year - 1]?.additionalSavingsPercentOfBaseline || 0) / 100);
          }
        },
        {
          name: "All-In Savings % of Baseline",
          getValue: (scenario: keyof ScenarioInputs, year: number) => {
            const result = scenarioResults[scenario];
            return formatPercentage((result.yearlyBreakdown[year - 1]?.allInSavingsPercentOfBaseline || 0) / 100);
          }
        }
      ]
    }
  ];

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-finance-primary">
          <FileText className="h-5 w-5" />
          Executive Summary (Part 2)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h4 className="font-semibold text-finance-primary mb-3">{section.title}</h4>
              <Table className="border">
                <TableHeader>
                  <TableRow className="bg-finance-subtle">
                    <TableHead className="font-semibold border-r">Field Name</TableHead>
                    <TableHead className="text-center border-r font-semibold">Base Case Y1</TableHead>
                    <TableHead className="text-center border-r font-semibold">Base Case Y2</TableHead>
                    <TableHead className="text-center border-r font-semibold">Base Case Y3</TableHead>
                    <TableHead className="text-center border-r font-semibold">Bull Case Y1</TableHead>
                    <TableHead className="text-center border-r font-semibold">Bull Case Y2</TableHead>
                    <TableHead className="text-center font-semibold">Bull Case Y3</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {section.rows.map((row, rowIndex) => (
                    <TableRow key={rowIndex} className="hover:bg-finance-subtle/50">
                      <TableCell className="font-medium border-r">{row.name}</TableCell>
                      <TableCell className="text-center border-r">{row.getValue('base', 1)}</TableCell>
                      <TableCell className="text-center border-r">{row.getValue('base', 2)}</TableCell>
                      <TableCell className="text-center border-r">{row.getValue('base', 3)}</TableCell>
                      <TableCell className="text-center border-r">{row.getValue('bull', 1)}</TableCell>
                      <TableCell className="text-center border-r">{row.getValue('bull', 2)}</TableCell>
                      <TableCell className="text-center">{row.getValue('bull', 3)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};