import React from 'react';
import { ScenarioResults, ScenarioInputs } from '@/types/ema-calculator';

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
  // Helper functions for formatting
  const formatCurrency = (value: number) => {
    return `$${(value / 1000000).toFixed(1)}M`;
  };

  const formatNumber = (value: number) => {
    return value.toLocaleString();
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const formatComplianceCost = (value: number) => {
    return `$${(value / 1000000).toFixed(1)}M`;
  };

  // Calculate derived values
  const calculateDerivedValues = (inputs: any) => {
    const totalReps = Math.ceil(
      (inputs.monthlyQueryVolume * 12 * inputs.averageHandlingTime / 60) /
      (40 * 52 * (1 - inputs.capacityBuffer / 100))
    );
    return {
      totalReps,
      repCostPerYear: inputs.averageAnnualSalary * inputs.benefitsMultiplier * totalReps,
      outsourcingCostPerYear: inputs.averageAnnualSalary * inputs.benefitsMultiplier * inputs.partnerOverheadMultiplier * totalReps
    };
  };

  const baseValues = calculateDerivedValues(scenarios.base);
  const bullValues = calculateDerivedValues(scenarios.bull);

  // Calculate KPIs
  const calculatePaybackPeriod = (results: any) => {
    const implementationCost = results.implementationCost;
    let cumulativeSavings = 0;
    
    for (let i = 0; i < results.yearlyBreakdown.length; i++) {
      cumulativeSavings += results.yearlyBreakdown[i].allInSavings;
      if (cumulativeSavings >= implementationCost) {
        return i + 1;
      }
    }
    return results.yearlyBreakdown.length;
  };

  const calculateROI = (results: any) => {
    return results.totalAllInSavings / results.implementationCost;
  };

  const calculateAverageAnnualSavings = (results: any) => {
    return results.totalAllInSavings / 3;
  };

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

  const pageHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '2px solid #f3f4f6',
  };

  const logoSectionStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  };

  const logoStyle = {
    height: '40px',
    width: 'auto',
  };

  const h1Style = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: '0',
  };

  const subtitleStyle = {
    fontSize: '14px',
    color: '#6b7280',
    margin: '0',
  };

  const dateStyle = {
    fontSize: '12px',
    color: '#6b7280',
  };

  const cardStyle = {
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '20px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  };

  const cardHeaderStyle = {
    marginBottom: '16px',
  };

  const cardTitleStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: '0',
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse' as const,
    fontSize: '14px',
  };

  const thStyle = {
    textAlign: 'left' as const,
    fontWeight: 'bold',
    padding: '12px',
    borderBottom: '2px solid #e5e7eb',
    backgroundColor: '#f9fafb',
  };

  const tdStyle = {
    padding: '12px',
    borderBottom: '1px solid #e5e7eb',
  };

  const stickerStyle = {
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '20px',
    textAlign: 'center' as const,
    marginBottom: '16px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  };

  const stickerValueStyle = {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#059669',
    margin: '0',
  };

  const stickerLabelStyle = {
    fontSize: '14px',
    color: '#6b7280',
    margin: '8px 0 0 0',
  };

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', backgroundColor: 'white', color: '#1f2937' }}>
      <style>{`
        .pdf-page {
          width: 210mm;
          min-height: 297mm;
          padding: 20mm;
          background: white;
          box-sizing: border-box;
          page-break-after: always;
        }
        .pdf-page:last-child {
          page-break-after: avoid;
        }
        @media print {
          .pdf-page {
            margin: 0;
            box-shadow: none;
            page-break-after: always;
          }
        }
      `}</style>

      {/* Page 1: Savings Overview */}
      <div className="pdf-page">
        <div style={pageHeaderStyle}>
          <div style={logoSectionStyle}>
            <div>
              <h1 style={h1Style}>EMA ROI Analysis</h1>
              <p style={subtitleStyle}>Savings Overview & Financial Impact</p>
            </div>
          </div>
          <div style={dateStyle}>Generated {new Date().toLocaleDateString()}</div>
        </div>
        
        {/* Savings Stickers */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '30px' }}>
          <div style={stickerStyle}>
            <h2 style={stickerValueStyle}>{formatCurrency(scenarioResults.bull.totalAllInSavings)}</h2>
            <p style={stickerLabelStyle}>3-Year Expected Savings</p>
          </div>
          <div style={stickerStyle}>
            <h2 style={stickerValueStyle}>{formatCurrency(scenarioResults.bull.totalSavings)}</h2>
            <p style={stickerLabelStyle}>Direct Savings</p>
          </div>
          <div style={stickerStyle}>
            <h2 style={stickerValueStyle}>{formatCurrency(scenarioResults.bull.totalAdditionalSavings)}</h2>
            <p style={stickerLabelStyle}>Additional Savings</p>
          </div>
        </div>

        {/* Waterfall Chart Placeholder */}
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <h3 style={cardTitleStyle}>Savings Waterfall Analysis</h3>
          </div>
          <div style={{ height: '300px', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' }}>
            <p style={{ color: '#6b7280', fontSize: '16px' }}>Waterfall Chart - Showing progression from baseline costs to net savings</p>
          </div>
        </div>
      </div>

      {/* Page 2: Performance Metrics & Benefits */}
      <div className="pdf-page">
        <div style={pageHeaderStyle}>
          <div style={logoSectionStyle}>
            <div>
              <h1 style={h1Style}>Performance Metrics & Additional Benefits</h1>
              <p style={subtitleStyle}>KPIs and Unquantified Value Drivers</p>
            </div>
          </div>
          <div style={dateStyle}>Page 2 of 7</div>
        </div>

        {/* KPIs */}
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <h3 style={cardTitleStyle}>Key Performance Indicators</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '4px' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#059669' }}>
                {calculatePaybackPeriod(scenarioResults.bull)} years
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>Payback Period</div>
            </div>
            <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '4px' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#059669' }}>
                {calculateROI(scenarioResults.bull).toFixed(1)}x
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>ROI Multiple</div>
            </div>
            <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '4px' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#059669' }}>
                {formatCurrency(calculateAverageAnnualSavings(scenarioResults.bull))}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>Average Annual Savings</div>
            </div>
          </div>
        </div>
        
        {/* Benefits Not Baked In */}
        {industry === 'Banking and Financial Services' && (
          <div style={cardStyle}>
            <div style={cardHeaderStyle}>
              <h3 style={cardTitleStyle}>Benefits Not Baked In</h3>
            </div>
            <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span style={{ color: '#059669', marginRight: '12px', fontSize: '16px' }}>✓</span>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Reduced customer churn from no wait times and 24/7 availability</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span style={{ color: '#059669', marginRight: '12px', fontSize: '16px' }}>✓</span>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Increased CSAT from consistent experience</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span style={{ color: '#059669', marginRight: '12px', fontSize: '16px' }}>✓</span>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Reduction in branch visits</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span style={{ color: '#059669', marginRight: '12px', fontSize: '16px' }}>✓</span>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Avoided cancellations from real understanding of core issue</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span style={{ color: '#059669', marginRight: '12px', fontSize: '16px' }}>✓</span>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Long-term savings from agent use in other business areas</span>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Page 3: Analysis & Assumptions */}
      <div className="pdf-page">
        <div style={pageHeaderStyle}>
          <div style={logoSectionStyle}>
            <div>
              <h1 style={h1Style}>Risk Analysis & Model Assumptions</h1>
              <p style={subtitleStyle}>Sensitivity Analysis & Input Parameters</p>
            </div>
          </div>
          <div style={dateStyle}>Page 3 of 7</div>
        </div>

        {/* Range of Possible Savings */}
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <h3 style={cardTitleStyle}>Range of Possible Direct Savings</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
            <div>
              <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px', color: '#1f2937' }}>Conservative Scenario</h4>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#059669' }}>
                {formatCurrency(scenarioResults.base.totalSavings)}
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px', color: '#1f2937' }}>Expected Scenario</h4>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#059669' }}>
                {formatCurrency(scenarioResults.bull.totalSavings)}
              </div>
            </div>
          </div>
        </div>
        
        {/* Key Assumptions Table */}
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <h3 style={cardTitleStyle}>Key Assumptions</h3>
          </div>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Assumption</th>
                <th style={thStyle}>Conservative-Expected</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={tdStyle}>Monthly Query Volume</td>
                <td style={tdStyle}>{formatNumber(scenarios.base.monthlyQueryVolume)} - {formatNumber(scenarios.bull.monthlyQueryVolume)}</td>
              </tr>
              <tr style={{ backgroundColor: '#f9fafb' }}>
                <td style={tdStyle}>Average Handling Time (minutes)</td>
                <td style={tdStyle}>{scenarios.base.averageHandlingTime} - {scenarios.bull.averageHandlingTime}</td>
              </tr>
              <tr>
                <td style={tdStyle}>Final Year Containment Rate</td>
                <td style={tdStyle}>{formatPercentage(scenarios.base.finalYearContainmentRate)} - {formatPercentage(scenarios.bull.finalYearContainmentRate)}</td>
              </tr>
              <tr style={{ backgroundColor: '#f9fafb' }}>
                <td style={tdStyle}>Year 1 Productivity Gain</td>
                <td style={tdStyle}>{formatPercentage(scenarios.base.year1ProductivityGain)} - {formatPercentage(scenarios.bull.year1ProductivityGain)}</td>
              </tr>
              <tr>
                <td style={tdStyle}>EMA Price per Query</td>
                <td style={tdStyle}>${scenarios.base.emaPricePerQuery} - ${scenarios.bull.emaPricePerQuery}</td>
              </tr>
              <tr style={{ backgroundColor: '#f9fafb' }}>
                <td style={tdStyle}>Implementation Cost</td>
                <td style={tdStyle}>{formatCurrency(scenarios.base.implementationCost)} - {formatCurrency(scenarios.bull.implementationCost)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Page 4: Executive Summary Part 1 */}
      <div className="pdf-page">
        <div style={pageHeaderStyle}>
          <div style={logoSectionStyle}>
            <div>
              <h1 style={h1Style}>Executive Summary - Part 1</h1>
              <p style={subtitleStyle}>Cost Structure & Performance Metrics</p>
            </div>
          </div>
          <div style={dateStyle}>Page 4 of 7</div>
        </div>
        
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <h3 style={cardTitleStyle}>3-Year Financial Breakdown</h3>
          </div>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Metric</th>
                <th style={thStyle}>Year 1</th>
                <th style={thStyle}>Year 2</th>
                <th style={thStyle}>Year 3</th>
                <th style={thStyle}>Total</th>
              </tr>
            </thead>
            <tbody>
              {scenarioResults.bull.yearlyBreakdown.map((year, index) => (
                <React.Fragment key={index}>
                  {index === 0 && (
                    <>
                      <tr>
                        <td style={tdStyle}>Pre-EMA Cost</td>
                        <td style={tdStyle}>{formatCurrency(year.preEMACost)}</td>
                        <td style={tdStyle}>{formatCurrency(scenarioResults.bull.yearlyBreakdown[1]?.preEMACost || 0)}</td>
                        <td style={tdStyle}>{formatCurrency(scenarioResults.bull.yearlyBreakdown[2]?.preEMACost || 0)}</td>
                        <td style={tdStyle}>{formatCurrency(scenarioResults.bull.yearlyBreakdown.reduce((sum, y) => sum + y.preEMACost, 0))}</td>
                      </tr>
                      <tr style={{ backgroundColor: '#f9fafb' }}>
                        <td style={tdStyle}>Post-EMA Cost</td>
                        <td style={tdStyle}>{formatCurrency(year.postEMACost)}</td>
                        <td style={tdStyle}>{formatCurrency(scenarioResults.bull.yearlyBreakdown[1]?.postEMACost || 0)}</td>
                        <td style={tdStyle}>{formatCurrency(scenarioResults.bull.yearlyBreakdown[2]?.postEMACost || 0)}</td>
                        <td style={tdStyle}>{formatCurrency(scenarioResults.bull.yearlyBreakdown.reduce((sum, y) => sum + y.postEMACost, 0))}</td>
                      </tr>
                      <tr>
                        <td style={tdStyle}>Direct Savings</td>
                        <td style={tdStyle}>{formatCurrency(year.savings)}</td>
                        <td style={tdStyle}>{formatCurrency(scenarioResults.bull.yearlyBreakdown[1]?.savings || 0)}</td>
                        <td style={tdStyle}>{formatCurrency(scenarioResults.bull.yearlyBreakdown[2]?.savings || 0)}</td>
                        <td style={tdStyle}>{formatCurrency(scenarioResults.bull.totalSavings)}</td>
                      </tr>
                      <tr style={{ backgroundColor: '#f9fafb' }}>
                        <td style={tdStyle}>Additional Savings</td>
                        <td style={tdStyle}>{formatCurrency(year.totalAdditionalSavings)}</td>
                        <td style={tdStyle}>{formatCurrency(scenarioResults.bull.yearlyBreakdown[1]?.totalAdditionalSavings || 0)}</td>
                        <td style={tdStyle}>{formatCurrency(scenarioResults.bull.yearlyBreakdown[2]?.totalAdditionalSavings || 0)}</td>
                        <td style={tdStyle}>{formatCurrency(scenarioResults.bull.totalAdditionalSavings)}</td>
                      </tr>
                      <tr>
                        <td style={{ ...tdStyle, fontWeight: 'bold' }}>All-In Savings</td>
                        <td style={{ ...tdStyle, fontWeight: 'bold' }}>{formatCurrency(year.allInSavings)}</td>
                        <td style={{ ...tdStyle, fontWeight: 'bold' }}>{formatCurrency(scenarioResults.bull.yearlyBreakdown[1]?.allInSavings || 0)}</td>
                        <td style={{ ...tdStyle, fontWeight: 'bold' }}>{formatCurrency(scenarioResults.bull.yearlyBreakdown[2]?.allInSavings || 0)}</td>
                        <td style={{ ...tdStyle, fontWeight: 'bold' }}>{formatCurrency(scenarioResults.bull.totalAllInSavings)}</td>
                      </tr>
                    </>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Page 5: Executive Summary Part 2 */}
      <div className="pdf-page">
        <div style={pageHeaderStyle}>
          <div style={logoSectionStyle}>
            <div>
              <h1 style={h1Style}>Executive Summary - Part 2</h1>
              <p style={subtitleStyle}>Savings Breakdown & Impact Analysis</p>
            </div>
          </div>
          <div style={dateStyle}>Page 5 of 7</div>
        </div>
        
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <h3 style={cardTitleStyle}>Performance Metrics by Year</h3>
          </div>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Metric</th>
                <th style={thStyle}>Year 1</th>
                <th style={thStyle}>Year 2</th>
                <th style={thStyle}>Year 3</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={tdStyle}>EMA Containment Rate</td>
                <td style={tdStyle}>{formatPercentage(scenarioResults.bull.yearlyBreakdown[0]?.emaContainmentRate || 0)}</td>
                <td style={tdStyle}>{formatPercentage(scenarioResults.bull.yearlyBreakdown[1]?.emaContainmentRate || 0)}</td>
                <td style={tdStyle}>{formatPercentage(scenarioResults.bull.yearlyBreakdown[2]?.emaContainmentRate || 0)}</td>
              </tr>
              <tr style={{ backgroundColor: '#f9fafb' }}>
                <td style={tdStyle}>Productivity Gain</td>
                <td style={tdStyle}>{formatPercentage(scenarioResults.bull.yearlyBreakdown[0]?.productivityGain || 0)}</td>
                <td style={tdStyle}>{formatPercentage(scenarioResults.bull.yearlyBreakdown[1]?.productivityGain || 0)}</td>
                <td style={tdStyle}>{formatPercentage(scenarioResults.bull.yearlyBreakdown[2]?.productivityGain || 0)}</td>
              </tr>
              <tr>
                <td style={tdStyle}>Query Volume</td>
                <td style={tdStyle}>{formatNumber(scenarioResults.bull.yearlyBreakdown[0]?.queries || 0)}</td>
                <td style={tdStyle}>{formatNumber(scenarioResults.bull.yearlyBreakdown[1]?.queries || 0)}</td>
                <td style={tdStyle}>{formatNumber(scenarioResults.bull.yearlyBreakdown[2]?.queries || 0)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Page 6: Glossary */}
      <div className="pdf-page">
        <div style={pageHeaderStyle}>
          <div style={logoSectionStyle}>
            <div>
              <h1 style={h1Style}>Glossary</h1>
              <p style={subtitleStyle}>Key Terms & Definitions</p>
            </div>
          </div>
          <div style={dateStyle}>Page 6 of 7</div>
        </div>
        
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <h3 style={cardTitleStyle}>Key Terms and Definitions</h3>
          </div>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Term</th>
                <th style={thStyle}>Definition</th>
              </tr>
            </thead>
            <tbody>
              {glossaryTerms.map((item, index) => (
                <tr key={index} style={index % 2 === 0 ? { backgroundColor: '#f9fafb' } : {}}>
                  <td style={{ ...tdStyle, fontWeight: 'bold' }}>{item.term}</td>
                  <td style={tdStyle}>{item.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Page 7: Additional Assumptions */}
      <div className="pdf-page">
        <div style={pageHeaderStyle}>
          <div style={logoSectionStyle}>
            <div>
              <h1 style={h1Style}>Additional Assumptions</h1>
              <p style={subtitleStyle}>Other Assumptions Used in Calculations</p>
            </div>
          </div>
          <div style={dateStyle}>Page 7 of 7</div>
        </div>
        
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <h3 style={cardTitleStyle}>Other Assumptions Used in Calculations</h3>
          </div>
          <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
            {otherAssumptions.map((assumption, index) => (
              <li key={index} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span style={{ color: '#059669', marginRight: '12px', fontSize: '16px' }}>•</span>
                <span style={{ fontSize: '14px', color: '#374151' }}>{assumption}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};