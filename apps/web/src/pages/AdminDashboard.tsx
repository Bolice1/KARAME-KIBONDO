import { Users, AlertCircle, RefreshCw, BarChart2, CheckCircle2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', attendance: 850 },
  { name: 'Tue', attendance: 900 },
  { name: 'Wed', attendance: 880 },
  { name: 'Thu', attendance: 910 },
  { name: 'Fri', attendance: 870 },
];

export default function AdminDashboard() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto px-4 lg:px-0">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-2">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">National Overview</h2>
          <p className="text-sm text-neutral-500 mt-1">Real-time attendance and alerts across all centers</p>
        </div>
        <div className="flex gap-2">
           <button className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-xl hover:bg-neutral-50 shadow-sm text-sm font-medium transition-colors">
            <RefreshCw size={14} />
            Sync All
           </button>
           <button className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 shadow-soft text-sm font-medium transition-colors">
            <BarChart2 size={16} />
            Export Report
           </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-soft border border-neutral-100 flex items-start gap-4">
          <div className="p-3 bg-primary-50 text-primary-600 rounded-xl"><Users size={24}/></div>
          <div>
            <p className="text-sm font-semibold text-neutral-500 uppercase tracking-wide">Total Children</p>
            <h3 className="text-3xl font-bold text-neutral-900 mt-1">1,245</h3>
            <p className="text-xs font-medium text-success mt-1 inline-flex items-center gap-1">+12% vs last month</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-soft border border-neutral-100 flex items-start gap-4">
          <div className="p-3 bg-warning-50 text-warning-600 rounded-xl"><AlertCircle size={24}/></div>
           <div>
            <p className="text-sm font-semibold text-neutral-500 uppercase tracking-wide">Critical Alerts</p>
            <h3 className="text-3xl font-bold text-neutral-900 mt-1">24</h3>
            <p className="text-xs font-medium text-danger mt-1 inline-flex items-center gap-1">Action required in 3 centers</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-soft border border-neutral-100 flex items-start gap-4">
          <div className="p-3 bg-success/10 text-success rounded-xl"><CheckCircle2 size={24}/></div>
           <div>
            <p className="text-sm font-semibold text-neutral-500 uppercase tracking-wide">Nutrition Compliance</p>
            <h3 className="text-3xl font-bold text-neutral-900 mt-1">94%</h3>
            <p className="text-xs font-medium text-neutral-500 mt-1 inline-flex items-center gap-1">Across 42 active centers</p>
          </div>
        </div>
      </div>

      {/* Charts & Table Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-soft border border-neutral-100 flex flex-col">
          <h3 className="font-semibold text-neutral-800 mb-6">Attendance Trends (This Week)</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.1)'}}
                  itemStyle={{color: '#1d4ed8', fontWeight: 600}}
                />
                <Area type="monotone" dataKey="attendance" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorAtt)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rule-based Alerts System Component */}
        <div className="bg-white p-6 rounded-2xl shadow-soft border border-neutral-100">
           <div className="flex justify-between items-center mb-6">
             <h3 className="font-semibold text-neutral-800">System Alerts</h3>
             <span className="bg-danger/10 text-danger text-xs font-bold px-2 py-0.5 rounded-full">3 New</span>
           </div>
           
           <div className="flex flex-col gap-4">
             <div className="p-3 bg-danger/5 border border-danger/20 rounded-xl relative overflow-hidden">
               <div className="absolute left-0 top-0 bottom-0 w-1 bg-danger"></div>
               <p className="text-xs font-semibold text-danger uppercase tracking-wide">High Absence Rate</p>
               <h4 className="font-medium text-sm text-neutral-900 mt-1">Rubavu Center B</h4>
               <p className="text-xs text-neutral-600 mt-0.5">Absenteeism &gt; 15% for 3 consecutive days. Immediate review required.</p>
             </div>
             
             <div className="p-3 bg-warning/5 border border-warning/20 rounded-xl relative overflow-hidden">
               <div className="absolute left-0 top-0 bottom-0 w-1 bg-warning"></div>
               <p className="text-xs font-semibold text-warning-700 uppercase tracking-wide">Missing Nutrition Log</p>
               <h4 className="font-medium text-sm text-neutral-900 mt-1">Kigali ECD - Class 2</h4>
               <p className="text-xs text-neutral-600 mt-0.5">No lunch records submitted by 14:00 PM today.</p>
             </div>
             
             <button className="text-sm font-medium text-primary-600 hover:text-primary-700 w-full text-center py-2 mt-2">
               View All Alerts &rarr;
             </button>
           </div>
        </div>
      </div>
    </div>
  );
}
