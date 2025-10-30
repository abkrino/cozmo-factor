import React from 'react';
import { ToolContainer } from './common';
import { CompetitorAnalysisData } from '../../types';
import { PlusIcon, CloseIcon } from '../icons';

interface CompetitorAnalysisProps {
  onBack: () => void;
  data: CompetitorAnalysisData;
  updateData: (data: CompetitorAnalysisData) => void;
}

const CompetitorAnalysis: React.FC<CompetitorAnalysisProps> = ({ onBack, data, updateData }) => {

  const handleCompetitorChange = (index: number, field: 'name' | 'strengths' | 'weaknesses', value: string) => {
    const newCompetitors = [...data.competitors];
    newCompetitors[index] = { ...newCompetitors[index], [field]: value };
    updateData({ competitors: newCompetitors });
  };

  const addCompetitor = () => {
    updateData({ competitors: [...data.competitors, { name: '', strengths: '', weaknesses: '' }] });
  };

  const removeCompetitor = (index: number) => {
    const newCompetitors = data.competitors.filter((_, i) => i !== index);
    updateData({ competitors: newCompetitors });
  };

  return (
    <ToolContainer 
      title="تحليل المنافسين" 
      onBack={onBack}
      description="دي طريقة منظمة عشان تدرس المنافسين بتوعك. بتعمل جدول تحط فيه المنافسين وتكتب نقاط قوتهم وضعفهم ومنتجاتهم وأسعارهم. ده بيساعدك تعرف إنت فين من السوق وإيه الميزة اللي عندك."
    >
      <div className="space-y-4">
        {data.competitors.map((competitor, index) => (
          <div key={index} className="bg-slate-50 p-4 rounded-lg relative">
            <button onClick={() => removeCompetitor(index)} className="absolute top-2 left-2 p-1 hover:bg-red-100 rounded-full">
                <CloseIcon className="w-4 h-4 text-red-600" />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="font-bold">اسم المنافس</label>
                <input 
                    type="text" 
                    value={competitor.name}
                    onChange={(e) => handleCompetitorChange(index, 'name', e.target.value)}
                    className="w-full mt-1 p-2 border rounded-md" 
                />
              </div>
              <div>
                <label className="font-bold">نقاط القوة</label>
                <textarea 
                    value={competitor.strengths}
                    onChange={(e) => handleCompetitorChange(index, 'strengths', e.target.value)}
                    className="w-full mt-1 p-2 border rounded-md h-24"
                ></textarea>
              </div>
              <div>
                <label className="font-bold">نقاط الضعف</label>
                <textarea 
                    value={competitor.weaknesses}
                    onChange={(e) => handleCompetitorChange(index, 'weaknesses', e.target.value)}
                    className="w-full mt-1 p-2 border rounded-md h-24"
                ></textarea>
              </div>
            </div>
          </div>
        ))}
        <button 
          onClick={addCompetitor}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700"
        >
          <PlusIcon className="w-5 h-5" />
          إضافة منافس
        </button>
      </div>
    </ToolContainer>
  );
};

export default CompetitorAnalysis;
