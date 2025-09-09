import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, Building2 } from 'lucide-react';

interface OnboardingProps {
  onComplete: (companyName: string, industry: string, partnerCountry: string) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [industry, setIndustry] = useState('');
  const [partnerCountry, setPartnerCountry] = useState('');
  const [useCase, setUseCase] = useState('');
  const [companyName, setCompanyName] = useState('');
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

  const useCases = [
    'Customer Experience',
    'Sales and Marketing',
    'Recruitment'
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

  const handleComplete = () => {
    if (companyName.trim()) {
      onComplete(companyName.trim(), industry, partnerCountry);
    }
  };

  return (
    <div className="min-h-screen bg-finance-subtle flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <Building2 className="h-16 w-16 mx-auto mb-4 text-finance-primary" />
          <h1 className="text-3xl font-bold mb-2 text-finance-primary">Welcome to Ema ROI Calculator</h1>
          <p className="text-muted-foreground text-lg">Let's get started with a few quick questions</p>
        </div>

        <Card className="p-8 shadow-soft">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Step 1: Choose Your Industry & Partner Country</h2>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="industry" className="text-base font-medium">Industry</Label>
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

                  <div>
                    <Label htmlFor="partnerCountry" className="text-base font-medium">Partner Country</Label>
                    <Select value={partnerCountry} onValueChange={setPartnerCountry}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select partner country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground mt-1">
                      Country where the partner's team or operation is located.
                    </p>
                  </div>
                </div>
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
                disabled={!industry || !partnerCountry}
                className="w-full bg-finance-gradient hover:shadow-medium transition-all duration-300"
              >
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Step 2: Choose Your Use Case</h2>
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
                <h2 className="text-2xl font-semibold mb-4">Step 3: Enter Your Company Name</h2>
                <Label htmlFor="company-name">Company Name</Label>
                <Input
                  id="company-name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Enter your company name"
                  className="mt-2"
                />
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                  Back
                </Button>
                <Button 
                  onClick={handleComplete}
                  disabled={!companyName.trim()}
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