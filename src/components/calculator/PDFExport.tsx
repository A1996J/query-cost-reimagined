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
        // Slide 1: Stickers + Waterfall
        const slide1 = document.createElement('div');
        slide1.id = 'pdf-slide-1';
        slide1.className = 'p-8 bg-white';
        
        const stickers = document.querySelector('.savings-stickers-container') as HTMLElement;
        const waterfall = document.querySelector('.waterfall-chart-container') as HTMLElement;
        
        if (stickers) slide1.appendChild(stickers.cloneNode(true));
        if (waterfall) slide1.appendChild(waterfall.cloneNode(true));
        document.body.appendChild(slide1);

        // Slide 2: Sensitivity + Key Assumptions
        const slide2 = document.createElement('div');
        slide2.id = 'pdf-slide-2';
        slide2.className = 'p-8 bg-white';
        
        const sensitivity = document.querySelector('.sensitivity-heatmap-container') as HTMLElement;
        const keyAssumptions = document.querySelector('.key-assumptions-container') as HTMLElement;
        
        if (sensitivity) slide2.appendChild(sensitivity.cloneNode(true));
        if (keyAssumptions) slide2.appendChild(keyAssumptions.cloneNode(true));
        document.body.appendChild(slide2);

        // Slide 3: Executive Summary Part 1 (Pre-Ema and Post-Ema)
        const slide3 = document.createElement('div');
        slide3.id = 'pdf-slide-3';
        slide3.className = 'p-6 bg-white';
        
        const summary = document.querySelector('.executive-summary-container') as HTMLElement;
        if (summary) {
          const summaryClone = summary.cloneNode(true) as HTMLElement;
          const table = summaryClone.querySelector('table');
          if (table) {
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

        // Slide 4: Executive Summary Part 2 (Additional Savings and All-In)
        const slide4 = document.createElement('div');
        slide4.id = 'pdf-slide-4';
        slide4.className = 'p-6 bg-white';
        
        if (summary) {
          const summaryClone2 = summary.cloneNode(true) as HTMLElement;
          const table2 = summaryClone2.querySelector('table');
          if (table2) {
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

        // Slide 5: Glossary
        const slide5 = document.createElement('div');
        slide5.id = 'pdf-slide-5';
        slide5.className = 'p-8 bg-white';
        
        const glossary = document.querySelector('.glossary-container') as HTMLElement;
        if (glossary) slide5.appendChild(glossary.cloneNode(true));
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