import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PrintPDFExportProps {
  onSwitchToReport?: () => void;
}

export const PrintPDFExport: React.FC<PrintPDFExportProps> = ({ onSwitchToReport }) => {
  const handlePrint = () => {
    try {
      // Ensure we're on the report tab
      if (onSwitchToReport) {
        onSwitchToReport();
      }
      
      // Small delay to ensure tab switch is complete
      setTimeout(() => {
        window.print();
      }, 100);
    } catch (error) {
      console.error('Print error:', error);
      toast({
        title: "Print Failed", 
        description: "Please try again or use your browser's Ctrl+P shortcut.",
        variant: "destructive"
      });
    }
  };

  return (
    <Button 
      onClick={handlePrint}
      variant="outline" 
      className="mb-6 border-finance-primary text-finance-primary hover:bg-finance-primary hover:text-white"
    >
      <Download className="mr-2 h-4 w-4" />
      Export PDF Report
    </Button>
  );
};