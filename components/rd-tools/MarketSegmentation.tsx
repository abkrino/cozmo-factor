import React from 'react';
import { ToolContainer } from './common';
import { MarketSegmentationData } from '../../types';

interface MarketSegmentationProps {
  onBack: () => void;
  data: MarketSegmentationData;
  updateData: (data: MarketSegmentationData) => void;
}

const MarketSegmentation: React.FC<MarketSegmentationProps> = ({ onBack, data, updateData }) => {
  const segments = [
    { key: 'demographic', title: 'التقسيم الديموغرافي (العمر، الجنس، الدخل)' },
    { key: 'geographic', title: 'التقسيم الجغرافي (المدينة، المنطقة، البلد)' },
    { key: 'psychographic', title: 'التقسيم النفسي (نمط الحياة، القيم، الاهتمامات)' },
    { key: 'behavioral', title: 'التقسيم السلوكي (عادات الشراء، الولاء للعلامة التجارية)' },
  ] as const;

  const handleChange = (field: keyof MarketSegmentationData, value: string) => {
    updateData({ ...data, [field]: value });
  };

  return (
    <ToolContainer 
      title="تجزئة السوق" 
      onBack={onBack}
      description="بدل ما تتعامل مع السوق كله كأنه حاجة واحدة، الأداة دي بتساعدك تقسمه ل شرايح أو مجموعات أصغر من العملاء ليهم صفات مشتركة (زي السن، المكان، الاهتمامات). ده بيخليك تقدر تستهدف كل شريحة برسالة ومنتج يناسبها أكتر."
    >
      <div className="space-y-6">
        {segments.map(segment => (
          <div key={segment.key}>
            <h3 className="text-lg font-bold text-slate-800">{segment.title}</h3>
            <textarea
              value={data[segment.key]}
              onChange={(e) => handleChange(segment.key, e.target.value)}
              className="mt-2 w-full h-24 p-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={`صف شريحة السوق بناءً على ${segment.title}...`}
            ></textarea>
          </div>
        ))}
      </div>
    </ToolContainer>
  );
};

export default MarketSegmentation;
