import React from 'react';
import { ToolContainer } from './common';
import { BusinessModelCanvasData } from '../../types';

interface BusinessModelCanvasProps {
  onBack: () => void;
  data: BusinessModelCanvasData;
  updateData: (data: BusinessModelCanvasData) => void;
}

const BusinessModelCanvas: React.FC<BusinessModelCanvasProps> = ({ onBack, data, updateData }) => {
  const sections = [
    { key: 'keyPartners', title: 'الشركاء الرئيسيون' },
    { key: 'keyActivities', title: 'الأنشطة الرئيسية' },
    { key: 'valueProposition', title: 'عرض القيمة' },
    { key: 'customerRelationships', title: 'علاقات العملاء' },
    { key: 'customerSegments', title: 'شرائح العملاء' },
    { key: 'keyResources', title: 'الموارد الرئيسية' },
    { key: 'channels', title: 'القنوات' },
    { key: 'costStructure', title: 'هيكل التكاليف' },
    { key: 'revenueStreams', title: 'تدفقات الإيرادات' },
  ] as const;

  const handleChange = (field: keyof BusinessModelCanvasData, value: string) => {
    updateData({ ...data, [field]: value });
  };

  return (
    <ToolContainer 
      title="نموذج العمل التجاري" 
      onBack={onBack}
      description="دي لوحة متقسمة لـ 9 مربعات بتخليك تشوف البيزنس بتاعك كله في صفحة واحدة. بتجاوب فيها على أسئلة أساسية زي: مين عملائك؟ هتقدم لهم إيه؟ هتوصل لهم إزاي؟ وهتكسب فلوس إزاي ومنين؟"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map(section => (
          <div key={section.key} className="bg-slate-50 rounded-lg p-4 h-48">
            <h3 className="font-bold text-slate-800 text-sm mb-2">{section.title}</h3>
            <textarea 
              value={data[section.key]}
              onChange={(e) => handleChange(section.key, e.target.value)}
              className="w-full h-28 text-xs p-1 border rounded-md"
            ></textarea>
          </div>
        ))}
      </div>
    </ToolContainer>
  );
};

export default BusinessModelCanvas;
