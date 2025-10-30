import React, { useState } from 'react';
import { QualityControlLog, QCStatus, ProductionOrder, PurchaseOrder, ReturnRequest, QualityControlType } from '../types';
import { PlusIcon } from './icons';
import AddQualityLogModal from './AddQualityLogModal';
import PrintButton from './PrintButton';

interface QualityControlProps {
  qualityLogs: QualityControlLog[];
  setQualityLogs: React.Dispatch<React.SetStateAction<QualityControlLog[]>>;
  productionOrders: ProductionOrder[];
  purchaseOrders: PurchaseOrder[];
  returnRequests: ReturnRequest[];
  onStatusChange: (logId: string, newStatus: QCStatus) => void;
}

const QualityControl: React.FC<QualityControlProps> = ({ 
  qualityLogs, 
  setQualityLogs, 
  productionOrders, 
  purchaseOrders, 
  returnRequests, 
  onStatusChange 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<QualityControlType>(QualityControlType.PURCHASES);

  const getStatusBadge = (status: QCStatus) => {
    const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
    switch (status) {
        case QCStatus.PASS: return <span className={`${baseClasses} bg-green-100 text-green-800`}>{status}</span>;
        case QCStatus.FAIL: return <span className={`${baseClasses} bg-red-100 text-red-800`}>{status}</span>;
        case QCStatus.PENDING: return <span className={`${baseClasses} bg-slate-100 text-slate-800`}>{status}</span>;
        default: return <span className={`${baseClasses} bg-slate-100 text-slate-800`}>{status}</span>;
    }
  };

  const getStatusColor = (status: QCStatus) => {
    switch (status) {
      case QCStatus.PASS: return 'bg-green-100 text-green-800';
      case QCStatus.FAIL: return 'bg-red-100 text-red-800';
      case QCStatus.PENDING: return 'bg-slate-100 text-slate-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };
  
  const renderLogsTable = (logs: QualityControlLog[], referenceIdTitle: string) => (
      <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm text-right text-slate-500">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3">{referenceIdTitle}</th>
              <th scope="col" className="px-6 py-3">اسم المنتج/المادة</th>
              <th scope="col" className="px-6 py-3">التاريخ</th>
              <th scope="col" className="px-6 py-3">المفتش</th>
              <th scope="col" className="px-6 py-3">الحالة</th>
              <th scope="col" className="px-6 py-3">ملاحظات</th>
            </tr>
          </thead>
          <tbody>
            {logs.length > 0 ? logs.map((log) => (
              <tr key={log.id} className="bg-white border-b hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900 font-mono">{log.referenceId}</td>
                <td className="px-6 py-4">{log.productName}</td>
                <td className="px-6 py-4">{log.date}</td>
                <td className="px-6 py-4">{log.inspector}</td>
                <td className="px-6 py-4">
                   <div className="print:hidden">
                    <select
                          value={log.status}
                          onChange={(e) => onStatusChange(log.id, e.target.value as QCStatus)}
                          className={`p-1 rounded text-xs font-semibold border-0 focus:ring-2 focus:ring-indigo-500 ${getStatusColor(log.status)}`}
                          onClick={(e) => e.stopPropagation()}
                      >
                          {Object.values(QCStatus).map(status => (
                              <option key={status} value={status}>{status}</option>
                          ))}
                      </select>
                   </div>
                   <div className="hidden print:block">
                        {getStatusBadge(log.status)}
                   </div>
                </td>
                <td className="px-6 py-4">{log.notes || 'لا يوجد'}</td>
              </tr>
            )) : (
                <tr>
                    <td colSpan={6} className="text-center py-4 text-slate-500">لا توجد سجلات في هذا القسم.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
  );

  const renderActiveTable = () => {
      switch(activeTab) {
          case QualityControlType.PURCHASES:
              return renderLogsTable(qualityLogs.filter(l => l.type === activeTab), 'رقم أمر الشراء');
          case QualityControlType.FINISHED_PRODUCTS:
              return renderLogsTable(qualityLogs.filter(l => l.type === activeTab), 'رقم أمر الإنتاج');
          case QualityControlType.RETURNS:
              return renderLogsTable(qualityLogs.filter(l => l.type === activeTab), 'رقم طلب الإرجاع');
          default:
              return null;
      }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-900">مراقبة الجودة</h2>
        <div className="flex items-center gap-2 print:hidden">
            <PrintButton />
            <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors">
            <PlusIcon className="w-5 h-5" />
            إضافة سجل جودة
            </button>
        </div>
      </div>

      <div className="border-b border-slate-200 print:hidden">
        <nav className="-mb-px flex gap-6" aria-label="Tabs">
          {Object.values(QualityControlType).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 border-b-2 px-1 pb-4 text-sm font-medium ${
                activeTab === tab
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {renderActiveTable()}
      
      {isModalOpen && (
        <AddQualityLogModal
          onClose={() => setIsModalOpen(false)}
          setQualityLogs={setQualityLogs}
          qcType={activeTab}
          productionOrders={productionOrders}
          purchaseOrders={purchaseOrders}
          returnRequests={returnRequests}
        />
      )}
    </div>
  );
};

export default QualityControl;