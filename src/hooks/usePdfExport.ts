import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { ScenarioResults, ScenarioInputs } from '@/types/ema-calculator';
import { getPrintStyles } from './getPrintStyles';

interface PdfExportOptions {
  scenarioResults: ScenarioResults;
  scenarios: ScenarioInputs;
  industry: string;
}

export const usePdfExport = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const exportToPdf = async ({ scenarioResults, scenarios, industry }: PdfExportOptions) => {
    setIsGenerating(true);
    
    try {
      toast({
        title: "Generating PDF Report",
        description: "Creating your professional EMA ROI analysis..."
      });

      // Create hidden container in same window - no new tab
      const hiddenContainer = document.createElement('div');
      hiddenContainer.style.position = 'fixed';
      hiddenContainer.style.top = '-9999px';
      hiddenContainer.style.left = '-9999px';
      hiddenContainer.style.width = '794px';  // A4 portrait width  
      hiddenContainer.style.height = '1123px'; // A4 portrait height
      hiddenContainer.style.background = 'white';
      hiddenContainer.style.overflow = 'hidden';
      document.body.appendChild(hiddenContainer);

      // Create print styles
      const styleSheet = document.createElement('style');
      styleSheet.textContent = getPrintStyles();
      document.head.appendChild(styleSheet);

      // Render print view to hidden container
      const { createRoot } = await import('react-dom/client');
      const React = await import('react');
      const { ReportPrintView } = await import('@/components/report/ReportPrintView');

      const root = createRoot(hiddenContainer);
      root.render(
        React.createElement(ReportPrintView, {
          scenarioResults,
          scenarios,
          industry
        })
      );

      // Wait for print view to be ready
      await new Promise<void>(resolve => {
        const checkReady = () => {
          if ((window as any).reportReady) {
            resolve();
          } else {
            setTimeout(checkReady, 100);
          }
        };
        
        // Listen for ready event
        window.addEventListener('report:ready', () => resolve(), { once: true });
        
        // Start checking after a delay
        setTimeout(checkReady, 1000);
        
        // Safety timeout
        setTimeout(() => resolve(), 8000);
      });

      // Import html2pdf and generate
      const html2pdf = (await import('html2pdf.js')).default;
      
      const opt = {
        margin: [10, 10, 10, 10], // 10mm margins
        filename: `EMA_ROI_Analysis_${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          allowTaint: true,
          scrollX: 0,
          scrollY: 0,
          width: 794,   // A4 portrait width
          height: 1123, // A4 portrait height
          backgroundColor: '#ffffff'
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait',
          compress: true
        },
        pagebreak: { 
          mode: ['avoid-all', 'css', 'legacy'],
          before: '.pdf-page',
          after: '.pdf-page'
        }
      };

      // Generate and download PDF
      await html2pdf().set(opt).from(hiddenContainer).save();

      toast({
        title: "PDF Generated Successfully",
        description: "Professional report downloaded successfully",
      });

      // Clean up
      document.body.removeChild(hiddenContainer);
      document.head.removeChild(styleSheet);

    } catch (error) {
      console.error('PDF export error:', error);
      toast({
        title: "Export Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    exportToPdf,
    isGenerating
  };
};