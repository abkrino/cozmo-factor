import React from 'react';
import { ToolContainer } from './common';
import { BcgMatrixData } from '../../types';

interface BcgMatrixProps {
  onBack: () => void;
  data: BcgMatrixData;
  updateData: (data: BcgMatrixData) => void;
}

const BcgMatrix: React.FC<BcgMatrixProps> = ({ onBack, data, updateData }) => {
  const quadrants: { key: keyof BcgMatrixData; title: string }[] = [
    { key: 'stars', title: 'النجوم (Stars)' },
    { key: 'questionMarks', title: 'علامات الاستفهام (Question Marks)' },
    { key: 'cashCows', title: 'الأبقار الحلوب (Cash Cows)' },
    { key: 'dogs', title: 'الكلاب (Dogs)' },
  ];

  const handleChange = (field: keyof BcgMatrixData, value: string) => {
    updateData({ ...data, [field]: value });
  };
  
  return (
    <ToolContainer
      title="مصفوفة BCG"
      onBack={onBack}
      description="أداة لتحليل مجموعة المنتجات أو وحدات الأعمال بناءً على حصتها في السوق ومعدل نمو السوق، للمساعدة في تحديد أولويات الاستثمار."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quadrants.map((q) => (
          <div key={q.key} className="bg-slate-50 p-4 rounded-lg">
            <h3 className="font-bold text-slate-800 text-lg mb-2">{q.title}</h3>
            <textarea
              value={data[q.key]}
              onChange={(e) => handleChange(q.key, e.target.value)}
              className="w-full h-32 p-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={`أضف المنتجات هنا...`}
            ></textarea>
          </div>
        ))}
      </div>
    </ToolContainer>
  );
};

export default BcgMatrix;
