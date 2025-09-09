import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { CriticalInputsSection } from './CriticalInputsSection';
import { AdvancedInputsSection } from './AdvancedInputsSection';
import { AdditionalSavingsSection } from './AdditionalSavingsSection';
import { ResultsDisplay } from './ResultsDisplay';
import { EMASection } from './EMASection';
import { HumanAgentSection } from './HumanAgentSection';
import { CurrencySection } from './CurrencySection';
import { EMACalculatorInputs, ScenarioResults, ScenarioInputs } from '@/types/ema-calculator';

interface AssumptionsTabProps {
  baseInputs: EMACalculatorInputs;
  bullInputs: EMACalculatorInputs;
  onUpdateBaseInput: (field: keyof EMACalculatorInputs, value: string | number) => void;
  onUpdateBullInput: (field: keyof EMACalculatorInputs, value: string | number) => void;
  fxRateUserEdited: boolean;
  onFxRateUserEdited: (edited: boolean) => void;
  scenarioResults: ScenarioResults;
  scenarios: ScenarioInputs;
}

export const AssumptionsTab: React.FC<AssumptionsTabProps> = ({
  baseInputs,
  bullInputs,
  onUpdateBaseInput,
  onUpdateBullInput,
  fxRateUserEdited,
  onFxRateUserEdited,
  scenarioResults,
  scenarios
}) => {
  const [showBullDeviations, setShowBullDeviations] = useState(false);

  return (
    <div className="space-y-8">
      {/* Section 1: Critical Inputs */}
      <CriticalInputsSection
        inputs={baseInputs}
        onUpdateInput={onUpdateBaseInput}
        fxRateUserEdited={fxRateUserEdited}
        onFxRateUserEdited={onFxRateUserEdited}
      />

      {/* Section 2: Detailed Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HumanAgentSection
          inputs={baseInputs}
          onUpdateInput={onUpdateBaseInput}
        />
        <EMASection
          inputs={baseInputs}
          onUpdateInput={onUpdateBaseInput}
        />
      </div>

      <AdvancedInputsSection 
        inputs={baseInputs}
        onUpdateInput={onUpdateBaseInput}
        isOpen={showBullDeviations}
        onOpenChange={setShowBullDeviations}
      />

      <AdditionalSavingsSection
        inputs={baseInputs}
        onUpdateInput={onUpdateBaseInput}
      />

      {/* Section 3: Bull Case Deviations */}
      <Card className="shadow-soft">
        <CardHeader className="pb-4">
          <Button
            variant="ghost"
            onClick={() => setShowBullDeviations(!showBullDeviations)}
            className="flex items-center gap-2 p-0 h-auto text-finance-primary hover:text-finance-primary/80"
          >
            {showBullDeviations ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            <CardTitle className="text-finance-primary">Bull Case Deviations</CardTitle>
          </Button>
        </CardHeader>
        
        {showBullDeviations && (
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              The bull case scenario automatically adjusts the following parameters for a more optimistic projection:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-finance-subtle rounded-lg">
                  <h4 className="font-semibold mb-2">Containment Rate</h4>
                  <p className="text-sm text-muted-foreground">Base × 1.25 (max 90%)</p>
                  <p className="text-sm font-medium mt-1">
                    Base: {(baseInputs.finalYearContainmentRate * 100).toFixed(1)}% → 
                    Bull: {(bullInputs.finalYearContainmentRate * 100).toFixed(1)}%
                  </p>
                </div>
                
                <div className="p-4 bg-finance-subtle rounded-lg">
                  <h4 className="font-semibold mb-2">Compliance Reduction</h4>
                  <p className="text-sm text-muted-foreground">Base × 3</p>
                  <p className="text-sm font-medium mt-1">
                    Base: ${baseInputs.annualComplianceCostReduction}K → 
                    Bull: ${bullInputs.annualComplianceCostReduction}K
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-finance-subtle rounded-lg">
                  <h4 className="font-semibold mb-2">Productivity Gain</h4>
                  <p className="text-sm text-muted-foreground">Base + 5 percentage points</p>
                  <p className="text-sm font-medium mt-1">
                    Base: {(baseInputs.year1ProductivityGain * 100).toFixed(1)}% → 
                    Bull: {(bullInputs.year1ProductivityGain * 100).toFixed(1)}%
                  </p>
                </div>
                
                <div className="p-4 bg-finance-subtle rounded-lg">
                  <h4 className="font-semibold mb-2">Upsell %</h4>
                  <p className="text-sm text-muted-foreground">Base × 1.5</p>
                  <p className="text-sm font-medium mt-1">
                    Base: {(baseInputs.upsellPercentOfRevenue * 100).toFixed(2)}% → 
                    Bull: {(bullInputs.upsellPercentOfRevenue * 100).toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Results for Base Case */}
      <ResultsDisplay
        results={scenarioResults.base}
        currency={baseInputs.currency}
        scenario="base"
        scenarioResults={scenarioResults}
        scenarios={scenarios}
      />

      {/* Results for Bull Case */}
      <ResultsDisplay
        results={scenarioResults.bull}
        currency={bullInputs.currency}
        scenario="bull"
        scenarioResults={scenarioResults}
        scenarios={scenarios}
      />
    </div>
  );
};