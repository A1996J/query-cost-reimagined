import { useState } from 'react';
import html2pdf from 'html2pdf.js';
import { toast } from '@/hooks/use-toast';
import { ScenarioResults, ScenarioInputs } from '@/types/ema-calculator';

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

      // Create a new window with the print view
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Unable to open print window');
      }

      // Create the print document with landscape orientation
      const printDocument = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>EMA ROI Analysis Report</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
          <style>
            ${getPrintStyles()}
          </style>
        </head>
        <body>
          <div id="print-content"></div>
        </body>
        </html>
      `;

      printWindow.document.write(printDocument);
      printWindow.document.close();

      // Wait for the window to load
      await new Promise(resolve => {
        printWindow.onload = resolve;
      });

      // Render the React component to the print window
      const { createRoot } = await import('react-dom/client');
      const React = await import('react');
      const { ReportPrintView } = await import('@/components/report/ReportPrintView');

      const container = printWindow.document.getElementById('print-content');
      if (!container) {
        throw new Error('Print container not found');
      }

      const root = createRoot(container);
      root.render(
        React.createElement(ReportPrintView, {
          scenarioResults,
          scenarios,
          industry
        })
      );

      // Wait for report ready signal
      await new Promise<void>(resolve => {
        const checkReady = () => {
          if ((printWindow as any).reportReady) {
            resolve();
          } else {
            setTimeout(checkReady, 100);
          }
        };
        
        // Listen for ready event
        printWindow.addEventListener('report:ready', () => resolve(), { once: true });
        
        // Start checking
        setTimeout(checkReady, 500);
        
        // Safety timeout
        setTimeout(() => resolve(), 10000);
      });

      // Configure html2pdf options for landscape
      const opt = {
        margin: [10, 10, 10, 10], // 10mm margins
        filename: `EMA_ROI_Analysis_${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, // High DPI for crisp output
          useCORS: true,
          allowTaint: true,
          scrollX: 0,
          scrollY: 0,
          width: 1123, // A4 landscape width at 96dpi
          height: 794,  // A4 landscape height at 96dpi
          backgroundColor: '#ffffff'
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'landscape', // LANDSCAPE orientation
          compress: true
        },
        pagebreak: { 
          mode: ['avoid-all', 'css', 'legacy'],
          before: '.pdf-page',
          after: '.pdf-page'
        }
      };

      // Generate and download PDF
      await html2pdf().set(opt).from(container).save();

      toast({
        title: "PDF Generated Successfully",
        description: `Professional report saved as ${opt.filename}`,
      });

      // Clean up
      printWindow.close();

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

const getPrintStyles = () => `
  /* Page setup for landscape A4 */
  @page { 
    size: A4 landscape; 
    margin: 10mm; 
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    height: auto !important;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 12px;
    line-height: 1.4;
    color: #1f2937;
    background: white;
    -webkit-print-color-adjust: exact;
    color-adjust: exact;
  }

  .print-report {
    width: 100%;
    max-width: none;
  }

  .pdf-page {
    width: 297mm; /* A4 landscape width */
    min-height: 210mm; /* A4 landscape height */
    padding: 10mm;
    margin: 0 auto;
    background: white;
    page-break-after: always;
    break-after: page;
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .pdf-page:last-child {
    page-break-after: avoid;
    break-after: avoid;
  }

  /* Prevent blank pages from margin collapsing */
  .pdf-page:after {
    content: "";
    display: block;
    height: 0;
  }

  .avoid-break,
  .card, 
  .chart-container, 
  .insight-banner,
  .table-wrapper {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 2px solid #6ab04c;
    flex-shrink: 0;
  }

  .logo-section {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .logo {
    height: 32px;
    width: auto;
  }

  .header-text h1 {
    font-size: 20px;
    font-weight: 700;
    color: #1f2937;
    margin: 0;
  }

  .subtitle {
    font-size: 12px;
    color: #6b7280;
    margin: 2px 0 0 0;
  }

  .date {
    font-size: 11px;
    color: #6b7280;
  }

  .insight-banner {
    display: flex !important;
    align-items: center;
    gap: 10px;
    padding: 12px;
    border-radius: 6px;
    margin-bottom: 16px;
    font-size: 11px;
    line-height: 1.4;
    flex-shrink: 0;
  }

  .insight-banner svg {
    flex-shrink: 0;
    width: 16px;
    height: 16px;
  }

  /* Card styles */
  .bg-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
  }

  .shadow-soft {
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  }

  /* Table styles */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 8px 0;
    font-size: 10px;
  }

  thead {
    display: table-header-group;
  }

  tfoot {
    display: table-footer-group;
  }

  th, td {
    padding: 6px 8px;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
    break-inside: avoid;
    page-break-inside: avoid;
  }

  tr {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  th {
    background: #f9fafb;
    font-weight: 600;
    color: #374151;
  }

  tr:nth-child(even) {
    background: #f9fafb;
  }

  /* Chart containers - ensure they don't break */
  .chart-container {
    margin: 12px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .chart-container > * {
    max-width: 100%;
  }

  /* Savings stickers grid */
  .savings-stickers-container {
    margin: 12px 0;
  }

  /* Table wrapper */
  .table-wrapper {
    margin: 12px 0;
  }

  /* Additional benefits section */
  .additional-benefits-container {
    margin: 12px 0;
  }

  /* Hide elements that shouldn't print */
  button, 
  .no-print,
  #__next-route-announcer__, 
  .toast, 
  .vite-error-overlay, 
  .devtools-overlay {
    display: none !important;
    visibility: hidden !important;
  }

  /* Ensure text is readable with proper colors */
  .text-muted-foreground {
    color: #6b7280 !important;
  }

  .text-finance-primary {
    color: #6ab04c !important;
  }

  .bg-finance-primary {
    background-color: #6ab04c !important;
  }

  .border-finance-primary {
    border-color: #6ab04c !important;
  }

  /* Print media query */
  @media print {
    html, body {
      height: auto !important;
    }
    
    .pdf-page {
      margin: 0;
      page-break-after: always;
      break-after: page;
    }
    
    .pdf-page:last-child {
      page-break-after: avoid;
      break-after: avoid;
    }
    
    .avoid-break,
    .card, 
    .chart-container, 
    .insight-banner,
    .table-wrapper {
      break-inside: avoid;
      page-break-inside: avoid;
    }
    
    thead {
      display: table-header-group;
    }
    
    tfoot {
      display: table-footer-group;
    }
    
    tr, td, th {
      break-inside: avoid;
      page-break-inside: avoid;
    }
  }
`;