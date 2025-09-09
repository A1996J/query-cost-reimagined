import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Plus, Shield, Repeat } from 'lucide-react';
import { EMACalculatorInputs } from '@/types/ema-calculator';

interface AdditionalSavingsSectionProps {
  inputs: EMACalculatorInputs;
  onUpdateInput: (field: keyof EMACalculatorInputs, value: string | number) => void;
}

export const AdditionalSavingsSection: React.FC<AdditionalSavingsSectionProps> = ({ inputs, onUpdateInput }) => {
  return (
    <Card className="shadow-soft">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-finance-primary">
          <Plus className="h-5 w-5" />
          Additional Potential Savings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="duplicateQueries" className="flex items-center gap-2">
              <Repeat className="h-4 w-4" />
              Duplicate Queries (%)
            </Label>
            <Input
              id="duplicateQueries"
              type="number"
              value={inputs.duplicateQueriesPercent * 100}
              onChange={(e) => onUpdateInput('duplicateQueriesPercent', (parseFloat(e.target.value) || 0) / 100)}
              step="1"
              className="text-lg font-medium"
            />
            <p className="text-sm text-muted-foreground">
              % of queries today that are duplicates
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="complianceCost" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Annual Compliance Cost Reduction ($K)
            </Label>
            <Input
              id="complianceCost"
              type="number"
              value={inputs.annualComplianceCostReduction}
              onChange={(e) => onUpdateInput('annualComplianceCostReduction', parseFloat(e.target.value) || 0)}
              step="0.1"
              className="text-lg font-medium"
            />
          </div>
        </div>

      </CardContent>
    </Card>
  );
};