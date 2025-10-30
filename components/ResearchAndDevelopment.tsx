import React, { useState } from 'react';
import { ResearchAndDevelopmentData } from '../types';
import * as icons from './icons';
import PrintButton from './PrintButton';

// Import all tool components
import BrainstormingMatrix from './rd-tools/BrainstormingMatrix';
import MindMap from './rd-tools/MindMap';
import ScamperMethod from './rd-tools/ScamperMethod';
import UserPersona from './rd-tools/UserPersona';
import EmpathyMap from './rd-tools/EmpathyMap';
import CompetitorAnalysis from './rd-tools/CompetitorAnalysis';
import MarketSegmentation from './rd-tools/MarketSegmentation';
import PestelAnalysis from './rd-tools/PestelAnalysis';
import PortersFiveForces from './rd-tools/PortersFiveForces';
import BusinessModelCanvas from './rd-tools/BusinessModelCanvas';
import GanttChart from './rd-tools/GanttChart';
import OkrKpi from './rd-tools/OkrKpi';
import SwotAnalysis from './rd-tools/SwotAnalysis';
import LeanCanvas from './rd-tools/LeanCanvas';
import ValuePropositionCanvas from './rd-tools/ValuePropositionCanvas';
import AnsoffMatrix from './rd-tools/AnsoffMatrix';
import BcgMatrix from './rd-tools/BcgMatrix';
import ProcessMapping from './rd-tools/ProcessMapping';
import BalancedScorecard from './rd-tools/BalancedScorecard';
import RaciMatrix from './rd-tools/RaciMatrix';
import BreakEvenAnalysis from './rd-tools/BreakEvenAnalysis';
import UnitEconomics from './rd-tools/UnitEconomics';
import RoiCalculator from './rd-tools/RoiCalculator';
import InvestorPitchDeck from './rd-tools/InvestorPitchDeck';
import DesignThinking from './rd-tools/DesignThinking';
import FishboneDiagram from './rd-tools/FishboneDiagram';
import CustomerJourneyMap from './rd-tools/CustomerJourneyMap';
import GapAnalysis from './rd-tools/GapAnalysis';


interface ResearchAndDevelopmentProps {
  rdData: ResearchAndDevelopmentData;
  setRdData: React.Dispatch<React.SetStateAction<ResearchAndDevelopmentData>>;
  activeTool: keyof ResearchAndDevelopmentData | null;
  setActiveTool: (tool: keyof ResearchAndDevelopmentData | null) => void;
}

const ResearchAndDevelopment: React.FC<ResearchAndDevelopmentProps> = ({ rdData, setRdData, activeTool, setActiveTool }) => {
    const [expandedCategory, setExpandedCategory] = useState<string | null>('توليد الأفكار والإبداع');

    const toolCategories = [
        {
            name: 'توليد الأفكار والإبداع',
            description: 'أدوات لمساعدتك في توليد أفكار جديدة للمنتجات والخدمات واستكشافها من زوايا مختلفة.',
            icon: <icons.LightbulbIcon />,
            tools: [
                { key: 'brainstorming', name: 'العصف الذهني', icon: <icons.BrainstormingIcon />, component: BrainstormingMatrix },
                { key: 'mindMap', name: 'الخريطة الذهنية', icon: <icons.MindMapIcon />, component: MindMap },
                { key: 'scamper', name: 'SCAMPER', icon: <icons.ScamperIcon />, component: ScamperMethod },
                { key: 'designThinking', name: 'التفكير التصميمي', icon: <icons.DesignThinkingIcon />, component: DesignThinking },
                { key: 'fishbone', name: 'مخطط عظمة السمكة', icon: <icons.FishboneIcon />, component: FishboneDiagram },
            ]
        },
        {
            name: 'فهم السوق والعملاء',
            description: 'أدوات لجمع وتحليل المعلومات عن السوق المستهدف، المنافسين، والعملاء لفهم احتياجاتهم وسلوكياتهم.',
            icon: <icons.UsersIcon />,
            tools: [
                { key: 'userPersona', name: 'شخصية المستخدم', icon: <icons.UsersIcon />, component: UserPersona },
                { key: 'empathyMap', name: 'خريطة التعاطف', icon: <icons.EmpathyMapIcon />, component: EmpathyMap },
                { key: 'competitorAnalysis', name: 'تحليل المنافسين', icon: <icons.CompetitorAnalysisIcon />, component: CompetitorAnalysis },
                { key: 'marketSegmentation', name: 'تجزئة السوق', icon: <icons.MarketSegmentationIcon />, component: MarketSegmentation },
                { key: 'customerJourneyMap', name: 'خريطة رحلة العميل', icon: <icons.CustomerJourneyMapIcon />, component: CustomerJourneyMap },
            ]
        },
        {
            name: 'التحليل الاستراتيجي',
            description: 'أدوات لتحليل الوضع الحالي للشركة والبيئة الخارجية لاتخاذ قرارات استراتيجية طويلة الأمد.',
            icon: <icons.ChartBarIcon />,
            tools: [
                { key: 'swot', name: 'تحليل SWOT', icon: <icons.SwotIcon />, component: SwotAnalysis },
                { key: 'pestel', name: 'تحليل PESTEL', icon: <icons.PestelIcon />, component: PestelAnalysis },
                { key: 'portersFiveForces', name: 'قوى بورتر الخمسة', icon: <icons.PortersFiveForcesIcon />, component: PortersFiveForces },
                { key: 'ansoffMatrix', name: 'مصفوفة أنسوف', icon: <icons.AnsoffMatrixIcon />, component: AnsoffMatrix },
                { key: 'bcgMatrix', name: 'مصفوفة BCG', icon: <icons.BcgMatrixIcon />, component: BcgMatrix },
                { key: 'gapAnalysis', name: 'تحليل الفجوات', icon: <icons.GapAnalysisIcon />, component: GapAnalysis },
            ]
        },
        {
            name: 'تخطيط الأعمال والعمليات',
            description: 'أدوات لتصميم نموذج العمل، وتخطيط المشاريع، وتحديد المسؤوليات لضمان تنفيذ الاستراتيجية بكفاءة.',
            icon: <icons.FactoryIcon />,
            tools: [
                { key: 'businessModelCanvas', name: 'نموذج العمل التجاري', icon: <icons.BusinessModelCanvasIcon />, component: BusinessModelCanvas },
                { key: 'leanCanvas', name: 'اللوحة الرشيقة', icon: <icons.LeanCanvasIcon />, component: LeanCanvas },
                { key: 'valueProposition', name: 'عرض القيمة', icon: <icons.ValuePropositionIcon />, component: ValuePropositionCanvas },
                { key: 'ganttChart', name: 'مخطط جانت', icon: <icons.GanttChartIcon />, component: GanttChart },
                { key: 'okrKpi', name: 'الأهداف والنتائج (OKR)', icon: <icons.OkrKpiIcon />, component: OkrKpi },
                { key: 'processMapping', name: 'تخطيط العمليات', icon: <icons.ProcessMappingIcon />, component: ProcessMapping },
                { key: 'balancedScorecard', name: 'بطاقة الأداء المتوازن', icon: <icons.BalancedScorecardIcon />, component: BalancedScorecard },
                { key: 'raciMatrix', name: 'مصفوفة RACI', icon: <icons.RaciMatrixIcon />, component: RaciMatrix },
            ]
        },
        {
            name: 'التحليل المالي والنمو',
            description: 'أدوات لتقييم الجدوى المالية للمشاريع، قياس الربحية، وتقديم عروض قوية للمستثمرين.',
            icon: <icons.DollarIcon />,
            tools: [
                { key: 'breakEven', name: 'تحليل نقطة التعادل', icon: <icons.BreakEvenIcon />, component: BreakEvenAnalysis },
                { key: 'unitEconomics', name: 'اقتصاديات الوحدة', icon: <icons.UnitEconomicsIcon />, component: UnitEconomics },
                { key: 'roi', name: 'حاسبة ROI', icon: <icons.RoiCalculatorIcon />, component: RoiCalculator },
                { key: 'investorPitchDeck', name: 'عرض للمستثمرين', icon: <icons.PitchDeckIcon />, component: InvestorPitchDeck },
            ]
        }
    ];

    const handleUpdate = (toolKey: keyof ResearchAndDevelopmentData, newData: any) => {
        setRdData(prev => ({...prev, [toolKey]: newData}));
    };
    
    if (activeTool) {
        const allTools = toolCategories.flatMap(c => c.tools);
        const tool = allTools.find(t => t.key === activeTool);
        if (tool) {
            const ToolComponent = tool.component as React.FC<any>;
            return <ToolComponent 
                        onBack={() => setActiveTool(null)} 
                        data={rdData[tool.key as keyof ResearchAndDevelopmentData]} 
                        updateData={(newData: any) => handleUpdate(tool.key as keyof ResearchAndDevelopmentData, newData)} 
                    />
        }
    }

    return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-slate-900">أدوات البحث والتطوير</h2>
            <div className="print:hidden">
              <PrintButton />
            </div>
          </div>
          <div className="space-y-4">
            {toolCategories.map((category) => (
              <div key={category.name} className="border border-slate-200 rounded-lg overflow-hidden transition-all duration-300">
                <button
                  onClick={() => setExpandedCategory(expandedCategory === category.name ? null : category.name)}
                  className="w-full flex justify-between items-center p-4 bg-white hover:bg-slate-50 transition-colors focus:outline-none print:hidden"
                  aria-expanded={expandedCategory === category.name}
                  aria-controls={`category-${category.name}`}
                >
                  <div className="flex items-center gap-4 text-right">
                    <div className="text-indigo-600 bg-indigo-100 p-3 rounded-lg flex-shrink-0">
                      {React.cloneElement(category.icon, { className: 'w-6 h-6' })}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">{category.name}</h3>
                      <p className="text-sm text-slate-500 mt-1">{category.description}</p>
                    </div>
                  </div>
                  <icons.ChevronDownIcon className={`w-6 h-6 text-slate-500 transform transition-transform duration-300 ${expandedCategory === category.name ? 'rotate-180' : ''}`} />
                </button>
                {(expandedCategory === category.name || document.hidden === undefined) && ( // Always render for printing
                  <div id={`category-${category.name}`} className={`p-4 bg-slate-50 border-t border-slate-200 animate-fade-in ${expandedCategory !== category.name ? 'hidden print:block' : ''}`}>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {category.tools.map((tool) => (
                        <button
                          key={tool.key}
                          onClick={() => setActiveTool(tool.key as keyof ResearchAndDevelopmentData)}
                          className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow text-center h-32 transition-transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 print:hidden"
                        >
                          <div className="text-indigo-600 mb-2">{React.cloneElement(tool.icon, { className: 'w-8 h-8' })}</div>
                          <span className="text-sm font-semibold text-slate-700">{tool.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
    );
};

export default ResearchAndDevelopment;