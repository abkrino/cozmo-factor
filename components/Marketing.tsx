import React, { useState } from 'react';
import {
  MarketingCampaign, CampaignStatus, ResearchAndDevelopmentData, PlatformAnalysisData, Platform, View, FinishedProductItem, ChatMessage
} from '../types';
import {
  PlusIcon, MegaphoneIcon, ChartBarIcon, LightbulbIcon, BackIcon, UsersIcon, DollarIcon,
  LoadingIcon, CheckCircleIcon, AiIcon, UserIcon, SendIcon
} from './icons';
import AddCampaignModal from './AddCampaignModal';
import { getAiAssistance } from '../services/geminiService';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import PrintButton from './PrintButton';

interface MarketingProps {
  campaigns: MarketingCampaign[];
  setCampaigns: React.Dispatch<React.SetStateAction<MarketingCampaign[]>>;
  platformAnalysisData: PlatformAnalysisData;
  setPlatformAnalysisData: React.Dispatch<React.SetStateAction<PlatformAnalysisData>>;
  rdData: ResearchAndDevelopmentData;
  activeView: View;
  finishedProducts: FinishedProductItem[];
}

const Marketing: React.FC<MarketingProps> = ({ campaigns, setCampaigns, platformAnalysisData, setPlatformAnalysisData, rdData, activeView, finishedProducts }) => {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'platforms' | 'ai_hub'>('campaigns');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);


  const handleConnect = (platformId: string, type: 'social' | 'marketplaces') => {
    setConnectingPlatform(platformId);
    setTimeout(() => {
      setPlatformAnalysisData(prevData => {
        const newData: PlatformAnalysisData = {
          social: prevData.social.map(p => ({ ...p, icon: p.icon })), // Re-create objects to avoid mutation issues
          marketplaces: prevData.marketplaces.map(p => ({ ...p, icon: p.icon })),
        };
        const platforms = newData[type];
        const platformIndex = platforms.findIndex((p: Platform) => p.id === platformId);
        if (platformIndex > -1) {
          platforms[platformIndex].connected = true;
        }
        return newData;
      });
      setConnectingPlatform(null);
    }, 2000);
  };
  
  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setLastSync(new Date());
      setIsSyncing(false);
    }, 1500);
  };

  const getAiSuggestion = async (prompt: string) => {
    setIsAiLoading(true);
    setAiResponse('');
    try {
      const response = await getAiAssistance(prompt, { activeView, researchAndDevelopment: rdData });
      setAiResponse(response);
    } catch (error) {
      setAiResponse('عذرًا، حدث خطأ أثناء الاتصال بالذكاء الاصطناعي.');
    }
    setIsAiLoading(false);
  };

  const handleChatSend = async () => {
    if (!chatInput.trim() || !selectedPlatform) return;

    const userMessage: ChatMessage = { id: `user-${Date.now()}`, sender: 'user', text: chatInput };
    
    const updatedHistory = [...(selectedPlatform.chatHistory || []), userMessage];
    const updatedPlatform = { ...selectedPlatform, chatHistory: updatedHistory };
    setSelectedPlatform(updatedPlatform);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const context = {
        activeView: View.MARKETING,
        isChatbot: true,
        inventory: { finishedProducts },
        currentChat: updatedHistory,
      };
      const aiResponseText = await getAiAssistance(chatInput, context);
      const aiMessage: ChatMessage = { id: `ai-${Date.now()}`, sender: 'ai', text: aiResponseText };
      
      const finalHistory = [...updatedHistory, aiMessage];
      const finalPlatform = { ...updatedPlatform, chatHistory: finalHistory };

      setSelectedPlatform(finalPlatform);

      setPlatformAnalysisData(prev => ({
          social: prev.social.map(p => p.id === finalPlatform.id ? finalPlatform : p),
          marketplaces: prev.marketplaces.map(p => p.id === finalPlatform.id ? finalPlatform : p),
      }));

    } catch (error) {
      const errorMessage: ChatMessage = { id: `err-${Date.now()}`, sender: 'ai', text: 'عذرًا، حدث خطأ ما. حاول مرة أخرى.' };
      const finalHistory = [...updatedHistory, errorMessage];
      const finalPlatform = { ...updatedPlatform, chatHistory: finalHistory };
      setSelectedPlatform(finalPlatform);
      setPlatformAnalysisData(prev => ({
          social: prev.social.map(p => p.id === finalPlatform.id ? finalPlatform : p),
          marketplaces: prev.marketplaces.map(p => p.id === finalPlatform.id ? finalPlatform : p),
      }));
    } finally {
      setIsChatLoading(false);
    }
  };

  const quickPrompts = [
    rdData.userPersona?.name ? `اقترح أفكار محتوى لشخصية المستخدم: ${rdData.userPersona.name}` : '',
    'اكتب منشور إعلان عن خصومات نهاية الموسم',
    'ما هي أفضل المنصات لاستهداف فئة الشباب؟',
    rdData.swot?.opportunities ? `كيف أستغل الفرص المتاحة في تحليل SWOT؟` : '',
  ].filter(Boolean);

  const isAnyPlatformConnected = platformAnalysisData.social.some(p => p.connected) || platformAnalysisData.marketplaces.some(p => p.connected);

  const getStatusBadge = (status: CampaignStatus) => {
    const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
    switch (status) {
      case CampaignStatus.PLANNING: return <span className={`${baseClasses} bg-slate-100 text-slate-800`}>{status}</span>;
      case CampaignStatus.ACTIVE: return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>{status}</span>;
      case CampaignStatus.COMPLETED: return <span className={`${baseClasses} bg-green-100 text-green-800`}>{status}</span>;
      case CampaignStatus.CANCELLED: return <span className={`${baseClasses} bg-red-100 text-red-800`}>{status}</span>;
      default: return null;
    }
  };

  const renderCampaigns = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center print:hidden">
        <h3 className="text-xl font-bold text-slate-800">الحملات التسويقية</h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          إنشاء حملة جديدة
        </button>
      </div>
      <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm text-right text-slate-500">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3">اسم الحملة</th>
              <th scope="col" className="px-6 py-3">القناة</th>
              <th scope="col" className="px-6 py-3">تاريخ البدء</th>
              <th scope="col" className="px-6 py-3">تاريخ الانتهاء</th>
              <th scope="col" className="px-6 py-3">الميزانية (ج.م)</th>
              <th scope="col" className="px-6 py-3">الحالة</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign) => (
              <tr key={campaign.id} className="bg-white border-b hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">{campaign.name}</td>
                <td className="px-6 py-4">{campaign.channel}</td>
                <td className="px-6 py-4">{campaign.startDate}</td>
                <td className="px-6 py-4">{campaign.endDate}</td>
                <td className="px-6 py-4 font-mono">{campaign.budget.toLocaleString()}</td>
                <td className="px-6 py-4">{getStatusBadge(campaign.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPlatformDashboard = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h3 className="text-xl font-bold text-slate-800">تحليل المنصات</h3>
        <div className="flex items-center gap-4 print:hidden">
          {lastSync && <p className="text-sm text-slate-500">آخر مزامنة: {lastSync.toLocaleTimeString()}</p>}
          <button
            onClick={handleSync}
            disabled={!isAnyPlatformConnected || isSyncing}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            {isSyncing ? <LoadingIcon className="w-5 h-5 animate-spin" /> : <PlusIcon className="w-5 h-5 transform rotate-45" />}
            {isSyncing ? 'جاري المزامنة...' : 'مزامنة البيانات'}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-lg font-semibold text-slate-700 mb-3">منصات التواصل الاجتماعي</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {platformAnalysisData.social.map(p => renderPlatformCard(p, 'social'))}
          </div>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-slate-700 mb-3">المتاجر الإلكترونية</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {platformAnalysisData.marketplaces.map(p => renderPlatformCard(p, 'marketplaces'))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPlatformCard = (platform: Platform, type: 'social' | 'marketplaces') => (
    <div key={platform.id} className="bg-white p-4 rounded-lg shadow text-center flex flex-col justify-between h-40">
      <div className="flex items-center justify-center gap-2">
        <div className="w-8 h-8 flex items-center justify-center">{platform.icon}</div>
        <h5 className="font-bold">{platform.name}</h5>
        {platform.connected && <CheckCircleIcon className="w-5 h-5 text-green-500" />}
      </div>
      <div className="print:hidden">
        {platform.connected ? (
          <button
            onClick={() => setSelectedPlatform(platform)}
            className="w-full px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors"
          >
            عرض التحليل
          </button>
        ) : (
          <button
            onClick={() => handleConnect(platform.id, type)}
            disabled={connectingPlatform === platform.id}
            className="w-full px-4 py-2 text-sm font-semibold text-indigo-700 bg-indigo-100 rounded-lg hover:bg-indigo-200 transition-colors disabled:bg-slate-200 disabled:text-slate-500"
          >
            {connectingPlatform === platform.id ? (
              <span className="flex items-center justify-center gap-2">
                <LoadingIcon className="w-5 h-5 animate-spin" /> جاري الربط...
              </span>
            ) : (
              'ربط الحساب'
            )}
          </button>
        )}
      </div>
    </div>
  );

  const renderPlatformAnalysis = (platform: Platform) => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <button onClick={() => setSelectedPlatform(null)} className="p-2 rounded-full hover:bg-slate-100 print:hidden">
          <BackIcon className="w-6 h-6 text-slate-700" />
        </button>
        <div className="w-10 h-10">{platform.icon}</div>
        <h3 className="text-2xl font-bold text-slate-900">تحليل أداء {platform.name}</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {platform.kpis.map(kpi => (
              <div key={kpi.title} className="bg-white p-4 rounded-lg shadow flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-full text-indigo-600">{kpi.icon}</div>
                <div>
                  <p className="text-sm text-slate-500">{kpi.title}</p>
                  <p className="text-xl font-bold">{kpi.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-bold mb-4">نمو المتابعين/المبيعات (بالآلاف)</h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={platform.growthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={2} name="العدد" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-bold mb-4">الأفضل أداءً</h4>
              <ul className="space-y-3">
                {platform.topItems.map(item => (
                  <li key={item.id} className="flex justify-between items-center p-2 bg-slate-50 rounded-md">
                    <span className="text-sm font-medium text-slate-800">{item.name}</span>
                    <span className="text-sm font-bold text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">{item.value} <span className="text-xs text-indigo-500">{item.metric}</span></span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2 bg-white rounded-lg shadow flex flex-col h-[650px]">
          <h4 className="font-bold p-4 border-b text-slate-800">محادثات العملاء</h4>
          <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-4">
            {(platform.chatHistory || []).map(msg => (
                <div key={msg.id} className={`flex items-start gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    <span className={`p-2 rounded-full ${msg.sender === 'ai' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-600'}`}>
                        {msg.sender === 'ai' ? <AiIcon className="w-5 h-5" /> : <UserIcon className="w-5 h-5"/>}
                    </span>
                    <p className={`p-3 rounded-lg text-sm max-w-xs shadow-sm ${msg.sender === 'ai' ? 'bg-indigo-50 text-slate-700' : 'bg-white text-slate-700'}`}>
                        {msg.text}
                    </p>
                </div>
            ))}
             {isChatLoading && (
                <div className="flex items-start gap-2">
                    <span className="p-2 rounded-full bg-indigo-100 text-indigo-600">
                        <AiIcon className="w-5 h-5"/>
                    </span>
                    <p className="p-3 rounded-lg text-sm bg-indigo-50 flex items-center gap-2 text-slate-500">
                        <LoadingIcon className="w-4 h-4 animate-spin"/>
                        <span>يكتب...</span>
                    </p>
                </div>
            )}
          </div>
          <div className="p-4 border-t flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleChatSend()}
              placeholder="اكتب رسالة العميل هنا..."
              className="flex-grow p-2 border border-slate-300 rounded-full focus:ring-2 focus:ring-indigo-500"
              disabled={isChatLoading}
            />
            <button
              onClick={handleChatSend}
              disabled={isChatLoading || !chatInput.trim()}
              className="p-3 bg-indigo-600 text-white rounded-full disabled:bg-slate-400 hover:bg-indigo-700 transition"
            >
              <SendIcon className="w-5 h-5"/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAiHub = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-slate-800">مركز المحتوى الذكي</h3>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="space-y-4 print:hidden">
          <div>
            <label className="font-semibold">اطرح سؤالاً أو اطلب محتوى:</label>
            <textarea
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              className="w-full mt-2 p-2 border rounded-md h-28"
              placeholder="مثال: اكتب 3 عناوين جذابة لإعلان عن كريم اللافندر..."
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((prompt, i) => (
              <button key={i} onClick={() => { setAiInput(prompt); getAiSuggestion(prompt); }} className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-full hover:bg-indigo-200">
                {prompt}
              </button>
            ))}
          </div>
          <button
            onClick={() => getAiSuggestion(aiInput)}
            disabled={isAiLoading || !aiInput}
            className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 disabled:bg-slate-400"
          >
            {isAiLoading ? <LoadingIcon className="w-5 h-5 animate-spin" /> : <LightbulbIcon className="w-5 h-5" />}
            {isAiLoading ? 'جاري التفكير...' : 'توليد أفكار'}
          </button>
        </div>
        {(isAiLoading || aiResponse) && (
          <div className="mt-6 p-4 bg-slate-50 rounded-lg border">
            <h4 className="font-bold mb-2">رد المساعد الذكي:</h4>
            {isAiLoading && <p className="text-slate-500">جاري الكتابة...</p>}
            <p className="text-slate-700 whitespace-pre-wrap">{aiResponse}</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderContent = () => {
    if (selectedPlatform) {
      return renderPlatformAnalysis(selectedPlatform);
    }
    switch (activeTab) {
      case 'campaigns': return renderCampaigns();
      case 'platforms': return renderPlatformDashboard();
      case 'ai_hub': return renderAiHub();
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-900">إدارة التسويق</h2>
        <div className="print:hidden">
            <PrintButton />
        </div>
      </div>
      <div className="border-b border-slate-200 print:hidden">
        <nav className="-mb-px flex gap-6" aria-label="Tabs">
          <button onClick={() => { setActiveTab('campaigns'); setSelectedPlatform(null); }} className={`shrink-0 border-b-2 px-1 pb-4 text-sm font-medium ${activeTab === 'campaigns' && !selectedPlatform ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
            الحملات
          </button>
          <button onClick={() => { setActiveTab('platforms'); setSelectedPlatform(null); }} className={`shrink-0 border-b-2 px-1 pb-4 text-sm font-medium ${activeTab === 'platforms' || selectedPlatform ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
            تحليل المنصات
          </button>
          <button onClick={() => { setActiveTab('ai_hub'); setSelectedPlatform(null); }} className={`shrink-0 border-b-2 px-1 pb-4 text-sm font-medium ${activeTab === 'ai_hub' && !selectedPlatform ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
            مركز المحتوى الذكي
          </button>
        </nav>
      </div>
      {renderContent()}
      {isModalOpen && <AddCampaignModal onClose={() => setIsModalOpen(false)} setCampaigns={setCampaigns} />}
    </div>
  );
};

export default Marketing;