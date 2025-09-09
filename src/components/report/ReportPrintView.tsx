import React from 'react';
import { SavingsStickers } from '@/components/calculator/SavingsStickers';
import { SavingsWaterfallChart } from '@/components/calculator/SavingsWaterfallChart';
import { SensitivityHeatmap } from '@/components/calculator/SensitivityHeatmap';
import { SummaryTable } from '@/components/calculator/SummaryTable';
import { KeyAssumptionsTable } from '@/components/calculator/KeyAssumptionsTable';
import { AdditionalBenefitsSection } from '@/components/calculator/AdditionalBenefitsSection';
import { GlossarySection } from '@/components/calculator/GlossarySection';
import { InsightBanner } from './InsightBanner';
import { ScenarioResults, ScenarioInputs } from '@/types/ema-calculator';
import { generateInsights, InsightType } from '@/lib/insightEngine';
import emaLogo from '@/assets/ema-logo.png';

interface ReportPrintViewProps {
  scenarioResults: ScenarioResults;
  scenarios: ScenarioInputs;
  industry: string;
}

export const ReportPrintView: React.FC<ReportPrintViewProps> = ({ 
  scenarioResults, 
  scenarios, 
  industry 
}) => {
  const insights = generateInsights(scenarioResults, scenarios);

  React.useEffect(() => {
    // Wait for all content to be ready before signaling PDF readiness
    const prepareForPrint = async () => {
      try {
        // Wait for fonts to load
        if (document.fonts && document.fonts.ready) {
          await document.fonts.ready;
        }
        
        // Wait for images to load
        const images = Array.from(document.images);
        await Promise.all(
          images.map(img => 
            img.complete ? Promise.resolve() : new Promise(resolve => {
              img.onload = resolve;
              img.onerror = resolve;
            })
          )
        );
        
        // Wait for charts to stabilize
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Set charts ready flag
        (window as any).__chartsReady = true;
        
        // Signal that report is ready
        (window as any).reportReady = true;
        window.dispatchEvent(new Event('report:ready'));
      } catch (error) {
        console.warn('Print preparation warning:', error);
        // Signal ready anyway after timeout
        setTimeout(() => {
          (window as any).__chartsReady = true;
          (window as any).reportReady = true;
          window.dispatchEvent(new Event('report:ready'));
        }, 3000);
      }
    };

    prepareForPrint();
  }, [scenarioResults, scenarios, industry]);

  return (
    <div className="print-report">
      {/* Page 1: Summary Cards + 3Y Savings Chart */}
      <section id="pdf-page-1" className="pdf-page">
        <div className="page-header">
          <div className="logo-section">
            <img src={emaLogo} alt="EMA Logo" className="logo" />
            <div className="header-text">
              <h1>EMA ROI Analysis</h1>
              <p className="subtitle">Executive Summary & Financial Impact</p>
            </div>
          </div>
          <div className="date">Generated {new Date().toLocaleDateString()}</div>
        </div>
        
        <InsightBanner 
          type={insights.summaryInsight.type} 
          text={insights.summaryInsight.text}
        />
        
        <div className="avoid-break">
          <SavingsStickers scenarioResults={scenarioResults} />
        </div>
        
        <div className="avoid-break chart-container">
          <SavingsWaterfallChart scenarioResults={scenarioResults} />
        </div>
      </section>

      {/* Page 2: Benefits Not Baked In + Sensitivity Analysis */}
      <section id="pdf-page-2" className="pdf-page">
        <div className="page-header">
          <div className="logo-section">
            <img src={emaLogo} alt="EMA Logo" className="logo" />
            <div className="header-text">
              <h1>Risk Analysis & Additional Benefits</h1>
              <p className="subtitle">Sensitivity Analysis & Unquantified Value Drivers</p>
            </div>
          </div>
          <div className="date">Page 2</div>
        </div>

        <InsightBanner 
          type={insights.sensitivityInsight.type} 
          text={insights.sensitivityInsight.text}
        />

        <div className="avoid-break">
          <AdditionalBenefitsSection industry={industry} />
        </div>
        
        <div className="avoid-break chart-container">
          <SensitivityHeatmap scenarioResults={scenarioResults} scenarios={scenarios} />
        </div>
      </section>

      {/* Page 3: Executive Summary Table */}
      <section id="pdf-page-3" className="pdf-page">
        <div className="page-header">
          <div className="logo-section">
            <img src={emaLogo} alt="EMA Logo" className="logo" />
            <div className="header-text">
              <h1>Detailed Financial Analysis</h1>
              <p className="subtitle">Year-by-Year Impact & Comprehensive Metrics</p>
            </div>
          </div>
          <div className="date">Page 3</div>
        </div>

        <InsightBanner 
          type={insights.executiveSummaryInsight.type} 
          text={insights.executiveSummaryInsight.text}
        />
        
        <div className="table-wrapper avoid-break exec-summary">
          <SummaryTable scenarioResults={scenarioResults} scenarios={scenarios} />
        </div>
      </section>

      {/* Page 4+: Key Assumptions, Glossary, Other Assumptions */}
      <section id="pdf-page-4" className="pdf-page">
        <div className="page-header">
          <div className="logo-section">
            <img src={emaLogo} alt="EMA Logo" className="logo" />
            <div className="header-text">
              <h1>Model Assumptions & Methodology</h1>
              <p className="subtitle">Input Parameters & Calculation Framework</p>
            </div>
          </div>
          <div className="date">Page 4</div>
        </div>

        <InsightBanner 
          type={insights.assumptionsInsight.type} 
          text={insights.assumptionsInsight.text}
        />
        
        <div className="table-wrapper">
          <KeyAssumptionsTable scenarios={scenarios} />
        </div>
        
        <div className="table-wrapper">
          <GlossarySection />
        </div>
      </section>
    </div>
  );
};