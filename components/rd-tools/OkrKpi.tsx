import React from 'react';
import { ToolContainer } from './common';
import { OkrKpiData } from '../../types';

interface OkrKpiProps {
  onBack: () => void;
  data: OkrKpiData;
  updateData: (data: OkrKpiData) => void;
}

const OkrKpi: React.FC<OkrKpiProps> = ({ onBack, data, updateData }) => {
  const handleChange = (field: keyof OkrKpiData, value: string) => {
    updateData({ ...data, [field]: value });
  };
  
  return (
    <ToolContainer 
      title="الأهداف والنتائج الرئيسية (OKR)" 
      onBack={onBack}
      description="دي طريقة عشان تحدد أهداف كبيرة وطموحة (Objectives) وتربطها بنتائج محددة وقابلة للقياس (Key Results). بتساعد الفريق كله يركز على نفس الحاجة ويعرفوا هما وصلوا لفين بالظبط."
    >
      <div className="space-y-4">
        <div>
          <label className="font-bold">الهدف (Objective):</label>
          <input 
            type="text" 
            value={data.objective}
            onChange={e => handleChange('objective', e.target.value)}
            className="w-full mt-1 p-2 border rounded-md" 
            placeholder="مثال: أن نكون العلامة التجارية المفضلة في السوق"
          />
        </div>
        <div>
          <label className="font-bold">النتيجة الرئيسية 1 (Key Result 1):</label>
          <input 
            type="text" 
            value={data.keyResult1}
            onChange={e => handleChange('keyResult1', e.target.value)}
            className="w-full mt-1 p-2 border rounded-md" 
            placeholder="مثال: زيادة المبيعات بنسبة 20%"
          />
        </div>
        <div>
          <label className="font-bold">النتيجة الرئيسية 2 (Key Result 2):</label>
          <input 
            type="text" 
            value={data.keyResult2}
            onChange={e => handleChange('keyResult2', e.target.value)}
            className="w-full mt-1 p-2 border rounded-md" 
            placeholder="مثال: الحصول على 1000 تقييم 5 نجوم"
          />
        </div>
         <div>
          <label className="font-bold">النتيجة الرئيسية 3 (Key Result 3):</label>
          <input 
            type="text" 
            value={data.keyResult3}
            onChange={e => handleChange('keyResult3', e.target.value)}
            className="w-full mt-1 p-2 border rounded-md" 
          />
        </div>
      </div>
    </ToolContainer>
  );
};

export default OkrKpi;
