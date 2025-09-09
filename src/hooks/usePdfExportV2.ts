import { useState } from 'react';
import html2pdf from 'html2pdf.js';

export const usePdfExportV2 = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const exportToPdf = async () => {
    setIsGenerating(true);
    
    try {
      console.log('Starting PDF generation from existing report content...');
      
      // Find the report tab content that's already rendered
      const reportContent = document.querySelector('[data-state="active"] .space-y-8');
      
      if (!reportContent || reportContent.children.length < 5) {
        throw new Error('Report content not found or incomplete. Please ensure the report is fully loaded.');
      }

      console.log('Found report content with', reportContent.children.length, 'components');

      // Create a clean container for PDF generation
      const printContainer = document.createElement('div');
      printContainer.style.position = 'absolute';
      printContainer.style.left = '-9999px';
      printContainer.style.top = '0';
      printContainer.style.width = '794px'; // A4 width in pixels
      printContainer.style.backgroundColor = 'white';
      printContainer.style.fontFamily = 'Inter, system-ui, sans-serif';
      printContainer.style.padding = '20px';
      document.body.appendChild(printContainer);

      // Copy all the CSS from the main document
      const allStyles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
        .map(style => style.outerHTML)
        .join('');

      // Clone the report content
      const clonedContent = reportContent.cloneNode(true) as HTMLElement;
      
      // Add CSS and content to print container
      printContainer.innerHTML = `
        ${allStyles}
        <div style="max-width: 754px; margin: 0 auto;">
          ${clonedContent.outerHTML}
        </div>
      `;

      // Wait for content to settle
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('Starting PDF conversion...');

      // Configure html2pdf for A4 portrait
      const opt = {
        margin: [10, 10, 10, 10],
        filename: `EMA_ROI_Analysis_${new Date().toISOString().split('T')[0]}.pdf`,
        image: { 
          type: 'jpeg', 
          quality: 0.98 
        },
        html2canvas: { 
          scale: 1.5,
          useCORS: true,
          letterRendering: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          width: 794,
          height: 1123,
          scrollX: 0,
          scrollY: 0,
          logging: true
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait',
          compress: true
        },
        pagebreak: { 
          mode: ['css', 'legacy'],
          before: '.savings-stickers-container, .waterfall-chart-container, .report-kpi-container, .sensitivity-heatmap-container, .key-assumptions-container, .executive-summary-container',
          avoid: '.avoid-break'
        }
      };

      // Generate and save the PDF
      await html2pdf().set(opt).from(printContainer).save();
      
      console.log('PDF generated successfully!');

      // Clean up
      document.body.removeChild(printContainer);
      
    } catch (error) {
      console.error('PDF generation failed:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return { exportToPdf, isGenerating };
};