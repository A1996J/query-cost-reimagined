import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator, TrendingUp, DollarSign } from 'lucide-react';
import { CurrencySection } from './calculator/CurrencySection';
import { HumanAgentSection } from './calculator/HumanAgentSection';
import { EMASection } from './calculator/EMASection';
import { ResultsDisplay } from './calculator/ResultsDisplay';
import { calculateEMASavings } from '@/lib/ema-calculations';
import { EMACalculatorInputs, CalculationResults } from '@/types/ema-calculator';
import { toast } from '@/hooks/use-toast';

const defaultInputs: EMACalculatorInputs = {
  country: 'US',
  currency: 'USD',
  fxRate: 1,
  averageAnnualSalary: 50000,
  benefitsMultiplier: 1.4,
  monthlyQueryVolume: 1,
  averageHandlingTime: 10,
  capacityBuffer: 0.15,
  partnerOverheadMultiplier: 1.3,
  emaPricePerQuery: 0.50,
  partnerProfitMargin: 0.15,
  implementationCost: 0.5,
  companyGrowthRate: 0.10,
  finalYearContainmentRate: 0.70,
  year1ProductivityGain: 0.15
};

export const EMACalculator: React.FC = () => {
  const [inputs, setInputs] = useState<EMACalculatorInputs>(defaultInputs);
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const updateInput = (field: keyof EMACalculatorInputs, value: string | number) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCalculate = async () => {
    setIsCalculating(true);
    try {
      const calculatedResults = calculateEMASavings(inputs);
      setResults(calculatedResults);
      toast({
        title: "Calculation Complete",
        description: `Total 3-year savings: $${(calculatedResults.totalSavings / 1000000).toFixed(2)}M`
      });
    } catch (error) {
      toast({
        title: "Calculation Error",
        description: "Please check your inputs and try again.",
        variant: "destructive"
      });
    } finally {
      setIsCalculating(false);
    }
  };

  // Auto-calculate when inputs change
  useEffect(() => {
    const timer = setTimeout(() => {
      handleCalculate();
    }, 500);
    return () => clearTimeout(timer);
  }, [inputs]);

  return (
    <div className="min-h-screen bg-finance-subtle">
      {/* Header */}
      <div className="bg-finance-gradient shadow-medium">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 text-white">
            <div className="p-3 bg-white/20 rounded-xl">
              <Calculator className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">EMA ROI Calculator</h1>
              <p className="text-white/90 text-lg">
                Calculate 3-year direct cost savings from implementing an EMA solution
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Input Sections */}
          <div className="xl:col-span-2 space-y-6">
            <CurrencySection 
              inputs={inputs}
              onUpdateInput={updateInput}
            />
            
            <HumanAgentSection 
              inputs={inputs}
              onUpdateInput={updateInput}
            />
            
            <EMASection 
              inputs={inputs}
              onUpdateInput={updateInput}
            />

            <Card className="p-6 shadow-soft">
              <Button 
                onClick={handleCalculate}
                disabled={isCalculating}
                className="w-full bg-finance-gradient hover:shadow-medium transition-all duration-300 text-lg py-6"
                size="lg"
              >
                <TrendingUp className="mr-2 h-5 w-5" />
                {isCalculating ? 'Calculating...' : 'Calculate EMA Savings'}
              </Button>
            </Card>
          </div>

          {/* Results Section */}
          <div className="xl:col-span-1">
            <div className="sticky top-8">
              {results && (
                <ResultsDisplay results={results} currency={inputs.currency} />
              )}
              
              {!results && (
                <Card className="p-8 text-center shadow-soft">
                  <DollarSign className="h-16 w-16 mx-auto mb-4 text-finance-primary" />
                  <h3 className="text-xl font-semibold mb-2">Ready to Calculate</h3>
                  <p className="text-muted-foreground">
                    Fill in your parameters to see the EMA ROI calculation results
                  </p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};