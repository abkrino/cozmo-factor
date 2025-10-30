import React from 'react';
import { ToolContainer } from './common';
import { EmpathyMapData } from '../../types';

interface EmpathyMapProps {
  onBack: () => void;
  data: EmpathyMapData;
  updateData: (data: EmpathyMapData) => void;
}

const EmpathyMap: React.FC<EmpathyMapProps> = ({ onBack, data, updateData }) => {
  const sections = [
    { key: 'says', title: 'يقول (Says)' },
    { key: 'thinks', title: 'يفكر (Thinks)' },
    { key: 'feels', title: 'يشعر (Feels)' },
    { key: 'does', title: 'يفعل (Does)' },
  ] as const;

  const handleChange = (field: keyof EmpathyMapData, value: string) => {
    updateData({ ...data, [field]: value });
  };

  return (
    <ToolContainer 
      title="خريطة التعاطف" 
      onBack={onBack}
      description="دي أداة بتخليك تدخل جوه عقل وقلب العميل. بتجاوب على أسئلة زي: العميل بيقول إيه؟ بيفكر في إيه؟ حاسس بإيه؟ وبيعمل إيه؟ ده بيساعدك تفهم دوافعه الحقيقية ومشاكله عشان تقدم له الحل المناسب."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map(section => (
          <div key={section.key} className="bg-slate-50 rounded-lg p-4">
            <h3 className="text-xl font-bold text-slate-800 mb-4">{section.title}</h3>
            <textarea
              value={data[section.key]}
              onChange={(e) => handleChange(section.key, e.target.value)}
              className="w-full h-40 p-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={`ماذا ${section.title.toLowerCase()} العميل؟`}
            ></textarea>
          </div>
        ))}
      </div>
    </ToolContainer>
  );
};

export default EmpathyMap;
