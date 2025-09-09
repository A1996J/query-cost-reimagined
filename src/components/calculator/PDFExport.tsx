import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { usePdfExport } from '@/hooks/usePdfExport';

interface PDFExportProps {
  scenarioResults: any;
  scenarios: any;
  industry: string;
  useCase?: string;
}

export const PDFExport: React.FC<PDFExportProps> = ({ scenarioResults, scenarios, industry, useCase }) => {
  const { exportToPdf, isGenerating } = usePdfExport();

  const handleExport = () => {
    exportToPdf({
      scenarioResults,
      scenarios,
      industry,
      useCase
    });
  };

  return (
    <Button 
      onClick={handleExport}
      disabled={isGenerating}
      variant="outline" 
      className="mb-6 border-finance-primary text-finance-primary hover:bg-finance-primary hover:text-white disabled:opacity-50"
    >
      {isGenerating ? (
        <>
          <FileText className="mr-2 h-4 w-4 animate-spin" />
          Generating PDF...
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          Export Professional PDF Report
        </>
      )}
    </Button>
  );
};