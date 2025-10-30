import React, { useState, useEffect } from 'react';
import { View, ChatMessage, ResearchAndDevelopmentData, RawMaterialItem, PackagingMaterialItem, WrappingMaterialItem, FinishedProductItem, ProductionOrder, QualityControlLog, Sale, Employee, AttendanceLog, PayrollRecord, ReturnRequest, Customer, Payment, Supplier, PurchaseOrder, SupplierPayment, MarketingCampaign, PlatformAnalysisData, ProductionStatus, QCStatus, ReturnStatus } from './types';
import {
  initialRawMaterials, initialPackagingMaterials, initialWrappingMaterials, initialFinishedProducts,
  initialProductionOrders, initialQualityLogs, initialSales, initialEmployees, initialAttendance, initialPayroll,
  initialReturnRequests, initialCustomers, initialPayments, initialSuppliers, initialPurchaseOrders, initialSupplierPayments,
  initialCampaigns, initialPlatformAnalysisData, initialRdData
} from './data';

// Component Imports
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Production from './components/Production';
import QualityControl from './components/QualityControl';
import Sales from './components/Sales';
import HumanResources from './components/HumanResources';
import Returns from './components/Returns';
import Customers from './components/Customers';
import Suppliers from './components/Suppliers';
import Purchases from './components/Purchases';
import Marketing from './components/Marketing';
import ResearchAndDevelopment from './components/ResearchAndDevelopment';
import AiAssistant from './components/AiAssistant';

const App: React.FC = () => {
  // --- STATE MANAGEMENT ---
  // Core state
  const [activeView, setActiveView] = useState<View>(View.DASHBOARD);
  const [activeRdTool, setActiveRdTool] = useState<keyof ResearchAndDevelopmentData | null>(null);
  
  // Data states
  const [rawMaterials, setRawMaterials] = useState<RawMaterialItem[]>(initialRawMaterials);
  const [packagingMaterials, setPackagingMaterials] = useState<PackagingMaterialItem[]>(initialPackagingMaterials);
  const [wrappingMaterials, setWrappingMaterials] = useState<WrappingMaterialItem[]>(initialWrappingMaterials);
  const [finishedProducts, setFinishedProducts] = useState<FinishedProductItem[]>(initialFinishedProducts);
  const [productionOrders, setProductionOrders] = useState<ProductionOrder[]>(initialProductionOrders);
  const [qualityLogs, setQualityLogs] = useState<QualityControlLog[]>(initialQualityLogs);
  const [sales, setSales] = useState<Sale[]>(initialSales);
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [attendance, setAttendance] = useState<AttendanceLog[]>(initialAttendance);
  const [payroll, setPayroll] = useState<PayrollRecord[]>(initialPayroll);
  const [returnRequests, setReturnRequests] = useState<ReturnRequest[]>(initialReturnRequests);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(initialPurchaseOrders);
  const [supplierPayments, setSupplierPayments] = useState<SupplierPayment[]>(initialSupplierPayments);
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>(initialCampaigns);
  const [platformAnalysisData, setPlatformAnalysisData] = useState<PlatformAnalysisData>(initialPlatformAnalysisData);
  const [rdData, setRdData] = useState<ResearchAndDevelopmentData>(initialRdData);

  // AI Assistant state
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState<ChatMessage[]>([
    { id: 'initial', sender: 'ai', text: 'مرحباً! أنا مساعد المصنع الذكي. كيف يمكنني مساعدتك اليوم؟' }
  ]);
  
  // When switching to R&D view, reset the active tool
  useEffect(() => {
    if (activeView !== View.RD) {
      setActiveRdTool(null);
    }
  }, [activeView]);
  
  const handleSetActiveTool = (tool: keyof ResearchAndDevelopmentData | null) => {
    setActiveRdTool(tool);
    // Open AI assistant when a tool is opened
    if (tool) {
        setIsAiAssistantOpen(true);
    }
  };

  const handleProductionOrderStatusChange = (orderId: string, newStatus: ProductionStatus) => {
    const orderToUpdate = productionOrders.find(o => o.id === orderId);

    // If order exists and status is changing to COMPLETED for the first time
    if (orderToUpdate && orderToUpdate.status !== ProductionStatus.COMPLETED && newStatus === ProductionStatus.COMPLETED) {
      setFinishedProducts(prevProducts => {
        const productExists = prevProducts.some(p => p.sku === orderToUpdate.productSku);
        const currentDate = new Date().toISOString().split('T')[0];
        const newHistoryEntry = {
            orderId: orderToUpdate.id,
            quantityAdded: orderToUpdate.quantity,
            date: currentDate,
        };

        if (productExists) {
          // Product exists, update it
          return prevProducts.map(p => {
            if (p.sku === orderToUpdate.productSku) {
              return {
                ...p,
                quantity: p.quantity + orderToUpdate.quantity,
                lastUpdated: currentDate,
                productionHistory: [...(p.productionHistory || []), newHistoryEntry],
              };
            }
            return p;
          });
        } else {
          // Product does not exist, create it
          const newFinishedProduct: FinishedProductItem = {
            id: `FP-${orderToUpdate.productSku}`,
            sku: orderToUpdate.productSku,
            name: orderToUpdate.productName,
            quantity: orderToUpdate.quantity,
            reorderLevel: 0, // Default value
            publicPrice: 0, // Default value
            wholesalePrice: 0, // Default value
            distributorPrice: 0, // Default value
            agentPrice: 0, // Default value
            lastUpdated: currentDate,
            productionHistory: [newHistoryEntry],
            billOfMaterials: [], // Default to empty
          };
          return [...prevProducts, newFinishedProduct];
        }
      });
    }

    // Update production orders status regardless
    setProductionOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const handleQualityLogStatusChange = (logId: string, newStatus: QCStatus) => {
    setQualityLogs(prevLogs =>
      prevLogs.map(log =>
        log.id === logId ? { ...log, status: newStatus } : log
      )
    );
  };
  
  const handleAddSale = (newSale: Sale) => {
    // 1. Add the new sale
    setSales(prev => [newSale, ...prev]);

    // 2. Update inventory
    setFinishedProducts(prevProducts => {
      const updatedProducts = [...prevProducts];
      newSale.items.forEach(item => {
        const productIndex = updatedProducts.findIndex(p => p.sku === item.productSku);
        if (productIndex !== -1) {
          updatedProducts[productIndex].quantity -= item.quantity;
          updatedProducts[productIndex].lastUpdated = new Date().toISOString().split('T')[0];
        }
      });
      return updatedProducts;
    });
  };

  const handleReturnRequestStatusChange = (requestId: string, newStatus: ReturnStatus) => {
    setReturnRequests(prevRequests =>
      prevRequests.map(req =>
        req.id === requestId ? { ...req, status: newStatus } : req
      )
    );
  };

  const handleAddReturnRequest = (newRequest: ReturnRequest) => {
    setReturnRequests(prev => [newRequest, ...prev]);
  };

  const handleAddEmployee = (newEmployee: Employee) => {
    setEmployees(prev => [newEmployee, ...prev]);
  };

  const handleAddAttendance = (newLog: AttendanceLog) => {
    setAttendance(prev => [newLog, ...prev]);
  };

  const handleAddPayroll = (newRecord: PayrollRecord) => {
    setPayroll(prev => [newRecord, ...prev]);
  };

  // --- AI CONTEXT ---
  const aiContext = {
    activeView,
    inventory: { rawMaterials, packagingMaterials, wrappingMaterials, finishedProducts },
    production: { productionOrders },
    qualityControl: { qualityLogs },
    sales: { sales, returns: returnRequests },
    hr: { employees, attendance, payroll },
    customers: { customers, payments },
    suppliers: { suppliers, purchaseOrders, supplierPayments },
    marketing: { campaigns, platformAnalysisData },
    researchAndDevelopment: rdData,
    currentFocus: activeView === View.RD && activeRdTool ? {
        tool: activeRdTool,
        toolData: rdData[activeRdTool]
    } : null,
  };

  // --- RENDER LOGIC ---
  const renderActiveView = () => {
    switch (activeView) {
      case View.DASHBOARD:
        return <Dashboard sales={sales} productionOrders={productionOrders} finishedProducts={finishedProducts} />;
      case View.INVENTORY:
        return <Inventory 
          rawMaterials={rawMaterials} setRawMaterials={setRawMaterials}
          packagingMaterials={packagingMaterials} setPackagingMaterials={setPackagingMaterials}
          wrappingMaterials={wrappingMaterials} setWrappingMaterials={setWrappingMaterials}
          finishedProducts={finishedProducts} setFinishedProducts={setFinishedProducts}
        />;
      case View.PRODUCTION:
        return <Production 
          productionOrders={productionOrders}
          setProductionOrders={setProductionOrders}
          finishedProducts={finishedProducts}
          onStatusChange={handleProductionOrderStatusChange} 
        />;
      case View.QUALITY_CONTROL:
        return <QualityControl 
                    qualityLogs={qualityLogs} 
                    setQualityLogs={setQualityLogs} 
                    productionOrders={productionOrders}
                    purchaseOrders={purchaseOrders}
                    returnRequests={returnRequests}
                    onStatusChange={handleQualityLogStatusChange}
                />;
      case View.SALES:
        return <Sales 
          sales={sales} 
          onAddSale={handleAddSale} 
          customers={customers}
          finishedProducts={finishedProducts}
        />;
      case View.RETURNS:
          return <Returns 
            returnRequests={returnRequests} 
            sales={sales}
            onStatusChange={handleReturnRequestStatusChange}
            onAddReturnRequest={handleAddReturnRequest}
            />;
      case View.HR:
          return <HumanResources 
                    employees={employees} 
                    attendance={attendance} 
                    payroll={payroll}
                    onAddEmployee={handleAddEmployee}
                    onAddAttendance={handleAddAttendance}
                    onAddPayroll={handleAddPayroll}
                 />;
      case View.CUSTOMERS:
          return <Customers customers={customers} setCustomers={setCustomers} payments={payments} setPayments={setPayments} sales={sales} />;
      case View.SUPPLIERS:
          return <Suppliers suppliers={suppliers} setSuppliers={setSuppliers} payments={supplierPayments} setPayments={setSupplierPayments} purchaseOrders={purchaseOrders} />;
      case View.PURCHASES:
          return <Purchases purchaseOrders={purchaseOrders} setPurchaseOrders={setPurchaseOrders} supplierPayments={supplierPayments} suppliers={suppliers} />;
      case View.MARKETING:
          return <Marketing 
                    campaigns={campaigns} 
                    setCampaigns={setCampaigns} 
                    platformAnalysisData={platformAnalysisData} 
                    setPlatformAnalysisData={setPlatformAnalysisData} 
                    rdData={rdData} 
                    activeView={activeView} 
                    finishedProducts={finishedProducts}
                  />;
      case View.RD:
          return <ResearchAndDevelopment rdData={rdData} setRdData={setRdData} activeTool={activeRdTool} setActiveTool={handleSetActiveTool} />;
      default:
        return <Dashboard sales={sales} productionOrders={productionOrders} finishedProducts={finishedProducts} />;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800" dir="rtl">
      <Header activeView={activeView} setActiveView={setActiveView} />
      <main className="container mx-auto p-4 md:p-8">
        {renderActiveView()}
      </main>
      <AiAssistant 
        context={aiContext}
        isOpen={isAiAssistantOpen}
        setIsOpen={setIsAiAssistantOpen}
        messages={aiMessages}
        setMessages={setAiMessages}
      />
    </div>
  );
};

export default App;