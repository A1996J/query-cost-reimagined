import React from 'react';
import { SavingsStickers } from '@/components/calculator/SavingsStickers';
import { SavingsWaterfallChart } from '@/components/calculator/SavingsWaterfallChart';
import { SensitivityHeatmap } from '@/components/calculator/SensitivityHeatmap';
import { KeyAssumptionsTable } from '@/components/calculator/KeyAssumptionsTable';
import { AdditionalBenefitsSection } from '@/components/calculator/AdditionalBenefitsSection';
import { GlossarySection } from '@/components/calculator/GlossarySection';
import { ReportKeyPerformanceIndicators } from '@/components/calculator/ReportKeyPerformanceIndicators';

import { ExecutiveSummaryPart1 } from '@/components/calculator/ExecutiveSummaryPart1';
import { ExecutiveSummaryPart2 } from '@/components/calculator/ExecutiveSummaryPart2';
import { ScenarioResults, ScenarioInputs } from '@/types/ema-calculator';
import emaLogo from '@/assets/ema-logo.png';

interface ReportPrintViewProps {
  scenarioResults: ScenarioResults;
  scenarios: ScenarioInputs;
  industry: string;
  useCase?: string;
}

export const ReportPrintView: React.FC<ReportPrintViewProps> = ({ 
  scenarioResults, 
  scenarios, 
  industry,
  useCase 
}) => {
  React.useEffect(() => {
    // Wait for all content to be ready before signaling PDF readiness
    const prepareForPrint = async () => {
      try {
        console.log('PDF preparation starting...');
        
        // Wait for fonts to load
        if (document.fonts && document.fonts.ready) {
          await document.fonts.ready;
          console.log('Fonts loaded');
        }
        
        // Wait for images to load
        const images = Array.from(document.images);
        console.log(`Waiting for ${images.length} images to load`);
        await Promise.all(
          images.map(img => 
            img.complete ? Promise.resolve() : new Promise(resolve => {
              img.onload = resolve;
              img.onerror = resolve;
            })
          )
        );
        console.log('All images loaded');
        
        // Wait for charts to stabilize
        await new Promise(resolve => setTimeout(resolve, 3000));
        console.log('Charts stabilized');
        
        // Set charts ready flag
        (window as any).__chartsReady = true;
        
        // Signal that report is ready
        (window as any).reportReady = true;
        window.dispatchEvent(new Event('report:ready'));
        console.log('Report ready signal dispatched');
      } catch (error) {
        console.warn('Print preparation warning:', error);
        // Signal ready anyway after timeout
        setTimeout(() => {
          (window as any).__chartsReady = true;
          (window as any).reportReady = true;
          window.dispatchEvent(new Event('report:ready'));
          console.log('Report ready signal dispatched after error');
        }, 4000);
      }
    };

    prepareForPrint();
  }, [scenarioResults, scenarios, industry]);

  return (
    <div className="print-report">
      {/* Page 1: All-in savings, Direct savings, Additional savings, Three-year savings summary */}
      <section id="pdf-page-1" className="pdf-page">
        <div className="page-header">
          <div className="logo-section">
            <img src={emaLogo} alt="EMA Logo" className="logo" />
            <div className="header-text">
              <h1>EMA ROI Analysis</h1>
              <p className="subtitle">Financial Impact Summary</p>
            </div>
          </div>
          <div className="date">Generated {new Date().toLocaleDateString()}</div>
        </div>
        
        <div className="avoid-break savings-stickers-section">
          <SavingsStickers scenarioResults={scenarioResults} />
        </div>
        
        <div className="avoid-break chart-container">
          <SavingsWaterfallChart scenarioResults={scenarioResults} useCase={useCase} />
        </div>
      </section>

      {/* Page 2: Key performance indicators, Benefits not baked in */}
      <section id="pdf-page-2" className="pdf-page">
        <div className="page-header">
          <div className="logo-section">
            <img src={emaLogo} alt="EMA Logo" className="logo" />
            <div className="header-text">
              <h1>Performance Metrics & Additional Benefits</h1>
              <p className="subtitle">KPIs and Unquantified Value Drivers</p>
            </div>
          </div>
          <div className="date">Page 2</div>
        </div>

        <div className="avoid-break kpi-section">
          <ReportKeyPerformanceIndicators scenarioResults={scenarioResults} scenarios={scenarios} />
        </div>
        
        
        <div className="avoid-break benefits-section">
          <AdditionalBenefitsSection industry={industry} />
        </div>
      </section>

      {/* Page 3: Direct savings sensitivities and key assumptions */}
      <section id="pdf-page-3" className="pdf-page">
        <div className="page-header">
          <div className="logo-section">
            <img src={emaLogo} alt="EMA Logo" className="logo" />
            <div className="header-text">
              <h1>Risk Analysis & Model Assumptions</h1>
              <p className="subtitle">Sensitivity Analysis & Input Parameters</p>
            </div>
          </div>
          <div className="date">Page 3</div>
        </div>

        <div className="avoid-break sensitivity-section">
          <SensitivityHeatmap scenarioResults={scenarioResults} scenarios={scenarios} />
        </div>
        
        <div className="avoid-break assumptions-section">
          <KeyAssumptionsTable scenarios={scenarios} />
        </div>
      </section>

      {/* Page 4: Executive summary (Part 1 - until reduction in human handling time) */}
      <section id="pdf-page-4" className="pdf-page">
        <div className="page-header">
          <div className="logo-section">
            <img src={emaLogo} alt="EMA Logo" className="logo" />
            <div className="header-text">
              <h1>Executive Summary - Part 1</h1>
              <p className="subtitle">Cost Structure & Performance Metrics</p>
            </div>
          </div>
          <div className="date">Page 4</div>
        </div>
        
        <div className="table-wrapper avoid-break executive-summary-part1">
          <ExecutiveSummaryPart1 scenarioResults={scenarioResults} scenarios={scenarios} />
        </div>
      </section>

      {/* Page 5: Executive summary continuation (Part 2 - from direct savings from EMA to percentage of baseline saved) */}
      <section id="pdf-page-5" className="pdf-page">
        <div className="page-header">
          <div className="logo-section">
            <img src={emaLogo} alt="EMA Logo" className="logo" />
            <div className="header-text">
              <h1>Executive Summary - Part 2</h1>
              <p className="subtitle">Savings Breakdown & Impact Analysis</p>
            </div>
          </div>
          <div className="date">Page 5</div>
        </div>
        
        <div className="table-wrapper avoid-break executive-summary-part2">
          <ExecutiveSummaryPart2 scenarioResults={scenarioResults} scenarios={scenarios} />
        </div>
      </section>

      {/* Page 6: Glossary and other assumptions used in calculations */}
      <section id="pdf-page-6" className="pdf-page">
        <div className="page-header">
          <div className="logo-section">
            <img src={emaLogo} alt="EMA Logo" className="logo" />
            <div className="header-text">
              <h1>Methodology & Definitions</h1>
              <p className="subtitle">Glossary & Calculation Framework</p>
            </div>
          </div>
          <div className="date">Page 6</div>
        </div>
        
        <div className="table-wrapper glossary-section">
          <GlossarySection />
        </div>
      </section>
    </div>
  );
};