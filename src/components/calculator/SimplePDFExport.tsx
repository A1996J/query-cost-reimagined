import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { usePdfExportV2 } from '@/hooks/usePdfExportV2';
import { toast } from '@/hooks/use-toast';

export const SimplePDFExport: React.FC = () => {
  const { exportToPdf, isGenerating } = usePdfExportV2();

  const handleExport = async () => {
    try {
      await exportToPdf();
      toast({
        title: "PDF Generated Successfully",
        description: "Your EMA ROI Analysis report has been downloaded."
      });
    } catch (error) {
      console.error('PDF export error:', error);
      toast({
        title: "PDF Generation Failed",
        description: "Please ensure the report is fully loaded and try again.",
        variant: "destructive"
      });
    }
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