import React from 'react';
import { ToolContainer } from './common';
import { DesignThinkingData } from '../../types';

interface DesignThinkingProps {
  onBack: () => void;
  data: DesignThinkingData;
  updateData: (data: DesignThinkingData) => void;
}

const DesignThinking: React.FC<DesignThinkingProps> = ({ onBack, data, updateData }) => {
  const stages: { key: keyof DesignThinkingData, title: string }[] = [
    { key: 'empathize', title: 'التعاطف' },
    { key: 'define', title: 'التحديد' },
    { key: 'ideate', title: 'التفكير' },
    { key: 'prototype', title: 'النمذجة الأولية' },
    { key: 'test', title: 'الاختبار' },
  ];

  const handleChange = (field: keyof DesignThinkingData, value: string) => {
    updateData({ ...data, [field]: value });
  };
  
  return (
    <ToolContainer
      title="التفكير التصميمي"
      onBack={onBack}
      description="عملية تكرارية لفهم المستخدمين وتحدي الافتراضات وإعادة تعريف المشاكل، للوصول إلى حلول مبتكرة."
    >
      <div className="space-y-6">
        {stages.map((stage) => (
          <div key={stage.key}>
            <h3 className="text-xl font-bold text-slate-800 mb-2">{stage.title}</h3>
            <textarea
              value={data[stage.key]}
              onChange={(e) => handleChange(stage.key, e.target.value)}
              className="w-full h-24 p-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={`صف مرحلة ${stage.title}...`}
            ></textarea>
          </div>
        ))}
      </div>
    </ToolContainer>
  );
};

export default DesignThinking;
