import React from 'react';
import {
  RawMaterialItem, PackagingMaterialItem, WrappingMaterialItem, FinishedProductItem, ProductionOrder,
  QualityControlLog, Sale, Employee, AttendanceLog, PayrollRecord, ReturnRequest, Customer, Payment,
  Supplier, PurchaseOrder, SupplierPayment, MarketingCampaign, PlatformAnalysisData, ResearchAndDevelopmentData,
  ProductionStatus, QCStatus, SalesChannel, ReturnStatus, PaymentType, PurchaseStatus, CampaignStatus, CustomerStatus, Warehouse, QualityControlType
} from './types';
import * as icons from './components/icons';

export const initialRawMaterials: RawMaterialItem[] = [
  { id: 'RM-001', sku: 'LAV-OIL-1L', name: 'زيت اللافندر الخام', quantity: 150, unit: 'kg', reorderLevel: 50, cost: 850, supplier: 'مورد الزيوت الطبيعية', lastUpdated: '2024-07-20' },
  { id: 'RM-002', sku: 'BEES-WAX-5K', name: 'شمع العسل', quantity: 80, unit: 'kg', reorderLevel: 20, cost: 300, supplier: 'مورد منتجات النحل', lastUpdated: '2024-07-18' },
];

export const initialPackagingMaterials: PackagingMaterialItem[] = [
  { id: 'PM-001', sku: 'JAR-50ML', name: 'برطمان زجاجي 50 مل', quantity: 2500, reorderLevel: 500, cost: 5.5, supplier: 'مورد العبوات الزجاجية', lastUpdated: '2024-07-19' },
];

export const initialWrappingMaterials: WrappingMaterialItem[] = [
    { id: 'WM-001', sku: 'BOX-SML', name: 'علبة كرتون صغيرة', quantity: 1800, reorderLevel: 300, cost: 2, supplier: 'مورد مواد التغليف', lastUpdated: '2024-07-19' },
];

export const initialFinishedProducts: FinishedProductItem[] = [
  { 
    id: 'FP-001', 
    sku: 'LAV-CREAM-50', 
    name: 'كريم اللافندر 50 مل', 
    quantity: 750, 
    reorderLevel: 100, 
    publicPrice: 120, 
    wholesalePrice: 90, 
    distributorPrice: 80, 
    agentPrice: 75, 
    lastUpdated: '2024-07-21',
    billOfMaterials: [
      { componentSku: 'LAV-OIL-1L', componentType: Warehouse.RAW_MATERIALS, quantityPerUnit: 0.05 },
      { componentSku: 'BEES-WAX-5K', componentType: Warehouse.RAW_MATERIALS, quantityPerUnit: 0.01 },
      { componentSku: 'JAR-50ML', componentType: Warehouse.PACKAGING, quantityPerUnit: 1 },
      { componentSku: 'BOX-SML', componentType: Warehouse.WRAPPING, quantityPerUnit: 1 },
    ],
    productionHistory: [
        { orderId: 'PO-1024', quantityAdded: 1000, date: '2024-07-18' }
    ]
  },
];

export const initialProductionOrders: ProductionOrder[] = [
  { id: 'PO-1025', productName: 'كريم اللافندر 50 مل', productSku: 'LAV-CREAM-50', quantity: 500, startDate: '2024-07-22', endDate: '2024-07-24', status: ProductionStatus.IN_PROGRESS },
  { id: 'PO-1024', productName: 'كريم اللافندر 50 مل', productSku: 'LAV-CREAM-50', quantity: 1000, startDate: '2024-07-15', endDate: '2024-07-18', status: ProductionStatus.COMPLETED },
];

export const initialQualityLogs: QualityControlLog[] = [
  { id: 'QC-401', type: QualityControlType.PURCHASES, referenceId: 'P-ORD-101', productName: 'زيت اللافندر الخام', date: '2024-07-11', inspector: 'فاطمة محمود', status: QCStatus.PASS, notes: 'العينة مطابقة للمعايير' },
  { id: 'QC-301', type: QualityControlType.FINISHED_PRODUCTS, referenceId: 'PO-1025', productName: 'كريم اللافندر 50 مل', date: '2024-07-24', inspector: 'أحمد علي', status: QCStatus.PENDING },
  { id: 'QC-300', type: QualityControlType.FINISHED_PRODUCTS, referenceId: 'PO-1024', productName: 'كريم اللافندر 50 مل', date: '2024-07-18', inspector: 'أحمد علي', status: QCStatus.PASS, notes: 'مطابق للمواصفات' },
  { id: 'QC-501', type: QualityControlType.RETURNS, referenceId: 'RET-01', productName: 'كريم اللافندر 50 مل', date: '2024-07-20', inspector: 'فاطمة محمود', status: QCStatus.FAIL, notes: 'تلف واضح في العبوة الخارجية، المنتج سليم.' },
];

export const initialSales: Sale[] = [
  {
    id: 'S-201', orderId: 'ORD-5501', customerName: 'صيدليات العزبي', channel: SalesChannel.WHOLESALE, date: '2024-07-20',
    items: [{
        productSku: 'LAV-CREAM-50', productName: 'كريم اللافندر 50 مل', quantity: 100,
        publicPrice: 120, unitPrice: 90, discountPercentage: 25, lineTotal: 9000
    }],
    subtotal: 9000, additionalDiscount: 0, totalPrice: 9000, notes: 'الدفعة الأولى من الطلب الشهري.'
  },
  {
    id: 'S-202', orderId: 'ORD-5502', customerName: 'صيدليات العزبي', channel: SalesChannel.WHOLESALE, date: '2024-07-22',
    items: [{
        productSku: 'LAV-CREAM-50', productName: 'كريم اللافندر 50 مل', quantity: 150,
        publicPrice: 120, unitPrice: 90, discountPercentage: 25, lineTotal: 13500
    }],
    subtotal: 13500, additionalDiscount: 0, totalPrice: 13500
  },
];


export const initialEmployees: Employee[] = [
    { id: 'EMP-01', name: 'محمد حسن', position: 'مدير إنتاج', department: 'الإنتاج', hireDate: '2022-01-15', hourlyRate: 50 },
];

export const initialAttendance: AttendanceLog[] = [
    { id: 'ATT-101', employeeName: 'محمد حسن', date: '2024-07-21', checkIn: '08:55', checkOut: '17:05' },
];

export const initialPayroll: PayrollRecord[] = [
    { id: 'PAY-01', employeeName: 'محمد حسن', payPeriod: 'يوليو 2024', totalHours: 160, hourlyRate: 50, totalPay: 8000 },
];

export const initialReturnRequests: ReturnRequest[] = [
    { 
      id: 'RET-01', 
      returnRequestId: 'RTN-2024-01',
      salesInvoiceId: 'ORD-5501',
      customerName: 'صيدليات العزبي', 
      items: [{ productSku: 'LAV-CREAM-50', productName: 'كريم اللافندر 50 مل', quantity: 5 }],
      reason: 'تلف في العبوة الخارجية', 
      status: ReturnStatus.APPROVED,
      date: '2024-07-21',
    },
];

export const initialCustomers: Customer[] = [
    { id: 'CUST-01', name: 'صيدليات العزبي', paymentType: PaymentType.CREDIT, contactPerson: 'أ/ محمود', email: 'purchases@el-ezaby.com', phone: '01xxxxxxxxx', address: 'القاهرة', joinDate: '2023-05-10', status: CustomerStatus.ACTIVE, creditLimit: 20000 },
    { id: 'CUST-02', name: 'عميل جمهور', paymentType: PaymentType.CASH, contactPerson: 'لا يوجد', email: 'n/a', phone: 'n/a', address: 'n/a', joinDate: '2024-01-01', status: CustomerStatus.ACTIVE, creditLimit: 0 },
];

export const initialPayments: Payment[] = [
    { id: 'PAY-C-01', customerName: 'صيدليات العزبي', date: '2024-07-01', amount: 15000 },
];

export const initialSuppliers: Supplier[] = [
    { 
        id: 'SUP-01', 
        name: 'مورد الزيوت الطبيعية', 
        contactPerson: 'الحاج سعيد', 
        email: 'saeed.oils@email.com', 
        phone: '01xxxxxxxxx', 
        materialsSupplied: ['زيت اللافندر الخام'],
        paymentType: PaymentType.CASH,
        status: CustomerStatus.ACTIVE,
        creditLimit: 50000,
        joinDate: '2022-03-15',
        address: 'المنصورة، مصر'
    },
];

export const initialPurchaseOrders: PurchaseOrder[] = [
    { 
        id: 'P-ORD-101', 
        supplierName: 'مورد الزيوت الطبيعية', 
        date: '2024-07-10', 
        items: [
            { id: 'item-1', itemName: 'زيت اللافندر الخام', category: Warehouse.RAW_MATERIALS, quantity: 50, unit: 'kg', costPerUnit: 850 }
        ],
        totalAmount: 42500,
        paymentType: PaymentType.CASH, 
        status: PurchaseStatus.RECEIVED 
    },
    { 
        id: 'P-ORD-102', 
        supplierName: 'مورد الزيوت الطبيعية', 
        date: '2024-07-25', 
        items: [
            { id: 'item-2', itemName: 'زيت اللافندر الخام', category: Warehouse.RAW_MATERIALS, quantity: 50, unit: 'kg', costPerUnit: 900 },
            { id: 'item-3', itemName: 'شمع العسل', category: Warehouse.RAW_MATERIALS, quantity: 20, unit: 'kg', costPerUnit: 250 },
        ],
        totalAmount: 50000,
        paymentType: PaymentType.CREDIT, 
        status: PurchaseStatus.ORDERED 
    },
];

export const initialSupplierPayments: SupplierPayment[] = [
    { id: 'PAY-S-01', supplierName: 'مورد الزيوت الطبيعية', date: '2024-07-10', amount: 42500 },
];

export const initialCampaigns: MarketingCampaign[] = [
    { id: 'CAMP-01', name: 'حملة إطلاق الصيف', channel: 'Facebook', startDate: '2024-07-01', endDate: '2024-07-31', budget: 15000, status: CampaignStatus.ACTIVE },
];

export const initialPlatformAnalysisData: PlatformAnalysisData = {
    social: [
      { id: 'fb', name: 'Facebook', icon: React.createElement(icons.MegaphoneIcon), connected: true, kpis: [{title: 'متابعون', value: '10.5K', icon: React.createElement(icons.UsersIcon)}, {title: 'مبيعات', value: '5K ج.م', icon: React.createElement(icons.DollarIcon)}, {title: 'تفاعل', value: '2.1%', icon: React.createElement(icons.ChartBarIcon)}], growthData: [{month: 'May', value: 8}, {month: 'Jun', value: 9.2}, {month: 'Jul', value: 10.5}], topItems: [{id: '1', name: 'منشور إعلان الخصم', value: '500', metric: 'تفاعل'}],
        chatHistory: [
          { id: 'chat1', sender: 'ai', text: 'مرحباً! أنا نور، مساعدتك في عالم الجمال الطبيعي. كيف يمكنني مساعدتك اليوم؟' }
        ]
      },
      { id: 'ig', name: 'Instagram', icon: React.createElement(icons.MegaphoneIcon), connected: false, kpis: [], growthData: [], topItems: [] },
      { id: 'tiktok', name: 'TikTok', icon: React.createElement(icons.MegaphoneIcon), connected: false, kpis: [], growthData: [], topItems: [] },
      { id: 'youtube', name: 'YouTube', icon: React.createElement(icons.MegaphoneIcon), connected: false, kpis: [], growthData: [], topItems: [] },
      { id: 'x', name: 'X', icon: React.createElement(icons.MegaphoneIcon), connected: false, kpis: [], growthData: [], topItems: [] },
      { id: 'snapchat', name: 'Snapchat', icon: React.createElement(icons.MegaphoneIcon), connected: false, kpis: [], growthData: [], topItems: [] },
      { id: 'linkedin', name: 'LinkedIn', icon: React.createElement(icons.MegaphoneIcon), connected: false, kpis: [], growthData: [], topItems: [] },
      { id: 'pinterest', name: 'Pinterest', icon: React.createElement(icons.MegaphoneIcon), connected: false, kpis: [], growthData: [], topItems: [] },
    ],
    marketplaces: [
      { id: 'noon', name: 'Noon', icon: React.createElement(icons.MegaphoneIcon), connected: false, kpis: [], growthData: [], topItems: [] },
      { id: 'amazon', name: 'Amazon', icon: React.createElement(icons.MegaphoneIcon), connected: false, kpis: [], growthData: [], topItems: [] },
      { id: 'jumia', name: 'Jumia', icon: React.createElement(icons.MegaphoneIcon), connected: false, kpis: [], growthData: [], topItems: [] },
      { id: 'abqareno', name: 'عبقرينو', icon: React.createElement(icons.MegaphoneIcon), connected: false, kpis: [], growthData: [], topItems: [] },
    ]
};

export const initialRdData: ResearchAndDevelopmentData = {
  brainstorming: { strengths: '', weaknesses: '', newIdeas: '', improvements: '' },
  mindMap: { root: { text: '', children: [] } },
  scamper: { substitute: '', combine: '', adapt: '', modify: '', putToAnotherUse: '', eliminate: '', reverse: '' },
  userPersona: { name: 'سارة', demographics: '32 سنة، أم عاملة، تسكن في القاهرة', goals: 'العثور على منتجات طبيعية وآمنة للعناية بالبشرة.', challenges: 'ضيق الوقت، عدم الثقة في المنتجات الكيميائية.' },
  empathyMap: { says: '', thinks: '', feels: '', does: '' },
  competitorAnalysis: { competitors: [{ name: 'براند X', strengths: 'سعر منخفض', weaknesses: 'جودة أقل' }] },
  marketSegmentation: { demographic: '', geographic: '', psychographic: '', behavioral: '' },
  swot: { strengths: 'منتج طبيعي عالي الجودة', weaknesses: 'علامة تجارية غير معروفة', opportunities: 'زيادة الوعي بالمنتجات الطبيعية', threats: 'منافسة قوية من العلامات التجارية الكبرى' },
  pestel: { political: '', economic: '', social: '', technological: '', environmental: '', legal: '' },
  portersFiveForces: { newEntrants: '', buyers: '', substitutes: '', suppliers: '', rivalry: '' },
  businessModelCanvas: { keyPartners: '', keyActivities: '', valueProposition: '', customerRelationships: '', customerSegments: '', keyResources: '', channels: '', costStructure: '', revenueStreams: '' },
  leanCanvas: { problem: '', customerSegments: '', uniqueValueProposition: '', solution: '', channels: '', revenueStreams: '', costStructure: '', keyMetrics: '', unfairAdvantage: '' },
  valueProposition: { gains: '', pains: '', customerJobs: '', gainCreators: '', painRelievers: '', productsServices: '' },
  ansoffMatrix: { marketPenetration: '', productDevelopment: '', marketDevelopment: '', diversification: '' },
  bcgMatrix: { stars: '', questionMarks: '', cashCows: '', dogs: '' },
  ganttChart: { tasks: [] },
  okrKpi: { objective: '', keyResult1: '', keyResult2: '', keyResult3: '' },
  processMapping: { steps: [] },
  balancedScorecard: { financial: '', customer: '', internalProcess: '', learningGrowth: '' },
  raciMatrix: { tasks: [] },
  breakEven: { fixedCosts: 50000, variableCostPerUnit: 25, salePricePerUnit: 90 },
  unitEconomics: { ltv: 300, cac: 50 },
  roi: { investment: 15000, gain: 22000 },
  investorPitchDeck: { intro: '', problem: '', solution: '', marketSize: '', product: '', businessModel: '', team: '', competition: '', financials: '', ask: '' },
  designThinking: { empathize: '', define: '', ideate: '', prototype: '', test: '' },
  fishbone: { problem: '', machines: '', methods: '', materials: '', manpower: '', measurement: '', environment: '' },
  customerJourneyMap: { stages: [] },
  gapAnalysis: { currentState: '', futureState: '', gap: '', actions: '' },
};