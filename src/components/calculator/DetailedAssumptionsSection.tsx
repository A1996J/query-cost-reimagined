import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Settings, ChevronDown, ChevronUp, Target, Zap, TrendingUp, DollarSign, Globe } from 'lucide-react';
import { EMACalculatorInputs } from '@/types/ema-calculator';

const WORKING_MINUTES_PER_YEAR = 124800; // 250 workdays × 8 hours × 60 minutes

// Countries data for critical inputs
const countries = [
  { code: 'US', name: 'United States', currency: 'USD' },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP' },
  { code: 'IN', name: 'India', currency: 'INR' },
  { code: 'CA', name: 'Canada', currency: 'CAD' },
  { code: 'AU', name: 'Australia', currency: 'AUD' },
  { code: 'DE', name: 'Germany', currency: 'EUR' },
  { code: 'FR', name: 'France', currency: 'EUR' },
  { code: 'JP', name: 'Japan', currency: 'JPY' },
  { code: 'CN', name: 'China', currency: 'CNY' },
  { code: 'SG', name: 'Singapore', currency: 'SGD' },
];

// Mock FX rates - in production, this would come from an API
const mockFXRates: { [key: string]: number } = {
  USD: 1,
  EUR: 0.85,
  GBP: 0.73,
  INR: 86.0,
  CAD: 1.25,
  AUD: 1.35,
  JPY: 110.0,
  CNY: 6.45,
  SGD: 1.35,
};

interface DetailedAssumptionsSectionProps {
  inputs: EMACalculatorInputs;
  onUpdateInput: (field: keyof EMACalculatorInputs, value: string | number) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  industry: string;
  fxRateUserEdited: boolean;
  onFxRateUserEdited: (edited: boolean) => void;
  implementationCostUserEdited?: boolean;
  onImplementationCostUserEdited?: (edited: boolean) => void;
}

export const DetailedAssumptionsSection: React.FC<DetailedAssumptionsSectionProps> = ({ 
  inputs, 
  onUpdateInput,
  isOpen,
  onOpenChange,
  industry,
  fxRateUserEdited,
  onFxRateUserEdited,
  implementationCostUserEdited = false,
  onImplementationCostUserEdited = () => {}
}) => {
  const handleFxRateChange = (value: string) => {
    onFxRateUserEdited(true);
    onUpdateInput('fxRate', parseFloat(value) || 1);
  };

  const handleCountryChange = (countryCode: string) => {
    const country = countries.find(c => c.code === countryCode);
    if (country) {
      onUpdateInput('country', countryCode);
      onUpdateInput('currency', country.currency);
      // Reset FX rate editing flag to allow auto-update for new currency
      onFxRateUserEdited(false);
    }
  };

  const handleImplementationCostChange = (value: string) => {
    onImplementationCostUserEdited(true);
    onUpdateInput('implementationCost', (parseFloat(value) || 0) / 1000);
  };

  // Auto-populate fields based on conditions
  useEffect(() => {
    // Auto-populate FX rate when country changes (if not user edited)
    if (inputs.country && inputs.currency && !fxRateUserEdited) {
      const rate = mockFXRates[inputs.currency] || 1;
      onUpdateInput('fxRate', rate);
    }
  }, [inputs.country, inputs.currency, fxRateUserEdited, onUpdateInput]);

  useEffect(() => {
    // Auto-populate salary for India
    if (inputs.country === 'IN' && !inputs.averageAnnualSalary) {
      onUpdateInput('averageAnnualSalary', 450000);
    }
  }, [inputs.country, inputs.averageAnnualSalary, onUpdateInput]);

  useEffect(() => {
    // Auto-populate handling time for Banking and Financial Services
    if (industry === 'Banking and Financial Services' && !inputs.averageHandlingTime) {
      onUpdateInput('averageHandlingTime', 10);
    }
  }, [industry, inputs.averageHandlingTime, onUpdateInput]);

  useEffect(() => {
    // Auto-populate implementation cost based on totalReps calculation (only if not user edited)
    if (inputs.monthlyQueryVolume && inputs.averageHandlingTime && inputs.capacityBuffer && !implementationCostUserEdited) {
      const annualQueries = inputs.monthlyQueryVolume * 12;
      const repsNeeded100 = (annualQueries * 1000000 * inputs.averageHandlingTime) / WORKING_MINUTES_PER_YEAR;
      const totalReps = repsNeeded100 * (1 + inputs.capacityBuffer);
      const implementationCostInMillions = (totalReps * 1000) / 1000000; // $1000 per rep, convert to millions for storage
      
      onUpdateInput('implementationCost', implementationCostInMillions);
    }
  }, [inputs.monthlyQueryVolume, inputs.averageHandlingTime, inputs.capacityBuffer, implementationCostUserEdited, onUpdateInput]);

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
            {/* Critical Business Inputs Section */}
            <div className="border-b pb-6 mb-6">
              <h4 className="text-lg font-semibold mb-4 text-finance-primary">Critical Business Inputs</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Key business parameters that drive the calculation. These can be edited independently per scenario.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Partner Country */}
                <div className="space-y-2">
                  <Label htmlFor="country" className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Partner Country
                  </Label>
                  <Select value={inputs.country} onValueChange={handleCountryChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select partner country" />
                    </SelectTrigger>
                    <SelectContent className="bg-card">
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Country where the client's concerned team or operation is located
                  </p>
                </div>

                {/* Monthly Query Volume */}
                <div className="space-y-2">
                  <Label htmlFor="monthlyQueries" className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Monthly Queries (Millions)
                  </Label>
                  <Input
                    id="monthlyQueries"
                    type="number"
                    value={inputs.monthlyQueryVolume || ''}
                    onChange={(e) => onUpdateInput('monthlyQueryVolume', parseFloat(e.target.value) || 0)}
                    step="0.1"
                    className="text-lg font-medium"
                    placeholder="Enter monthly volume"
                  />
                  <p className="text-sm text-muted-foreground">
                    Total customer service queries handled per month by client
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* Client Growth Rate */}
                <div className="space-y-2">
                  <Label htmlFor="growthRate" className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Client Growth (%)
                  </Label>
                  <Input
                    id="growthRate"
                    type="number"
                    value={inputs.companyGrowthRate ? Math.round(inputs.companyGrowthRate * 100) : ''}
                    onChange={(e) => onUpdateInput('companyGrowthRate', (parseFloat(e.target.value) || 0) / 100)}
                    step="1"
                    className="text-lg font-medium"
                    placeholder="Enter growth percentage"
                  />
                  <p className="text-sm text-muted-foreground">
                    Annual growth rate for the client's business over the next two years
                  </p>
                </div>
              </div>
            </div>

            {/* Core Business Parameters */}
            <div className="border-b pb-6 mb-6">
              <h4 className="text-lg font-semibold mb-4 text-finance-primary">Core Business Parameters</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* FX Rate */}
                <div className="space-y-2">
                  <Label htmlFor="fxRate" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    FX Rate to $
                  </Label>
                  <Input
                    id="fxRate"
                    type="number"
                    value={inputs.fxRate || ''}
                    onChange={(e) => handleFxRateChange(e.target.value)}
                    step="0.0001"
                    className="text-lg font-medium"
                    placeholder="Enter FX rate"
                  />
                  <p className="text-sm text-muted-foreground">
                    Exchange rate for converting {inputs.currency} to $ (auto-filled but editable)
                  </p>
                </div>

                {/* Average Annual Salary */}
                <div className="space-y-2">
                  <Label htmlFor="salary" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Average Annual Salary per Rep ({inputs.currency})
                  </Label>
                  <Input
                    id="salary"
                    type="number"
                    value={inputs.averageAnnualSalary || ''}
                    onChange={(e) => onUpdateInput('averageAnnualSalary', parseFloat(e.target.value) || 0)}
                    className="text-lg font-medium"
                    placeholder="Enter annual salary"
                  />
                  <p className="text-sm text-muted-foreground">
                    Base salary before benefits and management overhead {inputs.country === 'IN' ? '(₹4.5 lakh pre-filled for India)' : ''}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* Average Handling Time */}
                <div className="space-y-2">
                  <Label htmlFor="aht" className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Average Handling Time (Minutes)
                  </Label>
                  <Input
                    id="aht"
                    type="number"
                    value={inputs.averageHandlingTime || ''}
                    onChange={(e) => onUpdateInput('averageHandlingTime', parseFloat(e.target.value) || 0)}
                    step="0.5"
                    className="text-lg font-medium"
                    placeholder="Enter handling time"
                  />
                  <p className="text-sm text-muted-foreground">
                    Average time per customer interaction including wrap-up {industry === 'Banking and Financial Services' ? '(10 min pre-filled for Financial Services)' : ''}
                  </p>
                </div>

                {/* Implementation Cost */}
                <div className="space-y-2">
                  <Label htmlFor="implementationCost" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Implementation Cost ($K)
                  </Label>
                  <Input
                    id="implementationCost"
                    type="number"
                    value={inputs.implementationCost ? Math.round(inputs.implementationCost * 1000) : ''}
                    onChange={(e) => handleImplementationCostChange(e.target.value)}
                    step="1"
                    className="text-lg font-medium"
                    placeholder="Enter cost in thousands"
                  />
                  <p className="text-sm text-muted-foreground">
                    One-time setup and implementation cost (pre-filled as Total Reps × $1K)
                  </p>
                </div>
              </div>
            </div>

            {/* Original detailed assumptions */}
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
                  Final Year Ema-Handled Queries (%)
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
                Y1 Productivity Gain (%) for Human Agents
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

            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};