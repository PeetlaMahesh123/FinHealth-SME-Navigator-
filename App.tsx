
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, History, Database, ShieldCheck, Loader2, AlertCircle, 
  Upload, Zap, Activity, ChevronRight, LogOut, Settings, Languages,
  Sparkles, CreditCard, Landmark, AppWindow, Trash2
} from 'lucide-react';
import { IndustryType, Language, AssessmentResult, IntegrationStatus } from './types';
import { analyzeFinancialData } from "./analysisService";

import Dashboard from './components/Dashboard';

export const i18n: Record<string, any> = {
  [Language.EN]: {
    vitalsTerminal: "FinHealth Terminal", auditArchive: "Audit Archive", coreDatabase: "Connector Hub", systemConsole: "System Console", financialAudit: "Financial Health Navigator", subHeader: "AI analytics for cash flows, credit optimization, and strategic growth.", initiateAudit: "Initiate Scan", connected: "Secure Tunnel", establish: "Connect Source", selectLang: "Language", marketplaceDesc: "Establish encrypted tunnels with financial networks.", health: "Health", grade: "Grade", parsingVitals: "Parsing Financial Vitals...", terminate: "End Session", vaultActive: "Vault Active", creditAuthority: "Credit Authority", sectorRadar: "Sector Radar", forecastEngine: "Neural Forecast Engine", ledgerDiscrepancy: "Ledger Discrepancy Map", growthMatrix: "Strategic Growth Matrix", complianceIndex: "Compliance Index", capitalOptimization: "Capital Optimization Matches", exportAudit: "Export Pro-Audit", newScan: "New Scan", investorCertified: "Investor Certified", prime: "Prime", optimalLiquidity: "Optimal Liquidity Bridge", autoValidation: "Auto-Validation Active", manualProcessing: "Deep Ledger Analysis", manualDesc: "Upload statements to trigger a 360° risk and opportunity assessment.", apiEcosystem: "Real-time Sync", apiDesc: "Bridge your banking and tax profiles for persistent monitoring.", overview: "Overview", statements: "Statements", scenarios: "Scenarios", dscrStatus: "DSCR Status", borrowingCap: "Borrowing Capacity", industryRank: "Industry Rank", runSimulation: "Run Simulation", pl: "Profit & Loss", bs: "Balance Sheet", cf: "Cash Flow", impact: "Impact", riskLevel: "Risk Level", sectorEngine: "Sector Engine", disconnect: "Disconnect Tunnel", liveSync: "Live Sync", restore: "Restore Session", purge: "Purge Archive", secureVaultDesc: "AES-256 Multi-layer active.", adminLabel: "Admin_7", retranslating: "Retranslating Report...", scanningSector: "Sector Benchmarks: ", noArchives: "No encrypted archives found."
  },
  [Language.HI]: {
    vitalsTerminal: "फिनहेल्थ टर्मिनल", auditArchive: "ऑडिट संग्रह", coreDatabase: "कनेक्टर हब", systemConsole: "सिस्टम कंसोल", financialAudit: "वित्तीय स्वास्थ्य नेविगेटर", subHeader: "नकद प्रवाह और विकास के लिए गहरी एआई विश्लेषण।", initiateAudit: "स्कैन शुरू करें", connected: "सुरक्षित टनल", establish: "स्रोत जोड़ें", selectLang: "भाषा", marketplaceDesc: "वित्तीय नेटवर्क के साथ सुरक्षित कनेक्शन।", health: "स्वास्थ्य", grade: "ग्रेड", parsingVitals: "वित्तीय डेटा का विश्लेषण...", terminate: "सत्र समाप्त", vaultActive: "तिजोरी सक्रिय", creditAuthority: "क्रेडिट प्राधिकरण", sectorRadar: "सेक्टर रडार", forecastEngine: "पूर्वानुमान इंजन", ledgerDiscrepancy: "विसंगति मानचित्र", growthMatrix: "विकास मैट्रिक्स", complianceIndex: "अनुपालन सूचकांक", capitalOptimization: "पूंजी अनुकूलन", exportAudit: "ऑडिट निर्यात", newScan: "नया स्कैन", investorCertified: "निवेशक प्रमाणित", prime: "प्राइम", optimalLiquidity: "तरलता सेतु", autoValidation: "सत्यापन सक्रिय", manualProcessing: "गहन लेजर विश्लेषण", manualDesc: "जोखिम और अवसर मूल्यांकन के लिए विवरण अपलोड करें।", apiEcosystem: "रीयल-टाइम सिंक", apiDesc: "निरंतर निगरानी के लिए अपने बैंकिंग और टैक्स प्रोफाइल को जोड़ें।", overview: "अवलोकन", statements: "विवरण", scenarios: "परिदृश्य", dscrStatus: "DSCR स्थिति", borrowingCap: "ऋण क्षमता", industryRank: "उद्योग रैंक", runSimulation: "सिमुलेशन चलाएं", pl: "लाभ और हानि", bs: "तुलन पत्र", cf: "नकद प्रवाह", impact: "प्रभाव", riskLevel: "जोखिम स्तर", sectorEngine: "सेक्टर इंजन", disconnect: "कनेक्शन हटाएं", liveSync: "लाइव सिंक", restore: "सत्र बहाल करें", purge: "संग्रह हटाएं", secureVaultDesc: "AES-256 सुरक्षा सक्रिय।", adminLabel: "प्रशासक_7", retranslating: "रिपोर्ट का अनुवाद हो रहा है...", scanningSector: "सेक्टर बेंचमार्क: ", noArchives: "कोई संग्रह नहीं मिला।"
  },
  [Language.GUJ]: {
    vitalsTerminal: "ફિનહેલ્થ ટર્મિનલ", auditArchive: "ઓડિટ આર્કાઇવ", coreDatabase: "કનેક્ટર હબ", financialAudit: "નાણાકીય આરોગ્ય નેવિગેટર", initiateAudit: "સ્કેન શરૂ કરો", establish: "કનેક્ટ કરો", subHeader: "કેશ ફ્લો અને વૃદ્ધિ માટે AI એનાલિટિક્સ.", health: "આરોગ્ય", grade: "ગ્રેડ", parsingVitals: "વિશ્લેષણ કરી રહ્યા છીએ...", terminate: "સત્ર સમાપ્ત", vaultActive: "વોલ્ટ સક્રિય", creditAuthority: "ક્રેડિટ ઓથોરિટી", sectorRadar: "સેક્ટર રડાર", forecastEngine: "પૂર્વાનુમાન એન્જિન", overview: "ઝાંખી", statements: "નિવેદનો", scenarios: "પરિસ્થિતિઓ", runSimulation: "પરીક્ષણ કરો", newScan: "નવું સ્કેન", exportAudit: "નિકાસ કરો", pl: "નફો અને નુકસાન", bs: "બેલેન્સ શીટ", cf: "કેશ ફ્લો", borrowingCap: "ઉધાર ક્ષમતા", restore: "પુનઃસ્થાપિત કરો", sectorEngine: "સેક્ટર એન્જિન", disconnect: "ડિસ્કનેક્ટ કરો", liveSync: "લાઇવ સિંક", purge: "આર્કાઇવ સાફ કરો", retranslating: "ભાષાંતર થઈ રહ્યું છે...", scanningSector: "સેક્ટર બેન્ચમાર્ક: ", noArchives: "કોઈ આર્કાઇવ્સ મળ્યા નથી."
  },
  [Language.MR]: {
    vitalsTerminal: "फिनहेल्થ टर्मिनल", auditArchive: "ऑडिट संग्रहण", coreDatabase: "कनेक्टर हब", financialAudit: "वित्तीय आरोग्य नेव्हिगेटर", initiateAudit: "स्कॅन सुरू करा", establish: "कनेक्ट करा", subHeader: "कॅश फ्लो आणि वाढीसाठी AI विश्लेषण.", health: "आरोग्य", grade: "ग्रेड", parsingVitals: "विश्लेषण करत आहे...", terminate: "सत्र समाप्त", vaultActive: "वॉल्ट सक्रिय", creditAuthority: "क्रेडिट ऑथॉरिटी", sectorRadar: "सेक्टर रडार", forecastEngine: "पूर्वानुमान इंजिन", overview: "आढावा", statements: "विवरण", scenarios: "परिदृश्य", runSimulation: "चाचणी करा", newScan: "नवीन स्कॅन", exportAudit: "निर्यात करा", pl: "नफा आणि तोटा", bs: "ताळेबंद", cf: "कॅश फ्लो", borrowingCap: "कर्ज क्षमता", restore: "पुनर्संचयित करा", sectorEngine: "सेक्टर इंजिन", disconnect: "डिस्कनेक्ट करा", liveSync: "लाइव सिंक", purge: "संग्रह पुसा", retranslating: "भाषांतर करत आहे...", scanningSector: "सेक्टर बेंचमार्क: ", noArchives: "कोणतेही संग्रहण आढळले नाही."
  },
  [Language.BN]: {
    vitalsTerminal: "ফিনহেলথ টার্মিনাল", auditArchive: "অডিট আর্কাইভ", coreDatabase: "কানেক্টর হাব", financialAudit: "আর্থিক স্বাস্থ্য নেভিগেটর", initiateAudit: "স্ক্যান শুরু করুন", establish: "সংযোগ করুন", overview: "সংক্ষিপ্ত বিবরণ", statements: "বিবৃতি", scenarios: "দৃশ্যকল্প", health: "স্বাস্থ্য", grade: "গ্রেড", parsingVitals: "বিশ্লেষণ করা হচ্ছে...", terminate: "সেশন শেষ", vaultActive: "ভল্ট সক্রিয়", creditAuthority: "ক্রেডিট অথরিটি", sectorRadar: "সেক্টর রাডার", forecastEngine: "পূর্বাভাস ইঞ্জিন", newScan: "নতুন স্ক্যান", exportAudit: "রপ্তানি করুন", pl: "লাভ ও ক্ষতি", bs: "ব্যালেন্স শিট", cf: "ক্যাশ ফ্লো", borrowingCap: "ঋণ ক্ষমতা", restore: "পুনরুদ্ধার করুন", sectorEngine: "সেক্টর ইঞ্জিন", disconnect: "সংযোগ বিচ্ছিন্ন", liveSync: "লাইভ সিঙ্ক", purge: "আর্কাইভ মুছুন", retranslating: "অনুবাদ করা হচ্ছে...", scanningSector: "সেক্টর বেঞ্চমার্ক: ", noArchives: "কোনো আর্কাইভ পাওয়া যায়নি।"
  },
  [Language.TA]: {
    vitalsTerminal: "ஃபின்ஹெல்த் டெர்மினல்", auditArchive: "தணிக்கை காப்பகம்", coreDatabase: "இணைப்பு மையம்", financialAudit: "நிதி ஆரோக்கிய வழிகாட்டி", initiateAudit: "ஸ்கேன் தொடங்கவும்", establish: "இணைக்கவும்", overview: "மேலோட்டம்", statements: "அறிக்கைகள்", scenarios: "சூழ்நிலைகள்", health: "ஆரோக்கியம்", grade: "தரம்", parsingVitals: "ஆய்வு செய்யப்படுகிறது...", terminate: "அமர்வு முடிவு", vaultActive: "பெட்டகம் செயல்படுகிறது", creditAuthority: "கடன் ஆணையம்", sectorRadar: "துறை ரேடார்", forecastEngine: "முன்னறிவிப்பு இயந்திரம்", newScan: "புதிய ஸ்கேன்", exportAudit: "ஏற்றுமதி செய்", pl: "லாபம் மற்றும் நஷ்டம்", bs: "இருப்பு நிலை குறிப்பு", cf: "பணப்புழக்கம்", borrowingCap: "கடன் திறன்", restore: "மீட்டமை", sectorEngine: "துறை இயந்திரம்", disconnect: "துண்டிக்கவும்", liveSync: "நேరடி ஒத்திசைவு", purge: "காப்பகத்தை அழி", retranslating: "மொழிபெயர்க்கப்படுகிறது...", scanningSector: "துறை அளவுகோல்கள்: ", noArchives: "காப்பகங்கள் எதுவும் இல்லை."
  },
  [Language.TE]: {
    vitalsTerminal: "ఫిన్‌హెల్త్ టెర్మినల్", auditArchive: "ఆడిట్ ఆర్కైవ్", coreDatabase: "కనెక్టర్ హబ్", financialAudit: "ఆర్థిక ఆరోగ్య నావిగేటర్", initiateAudit: "స్కాన్ ప్రారంభించండి", establish: "కనెక్ట్ చేయండి", overview: "అవలోకనం", statements: "నివేదికలు", scenarios: "సందర్భాలు", health: "ఆరోగ్యం", grade: "గ్రేడ్", parsingVitals: "విశ్లేషిస్తోంది...", terminate: "సెషన్ ముగించు", vaultActive: "వాల్ట్ యాక్టివ్", creditAuthority: "క్రెడిట్ అథారిటీ", sectorRadar: "సెక్టార్ రాడార్", forecastEngine: "ఫోర్కాస్ట్ ఇంజిన్", newScan: "కొత్త స్కాన్", exportAudit: "ఎగుమతి చేయి", pl: "లాభ నష్టాలు", bs: "ఆస్తి అప్పుల పట్టిక", cf: "నగదు ప్రవాహం", borrowingCap: "అప్పు తీసుకునే సామర్థ్యం", restore: "పునరుద్ధరించు", sectorEngine: "సెక్టార్ ఇంజిన్", disconnect: "డిస్కనెక్ట్ చేయి", liveSync: "లైవ్ సింక్", purge: "ఆర్కైవ్ తొలగించు", retranslating: "అనువదిస్తోంది...", scanningSector: "సెక్టార్ బెంచ్‌మార్క్‌లు: ", noArchives: "ఆర్కైవ్‌లు లేవు."
  }
};

const SidebarItem: React.FC<{ icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }> = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all relative group ${active ? 'bg-indigo-600/10 text-white font-black' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
    {active && <div className="absolute left-0 w-1.5 h-6 bg-indigo-500 rounded-r-full"></div>}
    <span className={active ? 'text-indigo-400' : 'group-hover:text-indigo-400'}>{icon}</span>
    <span className="text-[11px] uppercase tracking-[0.2em]">{label}</span>
  </button>
);

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history' | 'integrations' | 'terminal'>('dashboard');
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryType>(() => (localStorage.getItem('finhealth_ind') as IndustryType) || IndustryType.RETAIL);
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem('finhealth_lang') as Language) || Language.EN);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AssessmentResult | null>(null);
  const [savedReports, setSavedReports] = useState<AssessmentResult[]>([]);
  const [integrations, setIntegrations] = useState<IntegrationStatus>(() => JSON.parse(localStorage.getItem('finhealth_int') || '{}'));
  const [error, setError] = useState<string | null>(null);
  const [lastRawData, setLastRawData] = useState<string | null>(null);

  const t = useMemo(() => i18n[language] || i18n[Language.EN], [language]);

  useEffect(() => {
    try {
      const history = localStorage.getItem('sme_db');
      if (history) setSavedReports(JSON.parse(history) || []);
    } catch (e) {
      console.error("Failed to load history", e);
    }
  }, []);

  useEffect(() => {
    if (lastRawData && analysisResult) {
      performAnalysis(lastRawData, selectedIndustry, true);
    }
    localStorage.setItem('finhealth_lang', language);
  }, [language]);

  const handleIndustryChange = (ind: IndustryType) => setSelectedIndustry(ind);

  const performAnalysis = async (data: string, industry: IndustryType, isRetranslation = false) => {
    setIsAnalyzing(true); 
    setError(null);
    setLastRawData(data);
    try {
      const result = await analyzeFinancialData(data, industry, language);
      if (result) {
        setAnalysisResult(result);
        if (!isRetranslation) {
          const updated = [result, ...(savedReports || [])].slice(0, 15);
          setSavedReports(updated);
          localStorage.setItem('sme_db', JSON.stringify(updated));
        }
      }
      setActiveTab('dashboard');
    } catch (err) { 
      setError("Analysis Failed. Ensure you are uploading a text-based financial statement."); 
    } finally { 
      setIsAnalyzing(false); 
    }
  };

  const processAudit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => performAnalysis((ev.target?.result as string).substring(0, 20000), selectedIndustry);
    reader.readAsText(file);
  };

  const toggleIntegration = (name: string) => {
    setIntegrations(prev => ({
      ...prev,
      [name]: { connected: !prev[name]?.connected, lastSync: new Date().toISOString() }
    }));
  };

  const clearHistory = () => {
    if (window.confirm(t.purge)) {
      setSavedReports([]);
      localStorage.removeItem('sme_db');
    }
  };

  const loadFromHistory = (report: AssessmentResult) => {
    setAnalysisResult(report);
    setActiveTab('dashboard');
  };

  return (
    <div className="flex min-h-screen bg-[#05070a] text-slate-100 overflow-hidden font-['Inter']">
      <aside className="w-80 bg-[#0a0c14] border-r border-white/5 flex flex-col p-8 z-50 shrink-0">
        <div className="flex items-center space-x-3 mb-12 group cursor-pointer" onClick={() => { setAnalysisResult(null); setActiveTab('dashboard'); }}>
          <div className="bg-indigo-600 p-2.5 rounded-2xl"><Sparkles className="text-white w-6 h-6" /></div>
          <h1 className="text-2xl font-black tracking-tighter uppercase italic text-white">FinHealth <span className="text-indigo-400">SME</span></h1>
        </div>
        <nav className="flex-1 space-y-2">
          <SidebarItem icon={<LayoutDashboard size={20} />} label={t.vitalsTerminal} active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem icon={<History size={20} />} label={t.auditArchive} active={activeTab === 'history'} onClick={() => setActiveTab('history')} />
          <SidebarItem icon={<Database size={20} />} label={t.coreDatabase} active={activeTab === 'integrations'} onClick={() => setActiveTab('integrations')} />
        </nav>
        <div className="mt-auto pt-8">
          <div className="bg-indigo-500/5 border border-white/5 rounded-3xl p-6 mb-4">
            <div className="flex items-center space-x-2 mb-2"><ShieldCheck size={16} className="text-emerald-400" /><span className="text-[10px] font-black uppercase text-indigo-300">{t.vaultActive}</span></div>
            <p className="text-[10px] text-slate-500 italic">{t.secureVaultDesc}</p>
          </div>
          <button className="w-full flex items-center justify-center space-x-2 py-4 text-slate-500 hover:text-rose-400 uppercase text-[10px] font-black"><LogOut size={16}/> <span>{t.terminate}</span></button>
        </div>
      </aside>

      <main className="flex-1 h-screen overflow-y-auto relative z-10 flex flex-col">
        <header className="h-24 border-b border-white/5 px-10 flex items-center justify-between sticky top-0 bg-[#05070a]/80 backdrop-blur-xl z-40">
          <div className="flex items-center space-x-4 bg-white/5 border border-white/10 p-1.5 rounded-2xl">
            <Languages className="w-4 h-4 text-indigo-400 ml-2" />
            <select value={language} onChange={(e) => setLanguage(e.target.value as Language)} className="bg-transparent text-[11px] font-black uppercase tracking-widest text-slate-300 outline-none p-2 cursor-pointer">
              {Object.values(Language || {}).map(l => <option key={l} value={l} className="bg-[#0a0c14]">{l}</option>)}
            </select>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex flex-col items-end"><span className="text-xs font-black">{t.adminLabel}</span><div className="flex items-center space-x-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div><span className="text-[10px] font-bold text-emerald-500 uppercase">{t.liveSync}</span></div></div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-2xl shadow-indigo-500/20"><Settings className="text-white w-5 h-5" /></div>
          </div>
        </header>

        <div className="p-10 max-w-7xl mx-auto w-full">
          {error && (
            <div className="mb-10 bg-rose-500/10 border border-rose-500/20 p-6 rounded-3xl flex items-center space-x-4 animate-shake">
              <AlertCircle className="text-rose-500" />
              <p className="text-sm font-bold text-rose-500">{error}</p>
            </div>
          )}

          {activeTab === 'dashboard' && (
            <>
              {!analysisResult && !isAnalyzing && (
                <div className="animate-fadeIn">
                  <div className="max-w-4xl mb-20">
                    <div className="flex items-center space-x-2 mb-6 bg-indigo-500/10 w-fit px-4 py-2 rounded-full border border-indigo-500/20">
                      <span className="text-[11px] font-black uppercase text-indigo-400 tracking-widest">{selectedIndustry} {t.sectorEngine}</span>
                    </div>
                    <h2 className="text-8xl font-black text-white tracking-tighter mb-8 leading-none">
                      {t.financialAudit}
                    </h2>
                    <p className="text-slate-400 font-medium italic text-3xl border-l-8 border-indigo-500/30 pl-10 mb-16 leading-relaxed">
                      {t.subHeader}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                      <div className="p-12 bg-white/5 border border-white/10 rounded-[4rem] hover:bg-white/10 transition-all group relative overflow-hidden">
                        <Activity className="text-indigo-400 w-12 h-12 mb-8 group-hover:scale-110 transition-transform" />
                        <h3 className="text-3xl font-black text-white mb-4">{t.manualProcessing}</h3>
                        <p className="text-slate-500 mb-10 italic leading-relaxed">{t.manualDesc}</p>
                        <div className="flex space-x-4">
                          <select value={selectedIndustry} onChange={(e) => handleIndustryChange(e.target.value as IndustryType)} className="bg-white/10 border border-white/10 rounded-2xl px-6 py-4 text-xs font-black text-white outline-none">
                            {Object.values(IndustryType || {}).map(it => <option key={it} value={it} className="bg-[#0a0c14]">{it}</option>)}
                          </select>
                          <label className="flex items-center bg-indigo-600 text-white px-10 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest cursor-pointer hover:bg-indigo-500 shadow-2xl transition-all">
                            <Upload className="w-5 h-5 mr-3" /> {t.initiateAudit}
                            <input type="file" className="hidden" onChange={processAudit} />
                          </label>
                        </div>
                      </div>

                      <div className="p-12 bg-indigo-500/5 border border-indigo-500/10 rounded-[4rem] hover:bg-indigo-500/10 transition-all group cursor-pointer" onClick={() => setActiveTab('integrations')}>
                        <Zap className="text-amber-400 w-12 h-12 mb-8 group-hover:scale-110 transition-transform" />
                        <h3 className="text-3xl font-black text-white mb-4">{t.apiEcosystem}</h3>
                        <p className="text-slate-500 mb-10 italic leading-relaxed">{t.apiDesc}</p>
                        <div className="inline-flex items-center text-amber-400 text-xs font-black uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                          {t.establish} <ChevronRight size={16} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {isAnalyzing && (
                <div className="h-[60vh] flex flex-col items-center justify-center text-center animate-pulse">
                  <Loader2 className="w-32 h-32 text-indigo-500 animate-spin mb-12" strokeWidth={3} />
                  <h3 className="text-5xl font-black text-white tracking-tighter mb-4">{analysisResult ? t.retranslating : t.parsingVitals}</h3>
                  <p className="text-indigo-400 font-black uppercase tracking-widest text-xs">{t.scanningSector} {selectedIndustry}</p>
                </div>
              )}

              {analysisResult && !isAnalyzing && (
                <Dashboard 
                  data={analysisResult} 
                  industry={selectedIndustry} 
                  onIndustryChange={handleIndustryChange} 
                  language={language}
                  onReset={() => { setAnalysisResult(null); setLastRawData(null); }}
                />
              )}
            </>
          )}

          {activeTab === 'history' && (
            <div className="animate-fadeIn space-y-12">
              <div className="flex justify-between items-end">
                <h3 className="text-7xl font-black tracking-tighter text-white">{t.auditArchive}</h3>
                <button onClick={clearHistory} className="mb-2 p-4 bg-rose-500/10 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all"><Trash2 size={20} /></button>
              </div>
              {(savedReports || []).length === 0 ? (
                <div className="p-20 border-2 border-dashed border-white/5 rounded-[4rem] text-center">
                  <History className="w-16 h-16 text-slate-800 mx-auto mb-6" />
                  <p className="text-slate-500 font-bold italic">{t.noArchives}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {(savedReports || []).map((report) => (
                    <div key={report?.id} onClick={() => loadFromHistory(report)} className="p-10 rounded-[3.5rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer group flex flex-col">
                      <div className="flex justify-between items-start mb-10">
                        <div className="p-4 bg-indigo-500/10 rounded-2xl text-indigo-400 group-hover:scale-110 transition-transform"><Activity size={24} /></div>
                        <span className="text-[10px] font-black text-slate-500 uppercase">{new Date(report?.timestamp).toLocaleDateString()}</span>
                      </div>
                      <h4 className="text-2xl font-black text-white mb-2">Audit_{report?.id?.slice(0, 8).toUpperCase()}</h4>
                      <div className="flex items-center space-x-3 text-[10px] font-black uppercase text-indigo-400 tracking-widest mb-10">
                        <span>{report?.creditRisk?.grade} Rank</span>
                        <div className="w-1 h-1 rounded-full bg-slate-700"></div>
                        <span>{report?.score}% {t.health}</span>
                      </div>
                      <button className="mt-auto py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">{t.restore}</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="animate-fadeIn space-y-12">
              <h3 className="text-7xl font-black tracking-tighter text-white">{t.coreDatabase}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { id: 'stripe', name: 'Stripe', cat: 'Payments', icon: <CreditCard />, desc: 'Real-time revenue stream tracking.' },
                  { id: 'hdfc', name: 'HDFC Bank', cat: 'Banking', icon: <Landmark />, desc: 'Direct ledger synchronization.' },
                  { id: 'gstn', name: 'GSTN Portal', cat: 'Compliance', icon: <AppWindow />, desc: 'Tax and filing automation.' }
                ].map(item => (
                  <div key={item.id} className="p-12 rounded-[4rem] border border-white/5 bg-white/5 flex flex-col group hover:border-indigo-500/30 transition-all">
                    <div className="mb-10 p-6 bg-indigo-500/10 rounded-3xl w-fit group-hover:scale-110 transition-transform">{item.icon}</div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-black text-indigo-400 uppercase">{item.cat}</span>
                      {integrations[item.id]?.connected && <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded">Connected</span>}
                    </div>
                    <h4 className="text-3xl font-black text-white mb-4">{item.name}</h4>
                    <p className="text-sm text-slate-500 mb-12 italic leading-relaxed">{item.desc}</p>
                    <button 
                      onClick={() => toggleIntegration(item.id)}
                      className={`mt-auto py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${integrations[item.id]?.connected ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white' : 'bg-white/10 text-white border border-white/10 hover:bg-indigo-600'}`}
                    >
                      {integrations[item.id]?.connected ? t.disconnect : t.establish}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
export default App;
