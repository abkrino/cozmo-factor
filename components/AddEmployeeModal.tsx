import React, { useState } from 'react';
import { Employee } from '../types';
import { CloseIcon } from './icons';

interface AddEmployeeModalProps {
  onClose: () => void;
  onAddEmployee: (newEmployee: Employee) => void;
}

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ onClose, onAddEmployee }) => {
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    department: '',
    hireDate: new Date().toISOString().split('T')[0],
    hourlyRate: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'hourlyRate' ? Number(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEmployee: Employee = {
      ...formData,
      id: `EMP-${Date.now()}`,
    };
    onAddEmployee(newEmployee);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-30 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl transform transition-all" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-bold text-slate-800">إضافة موظف جديد</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100">
            <CloseIcon className="w-6 h-6 text-slate-600"/>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700">اسم الموظف</label>
              <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm" required />
            </div>
             <div>
              <label htmlFor="position" className="block text-sm font-medium text-slate-700">المنصب</label>
              <input type="text" name="position" id="position" value={formData.position} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm" required />
            </div>
             <div>
              <label htmlFor="department" className="block text-sm font-medium text-slate-700">القسم</label>
              <input type="text" name="department" id="department" value={formData.department} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm" required />
            </div>
            <div>
              <label htmlFor="hireDate" className="block text-sm font-medium text-slate-700">تاريخ التعيين</label>
              <input type="date" name="hireDate" id="hireDate" value={formData.hireDate} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm" required />
            </div>
             <div className="col-span-2">
              <label htmlFor="hourlyRate" className="block text-sm font-medium text-slate-700">الأجر بالساعة (ج.م)</label>
              <input type="number" name="hourlyRate" id="hourlyRate" value={formData.hourlyRate} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm" min="0" required />
            </div>
          </div>
          <div className="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 sm:ml-3 sm:w-auto sm:text-sm">
              إضافة الموظف
            </button>
            <button type="button" onClick={onClose} className="mt-3 w-full inline-flex justify-center rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeModal;