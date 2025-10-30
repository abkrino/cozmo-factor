import React, { useState } from 'react';
import { AttendanceLog, Employee } from '../types';
import { CloseIcon } from './icons';

interface AddAttendanceModalProps {
  onClose: () => void;
  onAddAttendance: (newLog: AttendanceLog) => void;
  employees: Employee[];
}

const AddAttendanceModal: React.FC<AddAttendanceModalProps> = ({ onClose, onAddAttendance, employees }) => {
  const [formData, setFormData] = useState({
    employeeName: employees[0]?.name || '',
    date: new Date().toISOString().split('T')[0],
    checkIn: '',
    checkOut: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.employeeName || !formData.checkIn) {
      alert("يرجى اختيار موظف وإدخال وقت الحضور.");
      return;
    }
    const newLog: AttendanceLog = {
      ...formData,
      id: `ATT-${Date.now()}`,
      checkOut: formData.checkOut || undefined,
    };
    onAddAttendance(newLog);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-30 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl transform transition-all" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-bold text-slate-800">تسجيل حضور وانصراف</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100">
            <CloseIcon className="w-6 h-6 text-slate-600"/>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-2">
              <label htmlFor="employeeName" className="block text-sm font-medium text-slate-700">الموظف</label>
              <select name="employeeName" id="employeeName" value={formData.employeeName} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm" required>
                {employees.map(emp => <option key={emp.id} value={emp.name}>{emp.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-slate-700">التاريخ</label>
              <input type="date" name="date" id="date" value={formData.date} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm" required />
            </div>
             <div>
              <label htmlFor="checkIn" className="block text-sm font-medium text-slate-700">وقت الحضور</label>
              <input type="time" name="checkIn" id="checkIn" value={formData.checkIn} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm" required />
            </div>
            <div>
              <label htmlFor="checkOut" className="block text-sm font-medium text-slate-700">وقت الانصراف (اختياري)</label>
              <input type="time" name="checkOut" id="checkOut" value={formData.checkOut} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm" />
            </div>
          </div>
          <div className="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 sm:ml-3 sm:w-auto sm:text-sm">
              تسجيل
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

export default AddAttendanceModal;