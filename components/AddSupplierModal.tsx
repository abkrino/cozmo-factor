import React, { useState, useEffect } from 'react';
import { Supplier, PaymentType, CustomerStatus } from '../types';
import { CloseIcon } from './icons';

interface AddSupplierModalProps {
  onClose: () => void;
  setSuppliers: React.Dispatch<React.SetStateAction<Supplier[]>>;
  supplierToEdit: Supplier | null;
}

const AddSupplierModal: React.FC<AddSupplierModalProps> = ({ onClose, setSuppliers, supplierToEdit }) => {
  const isEditing = !!supplierToEdit;
  
  const [formData, setFormData] = useState({
    name: '',
    paymentType: PaymentType.CASH,
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    creditLimit: 0,
    materialsSupplied: '',
  });

  useEffect(() => {
    if (isEditing) {
      setFormData({
        name: supplierToEdit.name,
        paymentType: supplierToEdit.paymentType,
        contactPerson: supplierToEdit.contactPerson,
        email: supplierToEdit.email,
        phone: supplierToEdit.phone,
        address: supplierToEdit.address,
        creditLimit: supplierToEdit.creditLimit,
        materialsSupplied: supplierToEdit.materialsSupplied.join(', '),
      });
    }
  }, [supplierToEdit, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'creditLimit' ? Number(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const materialsArray = formData.materialsSupplied.split(',').map(m => m.trim());

    if (isEditing) {
        setSuppliers(prev => prev.map(s => s.id === supplierToEdit.id ? { ...supplierToEdit, ...formData, materialsSupplied: materialsArray } : s));
    } else {
        const newSupplier: Supplier = {
            ...formData,
            id: `SUP-${Date.now()}`,
            joinDate: new Date().toISOString().split('T')[0],
            status: CustomerStatus.ACTIVE,
            materialsSupplied: materialsArray,
        };
        setSuppliers(prev => [newSupplier, ...prev]);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-30 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl transform transition-all" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-bold text-slate-800">{isEditing ? 'تعديل بيانات المورد' : 'إضافة مورد جديد'}</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100">
            <CloseIcon className="w-6 h-6 text-slate-600"/>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700">اسم المورد</label>
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
              <textarea name="address" id="address" value={formData.address} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm" rows={2} required ></textarea>
            </div>
             <div className="col-span-2">
              <label htmlFor="materialsSupplied" className="block text-sm font-medium text-slate-700">المواد الموردة (افصل بينها بفاصلة)</label>
              <input type="text" name="materialsSupplied" id="materialsSupplied" value={formData.materialsSupplied} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm" required />
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

export default AddSupplierModal;