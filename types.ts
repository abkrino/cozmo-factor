import React from 'react';

export enum View {
  DASHBOARD = 'لوحة التحكم',
  RD = 'البحث والتطوير',
  MARKETING = 'التسويق',
  CUSTOMERS = 'العملاء',
  SUPPLIERS = 'الموردون',
  PURCHASES = 'المشتريات',
  INVENTORY = 'المخزون',
  PRODUCTION = 'الإنتاج',
  QUALITY_CONTROL = 'مراقبة الجودة',
  SALES = 'المبيعات',
  RETURNS = 'المرتجعات',
  HR = 'الموارد البشرية',
}

export enum Warehouse {
  RAW_MATERIALS = 'مواد خام',
  PACKAGING = 'مواد تعبئة',
  WRAPPING = 'مواد تغليف',
  FINISHED_PRODUCTS = 'منتجات نهائية',
}

export interface BaseItem {
  id: string;
  sku: string;
  name: string;
  quantity: number;
  reorderLevel: number;
  lastUpdated: string;
}

export interface RawMaterialItem extends BaseItem {
  unit: 'kg' | 'count';
  cost: number;
  supplier: string;
}

export interface PackagingMaterialItem extends BaseItem {
  cost: number;
  supplier: string;
}

export interface WrappingMaterialItem extends BaseItem {
  cost: number;
  supplier: string;
}

export interface BillOfMaterialItem {
  componentSku: string;
  componentType: Warehouse;
  quantityPerUnit: number;
}

export interface ProductionHistoryEntry {
    orderId: string;
    quantityAdded: number;
    date: string;
}

export interface FinishedProductItem extends BaseItem {
  publicPrice: number;
  wholesalePrice: number;
  distributorPrice: number;
  agentPrice: number;
  billOfMaterials?: BillOfMaterialItem[];
  productionHistory?: ProductionHistoryEntry[];
}

export enum ProductionStatus {
  PENDING = 'قيد الانتظار',
  IN_PROGRESS = 'قيد التنفيذ',
  COMPLETED = 'مكتمل',
  DELAYED = 'متأخر',
}

export interface ProductionOrder {
  id: string;
  productName: string;
  productSku: string;
  quantity: number;
  startDate: string;
  endDate: string;
  status: ProductionStatus;
}

export enum QCStatus {
  PASS = 'ناجح',
  FAIL = 'فشل',
  PENDING = 'قيد الفحص',
}

export enum QualityControlType {
  PURCHASES = 'جودة المشتريات',
  FINISHED_PRODUCTS = 'جودة المنتجات النهائية',
  RETURNS = 'جودة المرتجعات',
}

export interface QualityControlLog {
  id: string;
  type: QualityControlType;
  referenceId: string; // Can be productionOrderId, purchaseOrderId, or returnRequestId
  productName: string;
  date: string;
  inspector: string;
  status: QCStatus;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

export enum SalesChannel {
  PUBLIC = 'جمهور',
  WHOLESALE = 'جملة',
  DISTRIBUTOR = 'موزع',
  AGENT = 'وكيل',
}

export interface SaleItem {
    productSku: string;
    productName: string;
    quantity: number;
    publicPrice: number;
    unitPrice: number; // Price based on channel before discount
    discountPercentage: number;
    lineTotal: number;
}

export interface Sale {
  id: string;
  orderId: string;
  customerName: string;
  items: SaleItem[];
  subtotal: number;
  additionalDiscount: number;
  totalPrice: number;
  channel: SalesChannel;
  source?: string;
  date: string;
  notes?: string;
}

export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  hireDate: string;
  hourlyRate: number;
}

export interface AttendanceLog {
  id: string;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut?: string;
}

export interface PayrollRecord {
  id: string;
  employeeName: string;
  payPeriod: string;
  totalHours: number;
  hourlyRate: number;
  totalPay: number;
}

export enum ReturnStatus {
  PENDING = 'قيد المراجعة',
  APPROVED = 'مقبول',
  REJECTED = 'مرفوض',
}

export interface ReturnItem {
  productSku: string;
  productName: string;
  quantity: number;
}

export interface ReturnRequest {
  id: string;
  returnRequestId: string;
  salesInvoiceId: string;
  customerName: string;
  items: ReturnItem[];
  reason: string;
  status: ReturnStatus;
  date: string;
}

export enum PaymentType {
  CASH = 'نقدي',
  CREDIT = 'آجل',
}

export enum CustomerStatus {
  ACTIVE = 'نشط',
  INACTIVE = 'غير نشط',
}

export interface Customer {
  id: string;
  name: string;
  paymentType: PaymentType;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
  status: CustomerStatus;
  creditLimit: number;
}

export interface Payment {
  id: string;
  customerName: string;
  date: string;
  amount: number;
}

export interface Supplier {
  id: string;
  name: string;
  paymentType: PaymentType;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
  status: CustomerStatus; // Reusing CustomerStatus for simplicity
  creditLimit: number;
  materialsSupplied: string[];
}

export enum PurchaseStatus {
  PENDING = 'قيد الانتظار',
  ORDERED = 'تم الطلب',
  RECEIVED = 'تم الاستلام',
  CANCELLED = 'ملغي',
}

export interface PurchaseOrderItem {
  id: string;
  itemName: string;
  category: Warehouse;
  quantity: number;
  unit: 'kg' | 'count';
  costPerUnit: number;
}

export interface PurchaseOrder {
  id: string;
  supplierName: string;
  date: string;
  items: PurchaseOrderItem[];
  totalAmount: number;
  paymentType: PaymentType;
  status: PurchaseStatus;
}

export interface SupplierPayment {
    id: string;
    supplierName: string;
    date: string;
    amount: number;
}

export enum CampaignStatus {
  PLANNING = 'تخطيط',
  ACTIVE = 'نشط',
  COMPLETED = 'مكتمل',
  CANCELLED = 'ملغي',
}

export interface MarketingCampaign {
  id: string;
  name: string;
  channel: string;
  startDate: string;
  endDate: string;
  budget: number;
  status: CampaignStatus;
}

export interface PlatformKPI {
  title: string;
  value: string;
  icon: React.ReactNode;
}

export interface PlatformGrowthData {
  month: string;
  value: number;
}

export interface PlatformTopItem {
  id: string;
  name: string;
  value: string;
  metric: string;
}

export interface Platform {
  id: string;
  name: string;
  icon: React.ReactNode;
  connected: boolean;
  kpis: PlatformKPI[];
  growthData: PlatformGrowthData[];
  topItems: PlatformTopItem[];
  chatHistory?: ChatMessage[];
}

export interface PlatformAnalysisData {
  social: Platform[];
  marketplaces: Platform[];
}

// R&D Tool Data Types
export interface BrainstormingData {
    strengths: string;
    weaknesses: string;
    newIdeas: string;
    improvements: string;
}
export interface MindMapData {
    root: { text: string; children: any[] };
}
export interface ScamperData {
    substitute: string;
    combine: string;
    adapt: string;
    modify: string;
    putToAnotherUse: string;
    eliminate: string;
    reverse: string;
}
export interface UserPersonaData {
    name: string;
    demographics: string;
    goals: string;
    challenges: string;
}
export interface EmpathyMapData {
    says: string;
    thinks: string;
    feels: string;
    does: string;
}
export interface CompetitorAnalysisData {
    competitors: { name: string; strengths: string; weaknesses: string }[];
}
export interface MarketSegmentationData {
    demographic: string;
    geographic: string;
    psychographic: string;
    behavioral: string;
}
export interface SwotData {
    strengths: string;
    weaknesses: string;
    opportunities: string;
    threats: string;
}
export interface PestelData {
    political: string;
    economic: string;
    social: string;
    technological: string;
    environmental: string;
    legal: string;
}
export interface PortersFiveForcesData {
    newEntrants: string;
    buyers: string;
    substitutes: string;
    suppliers: string;
    rivalry: string;
}
export interface BusinessModelCanvasData {
    keyPartners: string;
    keyActivities: string;
    valueProposition: string;
    customerRelationships: string;
    customerSegments: string;
    keyResources: string;
    channels: string;
    costStructure: string;
    revenueStreams: string;
}
export interface LeanCanvasData {
    problem: string;
    customerSegments: string;
    uniqueValueProposition: string;
    solution: string;
    channels: string;
    revenueStreams: string;
    costStructure: string;
    keyMetrics: string;
    unfairAdvantage: string;
}
export interface ValuePropositionCanvasData {
    gains: string;
    pains: string;
    customerJobs: string;
    gainCreators: string;
    painRelievers: string;
    productsServices: string;
}
export interface AnsoffMatrixData {
    marketPenetration: string;
    productDevelopment: string;
    marketDevelopment: string;
    diversification: string;
}
export interface BcgMatrixData {
    stars: string;
    questionMarks: string;
    cashCows: string;
    dogs: string;
}
export interface GanttTask {
    id: number;
    name: string;
    start: string;
    end: string;
}
export interface GanttChartData {
    tasks: GanttTask[];
}
export interface OkrKpiData {
    objective: string;
    keyResult1: string;
    keyResult2: string;
    keyResult3: string;
}
export interface ProcessMappingStep {
    name: string;
    description: string;
}
export interface ProcessMappingData {
    steps: ProcessMappingStep[];
}
export interface BalancedScorecardData {
    financial: string;
    customer: string;
    internalProcess: string;
    learningGrowth: string;
}
export interface RaciTask {
    name: string;
    responsible: string;
    accountable: string;
    consulted: string;
    informed: string;
}
export interface RaciMatrixData {
    tasks: RaciTask[];
}
export interface BreakEvenData {
    fixedCosts: number;
    variableCostPerUnit: number;
    salePricePerUnit: number;
}
export interface UnitEconomicsData {
    ltv: number;
    cac: number;
}
export interface RoiData {
    investment: number;
    gain: number;
}
export interface InvestorPitchDeckData {
    intro: string;
    problem: string;
    solution: string;
    marketSize: string;
    product: string;
    businessModel: string;
    team: string;
    competition: string;
    financials: string;
    ask: string;
}
export interface DesignThinkingData {
  empathize: string;
  define: string;
  ideate: string;
  prototype: string;
  test: string;
}
export interface FishboneDiagramData {
  problem: string;
  machines: string;
  methods: string;
  materials: string;
  manpower: string;
  measurement: string;
  environment: string;
}
export interface CustomerJourneyStage {
    name: string;
    actions: string;
    touchpoints: string;
    emotions: string;
    painPoints: string;
    opportunities: string;
}
export interface CustomerJourneyMapData {
    stages: CustomerJourneyStage[];
}
export interface GapAnalysisData {
    currentState: string;
    futureState: string;
    gap: string;
    actions: string;
}

export interface ResearchAndDevelopmentData {
  brainstorming: BrainstormingData;
  mindMap: MindMapData;
  scamper: ScamperData;
  userPersona: UserPersonaData;
  empathyMap: EmpathyMapData;
  competitorAnalysis: CompetitorAnalysisData;
  marketSegmentation: MarketSegmentationData;
  swot: SwotData;
  pestel: PestelData;
  portersFiveForces: PortersFiveForcesData;
  businessModelCanvas: BusinessModelCanvasData;
  leanCanvas: LeanCanvasData;
  valueProposition: ValuePropositionCanvasData;
  ansoffMatrix: AnsoffMatrixData;
  bcgMatrix: BcgMatrixData;
  ganttChart: GanttChartData;
  okrKpi: OkrKpiData;
  processMapping: ProcessMappingData;
  balancedScorecard: BalancedScorecardData;
  raciMatrix: RaciMatrixData;
  breakEven: BreakEvenData;
  unitEconomics: UnitEconomicsData;
  roi: RoiData;
  investorPitchDeck: InvestorPitchDeckData;
  designThinking: DesignThinkingData;
  fishbone: FishboneDiagramData;
  customerJourneyMap: CustomerJourneyMapData;
  gapAnalysis: GapAnalysisData;
}