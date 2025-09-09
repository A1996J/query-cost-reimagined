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

  return (
    <div className="print-report">
      {/* Page 1: Summary Cards + 3Y Savings Chart */}
      <section className="pdf-page">
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
        
        <div className="avoid-break">
          <SavingsWaterfallChart scenarioResults={scenarioResults} />
        </div>
      </section>

      {/* Page 2: Benefits Not Baked In + Sensitivity Analysis */}
      <section className="pdf-page">
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
        
        <div className="avoid-break">
          <SensitivityHeatmap scenarioResults={scenarioResults} scenarios={scenarios} />
        </div>
      </section>

      {/* Page 3: Executive Summary Table */}
      <section className="pdf-page">
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
        
        <div className="avoid-break">
          <SummaryTable scenarioResults={scenarioResults} scenarios={scenarios} />
        </div>
      </section>

      {/* Page 4+: Key Assumptions, Glossary, Other Assumptions */}
      <section className="pdf-page">
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
        
        <div className="assumptions-section">
          <KeyAssumptionsTable scenarios={scenarios} />
        </div>
        
        <div className="glossary-section">
          <GlossarySection />
        </div>
      </section>
    </div>
  );
};