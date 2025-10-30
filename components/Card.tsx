import React from 'react';

interface CardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color?: string;
}

const Card: React.FC<CardProps> = ({ title, value, icon, color = 'text-indigo-600' }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow flex items-center space-x-4 rtl:space-x-reverse">
      <div className={`p-3 rounded-full bg-indigo-100 ${color}`}>
        {React.cloneElement(icon as React.ReactElement, { className: 'h-6 w-6' })}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className={`text-2xl font-bold ${color.replace('text-', 'text-')}`}>{value}</p>
      </div>
    </div>
  );
};

export default Card;