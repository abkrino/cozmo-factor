import React, { useState } from 'react';
import { Sale, SalesChannel, Customer, FinishedProductItem } from '../types';
import { PlusIcon, ChevronDownIcon } from './icons';
import AddSaleModal from './AddSaleModal';
import PrintButton from './PrintButton';

interface SalesProps {
  sales: Sale[];
  onAddSale: (newSale: Sale) => void;
  customers: Customer[];
  finishedProducts: FinishedProductItem[];
}

const Sales: React.FC<SalesProps> = ({ sales, onAddSale, customers, finishedProducts }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedSaleId, setExpandedSaleId] = useState<string | null>(null);

  const toggleExpand = (saleId: string) => {
    setExpandedSaleId(prev => (prev === saleId ? null : saleId));
  };

  const getChannelBadge = (channel: SalesChannel) => {
    const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
    switch (channel) {
      case SalesChannel.PUBLIC:
        return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>{channel}</span>;
      case SalesChannel.WHOLESALE:
        return <span className={`${baseClasses} bg-purple-100 text-purple-800`}>{channel}</span>;
      case SalesChannel.DISTRIBUTOR:
        return <span className={`${baseClasses} bg-indigo-100 text-indigo-800`}>{channel}</span>;
      case SalesChannel.AGENT:
        return <span className={`${baseClasses} bg-teal-100 text-teal-800`}>{channel}</span>;
      default:
        return null;
    }
  };
  
  const renderSaleDetails = (sale: Sale) => {
    const totalBeforeDiscount = sale.items.reduce((sum, item) => sum + (item.publicPrice * item.quantity), 0);
    const totalDiscountedAmount = (totalBeforeDiscount - sale.subtotal) + sale.additionalDiscount;

    return (
     <div className="p-4 bg-white rounded-md border animate-fade-in">
        <h4 className="font-bold mb-3 text-slate-800">تفاصيل الفاتورة</h4>
        <div className="space-y-2 mb-4">
             <table className="w-full text-sm text-right">
                <thead className="text-xs text-slate-600 bg-slate-100">
                    <tr>
                        <th className="p-2">المنتج</th>
                        <th className="p-2">الكمية</th>
                        {sale.channel !== SalesChannel.PUBLIC && <th className="p-2">السعر الأصلي</th>}
                        {sale.channel !== SalesChannel.PUBLIC && <th className="p-2">خصم %</th>}
                        <th className="p-2">السعر النهائي للوحدة</th>
                        <th className="p-2">الإجمالي</th>
                    </tr>
                </thead>
                <tbody>
                    {sale.items.map(item => (
                        <tr key={item.productSku} className="border-b">
                            <td className="p-2">{item.productName}</td>
                            <td className="p-2">{item.quantity}</td>
                            {sale.channel !== SalesChannel.PUBLIC && <td className="p-2">{item.publicPrice.toLocaleString('ar-EG')}</td>}
                            {sale.channel !== SalesChannel.PUBLIC && <td className="p-2 text-green-600">{item.discountPercentage.toFixed(1)}%</td>}
                            <td className="p-2 font-semibold">{item.unitPrice.toLocaleString('ar-EG')}</td>
                            <td className="p-2 font-bold">{item.lineTotal.toLocaleString('ar-EG')}</td>
                        </tr>
                    ))}
                </tbody>
             </table>
        </div>
        <div className="flex justify-between items-start pt-2 border-t text-sm">
            <div>
                <h5 className="font-semibold">ملاحظات:</h5>
                <p className="text-slate-600">{sale.notes || 'لا يوجد'}</p>
            </div>
            <div className="text-left space-y-1">
                <p>الإجمالي قبل الخصم: <span className="font-bold font-mono">{totalBeforeDiscount.toLocaleString('ar-EG')} ج.م</span></p>
                <p>إجمالي ما تم خصمه: <span className="font-bold font-mono text-red-600">{totalDiscountedAmount.toLocaleString('ar-EG')} ج.م</span></p>
                <p className="text-base font-bold text-indigo-700">الإجمالي بعد الخصم: <span className="font-mono">{sale.totalPrice.toLocaleString('ar-EG')} ج.م</span></p>
            </div>
        </div>
     </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-900">إدارة المبيعات</h2>
        <div className="flex items-center gap-2 print:hidden">
          <PrintButton />
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            إضافة فاتورة بيع
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm text-right text-slate-500">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50">
            <tr>
              <th scope="col" className="px-2 py-3 w-12 print:hidden"></th>
              <th scope="col" className="px-6 py-3">رقم الطلب</th>
              <th scope="col" className="px-6 py-3">اسم العميل</th>
              <th scope="col" className="px-6 py-3">المنتجات</th>
              <th scope="col" className="px-6 py-3">إجمالي الكمية</th>
              <th scope="col" className="px-6 py-3">السعر الإجمالي (ج.م)</th>
              <th scope="col" className="px-6 py-3">قناة البيع</th>
              <th scope="col" className="px-6 py-3">التاريخ</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <React.Fragment key={sale.id}>
                <tr className="bg-white border-b hover:bg-slate-50">
                    <td className="px-2 py-4 print:hidden">
                        <button onClick={() => toggleExpand(sale.id)} className="p-1 rounded-full hover:bg-slate-100">
                        <ChevronDownIcon className={`w-5 h-5 text-slate-500 transition-transform ${expandedSaleId === sale.id ? 'rotate-180' : ''}`} />
                        </button>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">{sale.orderId}</td>
                    <td className="px-6 py-4">{sale.customerName}</td>
                    <td className="px-6 py-4 max-w-xs truncate" title={sale.items.map(i => i.productName).join(', ')}>
                        {sale.items.map(i => i.productName).join(', ')}
                    </td>
                    <td className="px-6 py-4">{sale.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                    <td className="px-6 py-4 font-mono font-bold text-indigo-700">{sale.totalPrice.toLocaleString()}</td>
                    <td className="px-6 py-4">{getChannelBadge(sale.channel)}</td>
                    <td className="px-6 py-4">{sale.date}</td>
                </tr>
                {expandedSaleId === sale.id && (
                    <tr className="bg-slate-50 print:border-t-2 print:border-black">
                        <td colSpan={8} className="p-4">
                           {renderSaleDetails(sale)}
                        </td>
                    </tr>
                )}
              </React.Fragment>
            ))}
             {sales.length === 0 && (
                <tr>
                    <td colSpan={8} className="text-center py-4 text-slate-500">
                        لم يتم تسجيل أي عمليات بيع.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {isModalOpen && (
        <AddSaleModal 
          onClose={() => setIsModalOpen(false)} 
          onAddSale={onAddSale}
          customers={customers}
          finishedProducts={finishedProducts}
        />
      )}
    </div>
  );
};

export default Sales;