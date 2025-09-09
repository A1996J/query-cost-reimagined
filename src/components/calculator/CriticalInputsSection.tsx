import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Globe, DollarSign, TrendingUp } from 'lucide-react';
import { EMACalculatorInputs } from '@/types/ema-calculator';

interface CriticalInputsSectionProps {
  inputs: EMACalculatorInputs;
  onUpdateInput: (field: keyof EMACalculatorInputs, value: string | number) => void;
  fxRateUserEdited: boolean;
  onFxRateUserEdited: (edited: boolean) => void;
}

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
  INR: 83.12,
  CAD: 1.25,
  AUD: 1.35,
  JPY: 110.0,
  CNY: 6.45,
  SGD: 1.35,
};

export const CriticalInputsSection: React.FC<CriticalInputsSectionProps> = ({ 
  inputs, 
  onUpdateInput, 
  fxRateUserEdited,
  onFxRateUserEdited 
}) => {
  const handleCountryChange = (countryCode: string) => {
    const country = countries.find(c => c.code === countryCode);
    if (country) {
      onUpdateInput('country', countryCode);
      onUpdateInput('currency', country.currency);
      
      // Update FX rate only if user hasn't manually edited it
      if (!fxRateUserEdited) {
        const rate = mockFXRates[country.currency] || 1;
        onUpdateInput('fxRate', rate);
      }
    }
  };

  const handleFxRateChange = (value: string) => {
    onFxRateUserEdited(true);
    onUpdateInput('fxRate', parseFloat(value) || 1);
  };

  // Check if required fields are filled - removed averageAnnualSalary and averageHandlingTime since they're in Detailed
  const missingFields = [];
  if (!inputs.country) missingFields.push('Country');
  if (!inputs.monthlyQueryVolume) missingFields.push('Monthly Queries');
  if (!inputs.companyGrowthRate) missingFields.push('Company Growth');

  return (
    <Card className="shadow-soft">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-finance-primary">
          <AlertTriangle className="h-5 w-5" />
          Critical Inputs — Required to Begin Calculation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {missingFields.length > 0 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Please fill in all required fields: {missingFields.join(', ')}
            </AlertDescription>
          </Alert>
        )}

        {/* Display Partner Country (read-only, set from onboarding) */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Partner Country
          </Label>
          <div className="p-3 bg-muted rounded-md">
            <span className="text-lg font-medium">
              {countries.find(c => c.code === inputs.country)?.name || 'Not selected'}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Set during onboarding. Country where the partner's team or operation is located.
          </p>
        </div>

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

        {/* Monthly Queries - Now in thousands */}
        <div className="space-y-2">
          <Label htmlFor="queryVolume" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Monthly Queries (Thousands)
          </Label>
          <Input
            id="queryVolume"
            type="number"
            value={inputs.monthlyQueryVolume || ''}
            onChange={(e) => onUpdateInput('monthlyQueryVolume', parseFloat(e.target.value) || 0)}
            step="1"
            className="text-lg font-medium"
            placeholder="Enter monthly volume in thousands"
          />
          <p className="text-sm text-muted-foreground">
            Total customer service queries handled per month (in thousands)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Implementation Cost Multiplier */}
          <div className="space-y-2">
            <Label htmlFor="implementationCostMultiplier" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Implementation Cost Multiplier ($K per Rep)
            </Label>
            <Input
              id="implementationCostMultiplier"
              type="number"
              value={inputs.implementationCostMultiplier || ''}
              onChange={(e) => onUpdateInput('implementationCostMultiplier', parseFloat(e.target.value) || 0)}
              step="0.1"
              className="text-lg font-medium"
              placeholder="Enter cost per rep in thousands"
            />
            <p className="text-sm text-muted-foreground">
              Cost per rep for implementation (default: $1K per rep)
            </p>
          </div>

          {/* Implementation Cost - Calculated */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Implementation Cost ($K)
            </Label>
            <div className="p-3 bg-muted rounded-md">
              <span className="text-lg font-medium">
                {(inputs.implementationCost || 0).toLocaleString()} $K
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Auto-calculated: Total Reps × $K Multiplier (applied in Year 1)
            </p>
          </div>
        </div>

        {/* Company Growth */}
        <div className="space-y-2">
          <Label htmlFor="growthRate" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Client Growth (%)
          </Label>
          <Input
            id="growthRate"
            type="number"
            value={inputs.companyGrowthRate ? inputs.companyGrowthRate * 100 : ''}
            onChange={(e) => onUpdateInput('companyGrowthRate', (parseFloat(e.target.value) || 0) / 100)}
            step="1"
            className="text-lg font-medium"
            placeholder="Enter growth percentage"
          />
          <p className="text-sm text-muted-foreground">
            Annual growth rate for the client's business over the next two years.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};