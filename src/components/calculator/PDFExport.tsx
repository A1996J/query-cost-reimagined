import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import { toast } from '@/hooks/use-toast';

interface PDFExportProps {
  scenarioResults: any;
  scenarios: any;
}

export const PDFExport: React.FC<PDFExportProps> = ({ scenarioResults, scenarios }) => {
  const exportToPDF = async () => {
    try {
      toast({
        title: "Generating PDF",
        description: "Creating your professional EMA ROI report..."
      });

      const pdf = new jsPDF('portrait', 'mm', 'a4');
      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      
      // Emma green color values
      const emmaGreen = { r: 106, g: 176, b: 76 }; // RGB for hsl(135 65% 45%)
      const lightGreen = { r: 240, g: 248, b: 241 }; // Light green background
      const darkGray = { r: 51, g: 51, b: 51 };
      const mediumGray = { r: 102, g: 102, b: 102 };
      const white = { r: 255, g: 255, b: 255 };

      let currentPage = 1;
      let yPosition = margin;

      // Helper functions
      const addHeader = (title: string, subtitle?: string) => {
        // Emma logo placeholder
        pdf.setFillColor(emmaGreen.r, emmaGreen.g, emmaGreen.b);
        pdf.rect(margin, yPosition, 40, 8, 'F');
        pdf.setFontSize(12);
        pdf.setTextColor(white.r, white.g, white.b);
        pdf.text('EMA', margin + 2, yPosition + 5.5);
        
        // Main title
        pdf.setFontSize(20);
        pdf.setTextColor(darkGray.r, darkGray.g, darkGray.b);
        pdf.text(title, margin, yPosition + 20);
        
        if (subtitle) {
          pdf.setFontSize(12);
          pdf.setTextColor(mediumGray.r, mediumGray.g, mediumGray.b);
          pdf.text(subtitle, margin, yPosition + 28);
        }
        
        // Green line separator
        pdf.setDrawColor(emmaGreen.r, emmaGreen.g, emmaGreen.b);
        pdf.setLineWidth(0.5);
        pdf.line(margin, yPosition + 35, pageWidth - margin, yPosition + 35);
        
        return yPosition + 45;
      };

      const addNewPage = () => {
        pdf.addPage();
        currentPage++;
        yPosition = margin;
      };

      const formatCurrency = (value: number, currency: string = 'USD') => {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: currency,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value);
      };

      const addTable = (headers: string[], rows: string[][], startY: number) => {
        const rowHeight = 8;
        const colWidth = contentWidth / headers.length;
        let currentY = startY;

        // Header
        pdf.setFillColor(lightGreen.r, lightGreen.g, lightGreen.b);
        pdf.rect(margin, currentY, contentWidth, rowHeight, 'F');
        pdf.setFontSize(10);
        pdf.setTextColor(darkGray.r, darkGray.g, darkGray.b);
        
        headers.forEach((header, i) => {
          pdf.text(header, margin + (i * colWidth) + 2, currentY + 5.5);
        });
        
        currentY += rowHeight;

        // Rows
        pdf.setFillColor(white.r, white.g, white.b);
        rows.forEach((row, rowIndex) => {
          if (rowIndex % 2 === 1) {
            pdf.setFillColor(248, 249, 250);
          } else {
            pdf.setFillColor(white.r, white.g, white.b);
          }
          
          pdf.rect(margin, currentY, contentWidth, rowHeight, 'F');
          
          row.forEach((cell, colIndex) => {
            pdf.setTextColor(darkGray.r, darkGray.g, darkGray.b);
            if (colIndex === 0) {
              pdf.setFontSize(9);
            } else {
              pdf.setFontSize(10);
            }
            pdf.text(cell, margin + (colIndex * colWidth) + 2, currentY + 5.5);
          });
          
          currentY += rowHeight;
        });

        return currentY + 10;
      };

      // Page 1: Executive Summary
      yPosition = addHeader('EMA ROI Analysis', 'Executive Summary & Key Metrics');

      if (scenarioResults?.base) {
        const base = scenarioResults.base;
        
        // Key metrics boxes
        pdf.setFillColor(lightGreen.r, lightGreen.g, lightGreen.b);
        const boxWidth = (contentWidth - 10) / 3;
        const boxHeight = 25;
        
        // Total Savings
        pdf.rect(margin, yPosition, boxWidth, boxHeight, 'F');
        pdf.setFontSize(14);
        pdf.setTextColor(emmaGreen.r, emmaGreen.g, emmaGreen.b);
        pdf.text('Total 3-Year Savings', margin + 2, yPosition + 8);
        pdf.setFontSize(16);
        pdf.setTextColor(darkGray.r, darkGray.g, darkGray.b);
        pdf.text(formatCurrency(base.totalSavings * 3), margin + 2, yPosition + 16);

        // ROI
        pdf.rect(margin + boxWidth + 5, yPosition, boxWidth, boxHeight, 'F');
        pdf.setFontSize(14);
        pdf.setTextColor(emmaGreen.r, emmaGreen.g, emmaGreen.b);
        pdf.text('ROI', margin + boxWidth + 7, yPosition + 8);
        pdf.setFontSize(16);
        pdf.setTextColor(darkGray.r, darkGray.g, darkGray.b);
        const roi = ((base.totalSavings * 3) / (scenarios?.base?.implementationCost || 1)) * 100;
        pdf.text(`${roi.toFixed(0)}%`, margin + boxWidth + 7, yPosition + 16);

        // Payback Period
        pdf.rect(margin + (boxWidth + 5) * 2, yPosition, boxWidth, boxHeight, 'F');
        pdf.setFontSize(14);
        pdf.setTextColor(emmaGreen.r, emmaGreen.g, emmaGreen.b);
        pdf.text('Payback Period', margin + (boxWidth + 5) * 2 + 2, yPosition + 8);
        pdf.setFontSize(16);
        pdf.setTextColor(darkGray.r, darkGray.g, darkGray.b);
        const payback = (scenarios?.base?.implementationCost || 0) / (base.totalSavings || 1);
        pdf.text(`${payback.toFixed(1)} years`, margin + (boxWidth + 5) * 2 + 2, yPosition + 16);

        yPosition += boxHeight + 20;

        // Savings breakdown table
        pdf.setFontSize(14);
        pdf.setTextColor(darkGray.r, darkGray.g, darkGray.b);
        pdf.text('Annual Savings Breakdown', margin, yPosition);
        yPosition += 10;

        const savingsHeaders = ['Category', 'Year 1', 'Year 2', 'Year 3'];
        const savingsRows = [
          ['Direct Agent Savings', 
           formatCurrency(base.directAgentSavings || 0),
           formatCurrency((base.directAgentSavings || 0) * 1.1),
           formatCurrency((base.directAgentSavings || 0) * 1.2)],
          ['Productivity Gains',
           formatCurrency(base.productivitySavings || 0),
           formatCurrency((base.productivitySavings || 0) * 1.1),
           formatCurrency((base.productivitySavings || 0) * 1.2)],
          ['Additional Benefits',
           formatCurrency(base.additionalSavings || 0),
           formatCurrency((base.additionalSavings || 0) * 1.1),
           formatCurrency((base.additionalSavings || 0) * 1.2)]
        ];

        yPosition = addTable(savingsHeaders, savingsRows, yPosition);
      }

      // Benefits not baked in section (for Banking industry)
      if (scenarios?.base?.industry === 'Banking and Financial Services') {
        pdf.setFontSize(14);
        pdf.setTextColor(darkGray.r, darkGray.g, darkGray.b);
        pdf.text('Additional Benefits Not Quantified', margin, yPosition);
        yPosition += 10;

        const benefits = [
          '• Reduced customer churn from no wait times and 24/7 availability',
          '• Increased CSAT from consistent experience',
          '• Reduction in branch visits',
          '• Avoided cancellations from real understanding of core issue',
          '• Long-term savings from agent use in other business areas'
        ];

        pdf.setFontSize(10);
        pdf.setTextColor(mediumGray.r, mediumGray.g, mediumGray.b);
        benefits.forEach(benefit => {
          pdf.text(benefit, margin, yPosition);
          yPosition += 6;
        });
      }

      // Page 2: Detailed Analysis
      addNewPage();
      yPosition = addHeader('Detailed Financial Analysis', 'Key assumptions and sensitivity analysis');

      if (scenarios) {
        // Key assumptions table
        pdf.setFontSize(14);
        pdf.setTextColor(darkGray.r, darkGray.g, darkGray.b);
        pdf.text('Key Input Assumptions', margin, yPosition);
        yPosition += 10;

        const assumptionHeaders = ['Parameter', 'Base Case', 'Bull Case', 'Bear Case'];
        const assumptionRows = [
          ['Monthly Query Volume', 
           (scenarios.base?.monthlyQueryVolume || 0).toLocaleString(),
           (scenarios.bull?.monthlyQueryVolume || 0).toLocaleString(),
           (scenarios.bear?.monthlyQueryVolume || 0).toLocaleString()],
          ['Avg Handling Time (min)',
           (scenarios.base?.averageHandlingTime || 0).toString(),
           (scenarios.bull?.averageHandlingTime || 0).toString(), 
           (scenarios.bear?.averageHandlingTime || 0).toString()],
          ['Final Containment Rate',
           `${((scenarios.base?.finalYearContainmentRate || 0) * 100).toFixed(0)}%`,
           `${((scenarios.bull?.finalYearContainmentRate || 0) * 100).toFixed(0)}%`,
           `${((scenarios.bear?.finalYearContainmentRate || 0) * 100).toFixed(0)}%`],
          ['Implementation Cost',
           formatCurrency(scenarios.base?.implementationCost || 0),
           formatCurrency(scenarios.bull?.implementationCost || 0),
           formatCurrency(scenarios.bear?.implementationCost || 0)]
        ];

        yPosition = addTable(assumptionHeaders, assumptionRows, yPosition);

        // Scenario comparison
        pdf.setFontSize(14);
        pdf.setTextColor(darkGray.r, darkGray.g, darkGray.b);
        pdf.text('Scenario Comparison', margin, yPosition);
        yPosition += 10;

        const scenarioHeaders = ['Metric', 'Bear Case', 'Base Case', 'Bull Case'];
        const scenarioRows = [
          ['Total 3-Year Savings',
           formatCurrency((scenarioResults.bear?.totalSavings || 0) * 3),
           formatCurrency((scenarioResults.base?.totalSavings || 0) * 3),
           formatCurrency((scenarioResults.bull?.totalSavings || 0) * 3)],
          ['ROI',
           `${(((scenarioResults.bear?.totalSavings || 0) * 3) / (scenarios.bear?.implementationCost || 1) * 100).toFixed(0)}%`,
           `${(((scenarioResults.base?.totalSavings || 0) * 3) / (scenarios.base?.implementationCost || 1) * 100).toFixed(0)}%`,
           `${(((scenarioResults.bull?.totalSavings || 0) * 3) / (scenarios.bull?.implementationCost || 1) * 100).toFixed(0)}%`],
          ['Payback Period (years)',
           `${((scenarios.bear?.implementationCost || 0) / (scenarioResults.bear?.totalSavings || 1)).toFixed(1)}`,
           `${((scenarios.base?.implementationCost || 0) / (scenarioResults.base?.totalSavings || 1)).toFixed(1)}`,
           `${((scenarios.bull?.implementationCost || 0) / (scenarioResults.bull?.totalSavings || 1)).toFixed(1)}`]
        ];

        addTable(scenarioHeaders, scenarioRows, yPosition);
      }

      // Add footer to all pages
      const totalPages = pdf.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(mediumGray.r, mediumGray.g, mediumGray.b);
        pdf.text(`EMA ROI Analysis - Page ${i} of ${totalPages}`, margin, pageHeight - 10);
        pdf.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth - margin - 50, pageHeight - 10);
      }

      // Save the PDF
      const fileName = `EMA_ROI_Analysis_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

      toast({
        title: "PDF Generated Successfully",
        description: `Professional report saved as ${fileName}`,
      });

    } catch (error) {
      console.error('PDF export error:', error);
      toast({
        title: "Export Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Button 
      onClick={exportToPDF}
      variant="outline" 
      className="mb-6 border-finance-primary text-finance-primary hover:bg-finance-primary hover:text-white"
    >
      <Download className="mr-2 h-4 w-4" />
      Export Professional PDF Report
    </Button>
  );
};