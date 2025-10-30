import React from 'react';
import { ToolContainer } from './common';
import { RaciMatrixData } from '../../types';
import { PlusIcon, CloseIcon } from '../icons';

interface RaciMatrixProps {
  onBack: () => void;
  data: RaciMatrixData;
  updateData: (data: RaciMatrixData) => void;
}

const RaciMatrix: React.FC<RaciMatrixProps> = ({ onBack, data, updateData }) => {
  
  const handleTaskChange = (index: number, field: keyof RaciMatrixData['tasks'][0], value: string) => {
    const newTasks = [...data.tasks];
    newTasks[index] = { ...newTasks[index], [field]: value };
    updateData({ tasks: newTasks });
  };

  const addTask = () => {
    updateData({ tasks: [...data.tasks, { name: '', responsible: '', accountable: '', consulted: '', informed: '' }] });
  };

  const removeTask = (index: number) => {
    const newTasks = data.tasks.filter((_, i) => i !== index);
    updateData({ tasks: newTasks });
  };

  return (
    <ToolContainer 
      title="مصفوفة RACI" 
      onBack={onBack}
      description="أداة لتوضيح الأدوار والمسؤوليات في المشاريع والعمليات. تحدد من هو المسؤول (Responsible)، ومن هو المساءل (Accountable)، ومن تتم استشارته (Consulted)، ومن يتم إبلاغه (Informed) لكل مهمة."
    >
      <div className="space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm text-right">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50">
              <tr>
                <th className="px-4 py-2 border">المهمة/النشاط</th>
                <th className="px-4 py-2 border">مسؤول (R)</th>
                <th className="px-4 py-2 border">مساءل (A)</th>
                <th className="px-4 py-2 border">مستشار (C)</th>
                <th className="px-4 py-2 border">مُبلغ (I)</th>
                <th className="px-4 py-2 border w-12"></th>
              </tr>
            </thead>
            <tbody>
              {data.tasks.map((task, index) => (
                <tr key={index} className="bg-white">
                  <td className="border p-1"><input type="text" value={task.name} onChange={e => handleTaskChange(index, 'name', e.target.value)} className="w-full p-1 border-slate-200 rounded-md" /></td>
                  <td className="border p-1"><input type="text" value={task.responsible} onChange={e => handleTaskChange(index, 'responsible', e.target.value)} className="w-full p-1 border-slate-200 rounded-md" /></td>
                  <td className="border p-1"><input type="text" value={task.accountable} onChange={e => handleTaskChange(index, 'accountable', e.target.value)} className="w-full p-1 border-slate-200 rounded-md" /></td>
                  <td className="border p-1"><input type="text" value={task.consulted} onChange={e => handleTaskChange(index, 'consulted', e.target.value)} className="w-full p-1 border-slate-200 rounded-md" /></td>
                  <td className="border p-1"><input type="text" value={task.informed} onChange={e => handleTaskChange(index, 'informed', e.target.value)} className="w-full p-1 border-slate-200 rounded-md" /></td>
                  <td className="border p-1 text-center"><button onClick={() => removeTask(index)} className="p-1 hover:bg-red-100 rounded-full"><CloseIcon className="w-4 h-4 text-red-500"/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button 
          onClick={addTask}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700"
        >
          <PlusIcon className="w-5 h-5" />
          إضافة مهمة
        </button>
      </div>
    </ToolContainer>
  );
};

export default RaciMatrix;
