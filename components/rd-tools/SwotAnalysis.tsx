import React from 'react';
import { ToolContainer } from './common';
import { SwotData } from '../../types';

interface SwotAnalysisProps {
    onBack: () => void;
    data: SwotData;
    updateData: (data: SwotData) => void;
}

const SwotAnalysis: React.FC<SwotAnalysisProps> = ({ onBack, data, updateData }) => {
  const sections = [
    { key: 'strengths', title: 'نقاط القوة (Strengths)', color: 'green' },
    { key: 'weaknesses', title: 'نقاط الضعف (Weaknesses)', color: 'red' },
    { key: 'opportunities', title: 'الفرص (Opportunities)', color: 'blue' },
    { key: 'threats', title: 'التهديدات (Threats)', color: 'orange' },
  ] as const;

  const handleChange = (field: keyof SwotData, value: string) => {
    updateData({ ...data, [field]: value });
  };
  
  return (
    <ToolContainer 
      title="تحليل SWOT" 
      onBack={onBack}
      description="من أشهر أدوات التخطيط. بتقسم تحليلك لأربع مربعات: نقاط قوتك وضعفك (حاجات داخلية تقدر تتحكم فيها)، والفرص والتهديدات اللي في السوق (حاجات خارجية لازم تتعامل معاها). بتديك رؤية شاملة لوضعك الحالي."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map(section => (
          <div key={section.key} className={`bg-slate-50 rounded-lg p-4 border-t-4 border-${section.color}-500`}>
            <h3 className={`text-xl font-bold text-slate-800 mb-4`}>{section.title}</h3>
            <textarea
              value={data[section.key]}
              onChange={(e) => handleChange(section.key, e.target.value)}
              className="w-full h-40 p-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={`أضف ${section.title}...`}
            ></textarea>
          </div>
        ))}
      </div>
    </ToolContainer>
  );
};

export default SwotAnalysis;
