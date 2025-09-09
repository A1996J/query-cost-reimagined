import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, Building2, Globe, TrendingUp } from 'lucide-react';

interface OnboardingProps {
  onComplete: (companyName: string, industry: string, useCase: string, criticalInputs: {
    country: string;
    monthlyQueryVolume: number;
    companyGrowthRate: number;
  }) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [industry, setIndustry] = useState('');
  const [useCase, setUseCase] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [country, setCountry] = useState('');
  const [monthlyQueryVolume, setMonthlyQueryVolume] = useState(0);
  const [companyGrowthRate, setCompanyGrowthRate] = useState(0);
  const [showIndustryMessage, setShowIndustryMessage] = useState(false);
  const [showUseCaseMessage, setShowUseCaseMessage] = useState(false);

  const industries = [
    'Consumer Tech',
    'Banking and Financial Services',
    'Industrials',
    'Telecom',
    'Healthcare',
    'Retail',
    'Other'
  ];

  const useCases = [
    'Customer Experience',
    'Sales and Marketing',
    'Recruitment'
  ];

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

  const handleIndustryNext = () => {
    if (industry === 'Banking and Financial Services') {
      setStep(2);
      setShowIndustryMessage(false);
    } else {
      setShowIndustryMessage(true);
    }
  };

  const handleUseCaseNext = () => {
    if (useCase === 'Customer Experience') {
      setStep(3);
      setShowUseCaseMessage(false);
    } else {
      setShowUseCaseMessage(true);
    }
  };

  const handleCompanyNameNext = () => {
    if (companyName.trim()) {
      setStep(4);
    }
  };

  const handleComplete = () => {
    if (country && monthlyQueryVolume > 0 && companyGrowthRate >= 0) {
      onComplete(companyName.trim(), industry, useCase, {
        country,
        monthlyQueryVolume,
        companyGrowthRate: companyGrowthRate / 100
      });
    }
  };

  return (
    <div className="min-h-screen bg-finance-subtle flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <Building2 className="h-16 w-16 mx-auto mb-4 text-finance-primary" />
          <h1 className="text-3xl font-bold mb-2 text-finance-primary">Welcome to Ema ROI Calculator</h1>
          <p className="text-muted-foreground text-lg">Ema Partners' Client ROI Calculation Buddy</p>
        </div>

        <Card className="p-8 shadow-soft">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Step 1: Choose Client Industry</h2>
                <Select value={industry} onValueChange={setIndustry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((ind) => (
                      <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {showIndustryMessage && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800">
                    This industry module is currently under development. Please check back soon.
                  </p>
                </div>
              )}

              <Button 
                onClick={handleIndustryNext}
                disabled={!industry}
                className="w-full bg-finance-gradient hover:shadow-medium transition-all duration-300"
              >
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Step 2: Choose Client Use Case</h2>
                <div className="grid gap-3">
                  {useCases.map((uc) => (
                    <Button
                      key={uc}
                      variant={useCase === uc ? "default" : "outline"}
                      onClick={() => setUseCase(uc)}
                      className="justify-start h-12"
                    >
                      {uc}
                    </Button>
                  ))}
                </div>
              </div>

              {showUseCaseMessage && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800">
                    This use case is still under development. We'll notify you when it's live.
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button 
                  onClick={handleUseCaseNext}
                  disabled={!useCase}
                  className="flex-1 bg-finance-gradient hover:shadow-medium transition-all duration-300"
                >
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Step 3: Enter Client Name</h2>
                <Label htmlFor="company-name">Company Name</Label>
                <Input
                  id="company-name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Enter client name"
                  className="mt-2"
                />
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                  Back
                </Button>
                <Button 
                  onClick={handleCompanyNameNext}
                  disabled={!companyName.trim()}
                  className="flex-1 bg-finance-gradient hover:shadow-medium transition-all duration-300"
                >
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Step 4: Critical Business Inputs</h2>
                <p className="text-muted-foreground mb-6">Inputs required to calculate ROI for client</p>
                
                <div className="space-y-4">
                  {/* Partner Country */}
                  <div className="space-y-2">
                    <Label htmlFor="country" className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Partner Country
                    </Label>
                    <Select value={country} onValueChange={setCountry}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select partner country" />
                      </SelectTrigger>
                      <SelectContent className="bg-card">
                        {countries.map((countryItem) => (
                          <SelectItem key={countryItem.code} value={countryItem.code}>
                            {countryItem.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      Country where the client's concerned team or operation is located
                    </p>
                  </div>

                  {/* Monthly Queries */}
                  <div className="space-y-2">
                    <Label htmlFor="monthlyQueries" className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Monthly Queries (Millions)
                    </Label>
                    <Input
                      id="monthlyQueries"
                      type="number"
                      value={monthlyQueryVolume || ''}
                      onChange={(e) => setMonthlyQueryVolume(parseFloat(e.target.value) || 0)}
                      step="0.1"
                      className="text-lg font-medium"
                      placeholder="Enter monthly volume"
                    />
                    <p className="text-sm text-muted-foreground">
                      Total customer service queries handled per month by client
                    </p>
                  </div>

                  {/* Client Growth */}
                  <div className="space-y-2">
                    <Label htmlFor="growthRate" className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Client Growth (%)
                    </Label>
                    <Input
                      id="growthRate"
                      type="number"
                      value={companyGrowthRate || ''}
                      onChange={(e) => setCompanyGrowthRate(parseFloat(e.target.value) || 0)}
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

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(3)} className="flex-1">
                  Back
                </Button>
                <Button 
                  onClick={handleComplete}
                  disabled={!country || !monthlyQueryVolume || companyGrowthRate < 0}
                  className="flex-1 bg-finance-gradient hover:shadow-medium transition-all duration-300"
                >
                  Start Calculator <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};