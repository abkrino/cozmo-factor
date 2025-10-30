import React, { useState } from 'react';
import { PurchaseOrder, PurchaseStatus, PaymentType, SupplierPayment, Supplier } from '../types';
import { PlusIcon, ChevronDownIcon, EditIcon } from './icons';
import AddPurchaseOrderModal from './AddPurchaseOrderModal';
import PrintButton from './PrintButton';

interface PurchasesProps {
  purchaseOrders: PurchaseOrder[];
  setPurchaseOrders: React.Dispatch<React.SetStateAction<PurchaseOrder[]>>;
  supplierPayments: SupplierPayment[];
  suppliers: Supplier[];
}

const Purchases: React.FC<PurchasesProps> = ({ purchaseOrders, setPurchaseOrders, supplierPayments, suppliers }) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'payments'>('orders');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPurchaseOrder, setEditingPurchaseOrder] = useState<PurchaseOrder | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const toggleExpand = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const handleOpenModal = (order: PurchaseOrder | null = null) => {
    setEditingPurchaseOrder(order);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPurchaseOrder(null);
  };

  const handleStatusChange = (orderId: string, newStatus: PurchaseStatus) => {
    setPurchaseOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const getStatusBadge = (status: PurchaseStatus) => {
    const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
    switch (status) {
        case PurchaseStatus.PENDING: return <span className={`${baseClasses} bg-slate-100 text-slate-800`}>{status}</span>;
        case PurchaseStatus.ORDERED: return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>{status}</span>;
        case PurchaseStatus.RECEIVED: return <span className={`${baseClasses} bg-green-100 text-green-800`}>{status}</span>;
        case PurchaseStatus.CANCELLED: return <span className={`${baseClasses} bg-red-100 text-red-800`}>{status}</span>;
        default: return null;
    }
  };

  const getPaymentTypeBadge = (type: PaymentType) => {
    const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
    switch (type) {
      case PaymentType.CASH:
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>{type}</span>;
      case PaymentType.CREDIT:
        return <span className={`${baseClasses} bg-orange-100 text-orange-800`}>{type}</span>;
      default:
        return null;
    }
  };

  const renderPurchaseOrders = () => (
    <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
      <table className="w-full text-sm text-right text-slate-500">
        <thead className="text-xs text-slate-700 uppercase bg-slate-50">
          <tr>
            <th scope="col" className="px-6 py-3 w-12 print:hidden"></th>
            <th scope="col" className="px-6 py-3">رقم الطلب</th>
            <th scope="col" className="px-6 py-3">اسم المورد</th>
            <th scope="col" className="px-6 py-3">التاريخ</th>
            <th scope="col" className="px-6 py-3">المبلغ الإجمالي (ج.م)</th>
            <th scope="col" className="px-6 py-3">نوع الدفع</th>
            <th scope="col" className="px-6 py-3">الحالة</th>
            <th scope="col" className="px-6 py-3 print:hidden">إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {purchaseOrders.map((order) => (
            <React.Fragment key={order.id}>
              <tr className="bg-white border-b hover:bg-slate-50">
                <td className="px-6 py-4 print:hidden">
                  <button onClick={() => toggleExpand(order.id)}>
                    <ChevronDownIcon className={`w-5 h-5 transition-transform ${expandedOrderId === order.id ? 'rotate-180' : ''}`} />
                  </button>
                </td>
                <td className="px-6 py-4 font-medium text-slate-900">{order.id}</td>
                <td className="px-6 py-4">{order.supplierName}</td>
                <td className="px-6 py-4">{order.date}</td>
                <td className="px-6 py-4">{order.totalAmount.toLocaleString()}</td>
                <td className="px-6 py-4">{getPaymentTypeBadge(order.paymentType)}</td>
                <td className="px-6 py-4">
                   <div className="print:hidden">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as PurchaseStatus)}
                      className={`p-1 rounded text-xs font-semibold border-0 focus:ring-2 focus:ring-indigo-500 ${
                        order.status === PurchaseStatus.RECEIVED ? 'bg-green-100 text-green-800' : 
                        order.status === PurchaseStatus.ORDERED ? 'bg-blue-100 text-blue-800' : 
                        order.status === PurchaseStatus.CANCELLED ? 'bg-red-100 text-red-800' : 
                        'bg-slate-100 text-slate-800'
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {Object.values(PurchaseStatus).map(status => (
                          <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                   </div>
                   <div className="hidden print:block">
                      {getStatusBadge(order.status)}
                   </div>
                </td>
                <td className="px-6 py-4 print:hidden">
                  <button onClick={() => handleOpenModal(order)} className="flex items-center gap-1 px-2 py-1 text-xs font-semibold text-indigo-600 bg-indigo-100 rounded-md hover:bg-indigo-200 transition-colors">
                    <EditIcon className="w-4 h-4" />
                    تعديل
                  </button>
                </td>
              </tr>
              {expandedOrderId === order.id && (
                <tr className="bg-slate-50 print:border-t-2 print:border-black">
                  <td colSpan={8} className="p-4">
                    <div className="p-4 bg-white rounded-md border">
                      <h4 className="font-bold mb-2">تفاصيل الطلب:</h4>
                      <table className="w-full text-sm">
                        <thead className="text-xs text-slate-600 bg-slate-100">
                          <tr>
                            <th className="p-2 text-right">المادة</th>
                            <th className="p-2 text-right">التصنيف</th>
                            <th className="p-2 text-right">الكمية/العدد</th>
                            <th className="p-2 text-right">الوحدة</th>
                            <th className="p-2 text-right">تكلفة الوحدة</th>
                            <th className="p-2 text-right">الإجمالي</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.items.map(item => (
                            <tr key={item.id} className="border-b">
                              <td className="p-2">{item.itemName}</td>
                              <td className="p-2">{item.category}</td>
                              <td className="p-2">{item.quantity}</td>
                              <td className="p-2">{item.unit}</td>
                              <td className="p-2">{item.costPerUnit.toLocaleString()}</td>
                              <td className="p-2">{(item.quantity * item.costPerUnit).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderSupplierPayments = () => (
    <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
      <table className="w-full text-sm text-right text-slate-500">
        <thead className="text-xs text-slate-700 uppercase bg-slate-50">
          <tr>
            <th scope="col" className="px-6 py-3">اسم المورد</th>
            <th scope="col" className="px-6 py-3">تاريخ الدفعة</th>
            <th scope="col" className="px-6 py-3">المبلغ (ج.م)</th>
          </tr>
        </thead>
        <tbody>
          {supplierPayments.map((payment) => (
            <tr key={payment.id} className="bg-white border-b hover:bg-slate-50">
              <td className="px-6 py-4 font-medium text-slate-900">{payment.supplierName}</td>
              <td className="px-6 py-4">{payment.date}</td>
              <td className="px-6 py-4 font-mono">{payment.amount.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-900">إدارة المشتريات</h2>
        <div className="flex items-center gap-2 print:hidden">
          <PrintButton />
          <button 
            onClick={() => activeTab === 'orders' ? handleOpenModal() : alert('Add payment from Suppliers tab')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            {activeTab === 'orders' ? 'إضافة أمر شراء' : 'إضافة دفعة'}
          </button>
        </div>
      </div>

       <div className="border-b border-slate-200 print:hidden">
        <nav className="-mb-px flex gap-6" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('orders')}
            className={`shrink-0 border-b-2 px-1 pb-4 text-sm font-medium ${
              activeTab === 'orders'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
            }`}
          >
            أوامر الشراء
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`shrink-0 border-b-2 px-1 pb-4 text-sm font-medium ${
              activeTab === 'payments'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
            }`}
          >
            مدفوعات الموردين
          </button>
        </nav>
      </div>

      {activeTab === 'orders' ? renderPurchaseOrders() : renderSupplierPayments()}
      
      {isModalOpen && (
        <AddPurchaseOrderModal 
            onClose={handleCloseModal}
            setPurchaseOrders={setPurchaseOrders}
            suppliers={suppliers}
            purchaseOrderToEdit={editingPurchaseOrder}
        />
      )}
    </div>
  );
};

export default Purchases;