import React from 'react';
import { ToolContainer } from './common';
import { BrainstormingData } from '../../types';

interface BrainstormingMatrixProps {
  onBack: () => void;
  data: BrainstormingData;
  updateData: (data: BrainstormingData) => void;
}

const BrainstormingMatrix: React.FC<BrainstormingMatrixProps> = ({ onBack, data, updateData }) => {
  
  const handleChange = (field: keyof BrainstormingData, value: string) => {
    updateData({ ...data, [field]: value });
  };

  return (
    <ToolContainer 
      title="مصفوفة العصف الذهني" 
      onBack={onBack}
      description="هي أداة بتخليك تنظم أفكارك بدل ما تبقى عشوائية. بتعمل جدول بسيط تحط فيه الأفكار تحت عناوين زي 'نقاط القوة' أو 'أفكار جديدة' عشان الصورة تبقى أوضح وتقدر تقارن بينهم بسهولة."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <h3 className="text-xl font-bold text-slate-800 mb-4">نقاط القوة</h3>
            <textarea
              value={data.strengths}
              onChange={(e) => handleChange('strengths', e.target.value)}
              className="w-full h-48 p-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="الحاجات اللي بنعملها كويس..."
            ></textarea>
        </div>
        <div>
            <h3 className="text-xl font-bold text-slate-800 mb-4">نقاط الضعف</h3>
            <textarea
              value={data.weaknesses}
              onChange={(e) => handleChange('weaknesses', e.target.value)}
              className="w-full h-48 p-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="الحاجات اللي محتاجين نحسنها..."
            ></textarea>
        </div>
        <div>
            <h3 className="text-xl font-bold text-slate-800 mb-4">الأفكار الجديدة</h3>
            <textarea
              value={data.newIdeas}
              onChange={(e) => handleChange('newIdeas', e.target.value)}
              className="w-full h-48 p-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="منتجات جديدة، أسواق جديدة..."
            ></textarea>
        </div>
        <div>
            <h3 className="text-xl font-bold text-slate-800 mb-4">التحسينات الممكنة</h3>
            <textarea
              value={data.improvements}
              onChange={(e) => handleChange('improvements', e.target.value)}
              className="w-full h-48 p-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="تطوير على منتج موجود، تحسين عملية..."
            ></textarea>
        </div>
      </div>
    </ToolContainer>
  );
};

export default BrainstormingMatrix;