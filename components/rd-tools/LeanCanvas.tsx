import React from 'react';
import { ToolContainer } from './common';
import { LeanCanvasData } from '../../types';

interface LeanCanvasProps {
  onBack: () => void;
  data: LeanCanvasData;
  updateData: (data: LeanCanvasData) => void;
}

const LeanCanvas: React.FC<LeanCanvasProps> = ({ onBack, data, updateData }) => {
  const sections: { key: keyof LeanCanvasData, title: string }[] = [
    { key: 'problem', title: 'المشكلة' },
    { key: 'customerSegments', title: 'شرائح العملاء' },
    { key: 'uniqueValueProposition', title: 'عرض القيمة الفريد' },
    { key: 'solution', title: 'الحل' },
    { key: 'channels', title: 'القنوات' },
    { key: 'revenueStreams', title: 'مصادر الإيرادات' },
    { key: 'costStructure', title: 'هيكل التكاليف' },
    { key: 'keyMetrics', title: 'المقاييس الرئيسية' },
    { key: 'unfairAdvantage', title: 'الميزة غير العادلة' },
  ];

  const handleChange = (field: keyof LeanCanvasData, value: string) => {
    updateData({ ...data, [field]: value });
  };
  
  return (
    <ToolContainer 
      title="اللوحة الرشيقة (Lean Canvas)" 
      onBack={onBack}
      description="نسخة معدلة من نموذج العمل التجاري، تركز على الشركات الناشئة والمشاريع في مراحلها الأولى. تساعد على اختبار الفرضيات بسرعة."
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

export default LeanCanvas;
