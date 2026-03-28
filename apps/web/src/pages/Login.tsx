import { useState } from 'react';
import { LogIn, BookOpen } from 'lucide-react';


export default function Login({ onLogin }: { onLogin: (role: 'teacher' | 'parent' | 'admin') => void }) {
  const [phone, setPhone] = useState('');
  
  // Mock login handling
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.includes('admin')) onLogin('admin');
    else if (phone.includes('parent')) onLogin('parent');
    else onLogin('teacher');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="glass max-w-sm w-full p-8 rounded-2xl flex flex-col items-center gap-6">
        <div className="h-16 w-16 bg-primary-100 rounded-full flex justify-center items-center text-primary-600 mb-2">
          <BookOpen strokeWidth={1.5} size={32} />
        </div>
        
        <div className="text-center w-full">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-700 bg-clip-text text-transparent">Welcome back</h2>
          <p className="text-neutral-500 text-sm mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">Phone Number / Email</label>
            <input 
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 078... (type 'admin'/'parent')"
              className="px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm w-full"
            />
          </div>

          <button type="submit" className="w-full mt-2 bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-soft">
            <span>Continue</span>
            <LogIn size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
