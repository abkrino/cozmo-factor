
import React, { useState } from 'react';
import { RawMaterialItem, PackagingMaterialItem, WrappingMaterialItem, FinishedProductItem } from '../types';
import { CloseIcon } from './icons';

interface AddItemModalProps {
  onClose: () => void;
  setRawMaterials: React.Dispatch<React.SetStateAction<RawMaterialItem[]>>;
  setPackagingMaterials: React.Dispatch<React.SetStateAction<PackagingMaterialItem[]>>;
  setWrappingMaterials: React.Dispatch<React.SetStateAction<WrappingMaterialItem[]>>;
  setFinishedProducts: React.Dispatch<React.SetStateAction<FinishedProductItem[]>>;
}

const AddItemModal: React.FC<AddItemModalProps> = ({ onClose, setRawMaterials, setPackagingMaterials, setWrappingMaterials, setFinishedProducts }) => {
  const [itemType, setItemType] = useState('raw');
  const [formData, setFormData] = useState<any>({
    sku: '',
    name: '',
    quantity: 0,
    reorderLevel: 0,
    supplier: '',
    unit: 'kg',
    cost: 0,
    publicPrice: 0,
    wholesalePrice: 0,
    distributorPrice: 0,
    agentPrice: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: name === 'quantity' || name === 'reorderLevel' || name.includes('Price') || name === 'cost' ? Number(value) : value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem = {
        ...formData,
        id: `NEW-${Date.now()}`,
        lastUpdated: new Date().toISOString().split('T')[0],
    };

    switch (itemType) {
        case 'raw':
            setRawMaterials(prev => [...prev, newItem as RawMaterialItem]);
            break;
        case 'packaging':
            setPackagingMaterials(prev => [...prev, { ...newItem, unit: 'count' } as PackagingMaterialItem]);
            break;
        case 'wrapping':
            setWrappingMaterials(prev => [...prev, { ...newItem, unit: 'count' } as WrappingMaterialItem]);
            break;
        case 'finished':
            setFinishedProducts(prev => [...prev, { ...newItem, unit: 'count', supplier: 'إنتاج داخلي' } as FinishedProductItem]);
            break;
    }
    onClose();
  };

  const renderFormFields = () => {
    const commonFields = (
      <>
        <div className="col-span-2">
          <label htmlFor="name" className="block text-sm font-medium text-slate-700">اسم الصنف</label>
          <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
        </div>
        <div>
          <label htmlFor="sku" className="block text-sm font-medium text-slate-700">SKU</label>
          <input type="text" name="sku" id="sku" value={formData.sku} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
        </div>
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-slate-700">الكمية</label>
          <input type="number" name="quantity" id="quantity" value={formData.quantity} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
        </div>
        <div>
          <label htmlFor="reorderLevel" className="block text-sm font-medium text-slate-700">نقطة إعادة الطلب</label>
          <input type="number" name="reorderLevel" id="reorderLevel" value={formData.reorderLevel} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
        </div>
      </>
    );

    switch (itemType) {
      case 'raw':
        return (
          <>
            {commonFields}
            <div>
              <label htmlFor="supplier" className="block text-sm font-medium text-slate-700">المورد</label>
              <input type="text" name="supplier" id="supplier" value={formData.supplier} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
            </div>
            <div>
                <label htmlFor="unit" className="block text-sm font-medium text-slate-700">الوحدة</label>
                <select name="unit" id="unit" value={formData.unit} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                    <option value="kg">kg</option>
                    <option value="count">count</option>
                </select>
            </div>
             <div>
              <label htmlFor="cost" className="block text-sm font-medium text-slate-700">التكلفة</label>
              <input type="number" name="cost" id="cost" value={formData.cost} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
            </div>
          </>
        );
      case 'packaging':
      case 'wrapping':
        return (
          <>
            {commonFields}
            <div>
              <label htmlFor="supplier" className="block text-sm font-medium text-slate-700">المورد</label>
              <input type="text" name="supplier" id="supplier" value={formData.supplier} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
            </div>
             <div>
              <label htmlFor="cost" className="block text-sm font-medium text-slate-700">التكلفة</label>
              <input type="number" name="cost" id="cost" value={formData.cost} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
            </div>
          </>
        );
      case 'finished':
        return (
          <>
            {commonFields}
            <div>
              <label htmlFor="publicPrice" className="block text-sm font-medium text-slate-700">سعر الجمهور</label>
              <input type="number" name="publicPrice" id="publicPrice" value={formData.publicPrice} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
            </div>
            <div>
              <label htmlFor="wholesalePrice" className="block text-sm font-medium text-slate-700">سعر الجملة</label>
              <input type="number" name="wholesalePrice" id="wholesalePrice" value={formData.wholesalePrice} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
            </div>
             <div>
              <label htmlFor="distributorPrice" className="block text-sm font-medium text-slate-700">سعر الموزع</label>
              <input type="number" name="distributorPrice" id="distributorPrice" value={formData.distributorPrice} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
            </div>
            <div>
              <label htmlFor="agentPrice" className="block text-sm font-medium text-slate-700">سعر الوكيل</label>
              <input type="number" name="agentPrice" id="agentPrice" value={formData.agentPrice} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-30 flex justify-center items-center" onClick={onClose}>
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl transform transition-all" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-lg font-bold text-slate-800">إضافة صنف جديد</h3>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100">
                    <CloseIcon className="w-6 h-6 text-slate-600"/>
                </button>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-4">
                    <div>
                        <label htmlFor="itemType" className="block text-sm font-medium text-slate-700">نوع الصنف</label>
                        <select
                            id="itemType"
                            name="itemType"
                            value={itemType}
                            onChange={(e) => setItemType(e.target.value)}
                            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                            <option value="raw">مادة خام</option>
                            <option value="packaging">مادة تعبئة</option>
                            <option value="wrapping">مادة تغليف</option>
                            <option value="finished">منتج نهائي</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderFormFields()}
                    </div>
                </div>
                <div className="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm">
                        إضافة
                    </button>
                    <button type="button" onClick={onClose} className="mt-3 w-full inline-flex justify-center rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                        إلغاء
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
};

export default AddItemModal;
