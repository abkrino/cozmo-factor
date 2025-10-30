import React, { useState, useEffect } from 'react';
import { QualityControlLog, QCStatus, ProductionOrder, PurchaseOrder, ReturnRequest, QualityControlType } from '../types';
import { CloseIcon } from './icons';

interface AddQualityLogModalProps {
  onClose: () => void;
  setQualityLogs: React.Dispatch<React.SetStateAction<QualityControlLog[]>>;
  qcType: QualityControlType;
  productionOrders: ProductionOrder[];
  purchaseOrders: PurchaseOrder[];
  returnRequests: ReturnRequest[];
}

const AddQualityLogModal: React.FC<AddQualityLogModalProps> = ({ 
    onClose, 
    setQualityLogs, 
    qcType,
    productionOrders, 
    purchaseOrders,
    returnRequests
}) => {
  const [formData, setFormData] = useState({
    referenceId: '',
    productName: '',
    inspector: '',
    status: QCStatus.PENDING,
    notes: '',
  });

  useEffect(() => {
    let productName = '';
    let referenceId = '';

    if (qcType === QualityControlType.PURCHASES) {
        referenceId = purchaseOrders[0]?.id || '';
        const selectedOrder = purchaseOrders.find(p => p.id === referenceId);
        productName = selectedOrder?.items[0]?.itemName || 'متعدد';
    } else if (qcType === QualityControlType.FINISHED_PRODUCTS) {
        referenceId = productionOrders[0]?.id || '';
        const selectedOrder = productionOrders.find(p => p.id === referenceId);
        productName = selectedOrder?.productName || '';
    } else if (qcType === QualityControlType.RETURNS) {
        referenceId = returnRequests[0]?.id || '';
        const selectedRequest = returnRequests.find(r => r.id === referenceId);
        productName = selectedRequest?.productName || '';
    }

    setFormData(prev => ({ ...prev, productName, referenceId }));
  }, [qcType, productionOrders, purchaseOrders, returnRequests]);


  useEffect(() => {
    let productName = '';
    if (qcType === QualityControlType.PURCHASES) {
        const selectedOrder = purchaseOrders.find(p => p.id === formData.referenceId);
        productName = selectedOrder?.items.length === 1 ? selectedOrder.items[0].itemName : 'أصناف متعددة';
    } else if (qcType === QualityControlType.FINISHED_PRODUCTS) {
        const selectedOrder = productionOrders.find(p => p.id === formData.referenceId);
        productName = selectedOrder?.productName || '';
    } else if (qcType === QualityControlType.RETURNS) {
        const selectedRequest = returnRequests.find(r => r.id === formData.referenceId);
        productName = selectedRequest?.productName || '';
    }
    setFormData(prev => ({ ...prev, productName }));
  }, [formData.referenceId, qcType, productionOrders, purchaseOrders, returnRequests]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productName || !formData.referenceId || !formData.inspector) {
        alert('يرجى ملء الحقول المطلوبة.');
        return;
    }

    const newLog: QualityControlLog = {
      ...formData,
      id: `QC-${Date.now()}`,
      type: qcType,
      date: new Date().toISOString().split('T')[0],
    };
    setQualityLogs(prev => [newLog, ...prev]);
    onClose();
  };
  
  const renderReferenceDropdown = () => {
    let label = '';
    // FIX: Changed type from JSX.Element[] to React.ReactNode[] to resolve "Cannot find namespace 'JSX'" error.
    let options: React.ReactNode[] = [];

    switch (qcType) {
        case QualityControlType.PURCHASES:
            label = 'رقم أمر الشراء';
            options = purchaseOrders.map(order => (
                <option key={order.id} value={order.id}>{order.id} - {order.supplierName}</option>
            ));
            break;
        case QualityControlType.FINISHED_PRODUCTS:
            label = 'رقم أمر الإنتاج';
            options = productionOrders.map(order => (
                <option key={order.id} value={order.id}>{order.id} - {order.productName}</option>
            ));
            break;
        case QualityControlType.RETURNS:
            label = 'رقم طلب الإرجاع';
            options = returnRequests.map(req => (
                <option key={req.id} value={req.id}>{req.id} - {req.customerName}</option>
            ));
            break;
        default:
            return null;
    }
    
    return (
         <div>
            <label htmlFor="referenceId" className="block text-sm font-medium text-slate-700">{label}</label>
            <select name="referenceId" id="referenceId" value={formData.referenceId} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm" required>
                <option value="" disabled>اختر مرجع...</option>
                {options}
            </select>
        </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-30 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl transform transition-all" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-bold text-slate-800">إضافة سجل لـ: {qcType}</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100">
            <CloseIcon className="w-6 h-6 text-slate-600"/>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderReferenceDropdown()}
            <div>
              <label htmlFor="productName" className="block text-sm font-medium text-slate-700">اسم المنتج/المادة</label>
              <input type="text" name="productName" id="productName" value={formData.productName} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm bg-slate-100" readOnly required />
            </div>
            <div>
              <label htmlFor="inspector" className="block text-sm font-medium text-slate-700">اسم المفتش</label>
              <input type="text" name="inspector" id="inspector" value={formData.inspector} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm" required />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-slate-700">الحالة</label>
              <select name="status" id="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm">
                {Object.values(QCStatus).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label htmlFor="notes" className="block text-sm font-medium text-slate-700">ملاحظات</label>
              <textarea name="notes" id="notes" value={formData.notes} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm" rows={3}></textarea>
            </div>
          </div>
          <div className="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 sm:ml-3 sm:w-auto sm:text-sm">
              حفظ السجل
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

export default AddQualityLogModal;