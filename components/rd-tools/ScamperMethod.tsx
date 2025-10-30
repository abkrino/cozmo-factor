import React from 'react';
import { ToolContainer } from './common';
import { ScamperData } from '../../types';

interface ScamperMethodProps {
  onBack: () => void;
  data: ScamperData;
  updateData: (data: ScamperData) => void;
}

const ScamperMethod: React.FC<ScamperMethodProps> = ({ onBack, data, updateData }) => {
  const questions = [
    { key: 'substitute', letter: 'S', name: 'Substitute', question: 'ما الذي يمكن استبداله؟' },
    { key: 'combine', letter: 'C', name: 'Combine', question: 'ما الذي يمكن دمجه؟' },
    { key: 'adapt', letter: 'A', name: 'Adapt', question: 'ما الذي يمكن تكييفه؟' },
    { key: 'modify', letter: 'M', name: 'Modify', question: 'ما الذي يمكن تعديله أو تكبيره؟' },
    { key: 'putToAnotherUse', letter: 'P', name: 'Put to another use', question: 'كيف يمكن استخدامه لغرض آخر؟' },
    { key: 'eliminate', letter: 'E', name: 'Eliminate', question: 'ما الذي يمكن إزالته أو تبسيطه؟' },
    { key: 'reverse', letter: 'R', name: 'Reverse', question: 'ما الذي يمكن عكسه أو إعادة ترتيبه؟' },
  ] as const;

  const handleChange = (field: keyof ScamperData, value: string) => {
    updateData({ ...data, [field]: value });
  };

  return (
    <ToolContainer 
      title="طريقة SCAMPER" 
      onBack={onBack}
      description="دي عبارة عن قايمة أسئلة ذكية بتساعدك تطور منتج أو فكرة موجودة. كل حرف بيمثل سؤال بيخليك تفكر بطريقة مختلفة عشان تطلع بحاجة جديدة ومبتكرة من غير ما تبدأ من الصفر."
    >
      <div className="space-y-6">
        {questions.map((item) => (
          <div key={item.key}>
            <h3 className="text-lg font-bold text-slate-800">
              <span className="text-indigo-600 font-mono text-xl">{item.letter}</span> - {item.name} ({item.question})
            </h3>
            <textarea
              value={data[item.key]}
              onChange={(e) => handleChange(item.key, e.target.value)}
              className="mt-2 w-full h-24 p-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="اكتب أفكارك هنا..."
            ></textarea>
          </div>
        ))}
      </div>
    </ToolContainer>
  );
};

export default ScamperMethod;
