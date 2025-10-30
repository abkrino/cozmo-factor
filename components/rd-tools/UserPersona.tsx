import React from 'react';
import { ToolContainer } from './common';
import { UserPersonaData } from '../../types';

interface UserPersonaProps {
  onBack: () => void;
  data: UserPersonaData;
  updateData: (data: UserPersonaData) => void;
}

const UserPersona: React.FC<UserPersonaProps> = ({ onBack, data, updateData }) => {

  const handleChange = (field: keyof UserPersonaData, value: string) => {
    updateData({ ...data, [field]: value });
  };
  
  return (
    <ToolContainer 
        title="الشخصية النموذجية للمستخدم (User Persona)" 
        onBack={onBack}
        description="تخيل إنك بتعمل بروفايل لشخصية خيالية بتمثل شريحة من عملائك. بتديها اسم وسن ووظيفة وأهداف وتحديات. ده بيساعدك تفهم عميلك كإنسان حقيقي، وبالتالي تاخد قرارات تصميم وتسويق أحسن."
    >
      <div className="space-y-6">
        <div>
          <label className="font-bold text-slate-800">اسم الشخصية</label>
          <input 
            type="text"
            value={data.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full mt-1 p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="مثال: سارة، أم عاملة"
          />
        </div>
        <div>
          <label className="font-bold text-slate-800">البيانات الديموغرافية (العمر، الوظيفة، الحالة الاجتماعية)</label>
          <textarea
            value={data.demographics}
            onChange={(e) => handleChange('demographics', e.target.value)}
            className="w-full mt-1 p-2 border rounded-md h-24 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="صف الخلفية الأساسية للشخصية..."
          />
        </div>
        <div>
          <label className="font-bold text-slate-800">الأهداف (Goals)</label>
          <textarea
            value={data.goals}
            onChange={(e) => handleChange('goals', e.target.value)}
            className="w-full mt-1 p-2 border rounded-md h-24 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="ماذا تريد هذه الشخصية تحقيقه؟"
          />
        </div>
        <div>
          <label className="font-bold text-slate-800">التحديات (Challenges)</label>
          <textarea
            value={data.challenges}
            onChange={(e) => handleChange('challenges', e.target.value)}
            className="w-full mt-1 p-2 border rounded-md h-24 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="ما هي العقبات التي تواجهها الشخصية؟"
          />
        </div>
      </div>
    </ToolContainer>
  );
};

export default UserPersona;
