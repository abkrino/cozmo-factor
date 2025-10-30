import React, { useState } from 'react';
import type { Employee, AttendanceLog, PayrollRecord } from '../types';
import { PlusIcon } from './icons';
import AddEmployeeModal from './AddEmployeeModal';
import AddAttendanceModal from './AddAttendanceModal';
import AddPayrollModal from './AddPayrollModal';
import PrintButton from './PrintButton';

interface HumanResourcesProps {
    employees: Employee[];
    attendance: AttendanceLog[];
    payroll: PayrollRecord[];
    onAddEmployee: (newEmployee: Employee) => void;
    onAddAttendance: (newLog: AttendanceLog) => void;
    onAddPayroll: (newRecord: PayrollRecord) => void;
}

const HumanResources: React.FC<HumanResourcesProps> = ({ employees, attendance, payroll, onAddEmployee, onAddAttendance, onAddPayroll }) => {
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [isPayrollModalOpen, setIsPayrollModalOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">إدارة الموارد البشرية</h1>
        <div className="print:hidden">
          <PrintButton />
        </div>
      </div>
      <div>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-slate-900">سجل الموظفين</h2>
            <button 
              onClick={() => setIsEmployeeModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors print:hidden">
              <PlusIcon className="w-5 h-5" />
              إضافة موظف
            </button>
        </div>
        <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
            <table className="w-full text-sm text-right text-slate-500">
                <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">الاسم</th>
                        <th scope="col" className="px-6 py-3">المنصب</th>
                        <th scope="col" className="px-6 py-3">القسم</th>
                        <th scope="col" className="px-6 py-3">تاريخ التعيين</th>
                        <th scope="col" className="px-6 py-3">الأجر/ساعة (ج.م)</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((employee) => (
                        <tr key={employee.id} className="bg-white border-b hover:bg-slate-50">
                            <td className="px-6 py-4 font-medium text-slate-900">{employee.name}</td>
                            <td className="px-6 py-4">{employee.position}</td>
                            <td className="px-6 py-4">{employee.department}</td>
                            <td className="px-6 py-4">{employee.hireDate}</td>
                            <td className="px-6 py-4">{employee.hourlyRate}</td>
                        </tr>
                    ))}
                     {employees.length === 0 && (
                        <tr><td colSpan={5} className="text-center py-4">لم يتم إضافة أي موظفين بعد.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-slate-900">سجل الحضور والانصراف</h2>
             <button 
              onClick={() => setIsAttendanceModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors print:hidden">
              <PlusIcon className="w-5 h-5" />
              تسجيل حضور
            </button>
        </div>
        <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
             <table className="w-full text-sm text-right text-slate-500">
                <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">اسم الموظف</th>
                        <th scope="col" className="px-6 py-3">التاريخ</th>
                        <th scope="col" className="px-6 py-3">وقت الحضور</th>
                        <th scope="col" className="px-6 py-3">وقت الانصراف</th>
                    </tr>
                </thead>
                <tbody>
                    {attendance.map((log) => (
                        <tr key={log.id} className="bg-white border-b hover:bg-slate-50">
                            <td className="px-6 py-4 font-medium text-slate-900">{log.employeeName}</td>
                            <td className="px-6 py-4">{log.date}</td>
                            <td className="px-6 py-4">{log.checkIn}</td>
                            <td className="px-6 py-4">{log.checkOut || 'لم يسجل'}</td>
                        </tr>
                    ))}
                    {attendance.length === 0 && (
                        <tr><td colSpan={4} className="text-center py-4">لا توجد سجلات حضور.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>

       <div>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-slate-900">مسير الرواتب</h2>
            <button 
              onClick={() => setIsPayrollModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors print:hidden">
              <PlusIcon className="w-5 h-5" />
              إصدار راتب
            </button>
        </div>
        <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
             <table className="w-full text-sm text-right text-slate-500">
                <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">اسم الموظف</th>
                        <th scope="col" className="px-6 py-3">فترة الدفع</th>
                        <th scope="col" className="px-6 py-3">إجمالي الساعات</th>
                        <th scope="col" className="px-6 py-3">الأجر/ساعة</th>
                        <th scope="col" className="px-6 py-3">إجمالي الراتب (ج.م)</th>
                    </tr>
                </thead>
                <tbody>
                    {payroll.map((record) => (
                        <tr key={record.id} className="bg-white border-b hover:bg-slate-50">
                            <td className="px-6 py-4 font-medium text-slate-900">{record.employeeName}</td>
                            <td className="px-6 py-4">{record.payPeriod}</td>
                            <td className="px-6 py-4">{record.totalHours}</td>
                            <td className="px-6 py-4">{record.hourlyRate}</td>
                            <td className="px-6 py-4 font-bold font-mono text-green-700">{record.totalPay.toLocaleString()}</td>
                        </tr>
                    ))}
                    {payroll.length === 0 && (
                        <tr><td colSpan={5} className="text-center py-4">لا توجد سجلات رواتب.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>

      {isEmployeeModalOpen && <AddEmployeeModal onClose={() => setIsEmployeeModalOpen(false)} onAddEmployee={onAddEmployee} />}
      {isAttendanceModalOpen && <AddAttendanceModal onClose={() => setIsAttendanceModalOpen(false)} onAddAttendance={onAddAttendance} employees={employees} />}
      {isPayrollModalOpen && <AddPayrollModal onClose={() => setIsPayrollModalOpen(false)} onAddPayroll={onAddPayroll} employees={employees} />}

    </div>
  );
};

export default HumanResources;