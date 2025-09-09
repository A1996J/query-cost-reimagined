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

  // Check if required fields are filled
  const missingFields = [];
  if (!inputs.country) missingFields.push('Country');
  if (!inputs.averageAnnualSalary) missingFields.push('Average Annual Salary');
  if (!inputs.monthlyQueryVolume) missingFields.push('Monthly Queries');
  if (!inputs.averageHandlingTime) missingFields.push('Average Handling Time');
  if (!inputs.implementationCost) missingFields.push('Implementation Cost');
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

        {/* Country Selection */}
        <div className="space-y-2">
          <Label htmlFor="country" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Partner Country
          </Label>
          <Select value={inputs.country || ''} onValueChange={handleCountryChange}>
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
            Country where the partner's team or operation is located.
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              Base salary before benefits and management overhead
            </p>
          </div>

          {/* Monthly Queries */}
          <div className="space-y-2">
            <Label htmlFor="queryVolume" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Monthly Queries (Millions)
            </Label>
            <Input
              id="queryVolume"
              type="number"
              value={inputs.monthlyQueryVolume || ''}
              onChange={(e) => onUpdateInput('monthlyQueryVolume', parseFloat(e.target.value) || 0)}
              step="0.1"
              className="text-lg font-medium"
              placeholder="Enter monthly volume"
            />
            <p className="text-sm text-muted-foreground">
              Total customer service queries handled per month
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              Average time per customer interaction including wrap-up
            </p>
          </div>

          {/* Implementation Cost */}
          <div className="space-y-2">
            <Label htmlFor="implementationCost" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Implementation Cost ($M)
            </Label>
            <Input
              id="implementationCost"
              type="number"
              value={inputs.implementationCost || ''}
              onChange={(e) => onUpdateInput('implementationCost', parseFloat(e.target.value) || 0)}
              step="0.1"
              className="text-lg font-medium"
              placeholder="Enter cost in millions"
            />
            <p className="text-sm text-muted-foreground">
              One-time setup and implementation cost applied in Year 1
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