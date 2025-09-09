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

      // Create the print document
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

      // Wait for rendering and images to load
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Configure html2pdf options
      const opt = {
        margin: [12, 12, 12, 12],
        filename: `EMA_ROI_Analysis_${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          allowTaint: true,
          scrollX: 0,
          scrollY: 0
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
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 14px;
    line-height: 1.4;
    color: #1f2937;
    background: white;
  }

  .print-report {
    width: 100%;
    max-width: none;
  }

  .pdf-page {
    width: 210mm;
    min-height: 297mm;
    padding: 12mm;
    margin: 0 auto;
    background: white;
    page-break-after: always;
    break-after: page;
    position: relative;
  }

  .pdf-page:last-child {
    page-break-after: avoid;
    break-after: avoid;
  }

  .avoid-break {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 2px solid #6ab04c;
  }

  .logo-section {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .logo {
    height: 40px;
    width: auto;
  }

  .header-text h1 {
    font-size: 24px;
    font-weight: 700;
    color: #1f2937;
    margin: 0;
  }

  .subtitle {
    font-size: 14px;
    color: #6b7280;
    margin: 4px 0 0 0;
  }

  .date {
    font-size: 12px;
    color: #6b7280;
  }

  .insight-banner {
    display: flex !important;
    align-items: center;
    gap: 12px;
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 24px;
    font-size: 13px;
    line-height: 1.5;
  }

  .insight-banner svg {
    flex-shrink: 0;
  }

  /* Card styles */
  .bg-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
  }

  .shadow-soft {
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  }

  /* Table styles */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 16px 0;
    font-size: 12px;
  }

  thead {
    display: table-header-group;
  }

  th, td {
    padding: 8px 12px;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
  }

  th {
    background: #f9fafb;
    font-weight: 600;
    color: #374151;
  }

  tr:nth-child(even) {
    background: #f9fafb;
  }

  /* Chart containers */
  .savings-stickers-container,
  .waterfall-chart-container,
  .sensitivity-heatmap-container,
  .executive-summary-container,
  .additional-benefits-container {
    margin: 20px 0;
  }

  /* Hide elements that shouldn't print */
  button, .no-print {
    display: none !important;
  }

  /* Ensure text is readable */
  .text-muted-foreground {
    color: #6b7280 !important;
  }

  .text-finance-primary {
    color: #6ab04c !important;
  }

  /* Responsive adjustments for print */
  @media print {
    .pdf-page {
      margin: 0;
      page-break-after: always;
    }
    
    .avoid-break {
      break-inside: avoid;
    }
    
    thead {
      display: table-header-group;
    }
  }
`;