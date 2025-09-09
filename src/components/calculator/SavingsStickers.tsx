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

  const mainSticker = {
    label: "Your Expected Savings",
    sublabel: "Over 3 Years after implementation cost",
    value: `${formatCurrency(baseAllIn)} - ${formatCurrency(bullAllIn)}`,
    className: "bg-finance-gradient text-white"
  };

  const subStickers = [
    {
      label: "Direct savings Ema-resolved Queries",
      sublabel: "Over 3 years after implementation cost",
      value: `${formatCurrency(baseDirect)} - ${formatCurrency(bullDirect)}`,
      className: "bg-finance-subtle text-finance-primary border border-finance-primary/20"
    },
    {
      label: "Additional savings from reduced duplicate calls and compliance costs",
      sublabel: "Over 3 years",
      value: `${formatCurrency(baseAdditional)} - ${formatCurrency(bullAdditional)}`,
      className: "bg-finance-subtle text-finance-primary border border-finance-primary/20"
    }
  ];

  return (
    <div className="space-y-6 mb-8">
      {/* Main savings box - large, full width */}
      <Card className={`p-8 text-center shadow-soft ${mainSticker.className}`}>
        <h3 className="text-2xl font-semibold mb-2">
          {mainSticker.label}
        </h3>
        <p className="text-base opacity-90 mb-6">
          {mainSticker.sublabel}
        </p>
        <div className="text-4xl font-bold">
          {mainSticker.value}
        </div>
      </Card>
      
      {/* Two smaller boxes below */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subStickers.map((sticker, index) => (
          <Card key={index} className={`p-6 text-center shadow-soft ${sticker.className}`}>
            <h3 className="text-lg font-semibold mb-1">
              {sticker.label}
            </h3>
            <p className="text-sm opacity-80 mb-4">
              {sticker.sublabel}
            </p>
            <div className="text-2xl font-bold">
              {sticker.value}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};