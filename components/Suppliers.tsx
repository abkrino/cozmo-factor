import React, { useState } from 'react';
import { Supplier, SupplierPayment, PurchaseOrder, CustomerStatus } from '../types';
import { PlusIcon, EditIcon } from './icons';
import AddSupplierModal from './AddSupplierModal';
import AddSupplierPaymentModal from './AddSupplierPaymentModal';
import PrintButton from './PrintButton';

interface SuppliersProps {
  suppliers: Supplier[];
  setSuppliers: React.Dispatch<React.SetStateAction<Supplier[]>>;
  payments: SupplierPayment[];
  setPayments: React.Dispatch<React.SetStateAction<SupplierPayment[]>>;
  purchaseOrders: PurchaseOrder[];
}

const Suppliers: React.FC<SuppliersProps> = ({ suppliers, setSuppliers, payments, setPayments, purchaseOrders }) => {
  const [activeTab, setActiveTab] = useState<'suppliers' | 'payments'>('suppliers');
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [editingPayment, setEditingPayment] = useState<SupplierPayment | null>(null);

  const handleOpenSupplierModal = (supplier: Supplier | null = null) => {
    setEditingSupplier(supplier);
    setIsSupplierModalOpen(true);
  };

  const handleCloseSupplierModal = () => {
    setIsSupplierModalOpen(false);
    setEditingSupplier(null);
  };

  const handleOpenPaymentModal = (payment: SupplierPayment | null = null) => {
    setEditingPayment(payment);
    setIsPaymentModalOpen(true);
  };

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setEditingPayment(null);
  };

  const handleStatusChange = (supplierId: string, newStatus: CustomerStatus) => {
    setSuppliers(suppliers.map(s => s.id === supplierId ? { ...s, status: newStatus } : s));
  };

  const getStatusBadge = (status: CustomerStatus) => {
    const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
    return status === CustomerStatus.ACTIVE
      ? <span className={`${baseClasses} bg-green-100 text-green-800`}>{status}</span>
      : <span className={`${baseClasses} bg-slate-100 text-slate-800`}>{status}</span>;
  };

  const renderSuppliersTable = () => (
    <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
      <table className="w-full text-sm text-right text-slate-500">
        <thead className="text-xs text-slate-700 uppercase bg-slate-50">
          <tr>
            <th scope="col" className="px-6 py-3">اسم المورد</th>
            <th scope="col" className="px-6 py-3">مسؤول التواصل</th>
            <th scope="col" className="px-6 py-3">الهاتف</th>
            <th scope="col" className="px-6 py-3">تاريخ الانضمام</th>
            <th scope="col" className="px-6 py-3">الحالة</th>
            <th scope="col" className="px-6 py-3">حد الائتمان (ج.م)</th>
            <th scope="col" className="px-6 py-3">الرصيد المستحق (ج.م)</th>
            <th scope="col" className="px-6 py-3 print:hidden">إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier) => {
            const totalPurchases = purchaseOrders
              .filter(p => p.supplierName === supplier.name)
              .reduce((sum, p) => sum + p.totalAmount, 0);
            const totalPayments = payments
              .filter(p => p.supplierName === supplier.name)
              .reduce((sum, p) => sum + p.amount, 0);
            const outstandingBalance = totalPurchases - totalPayments;
            const isOverLimit = supplier.creditLimit > 0 && outstandingBalance > supplier.creditLimit;

            return (
              <tr key={supplier.id} className="bg-white border-b hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">{supplier.name}</td>
                <td className="px-6 py-4">{supplier.contactPerson}</td>
                <td className="px-6 py-4">{supplier.phone}</td>
                <td className="px-6 py-4">{supplier.joinDate}</td>
                <td className="px-6 py-4">
                  <div className="print:hidden">
                    <select
                      value={supplier.status}
                      onChange={(e) => handleStatusChange(supplier.id, e.target.value as CustomerStatus)}
                      className={`p-1 rounded text-xs font-semibold border-0 focus:ring-2 focus:ring-indigo-500 ${
                        supplier.status === CustomerStatus.ACTIVE ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value={CustomerStatus.ACTIVE}>نشط</option>
                      <option value={CustomerStatus.INACTIVE}>غير نشط</option>
                    </select>
                  </div>
                  <div className="hidden print:block">
                    {getStatusBadge(supplier.status)}
                  </div>
                </td>
                <td className="px-6 py-4 font-mono">{supplier.creditLimit.toLocaleString()}</td>
                <td className={`px-6 py-4 font-mono font-bold ${isOverLimit ? 'text-red-600' : 'text-slate-800'}`}>
                  {outstandingBalance.toLocaleString()}
                </td>
                <td className="px-6 py-4 print:hidden">
                   <button onClick={() => handleOpenSupplierModal(supplier)} className="flex items-center gap-1 px-2 py-1 text-xs font-semibold text-indigo-600 bg-indigo-100 rounded-md hover:bg-indigo-200 transition-colors">
                    <EditIcon className="w-4 h-4" />
                    تعديل
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  const renderPaymentsTable = () => (
    <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
      <table className="w-full text-sm text-right text-slate-500">
        <thead className="text-xs text-slate-700 uppercase bg-slate-50">
          <tr>
            <th scope="col" className="px-6 py-3">اسم المورد</th>
            <th scope="col" className="px-6 py-3">تاريخ الدفعة</th>
            <th scope="col" className="px-6 py-3">المبلغ (ج.م)</th>
            <th scope="col" className="px-6 py-3 print:hidden">إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id} className="bg-white border-b hover:bg-slate-50">
              <td className="px-6 py-4 font-medium text-slate-900">{payment.supplierName}</td>
              <td className="px-6 py-4">{payment.date}</td>
              <td className="px-6 py-4 font-mono">{payment.amount.toLocaleString()}</td>
              <td className="px-6 py-4 print:hidden">
                 <button onClick={() => handleOpenPaymentModal(payment)} className="flex items-center gap-1 px-2 py-1 text-xs font-semibold text-indigo-600 bg-indigo-100 rounded-md hover:bg-indigo-200 transition-colors">
                    <EditIcon className="w-4 h-4" />
                    تعديل
                  </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-900">إدارة الموردين</h2>
        <div className="flex items-center gap-2 print:hidden">
          <PrintButton />
          <button
            onClick={() => activeTab === 'suppliers' ? handleOpenSupplierModal() : handleOpenPaymentModal()}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            {activeTab === 'suppliers' ? 'إضافة مورد جديد' : 'إضافة دفعة'}
          </button>
        </div>
      </div>

      <div className="border-b border-slate-200 print:hidden">
        <nav className="-mb-px flex gap-6" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('suppliers')}
            className={`shrink-0 border-b-2 px-1 pb-4 text-sm font-medium ${
              activeTab === 'suppliers'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
            }`}
          >
            قائمة الموردين
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`shrink-0 border-b-2 px-1 pb-4 text-sm font-medium ${
              activeTab === 'payments'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
            }`}
          >
            سجل المدفوعات
          </button>
        </nav>
      </div>

      {activeTab === 'suppliers' ? renderSuppliersTable() : renderPaymentsTable()}
      
      {isSupplierModalOpen && (
        <AddSupplierModal 
            onClose={handleCloseSupplierModal} 
            setSuppliers={setSuppliers} 
            supplierToEdit={editingSupplier}
        />
      )}
      {isPaymentModalOpen && (
        <AddSupplierPaymentModal 
            onClose={handleClosePaymentModal} 
            setPayments={setPayments} 
            suppliers={suppliers}
            paymentToEdit={editingPayment}
        />
      )}
    </div>
  );
};

export default Suppliers;