import React, { useState } from 'react';
import { ProductionOrder, ProductionStatus, FinishedProductItem } from '../types';
import { PlusIcon } from './icons';
import AddProductionOrderModal from './AddProductionOrderModal';
import PrintButton from './PrintButton';

interface ProductionProps {
  productionOrders: ProductionOrder[];
  setProductionOrders: React.Dispatch<React.SetStateAction<ProductionOrder[]>>;
  finishedProducts: FinishedProductItem[];
  onStatusChange: (orderId: string, newStatus: ProductionStatus) => void;
}

const Production: React.FC<ProductionProps> = ({ productionOrders, setProductionOrders, finishedProducts, onStatusChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
    
  const activeOrders = productionOrders.filter(order => order.status !== ProductionStatus.COMPLETED);
  const completedOrders = productionOrders.filter(order => order.status === ProductionStatus.COMPLETED);

  const getStatusBadge = (status: ProductionStatus) => {
    const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
    switch (status) {
      case ProductionStatus.PENDING:
        return <span className={`${baseClasses} bg-slate-100 text-slate-800`}>{ProductionStatus.PENDING}</span>;
      case ProductionStatus.IN_PROGRESS:
        return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>{ProductionStatus.IN_PROGRESS}</span>;
      case ProductionStatus.COMPLETED:
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>{ProductionStatus.COMPLETED}</span>;
      case ProductionStatus.DELAYED:
        return <span className={`${baseClasses} bg-red-100 text-red-800`}>{ProductionStatus.DELAYED}</span>;
      default:
        return null;
    }
  };

  const getStatusColor = (status: ProductionStatus) => {
    switch (status) {
      case ProductionStatus.PENDING: return 'bg-slate-100 text-slate-800';
      case ProductionStatus.IN_PROGRESS: return 'bg-blue-100 text-blue-800';
      case ProductionStatus.COMPLETED: return 'bg-green-100 text-green-800';
      case ProductionStatus.DELAYED: return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const renderOrdersTable = (orders: ProductionOrder[], emptyMessage: string) => (
    <table className="w-full text-sm text-right text-slate-500">
      <thead className="text-xs text-slate-700 uppercase bg-slate-50">
        <tr>
          <th scope="col" className="px-6 py-3">رقم الطلب</th>
          <th scope="col" className="px-6 py-3">اسم المنتج</th>
          <th scope="col" className="px-6 py-3">الكمية</th>
          <th scope="col" className="px-6 py-3">تاريخ البدء</th>
          <th scope="col" className="px-6 py-3">تاريخ الانتهاء</th>
          <th scope="col" className="px-6 py-3">الحالة</th>
        </tr>
      </thead>
      <tbody>
        {orders.length > 0 ? (
          orders.map((order) => (
            <tr key={order.id} className="bg-white border-b hover:bg-slate-50">
              <td className="px-6 py-4 font-medium text-slate-900">{order.id}</td>
              <td className="px-6 py-4">{order.productName}</td>
              <td className="px-6 py-4">{order.quantity}</td>
              <td className="px-6 py-4">{order.startDate}</td>
              <td className="px-6 py-4">{order.endDate}</td>
              <td className="px-6 py-4">
                <div className="print:hidden">
                  {order.status !== ProductionStatus.COMPLETED ? (
                      <select
                          value={order.status}
                          onChange={(e) => onStatusChange(order.id, e.target.value as ProductionStatus)}
                          className={`p-1 rounded text-xs font-semibold border-0 focus:ring-2 focus:ring-indigo-500 ${getStatusColor(order.status)}`}
                          onClick={(e) => e.stopPropagation()}
                      >
                          {Object.values(ProductionStatus).map(status => (
                              <option key={status} value={status}>{status}</option>
                          ))}
                      </select>
                  ) : (
                      getStatusBadge(order.status)
                  )}
                </div>
                <div className="hidden print:block">
                  {getStatusBadge(order.status)}
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={6} className="text-center py-4 text-slate-500">{emptyMessage}</td>
          </tr>
        )}
      </tbody>
    </table>
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-900">تخطيط الإنتاج</h2>
        <div className="flex items-center gap-2 print:hidden">
          <PrintButton />
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors">
            <PlusIcon className="w-5 h-5" />
            إنشاء أمر إنتاج
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-4">أوامر الإنتاج قيد التشغيل</h3>
        <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
          {renderOrdersTable(activeOrders, "لا توجد أوامر إنتاج نشطة حاليًا.")}
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-4">أوامر الإنتاج المكتملة</h3>
        <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
          {renderOrdersTable(completedOrders, "لا توجد أوامر إنتاج مكتملة.")}
        </div>
      </div>

      {isModalOpen && (
        <AddProductionOrderModal
          onClose={() => setIsModalOpen(false)}
          setProductionOrders={setProductionOrders}
          finishedProducts={finishedProducts}
        />
      )}
    </div>
  );
};

export default Production;