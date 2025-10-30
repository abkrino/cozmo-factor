import React, { useState, useEffect } from 'react';
import { ReturnRequest, Sale, SaleItem, ReturnStatus, ReturnItem } from '../types';
import { CloseIcon } from './icons';

interface AddReturnRequestModalProps {
  onClose: () => void;
  onAddReturnRequest: (newRequest: ReturnRequest) => void;
  sales: Sale[];
}

const AddReturnRequestModal: React.FC<AddReturnRequestModalProps> = ({ onClose, onAddReturnRequest, sales }) => {
  const [selectedSaleId, setSelectedSaleId] = useState(sales[0]?.id || '');
  const [reason, setReason] = useState('');
  const [returnedItems, setReturnedItems] = useState<Map<string, number>>(new Map());

  const selectedSale = sales.find(s => s.id === selectedSaleId);

  useEffect(() => {
    // Reset returned items when sale changes
    setReturnedItems(new Map());
  }, [selectedSaleId]);

  const handleQuantityChange = (productSku: string, quantity: number, maxQuantity: number) => {
    const newReturnedItems = new Map(returnedItems);
    if (quantity > 0 && quantity <= maxQuantity) {
      newReturnedItems.set(productSku, quantity);
    } else if (quantity <= 0) {
      newReturnedItems.delete(productSku);
    }
    setReturnedItems(newReturnedItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSale || returnedItems.size === 0 || !reason) {
      alert('يرجى اختيار فاتورة، تحديد منتج واحد على الأقل للإرجاع، وكتابة السبب.');
      return;
    }
    
    const itemsToReturn: ReturnItem[] = Array.from(returnedItems.entries()).map(([sku, quantity]) => {
        const saleItem = selectedSale.items.find(item => item.productSku === sku);
        return {
            productSku: sku,
            productName: saleItem?.productName || 'Unknown',
            quantity: quantity,
        };
    });

    const newRequest: ReturnRequest = {
      id: `RET-${Date.now()}`,
      returnRequestId: `RTN-${Date.now()}`,
      salesInvoiceId: selectedSale.orderId,
      customerName: selectedSale.customerName,
      items: itemsToReturn,
      reason,
      status: ReturnStatus.PENDING,
      date: new Date().toISOString().split('T')[0],
    };

    onAddReturnRequest(newRequest);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-30 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl transform transition-all" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-bold text-slate-800">تسجيل طلب إرجاع جديد</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100">
            <CloseIcon className="w-6 h-6 text-slate-600"/>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <div>
              <label htmlFor="saleId" className="block text-sm font-medium text-slate-700">اختر الفاتورة</label>
              <select
                id="saleId"
                value={selectedSaleId}
                onChange={e => setSelectedSaleId(e.target.value)}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm"
                required
              >
                {sales.map(sale => (
                  <option key={sale.id} value={sale.id}>
                    {sale.orderId} - {sale.customerName} ({sale.date})
                  </option>
                ))}
              </select>
            </div>
            {selectedSale && (
              <div>
                <h4 className="text-md font-semibold text-slate-800 mb-2">المنتجات في الفاتورة</h4>
                <div className="space-y-2">
                  {selectedSale.items.map(item => (
                    <div key={item.productSku} className="flex items-center justify-between p-2 bg-slate-50 rounded-md">
                      <div className="flex-1">
                        <span className="font-medium">{item.productName}</span>
                        <span className="text-xs text-slate-500 block">الكمية المباعة: {item.quantity}</span>
                      </div>
                      <div>
                        <label htmlFor={`qty-${item.productSku}`} className="text-sm mr-2">الكمية المرتجعة:</label>
                        <input
                          type="number"
                          id={`qty-${item.productSku}`}
                          min="0"
                          max={item.quantity}
                          value={returnedItems.get(item.productSku) || ''}
                          onChange={e => handleQuantityChange(item.productSku, parseInt(e.target.value), item.quantity)}
                          className="w-20 p-1 border rounded-md"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-slate-700">سبب الإرجاع</label>
              <textarea
                id="reason"
                value={reason}
                onChange={e => setReason(e.target.value)}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm"
                rows={3}
                required
              ></textarea>
            </div>
          </div>
          <div className="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 sm:ml-3 sm:w-auto sm:text-sm">
              تسجيل الطلب
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

export default AddReturnRequestModal;