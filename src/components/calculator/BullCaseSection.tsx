import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { CurrencySection } from './CurrencySection';
import { HumanAgentSection } from './HumanAgentSection';
import { EMASection } from './EMASection';
import { AdvancedInputsSection } from './AdvancedInputsSection';
import { AdditionalSavingsSection } from './AdditionalSavingsSection';
import { ResultsDisplay } from './ResultsDisplay';
import { EMACalculatorInputs, ScenarioResults, ScenarioInputs } from '@/types/ema-calculator';

interface BullCaseSectionProps {
  inputs: EMACalculatorInputs;
  onUpdateInput: (field: keyof EMACalculatorInputs, value: string | number) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  fxRateUserEdited: boolean;
  onFxRateUserEdited: (edited: boolean) => void;
  scenarioResults: ScenarioResults;
  scenarios: ScenarioInputs;
  onPopulateBullScenario: () => void;
}

export const BullCaseSection: React.FC<BullCaseSectionProps> = ({
  inputs,
  onUpdateInput,
  isOpen,
  onOpenChange,
  fxRateUserEdited,
  onFxRateUserEdited,
  scenarioResults,
  scenarios,
  onPopulateBullScenario
}) => {
  return (
    <Card className="shadow-soft">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(!isOpen)}
            className="flex items-center gap-2 p-0 h-auto text-finance-primary hover:text-finance-primary/80"
          >
            {isOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            <CardTitle className="text-finance-primary">Bull Case Scenario</CardTitle>
          </Button>
          
          {!isOpen && (
            <Button
              onClick={onPopulateBullScenario}
              className="bg-finance-gradient hover:shadow-medium transition-all duration-300"
              size="sm"
            >
              Auto-Populate Bull Case
            </Button>
          )}
        </div>
      </CardHeader>
      
      {isOpen && (
        <CardContent className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <p className="text-muted-foreground">
              Configure optimistic assumptions for the bull case scenario
            </p>
            <Button
              onClick={onPopulateBullScenario}
              className="bg-finance-gradient hover:shadow-medium transition-all duration-300"
              size="sm"
            >
              Auto-Populate from Base
            </Button>
          </div>

          {/* Currency & Country */}
          <CurrencySection
            inputs={inputs}
            onUpdateInput={onUpdateInput}
          />

          {/* Human Agent & EMA Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <HumanAgentSection
              inputs={inputs}
              onUpdateInput={onUpdateInput}
            />
            <EMASection
              inputs={inputs}
              onUpdateInput={onUpdateInput}
            />
          </div>

          {/* Advanced Inputs */}
          <AdvancedInputsSection 
            inputs={inputs}
            onUpdateInput={onUpdateInput}
            isOpen={true}
            onOpenChange={() => {}}
          />

          {/* Additional Savings */}
          <AdditionalSavingsSection
            inputs={inputs}
            onUpdateInput={onUpdateInput}
          />

          {/* Results */}
          <ResultsDisplay
            results={scenarioResults.bull}
            currency={inputs.currency}
            scenario="bull"
            scenarioResults={scenarioResults}
            scenarios={scenarios}
          />
        </CardContent>
      )}
    </Card>
  );
};