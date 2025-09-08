import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Users, Clock, TrendingUp } from 'lucide-react';
import { EMACalculatorInputs } from '@/types/ema-calculator';

interface HumanAgentSectionProps {
  inputs: EMACalculatorInputs;
  onUpdateInput: (field: keyof EMACalculatorInputs, value: string | number) => void;
}

export const HumanAgentSection: React.FC<HumanAgentSectionProps> = ({ inputs, onUpdateInput }) => {
  return (
    <Card className="shadow-soft">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-finance-primary">
          <Users className="h-5 w-5" />
          Human Agent Cost Assumptions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="salary">Average Annual Salary per Rep ({inputs.currency})</Label>
            <Input
              id="salary"
              type="number"
              value={inputs.averageAnnualSalary}
              onChange={(e) => onUpdateInput('averageAnnualSalary', parseFloat(e.target.value) || 0)}
              className="text-lg font-medium"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="multiplier">Benefits & Management Multiplier</Label>
            <Input
              id="multiplier"
              type="number"
              value={inputs.benefitsMultiplier}
              onChange={(e) => onUpdateInput('benefitsMultiplier', parseFloat(e.target.value) || 0)}
              step="0.1"
              className="text-lg font-medium"
            />
            <p className="text-sm text-muted-foreground">
              Typical range: 1.3 - 1.5x base salary
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="queryVolume" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Monthly Query Volume (Millions)
            </Label>
            <Input
              id="queryVolume"
              type="number"
              value={inputs.monthlyQueryVolume}
              onChange={(e) => onUpdateInput('monthlyQueryVolume', parseFloat(e.target.value) || 0)}
              step="0.1"
              className="text-lg font-medium"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="aht" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Average Handling Time (Minutes)
            </Label>
            <Input
              id="aht"
              type="number"
              value={inputs.averageHandlingTime}
              onChange={(e) => onUpdateInput('averageHandlingTime', parseFloat(e.target.value) || 0)}
              step="0.5"
              className="text-lg font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="capacityBuffer">Capacity Buffer (%)</Label>
            <Input
              id="capacityBuffer"
              type="number"
              value={inputs.capacityBuffer * 100}
              onChange={(e) => onUpdateInput('capacityBuffer', (parseFloat(e.target.value) || 0) / 100)}
              step="1"
              className="text-lg font-medium"
            />
            <p className="text-sm text-muted-foreground">
              Recommended: 15% for operational buffer
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="partnerOverhead">Partner Overhead & Profit Multiplier</Label>
            <Input
              id="partnerOverhead"
              type="number"
              value={inputs.partnerOverheadMultiplier}
              onChange={(e) => onUpdateInput('partnerOverheadMultiplier', parseFloat(e.target.value) || 0)}
              step="0.1"
              className="text-lg font-medium"
            />
            <p className="text-sm text-muted-foreground">
              Typical range: 1.2 - 1.4x internal cost
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};