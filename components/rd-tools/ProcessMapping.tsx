import React from 'react';
import { ToolContainer } from './common';
import { ProcessMappingData } from '../../types';
import { PlusIcon, CloseIcon } from '../icons';

interface ProcessMappingProps {
  onBack: () => void;
  data: ProcessMappingData;
  updateData: (data: ProcessMappingData) => void;
}

const ProcessMapping: React.FC<ProcessMappingProps> = ({ onBack, data, updateData }) => {
  const handleStepChange = (index: number, field: 'name' | 'description', value: string) => {
    const newSteps = [...data.steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    updateData({ steps: newSteps });
  };

  const addStep = () => {
    updateData({ steps: [...data.steps, { name: '', description: '' }] });
  };

  const removeStep = (index: number) => {
    const newSteps = data.steps.filter((_, i) => i !== index);
    updateData({ steps: newSteps });
  };

  return (
    <ToolContainer 
      title="تخطيط العمليات" 
      onBack={onBack}
      description="أداة لتصور وتحليل خطوات عملية معينة من البداية إلى النهاية، مما يساعد على تحديد نقاط الضعف وفرص التحسين."
    >
      <div className="space-y-4">
        {data.steps.map((step, index) => (
          <div key={index} className="flex items-start gap-2 p-4 bg-slate-50 rounded-lg">
            <span className="font-bold text-indigo-600 pt-2">{index + 1}.</span>
            <div className="flex-grow space-y-2">
              <input
                type="text"
                placeholder="اسم الخطوة"
                value={step.name}
                onChange={(e) => handleStepChange(index, 'name', e.target.value)}
                className="w-full p-2 border rounded-md"
              />
              <textarea
                placeholder="وصف الخطوة"
                value={step.description}
                onChange={(e) => handleStepChange(index, 'description', e.target.value)}
                className="w-full h-20 p-2 border rounded-md text-sm"
              />
            </div>
            <button onClick={() => removeStep(index)} className="p-1 mt-1 hover:bg-red-100 rounded-full">
              <CloseIcon className="w-5 h-5 text-red-600" />
            </button>
          </div>
        ))}
        <button 
          onClick={addStep}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700"
        >
          <PlusIcon className="w-5 h-5" />
          إضافة خطوة
        </button>
      </div>
    </ToolContainer>
  );
};

export default ProcessMapping;
