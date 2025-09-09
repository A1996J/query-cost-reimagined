import { useState } from 'react';
import html2pdf from 'html2pdf.js';

export const usePdfExportV2 = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const exportToPdf = async () => {
    setIsGenerating(true);
    
    try {
      console.log('Starting PDF generation from live report tab...');
      
      // First, ensure we're on the report tab
      const reportTab = document.querySelector('[data-value="report"]') as HTMLButtonElement;
      if (reportTab && !reportTab.getAttribute('data-state')?.includes('active')) {
        reportTab.click();
        // Wait for tab switch to complete
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // Find the actual report content that's visible
      const reportContent = document.querySelector('[data-value="report"][data-state="active"]');
      
      if (!reportContent) {
        throw new Error('Report tab not found or not active. Please switch to the Report tab and try again.');
      }

      console.log('Found active report content, generating PDF...');

      // Configure html2pdf for direct capture of the visible report
      const opt = {
        margin: [10, 10, 10, 10],
        filename: `EMA_ROI_Analysis_${new Date().toISOString().split('T')[0]}.pdf`,
        image: { 
          type: 'jpeg', 
          quality: 0.98 
        },
        html2canvas: { 
          scale: 1.2,
          useCORS: true,
          letterRendering: true,
          allowTaint: false,
          backgroundColor: '#ffffff',
          logging: false,
          width: 800,
          height: 1000
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait',
          compress: true
        },
        pagebreak: { 
          mode: ['css', 'legacy'],
          before: '.savings-stickers-container, .waterfall-chart-container, .report-kpi-container, .sensitivity-heatmap-container, .key-assumptions-container, .executive-summary-container'
        }
      };

      // Generate PDF directly from the live, visible content
      await html2pdf().set(opt).from(reportContent).save();
      
      console.log('PDF generated successfully!');
      
    } catch (error) {
      console.error('PDF generation failed:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return { exportToPdf, isGenerating };
};