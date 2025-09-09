import React from 'react';
import { Card } from '@/components/ui/card';
import { CheckCircle, Gift } from 'lucide-react';

interface AdditionalBenefitsSectionProps {
  industry: string;
}

export const AdditionalBenefitsSection: React.FC<AdditionalBenefitsSectionProps> = ({ industry }) => {
  if (industry !== 'Banking and Financial Services') {
    return null;
  }

  const benefits = [
    'Reduced customer churn from no wait times and 24/7 availability',
    'Increased CSAT from consistent experience',
    'Reduction in branch visits',
    'Avoided cancellations from real understanding of core issue',
    'Long-term savings from agent use in other business areas'
  ];

  return (
    <Card className="p-6 shadow-soft">
      <h2 className="text-2xl font-bold mb-6 text-finance-primary flex items-center gap-2">
        <Gift className="h-6 w-6" />
        Benefits Not Baked In
      </h2>
      <div className="space-y-4">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <p className="text-muted-foreground">{benefit}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};