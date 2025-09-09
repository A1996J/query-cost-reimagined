import React from 'react';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import { ScenarioResults, ScenarioInputs } from '@/types/ema-calculator';
import { useNewPdfExport } from '@/hooks/useNewPdfExport';

interface NewPDFExportProps {
  scenarioResults: ScenarioResults;
  scenarios: ScenarioInputs;
  industry: string;
  useCase?: string;
}

export const NewPDFExport: React.FC<NewPDFExportProps> = ({ 
  scenarioResults, 
  scenarios, 
  industry,
  useCase 
}) => {
  const { exportToPdf, isGenerating } = useNewPdfExport();

  const handleExport = async () => {
    await exportToPdf({ scenarioResults, scenarios, industry, useCase });
  };

  return (
    <Button 
      onClick={handleExport} 
      disabled={isGenerating}
      className="bg-finance-primary hover:bg-finance-secondary text-white"
    >
      <FileDown className="mr-2 h-4 w-4" />
      {isGenerating ? 'Generating PDF...' : 'Export PDF Report'}
    </Button>
  );
};