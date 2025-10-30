import React from 'react';
import { ToolContainer } from './common';
import { FishboneDiagramData } from '../../types';

interface FishboneDiagramProps {
  onBack: () => void;
  data: FishboneDiagramData;
  updateData: (data: FishboneDiagramData) => void;
}

const FishboneDiagram: React.FC<FishboneDiagramProps> = ({ onBack, data, updateData }) => {
  const categories: { key: keyof Omit<FishboneDiagramData, 'problem'>, title: string }[] = [
    { key: 'machines', title: 'الآلات' },
    { key: 'methods', title: 'الأساليب' },
    { key: 'materials', title: 'المواد' },
    { key: 'manpower', title: 'القوى العاملة' },
    { key: 'measurement', title: 'القياس' },
    { key: 'environment', title: 'البيئة' },
  ];

  const handleChange = (field: keyof FishboneDiagramData, value: string) => {
    updateData({ ...data, [field]: value });
  };
  
  return (
    <ToolContainer
      title="مخطط السبب والأثر (عظمة السمكة)"
      onBack={onBack}
      description="أداة لتحديد الأسباب المحتملة لمشكلة معينة وتصنيفها للمساعدة في الوصول إلى السبب الجذري."
    >
      <div className="space-y-6">
        <div>
          <label className="text-xl font-bold text-slate-800">المشكلة (رأس السمكة)</label>
          <input
            type="text"
            value={data.problem}
            onChange={(e) => handleChange('problem', e.target.value)}
            className="w-full mt-2 p-2 border-2 border-indigo-500 rounded-md"
            placeholder="صف المشكلة الرئيسية هنا..."
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div key={cat.key} className="bg-slate-50 p-2 rounded">
              <h3 className="font-bold text-center mb-2">{cat.title}</h3>
              <textarea
                value={data[cat.key]}
                onChange={(e) => handleChange(cat.key, e.target.value)}
                className="w-full h-24 text-sm p-1 border rounded"
                placeholder={`الأسباب المتعلقة بـ${cat.title}...`}
              ></textarea>
            </div>
          ))}
        </div>
      </div>
    </ToolContainer>
  );
};

export default FishboneDiagram;
