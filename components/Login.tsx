
import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.ADMIN);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: email.split('@')[0].replace('.', ' '),
      role
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 overflow-hidden">
        <div className="bg-blue-600 p-8 text-center text-white">
          <div className="w-16 h-16 bg-white/10 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl font-bold border border-white/20">
            MV
          </div>
          <h2 className="text-2xl font-bold tracking-tight">MediVision</h2>
          <p className="text-blue-100 mt-1 text-sm font-medium">Medical Surveillance Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Email Address</label>
            <input 
              type="email" 
              className="w-full px-4 py-3 bg-slate-800 rounded-xl border border-slate-700 text-white outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-600"
              placeholder="doctor@clinic.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 bg-slate-800 rounded-xl border border-slate-700 text-white outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-600"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Prototype Role Switch</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.values(UserRole).map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`py-2 rounded-lg text-[10px] font-black uppercase tracking-wider border transition-all ${
                    role === r 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20' 
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98]"
          >
            Sign In to Dashboard
          </button>

          <p className="text-center text-[10px] text-slate-600 font-bold uppercase tracking-widest">
            Secure Encrypted Access
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;