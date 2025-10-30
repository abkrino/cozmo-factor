import React, { useState, useEffect } from 'react';
import { PurchaseOrder, PurchaseOrderItem, PurchaseStatus, PaymentType, Supplier, Warehouse } from '../types';
import { CloseIcon, PlusIcon } from './icons';

interface AddPurchaseOrderModalProps {
  onClose: () => void;
  setPurchaseOrders: React.Dispatch<React.SetStateAction<PurchaseOrder[]>>;
  suppliers: Supplier[];
  purchaseOrderToEdit: PurchaseOrder | null;
}

// Local state type for items inside the modal
type ModalPurchaseItem = {
  itemName: string;
  category: Warehouse;
  quantity: number;
  unit: 'kg' | 'count';
  totalAmount: number;
};

const AddPurchaseOrderModal: React.FC<AddPurchaseOrderModalProps> = ({ onClose, setPurchaseOrders, suppliers, purchaseOrderToEdit }) => {
  const isEditing = !!purchaseOrderToEdit;

  const [supplierName, setSupplierName] = useState(suppliers[0]?.name || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentType, setPaymentType] = useState(PaymentType.CASH);
  const [items, setItems] = useState<ModalPurchaseItem[]>([
    { itemName: '', category: Warehouse.RAW_MATERIALS, quantity: 1, unit: 'kg', totalAmount: 0 }
  ]);
  const [status, setStatus] = useState<PurchaseStatus>(PurchaseStatus.PENDING);


  useEffect(() => {
    if (isEditing) {
      setSupplierName(purchaseOrderToEdit.supplierName);
      setDate(purchaseOrderToEdit.date);
      setPaymentType(purchaseOrderToEdit.paymentType);
      setStatus(purchaseOrderToEdit.status);
      setItems(purchaseOrderToEdit.items.map(item => ({
        itemName: item.itemName,
        category: item.category,
        quantity: item.quantity,
        unit: item.unit,
        totalAmount: item.quantity * item.costPerUnit,
      })));
    } else {
        setItems([{ itemName: '', category: Warehouse.RAW_MATERIALS, quantity: 1, unit: 'kg', totalAmount: 0 }]);
    }
  }, [purchaseOrderToEdit, isEditing]);


  const handleItemChange = (index: number, field: 'itemName' | 'category' | 'unit', value: string) => {
    const newItems = [...items];
    const item = { ...newItems[index], [field]: value };

    if (field === 'category') {
        const category = value as Warehouse;
        if (category === Warehouse.RAW_MATERIALS) {
            item.unit = 'kg';
        } else {
            item.unit = 'count';
        }
    }
    newItems[index] = item;
    setItems(newItems);
  };

  const handleNumericItemChange = (index: number, field: 'quantity' | 'totalAmount', value: number) => {
      const newItems = [...items];
      let cleanValue = value;
      if (isNaN(cleanValue) || cleanValue < 0) {
        cleanValue = 0;
      }
      newItems[index] = { ...newItems[index], [field]: cleanValue };
      setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { itemName: '', category: Warehouse.RAW_MATERIALS, quantity: 1, unit: 'kg', totalAmount: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const totalOrderAmount = items.reduce((sum, item) => sum + item.totalAmount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierName) {
      alert('يرجى اختيار مورد.');
      return;
    }
    if (items.length === 0 || items.some(item => !item.itemName || item.quantity <= 0)) {
        alert('يرجى ملء جميع تفاصيل الأصناف بشكل صحيح (الاسم والكمية).');
        return;
    }

    const finalItems: PurchaseOrderItem[] = items.map((item, index) => {
        const costPerUnit = item.quantity > 0 ? parseFloat((item.totalAmount / item.quantity).toFixed(2)) : 0;
        return {
          id: `item-${Date.now()}-${index}`, // This will be new even on edit, which is acceptable for this scope
          itemName: item.itemName,
          category: item.category,
          quantity: item.quantity,
          unit: item.unit,
          costPerUnit: costPerUnit,
        };
      });

    if (isEditing) {
        const updatedOrder: PurchaseOrder = {
            ...purchaseOrderToEdit,
            supplierName,
            date,
            paymentType,
            status,
            totalAmount: totalOrderAmount,
            items: finalItems
        };
        setPurchaseOrders(prev => prev.map(o => o.id === purchaseOrderToEdit.id ? updatedOrder : o));

    } else {
        const newOrder: PurchaseOrder = {
            id: `P-ORD-${Date.now()}`,
            supplierName,
            date,
            paymentType,
            status: PurchaseStatus.PENDING,
            totalAmount: totalOrderAmount,
            items: finalItems,
        };
        setPurchaseOrders(prev => [newOrder, ...prev]);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-30 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl transform transition-all" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-bold text-slate-800">{isEditing ? 'تعديل أمر الشراء' : 'إضافة أمر شراء جديد'}</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100">
            <CloseIcon className="w-6 h-6 text-slate-600"/>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="supplierName" className="block text-sm font-medium text-slate-700">المورد</label>
                <select
                  id="supplierName"
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
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
                <label htmlFor="date" className="block text-sm font-medium text-slate-700">التاريخ</label>
                <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm" required />
              </div>
              <div>
                <label htmlFor="paymentType" className="block text-sm font-medium text-slate-700">نوع الدفع</label>
                <select
                  id="paymentType"
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value as PaymentType)}
                  className="mt-1 block w-full rounded-md border-slate-300 shadow-sm"
                  required
                >
                  {Object.values(PaymentType).map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="pt-4 space-y-2">
              <h4 className="font-bold text-slate-800">الأصناف</h4>
              {items.map((item, index) => {
                return (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-2 p-2 bg-slate-50 rounded-md items-center">
                        <div className="md:col-span-4">
                            <label className="text-xs font-medium text-slate-600">اسم الصنف</label>
                            <input type="text" value={item.itemName} onChange={e => handleItemChange(index, 'itemName', e.target.value)} className="w-full p-1 border rounded-md text-sm" required/>
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-xs font-medium text-slate-600">التصنيف</label>
                            <select value={item.category} onChange={e => handleItemChange(index, 'category', e.target.value)} className="w-full p-1 border rounded-md text-xs">
                                {Object.values(Warehouse).filter(w => w !== Warehouse.FINISHED_PRODUCTS).map(w => <option key={w} value={w}>{w}</option>)}
                            </select>
                        </div>
                        <div className="md:col-span-3 flex gap-2">
                            <div className="flex-1">
                                <label className="text-xs font-medium text-slate-600">الكمية</label>
                                <input type="number" value={item.quantity} onChange={e => handleNumericItemChange(index, 'quantity', Number(e.target.value))} className="w-full p-1 border rounded-md text-sm" min="1" required/>
                            </div>
                            <div className="flex-1">
                                <label className="text-xs font-medium text-slate-600">الوحدة</label>
                                <select value={item.unit} onChange={e => handleItemChange(index, 'unit', e.target.value)} className="w-full p-1 border rounded-md text-xs">
                                    { item.category === Warehouse.RAW_MATERIALS ? (
                                        <>
                                            <option value="kg">kg</option>
                                            <option value="count">count</option>
                                        </>
                                    ) : (
                                        <option value="count">count</option>
                                    )}
                                </select>
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-xs font-medium text-slate-600">المبلغ الإجمالي</label>
                            <input type="number" step="0.01" value={item.totalAmount} onChange={e => handleNumericItemChange(index, 'totalAmount', Number(e.target.value))} className="w-full p-1 border rounded-md text-sm" min="0" required/>
                        </div>
                        <div className="flex items-center justify-end h-full md:col-span-1">
                            {items.length > 1 && (
                                <button type="button" onClick={() => removeItem(index)} className="p-1 text-red-500 hover:bg-red-100 rounded-full mt-3">
                                <CloseIcon className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                );
              })}
              <button type="button" onClick={addItem} className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-semibold py-1">
                <PlusIcon className="w-4 h-4"/>
                إضافة صنف
              </button>
            </div>

            <div className="text-left pt-4 border-t">
              <span className="text-lg font-bold">الإجمالي الكلي: {totalOrderAmount.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })}</span>
            </div>
          </div>

          <div className="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 sm:ml-3 sm:w-auto sm:text-sm">
              {isEditing ? 'حفظ التعديلات' : 'حفظ أمر الشراء'}
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

export default AddPurchaseOrderModal;