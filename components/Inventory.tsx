import React, { useState, useMemo, useEffect } from 'react';
import { Warehouse, RawMaterialItem, PackagingMaterialItem, WrappingMaterialItem, FinishedProductItem, BillOfMaterialItem } from '../types';
import { PlusIcon, ChevronDownIcon, CloseIcon } from './icons';
import AddItemModal from './AddItemModal';
import PrintButton from './PrintButton';

interface InventoryProps {
  rawMaterials: RawMaterialItem[];
  setRawMaterials: React.Dispatch<React.SetStateAction<RawMaterialItem[]>>;
  packagingMaterials: PackagingMaterialItem[];
  setPackagingMaterials: React.Dispatch<React.SetStateAction<PackagingMaterialItem[]>>;
  wrappingMaterials: WrappingMaterialItem[];
  setWrappingMaterials: React.Dispatch<React.SetStateAction<WrappingMaterialItem[]>>;
  finishedProducts: FinishedProductItem[];
  setFinishedProducts: React.Dispatch<React.SetStateAction<FinishedProductItem[]>>;
}

const Inventory: React.FC<InventoryProps> = ({
  rawMaterials,
  setRawMaterials,
  packagingMaterials,
  setPackagingMaterials,
  wrappingMaterials,
  setWrappingMaterials,
  finishedProducts,
  setFinishedProducts,
}) => {
  const [activeWarehouse, setActiveWarehouse] = useState<Warehouse>(Warehouse.RAW_MATERIALS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);

  const toggleExpand = (productId: string) => {
    setExpandedProductId(prev => (prev === productId ? null : productId));
  };
  
  const allMaterialsByType = useMemo(() => ({
    [Warehouse.RAW_MATERIALS]: rawMaterials,
    [Warehouse.PACKAGING]: packagingMaterials,
    [Warehouse.WRAPPING]: wrappingMaterials,
  }), [rawMaterials, packagingMaterials, wrappingMaterials]);

  const allMaterialsMap = useMemo(() => {
    const map = new Map<string, { name: string, type: Warehouse }>();
    rawMaterials.forEach(m => map.set(m.sku, { name: m.name, type: Warehouse.RAW_MATERIALS }));
    packagingMaterials.forEach(m => map.set(m.sku, { name: m.name, type: Warehouse.PACKAGING }));
    wrappingMaterials.forEach(m => map.set(m.sku, { name: m.name, type: Warehouse.WRAPPING }));
    return map;
  }, [rawMaterials, packagingMaterials, wrappingMaterials]);

  const allMaterialsCostMap = useMemo(() => {
    const map = new Map<string, number>();
    rawMaterials.forEach(m => map.set(m.sku, m.cost));
    packagingMaterials.forEach(m => map.set(m.sku, m.cost));
    wrappingMaterials.forEach(m => map.set(m.sku, m.cost));
    return map;
  }, [rawMaterials, packagingMaterials, wrappingMaterials]);
  
  const handleBomUpdate = (productId: string, newBom: BillOfMaterialItem[]) => {
    setFinishedProducts(prevProducts =>
      prevProducts.map(p =>
        p.id === productId ? { ...p, billOfMaterials: newBom.length > 0 ? newBom : undefined } : p
      )
    );
  };

  const renderRawMaterialsTable = () => (
    <table className="w-full text-sm text-right text-slate-500">
      <thead className="text-xs text-slate-700 uppercase bg-slate-50">
        <tr>
          <th scope="col" className="px-6 py-3">SKU</th>
          <th scope="col" className="px-6 py-3">اسم الصنف</th>
          <th scope="col" className="px-6 py-3">الكمية</th>
          <th scope="col" className="px-6 py-3">الوحدة</th>
          <th scope="col" className="px-6 py-3">نقطة إعادة الطلب</th>
          <th scope="col" className="px-6 py-3">التكلفة (ج.م)</th>
          <th scope="col" className="px-6 py-3">المورد</th>
          <th scope="col" className="px-6 py-3">آخر تحديث</th>
        </tr>
      </thead>
      <tbody>
        {rawMaterials.map((item) => (
          <tr key={item.id} className="bg-white border-b hover:bg-slate-50">
            <td className="px-6 py-4 font-mono">{item.sku}</td>
            <td className="px-6 py-4 font-medium text-slate-900">{item.name}</td>
            <td className="px-6 py-4">{item.quantity}</td>
            <td className="px-6 py-4">{item.unit}</td>
            <td className="px-6 py-4">{item.reorderLevel}</td>
            <td className="px-6 py-4">{item.cost.toLocaleString()}</td>
            <td className="px-6 py-4">{item.supplier}</td>
            <td className="px-6 py-4">{item.lastUpdated}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderPackagingMaterialsTable = () => (
    <table className="w-full text-sm text-right text-slate-500">
      <thead className="text-xs text-slate-700 uppercase bg-slate-50">
        <tr>
          <th scope="col" className="px-6 py-3">SKU</th>
          <th scope="col" className="px-6 py-3">اسم الصنف</th>
          <th scope="col" className="px-6 py-3">الكمية (وحدة)</th>
          <th scope="col" className="px-6 py-3">نقطة إعادة الطلب</th>
          <th scope="col" className="px-6 py-3">التكلفة (ج.م)</th>
          <th scope="col" className="px-6 py-3">المورد</th>
          <th scope="col" className="px-6 py-3">آخر تحديث</th>
        </tr>
      </thead>
      <tbody>
        {packagingMaterials.map((item) => (
           <tr key={item.id} className="bg-white border-b hover:bg-slate-50">
            <td className="px-6 py-4 font-mono">{item.sku}</td>
            <td className="px-6 py-4 font-medium text-slate-900">{item.name}</td>
            <td className="px-6 py-4">{item.quantity}</td>
            <td className="px-6 py-4">{item.reorderLevel}</td>
            <td className="px-6 py-4">{item.cost.toLocaleString()}</td>
            <td className="px-6 py-4">{item.supplier}</td>
            <td className="px-6 py-4">{item.lastUpdated}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

    const renderWrappingMaterialsTable = () => (
    <table className="w-full text-sm text-right text-slate-500">
      <thead className="text-xs text-slate-700 uppercase bg-slate-50">
        <tr>
          <th scope="col" className="px-6 py-3">SKU</th>
          <th scope="col" className="px-6 py-3">اسم الصنف</th>
          <th scope="col" className="px-6 py-3">الكمية (وحدة)</th>
          <th scope="col" className="px-6 py-3">نقطة إعادة الطلب</th>
          <th scope="col" className="px-6 py-3">التكلفة (ج.م)</th>
          <th scope="col" className="px-6 py-3">المورد</th>
          <th scope="col" className="px-6 py-3">آخر تحديث</th>
        </tr>
      </thead>
      <tbody>
        {wrappingMaterials.map((item) => (
           <tr key={item.id} className="bg-white border-b hover:bg-slate-50">
            <td className="px-6 py-4 font-mono">{item.sku}</td>
            <td className="px-6 py-4 font-medium text-slate-900">{item.name}</td>
            <td className="px-6 py-4">{item.quantity}</td>
            <td className="px-6 py-4">{item.reorderLevel}</td>
            <td className="px-6 py-4">{item.cost.toLocaleString()}</td>
            <td className="px-6 py-4">{item.supplier}</td>
            <td className="px-6 py-4">{item.lastUpdated}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const BomEditor = ({ product }: { product: FinishedProductItem }) => {
    const bom = product.billOfMaterials || [];
    
    const [newComponentType, setNewComponentType] = useState<Warehouse>(Warehouse.RAW_MATERIALS);
    const [newComponentSku, setNewComponentSku] = useState<string>('');
    const [newComponentQuantity, setNewComponentQuantity] = useState<number>(1);
  
    useEffect(() => {
        setNewComponentSku(allMaterialsByType[newComponentType][0]?.sku || '');
    }, [newComponentType]);


    const handleQuantityChange = (index: number, quantity: number) => {
      const newBom = [...bom];
      newBom[index] = { ...newBom[index], quantityPerUnit: quantity >= 0 ? quantity : 0 };
      handleBomUpdate(product.id, newBom);
    };
  
    const handleRemove = (index: number) => {
      const newBom = bom.filter((_, i) => i !== index);
      handleBomUpdate(product.id, newBom);
    };
  
    const handleAdd = () => {
      if (!newComponentSku || newComponentQuantity <= 0) {
        alert("يرجى اختيار مكون وإدخال كمية صحيحة.");
        return;
      }
      if (bom.some(item => item.componentSku === newComponentSku)) {
          alert("هذا المكون موجود بالفعل في القائمة.");
          return;
      }
      const newBomItem: BillOfMaterialItem = {
        componentType: newComponentType,
        componentSku: newComponentSku,
        quantityPerUnit: newComponentQuantity,
      };
      handleBomUpdate(product.id, [...bom, newBomItem]);
      setNewComponentQuantity(1);
    };

    return (
        <div className="p-4 bg-white rounded-md border animate-fade-in">
          <h4 className="font-bold mb-3 text-slate-800">مكونات المنتج (لوحدة واحدة)</h4>
          <div className="space-y-2 mb-4">
            {bom.length > 0 ? bom.map((bomItem, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-slate-100 rounded">
                <div className="flex-1 font-medium text-slate-700">{allMaterialsMap.get(bomItem.componentSku)?.name || 'غير معروف'}</div>
                <div className="text-xs text-slate-500 bg-white px-2 py-1 rounded-full">{bomItem.componentType}</div>
                <div className="print:hidden">
                    <input
                      type="number"
                      step="0.01"
                      value={bomItem.quantityPerUnit}
                      onChange={(e) => handleQuantityChange(index, Number(e.target.value))}
                      className="w-24 p-1 border rounded text-sm"
                    />
                </div>
                <p className="hidden print:block w-24 p-1 text-sm">{bomItem.quantityPerUnit}</p>
                <button onClick={() => handleRemove(index)} className="p-1 hover:bg-red-100 rounded-full print:hidden">
                  <CloseIcon className="w-4 h-4 text-red-600" />
                </button>
              </div>
            )) : <p className="text-sm text-slate-500">لم يتم تحديد مكونات لهذا المنتج بعد.</p>}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-200 print:hidden">
            <h5 className="font-semibold text-slate-700 mb-2">إضافة مكون جديد</h5>
            <div className="flex flex-wrap items-center gap-2">
              <select value={newComponentType} onChange={(e) => setNewComponentType(e.target.value as Warehouse)} className="p-2 border rounded-md text-sm">
                <option value={Warehouse.RAW_MATERIALS}>مواد خام</option>
                <option value={Warehouse.PACKAGING}>مواد تعبئة</option>
                <option value={Warehouse.WRAPPING}>مواد تغليف</option>
              </select>
              <select value={newComponentSku} onChange={(e) => setNewComponentSku(e.target.value)} className="flex-grow p-2 border rounded-md text-sm">
                  {allMaterialsByType[newComponentType]?.length > 0 ? (
                    allMaterialsByType[newComponentType].map(mat => (
                      <option key={mat.id} value={mat.sku}>{mat.name}</option>
                    ))
                  ) : <option disabled>لا توجد أصناف</option>}
              </select>
              <input type="number" step="0.01" placeholder="الكمية" value={newComponentQuantity} onChange={(e) => setNewComponentQuantity(Number(e.target.value))} className="w-24 p-2 border rounded-md text-sm" />
              <button onClick={handleAdd} className="flex items-center justify-center p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                <PlusIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      );
  };

  const ProductionHistoryViewer = ({ product }: { product: FinishedProductItem }) => {
    const history = product.productionHistory || [];
    return (
        <div className="p-4 bg-white rounded-md border mt-4 animate-fade-in">
            <h4 className="font-bold mb-3 text-slate-800">سجل الإنتاج</h4>
            {history.length > 0 ? (
                <ul className="space-y-2">
                    {history.map((entry, index) => (
                        <li key={index} className="flex justify-between items-center p-2 bg-slate-100 rounded text-sm">
                            <span>تمت إضافة <span className="font-bold">{entry.quantityAdded}</span> وحدة من أمر الإنتاج <span className="font-mono">{entry.orderId}</span></span>
                            <span className="text-slate-500">{entry.date}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-slate-500">لا يوجد سجل إنتاج لهذا المنتج.</p>
            )}
        </div>
    );
  };

  const renderFinishedProductsTable = () => (
    <table className="w-full text-sm text-right text-slate-500">
      <thead className="text-xs text-slate-700 uppercase bg-slate-50">
        <tr>
          <th scope="col" className="px-2 py-3 w-12 print:hidden"></th>
          <th scope="col" className="px-6 py-3">SKU</th>
          <th scope="col" className="px-6 py-3">اسم المنتج</th>
          <th scope="col" className="px-6 py-3">الكمية (وحدة)</th>
          <th scope="col" className="px-6 py-3">تكلفة الوحدة (ج.م)</th>
          <th scope="col" className="px-6 py-3">إجمالي التكلفة (ج.م)</th>
          <th scope="col" className="px-6 py-3">نقطة إعادة الطلب</th>
          <th scope="col" className="px-6 py-3">سعر الجمهور</th>
          <th scope="col" className="px-6 py-3">سعر الجملة</th>
          <th scope="col" className="px-6 py-3">آخر تحديث</th>
        </tr>
      </thead>
      <tbody>
        {finishedProducts.map((item) => {
          const costPerUnit = item.billOfMaterials?.reduce((sum, bomItem) => {
            const componentCost = allMaterialsCostMap.get(bomItem.componentSku) || 0;
            return sum + componentCost * bomItem.quantityPerUnit;
          }, 0) || 0;
          
          const totalStockCost = costPerUnit * item.quantity;

          return (
           <React.Fragment key={item.id}>
             <tr className="bg-white border-b hover:bg-slate-50">
               <td className="px-2 py-4 print:hidden">
                 <button onClick={() => toggleExpand(item.id)} className="p-1 rounded-full hover:bg-slate-100">
                   <ChevronDownIcon className={`w-5 h-5 text-slate-500 transition-transform ${expandedProductId === item.id ? 'rotate-180' : ''}`} />
                 </button>
               </td>
              <td className="px-6 py-4 font-mono">{item.sku}</td>
              <td className="px-6 py-4 font-medium text-slate-900">{item.name}</td>
              <td className="px-6 py-4">{item.quantity}</td>
              <td className="px-6 py-4 font-mono font-semibold text-slate-700">{costPerUnit.toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              <td className="px-6 py-4 font-mono font-bold text-indigo-700">{totalStockCost.toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              <td className="px-6 py-4">{item.reorderLevel}</td>
              <td className="px-6 py-4">{item.publicPrice.toLocaleString()}</td>
              <td className="px-6 py-4">{item.wholesalePrice.toLocaleString()}</td>
              <td className="px-6 py-4">{item.lastUpdated}</td>
            </tr>
            {expandedProductId === item.id && (
                <tr className="bg-slate-50 print:border-t-2 print:border-black">
                    <td colSpan={10} className="p-4">
                        <BomEditor product={item} />
                        <ProductionHistoryViewer product={item} />
                    </td>
                </tr>
            )}
           </React.Fragment>
        )})}
      </tbody>
    </table>
  );
  
  const renderActiveTable = () => {
      switch(activeWarehouse) {
          case Warehouse.RAW_MATERIALS: return renderRawMaterialsTable();
          case Warehouse.PACKAGING: return renderPackagingMaterialsTable();
          case Warehouse.WRAPPING: return renderWrappingMaterialsTable();
          case Warehouse.FINISHED_PRODUCTS: return renderFinishedProductsTable();
          default: return null;
      }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-900">إدارة المخزون</h2>
        <div className="flex items-center gap-2 print:hidden">
          <PrintButton />
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            إضافة صنف جديد
          </button>
        </div>
      </div>

      <div className="border-b border-slate-200 print:hidden">
        <nav className="-mb-px flex gap-6" aria-label="Tabs">
          {Object.values(Warehouse).map((warehouse) => (
            <button
              key={warehouse}
              onClick={() => setActiveWarehouse(warehouse)}
              className={`shrink-0 border-b-2 px-1 pb-4 text-sm font-medium ${
                activeWarehouse === warehouse
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
              }`}
            >
              {warehouse}
            </button>
          ))}
        </nav>
      </div>

      <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
        {renderActiveTable()}
      </div>

      {isModalOpen && (
        <AddItemModal
          onClose={() => setIsModalOpen(false)}
          setRawMaterials={setRawMaterials}
          setPackagingMaterials={setPackagingMaterials}
          setWrappingMaterials={setWrappingMaterials}
          setFinishedProducts={setFinishedProducts}
        />
      )}
    </div>
  );
};

export default Inventory;