import React, { useState } from 'react';
import { Customer, Payment, CustomerStatus, Sale } from '../types';
import { PlusIcon, EditIcon } from './icons';
import AddCustomerModal from './AddCustomerModal';
import AddPaymentModal from './AddPaymentModal';
import PrintButton from './PrintButton';

interface CustomersProps {
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  payments: Payment[];
  setPayments: React.Dispatch<React.SetStateAction<Payment[]>>;
  sales: Sale[];
}

const Customers: React.FC<CustomersProps> = ({ customers, setCustomers, payments, setPayments, sales }) => {
  const [activeTab, setActiveTab] = useState<'customers' | 'payments'>('customers');
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);

  const handleOpenCustomerModal = (customer: Customer | null = null) => {
    setEditingCustomer(customer);
    setIsCustomerModalOpen(true);
  };

  const handleCloseCustomerModal = () => {
    setIsCustomerModalOpen(false);
    setEditingCustomer(null);
  };

  const handleOpenPaymentModal = (payment: Payment | null = null) => {
    setEditingPayment(payment);
    setIsPaymentModalOpen(true);
  };
  
  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setEditingPayment(null);
  };

  const handleStatusChange = (customerId: string, newStatus: CustomerStatus) => {
    setCustomers(customers.map(c => c.id === customerId ? { ...c, status: newStatus } : c));
  };

  const getStatusBadge = (status: CustomerStatus) => {
    const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
    return status === CustomerStatus.ACTIVE
      ? <span className={`${baseClasses} bg-green-100 text-green-800`}>{status}</span>
      : <span className={`${baseClasses} bg-slate-100 text-slate-800`}>{status}</span>;
  };

  const renderCustomersTable = () => (
    <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
      <table className="w-full text-sm text-right text-slate-500">
        <thead className="text-xs text-slate-700 uppercase bg-slate-50">
          <tr>
            <th scope="col" className="px-6 py-3">اسم العميل</th>
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
          {customers.map((customer) => {
            const totalSales = sales
              .filter(s => s.customerName === customer.name)
              .reduce((sum, s) => sum + s.totalPrice, 0);
            const totalPayments = payments
              .filter(p => p.customerName === customer.name)
              .reduce((sum, p) => sum + p.amount, 0);
            const outstandingBalance = totalSales - totalPayments;
            const isOverLimit = customer.creditLimit > 0 && outstandingBalance > customer.creditLimit;

            return (
              <tr key={customer.id} className="bg-white border-b hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">{customer.name}</td>
                <td className="px-6 py-4">{customer.contactPerson}</td>
                <td className="px-6 py-4">{customer.phone}</td>
                <td className="px-6 py-4">{customer.joinDate}</td>
                <td className="px-6 py-4">
                  <div className="print:hidden">
                    <select
                      value={customer.status}
                      onChange={(e) => handleStatusChange(customer.id, e.target.value as CustomerStatus)}
                      className={`p-1 rounded text-xs font-semibold border-0 focus:ring-2 focus:ring-indigo-500 ${
                        customer.status === CustomerStatus.ACTIVE ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value={CustomerStatus.ACTIVE}>نشط</option>
                      <option value={CustomerStatus.INACTIVE}>غير نشط</option>
                    </select>
                  </div>
                  <div className="hidden print:block">
                    {getStatusBadge(customer.status)}
                  </div>
                </td>
                <td className="px-6 py-4 font-mono">{customer.creditLimit.toLocaleString()}</td>
                <td className={`px-6 py-4 font-mono font-bold ${isOverLimit ? 'text-red-600' : 'text-slate-800'}`}>
                  {outstandingBalance.toLocaleString()}
                </td>
                <td className="px-6 py-4 print:hidden">
                  <button onClick={() => handleOpenCustomerModal(customer)} className="flex items-center gap-1 px-2 py-1 text-xs font-semibold text-indigo-600 bg-indigo-100 rounded-md hover:bg-indigo-200 transition-colors">
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
            <th scope="col" className="px-6 py-3">اسم العميل</th>
            <th scope="col" className="px-6 py-3">تاريخ الدفعة</th>
            <th scope="col" className="px-6 py-3">المبلغ (ج.م)</th>
            <th scope="col" className="px-6 py-3 print:hidden">إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id} className="bg-white border-b hover:bg-slate-50">
              <td className="px-6 py-4 font-medium text-slate-900">{payment.customerName}</td>
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
        <h2 className="text-3xl font-bold text-slate-900">إدارة العملاء</h2>
        <div className="flex items-center gap-2 print:hidden">
          <PrintButton />
          <button
            onClick={() => activeTab === 'customers' ? handleOpenCustomerModal() : handleOpenPaymentModal()}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            {activeTab === 'customers' ? 'إضافة عميل جديد' : 'إضافة دفعة'}
          </button>
        </div>
      </div>

      <div className="border-b border-slate-200 print:hidden">
        <nav className="-mb-px flex gap-6" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('customers')}
            className={`shrink-0 border-b-2 px-1 pb-4 text-sm font-medium ${
              activeTab === 'customers'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
            }`}
          >
            قائمة العملاء
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

      {activeTab === 'customers' ? renderCustomersTable() : renderPaymentsTable()}
      
      {isCustomerModalOpen && (
        <AddCustomerModal 
            onClose={handleCloseCustomerModal} 
            setCustomers={setCustomers} 
            customerToEdit={editingCustomer}
        />
      )}
      {isPaymentModalOpen && (
        <AddPaymentModal 
            onClose={handleClosePaymentModal} 
            setPayments={setPayments} 
            customers={customers}
            paymentToEdit={editingPayment}
        />
      )}
    </div>
  );
};

export default Customers;