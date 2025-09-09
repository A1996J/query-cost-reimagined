import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText } from 'lucide-react';
import { ScenarioResults, ScenarioInputs } from '@/types/ema-calculator';

interface ExecutiveSummaryPart1Props {
  scenarioResults: ScenarioResults;
  scenarios: ScenarioInputs;
}

export const ExecutiveSummaryPart1: React.FC<ExecutiveSummaryPart1Props> = ({ scenarioResults, scenarios }) => {
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
    const inputs = scenarios[scenario];
    const growthFactor = Math.pow(1 + inputs.companyGrowthRate, year - 1);
    return inputs.finalYearContainmentRate * (year / 3) * growthFactor;
  };

  const getTotalPreEmaCost = (scenario: keyof ScenarioInputs, year: number) => {
    const inputs = scenarios[scenario];
    const baseQueries = inputs.monthlyQueryVolume * 12 * 1000000;
    const queriesWithGrowth = baseQueries * Math.pow(1 + inputs.companyGrowthRate, year - 1);
    return queriesWithGrowth * getPreEmaCostPerQuery(scenario);
  };

  const getReductionInHandlingTime = (scenario: keyof ScenarioInputs, year: number) => {
    const inputs = scenarios[scenario];
    let productivityGain = inputs.year1ProductivityGain;
    if (year >= 2) {
      productivityGain = inputs.year1ProductivityGain * (4/3);
    }
    return productivityGain;
  };

  const sections = [
    {
      title: "Query Volume and Growth",
      rows: [
        {
          name: "Monthly Query Volume (millions)",
          getValue: (scenario: keyof ScenarioInputs, year: number) => scenarios[scenario].monthlyQueryVolume.toFixed(1)
        },
        {
          name: "Annual Company Growth Rate",
          getValue: (scenario: keyof ScenarioInputs) => formatPercentage(scenarios[scenario].companyGrowthRate)
        },
        {
          name: "Total Pre-EMA Cost",
          getValue: (scenario: keyof ScenarioInputs, year: number) => formatCurrency(getTotalPreEmaCost(scenario, year))
        }
      ]
    },
    {
      title: "Cost Structure",
      rows: [
        {
          name: "Pre-EMA Cost per Query",
          getValue: (scenario: keyof ScenarioInputs) => formatNumber(getPreEmaCostPerQuery(scenario), 4)
        },
        {
          name: "EMA Cost per Query",
          getValue: (scenario: keyof ScenarioInputs) => formatNumber(getEmaCostPerQuery(scenario), 4)
        },
        {
          name: "Human Query Cost (with EMA)",
          getValue: (scenario: keyof ScenarioInputs, year: number) => formatNumber(getHumanQueryCostWithEma(scenario, year), 4)
        }
      ]
    },
    {
      title: "EMA Performance",
      rows: [
        {
          name: "EMA Containment Rate",
          getValue: (scenario: keyof ScenarioInputs, year: number) => formatPercentage(getEmaContainmentRate(scenario, year))
        },
        {
          name: "Reduction in Human Handling Time",
          getValue: (scenario: keyof ScenarioInputs, year: number) => formatPercentage(getReductionInHandlingTime(scenario, year))
        }
      ]
    }
  ];

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-finance-primary">
          <FileText className="h-5 w-5" />
          Executive Summary (Part 1)
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