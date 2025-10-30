import React from 'react';
import { PrintIcon } from './icons';

const PrintButton = () => {
  return (
    <button
      onClick={() => window.print()}
      className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-200 rounded-lg shadow-sm hover:bg-slate-300 transition-colors"
      title="طباعة الصفحة الحالية"
    >
      <PrintIcon className="w-5 h-5" />
      <span>طباعة</span>
    </button>
  );
};

export default PrintButton;
