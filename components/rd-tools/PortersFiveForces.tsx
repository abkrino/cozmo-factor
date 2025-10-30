import React from 'react';
import { ToolContainer } from './common';
import { PortersFiveForcesData } from '../../types';

interface PortersFiveForcesProps {
  onBack: () => void;
  data: PortersFiveForcesData;
  updateData: (data: PortersFiveForcesData) => void;
}

const PortersFiveForces: React.FC<PortersFiveForcesProps> = ({ onBack, data, updateData }) => {
  const forces = [
    { key: 'newEntrants', title: 'التهديد من الداخلين الجدد' },
    { key: 'buyers', title: 'القدرة التفاوضية للمشترين' },
    { key: 'substitutes', title: 'التهديد من المنتجات أو الخدمات البديلة' },
    { key: 'suppliers', title: 'القدرة التفاوضية للموردين' },
    { key: 'rivalry', title: 'المنافسة بين اللاعبين الحاليين' },
  ] as const;
  
  const handleChange = (field: keyof PortersFiveForcesData, value: string) => {
    updateData({ ...data, [field]: value });
  };

  return (
    <ToolContainer 
      title="قوى بورتر الخمسة" 
      onBack={onBack}
      description="ده إطار بيساعدك تحلل درجة المنافسة في السوق بتاعك. بتدرس خمس قوى أساسية زي قوة المنافسين الحاليين، وسهولة دخول منافسين جدد، وقوة المشترين والموردين. ده بيديك فكرة واضحة عن مدى جاذبية السوق ده للاستثمار."
    >
      <div className="space-y-6">
        {forces.map(force => (
          <div key={force.key}>
            <h3 className="text-lg font-bold text-slate-800">{force.title}</h3>
            <textarea
              value={data[force.key]}
              onChange={(e) => handleChange(force.key, e.target.value)}
              className="mt-2 w-full h-24 p-2 border border-slate-300 rounded-md"
              placeholder={`حلل ${force.title}...`}
            ></textarea>
          </div>
        ))}
      </div>
    </ToolContainer>
  );
};

export default PortersFiveForces;
