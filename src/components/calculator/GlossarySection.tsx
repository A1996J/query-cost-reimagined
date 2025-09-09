import React from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const GlossarySection: React.FC = () => {
  const glossaryTerms = [
    {
      term: "Partner Country",
      description: "Country where the partner's team or operations are located"
    },
    {
      term: "FX Rate",
      description: "Conversion rate from partner's currency to $"
    },
    {
      term: "Average Annual Salary per Rep",
      description: "Average yearly wage for each support rep (in local currency)"
    },
    {
      term: "Monthly Queries",
      description: "Total volume of queries received each month by all reps combined"
    },
    {
      term: "Average Handling Time",
      description: "Average time (in minutes) to resolve one query"
    },
    {
      term: "Rep Capacity Buffer",
      description: "% headroom to handle leaves, holidays, and peak demand"
    },
    {
      term: "Implementation Cost",
      description: "One-time implementation fee for Ema"
    },
    {
      term: "Client Growth %",
      description: "Expected annual increase in query volume"
    },
    {
      term: "Final Year Ema-Handled Queries (%)",
      description: "% of queries Ema will handle by Year 3"
    },
    {
      term: "Year 1 Productivity Gain",
      description: "Human efficiency boost in Year 1 due to Ema"
    },
    {
      term: "Duplicate Queries %",
      description: "% of calls that are repeated due to poor FCR"
    },
    {
      term: "Compliance Cost Reduction",
      description: "Reduction in regulatory compliance overheads"
    },
    {
      term: "Revenue Defended and Grown %",
      description: "Revenue protected or upsold via better CX"
    },
    {
      term: "Revenue Gained from CX",
      description: "Total revenue uplift from upsell and churn reduction"
    }
  ];

  const otherAssumptions = [
    "Working minutes per year per rep = 124,800 minutes (250 days × 8 hours × 60 minutes)",
    "Productivity gain ramp: Year 2 = Year 1 × 4/3, Year 3 = Year 2 (constant)",
    "Ema containment ramp: Year 1 = ⅓ of final input, Year 2 = ⅔ of final, Year 3 = Final value",
    "Bull Case logic: Containment Rate = min(Base × 1.25, 90%), Compliance Reduction = Base × 3, Upsell % = Base × 1.5"
  ];

  return (
    <div className="space-y-8 mt-12">
      {/* Glossary */}
      <Card className="p-6 shadow-soft">
        <h2 className="text-2xl font-bold text-finance-primary mb-4">Glossary: Key Assumptions</h2>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold text-lg w-1/3">Term</TableHead>
                <TableHead className="font-bold text-lg">Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {glossaryTerms.map((item, index) => (
                <TableRow key={index} className="hover:bg-muted/50">
                  <TableCell className="font-medium py-3">{item.term}</TableCell>
                  <TableCell className="py-3">{item.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Other Assumptions */}
      <Card className="p-6 shadow-soft">
        <h2 className="text-2xl font-bold text-finance-primary mb-4">Other Assumptions Used in Calculations</h2>
        <ul className="space-y-3">
          {otherAssumptions.map((assumption, index) => (
            <li key={index} className="flex items-start">
              <span className="w-2 h-2 bg-finance-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span className="text-base">{assumption}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};
