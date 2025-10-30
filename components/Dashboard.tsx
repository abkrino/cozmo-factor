

import React from 'react';
import { Sale, ProductionOrder, FinishedProductItem } from '../types';
import Card from './Card';
import { DollarIcon, FactoryIcon, ChartBarIcon } from './icons';
import PrintButton from './PrintButton';

interface DashboardProps {
  sales: Sale[];
  productionOrders: ProductionOrder[];
  finishedProducts: FinishedProductItem[];
}

const Dashboard: React.FC<DashboardProps> = ({ sales, productionOrders, finishedProducts }) => {

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalPrice, 0);
  const totalProduction = productionOrders.reduce((sum, order) => sum + order.quantity, 0);
  const totalStock = finishedProducts.reduce((sum, product) => sum + product.quantity, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-900">لوحة التحكم</h2>
        <div className="print:hidden">
          <PrintButton />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card 
          title="إجمالي الإيرادات"
          value={totalRevenue.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })}
          icon={<DollarIcon />}
        />
        <Card 
          title="إجمالي وحدات الإنتاج"
          value={totalProduction.toLocaleString()}
          icon={<FactoryIcon />}
        />
        <Card 
          title="إجمالي المخزون"
          value={totalStock.toLocaleString()}
          icon={<ChartBarIcon />}
          color="text-green-600"
        />
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold text-slate-800 mb-4">نظرة عامة</h3>
          <p className="text-slate-600">
            مرحباً بك في نظام إدارة المصنع. من هنا يمكنك مراقبة جميع جوانب عملياتك،
            من المخزون والإنتاج إلى المبيعات والتسويق. استخدم القائمة أعلاه للتنقل
            بين الأقسام المختلفة.
          </p>
        </div>
    </div>
  );
};

export default Dashboard;