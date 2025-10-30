import React from 'react';
import { ToolContainer } from './common';
import { ValuePropositionCanvasData } from '../../types';

interface ValuePropositionCanvasProps {
  onBack: () => void;
  data: ValuePropositionCanvasData;
  updateData: (data: ValuePropositionCanvasData) => void;
}

const ValuePropositionCanvas: React.FC<ValuePropositionCanvasProps> = ({ onBack, data, updateData }) => {
  const handleChange = (field: keyof ValuePropositionCanvasData, value: string) => {
    updateData({ ...data, [field]: value });
  };
  
  return (
    <ToolContainer 
      title="عرض القيمة المقترحة" 
      onBack={onBack}
      description="أداة تساعد على التأكد من أن منتجك يلبي احتياجات ورغبات العميل. تتكون من جزأين: ملف العميل (لفهم العميل) وخريطة القيمة (لوصف كيف يلبي منتجك احتياجاته)."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Profile */}
        <div className="bg-slate-100 p-4 rounded-lg">
          <h3 className="text-xl font-bold text-center mb-4">ملف العميل</h3>
          <div className="space-y-4">
            <div>
              <label className="font-bold">مكاسب العميل (Gains)</label>
              <textarea value={data.gains} onChange={e => handleChange('gains', e.target.value)} className="w-full h-24 mt-1 p-2 border rounded"></textarea>
            </div>
            <div>
              <label className="font-bold">آلام العميل (Pains)</label>
              <textarea value={data.pains} onChange={e => handleChange('pains', e.target.value)} className="w-full h-24 mt-1 p-2 border rounded"></textarea>
            </div>
            <div>
              <label className="font-bold">وظائف العميل (Customer Jobs)</label>
              <textarea value={data.customerJobs} onChange={e => handleChange('customerJobs', e.target.value)} className="w-full h-24 mt-1 p-2 border rounded"></textarea>
            </div>
          </div>
        </div>
        {/* Value Map */}
        <div className="bg-indigo-50 p-4 rounded-lg">
          <h3 className="text-xl font-bold text-center mb-4">خريطة القيمة</h3>
          <div className="space-y-4">
            <div>
              <label className="font-bold">مُنشِئات المكاسب (Gain Creators)</label>
              <textarea value={data.gainCreators} onChange={e => handleChange('gainCreators', e.target.value)} className="w-full h-24 mt-1 p-2 border rounded"></textarea>
            </div>
            <div>
              <label className="font-bold">مُسكِّنات الآلام (Pain Relievers)</label>
              <textarea value={data.painRelievers} onChange={e => handleChange('painRelievers', e.target.value)} className="w-full h-24 mt-1 p-2 border rounded"></textarea>
            </div>
            <div>
              <label className="font-bold">المنتجات والخدمات</label>
              <textarea value={data.productsServices} onChange={e => handleChange('productsServices', e.target.value)} className="w-full h-24 mt-1 p-2 border rounded"></textarea>
            </div>
          </div>
        </div>
      </div>
    </ToolContainer>
  );
};

export default ValuePropositionCanvas;
