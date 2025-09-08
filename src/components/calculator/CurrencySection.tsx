import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Globe, DollarSign } from 'lucide-react';
import { EMACalculatorInputs } from '@/types/ema-calculator';

interface CurrencySectionProps {
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

const currencies = ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD', 'JPY', 'CNY', 'SGD'];

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

export const CurrencySection: React.FC<CurrencySectionProps> = ({ inputs, onUpdateInput }) => {
  const [isLoadingFX, setIsLoadingFX] = useState(false);

  // Update FX rate when currency changes
  useEffect(() => {
    const fetchFXRate = async () => {
      setIsLoadingFX(true);
      try {
        // In production, replace with actual FX API call
        // const response = await fetch(`https://api.exchangerate-api.com/v4/latest/USD`);
        // const data = await response.json();
        const rate = mockFXRates[inputs.currency] || 1;
        onUpdateInput('fxRate', rate);
      } catch (error) {
        console.error('Failed to fetch FX rate:', error);
        onUpdateInput('fxRate', 1);
      } finally {
        setIsLoadingFX(false);
      }
    };

    fetchFXRate();
  }, [inputs.currency, onUpdateInput]);

  const handleCountryChange = (countryCode: string) => {
    const country = countries.find(c => c.code === countryCode);
    if (country) {
      onUpdateInput('country', countryCode);
      onUpdateInput('currency', country.currency);
    }
  };

  return (
    <Card className="shadow-soft">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-finance-primary">
          <Globe className="h-5 w-5" />
          Currency & Country Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Select value={inputs.country} onValueChange={handleCountryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent className="bg-card">
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select value={inputs.currency} onValueChange={(value) => onUpdateInput('currency', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent className="bg-card">
                {currencies.map((currency) => (
                  <SelectItem key={currency} value={currency}>
                    {currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fxRate" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            FX Rate to USD {isLoadingFX && '(Loading...)'}
          </Label>
          <Input
            id="fxRate"
            type="number"
            value={inputs.fxRate}
            onChange={(e) => onUpdateInput('fxRate', parseFloat(e.target.value) || 1)}
            step="0.01"
            className="bg-muted/50"
            readOnly={isLoadingFX}
          />
          <p className="text-sm text-muted-foreground">
            1 {inputs.currency} = {inputs.fxRate.toFixed(4)} USD
          </p>
        </div>
      </CardContent>
    </Card>
  );
};