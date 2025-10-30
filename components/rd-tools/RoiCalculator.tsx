import React from 'react';
import { ToolContainer } from './common';
import { RoiData } from '../../types';

interface RoiCalculatorProps {
  onBack: () => void;
  data: RoiData;
  updateData: (data: RoiData) => void;
}

const RoiCalculator: React.FC<RoiCalculatorProps> = ({ onBack, data, updateData }) => {
  const { investment, gain } = data;

  const handleChange = (field: keyof RoiData, value: string) => {
    const numericValue = Number(value);
    if (!isNaN(numericValue) && numericValue >= 0) {
      updateData({ ...data, [field]: numericValue });
    }
  };

  const netGain = gain - investment;
  const roi = investment > 0 ? (netGain / investment) * 100 : 0;

  const getRoiColor = () => {
    if (investment <= 0) return 'text-slate-800';
    if (roi < 0) return 'text-red-600';
    if (roi >= 0) return 'text-green-600';
    return 'text-slate-800';
  };

  return (
    <ToolContainer
      title="حاسبة العائد على الاستثمار (ROI)"
      onBack={onBack}
      description="أداة لقياس ربحية استثمار معين. بتقارن صافي الربح من الاستثمار بتكلفته، عشان تعرف كل جنيه استثمرته رجع لك بكام."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">مبلغ الاستثمار (ج.م)</label>
            <input
              type="number"
              value={investment}
              onChange={(e) => handleChange('investment', e.target.value)}
              className="mt-1 block w-full p-2 border rounded-md"
              placeholder="إجمالي التكلفة التي دفعتها"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">إجمالي العائد (ج.م)</label>
            <input
              type="number"
              value={gain}
              onChange={(e) => handleChange('gain', e.target.value)}
              className="mt-1 block w-full p-2 border rounded-md"
              placeholder="إجمالي المبلغ الذي حصلت عليه من الاستثمار"
            />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg">
          <p className="text-lg text-slate-600">العائد على الاستثمار (ROI)</p>
          <p className={`text-5xl font-bold font-mono my-2 ${getRoiColor()}`}>{roi.toFixed(1)}%</p>
          <p className="text-md text-slate-600">
            صافي الربح: <span className="font-mono">{netGain.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })}</span>
          </p>
        </div>
      </div>
    </ToolContainer>
  );
};

export default RoiCalculator;
