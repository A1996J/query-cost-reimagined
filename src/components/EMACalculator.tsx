import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, TrendingUp, DollarSign, BarChart3 } from 'lucide-react';
import emaLogo from '/lovable-uploads/93b7ff10-d08c-4f6d-bb64-a3e8cee08d36.png';
import { Onboarding } from './Onboarding';
import { Disclaimer } from './Disclaimer';
import { AssumptionsTab } from './calculator/AssumptionsTab';
import { SavingsWaterfallChart } from './calculator/SavingsWaterfallChart';
import { SensitivityHeatmap } from './calculator/SensitivityHeatmap';
import { SummaryTable } from './calculator/SummaryTable';
import { SavingsStickers } from './calculator/SavingsStickers';
import { DetailedAssumptionsSection } from './calculator/DetailedAssumptionsSection';
import { PDFExport } from './calculator/PDFExport';
import { KeyAssumptionsTable } from './calculator/KeyAssumptionsTable';
import { calculateEMASavings, populateBullFromBase, calculateScenarioResults } from '@/lib/ema-calculations';
import { calculateImplementationCost } from '@/lib/implementation-cost-calculation';
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
  implementationCost: 0, // Now in $K
  companyGrowthRate: 0,
};

// Pre-populated defaults for detailed assumptions
const defaultDetailedInputs: Partial<EMACalculatorInputs> = {
  capacityBuffer: 0.15, // 15%
  finalYearContainmentRate: 0.75, // 75%
  year1ProductivityGain: 0.10, // 10%
  duplicateQueriesPercent: 0.10,
  annualComplianceCostReduction: 250, // Now in $K
  customerExperienceAsPercentOfRevenue: 0.02,
  upsellPercentOfRevenue: 0.05,
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
  const [onboardingData, setOnboardingData] = useState<any>(null);
  const [currentTab, setCurrentTab] = useState('assumptions');
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

  // Auto-calculate implementation cost when inputs change
  useEffect(() => {
    if (scenarios[currentScenario].monthlyQueryVolume > 0 && 
        scenarios[currentScenario].averageHandlingTime > 0 && 
        scenarios[currentScenario].averageAnnualSalary > 0 && 
        scenarios[currentScenario].capacityBuffer >= 0) {
      const autoImplementationCost = calculateImplementationCost(
        scenarios[currentScenario].monthlyQueryVolume,
        scenarios[currentScenario].averageHandlingTime,
        scenarios[currentScenario].capacityBuffer,
        scenarios[currentScenario].averageAnnualSalary,
        scenarios[currentScenario].benefitsMultiplier,
        scenarios[currentScenario].fxRate
      );
      
      // Only auto-update if user hasn't manually set a different value
      if (scenarios[currentScenario].implementationCost === 0) {
        setScenarios(prev => ({
          ...prev,
          [currentScenario]: {
            ...prev[currentScenario],
            implementationCost: autoImplementationCost
          }
        }));
      }
    }
  }, [scenarios[currentScenario].monthlyQueryVolume, scenarios[currentScenario].averageHandlingTime, 
      scenarios[currentScenario].averageAnnualSalary, scenarios[currentScenario].capacityBuffer, currentScenario]);

  // Auto-calculate when inputs change (only if all required fields are filled)
  useEffect(() => {
    if (canCalculate(scenarios[currentScenario])) {
      const timer = setTimeout(() => {
        handleCalculate();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [scenarios, currentScenario]);

  const handleOnboardingComplete = (data: any) => {
    setCompanyName(data.companyName);
    setOnboardingData(data);
    setShowOnboarding(false);
    
    // Apply smart defaults based on onboarding data
    if (data.country === 'IN') {
      updateInput('averageAnnualSalary', 450000);
    }
    
    if (data.industry === 'Banking and Financial Services') {
      updateInput('averageHandlingTime', 10);
      updateInput('companyGrowthRate', 0.05);
    }
    
    // Set monthly queries and query types (convert from thousands to millions)
    updateInput('monthlyQueryVolume', data.monthlyQueries / 1000);
    updateInput('queryTypes', data.queryTypes);
    
    // Pre-fill partner country
    updateInput('country', data.country);
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
                Calculate 3-year direct cost savings from implementing an Ema solution
              </p>
            </div>
          </div>
        </div>
      </div>

        <div className="container mx-auto px-4 py-8">
        <div className="bg-card rounded-lg shadow-soft overflow-hidden">
          <div className="border-b border-border">
            <div className="flex">
              <button
                onClick={() => setCurrentTab('assumptions')}
                className={`px-6 py-4 text-sm font-medium transition-colors ${
                  currentTab === 'assumptions'
                    ? 'bg-finance-primary text-white border-b-2 border-finance-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Assumptions
              </button>
              <button
                onClick={() => setCurrentTab('report')}
                className={`px-6 py-4 text-sm font-medium transition-colors ${
                  currentTab === 'report'
                    ? 'bg-finance-primary text-white border-b-2 border-finance-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Report
              </button>
            </div>
          </div>

          <div className="p-6">
            <Disclaimer />
            {currentTab === 'assumptions' && (
              <AssumptionsTab 
                baseInputs={scenarios.base}
                bullInputs={scenarios.bull}
                onUpdateBaseInput={(field, value) => {
                  setScenarios(prev => ({
                    ...prev,
                    base: { ...prev.base, [field]: value }
                  }));
                }}
                onUpdateBullInput={(field, value) => {
                  setScenarios(prev => ({
                    ...prev,
                    bull: { ...prev.bull, [field]: value }
                  }));
                }}
                fxRateUserEdited={fxRateUserEdited.base}
                onFxRateUserEdited={handleFxRateUserEdited}
                scenarioResults={scenarioResults || { base: calculateEMASavings(scenarios.base), bull: calculateEMASavings(scenarios.bull) }}
                scenarios={scenarios}
                onPopulateBullScenario={populateBullScenario}
              />
            )}
            {currentTab === 'report' && (
              <div className="space-y-8">
                {scenarioResults ? (
                  <>
                    <SavingsStickers scenarioResults={scenarioResults} />
                    <SavingsWaterfallChart 
                      scenarioResults={scenarioResults}
                    />
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                      <SensitivityHeatmap 
                        scenarioResults={scenarioResults}
                        scenarios={scenarios}
                      />
                      <KeyAssumptionsTable 
                        scenarios={scenarios}
                      />
                    </div>
                    <SummaryTable 
                      scenarioResults={scenarioResults}
                      scenarios={scenarios}
                    />
                    <PDFExport 
                      scenarioResults={scenarioResults} 
                      scenarios={scenarios} 
                    />
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};