import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useState } from 'react';
import TeacherDashboard from './pages/TeacherDashboard';
import ParentDashboard from './pages/ParentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import KnowledgeNetwork from './pages/KnowledgeNetwork';

function App() {
  const [role, setRole] = useState<'teacher' | 'parent' | 'admin' | null>(null);

  // Simple mock layout just for demo navigation
  return (
    <Router>
      <div className="min-h-screen max-w-7xl mx-auto flex flex-col pt-4 px-4 pb-20 md:pb-4 relative">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
              KARAME KIBONDO
            </h1>
          </div>
          <div className="flex gap-2 text-sm bg-white p-1 rounded-full shadow-sm">
            <button onClick={() => setRole('teacher')} className={`px-3 py-1 rounded-full transition-colors ${role === 'teacher' ? 'bg-primary-500 text-white' : 'hover:bg-neutral-100'}`}>Teacher</button>
            <button onClick={() => setRole('parent')} className={`px-3 py-1 rounded-full transition-colors ${role === 'parent' ? 'bg-primary-500 text-white' : 'hover:bg-neutral-100'}`}>Parent</button>
            <button onClick={() => setRole('admin')} className={`px-3 py-1 rounded-full transition-colors ${role === 'admin' ? 'bg-primary-500 text-white' : 'hover:bg-neutral-100'}`}>Admin</button>
            <Link to="/network" className="px-3 py-1 rounded-full hover:bg-primary-50 text-primary-600 font-medium transition-colors">Network</Link>
            <button onClick={() => setRole(null)} className={`px-3 py-1 rounded-full transition-colors ${role === null ? 'bg-neutral-200' : 'hover:bg-neutral-100'}`}>Logout</button>
          </div>
        </header>
        
        <main className="flex-1 w-full max-w-full">
          {!role ? (
            <Login onLogin={setRole} />
          ) : (
            <Routes>
              {role === 'teacher' && <Route path="/*" element={<TeacherDashboard />} />}
              {role === 'parent' && <Route path="/*" element={<ParentDashboard />} />}
              {role === 'admin' && <Route path="/*" element={<AdminDashboard />} />}
              <Route path="/network" element={<KnowledgeNetwork />} />
              <Route path="/" element={<Navigate to={role === 'admin' ? '/admin' : role === 'teacher' ? '/teacher' : '/parent'} replace />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          )}
        </main>
      </div>
    </Router>
  );
}

export default App;
