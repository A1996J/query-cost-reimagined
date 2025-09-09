import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, Building2 } from 'lucide-react';

interface OnboardingData {
  companyName: string;
  country: string;
  industry: string;
  monthlyQueries: number;
  queryTypes: string;
}

interface OnboardingProps {
  onComplete: (data: OnboardingData) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [industry, setIndustry] = useState('');
  const [useCase, setUseCase] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [country, setCountry] = useState('');
  const [monthlyQueries, setMonthlyQueries] = useState<number>(0);
  const [queryTypes, setQueryTypes] = useState('');
  const [showIndustryMessage, setShowIndustryMessage] = useState(false);
  const [showUseCaseMessage, setShowUseCaseMessage] = useState(false);

  const countries = [
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'IN', name: 'India' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'JP', name: 'Japan' },
    { code: 'CN', name: 'China' },
    { code: 'SG', name: 'Singapore' },
  ];

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
    if (companyName.trim() && country && monthlyQueries > 0 && queryTypes.trim()) {
      onComplete({
        companyName: companyName.trim(),
        country,
        industry,
        monthlyQueries,
        queryTypes: queryTypes.trim()
      });
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
                <h2 className="text-2xl font-semibold mb-4">Step 1: Choose Your Industry</h2>
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
                <h2 className="text-2xl font-semibold mb-4">Step 3: Company Details</h2>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input
                      id="company-name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Enter your company name"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="country">Partner Country</Label>
                    <Select value={country} onValueChange={setCountry}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select partner country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((c) => (
                          <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="monthly-queries">Total Monthly Customer Queries Received</Label>
                    <Input
                      id="monthly-queries"
                      type="number"
                      value={monthlyQueries || ''}
                      onChange={(e) => setMonthlyQueries(parseFloat(e.target.value) || 0)}
                      placeholder="Enter monthly query volume (in millions)"
                      className="mt-2"
                      step="0.1"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Total number of customer service queries in a typical month.
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="query-types">Breakdown of Query Types (% Split Required) *</Label>
                    <Input
                      id="query-types"
                      value={queryTypes}
                      onChange={(e) => setQueryTypes(e.target.value)}
                      placeholder="E.g., 40% billing, 30% technical support, 20% onboarding, 10% others"
                      className="mt-2"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                  Back
                </Button>
                <Button 
                  onClick={handleComplete}
                  disabled={!companyName.trim() || !country || !monthlyQueries || !queryTypes.trim()}
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