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
import { BullCaseSection } from './BullCaseSection';
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
  onPopulateBullScenario: () => void;
}

export const AssumptionsTab: React.FC<AssumptionsTabProps> = ({
  baseInputs,
  bullInputs,
  onUpdateBaseInput,
  onUpdateBullInput,
  fxRateUserEdited,
  onFxRateUserEdited,
  scenarioResults,
  scenarios,
  onPopulateBullScenario
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

      {/* Section 3: Bull Case Scenario */}
      <BullCaseSection
        inputs={bullInputs}
        onUpdateInput={onUpdateBullInput}
        isOpen={showBullDeviations}
        onOpenChange={setShowBullDeviations}
        fxRateUserEdited={fxRateUserEdited}
        onFxRateUserEdited={onFxRateUserEdited}
        scenarioResults={scenarioResults}
        scenarios={scenarios}
        onPopulateBullScenario={onPopulateBullScenario}
      />

      {/* Results for Base Case */}
      <ResultsDisplay
        results={scenarioResults.base}
        currency={baseInputs.currency}
        scenario="base"
        scenarioResults={scenarioResults}
        scenarios={scenarios}
      />
    </div>
  );
};