import React, { useState } from 'react';
import { ReturnRequest, ReturnStatus, Sale } from '../types';
import { PlusIcon, ChevronDownIcon } from './icons';
import AddReturnRequestModal from './AddReturnRequestModal';
import PrintButton from './PrintButton';

interface ReturnsProps {
  returnRequests: ReturnRequest[];
  sales: Sale[];
  onStatusChange: (requestId: string, newStatus: ReturnStatus) => void;
  onAddReturnRequest: (newRequest: ReturnRequest) => void;
}

const Returns: React.FC<ReturnsProps> = ({ returnRequests, sales, onStatusChange, onAddReturnRequest }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null);

  const toggleExpand = (requestId: string) => {
    setExpandedRequestId(prev => (prev === requestId ? null : requestId));
  };
  
  const getStatusBadge = (status: ReturnStatus) => {
    const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
    switch (status) {
        case ReturnStatus.PENDING: return <span className={`${baseClasses} bg-slate-100 text-slate-800`}>{status}</span>;
        case ReturnStatus.APPROVED: return <span className={`${baseClasses} bg-green-100 text-green-800`}>{status}</span>;
        case ReturnStatus.REJECTED: return <span className={`${baseClasses} bg-red-100 text-red-800`}>{status}</span>;
        default: return <span className={`${baseClasses} bg-slate-100 text-slate-800`}>{status}</span>;
    }
  };

  const getStatusColor = (status: ReturnStatus) => {
    switch (status) {
      case ReturnStatus.PENDING: return 'bg-slate-100 text-slate-800';
      case ReturnStatus.APPROVED: return 'bg-green-100 text-green-800';
      case ReturnStatus.REJECTED: return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const renderReturnDetails = (request: ReturnRequest) => (
    <div className="p-4 bg-white rounded-md border animate-fade-in">
        <h4 className="font-bold mb-3 text-slate-800">المنتجات المرتجعة</h4>
        <ul className="space-y-2">
            {request.items.map(item => (
                <li key={item.productSku} className="flex justify-between items-center p-2 bg-slate-100 rounded text-sm">
                    <span>{item.productName}</span>
                    <span className="font-bold">{item.quantity} وحدة</span>
                </li>
            ))}
        </ul>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-900">إدارة المرتجعات</h2>
        <div className="flex items-center gap-2 print:hidden">
          <PrintButton />
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            تسجيل طلب إرجاع
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm text-right text-slate-500">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50">
            <tr>
              <th scope="col" className="px-2 py-3 w-12 print:hidden"></th>
              <th scope="col" className="px-6 py-3">رقم طلب الإرجاع</th>
              <th scope="col" className="px-6 py-3">العميل</th>
              <th scope="col" className="px-6 py-3">المنتجات</th>
              <th scope="col" className="px-6 py-3">سبب الإرجاع</th>
              <th scope="col" className="px-6 py-3">الحالة</th>
              <th scope="col" className="px-6 py-3">التاريخ</th>
            </tr>
          </thead>
          <tbody>
            {returnRequests.map((request) => (
             <React.Fragment key={request.id}>
                <tr className="bg-white border-b hover:bg-slate-50">
                    <td className="px-2 py-4 print:hidden">
                        <button onClick={() => toggleExpand(request.id)} className="p-1 rounded-full hover:bg-slate-100">
                            <ChevronDownIcon className={`w-5 h-5 text-slate-500 transition-transform ${expandedRequestId === request.id ? 'rotate-180' : ''}`} />
                        </button>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">
                        {request.returnRequestId}
                        <span className="block text-xs text-slate-500">(من فاتورة: {request.salesInvoiceId})</span>
                    </td>
                    <td className="px-6 py-4">{request.customerName}</td>
                    <td className="px-6 py-4 max-w-xs truncate" title={request.items.map(i => i.productName).join(', ')}>
                        {request.items.map(i => `${i.productName} (x${i.quantity})`).join(', ')}
                    </td>
                    <td className="px-6 py-4">{request.reason}</td>
                    <td className="px-6 py-4">
                        <div className="print:hidden">
                          <select
                              value={request.status}
                              onChange={(e) => onStatusChange(request.id, e.target.value as ReturnStatus)}
                              className={`p-1 rounded text-xs font-semibold border-0 focus:ring-2 focus:ring-indigo-500 ${getStatusColor(request.status)}`}
                              onClick={(e) => e.stopPropagation()}
                          >
                              {Object.values(ReturnStatus).map(status => (
                                  <option key={status} value={status}>{status}</option>
                              ))}
                          </select>
                        </div>
                        <div className="hidden print:block">
                          {getStatusBadge(request.status)}
                        </div>
                    </td>
                    <td className="px-6 py-4">{request.date}</td>
                </tr>
                {expandedRequestId === request.id && (
                    <tr className="bg-slate-50 print:border-t-2 print:border-black">
                        <td colSpan={7} className="p-4">
                           {renderReturnDetails(request)}
                        </td>
                    </tr>
                )}
              </React.Fragment>
            ))}
            {returnRequests.length === 0 && (
                <tr>
                    <td colSpan={7} className="text-center py-4 text-slate-500">لا توجد طلبات إرجاع.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {isModalOpen && (
        <AddReturnRequestModal 
            onClose={() => setIsModalOpen(false)}
            onAddReturnRequest={onAddReturnRequest}
            sales={sales}
        />
      )}
    </div>
  );
};

export default Returns;