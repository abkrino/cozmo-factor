import React from 'react';
import { ToolContainer } from './common';
import { AnsoffMatrixData } from '../../types';

interface AnsoffMatrixProps {
  onBack: () => void;
  data: AnsoffMatrixData;
  updateData: (data: AnsoffMatrixData) => void;
}

const AnsoffMatrix: React.FC<AnsoffMatrixProps> = ({ onBack, data, updateData }) => {
  const quadrants: { key: keyof AnsoffMatrixData; title: string }[] = [
    { key: 'marketPenetration', title: 'اختراق السوق (منتج حالي، سوق حالي)' },
    { key: 'productDevelopment', title: 'تطوير المنتج (منتج جديد، سوق حالي)' },
    { key: 'marketDevelopment', title: 'تطوير السوق (منتج حالي، سوق جديد)' },
    { key: 'diversification', title: 'التنويع (منتج جديد, سوق جديد)' },
  ];

  const handleChange = (field: keyof AnsoffMatrixData, value: string) => {
    updateData({ ...data, [field]: value });
  };

  return (
    <ToolContainer
      title="مصفوفة أنسوف"
      onBack={onBack}
      description="إطار استراتيجي لتحديد فرص نمو الشركة من خلال أربع استراتيجيات رئيسية بناءً على المنتجات والأسواق الحالية والجديدة."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quadrants.map((q) => (
          <div key={q.key} className="bg-slate-50 p-4 rounded-lg">
            <h3 className="font-bold text-slate-800 text-lg mb-2">{q.title}</h3>
            <textarea
              value={data[q.key]}
              onChange={(e) => handleChange(q.key, e.target.value)}
              className="w-full h-32 p-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={`استراتيجيات لـ ${q.title.split(' ')[0]}...`}
            ></textarea>
          </div>
        ))}
      </div>
    </ToolContainer>
  );
};

export default AnsoffMatrix;
