import { Calendar, UserCheck, Utensils, Award } from 'lucide-react';


export default function ParentDashboard() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-lg mx-auto pb-10">
      <div className="flex flex-col items-center pt-4">
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-4 border-white shadow-soft overflow-hidden mb-3">
             <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=Kwitonda`} alt="Kwitonda" />
          </div>
          <div className="absolute top-0 right-0 h-6 w-6 bg-success rounded-full border-2 border-white flex items-center justify-center">
            <UserCheck size={12} className="text-white"/>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-neutral-900">Kwitonda L.</h2>
        <p className="text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full mt-1">
          Kigali ECD Center
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-soft border border-neutral-100 flex flex-col gap-2">
          <div className="text-neutral-400"><Calendar size={20}/></div>
          <span className="text-2xl font-bold text-neutral-800">14/15</span>
          <span className="text-xs text-neutral-500 font-medium uppercase tracking-wider">Days Attended</span>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-soft border border-neutral-100 flex flex-col gap-2">
          <div className="text-warning"><Award size={20}/></div>
          <span className="text-2xl font-bold text-neutral-800 leading-tight">Good</span>
          <span className="text-xs text-neutral-500 font-medium uppercase tracking-wider">Learning Trend</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-soft border border-neutral-100 mt-2">
        <h3 className="font-semibold text-neutral-800 mb-4 border-b border-neutral-100 pb-3">Today's Summary</h3>
        
        <div className="flex flex-col gap-6 relative border-l-2 border-primary-100 ml-3 pl-6">
          <div className="relative">
            <div className="absolute -left-[35px] top-1 h-4 w-4 rounded-full bg-success border-[3px] border-white ring-1 ring-success flex items-center justify-center"></div>
            <p className="text-sm font-medium text-neutral-900">Arrived at Center</p>
            <p className="text-xs text-neutral-500 mt-0.5">08:00 AM • Checked in by Tr. Umutoni</p>
          </div>
          
          <div className="relative">
             <div className="absolute -left-[35px] top-1 h-4 w-4 rounded-full bg-warning border-[3px] border-white ring-1 ring-warning shadow-sm"></div>
            <p className="text-sm font-medium text-neutral-900">Nutrition Logged</p>
            <p className="text-xs text-neutral-500 mt-0.5">12:30 PM • Received standard lunch (Porridge & Fruits)</p>
            
            <div className="mt-3 flex gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-warning/10 text-warning-700 text-xs font-semibold rounded-lg"><Utensils size={12}/> Complete Meal</span>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -left-[35px] top-1 h-4 w-4 rounded-full bg-primary-400 border-[3px] border-white ring-1 ring-primary-300 shadow-sm"></div>
            <p className="text-sm font-medium text-neutral-900">Learning Activity</p>
            <p className="text-xs text-neutral-500 mt-0.5">14:00 PM • Participated in group blocks building.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
