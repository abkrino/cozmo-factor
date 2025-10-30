import React from 'react';
import { ToolContainer } from './common';
import { CustomerJourneyMapData } from '../../types';
import { PlusIcon, CloseIcon } from '../icons';

interface CustomerJourneyMapProps {
  onBack: () => void;
  data: CustomerJourneyMapData;
  updateData: (data: CustomerJourneyMapData) => void;
}

const CustomerJourneyMap: React.FC<CustomerJourneyMapProps> = ({ onBack, data, updateData }) => {
  
  const handleStageChange = (index: number, field: keyof CustomerJourneyMapData['stages'][0], value: string) => {
    const newStages = [...data.stages];
    newStages[index] = { ...newStages[index], [field]: value };
    updateData({ stages: newStages });
  };

  const addStage = () => {
    updateData({ stages: [...data.stages, { name: '', actions: '', touchpoints: '', emotions: '', painPoints: '', opportunities: '' }] });
  };

  const removeStage = (index: number) => {
    const newStages = data.stages.filter((_, i) => i !== index);
    updateData({ stages: newStages });
  };

  return (
    <ToolContainer
      title="خريطة رحلة العميل"
      onBack={onBack}
      description="تصور تجربة العميل الكاملة مع شركتك من البداية إلى النهاية، لتحديد نقاط القوة والضعف في كل مرحلة."
    >
      <div className="space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm text-right">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50">
              <tr>
                <th className="p-2 border">المرحلة</th>
                <th className="p-2 border">إجراءات العميل</th>
                <th className="p-2 border">نقاط الاتصال</th>
                <th className="p-2 border">المشاعر</th>
                <th className="p-2 border">نقاط الألم</th>
                <th className="p-2 border">الفرص</th>
                <th className="p-2 border w-12"></th>
              </tr>
            </thead>
            <tbody>
              {data.stages.map((stage, index) => (
                <tr key={index} className="bg-white">
                  <td className="border p-1"><input type="text" placeholder="الوعي" value={stage.name} onChange={e => handleStageChange(index, 'name', e.target.value)} className="w-full p-1 border-slate-200 rounded-md" /></td>
                  <td className="border p-1"><textarea value={stage.actions} onChange={e => handleStageChange(index, 'actions', e.target.value)} className="w-full p-1 h-20 border-slate-200 rounded-md"></textarea></td>
                  <td className="border p-1"><textarea value={stage.touchpoints} onChange={e => handleStageChange(index, 'touchpoints', e.target.value)} className="w-full p-1 h-20 border-slate-200 rounded-md"></textarea></td>
                  <td className="border p-1"><textarea value={stage.emotions} onChange={e => handleStageChange(index, 'emotions', e.target.value)} className="w-full p-1 h-20 border-slate-200 rounded-md"></textarea></td>
                  <td className="border p-1"><textarea value={stage.painPoints} onChange={e => handleStageChange(index, 'painPoints', e.target.value)} className="w-full p-1 h-20 border-slate-200 rounded-md"></textarea></td>
                  <td className="border p-1"><textarea value={stage.opportunities} onChange={e => handleStageChange(index, 'opportunities', e.target.value)} className="w-full p-1 h-20 border-slate-200 rounded-md"></textarea></td>
                  <td className="border p-1 text-center"><button onClick={() => removeStage(index)} className="p-1 hover:bg-red-100 rounded-full"><CloseIcon className="w-4 h-4 text-red-500"/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          onClick={addStage}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700"
        >
          <PlusIcon className="w-5 h-5" />
          إضافة مرحلة
        </button>
      </div>
    </ToolContainer>
  );
};

export default CustomerJourneyMap;
