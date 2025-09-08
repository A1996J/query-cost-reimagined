import React from 'react';
import { Card } from '@/components/ui/card';
import { ScenarioResults } from '@/types/ema-calculator';

interface SavingsStickersProps {
  scenarioResults: ScenarioResults;
}

export const SavingsStickers: React.FC<SavingsStickersProps> = ({ scenarioResults }) => {
  const formatCurrency = (value: number) => {
    return `$${(value / 1000000).toFixed(1)}M`;
  };

  // Calculate 3-year totals
  const baseAllIn = scenarioResults.base.totalAllInSavings;
  const bullAllIn = scenarioResults.bull.totalAllInSavings;
  
  const baseDirect = scenarioResults.base.totalSavings;
  const bullDirect = scenarioResults.bull.totalSavings;
  
  const baseAdditional = scenarioResults.base.totalAdditionalSavings;
  const bullAdditional = scenarioResults.bull.totalAdditionalSavings;

  const stickers = [
    {
      label: "All-In Savings Over 3 Years",
      sublabel: "(Post-Implementation Cost)",
      value: `${formatCurrency(baseAllIn)} - ${formatCurrency(bullAllIn)}`,
      className: "bg-finance-gradient text-white"
    },
    {
      label: "Direct Savings from Replacing Human Support with Ema",
      sublabel: "Over 3 years, after implementation cost",
      value: `${formatCurrency(baseDirect)} - ${formatCurrency(bullDirect)}`,
      className: "bg-finance-gradient text-white"
    },
    {
      label: "Additional Savings from Better FCR, Compliance, and Upselling",
      sublabel: "Over 3 years",
      value: `${formatCurrency(baseAdditional)} - ${formatCurrency(bullAdditional)}`,
      className: "bg-finance-gradient text-white"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stickers.map((sticker, index) => (
        <Card key={index} className={`p-6 text-center shadow-soft ${sticker.className}`}>
          <h3 className="text-lg font-semibold mb-1">
            {sticker.label}
          </h3>
          <p className="text-sm opacity-90 mb-4">
            {sticker.sublabel}
          </p>
          <div className="text-3xl font-bold">
            {sticker.value}
          </div>
        </Card>
      ))}
    </div>
  );
};