import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Bot, DollarSign, Zap, Target } from 'lucide-react';
import { EMACalculatorInputs } from '@/types/ema-calculator';

interface EMASectionProps {
  inputs: EMACalculatorInputs;
  onUpdateInput: (field: keyof EMACalculatorInputs, value: string | number) => void;
}

export const EMASection: React.FC<EMASectionProps> = ({ inputs, onUpdateInput }) => {
  return (
    <Card className="shadow-soft">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-finance-primary">
          <Bot className="h-5 w-5" />
          EMA Cost & Performance Assumptions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="emaPrice" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              EMA Price per Query ($)
            </Label>
            <Input
              id="emaPrice"
              type="number"
              value={inputs.emaPricePerQuery}
              onChange={(e) => onUpdateInput('emaPricePerQuery', parseFloat(e.target.value) || 0)}
              step="0.01"
              className="text-lg font-medium"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="partnerMargin">Partner Profit Margin on EMA (%)</Label>
            <Input
              id="partnerMargin"
              type="number"
              value={inputs.partnerProfitMargin * 100}
              onChange={(e) => onUpdateInput('partnerProfitMargin', (parseFloat(e.target.value) || 0) / 100)}
              step="1"
              className="text-lg font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="implementationCost">Implementation Cost ($M)</Label>
            <Input
              id="implementationCost"
              type="number"
              value={inputs.implementationCost / 1000}
              onChange={(e) => onUpdateInput('implementationCost', parseFloat(e.target.value) || 0)}
              step="0.1"
              className="text-lg font-medium"
            />
            <p className="text-sm text-muted-foreground">
              One-time cost applied in Year 1
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="growthRate" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Company Growth Rate (%)
            </Label>
            <Input
              id="growthRate"
              type="number"
              value={inputs.companyGrowthRate * 100}
              onChange={(e) => onUpdateInput('companyGrowthRate', (parseFloat(e.target.value) || 0) / 100)}
              step="1"
              className="text-lg font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="containmentRate">Final Year EMA Containment Rate (%)</Label>
            <Input
              id="containmentRate"
              type="number"
              value={Math.round(inputs.finalYearContainmentRate * 100)}
              onChange={(e) => onUpdateInput('finalYearContainmentRate', (parseFloat(e.target.value) || 0) / 100)}
              step="1"
              min="0"
              max="100"
              className="text-lg font-medium"
            />
            <p className="text-sm text-muted-foreground">
              % of queries handled by EMA in Year 3
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="productivityGain" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Year 1 Productivity Gain for Humans (%)
            </Label>
            <Input
              id="productivityGain"
              type="number"
              value={Math.round(inputs.year1ProductivityGain * 100)}
              onChange={(e) => onUpdateInput('year1ProductivityGain', (parseFloat(e.target.value) || 0) / 100)}
              step="1"
              min="0"
              max="100"
              className="text-lg font-medium"
            />
            <p className="text-sm text-muted-foreground">
              Human agent efficiency improvement
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};