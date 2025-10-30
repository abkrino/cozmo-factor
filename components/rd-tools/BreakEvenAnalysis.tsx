import React from 'react';
import { ToolContainer } from './common';
import { BreakEvenData } from '../../types';

interface BreakEvenAnalysisProps {
  onBack: () => void;
  data: BreakEvenData;
  updateData: (data: BreakEvenData) => void;
}

const BreakEvenAnalysis: React.FC<BreakEvenAnalysisProps> = ({ onBack, data, updateData }) => {
  const { fixedCosts, variableCostPerUnit, salePricePerUnit } = data;

  const handleChange = (field: keyof BreakEvenData, value: string) => {
    const numericValue = Number(value);
    if (!isNaN(numericValue) && numericValue >= 0) {
      updateData({ ...data, [field]: numericValue });
    }
  };

  const contributionMargin = salePricePerUnit - variableCostPerUnit;
  const breakEvenUnits = contributionMargin > 0 ? fixedCosts / contributionMargin : 0;
  const breakEvenRevenue = breakEvenUnits * salePricePerUnit;

  const renderResult = () => {
    if (fixedCosts > 0 && contributionMargin <= 0) {
      return (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
          <p className="font-bold">خطأ في الحساب</p>
          <p>يجب أن يكون سعر البيع للوحدة أكبر من التكلفة المتغيرة للوحدة لتحقيق الربح.</p>
        </div>
      );
    }
    return (
      <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4" role="alert">
        <p className="font-bold">نقطة التعادل</p>
        <p>تحتاج إلى بيع <span className="font-mono font-bold">{Math.ceil(breakEvenUnits).toLocaleString()}</span> وحدة للوصول إلى نقطة التعادل.</p>
        <p>وهذا يعادل إيرادات بقيمة <span className="font-mono font-bold">{breakEvenRevenue.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })}</span>.</p>
      </div>
    );
  };

  return (
    <ToolContainer
      title="تحليل نقطة التعادل"
      onBack={onBack}
      description="أداة بسيطة لحساب أقل عدد من الوحدات اللي لازم تبيعها عشان تغطي تكاليفك ومتبقاش خسران. أي مبيعات فوق الرقم ده تعتبر ربح صافي."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">إجمالي التكاليف الثابتة (ج.م)</label>
            <input
              type="number"
              value={fixedCosts}
              onChange={(e) => handleChange('fixedCosts', e.target.value)}
              className="mt-1 block w-full p-2 border rounded-md"
              placeholder="مثل الإيجارات، الرواتب..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">التكلفة المتغيرة للوحدة (ج.م)</label>
            <input
              type="number"
              value={variableCostPerUnit}
              onChange={(e) => handleChange('variableCostPerUnit', e.target.value)}
              className="mt-1 block w-full p-2 border rounded-md"
              placeholder="تكلفة المواد الخام للقطعة الواحدة..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">سعر البيع للوحدة (ج.م)</label>
            <input
              type="number"
              value={salePricePerUnit}
              onChange={(e) => handleChange('salePricePerUnit', e.target.value)}
              className="mt-1 block w-full p-2 border rounded-md"
              placeholder="السعر الذي تبيع به القطعة الواحدة..."
            />
          </div>
        </div>
        <div className="flex items-center justify-center p-4 bg-slate-50 rounded-lg">
          {renderResult()}
        </div>
      </div>
    </ToolContainer>
  );
};

export default BreakEvenAnalysis;
