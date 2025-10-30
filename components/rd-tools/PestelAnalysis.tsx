import React from 'react';
import { ToolContainer } from './common';
import { PestelData } from '../../types';

interface PestelAnalysisProps {
  onBack: () => void;
  data: PestelData;
  updateData: (data: PestelData) => void;
}

const PestelAnalysis: React.FC<PestelAnalysisProps> = ({ onBack, data, updateData }) => {
  const factors = [
    { key: 'political', name: 'السياسية (Political)', color: 'blue' },
    { key: 'economic', name: 'الاقتصادية (Economic)', color: 'green' },
    { key: 'social', name: 'الاجتماعية (Social)', color: 'purple' },
    { key: 'technological', name: 'التكنولوجية (Technological)', color: 'orange' },
    { key: 'environmental', name: 'البيئية (Environmental)', color: 'teal' },
    { key: 'legal', name: 'القانونية (Legal)', color: 'gray' },
  ] as const;

  const handleChange = (field: keyof PestelData, value: string) => {
    updateData({ ...data, [field]: value });
  };

  return (
    <ToolContainer 
      title="تحليل PESTEL" 
      onBack={onBack}
      description="دي أداة بتخليك تبص على الصورة الكبيرة حواليك. بتحلل العوامل الخارجية اللي ممكن تأثر على البيزنس بتاعك زي السياسة والاقتصاد والتكنولوجيا والقوانين. ده بيساعدك تستعد لأي تغييرات وتستغل الفرص اللي ممكن تظهر."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {factors.map(factor => (
          <div key={factor.key} className={`bg-slate-50 rounded-lg p-4 border-t-4 border-${factor.color}-500`}>
            <h3 className="text-lg font-bold text-slate-800 mb-2">{factor.name}</h3>
            <textarea
              value={data[factor.key]}
              onChange={(e) => handleChange(factor.key, e.target.value)}
              className="w-full h-32 p-2 border border-slate-300 rounded-md"
              placeholder={`أضف العوامل ${factor.name.split(' ')[0]}...`}
            ></textarea>
          </div>
        ))}
      </div>
    </ToolContainer>
  );
};

export default PestelAnalysis;
