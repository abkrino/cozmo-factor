import React, { useState, useEffect } from 'react';
import { Customer, PaymentType, CustomerStatus } from '../types';
import { CloseIcon } from './icons';

interface AddCustomerModalProps {
  onClose: () => void;
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  customerToEdit: Customer | null;
}

const AddCustomerModal: React.FC<AddCustomerModalProps> = ({ onClose, setCustomers, customerToEdit }) => {
  const isEditing = !!customerToEdit;
  
  const [formData, setFormData] = useState({
    name: '',
    paymentType: PaymentType.CASH,
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    creditLimit: 0,
  });

  useEffect(() => {
    if (isEditing) {
      setFormData({
        name: customerToEdit.name,
        paymentType: customerToEdit.paymentType,
        contactPerson: customerToEdit.contactPerson,
        email: customerToEdit.email,
        phone: customerToEdit.phone,
        address: customerToEdit.address,
        creditLimit: customerToEdit.creditLimit,
      });
    }
  }, [customerToEdit, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'creditLimit' ? Number(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
        setCustomers(prev => prev.map(c => c.id === customerToEdit.id ? { ...customerToEdit, ...formData } : c));
    } else {
        const newCustomer: Customer = {
        ...formData,
        id: `CUST-${Date.now()}`,
        joinDate: new Date().toISOString().split('T')[0],
        status: CustomerStatus.ACTIVE,
        };
        setCustomers(prev => [newCustomer, ...prev]);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-30 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl transform transition-all" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-bold text-slate-800">{isEditing ? 'تعديل بيانات العميل' : 'إضافة عميل جديد'}</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100">
            <CloseIcon className="w-6 h-6 text-slate-600"/>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700">اسم العميل</label>
              <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm" required />
            </div>
            <div>
              <label htmlFor="contactPerson" className="block text-sm font-medium text-slate-700">مسؤول التواصل</label>
              <input type="text" name="contactPerson" id="contactPerson" value={formData.contactPerson} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm" required />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">البريد الإلكتروني</label>
              <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm" required />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700">الهاتف</label>
              <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm" required />
            </div>
             <div className="col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-slate-700">العنوان</label>
              <textarea name="address" id="address" value={formData.address} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm" rows={3} required ></textarea>
            </div>
             <div>
              <label htmlFor="paymentType" className="block text-sm font-medium text-slate-700">نوع الدفع</label>
              <select name="paymentType" id="paymentType" value={formData.paymentType} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm">
                {Object.values(PaymentType).map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="creditLimit" className="block text-sm font-medium text-slate-700">حد الائتمان (ج.م)</label>
              <input type="number" name="creditLimit" id="creditLimit" value={formData.creditLimit} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm" min="0" required />
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

export default AddCustomerModal;