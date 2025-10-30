import React, { useState } from 'react';
import { ToolContainer } from './common';
import { GanttChartData, GanttTask } from '../../types';
import { PlusIcon, CloseIcon } from '../icons';

interface GanttChartProps {
  onBack: () => void;
  data: GanttChartData;
  updateData: (data: GanttChartData) => void;
}

const GanttChart: React.FC<GanttChartProps> = ({ onBack, data, updateData }) => {
  const [newTask, setNewTask] = useState({ name: '', start: '', end: '' });

  const handleAddTask = () => {
    if (newTask.name && newTask.start && newTask.end) {
      const newTasks = [...data.tasks, { ...newTask, id: Date.now() }];
      updateData({ tasks: newTasks });
      setNewTask({ name: '', start: '', end: '' });
    }
  };

  const handleRemoveTask = (id: number) => {
    const newTasks = data.tasks.filter(task => task.id !== id);
    updateData({ tasks: newTasks });
  };
  
  const handleTaskChange = (id: number, field: keyof GanttTask, value: string) => {
      const newTasks = data.tasks.map(task => 
          task.id === id ? { ...task, [field]: value } : task
      );
      updateData({ tasks: newTasks });
  };

  return (
    <ToolContainer 
      title="مخطط جانت" 
      onBack={onBack}
      description="ده مخطط زمني بيوريك كل مهام المشروع بتاعك على تايم لاين. بتعرف منه كل مهمة هتبدأ إمتى وتنتهي إمتى، ومين بيعتمد على مين. أداة أساسية لإدارة أي مشروع."
    >
      <div className="space-y-4">
        {/* Task input */}
        <div className="flex flex-wrap gap-2 p-2 border rounded-lg">
          <input 
            type="text" 
            placeholder="اسم المهمة" 
            value={newTask.name} 
            onChange={e => setNewTask({...newTask, name: e.target.value})} 
            className="p-2 border rounded-md flex-grow"
          />
          <input 
            type="date" 
            value={newTask.start} 
            onChange={e => setNewTask({...newTask, start: e.target.value})} 
            className="p-2 border rounded-md"
          />
          <input 
            type="date" 
            value={newTask.end} 
            onChange={e => setNewTask({...newTask, end: e.target.value})} 
            className="p-2 border rounded-md"
          />
          <button onClick={handleAddTask} className="p-2 bg-indigo-600 text-white rounded-md"><PlusIcon/></button>
        </div>
        
        {/* Task list */}
        <div className="space-y-2">
            {data.tasks.map(task => (
                <div key={task.id} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                    <input type="text" value={task.name} onChange={e => handleTaskChange(task.id, 'name', e.target.value)} className="p-1 border rounded flex-grow"/>
                    <input type="date" value={task.start} onChange={e => handleTaskChange(task.id, 'start', e.target.value)} className="p-1 border rounded"/>
                    <input type="date" value={task.end} onChange={e => handleTaskChange(task.id, 'end', e.target.value)} className="p-1 border rounded"/>
                    <button onClick={() => handleRemoveTask(task.id)} className="p-1"><CloseIcon className="w-4 h-4 text-red-500"/></button>
                </div>
            ))}
        </div>
      </div>
    </ToolContainer>
  );
};

export default GanttChart;
