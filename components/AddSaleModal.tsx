import React, { useState, useEffect, useMemo } from 'react';
import { Sale, SalesChannel, Customer, FinishedProductItem, SaleItem } from '../types';
import { CloseIcon, PlusIcon } from './icons';

interface AddSaleModalProps {
  onClose: () => void;
  onAddSale: (newSale: Sale) => void;
  customers: Customer[];
  finishedProducts: FinishedProductItem[];
}

const AddSaleModal: React.FC<AddSaleModalProps> = ({ onClose, onAddSale, customers, finishedProducts }) => {
  const [customerName, setCustomerName] = useState(customers[0]?.name || '');
  const [channel, setChannel] = useState<SalesChannel>(SalesChannel.PUBLIC);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState<Partial<SaleItem>[]>([{}]);
  const [notes, setNotes] = useState('');
  const [additionalDiscount, setAdditionalDiscount] = useState(0);

  const productMap = useMemo(() => 
    new Map(finishedProducts.map(p => [p.sku, p])), 
    [finishedProducts]
  );
  
  const getPriceForChannel = (product: FinishedProductItem, channel: SalesChannel): number => {
    switch(channel) {
        case SalesChannel.WHOLESALE: return product.wholesalePrice;
        case SalesChannel.DISTRIBUTOR: return product.distributorPrice;
        case SalesChannel.AGENT: return product.agentPrice;
        case SalesChannel.PUBLIC:
        default:
            return product.publicPrice;
    }
  };

  const handleItemChange = (index: number, field: keyof SaleItem, value: any) => {
    const newItems = [...items];
    let currentItem = { ...newItems[index] };
    
    // Convert numeric fields from string input
    const numericValue = parseFloat(value);
    currentItem[field] = (field === 'quantity' || field === 'discountPercentage') && !isNaN(numericValue) ? numericValue : value;

    const product = productMap.get(currentItem.productSku || '');

    if (product) {
        // If product is changed, reset price info based on channel
        if (field === 'productSku') {
            const productData = productMap.get(value);
            if (productData) {
                currentItem.productName = productData.name;
                currentItem.publicPrice = productData.publicPrice;
                const unitPrice = getPriceForChannel(productData, channel);
                currentItem.unitPrice = unitPrice;
                currentItem.discountPercentage = productData.publicPrice > 0 ? ((productData.publicPrice - unitPrice) / productData.publicPrice) * 100 : 0;
            }
        }

        // If discount is manually changed, recalculate unit price
        if (field === 'discountPercentage' && currentItem.publicPrice) {
            const discount = isNaN(numericValue) ? 0 : numericValue;
            currentItem.unitPrice = currentItem.publicPrice * (1 - (discount / 100));
        }
        
        // Always recalculate line total if quantity or unit price is available
        if (currentItem.unitPrice !== undefined && currentItem.quantity !== undefined && currentItem.quantity > 0) {
            currentItem.lineTotal = currentItem.unitPrice * currentItem.quantity;
        } else {
            currentItem.lineTotal = 0;
        }
    }

    newItems[index] = currentItem;
    setItems(newItems);
  };
  
  const handleChannelChange = (newChannel: SalesChannel) => {
    setChannel(newChannel);
    // Recalculate prices for all items based on new channel default
    const newItems = items.map(item => {
        if (!item.productSku) return item;
        const product = productMap.get(item.productSku);
        if (product) {
            const unitPrice = getPriceForChannel(product, newChannel);
            const publicPrice = product.publicPrice;
            const discountPercentage = publicPrice > 0 ? ((publicPrice - unitPrice) / publicPrice) * 100 : 0;
            const lineTotal = item.quantity ? unitPrice * item.quantity : 0;
            return { ...item, unitPrice, publicPrice, discountPercentage, lineTotal };
        }
        return item;
    });
    setItems(newItems);
  };

  const addItemRow = () => {
    setItems([...items, {}]);
  };

  const removeItemRow = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const subtotalAfterLineDiscount = useMemo(() => items.reduce((sum, item) => sum + (item.lineTotal || 0), 0), [items]);
  const totalBeforeDiscount = useMemo(() => items.reduce((sum, item) => sum + ((item.publicPrice || 0) * (item.quantity || 0)), 0), [items]);
  const totalDiscountedAmount = useMemo(() => (totalBeforeDiscount - subtotalAfterLineDiscount) + additionalDiscount, [totalBeforeDiscount, subtotalAfterLineDiscount, additionalDiscount]);
  const finalTotalPrice = useMemo(() => subtotalAfterLineDiscount - additionalDiscount, [subtotalAfterLineDiscount, additionalDiscount]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validItems = items.filter(
      (item): item is SaleItem =>
        !!item.productSku &&
        !!item.productName &&
        item.quantity !== undefined && item.quantity > 0 &&
        item.unitPrice !== undefined
    );

    if (validItems.length === 0) {
      alert('يجب إضافة منتج واحد على الأقل.');
      return;
    }

    if (!customerName) {
        alert('يرجى اختيار عميل.');
        return;
    }
    
    // Check for stock availability
    for (const item of validItems) {
        const productInStock = productMap.get(item.productSku);
        if (!productInStock || productInStock.quantity < item.quantity) {
            alert(`الكمية غير كافية للمنتج: ${item.productName}. المتوفر: ${productInStock?.quantity || 0}`);
            return;
        }
    }

    const newSale: Sale = {
      id: `SALE-${Date.now()}`,
      orderId: `ORD-${Date.now()}`,
      customerName,
      channel,
      date,
      items: validItems,
      notes,
      additionalDiscount,
      subtotal: subtotalAfterLineDiscount,
      totalPrice: finalTotalPrice,
    };
    onAddSale(newSale);
    onClose();
  };
  
  const showDiscountColumns = channel !== SalesChannel.PUBLIC;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-30 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl transform transition-all flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-bold text-slate-800">فاتورة بيع جديدة</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100">
            <CloseIcon className="w-6 h-6 text-slate-600"/>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex-grow contents">
          <div className="p-6 space-y-4 overflow-y-auto" style={{maxHeight: '70vh'}}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div>
                    <label htmlFor="customerName" className="block text-sm font-medium text-slate-700">العميل</label>
                    <select id="customerName" value={customerName} onChange={e => setCustomerName(e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm" required>
                        {customers.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="channel" className="block text-sm font-medium text-slate-700">قناة البيع</label>
                    <select id="channel" value={channel} onChange={e => handleChannelChange(e.target.value as SalesChannel)} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm">
                        {Object.values(SalesChannel).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="date" className="block text-sm font-medium text-slate-700">التاريخ</label>
                    <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm" required />
                </div>
              </div>

              {/* Items Table */}
              <div className="overflow-x-auto">
                 <table className="w-full text-sm text-right">
                    <thead className="text-xs text-slate-500 bg-slate-100">
                        <tr>
                            <th className="p-2 w-2/5">المنتج</th>
                            <th className="p-2">الكمية</th>
                            {showDiscountColumns && <th className="p-2">السعر الأصلي</th>}
                            {showDiscountColumns && <th className="p-2">خصم %</th>}
                            <th className="p-2">السعر النهائي</th>
                            <th className="p-2">الإجمالي</th>
                            <th className="p-2 w-10"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                           <tr key={index} className="border-b">
                                <td className="p-1">
                                    <select 
                                        value={item.productSku || ''}
                                        onChange={e => handleItemChange(index, 'productSku', e.target.value)}
                                        className="w-full p-1 border-slate-200 rounded-md text-sm"
                                        required
                                    >
                                        <option value="" disabled>اختر منتج...</option>
                                        {finishedProducts.map(p => <option key={p.id} value={p.sku} disabled={p.quantity <= 0}>{p.name} (متوفر: {p.quantity})</option>)}
                                    </select>
                                </td>
                                <td className="p-1">
                                    <input type="number" min="1" value={item.quantity || ''} onChange={e => handleItemChange(index, 'quantity', e.target.value)} className="w-20 p-1 border-slate-200 rounded-md text-sm" required/>
                                </td>
                                {showDiscountColumns && <td className="p-1 text-center font-mono">{item.publicPrice?.toLocaleString() || '-'}</td>}
                                {showDiscountColumns && (
                                  <td className="p-1">
                                    <input
                                      type="number"
                                      step="0.1"
                                      value={item.discountPercentage !== undefined ? item.discountPercentage.toFixed(1) : ''}
                                      onChange={e => handleItemChange(index, 'discountPercentage', e.target.value)}
                                      className="w-20 p-1 border-slate-200 rounded-md text-sm text-center font-mono text-green-600"
                                    />
                                  </td>
                                )}
                                <td className="p-1 text-center font-mono">{item.unitPrice?.toLocaleString() || '-'}</td>
                                <td className="p-1 text-center font-mono font-semibold">{item.lineTotal?.toLocaleString() || '-'}</td>
                                <td className="p-1 text-center">
                                    {items.length > 1 && <button type="button" onClick={() => removeItemRow(index)} className="text-red-500 hover:text-red-700 p-1"><CloseIcon className="w-4 h-4"/></button>}
                                </td>
                           </tr>
                        ))}
                    </tbody>
                 </table>
              </div>
              <button type="button" onClick={addItemRow} className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-semibold py-1">
                <PlusIcon className="w-4 h-4"/>
                إضافة منتج آخر
              </button>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div>
                     <label htmlFor="notes" className="block text-sm font-medium text-slate-700">ملاحظات</label>
                     <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm" rows={2}></textarea>
                     <div className="mt-2">
                         <label htmlFor="additionalDiscount" className="block text-sm font-medium text-slate-700">خصم إضافي (إن وجد)</label>
                         <input type="number" id="additionalDiscount" value={additionalDiscount} onChange={e => setAdditionalDiscount(Number(e.target.value))} className="mt-1 w-full md:w-1/2 p-1 border-slate-300 rounded-md text-sm font-mono"/>
                     </div>
                </div>
                <div className="space-y-2 bg-slate-50 p-4 rounded-md text-sm">
                    <div className="flex justify-between items-center">
                        <span className="text-slate-600">الإجمالي قبل الخصم:</span>
                        <span className="font-bold font-mono">{totalBeforeDiscount.toLocaleString('ar-EG')} ج.م</span>
                    </div>
                     <div className="flex justify-between items-center">
                        <span className="text-slate-600">إجمالي ما تم خصمه:</span>
                        <span className="font-bold font-mono text-red-600">{totalDiscountedAmount.toLocaleString('ar-EG')} ج.م</span>
                    </div>
                     <div className="flex justify-between items-center border-t pt-2 mt-2">
                        <span className="font-bold text-lg text-slate-800">الإجمالي بعد الخصم:</span>
                        <span className="font-bold font-mono text-lg text-indigo-700">{finalTotalPrice.toLocaleString('ar-EG')} ج.م</span>
                    </div>
                </div>
             </div>
          </div>
          <div className="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse sticky bottom-0 border-t">
            <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 sm:ml-3 sm:w-auto sm:text-sm">
              حفظ الفاتورة
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

export default AddSaleModal;