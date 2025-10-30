import React from 'react';
import { ToolContainer } from './common';
import { InvestorPitchDeckData } from '../../types';

interface InvestorPitchDeckProps {
  onBack: () => void;
  data: InvestorPitchDeckData;
  updateData: (data: InvestorPitchDeckData) => void;
}

const InvestorPitchDeck: React.FC<InvestorPitchDeckProps> = ({ onBack, data, updateData }) => {
  const slides: { key: keyof InvestorPitchDeckData, title: string }[] = [
    { key: 'intro', title: 'المقدمة' },
    { key: 'problem', title: 'المشكلة' },
    { key: 'solution', title: 'الحل' },
    { key: 'marketSize', title: 'حجم السوق' },
    { key: 'product', title: 'المنتج' },
    { key: 'businessModel', title: 'نموذج العمل' },
    { key: 'team', title: 'فريق العمل' },
    { key: 'competition', title: 'المنافسة' },
    { key: 'financials', title: 'البيانات المالية' },
    { key: 'ask', title: 'الاستثمار المطلوب' },
  ];

  const handleChange = (field: keyof InvestorPitchDeckData, value: string) => {
    updateData({ ...data, [field]: value });
  };
  
  return (
    <ToolContainer 
      title="العرض التقديمي للمستثمرين" 
      onBack={onBack}
      description="قالب منظم يساعدك على بناء عرض تقديمي فعال ومقنع للمستثمرين، يغطي جميع النقاط الأساسية التي يبحثون عنها."
    >
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {slides.map(slide => (
          <div key={slide.key}>
            <label className="font-bold text-slate-800">{slide.title}</label>
            <textarea
              value={data[slide.key]}
              onChange={e => handleChange(slide.key, e.target.value)}
              className="w-full h-24 mt-1 p-2 border rounded-md"
              placeholder={`أضف محتوى شريحة ${slide.title}...`}
            ></textarea>
          </div>
        ))}
      </div>
    </ToolContainer>
  );
};

export default InvestorPitchDeck;
