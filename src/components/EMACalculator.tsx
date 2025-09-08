import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, TrendingUp, DollarSign, BarChart3 } from 'lucide-react';
import { CriticalInputsSection } from './calculator/CriticalInputsSection';
import { DetailedAssumptionsSection } from './calculator/DetailedAssumptionsSection';
import { AdvancedInputsSection } from './calculator/AdvancedInputsSection';
import { ResultsDisplay } from './calculator/ResultsDisplay';
import { SavingsWaterfallChart } from './calculator/SavingsWaterfallChart';
import { SensitivityHeatmap } from './calculator/SensitivityHeatmap';
import { KeyAssumptionsTable } from './calculator/KeyAssumptionsTable';
import { calculateEMASavings, populateBullFromBase, calculateScenarioResults } from '@/lib/ema-calculations';
import { EMACalculatorInputs, CalculationResults, Scenario, ScenarioInputs, ScenarioResults } from '@/types/ema-calculator';
import { toast } from '@/hooks/use-toast';

// Empty defaults for critical inputs (user must fill)
const emptyCriticalInputs: Partial<EMACalculatorInputs> = {
  country: '',
  currency: 'USD',
  fxRate: 1,
  averageAnnualSalary: 0,
  monthlyQueryVolume: 0,
  averageHandlingTime: 0,
  implementationCost: 0,
  companyGrowthRate: 0,
};

// Pre-populated defaults for detailed assumptions
const defaultDetailedInputs: Partial<EMACalculatorInputs> = {
  capacityBuffer: 0.15, // 15%
  finalYearContainmentRate: 0.75, // 75%
  year1ProductivityGain: 0.10, // 10%
  duplicateQueriesPercent: 0.10,
  annualComplianceCostReduction: 0.25,
  customerExperienceAsPercentOfRevenue: 0.02,
  upsellPercentOfRevenue: 0.05,
};

// PIN-protected advanced defaults
const defaultAdvancedInputs: Partial<EMACalculatorInputs> = {
  benefitsMultiplier: 1.4,
  partnerOverheadMultiplier: 1.3,
  emaPricePerQuery: 0.50,
  partnerProfitMargin: 0.15,
};

const defaultInputs: EMACalculatorInputs = {
  ...emptyCriticalInputs,
  ...defaultDetailedInputs,
  ...defaultAdvancedInputs,
} as EMACalculatorInputs;

export const EMACalculator: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('base');
  const [currentScenario, setCurrentScenario] = useState<Scenario>('base');
  const [scenarios, setScenarios] = useState<ScenarioInputs>({
    base: defaultInputs,
    bull: defaultInputs
  });
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [scenarioResults, setScenarioResults] = useState<ScenarioResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  
  // Track FX rate user edits per scenario
  const [fxRateUserEdited, setFxRateUserEdited] = useState<{[key in Scenario]: boolean}>({
    base: false,
    bull: false
  });
  
  // Section collapse states
  const [detailedOpen, setDetailedOpen] = useState(true);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const updateInput = (field: keyof EMACalculatorInputs, value: string | number) => {
    setScenarios(prev => ({
      ...prev,
      [currentScenario]: {
        ...prev[currentScenario],
        [field]: value
      }
    }));
  };

  const populateBullScenario = () => {
    const bullInputs = populateBullFromBase(scenarios.base);
    
    // Preserve FX rate if user edited it in base
    if (fxRateUserEdited.base) {
      bullInputs.fxRate = scenarios.base.fxRate;
      setFxRateUserEdited(prev => ({
        ...prev,
        bull: true
      }));
    }
    
    setScenarios(prev => ({
      ...prev,
      bull: bullInputs
    }));
    setCurrentScenario('bull');
    toast({
      title: "Bull Scenario Populated",
      description: "Bull scenario has been populated from Base with optimistic assumptions"
    });
  };
  
  const handleFxRateUserEdited = (edited: boolean) => {
    setFxRateUserEdited(prev => ({
      ...prev,
      [currentScenario]: edited
    }));
  };

  const switchScenario = (scenario: Scenario) => {
    setCurrentScenario(scenario);
    setCurrentTab(scenario);
  };

  const canCalculate = (inputs: EMACalculatorInputs) => {
    return inputs.country && 
           inputs.averageAnnualSalary > 0 && 
           inputs.monthlyQueryVolume > 0 && 
           inputs.averageHandlingTime > 0 && 
           inputs.implementationCost >= 0 && 
           inputs.companyGrowthRate >= 0;
  };

  const handleCalculate = async () => {
    if (!canCalculate(scenarios[currentScenario])) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in all critical inputs before calculating.",
        variant: "destructive"
      });
      return;
    }

    setIsCalculating(true);
    try {
      const calculatedResults = calculateEMASavings(scenarios[currentScenario]);
      const allScenarioResults = calculateScenarioResults(scenarios);
      setResults(calculatedResults);
      setScenarioResults(allScenarioResults);
      toast({
        title: "Calculation Complete",
        description: `Total All-In savings (${currentScenario.toUpperCase()}): $${(calculatedResults.totalAllInSavings / 1000000).toFixed(2)}M`
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

  // Auto-calculate when inputs change (only if all required fields are filled)
  useEffect(() => {
    if (canCalculate(scenarios[currentScenario])) {
      const timer = setTimeout(() => {
        handleCalculate();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [scenarios, currentScenario]);

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
        <Tabs value={currentTab} onValueChange={(value) => {
          setCurrentTab(value);
          if (value === 'base' || value === 'bull') {
            setCurrentScenario(value as Scenario);
          }
        }}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="base">Base Case</TabsTrigger>
            <TabsTrigger value="bull">Bull Case</TabsTrigger>
            <TabsTrigger value="report">Report</TabsTrigger>
          </TabsList>

          <TabsContent value="base">
            <div className="space-y-8">
              {/* Input Sections */}
              <div className="space-y-6">
                <CriticalInputsSection 
                  inputs={scenarios.base}
                  onUpdateInput={updateInput}
                  fxRateUserEdited={fxRateUserEdited.base}
                  onFxRateUserEdited={handleFxRateUserEdited}
                />
                
                <DetailedAssumptionsSection 
                  inputs={scenarios.base}
                  onUpdateInput={updateInput}
                  isOpen={detailedOpen}
                  onOpenChange={setDetailedOpen}
                />
                
                <AdvancedInputsSection 
                  inputs={scenarios.base}
                  onUpdateInput={updateInput}
                  isOpen={advancedOpen}
                  onOpenChange={setAdvancedOpen}
                />

                <Card className="p-6 shadow-soft">
                  <Button 
                    onClick={handleCalculate}
                    disabled={isCalculating || !canCalculate(scenarios.base)}
                    className="w-full bg-finance-gradient hover:shadow-medium transition-all duration-300 text-lg py-6"
                    size="lg"
                  >
                    <TrendingUp className="mr-2 h-5 w-5" />
                    {isCalculating ? 'Calculating...' : 'Calculate EMA Savings'}
                  </Button>
                </Card>
              </div>

              {/* Results Section - Below inputs */}
              {results && currentScenario === 'base' && (
                <div className="border-t pt-8">
                  <h2 className="text-2xl font-bold mb-6 text-finance-primary">Results</h2>
                  <ResultsDisplay 
                    results={results} 
                    currency={scenarios.base.currency} 
                    scenario="base"
                  />
                </div>
              )}
              
              {!results && (
                <Card className="p-8 text-center shadow-soft">
                  <DollarSign className="h-16 w-16 mx-auto mb-4 text-finance-primary" />
                  <h3 className="text-xl font-semibold mb-2">Ready to Calculate</h3>
                  <p className="text-muted-foreground">
                    Fill in all critical inputs to see the EMA ROI calculation results
                  </p>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="bull">
            <div className="space-y-8">
              {/* Input Sections */}
              <div className="space-y-6">
                <div className="mb-4">
                  <Button
                    onClick={populateBullScenario}
                    variant="outline"
                    className="mb-4"
                  >
                    Populate Bull from Base
                  </Button>
                </div>

                <CriticalInputsSection 
                  inputs={scenarios.bull}
                  onUpdateInput={updateInput}
                  fxRateUserEdited={fxRateUserEdited.bull}
                  onFxRateUserEdited={handleFxRateUserEdited}
                />
                
                <DetailedAssumptionsSection 
                  inputs={scenarios.bull}
                  onUpdateInput={updateInput}
                  isOpen={detailedOpen}
                  onOpenChange={setDetailedOpen}
                />
                
                <AdvancedInputsSection 
                  inputs={scenarios.bull}
                  onUpdateInput={updateInput}
                  isOpen={advancedOpen}
                  onOpenChange={setAdvancedOpen}
                />

                <Card className="p-6 shadow-soft">
                  <Button 
                    onClick={handleCalculate}
                    disabled={isCalculating || !canCalculate(scenarios.bull)}
                    className="w-full bg-finance-gradient hover:shadow-medium transition-all duration-300 text-lg py-6"
                    size="lg"
                  >
                    <TrendingUp className="mr-2 h-5 w-5" />
                    {isCalculating ? 'Calculating...' : 'Calculate EMA Savings'}
                  </Button>
                </Card>
              </div>

              {/* Results Section - Below inputs */}
              {results && currentScenario === 'bull' && (
                <div className="border-t pt-8">
                  <h2 className="text-2xl font-bold mb-6 text-finance-primary">Results</h2>
                  <ResultsDisplay 
                    results={results} 
                    currency={scenarios.bull.currency} 
                    scenario="bull"
                  />
                </div>
              )}
              
              {!results && (
                <Card className="p-8 text-center shadow-soft">
                  <DollarSign className="h-16 w-16 mx-auto mb-4 text-finance-primary" />
                  <h3 className="text-xl font-semibold mb-2">Ready to Calculate</h3>
                  <p className="text-muted-foreground">
                    Fill in all critical inputs to see the EMA ROI calculation results
                  </p>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="report">
            <div className="space-y-8">
              {scenarioResults && scenarios ? (
                <>
                  {/* Charts */}
                  <SavingsWaterfallChart scenarioResults={scenarioResults} />
                  <SensitivityHeatmap scenarioResults={scenarioResults} scenarios={scenarios} />
                  
                  {/* Key Assumptions Table */}
                  <KeyAssumptionsTable scenarios={scenarios} />
                </>
              ) : (
                <Card className="p-8 text-center shadow-soft">
                  <BarChart3 className="h-16 w-16 mx-auto mb-4 text-finance-primary" />
                  <h3 className="text-xl font-semibold mb-2">Generate Report</h3>
                  <p className="text-muted-foreground">
                    Complete calculations in Base and Bull scenarios to view the report
                  </p>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};