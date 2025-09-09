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

export const CriticalInputsSection: React.FC<CriticalInputsSectionProps> = ({ 
  inputs, 
  onUpdateInput
}) => {
  const handleCountryChange = (countryCode: string) => {
    const country = countries.find(c => c.code === countryCode);
    if (country) {
      onUpdateInput('country', countryCode);
      onUpdateInput('currency', country.currency);
    }
  };

  // Check if required fields are filled
  const missingFields = [];
  if (!inputs.country) missingFields.push('Partner Country');
  if (!inputs.monthlyQueryVolume) missingFields.push('Monthly Queries');
  if (inputs.companyGrowthRate === undefined || inputs.companyGrowthRate === null) missingFields.push('Client Growth');

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