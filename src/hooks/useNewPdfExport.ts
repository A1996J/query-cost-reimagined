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
      console.log('Starting PDF generation...', { scenarioResults, scenarios, industry, useCase });
      
      // Create a temporary container for the report
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.width = '794px'; // A4 width in pixels
      tempContainer.style.backgroundColor = 'white';
      tempContainer.style.fontFamily = 'Inter, system-ui, sans-serif';
      tempContainer.style.fontSize = '14px';
      tempContainer.style.lineHeight = '1.5';
      document.body.appendChild(tempContainer);

      console.log('Container created, rendering component...');

      // Create React root and render the print view
      const root = ReactDOM.createRoot(tempContainer);
      
      await new Promise<void>((resolve, reject) => {
        try {
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
            console.log('Report rendered, checking content...', tempContainer.innerHTML.length);
            if (tempContainer.innerHTML.length < 100) {
              console.error('Rendered content is too short, something went wrong');
              reject(new Error('Rendered content is empty or too short'));
              return;
            }
            console.log('Content looks good, proceeding to PDF conversion...');
            resolve();
          }, 3000); // Increased wait time
        } catch (error) {
          console.error('Error rendering component:', error);
          reject(error);
        }
      });

      // Wait for any images to load (though we're not using external images now)
      const images = Array.from(tempContainer.querySelectorAll('img'));
      if (images.length > 0) {
        console.log(`Waiting for ${images.length} images to load...`);
        await Promise.all(
          images.map(img => 
            img.complete ? Promise.resolve() : new Promise(resolve => {
              img.onload = () => {
                console.log('Image loaded:', img.src);
                resolve(undefined);
              };
              img.onerror = () => {
                console.log('Image failed to load:', img.src);
                resolve(undefined);
              };
              // Timeout for images
              setTimeout(() => resolve(undefined), 2000);
            })
          )
        );
      }

      // Additional wait for any remaining rendering
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('Starting PDF conversion with content length:', tempContainer.innerHTML.length);

      // Configure html2pdf options for professional output
      const opt = {
        margin: [10, 10, 10, 10], // Top, left, bottom, right margins in mm
        filename: `EMA_ROI_Analysis_${new Date().toISOString().split('T')[0]}.pdf`,
        image: { 
          type: 'jpeg', 
          quality: 0.98 
        },
        html2canvas: { 
          scale: 1.5, // Reduced scale for better compatibility
          useCORS: true,
          letterRendering: true,
          allowTaint: true, // Allow taint for better compatibility
          backgroundColor: '#ffffff',
          width: 794, // A4 width in pixels at 96 DPI
          height: 1123, // A4 height in pixels at 96 DPI
          scrollX: 0,
          scrollY: 0,
          logging: true, // Enable logging for debugging
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait',
          compress: true
        },
        pagebreak: { 
          mode: ['css', 'legacy'],
          before: '.pdf-page',
          after: '.pdf-page'
        }
      };

      console.log('PDF conversion options:', opt);
      
      // Generate and save the PDF
      const pdfResult = await html2pdf().set(opt).from(tempContainer).save();
      
      console.log('PDF generated successfully!', pdfResult);

      // Clean up
      root.unmount();
      document.body.removeChild(tempContainer);
      
    } catch (error) {
      console.error('PDF generation failed:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return { exportToPdf, isGenerating };
};