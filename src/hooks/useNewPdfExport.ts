import { useState } from 'react';
import { ScenarioResults, ScenarioInputs } from '@/types/ema-calculator';
import html2pdf from 'html2pdf.js';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { NewReportPrintView } from '@/components/report/NewReportPrintView';

interface PdfExportOptions {
  scenarioResults: ScenarioResults;
  scenarios: ScenarioInputs;
  industry: string;
  useCase?: string;
}

export const useNewPdfExport = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const exportToPdf = async ({ scenarioResults, scenarios, industry, useCase }: PdfExportOptions) => {
    setIsGenerating(true);
    
    try {
      console.log('Starting PDF generation...');
      
      // Create a temporary container for the report
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.width = '210mm'; // A4 width
      tempContainer.style.backgroundColor = 'white';
      tempContainer.style.fontFamily = 'Inter, system-ui, sans-serif';
      document.body.appendChild(tempContainer);

      // Create React root and render the print view
      const root = ReactDOM.createRoot(tempContainer);
      
      await new Promise<void>((resolve) => {
        root.render(
          React.createElement(NewReportPrintView, {
            scenarioResults,
            scenarios,
            industry,
            useCase,
          })
        );
        
        // Wait for component to render and content to be ready
        setTimeout(() => {
          console.log('Report rendered, starting PDF conversion...');
          resolve();
        }, 2000);
      });

      // Wait for any charts or images to load
      const images = Array.from(tempContainer.querySelectorAll('img'));
      if (images.length > 0) {
        console.log(`Waiting for ${images.length} images to load...`);
        await Promise.all(
          images.map(img => 
            img.complete ? Promise.resolve() : new Promise(resolve => {
              img.onload = resolve;
              img.onerror = resolve;
            })
          )
        );
      }

      // Additional wait for charts to stabilize
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Configure html2pdf options for professional output
      const opt = {
        margin: [10, 10, 10, 10], // Top, left, bottom, right margins in mm
        filename: `EMA_ROI_Analysis_${new Date().toISOString().split('T')[0]}.pdf`,
        image: { 
          type: 'jpeg', 
          quality: 0.95 
        },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true,
          allowTaint: false,
          backgroundColor: '#ffffff',
          width: 794, // A4 width in pixels at 96 DPI
          height: 1123, // A4 height in pixels at 96 DPI
          scrollX: 0,
          scrollY: 0,
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
          after: '.pdf-page',
          avoid: ['.avoid-break', '.card', '.chart-container', '.table-wrapper']
        }
      };

      console.log('Converting to PDF...');
      
      // Generate and save the PDF
      await html2pdf().set(opt).from(tempContainer).save();
      
      console.log('PDF generated successfully!');

      // Clean up
      root.unmount();
      document.body.removeChild(tempContainer);
      
    } catch (error) {
      console.error('PDF generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return { exportToPdf, isGenerating };
};