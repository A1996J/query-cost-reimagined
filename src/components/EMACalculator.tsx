import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, TrendingUp, DollarSign, BarChart3 } from 'lucide-react';
import emaLogo from '/lovable-uploads/93b7ff10-d08c-4f6d-bb64-a3e8cee08d36.png';
import { Onboarding } from './Onboarding';
import { Disclaimer } from './Disclaimer';
import { DetailedAssumptionsSection } from './calculator/DetailedAssumptionsSection';
import { AdvancedInputsSection } from './calculator/AdvancedInputsSection';
import { ResultsDisplay } from './calculator/ResultsDisplay';
import { SavingsWaterfallChart } from './calculator/SavingsWaterfallChart';
import { SensitivityHeatmap } from './calculator/SensitivityHeatmap';
import { SummaryTable } from './calculator/SummaryTable';
import { SavingsStickers } from './calculator/SavingsStickers';
import { GlossarySection } from './calculator/GlossarySection';
import { KeyAssumptionsTable } from './calculator/KeyAssumptionsTable';
import { AdditionalBenefitsSection } from './calculator/AdditionalBenefitsSection';
import { ReportKeyPerformanceIndicators } from './calculator/ReportKeyPerformanceIndicators';
import { PrintPDFExport } from './calculator/PrintPDFExport';

import { ExecutiveSummaryPart1 } from './calculator/ExecutiveSummaryPart1';
import { ExecutiveSummaryPart2 } from './calculator/ExecutiveSummaryPart2';
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
  duplicateQueriesPercent: 0.03, // 3%
  annualComplianceCostReduction: 0.5, // $0.5M
};

// PIN-protected advanced defaults
const defaultAdvancedInputs: Partial<EMACalculatorInputs> = {
  benefitsMultiplier: 3.0,
  partnerOverheadMultiplier: 1.67,
  emaPricePerQuery: 1.0,
  partnerProfitMargin: 0.45,
};

const defaultInputs: EMACalculatorInputs = {
  ...emptyCriticalInputs,
  ...defaultDetailedInputs,
  ...defaultAdvancedInputs,
} as EMACalculatorInputs;

export const EMACalculator: React.FC = () => {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [useCase, setUseCase] = useState('');
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
  const [detailedOpen, setDetailedOpen] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const updateInput = useCallback((field: keyof EMACalculatorInputs, value: string | number) => {
    setScenarios(prev => ({
      ...prev,
      [currentScenario]: {
        ...prev[currentScenario],
        [field]: value
      }
    }));
  }, [currentScenario]);

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
      title: "Expected Scenario Populated",
      description: "Expected scenario has been populated from Conservative with optimistic assumptions"
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
           inputs.monthlyQueryVolume > 0 && 
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

  const handleOnboardingComplete = (name: string, selectedIndustry: string, selectedUseCase: string, criticalInputs: {
    country: string;
    monthlyQueryVolume: number;
    companyGrowthRate: number;
  }) => {
    setCompanyName(name);
    setIndustry(selectedIndustry);
    setUseCase(selectedUseCase);
    
    // Get currency from country
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
    
    const selectedCountry = countries.find(c => c.code === criticalInputs.country);
    const currency = selectedCountry?.currency || 'USD';
    
    // Update scenarios with critical inputs
    setScenarios(prev => ({
      base: {
        ...prev.base,
        country: criticalInputs.country,
        currency: currency,
        monthlyQueryVolume: criticalInputs.monthlyQueryVolume,
        companyGrowthRate: criticalInputs.companyGrowthRate,
      },
      bull: {
        ...prev.bull,
        country: criticalInputs.country,
        currency: currency,
        monthlyQueryVolume: criticalInputs.monthlyQueryVolume,
        companyGrowthRate: criticalInputs.companyGrowthRate,
      }
    }));
    
    setShowOnboarding(false);
  };

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-finance-subtle relative">
      {/* Header */}
      <div className="bg-finance-gradient shadow-medium">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 text-white">
            <img 
              src={emaLogo} 
              alt="Ema.co Logo" 
              className="h-12 w-auto"
            />
            <div>
              <h1 className="text-3xl font-bold mb-2">{companyName}'s ROI with Ema</h1>
              <p className="text-white/90 text-lg">
                Calculate 3-year direct cost savings from implementing Ema
              </p>
            </div>
          </div>
        </div>
      </div>

        <div className="container mx-auto px-4 py-8">
        <Disclaimer />
        <Tabs value={currentTab} onValueChange={(value) => {
          setCurrentTab(value);
          if (value === 'base' || value === 'bull') {
            setCurrentScenario(value as Scenario);
          }
        }}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="base">Conservative</TabsTrigger>
            <TabsTrigger value="bull">Expected</TabsTrigger>
            <TabsTrigger value="report">Report</TabsTrigger>
          </TabsList>

          <TabsContent value="base">
            <div className="space-y-8">
              {/* Calculate Button - Top */}
              <Card className="p-6 shadow-soft">
                <Button 
                  onClick={handleCalculate}
                  disabled={isCalculating || !canCalculate(scenarios.base)}
                  className="w-full bg-finance-gradient hover:shadow-medium transition-all duration-300 text-lg py-6"
                  size="lg"
                >
                  <TrendingUp className="mr-2 h-5 w-5" />
                  {isCalculating ? 'Calculating...' : 'Calculate Savings from Ema'}
                </Button>
              </Card>

              {/* Results Section - Above inputs */}
              {results && currentScenario === 'base' && (
                <div className="border-b pb-8">
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
                    Fill in all critical inputs to see the Ema ROI calculation results
                  </p>
                </Card>
              )}

              {/* Input Sections */}
              <div className="space-y-6">
                <DetailedAssumptionsSection 
                  inputs={scenarios.base}
                  onUpdateInput={updateInput}
                  isOpen={detailedOpen}
                  onOpenChange={setDetailedOpen}
                  industry={industry}
                  fxRateUserEdited={fxRateUserEdited.base}
                  onFxRateUserEdited={handleFxRateUserEdited}
                />
                
                <AdvancedInputsSection 
                  inputs={scenarios.base}
                  onUpdateInput={updateInput}
                  isOpen={advancedOpen}
                  onOpenChange={setAdvancedOpen}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bull">
            <div className="space-y-8">
              {/* Calculate Button - Top */}
              <Card className="p-6 shadow-soft">
                <Button 
                  onClick={handleCalculate}
                  disabled={isCalculating || !canCalculate(scenarios.bull)}
                  className="w-full bg-finance-gradient hover:shadow-medium transition-all duration-300 text-lg py-6"
                  size="lg"
                >
                  <TrendingUp className="mr-2 h-5 w-5" />
                  {isCalculating ? 'Calculating...' : 'Calculate Savings from Ema'}
                </Button>
              </Card>

              {/* Populate Bull Button */}
              <div className="mb-4">
                <Button
                  onClick={populateBullScenario}
                  variant="outline"
                  className="w-full"
                >
                  Populate Expected from Conservative
                </Button>
              </div>

              {/* Results Section - Above inputs */}
              {results && currentScenario === 'bull' && (
                <div className="border-b pb-8">
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
                    Fill in all critical inputs to see the Ema ROI calculation results
                  </p>
                </Card>
              )}

              {/* Input Sections */}
              <div className="space-y-6">
                <DetailedAssumptionsSection 
                  inputs={scenarios.bull}
                  onUpdateInput={updateInput}
                  isOpen={detailedOpen}
                  onOpenChange={setDetailedOpen}
                  industry={industry}
                  fxRateUserEdited={fxRateUserEdited.bull}
                  onFxRateUserEdited={handleFxRateUserEdited}
                />
                
                <AdvancedInputsSection 
                  inputs={scenarios.bull}
                  onUpdateInput={updateInput}
                  isOpen={advancedOpen}
                  onOpenChange={setAdvancedOpen}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="report">
            <div className="space-y-8">
              {scenarioResults && scenarios ? (
                <>
                  {/* PDF Export Button */}
                  <PrintPDFExport onSwitchToReport={() => setCurrentTab('report')} />
                  
                  {/* Savings Stickers */}
                  <div className="savings-stickers-container">
                    <SavingsStickers scenarioResults={scenarioResults} />
                  </div>
                  
                  {/* Charts */}
                  <div className="waterfall-chart-container">
                    <SavingsWaterfallChart scenarioResults={scenarioResults} useCase={useCase} />
                  </div>
                  
                  {/* Key Performance Indicators */}
                  <div className="report-kpi-container">
                    <ReportKeyPerformanceIndicators scenarioResults={scenarioResults} scenarios={scenarios} />
                  </div>
                  
                  
                  {/* Additional Benefits */}
                  <div className="additional-benefits-container">
                    <AdditionalBenefitsSection industry={industry} />
                  </div>
                  
                  <div className="sensitivity-heatmap-container">
                    <SensitivityHeatmap scenarioResults={scenarioResults} scenarios={scenarios} />
                  </div>
                  
                  {/* Key Assumptions Table */}
                  <div className="key-assumptions-container">
                    <KeyAssumptionsTable scenarios={scenarios} />
                  </div>
                  
                  {/* Executive Summary Table */}
                  <div className="executive-summary-container">
                    <SummaryTable scenarioResults={scenarioResults} scenarios={scenarios} />
                  </div>
                  
                  {/* Glossary and Other Assumptions */}
                  <div className="glossary-container">
                    <GlossarySection />
                  </div>
                </>
              ) : (
                <Card className="p-8 text-center shadow-soft">
                  <BarChart3 className="h-16 w-16 mx-auto mb-4 text-finance-primary" />
                  <h3 className="text-xl font-semibold mb-2">Generate Report</h3>
                  <p className="text-muted-foreground">
                    Complete calculations in Conservative and Expected scenarios to view the report
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