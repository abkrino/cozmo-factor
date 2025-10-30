import React from 'react';
import { BackIcon } from '../icons';
import PrintButton from '../PrintButton';

interface ToolContainerProps {
  title: string;
  onBack: () => void;
  children: React.ReactNode;
  description?: string;
}

export const ToolContainer: React.FC<ToolContainerProps> = ({ title, onBack, children, description }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-slate-100 transition-colors print:hidden"
          aria-label="العودة"
        >
          <BackIcon className="w-6 h-6 text-slate-700" />
        </button>
        <h2 className="text-3xl font-bold text-slate-900">{title}</h2>
        <div className="mr-auto print:hidden">
          <PrintButton />
        </div>
      </div>
      {description && (
         <div className="bg-indigo-50 border-r-4 border-indigo-400 p-4 rounded-r-lg">
          <p className="text-slate-700">{description}</p>
        </div>
      )}
      <div className="bg-white p-6 rounded-lg shadow">
        {children}
      </div>
    </div>
  );
};