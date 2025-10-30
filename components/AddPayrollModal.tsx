import React, { useState, useEffect, useMemo } from 'react';
import { PayrollRecord, Employee } from '../types';
import { CloseIcon } from './icons';

interface AddPayrollModalProps {
  onClose: () => void;
  onAddPayroll: (newRecord: PayrollRecord) => void;
  employees: Employee[];
}

const AddPayrollModal: React.FC<AddPayrollModalProps> = ({ onClose, onAddPayroll, employees }) => {
  const [employeeName, setEmployeeName] = useState(employees[0]?.name || '');
  const [payPeriod, setPayPeriod] = useState('');
  const [totalHours, setTotalHours] = useState(0);

  const selectedEmployee = useMemo(() => 
    employees.find(e => e.name === employeeName), 
    [employeeName, employees]
  );
  
  const hourlyRate = selectedEmployee?.hourlyRate || 0;
  const totalPay = totalHours * hourlyRate;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeName || !payPeriod || totalHours <= 0) {
      alert("يرجى ملء جميع الحقول بشكل صحيح.");
      return;
    }
    const newRecord: PayrollRecord = {
      id: `PAY-${Date.now()}`,
      employeeName,
      payPeriod,
      totalHours,
      hourlyRate,
      totalPay,
    };
    onAddPayroll(newRecord);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-30 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl transform transition-all" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-bold text-slate-800">إصدار سجل راتب</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100">
            <CloseIcon className="w-6 h-6 text-slate-600"/>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="employeeName" className="block text-sm font-medium text-slate-700">الموظف</label>
                <select name="employeeName" id="employeeName" value={employeeName} onChange={e => setEmployeeName(e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm" required>
                  {employees.map(emp => <option key={emp.id} value={emp.name}>{emp.name}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="payPeriod" className="block text-sm font-medium text-slate-700">فترة الدفع</label>
                <input type="text" name="payPeriod" id="payPeriod" value={payPeriod} onChange={e => setPayPeriod(e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm" placeholder="مثال: يوليو 2024" required />
              </div>
              <div>
                <label htmlFor="totalHours" className="block text-sm font-medium text-slate-700">إجمالي الساعات</label>
                <input type="number" name="totalHours" id="totalHours" value={totalHours} onChange={e => setTotalHours(Number(e.target.value))} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm" min="0" required />
              </div>
               <div>
                <label className="block text-sm font-medium text-slate-700">الأجر بالساعة</label>
                <p className="mt-1 p-2 bg-slate-100 rounded-md">{hourlyRate} ج.م</p>
              </div>
            </div>
            <div className="text-center pt-4 border-t">
              <p className="text-slate-600">إجمالي الراتب المستحق</p>
              <p className="text-3xl font-bold text-green-700 font-mono">{totalPay.toLocaleString()} ج.م</p>
            </div>
          </div>
          <div className="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 sm:ml-3 sm:w-auto sm:text-sm">
              إصدار السجل
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

export default AddPayrollModal;