import React, { useState } from 'react';
import { ProductionOrder, ProductionStatus, FinishedProductItem } from '../types';
import { CloseIcon } from './icons';

interface AddProductionOrderModalProps {
  onClose: () => void;
  setProductionOrders: React.Dispatch<React.SetStateAction<ProductionOrder[]>>;
  finishedProducts: FinishedProductItem[];
}

const AddProductionOrderModal: React.FC<AddProductionOrderModalProps> = ({ onClose, setProductionOrders, finishedProducts }) => {
  const [selectedProductSku, setSelectedProductSku] = useState(finishedProducts[0]?.sku || '');
  const [quantity, setQuantity] = useState(100);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductSku || quantity <= 0 || !startDate || !endDate) {
      alert('يرجى ملء جميع الحقول بشكل صحيح.');
      return;
    }

    const selectedProduct = finishedProducts.find(p => p.sku === selectedProductSku);
    if (!selectedProduct) {
        alert('المنتج المختار غير صالح.');
        return;
    }

    const newOrder: ProductionOrder = {
      id: `PO-${Date.now()}`,
      productName: selectedProduct.name,
      productSku: selectedProduct.sku,
      quantity,
      startDate,
      endDate,
      status: ProductionStatus.PENDING,
    };

    setProductionOrders(prev => [newOrder, ...prev]);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-30 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl transform transition-all" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-bold text-slate-800">إنشاء أمر إنتاج جديد</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100">
            <CloseIcon className="w-6 h-6 text-slate-600"/>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-2">
              <label htmlFor="productSku" className="block text-sm font-medium text-slate-700">المنتج</label>
              <select
                id="productSku"
                value={selectedProductSku}
                onChange={(e) => setSelectedProductSku(e.target.value)}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm"
                required
              >
                {finishedProducts.map(product => (
                  <option key={product.id} value={product.sku}>{product.name} ({product.sku})</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-slate-700">الكمية المطلوبة</label>
              <input type="number" id="quantity" value={quantity} onChange={e => setQuantity(Number(e.target.value))} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm" min="1" required />
            </div>
             <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-slate-700">تاريخ البدء</label>
              <input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm" required />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-slate-700">تاريخ الانتهاء المتوقع</label>
              <input type="date" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm" required />
            </div>
          </div>
          <div className="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 sm:ml-3 sm:w-auto sm:text-sm">
              إنشاء الأمر
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

export default AddProductionOrderModal;