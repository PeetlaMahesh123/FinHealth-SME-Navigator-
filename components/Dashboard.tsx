
import React, { useState, useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Radar, RadarChart, PolarGrid, PolarAngleAxis
} from 'recharts';
import { 
  TrendingUp, Award, Printer, Filter, 
  BarChart3, RefreshCcw, FileText, PlayCircle, Scale, 
  ArrowDownRight, ArrowUpRight
} from 'lucide-react';
import { AssessmentResult, IndustryType, Language, FinancialStatementRow } from '../types';
import { i18n } from '../App';

interface DashboardProps {
  data: AssessmentResult; 
  industry: IndustryType; 
  onIndustryChange: (ind: IndustryType) => void; 
  language: Language;
  onReset: () => void;
}

const StatementTable: React.FC<{ title: string, rows: FinancialStatementRow[] }> = ({ title, rows = [] }) => (
  <div className="bg-white/5 rounded-3xl border border-white/5 overflow-hidden">
    <div className="bg-white/5 px-6 py-4 border-b border-white/5">
      <h6 className="text-[10px] font-black uppercase tracking-widest text-indigo-400">{title}</h6>
    </div>
    <div className="divide-y divide-white/5">
      {(rows || []).map((row, idx) => (
        <div key={idx} className={`flex justify-between px-6 py-4 ${row?.isHeader ? 'bg-indigo-500/10' : ''}`}>
          <span className={`text-xs ${row?.isHeader ? 'font-black text-white' : 'text-slate-400'}`}>{row?.label || '-'}</span>
          <span className={`text-xs font-mono ${row?.isHeader ? 'text-indigo-400 font-black' : 'text-slate-200'}`}>
            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(row?.value || 0)}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ data, industry, onIndustryChange, language, onReset }) => {
  const [activeView, setActiveView] = useState<'overview' | 'statements' | 'scenarios'>('overview');
  const [currentScore] = useState(data?.score || 0);
  
  const t = useMemo(() => i18n[language] || i18n[Language.EN], [language]);
  
  const formatINR = (val: number) => 
    new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR', 
      maximumFractionDigits: 0 
    }).format(val || 0);

  // Safe data access
  const metrics = data?.metrics || [];
  const scenarios = data?.scenarios || [];
  const statements = data?.statements || { pl: [], balanceSheet: [], cashFlow: [] };
  const forecast = data?.forecast || [];
  const radarData = data?.benchmarking?.radarData || [];
  const creditRisk = data?.creditRisk || { grade: 'N/A', debtServiceRatio: 0, borrowingCapacity: 0, liquidityRatio: 0 };

  return (
    <div className="space-y-10 animate-fadeIn pb-32">
      {/* Platform Navigation */}
      <div className="flex bg-[#0c0e16] p-2 rounded-3xl border border-white/5 w-fit">
        <button 
          onClick={() => setActiveView('overview')}
          className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'overview' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white'}`}
        >
          {t.overview}
        </button>
        <button 
          onClick={() => setActiveView('statements')}
          className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'statements' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white'}`}
        >
          <FileText size={14} className="inline mr-2" /> {t.statements}
        </button>
        <button 
          onClick={() => setActiveView('scenarios')}
          className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'scenarios' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white'}`}
        >
          <PlayCircle size={14} className="inline mr-2" /> {t.scenarios}
        </button>
      </div>

      {activeView === 'overview' && (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 p-8 bg-white/5 rounded-[3rem] border border-white/10 backdrop-blur-xl">
            <div className="flex items-center gap-6">
              <div className="flex items-center space-x-3 bg-emerald-500/10 px-6 py-3 rounded-2xl border border-emerald-500/20">
                <Award className="text-emerald-400 w-5 h-5 animate-pulse" />
                <span className="text-[11px] font-black text-emerald-400 uppercase tracking-widest">{t.investorCertified}</span>
              </div>
              <div className="flex items-center space-x-3 bg-indigo-500/10 px-6 py-3 rounded-2xl border border-indigo-500/20">
                <Filter size={16} className="text-indigo-400" />
                <select 
                  value={industry} 
                  onChange={(e) => onIndustryChange(e.target.value as IndustryType)} 
                  className="bg-transparent text-[11px] font-black uppercase text-slate-200 outline-none cursor-pointer"
                >
                  {Object.values(IndustryType).map(type => <option key={type} value={type} className="bg-[#0c0e16]">{type}</option>)}
                </select>
              </div>
            </div>
            <div className="flex space-x-4">
              <button onClick={onReset} className="flex items-center space-x-3 bg-white/5 text-slate-400 px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-white/10 transition-all border border-white/10">
                <RefreshCcw size={16} /> <span>{t.newScan}</span>
              </button>
              <button onClick={() => window.print()} className="flex items-center space-x-3 bg-indigo-600 text-white px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">
                <Printer size={16} /> <span>{t.exportAudit}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-1 space-y-10 min-w-0">
              <div className="bg-gradient-to-br from-[#1a1c2e] via-[#10121e] to-[#07090e] p-12 rounded-[4rem] border border-white/5 relative shadow-2xl group min-h-[400px]">
                <h4 className="text-[11px] font-black uppercase text-indigo-400 mb-10">{t.creditAuthority}</h4>
                <div className="flex items-center space-x-8 mb-12">
                  <span className="text-9xl font-black tracking-tighter bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(79,70,229,0.3)]">
                    {creditRisk.grade}
                  </span>
                  <div>
                    <span className="text-xs font-bold text-slate-400 block mb-1">{t.dscrStatus}</span>
                    <span className="text-xl font-black text-emerald-400 flex items-center">{(creditRisk.debtServiceRatio || 0).toFixed(2)}x</span>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                    <span className="text-[10px] font-black text-indigo-300 uppercase block mb-1">{t.borrowingCap}</span>
                    <span className="text-4xl font-black">{formatINR(creditRisk.borrowingCapacity)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                      <span className="text-[9px] font-black text-slate-500 uppercase block italic">Liquidity</span>
                      <span className="text-sm font-black text-white">{(creditRisk.liquidityRatio || 0).toFixed(2)}</span>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                      <span className="text-[9px] font-black text-slate-500 uppercase block italic">{t.health}</span>
                      <span className="text-sm font-black text-indigo-400">{currentScore}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 p-10 rounded-[4rem] border border-white/5">
                <h4 className="text-[11px] font-black uppercase text-slate-500 mb-8">{t.sectorRadar}</h4>
                <div className="h-64 relative w-full min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                      <PolarGrid stroke="#1e293b" />
                      <PolarAngleAxis dataKey="category" tick={{ fill: '#475569', fontSize: 10, fontWeight: 900 }} />
                      <Radar name="Biz" dataKey="business" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.6} />
                      <Radar name="Ind" dataKey="industry" stroke="#fff" fill="#fff" fillOpacity={0.1} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-10 min-w-0">
              <div className="bg-[#0c0e16] p-12 rounded-[4rem] border border-white/5 shadow-2xl overflow-hidden relative">
                <div className="flex justify-between items-center mb-12">
                  <div>
                    <h4 className="text-2xl font-black text-white flex items-center">
                      <TrendingUp className="w-8 h-8 mr-4 text-indigo-500" /> {t.forecastEngine}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 italic">{t.subHeader}</p>
                  </div>
                </div>
                <div className="h-72 relative w-full min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={forecast}>
                      <defs>
                        <linearGradient id="clrIn" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 10, fontWeight: 900 }} />
                      <Tooltip 
                        contentStyle={{backgroundColor: '#0c0e16', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.1)', color: '#fff'}}
                        itemStyle={{color: '#4f46e5'}}
                      />
                      <Area type="monotone" dataKey="inflow" stroke="#4f46e5" strokeWidth={5} fill="url(#clrIn)" />
                      <Area type="monotone" dataKey="outflow" stroke="#334155" strokeWidth={2} strokeDasharray="5 5" fill="transparent" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {metrics.map((m, idx) => (
                  <div key={idx} className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 group hover:bg-white/10 transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400"><BarChart3 size={18} /></div>
                      <span className={`text-[10px] font-black flex items-center px-2 py-1 rounded-md ${m?.status === 'positive' ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'}`}>
                        {(m?.change || 0) > 0 ? <ArrowUpRight size={12} className="mr-1" /> : <ArrowDownRight size={12} className="mr-1" />} {Math.abs(m?.change || 0)}%
                      </span>
                    </div>
                    <h5 className="text-[10px] font-black text-slate-500 uppercase mb-1">{m?.label || '-'}</h5>
                    <p className="text-2xl font-black text-white">{formatINR(m?.value || 0)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {activeView === 'statements' && (
        <div className="animate-fadeIn grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <StatementTable title={t.pl} rows={statements.pl} />
          <StatementTable title={t.bs} rows={statements.balanceSheet} />
          <StatementTable title={t.cf} rows={statements.cashFlow} />
        </div>
      )}

      {activeView === 'scenarios' && (
        <div className="animate-fadeIn space-y-12">
          <div className="max-w-3xl">
            <h3 className="text-4xl font-black text-white mb-4">{t.scenarios}</h3>
            <p className="text-slate-500 italic">{t.subHeader}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {scenarios.map((s, idx) => (
              <div key={idx} className="bg-[#0c0e16] p-10 rounded-[3rem] border border-white/5 relative group hover:border-indigo-500/40 transition-all">
                <div className={`absolute top-6 right-10 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${s?.riskLevel === 'High' ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                  {s?.riskLevel || 'Low'} {t.riskLevel}
                </div>
                <Scale className="text-indigo-400 mb-6" size={32} />
                <h4 className="text-2xl font-black text-white mb-2">{s?.label || '-'}</h4>
                <p className="text-xs text-slate-500 italic mb-8 leading-relaxed">{s?.description || '-'}</p>
                <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                   <span className="text-[10px] font-black text-slate-500 uppercase block mb-1">{t.impact}</span>
                   <span className={`text-xl font-black ${(s?.impactOnNetProfit || 0) < 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                     {formatINR(s?.impactOnNetProfit || 0)}
                   </span>
                </div>
                <button className="w-full mt-8 py-4 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">{t.runSimulation}</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default Dashboard;
