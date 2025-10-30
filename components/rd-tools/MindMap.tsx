import React from 'react';
import { ToolContainer } from './common';
import { MindMapData } from '../../types';

interface MindMapProps {
  onBack: () => void;
  data: MindMapData;
  updateData: (data: MindMapData) => void;
}

const MindMap: React.FC<MindMapProps> = ({ onBack, data, updateData }) => {
  return (
    <ToolContainer 
      title="الخريطة الذهنية" 
      onBack={onBack}
      description="دي طريقة بصرية عشان تنظم أفكارك. بتبدأ بفكرة رئيسية في النص، وبعدين تطلع منها فروع للأفكار المرتبطة بيها. بتساعدك تشوف الصورة الكاملة وتطلع علاقات بين الأفكارمكنتش واخد بالك منها."
    >
      <div className="text-center p-8">
        <div className="mb-8">
          <label className="text-lg font-bold text-slate-800">الفكرة المركزية</label>
          <input 
            type="text" 
            value={data.root.text}
            onChange={(e) => updateData({ ...data, root: { ...data.root, text: e.target.value } })}
            className="mt-2 text-center w-full max-w-sm mx-auto p-2 border-2 border-indigo-500 rounded-lg text-xl"
            placeholder="اكتب الفكرة الرئيسية هنا..."
          />
        </div>
        <div className="text-slate-500">
            <p>هذه واجهة مبسطة لإدخال الفكرة الرئيسية.</p>
            <p>يمكنك استخدام برامج متخصصة مثل Miro أو XMind لإنشاء خريطة ذهنية تفاعلية ومتكاملة.</p>
        </div>
      </div>
    </ToolContainer>
  );
};

export default MindMap;