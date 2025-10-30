import React from 'react';
import { ToolContainer } from './common';
import { UnitEconomicsData } from '../../types';

interface UnitEconomicsProps {
  onBack: () => void;
  data: UnitEconomicsData;
  updateData: (data: UnitEconomicsData) => void;
}

const UnitEconomics: React.FC<UnitEconomicsProps> = ({ onBack, data, updateData }) => {
  const { ltv, cac } = data;

  const handleChange = (field: keyof UnitEconomicsData, value: string) => {
    const numericValue = Number(value);
    if (!isNaN(numericValue) && numericValue >= 0) {
      updateData({ ...data, [field]: numericValue });
    }
  };

  const ratio = cac > 0 ? ltv / cac : 0;

  const getRatioInterpretation = () => {
    if (cac <= 0) return '';
    if (ratio < 1) return <p className="text-red-600 mt-2">أنت تخسر المال على كل عميل جديد. نموذج العمل هذا غير مستدام.</p>;
    if (ratio >= 1 && ratio < 3) return <p className="text-orange-600 mt-2">قد يكون نموذج عملك مربحًا ولكن مجال النمو محدود. حاول خفض تكلفة اكتساب العميل أو زيادة قيمته.</p>;
    if (ratio >= 3) return <p className="text-green-600 mt-2">لديك نموذج عمل قوي وصحي. استمر في الاستثمار في النمو!</p>;
    return '';
  };

  return (
    <ToolContainer
      title="اقتصاديات الوحدة"
      onBack={onBack}
      description="تحليل بسيط بيقارن بين الفلوس اللي بتكسبها من العميل على مدار علاقته بيك (LTV) والفلوس اللي بتصرفها عشان تجيبه (CAC). بيوريك إذا كان البيزنس بتاعك بيكسب فعلاً من كل عميل ولا لأ."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">القيمة الدائمة للعميل (LTV) (ج.م)</label>
            <input
              type="number"
              value={ltv}
              onChange={(e) => handleChange('ltv', e.target.value)}
              className="mt-1 block w-full p-2 border rounded-md"
              placeholder="إجمالي الربح المتوقع من عميل واحد"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">تكلفة اكتساب العميل (CAC) (ج.م)</label>
            <input
              type="number"
              value={cac}
              onChange={(e) => handleChange('cac', e.target.value)}
              className="mt-1 block w-full p-2 border rounded-md"
              placeholder="متوسط تكلفة التسويق والمبيعات لكل عميل جديد"
            />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg">
          <p className="text-lg text-slate-600">نسبة LTV إلى CAC</p>
          <p className="text-4xl font-bold font-mono my-2">{ratio.toFixed(2)} : 1</p>
          {getRatioInterpretation()}
        </div>
      </div>
    </ToolContainer>
  );
};

export default UnitEconomics;
