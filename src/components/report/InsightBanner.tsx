import React from 'react';
import { AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { InsightType } from '@/lib/insightEngine';

interface InsightBannerProps {
  type: InsightType;
  text: string;
}

export const InsightBanner: React.FC<InsightBannerProps> = ({ type, text }) => {
  const getIcon = () => {
    switch (type) {
      case 'positive':
        return <CheckCircle className="h-5 w-5" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5" />;
      case 'neutral':
      default:
        return <TrendingUp className="h-5 w-5" />;
    }
  };

  const getBannerClasses = () => {
    const baseClasses = "insight-banner flex items-center gap-3 p-4 rounded-lg mb-6 avoid-break";
    
    switch (type) {
      case 'positive':
        return `${baseClasses} bg-green-50 border border-green-200 text-green-800`;
      case 'warning':
        return `${baseClasses} bg-amber-50 border border-amber-200 text-amber-800`;
      case 'neutral':
      default:
        return `${baseClasses} bg-blue-50 border border-blue-200 text-blue-800`;
    }
  };

  return (
    <div className={getBannerClasses()}>
      {getIcon()}
      <div className="flex-1">
        <p className="font-medium text-sm leading-relaxed">{text}</p>
      </div>
    </div>
  );
};