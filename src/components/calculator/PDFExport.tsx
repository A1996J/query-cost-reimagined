import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import html2canvas from 'html2canvas';
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
        description: "Creating your 5-slide report..."
      });

      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const pageWidth = 297; // A4 landscape width in mm
      const pageHeight = 210; // A4 landscape height in mm

      // Function to capture element and add to PDF
      const captureAndAdd = async (elementId: string, pageNumber: number) => {
        const element = document.getElementById(elementId);
        if (!element) {
          console.warn(`Element with id ${elementId} not found`);
          return;
        }

        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
          width: element.scrollWidth,
          height: element.scrollHeight
        });

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pageWidth - 20; // Margin
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        // Add new page if not first page
        if (pageNumber > 1) {
          pdf.addPage();
        }

        // Add image centered on page
        const x = 10; // Left margin
        const y = Math.max(10, (pageHeight - imgHeight) / 2); // Center vertically with minimum margin
        
        pdf.addImage(imgData, 'PNG', x, y, imgWidth, Math.min(imgHeight, pageHeight - 20));
      };

      // Create temporary elements with IDs for PDF export
      const createSlideElements = () => {
        const createSlideHeader = (title: string, subtitle: string) => {
          const header = document.createElement('div');
          header.className = 'mb-8 pb-4 border-b-2 border-gray-200';
          header.innerHTML = `
            <h1 style="font-family: 'Inter', sans-serif; font-size: 28px; font-weight: 700; color: #1a1a1a; margin: 0 0 8px 0; line-height: 1.2;">${title}</h1>
            <p style="font-family: 'Inter', sans-serif; font-size: 16px; color: #666; margin: 0; line-height: 1.4;">${subtitle}</p>
          `;
          return header;
        };

        // Slide 1: Executive Summary - Key Savings & Strategic Benefits
        const slide1 = document.createElement('div');
        slide1.id = 'pdf-slide-1';
        slide1.className = 'bg-white';
        slide1.style.cssText = 'padding: 40px; font-family: Inter, sans-serif; line-height: 1.5; min-height: 800px;';
        
        const header1 = createSlideHeader(
          'Executive Summary: EMA ROI Analysis',
          'Quantified savings potential and strategic benefits from EMA implementation'
        );
        slide1.appendChild(header1);

        const contentDiv1 = document.createElement('div');
        contentDiv1.style.cssText = 'display: grid; grid-template-columns: 1fr; gap: 24px;';
        
        const stickers = document.querySelector('.savings-stickers-container') as HTMLElement;
        const waterfall = document.querySelector('.waterfall-chart-container') as HTMLElement;
        const benefits = document.querySelector('.additional-benefits-container') as HTMLElement;
        
        if (stickers) {
          const stickersClone = stickers.cloneNode(true) as HTMLElement;
          stickersClone.style.cssText = 'margin-bottom: 24px;';
          contentDiv1.appendChild(stickersClone);
        }
        
        if (waterfall) {
          const waterfallClone = waterfall.cloneNode(true) as HTMLElement;
          waterfallClone.style.cssText = 'margin-bottom: 24px;';
          contentDiv1.appendChild(waterfallClone);
        }

        if (benefits) {
          const benefitsClone = benefits.cloneNode(true) as HTMLElement;
          benefitsClone.style.cssText = 'margin-top: 24px;';
          contentDiv1.appendChild(benefitsClone);
        }

        slide1.appendChild(contentDiv1);
        document.body.appendChild(slide1);

        // Slide 2: Risk Analysis & Key Assumptions
        const slide2 = document.createElement('div');
        slide2.id = 'pdf-slide-2';
        slide2.className = 'bg-white';
        slide2.style.cssText = 'padding: 40px; font-family: Inter, sans-serif; line-height: 1.5; min-height: 800px;';
        
        const header2 = createSlideHeader(
          'Sensitivity Analysis & Key Assumptions',
          'Risk assessment and critical input parameters driving ROI calculations'
        );
        slide2.appendChild(header2);

        const contentDiv2 = document.createElement('div');
        contentDiv2.style.cssText = 'display: grid; grid-template-columns: 1fr; gap: 32px;';
        
        const sensitivity = document.querySelector('.sensitivity-heatmap-container') as HTMLElement;
        const keyAssumptions = document.querySelector('.key-assumptions-container') as HTMLElement;
        
        if (sensitivity) {
          const sensitivityClone = sensitivity.cloneNode(true) as HTMLElement;
          sensitivityClone.style.cssText = 'margin-bottom: 24px;';
          contentDiv2.appendChild(sensitivityClone);
        }
        
        if (keyAssumptions) {
          const assumptionsClone = keyAssumptions.cloneNode(true) as HTMLElement;
          assumptionsClone.style.cssText = 'margin-top: 24px;';
          contentDiv2.appendChild(assumptionsClone);
        }

        slide2.appendChild(contentDiv2);
        document.body.appendChild(slide2);

        // Slide 3: Financial Impact - Pre & Post EMA Analysis
        const slide3 = document.createElement('div');
        slide3.id = 'pdf-slide-3';
        slide3.className = 'bg-white';
        slide3.style.cssText = 'padding: 40px; font-family: Inter, sans-serif; line-height: 1.5; min-height: 800px;';
        
        const header3 = createSlideHeader(
          'Financial Impact Analysis (Part 1)',
          'Detailed cost structure comparison - current state vs. EMA-enabled operations'
        );
        slide3.appendChild(header3);

        const summary = document.querySelector('.executive-summary-container') as HTMLElement;
        if (summary) {
          const summaryClone = summary.cloneNode(true) as HTMLElement;
          summaryClone.style.cssText = 'margin-top: 24px;';
          
          const table = summaryClone.querySelector('table');
          if (table) {
            table.style.cssText = 'width: 100%; font-family: Inter, sans-serif; font-size: 14px;';
            const tbody = table.querySelector('tbody');
            if (tbody) {
              // Keep only first 3 sections (Pre-Ema, Post-Ema, Direct Savings)
              const rows = tbody.querySelectorAll('tr');
              let sectionCount = 0;
              const rowsToKeep: Element[] = [];
              
              rows.forEach((row) => {
                const firstCell = row.querySelector('td');
                if (firstCell?.getAttribute('colSpan') === '7') {
                  sectionCount++;
                }
                if (sectionCount <= 3) {
                  rowsToKeep.push(row);
                }
              });
              
              // Clear tbody and add only first 3 sections
              tbody.innerHTML = '';
              rowsToKeep.forEach(row => tbody.appendChild(row));
            }
          }
          slide3.appendChild(summaryClone);
        }
        document.body.appendChild(slide3);

        // Slide 4: Total Value Realization
        const slide4 = document.createElement('div');
        slide4.id = 'pdf-slide-4';
        slide4.className = 'bg-white';
        slide4.style.cssText = 'padding: 40px; font-family: Inter, sans-serif; line-height: 1.5; min-height: 800px;';
        
        const header4 = createSlideHeader(
          'Total Value Realization (Part 2)',
          'Comprehensive savings summary including additional operational efficiencies'
        );
        slide4.appendChild(header4);
        
        if (summary) {
          const summaryClone2 = summary.cloneNode(true) as HTMLElement;
          summaryClone2.style.cssText = 'margin-top: 24px;';
          
          const table2 = summaryClone2.querySelector('table');
          if (table2) {
            table2.style.cssText = 'width: 100%; font-family: Inter, sans-serif; font-size: 14px;';
            const tbody2 = table2.querySelector('tbody');
            if (tbody2) {
              // Keep only last 2 sections (Additional Savings, All-In Savings)
              const rows = tbody2.querySelectorAll('tr');
              let sectionCount = 0;
              const rowsToKeep: Element[] = [];
              
              rows.forEach((row) => {
                const firstCell = row.querySelector('td');
                if (firstCell?.getAttribute('colSpan') === '7') {
                  sectionCount++;
                }
                if (sectionCount > 3) {
                  rowsToKeep.push(row);
                }
              });
              
              // Clear tbody and add only last 2 sections
              tbody2.innerHTML = '';
              rowsToKeep.forEach(row => tbody2.appendChild(row));
            }
          }
          slide4.appendChild(summaryClone2);
        }
        document.body.appendChild(slide4);

        // Slide 5: Technical Appendix
        const slide5 = document.createElement('div');
        slide5.id = 'pdf-slide-5';
        slide5.className = 'bg-white';
        slide5.style.cssText = 'padding: 40px; font-family: Inter, sans-serif; line-height: 1.5; min-height: 800px;';
        
        const header5 = createSlideHeader(
          'Technical Appendix',
          'Definitions and methodological notes for ROI calculation framework'
        );
        slide5.appendChild(header5);
        
        const glossary = document.querySelector('.glossary-container') as HTMLElement;
        if (glossary) {
          const glossaryClone = glossary.cloneNode(true) as HTMLElement;
          glossaryClone.style.cssText = 'margin-top: 24px; font-family: Inter, sans-serif;';
          slide5.appendChild(glossaryClone);
        }
        document.body.appendChild(slide5);

        return [slide1, slide2, slide3, slide4, slide5];
      };

      const cleanupSlideElements = (elements: HTMLElement[]) => {
        elements.forEach(el => {
          if (el.parentNode) {
            el.parentNode.removeChild(el);
          }
        });
      };

      const slideElements = createSlideElements();

      // Capture slides
      await captureAndAdd('pdf-slide-1', 1);
      await captureAndAdd('pdf-slide-2', 2);
      await captureAndAdd('pdf-slide-3', 3);
      await captureAndAdd('pdf-slide-4', 4);
      await captureAndAdd('pdf-slide-5', 5);

      // Cleanup
      cleanupSlideElements(slideElements);

      // Save PDF
      const fileName = `Ema_ROI_Report_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

      toast({
        title: "PDF Generated",
        description: `Report exported as ${fileName}`
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
      className="mb-6"
    >
      <Download className="mr-2 h-4 w-4" />
      Export 5-Slide PDF Report
    </Button>
  );
};