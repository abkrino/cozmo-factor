import React from 'react';
import { ToolContainer } from './common';
import { BalancedScorecardData } from '../../types';

interface BalancedScorecardProps {
  onBack: () => void;
  data: BalancedScorecardData;
  updateData: (data: BalancedScorecardData) => void;
}

const BalancedScorecard: React.FC<BalancedScorecardProps> = ({ onBack, data, updateData }) => {
  const perspectives: { key: keyof BalancedScorecardData, title: string }[] = [
    { key: 'financial', title: 'المنظور المالي' },
    { key: 'customer', title: 'منظور العملاء' },
    { key: 'internalProcess', title: 'منظور العمليات الداخلية' },
    { key: 'learningGrowth', title: 'منظور التعلم والنمو' },
  ];

  const handleChange = (field: keyof BalancedScorecardData, value: string) => {
    updateData({ ...data, [field]: value });
  };
  
  return (
    <ToolContainer 
      title="بطاقة الأداء المتوازن" 
      onBack={onBack}
      description="إطار لإدارة الأداء الاستراتيجي يترجم رؤية الشركة إلى مجموعة من الأهداف والمقاييس عبر أربعة مناظير: المالية، العملاء، العمليات الداخلية، والتعلم والنمو."
    >
      <div className="grid grid-cols-2 gap-4">
        {perspectives.map(p => (
          <div key={p.key} className="bg-slate-50 p-4 rounded h-48">
            <h3 className="font-bold text-center mb-2">{p.title}</h3>
            <textarea 
              value={data[p.key]}
              onChange={e => handleChange(p.key, e.target.value)}
              className="w-full h-28 p-1 border rounded"
            ></textarea>
          </div>
        ))}
      </div>
    </ToolContainer>
  );
};
export default BalancedScorecard;
