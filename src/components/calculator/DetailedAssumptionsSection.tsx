import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Settings, ChevronDown, ChevronUp, Target, Zap, TrendingUp } from 'lucide-react';
import { EMACalculatorInputs } from '@/types/ema-calculator';

interface DetailedAssumptionsSectionProps {
  inputs: EMACalculatorInputs;
  onUpdateInput: (field: keyof EMACalculatorInputs, value: string | number) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DetailedAssumptionsSection: React.FC<DetailedAssumptionsSectionProps> = ({ 
  inputs, 
  onUpdateInput,
  isOpen,
  onOpenChange
}) => {
  return (
    <Card className="shadow-soft">
      <Collapsible open={isOpen} onOpenChange={onOpenChange}>
        <CollapsibleTrigger asChild>
          <CardHeader className="pb-4 cursor-pointer hover:bg-muted/50 transition-colors">
            <CardTitle className="flex items-center justify-between text-finance-primary">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Detailed Assumptions — Pre-Populated and Editable
              </div>
              <Button variant="ghost" size="sm">
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Capacity Buffer */}
              <div className="space-y-2">
                <Label htmlFor="capacityBuffer" className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Rep Capacity Buffer (%)
                </Label>
                <Input
                  id="capacityBuffer"
                  type="number"
                  value={inputs.capacityBuffer * 100}
                  onChange={(e) => onUpdateInput('capacityBuffer', (parseFloat(e.target.value) || 0) / 100)}
                  step="1"
                  className="text-lg font-medium"
                />
                <p className="text-sm text-muted-foreground">
                  Buffer to account for leaves, holidays, or peak seasonal demand.
                </p>
              </div>

              {/* Final Year Ema Containment Rate */}
              <div className="space-y-2">
                <Label htmlFor="containmentRate" className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Final Year Ema Containment Rate (%)
                </Label>
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
                  Percentage of queries Ema will handle by Year 3 (mature state)
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="productivityGain" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Y1 Productivity Gain (Human Agents)
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
                Percentage efficiency gain in human agent productivity due to Ema support.
              </p>
            </div>

            {/* Additional Savings */}
            <div className="border-t pt-6 mt-6">
              <h4 className="text-lg font-semibold mb-4 text-finance-primary">Additional Savings Inputs</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="duplicateQueries" className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
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
                    Queries for which customers have to call back more than once (avg assumed = 2 calls).
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="complianceCost" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Annual Compliance Cost Reduction ($M)
                  </Label>
                  <Input
                    id="complianceCost"
                    type="number"
                    value={inputs.annualComplianceCostReduction}
                    onChange={(e) => onUpdateInput('annualComplianceCostReduction', parseFloat(e.target.value) || 0)}
                    step="0.1"
                    className="text-lg font-medium"
                  />
                  <p className="text-sm text-muted-foreground">
                    Reduction in compliance cost from responses aligned with regulatory standards.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="customerExperience" className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Customer Experience as % of Revenue (%)
                  </Label>
                  <Input
                    id="customerExperience"
                    type="number"
                    value={inputs.customerExperienceAsPercentOfRevenue * 100}
                    onChange={(e) => onUpdateInput('customerExperienceAsPercentOfRevenue', (parseFloat(e.target.value) || 0) / 100)}
                    step="0.1"
                    className="text-lg font-medium"
                  />
                  <p className="text-sm text-muted-foreground">
                    Used to estimate total company revenue for benefit calculations
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="upsellPercent" className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Revenue Defended and Grown (%)
                  </Label>
                  <Input
                    id="upsellPercent"
                    type="number"
                    value={inputs.upsellPercentOfRevenue * 100}
                    onChange={(e) => onUpdateInput('upsellPercentOfRevenue', (parseFloat(e.target.value) || 0) / 100)}
                    step="0.1"
                    className="text-lg font-medium"
                  />
                  <p className="text-sm text-muted-foreground">
                    Percent of revenue uplifted or retained due to better CX via Ema.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};