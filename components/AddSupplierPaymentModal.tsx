import React, { useState, useEffect } from 'react';
import { SupplierPayment, Supplier } from '../types';
import { CloseIcon } from './icons';

interface AddSupplierPaymentModalProps {
  onClose: () => void;
  setPayments: React.Dispatch<React.SetStateAction<SupplierPayment[]>>;
  suppliers: Supplier[];
  paymentToEdit: SupplierPayment | null;
}

const AddSupplierPaymentModal: React.FC<AddSupplierPaymentModalProps> = ({ onClose, setPayments, suppliers, paymentToEdit }) => {
  const isEditing = !!paymentToEdit;

  const [formData, setFormData] = useState({
    supplierName: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (isEditing) {
      setFormData({
        supplierName: paymentToEdit.supplierName,
        amount: paymentToEdit.amount,
        date: paymentToEdit.date,
      });
    } else {
        setFormData({
            supplierName: suppliers[0]?.name || '',
            amount: 0,
            date: new Date().toISOString().split('T')[0],
        });
    }
  }, [paymentToEdit, isEditing, suppliers]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'amount' ? Number(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.supplierName) {
      alert('يرجى اختيار مورد.');
      return;
    }

    if (isEditing) {
        setPayments(prev => prev.map(p => p.id === paymentToEdit.id ? { ...paymentToEdit, ...formData } : p));
    } else {
        const newPayment: SupplierPayment = {
        ...formData,
        id: `PAY-S-${Date.now()}`,
        };
        setPayments(prev => [newPayment, ...prev]);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-30 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-bold text-slate-800">{isEditing ? 'تعديل الدفعة' : 'إضافة دفعة جديدة'}</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100">
            <CloseIcon className="w-6 h-6 text-slate-600"/>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="supplierName" className="block text-sm font-medium text-slate-700">اسم المورد</label>
              <select 
                name="supplierName" 
                id="supplierName" 
                value={formData.supplierName} 
                onChange={handleChange} 
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm" 
                required
              >
                <option value="" disabled>اختر مورد</option>
                {suppliers.map(supplier => (
                  <option key={supplier.id} value={supplier.name}>{supplier.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-slate-700">المبلغ (ج.م)</label>
              <input type="number" name="amount" id="amount" value={formData.amount} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm" min="0" required />
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-slate-700">تاريخ الدفعة</label>
              <input type="date" name="date" id="date" value={formData.date} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm" required />
            </div>
          </div>
          <div className="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 sm:ml-3 sm:w-auto sm:text-sm">
              {isEditing ? 'حفظ التعديلات' : 'حفظ'}
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

export default AddSupplierPaymentModal;