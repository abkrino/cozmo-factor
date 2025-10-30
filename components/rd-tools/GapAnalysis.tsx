import React from 'react';
import { ToolContainer } from './common';
import { GapAnalysisData } from '../../types';

interface GapAnalysisProps {
  onBack: () => void;
  data: GapAnalysisData;
  updateData: (data: GapAnalysisData) => void;
}

const GapAnalysis: React.FC<GapAnalysisProps> = ({ onBack, data, updateData }) => {
  const handleChange = (field: keyof GapAnalysisData, value: string) => {
    updateData({ ...data, [field]: value });
  };
  
  return (
    <ToolContainer
      title="تحليل الفجوات"
      onBack={onBack}
      description="قارن بين حالتك الحالية وحالتك المستقبلية المرجوة لتحديد الفجوات ووضع خطة عمل لسدها."
    >
      <div className="space-y-6">
        <div>
          <h3 className="font-bold text-lg mb-2">الحالة الحالية</h3>
          <textarea
            value={data.currentState}
            onChange={(e) => handleChange('currentState', e.target.value)}
            className="w-full h-32 p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="أين نحن الآن؟"
          ></textarea>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-2">الحالة المستقبلية</h3>
          <textarea
            value={data.futureState}
            onChange={(e) => handleChange('futureState', e.target.value)}
            className="w-full h-32 p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="أين نريد أن نكون؟"
          ></textarea>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-2">الفجوة</h3>
          <textarea
            value={data.gap}
            onChange={(e) => handleChange('gap', e.target.value)}
            className="w-full h-32 p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="ما هي الاختلافات؟"
          ></textarea>
        </div>
         <div>
          <h3 className="font-bold text-lg mb-2">الإجراءات المقترحة</h3>
          <textarea
            value={data.actions}
            onChange={(e) => handleChange('actions', e.target.value)}
            className="w-full h-32 p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="كيف سنسد الفجوة؟"
          ></textarea>
        </div>
      </div>
    </ToolContainer>
  );
};

export default GapAnalysis;
