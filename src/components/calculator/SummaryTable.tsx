import React from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScenarioResults, ScenarioInputs } from '@/types/ema-calculator';

interface SummaryTableProps {
  scenarioResults: ScenarioResults;
  scenarios: ScenarioInputs;
}

export const SummaryTable: React.FC<SummaryTableProps> = ({ scenarioResults, scenarios }) => {
  const formatCurrency = (value: number, decimals = 2) => {
    return `$${(value / 1000000).toFixed(decimals)}M`;
  };

  const formatPercentage = (value: number, decimals = 1) => {
    return `${(value * 100).toFixed(decimals)}%`;
  };

  const formatNumber = (value: number, decimals = 2) => {
    return `$${value.toFixed(decimals)}`;
  };

  // Constants from ema-calculations.ts
  const WORKING_MINUTES_PER_YEAR = 124800;

  // Calculate derived values using exact same logic as ema-calculations.ts
  const getPreEmaCostPerQuery = (scenario: keyof ScenarioInputs) => {
    const inputs = scenarios[scenario];
    const salaryUSD = inputs.averageAnnualSalary / inputs.fxRate;
    const allInCostPerRep = salaryUSD * inputs.benefitsMultiplier;
    const annualQueries = inputs.monthlyQueryVolume * 12;
    const repsNeeded100 = (annualQueries * 1000000 * inputs.averageHandlingTime) / WORKING_MINUTES_PER_YEAR;
    const totalReps = repsNeeded100 * (1 + inputs.capacityBuffer);
    const costPerQuery = (allInCostPerRep * totalReps) / (annualQueries * 1000000);
    return costPerQuery * inputs.partnerOverheadMultiplier;
  };

  const getEmaCostPerQuery = (scenario: keyof ScenarioInputs) => {
    const inputs = scenarios[scenario];
    return inputs.emaPricePerQuery * (1 + inputs.partnerProfitMargin);
  };

  const getHumanQueryCostWithEma = (scenario: keyof ScenarioInputs, year: number) => {
    const preEmaCost = getPreEmaCostPerQuery(scenario);
    let productivityGain = scenarios[scenario].year1ProductivityGain;
    if (year >= 2) {
      productivityGain = scenarios[scenario].year1ProductivityGain * (4/3);
    }
    return preEmaCost * (1 - productivityGain);
  };

  const getEmaContainmentRate = (scenario: keyof ScenarioInputs, year: number) => {
    return scenarios[scenario].finalYearContainmentRate * (year / 3);
  };

  const getTotalPreEmaCost = (scenario: keyof ScenarioInputs, year: number) => {
    const inputs = scenarios[scenario];
    const annualQueries = inputs.monthlyQueryVolume * 12;
    const queries = annualQueries * Math.pow(1 + inputs.companyGrowthRate, year - 1);
    return queries * 1000000 * getPreEmaCostPerQuery(scenario);
  };

  const getReductionInHandlingTime = (scenario: keyof ScenarioInputs, year: number) => {
    let productivityGain = scenarios[scenario].year1ProductivityGain;
    if (year >= 2) {
      productivityGain = scenarios[scenario].year1ProductivityGain * (4/3);
    }
    return productivityGain;
  };

  const sections = [
    {
      title: "Pre-Ema (Before Automation)",
      rows: [
        {
          field: "Cost per Query Handled by Human (Pre-Ema, $)",
          getValue: (scenario: keyof ScenarioInputs, year: number) => formatNumber(getPreEmaCostPerQuery(scenario))
        },
        {
          field: "Total Pre-Ema Cost ($)",
          getValue: (scenario: keyof ScenarioInputs, year: number) => formatCurrency(getTotalPreEmaCost(scenario, year))
        },
        {
          field: "Share of Queries Handled by Humans (%)",
          getValue: (scenario: keyof ScenarioInputs, year: number) => "100.0%"
        }
      ]
    },
    {
      title: "Post-Ema (Automation Introduced)",
      rows: [
        {
          field: "Cost per Query Solved by Ema ($)",
          getValue: (scenario: keyof ScenarioInputs, year: number) => formatNumber(getEmaCostPerQuery(scenario))
        },
        {
          field: "Cost per Human Query Aided by Ema ($)",
          getValue: (scenario: keyof ScenarioInputs, year: number) => formatNumber(getHumanQueryCostWithEma(scenario, year))
        },
        {
          field: "Share of Queries Handled by Ema (%)",
          getValue: (scenario: keyof ScenarioInputs, year: number) => formatPercentage(getEmaContainmentRate(scenario, year))
        },
        {
          field: "Reduction in Human Handling Time (%)",
          getValue: (scenario: keyof ScenarioInputs, year: number) => formatPercentage(getReductionInHandlingTime(scenario, year))
        }
      ]
    },
    {
      title: "Direct Savings from Ema",
      rows: [
        {
          field: "Gross Direct Savings ($)",
          getValue: (scenario: keyof ScenarioInputs, year: number) => {
            const results = scenarioResults[scenario];
            const yearData = results.yearlyBreakdown[year - 1];
            return formatCurrency(yearData.preEMACost - yearData.postEMACost);
          }
        },
        {
          field: "Less: Implementation Cost ($)",
          getValue: (scenario: keyof ScenarioInputs, year: number) => {
            return year === 1 ? formatCurrency(scenarios[scenario].implementationCost * 1000000) : "$0.0M";
          }
        },
        {
          field: "Net Direct Savings ($)",
          getValue: (scenario: keyof ScenarioInputs, year: number) => {
            const results = scenarioResults[scenario];
            const yearData = results.yearlyBreakdown[year - 1];
            return formatCurrency(yearData.savings);
          }
        },
        {
          field: "% of Baseline Saved (%)",
          getValue: (scenario: keyof ScenarioInputs, year: number) => {
            const results = scenarioResults[scenario];
            const yearData = results.yearlyBreakdown[year - 1];
            return formatPercentage(yearData.directSavingsPercentOfBaseline);
          }
        }
      ]
    },
    {
      title: "Additional Savings",
      rows: [
        {
          field: "First Call Resolution Benefit ($)",
          getValue: (scenario: keyof ScenarioInputs, year: number) => {
            const results = scenarioResults[scenario];
            const yearData = results.yearlyBreakdown[year - 1];
            return formatCurrency(yearData.firstCallResolutionBenefit);
          }
        },
        {
          field: "Compliance Cost Reduction ($)",
          getValue: (scenario: keyof ScenarioInputs, year: number) => {
            const results = scenarioResults[scenario];
            const yearData = results.yearlyBreakdown[year - 1];
            return formatCurrency(yearData.complianceSavings);
          }
        },
        {
          field: "Revenue Defended / Upsell ($)",
          getValue: (scenario: keyof ScenarioInputs, year: number) => {
            const results = scenarioResults[scenario];
            const yearData = results.yearlyBreakdown[year - 1];
            return formatCurrency(yearData.upsellBenefit);
          }
        }
      ]
    },
    {
      title: "All-In Savings ($)",
      rows: [
        {
          field: "Total All-In Savings ($)",
          getValue: (scenario: keyof ScenarioInputs, year: number) => {
            const results = scenarioResults[scenario];
            const yearData = results.yearlyBreakdown[year - 1];
            return formatCurrency(yearData.allInSavings);
          }
        },
        {
          field: "% of Baseline Saved (%)",
          getValue: (scenario: keyof ScenarioInputs, year: number) => {
            const results = scenarioResults[scenario];
            const yearData = results.yearlyBreakdown[year - 1];
            const preEmaCost = yearData.preEMACost;
            return formatPercentage(yearData.allInSavings / preEmaCost);
          }
        }
      ]
    }
  ];

  return (
    <Card className="p-6 shadow-soft">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-finance-primary mb-2">Executive Summary</h2>
        <p className="text-muted-foreground">Comprehensive 3-year financial impact analysis</p>
      </div>
      
      <div className="overflow-x-auto">
        <Table className="text-base">
          <TableHeader className="sticky top-0 bg-background">
            <TableRow className="border-b-2">
              <TableHead className="font-bold text-lg w-80">Field Name</TableHead>
              <TableHead className="font-bold text-lg text-center">Base Case - Year 1</TableHead>
              <TableHead className="font-bold text-lg text-center">Base Case - Year 2</TableHead>
              <TableHead className="font-bold text-lg text-center border-r-2 border-border">Base Case - Year 3</TableHead>
              <TableHead className="font-bold text-lg text-center">Bull Case - Year 1</TableHead>
              <TableHead className="font-bold text-lg text-center">Bull Case - Year 2</TableHead>
              <TableHead className="font-bold text-lg text-center">Bull Case - Year 3</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sections.map((section, sectionIndex) => (
              <React.Fragment key={section.title}>
                <TableRow className="bg-finance-subtle border-none">
                  <TableCell colSpan={7} className="font-bold text-lg text-finance-primary py-4">
                    {section.title}
                  </TableCell>
                </TableRow>
                {section.rows.map((row, rowIndex) => (
                  <TableRow key={`${section.title}-${row.field}`} className="hover:bg-muted/50">
                    <TableCell className="font-medium py-3 pl-6">{row.field}</TableCell>
                    <TableCell className="text-center py-3">{row.getValue('base', 1)}</TableCell>
                    <TableCell className="text-center py-3">{row.getValue('base', 2)}</TableCell>
                    <TableCell className="text-center py-3 border-r-2 border-border">{row.getValue('base', 3)}</TableCell>
                    <TableCell className="text-center py-3">{row.getValue('bull', 1)}</TableCell>
                    <TableCell className="text-center py-3">{row.getValue('bull', 2)}</TableCell>
                    <TableCell className="text-center py-3">{row.getValue('bull', 3)}</TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};