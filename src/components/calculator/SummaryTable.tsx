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

  // Calculate derived values for each scenario and year
  const getPreEmaCostPerQuery = (scenario: keyof ScenarioInputs) => {
    const inputs = scenarios[scenario];
    const annualSalaryWithBenefits = inputs.averageAnnualSalary * inputs.benefitsMultiplier;
    const annualQueriesPerRep = (60 / inputs.averageHandlingTime) * 8 * 5 * 52 * (1 - inputs.capacityBuffer);
    return (annualSalaryWithBenefits / annualQueriesPerRep) * inputs.partnerOverheadMultiplier;
  };

  const getEmaCostPerQuery = () => {
    return scenarios.base.emaPricePerQuery * scenarios.base.partnerOverheadMultiplier;
  };

  const getHumanQueryCostWithEma = (scenario: keyof ScenarioInputs, year: number) => {
    const inputs = scenarios[scenario];
    const productivityMultiplier = 1 + inputs.year1ProductivityGain;
    const adjustedHandlingTime = inputs.averageHandlingTime / productivityMultiplier;
    const annualSalaryWithBenefits = inputs.averageAnnualSalary * inputs.benefitsMultiplier;
    const annualQueriesPerRep = (60 / adjustedHandlingTime) * 8 * 5 * 52 * (1 - inputs.capacityBuffer);
    return (annualSalaryWithBenefits / annualQueriesPerRep) * inputs.partnerOverheadMultiplier;
  };

  const getEmaContainmentRate = (year: number) => {
    // Linear progression to final year containment rate
    return Math.min(0.2 + (scenarios.base.finalYearContainmentRate - 0.2) * (year - 1) / 2, scenarios.base.finalYearContainmentRate);
  };

  const sections = [
    {
      title: "Pre-Ema (Before Automation)",
      rows: [
        {
          field: "Cost per Query (Pre-Ema)",
          getValue: (scenario: keyof ScenarioInputs, year: number) => formatNumber(getPreEmaCostPerQuery(scenario))
        },
        {
          field: "Pre-Ema Cost per query ($)",
          getValue: (scenario: keyof ScenarioInputs, year: number) => formatNumber(getPreEmaCostPerQuery(scenario))
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
          getValue: (scenario: keyof ScenarioInputs, year: number) => formatNumber(getEmaCostPerQuery())
        },
        {
          field: "Reduction in Human Handling Time (%)",
          getValue: (scenario: keyof ScenarioInputs, year: number) => formatPercentage(scenarios[scenario].year1ProductivityGain)
        },
        {
          field: "Cost per Human Query Aided by Ema ($)",
          getValue: (scenario: keyof ScenarioInputs, year: number) => formatNumber(getHumanQueryCostWithEma(scenario, year))
        },
        {
          field: "Queries Handled by Ema (%)",
          getValue: (scenario: keyof ScenarioInputs, year: number) => formatPercentage(getEmaContainmentRate(year))
        }
      ]
    },
    {
      title: "Direct Savings from Ema",
      rows: [
        {
          field: "Direct Savings from Ema ($M)",
          getValue: (scenario: keyof ScenarioInputs, year: number) => {
            const results = scenarioResults[scenario];
            const yearData = results.yearlyBreakdown[year - 1];
            return formatCurrency(yearData.savings);
          }
        },
        {
          field: "Less: Implementation Cost ($M)",
          getValue: (scenario: keyof ScenarioInputs, year: number) => {
            return year === 1 ? formatCurrency(scenarios[scenario].implementationCost) : "$0.0M";
          }
        },
        {
          field: "Net Direct Savings ($M)",
          getValue: (scenario: keyof ScenarioInputs, year: number) => {
            const results = scenarioResults[scenario];
            const yearData = results.yearlyBreakdown[year - 1];
            const implementationCost = year === 1 ? scenarios[scenario].implementationCost : 0;
            return formatCurrency(yearData.savings - implementationCost);
          }
        },
        {
          field: "% of Pre-Ema Baseline Cost",
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
          field: "First Call Resolution Benefit ($M)",
          getValue: (scenario: keyof ScenarioInputs, year: number) => {
            const results = scenarioResults[scenario];
            const yearData = results.yearlyBreakdown[year - 1];
            return formatCurrency(yearData.firstCallResolutionBenefit);
          }
        },
        {
          field: "Compliance Cost Reduction ($M)",
          getValue: (scenario: keyof ScenarioInputs, year: number) => {
            const results = scenarioResults[scenario];
            const yearData = results.yearlyBreakdown[year - 1];
            return formatCurrency(yearData.complianceSavings);
          }
        },
        {
          field: "Upsell / Revenue Retention Benefit ($M)",
          getValue: (scenario: keyof ScenarioInputs, year: number) => {
            const results = scenarioResults[scenario];
            const yearData = results.yearlyBreakdown[year - 1];
            return formatCurrency(yearData.upsellBenefit);
          }
        }
      ]
    },
    {
      title: "All-In Savings ($M)",
      rows: [
        {
          field: "Total All-In Savings (3-Year Sum)",
          getValue: (scenario: keyof ScenarioInputs, year: number) => {
            if (year === 3) {
              const results = scenarioResults[scenario];
              return formatCurrency(results.totalAllInSavings);
            }
            return "-";
          }
        },
        {
          field: "% of Pre-Ema Baseline Cost",
          getValue: (scenario: keyof ScenarioInputs, year: number) => {
            if (year === 3) {
              const results = scenarioResults[scenario];
              const totalBaselineCost = results.yearlyBreakdown.reduce((sum, year) => sum + year.preEMACost, 0);
              return formatPercentage(results.totalAllInSavings / totalBaselineCost);
            }
            return "-";
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
              <TableHead className="font-bold text-lg text-center">Base Case - Year 3</TableHead>
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
                    <TableCell className="text-center py-3">{row.getValue('base', 3)}</TableCell>
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