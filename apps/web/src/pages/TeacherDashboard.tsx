import { useState, useEffect } from 'react';
import { syncEngine } from '../lib/syncEngine';
import { Apple, Wifi, WifiOff, Search, CheckCircle2, BookOpen } from 'lucide-react';
import { cn } from '../lib/utils';

// Mocks
const CHILDREN = [
  { id: 1, name: 'Kwitonda L.', age: '4 yrs', attendance: 'present' },
  { id: 2, name: 'Mugisha P.', age: '5 yrs', attendance: 'present' },
  { id: 3, name: 'Keza M.', age: '3 yrs', attendance: 'absent' },
  { id: 4, name: 'Hirwa J.', age: '4 yrs', attendance: null },
];

export default function TeacherDashboard() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState({ pending: 0, synced: 0 });
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const updateSync = async () => {
      const stats = await syncEngine.getStats();
      setSyncStatus({ pending: stats.pendingCount, synced: stats.syncedCount });
    };
    const interval = setInterval(async () => {
      if (isOnline) {
        await syncEngine.mockSyncNext(); // Mock bg sync
      }
      updateSync();
    }, 3000);
    
    updateSync();
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    }
  }, [isOnline]);

  const markAttendance = async (childId: number, status: 'present' | 'absent') => {
    // Optimistic / local queue
    await syncEngine.addOperation({
      type: 'ATTENDANCE',
      payload: { childId, status }
    });
    const stats = await syncEngine.getStats();
    setSyncStatus({ pending: stats.pendingCount, synced: stats.syncedCount });
  };

  const markNutrition = async () => {
    await syncEngine.addOperation({
      type: 'NUTRITION',
      payload: { centerId: 1, type: 'Lunch', count: 14 }
    });
    const stats = await syncEngine.getStats();
    setSyncStatus({ pending: stats.pendingCount, synced: stats.syncedCount });
    alert("Nutrition log queued for sync!");
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-lg mx-auto">
      {/* Network / Profile Header */}
      <div className="bg-white p-4 rounded-2xl shadow-soft flex items-center justify-between border border-neutral-100">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-gradient-to-tr from-primary-500 to-primary-300 rounded-full flex items-center justify-center text-white font-bold">UM</div>
          <div>
            <h2 className="font-semibold text-neutral-800 leading-tight">Umutoni M.</h2>
            <p className="text-xs text-neutral-500">Kigali ECD Center</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className={cn("px-2 py-1 rounded-full flex items-center gap-1.5 text-xs font-medium border", isOnline ? "bg-success/10 text-success border-success/20" : "bg-warning/10 text-warning border-warning/20")}>
            {isOnline ? <Wifi size={12}/> : <WifiOff size={12}/>}
            {isOnline ? 'Online' : 'Offline'}
          </div>
          {syncStatus.pending > 0 && (
            <span className="text-[10px] text-neutral-400 font-medium">
              {syncStatus.pending} pending sync
            </span>
          )}
        </div>
      </div>

      {/* Main Actions Grid */}
      <div className="grid grid-cols-2 gap-4">
        <button onClick={markNutrition} className="glass aspect-square p-5 rounded-2xl flex flex-col items-center justify-center gap-3 hover:bg-white transition-colors border border-neutral-100">
          <div className="h-12 w-12 rounded-full bg-warning/10 text-warning flex items-center justify-center">
            <Apple strokeWidth={2} />
          </div>
          <span className="font-medium text-sm text-neutral-800">Log Nutrition</span>
        </button>
        <div className="glass aspect-square p-5 rounded-2xl flex flex-col items-center justify-center gap-3 hover:bg-white transition-colors border border-neutral-100">
          <div className="h-12 w-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
            <BookOpen strokeWidth={2} />
          </div>
          <span className="font-medium text-sm text-neutral-800">Log Learning</span>
        </div>
      </div>

      {/* Roster List */}
      <div className="bg-white rounded-2xl p-4 shadow-soft mt-2 border border-neutral-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-neutral-800">Today's Class</h3>
          <span className="text-xs bg-neutral-100 px-2.5 py-1 rounded-full font-medium text-neutral-600">
            2/15 Present
          </span>
        </div>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-2.5 text-neutral-400" size={16} />
          <input placeholder="Search child..." className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-primary-400" />
        </div>

        <div className="flex flex-col gap-3">
          {CHILDREN.map((child) => (
             <div key={child.id} className="flex items-center justify-between p-3 border border-neutral-100 rounded-xl hover:bg-neutral-50 transition-colors">
               <div className="flex items-center gap-3">
                 <div className="h-10 w-10 bg-neutral-200 rounded-full shrink-0 overflow-hidden">
                   <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${child.name}`} alt="avatar" />
                 </div>
                 <div>
                   <p className="font-medium text-sm text-neutral-900">{child.name}</p>
                   <p className="text-xs text-neutral-500">{child.age}</p>
                 </div>
               </div>
               
               <div className="flex gap-2">
                 <button onClick={() => markAttendance(child.id, 'present')} className={cn("p-2 rounded-lg border transition-all", child.attendance === 'present' ? 'bg-success text-white border-success' : 'text-neutral-400 border-neutral-200 hover:bg-neutral-100')}>
                   <CheckCircle2 size={18} />
                 </button>
                 <button onClick={() => markAttendance(child.id, 'absent')} className={cn("p-2 rounded-lg border transition-all text-xs font-semibold uppercase flex items-center justify-center w-9", child.attendance === 'absent' ? 'bg-danger text-white border-danger' : 'text-neutral-400 border-neutral-200 hover:bg-neutral-100')}>
                   A
                 </button>
               </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}
