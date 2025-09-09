import { ScenarioResults, ScenarioInputs } from '@/types/ema-calculator';

export type InsightType = 'positive' | 'neutral' | 'warning';

export interface Insight {
  type: InsightType;
  text: string;
}

export interface InsightCollection {
  summaryInsight: Insight;
  sensitivityInsight: Insight;
  executiveSummaryInsight: Insight;
  assumptionsInsight: Insight;
}

export const generateInsights = (
  scenarioResults: ScenarioResults, 
  scenarios: ScenarioInputs
): InsightCollection => {
  const base = scenarioResults.base;
  const bull = scenarioResults.bull;
  const baseInputs = scenarios.base;
  const bullInputs = scenarios.bull;

  // Calculate key metrics
  const baseROI = ((base.totalSavings * 3) / baseInputs.implementationCost) * 100;
  const bullROI = ((bull.totalSavings * 3) / bullInputs.implementationCost) * 100;
  const basePayback = baseInputs.implementationCost / base.totalSavings;
  const bullPayback = bullInputs.implementationCost / bull.totalSavings;

  // Summary insight
  const summaryInsight: Insight = (() => {
    if (baseROI > 300) {
      return {
        type: 'positive',
        text: `Exceptional ROI opportunity: Conservative case delivers ${baseROI.toFixed(0)}% ROI with ${basePayback.toFixed(1)}-year payback. EMA implementation presents compelling value creation with substantial cost reduction potential across customer service operations.`
      };
    } else if (baseROI > 150) {
      return {
        type: 'positive',
        text: `Strong business case: Conservative case projects ${baseROI.toFixed(0)}% ROI with ${basePayback.toFixed(1)}-year payback. EMA demonstrates clear financial benefits through operational efficiency and cost structure optimization.`
      };
    } else if (baseROI > 100) {
      return {
        type: 'neutral',
        text: `Moderate ROI potential: Conservative case shows ${baseROI.toFixed(0)}% ROI with ${basePayback.toFixed(1)}-year payback. EMA implementation offers positive returns with measured risk profile and steady value realization timeline.`
      };
    } else {
      return {
        type: 'warning',
        text: `Conservative projections: Conservative case indicates ${baseROI.toFixed(0)}% ROI with ${basePayback.toFixed(1)}-year payback. Consider optimizing implementation approach or reassessing key assumptions to enhance value proposition.`
      };
    }
  })();

  // Sensitivity insight
  const roiSpread = bullROI - baseROI;
  const sensitivityInsight: Insight = (() => {
    if (roiSpread > 200) {
      return {
        type: 'warning',
        text: `High sensitivity detected: ${roiSpread.toFixed(0)}% ROI variance between scenarios suggests significant execution risk. Focus on containment rate achievement and productivity realization to capture upside potential while mitigating downside exposure.`
      };
    } else if (roiSpread > 100) {
      return {
        type: 'neutral',
        text: `Moderate sensitivity observed: ${roiSpread.toFixed(0)}% ROI spread indicates balanced risk-reward profile. Success depends on effective change management and adoption curve optimization to realize projected containment rates.`
      };
    } else {
      return {
        type: 'positive',
        text: `Low sensitivity profile: ${roiSpread.toFixed(0)}% ROI variance demonstrates robust business case across scenarios. Conservative assumptions provide confidence in value delivery with limited execution risk.`
      };
    }
  })();

  // Executive summary insight
  const totalThreeYearSavings = base.totalSavings * 3;
  const directSavingsPercentage = ((base.totalSavings / (base.totalSavings + base.totalAdditionalSavings)) * 100).toFixed(0);
  const executiveSummaryInsight: Insight = {
    type: totalThreeYearSavings > 5000000 ? 'positive' : totalThreeYearSavings > 2000000 ? 'neutral' : 'warning',
    text: `Financial impact analysis reveals $${(totalThreeYearSavings / 1000000).toFixed(1)}M in conservative case 3-year savings. Key value drivers include direct agent cost reduction (${directSavingsPercentage}%), productivity gains, and operational efficiency improvements creating sustainable competitive advantage.`
  };

  // Assumptions insight
  const containmentRate = baseInputs.finalYearContainmentRate * 100;
  const assumptionsInsight: Insight = (() => {
    if (containmentRate > 80) {
      return {
        type: 'warning',
        text: `Aggressive containment assumptions: ${containmentRate.toFixed(0)}% final year rate requires exceptional implementation execution. Validate benchmarks against industry standards and ensure robust change management framework to achieve projected automation levels.`
      };
    } else if (containmentRate > 70) {
      return {
        type: 'neutral',
        text: `Balanced containment target: ${containmentRate.toFixed(0)}% final year rate aligns with industry best practices. Success requires structured rollout, continuous optimization, and stakeholder alignment to achieve sustainable automation adoption.`
      };
    } else {
      return {
        type: 'positive',
        text: `Conservative containment approach: ${containmentRate.toFixed(0)}% final year rate provides high confidence in achievability. Prudent assumptions create foundation for exceeding projections while minimizing implementation risk exposure.`
      };
    }
  })();

  return {
    summaryInsight,
    sensitivityInsight,
    executiveSummaryInsight,
    assumptionsInsight
  };
};