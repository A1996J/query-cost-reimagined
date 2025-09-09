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

interface NewReportPrintViewProps {
  scenarioResults: ScenarioResults;
  scenarios: ScenarioInputs;
  industry: string;
  useCase?: string;
}

export const NewReportPrintView: React.FC<NewReportPrintViewProps> = ({ 
  scenarioResults, 
  scenarios, 
  industry,
  useCase 
}) => {
  const glossaryTerms = [
    {
      term: "Direct Savings",
      description: "Cost reductions directly attributable to EMA implementation, including reduced labor costs and operational efficiencies."
    },
    {
      term: "Additional Savings", 
      description: "Secondary benefits including improved compliance, reduced training costs, and enhanced customer satisfaction."
    },
    {
      term: "All-In Savings",
      description: "Total combined savings from both direct and additional benefits, minus EMA implementation and operational costs."
    },
    {
      term: "EMA Containment Rate",
      description: "Percentage of customer queries successfully resolved by the EMA without human intervention."
    },
    {
      term: "Human Productivity Gains",
      description: "Efficiency improvements in human agents due to EMA assistance and reduced workload."
    },
    {
      term: "ROI Multiple",
      description: "Return on investment calculated as total savings divided by total investment over the analysis period."
    },
    {
      term: "Payback Period",
      description: "Time required for cumulative savings to equal the initial investment in EMA technology."
    }
  ];

  const otherAssumptions = [
    "Implementation costs are spread evenly over the first 12 months",
    "Human agent salaries include benefits and overhead at 1.3x base salary",
    "EMA operational costs scale linearly with query volume",
    "No significant changes in customer query patterns over the analysis period",
    "Technology infrastructure costs remain stable throughout the period",
    "Training and change management costs are one-time expenses in Year 1",
    "Compliance savings assume reduction in manual audit and review processes",
    "Customer satisfaction improvements translate to measurable retention benefits"
  ];

  return (
    <div className="print-report">
      {/* Page 1: Savings Overview */}
      <section className="pdf-page">
        <div className="page-header">
          <div className="logo-section">
            <img src={emaLogo} alt="EMA Logo" className="logo" />
            <div className="header-text">
              <h1>EMA ROI Analysis</h1>
              <p className="subtitle">Savings Overview & Financial Impact</p>
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

      {/* Page 2: Performance Metrics & Benefits */}
      <section className="pdf-page">
        <div className="page-header">
          <div className="logo-section">
            <img src={emaLogo} alt="EMA Logo" className="logo" />
            <div className="header-text">
              <h1>Performance Metrics & Additional Benefits</h1>
              <p className="subtitle">KPIs and Unquantified Value Drivers</p>
            </div>
          </div>
          <div className="date">Page 2 of 7</div>
        </div>

        <div className="avoid-break kpi-section">
          <ReportKeyPerformanceIndicators scenarioResults={scenarioResults} scenarios={scenarios} />
        </div>
        
        <div className="avoid-break benefits-section">
          <AdditionalBenefitsSection industry={industry} />
        </div>
      </section>

      {/* Page 3: Analysis & Assumptions */}
      <section className="pdf-page">
        <div className="page-header">
          <div className="logo-section">
            <img src={emaLogo} alt="EMA Logo" className="logo" />
            <div className="header-text">
              <h1>Risk Analysis & Model Assumptions</h1>
              <p className="subtitle">Sensitivity Analysis & Input Parameters</p>
            </div>
          </div>
          <div className="date">Page 3 of 7</div>
        </div>

        <div className="avoid-break sensitivity-section">
          <SensitivityHeatmap scenarioResults={scenarioResults} scenarios={scenarios} />
        </div>
        
        <div className="avoid-break assumptions-section">
          <KeyAssumptionsTable scenarios={scenarios} />
        </div>
      </section>

      {/* Page 4: Executive Summary Part 1 */}
      <section className="pdf-page">
        <div className="page-header">
          <div className="logo-section">
            <img src={emaLogo} alt="EMA Logo" className="logo" />
            <div className="header-text">
              <h1>Executive Summary - Part 1</h1>
              <p className="subtitle">Cost Structure & Performance Metrics</p>
            </div>
          </div>
          <div className="date">Page 4 of 7</div>
        </div>
        
        <div className="table-wrapper avoid-break executive-summary-part1">
          <ExecutiveSummaryPart1 scenarioResults={scenarioResults} scenarios={scenarios} />
        </div>
      </section>

      {/* Page 5: Executive Summary Part 2 */}
      <section className="pdf-page">
        <div className="page-header">
          <div className="logo-section">
            <img src={emaLogo} alt="EMA Logo" className="logo" />
            <div className="header-text">
              <h1>Executive Summary - Part 2</h1>
              <p className="subtitle">Savings Breakdown & Impact Analysis</p>
            </div>
          </div>
          <div className="date">Page 5 of 7</div>
        </div>
        
        <div className="table-wrapper avoid-break executive-summary-part2">
          <ExecutiveSummaryPart2 scenarioResults={scenarioResults} scenarios={scenarios} />
        </div>
      </section>

      {/* Page 6: Glossary */}
      <section className="pdf-page">
        <div className="page-header">
          <div className="logo-section">
            <img src={emaLogo} alt="EMA Logo" className="logo" />
            <div className="header-text">
              <h1>Glossary</h1>
              <p className="subtitle">Key Terms & Definitions</p>
            </div>
          </div>
          <div className="date">Page 6 of 7</div>
        </div>
        
        <div className="table-wrapper glossary-section">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Key Terms and Definitions</h3>
            </div>
            <div className="card-content">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left font-semibold">Term</th>
                      <th className="text-left font-semibold">Definition</th>
                    </tr>
                  </thead>
                  <tbody>
                    {glossaryTerms.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                        <td className="font-medium">{item.term}</td>
                        <td>{item.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Page 7: Additional Assumptions */}
      <section className="pdf-page">
        <div className="page-header">
          <div className="logo-section">
            <img src={emaLogo} alt="EMA Logo" className="logo" />
            <div className="header-text">
              <h1>Additional Assumptions</h1>
              <p className="subtitle">Other Assumptions Used in Calculations</p>
            </div>
          </div>
          <div className="date">Page 7 of 7</div>
        </div>
        
        <div className="table-wrapper assumptions-section">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Other Assumptions Used in Calculations</h3>
            </div>
            <div className="card-content">
              <ul className="space-y-3">
                {otherAssumptions.map((assumption, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-finance-primary mr-3 mt-1">•</span>
                    <span className="text-sm">{assumption}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};