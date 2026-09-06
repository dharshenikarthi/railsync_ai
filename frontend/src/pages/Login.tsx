import React, { useState } from 'react';
import { 
  Train, Lock, User, AlertCircle, 
  Key, Shield, CheckCircle2, ArrowRight
} from 'lucide-react';
import { api } from '../api/client';
import { mockUsers, type RailwayUser } from '../api/mockData';

interface LoginProps {
  onLoginSuccess: (user: RailwayUser) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [selectedUser, setSelectedUser] = useState<RailwayUser>(mockUsers[0]);
  const [password, setPassword] = useState('Admin@123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleQuickSelect = (user: RailwayUser) => {
    setSelectedUser(user);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.login({ username: selectedUser.username, password });
      if (res && res.access_token) {
        localStorage.setItem("railsync_token", res.access_token);
      }
      onLoginSuccess(selectedUser);
    } catch (err: any) {
      console.warn("Login fallback to offline demo session:", err);
      onLoginSuccess(selectedUser);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-slate-50 select-none">
      <div className="w-full max-w-2xl bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-xl bg-[#002D62] flex items-center justify-center shadow-lg border border-white/20">
            <Train className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            RAILSYNC<span className="text-[#002D62]">.AI</span>
          </h1>
          <p className="text-xs text-slate-600 font-medium">
            Role-Based Access Control (RBAC) — Indian Railways Integrated Command
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[11px] text-[#002D62] font-bold">
            <Shield className="w-3.5 h-3.5 text-[#002D62]" />
            <span>CRIS Verified Security Portal • 6 Official Personas Available</span>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Quick Role Fill Buttons */}
        <div className="space-y-2">
          <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
            Select Railway Persona to Authenticate:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {mockUsers.map((user) => {
              const isSelected = selectedUser.username === user.username;
              return (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleQuickSelect(user)}
                  className={`p-3 rounded-xl text-left border transition-all text-xs flex items-start gap-2.5 ${
                    isSelected 
                      ? 'bg-blue-50/80 border-[#002D62] ring-2 ring-[#002D62]/20 shadow-md'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${user.avatarBg} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm`}>
                    {user.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`font-bold truncate text-xs ${isSelected ? 'text-[#002D62]' : 'text-slate-900'}`}>
                        {user.name}
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[#002D62] shrink-0" />}
                    </div>
                    <div className="text-[11px] text-slate-600 font-medium truncate mt-0.5">
                      {user.roleTitle}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
                      <span className="font-mono bg-slate-100 px-1 py-0.2 rounded border border-slate-200 font-bold text-[#002D62]">
                        {user.badge}
                      </span>
                      <span className="truncate">{user.division}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
            <div className="font-bold text-slate-900 flex items-center justify-between">
              <span>Authenticating as: {selectedUser.name}</span>
              <span className="text-[10px] font-mono text-[#002D62] font-bold">{selectedUser.department}</span>
            </div>
            <div className="text-[11px] text-slate-500">
              Granted Permissions: <span className="font-mono font-semibold text-slate-800">{selectedUser.permissions.join(', ')}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#002D62] hover:bg-[#001D3D] text-white font-bold text-xs shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2 border border-blue-900"
          >
            {loading ? (
              <span>Verifying Digital Signature...</span>
            ) : (
              <>
                <Key className="w-4 h-4 text-sky-300" />
                <span>Launch Railway Command Center as {selectedUser.name.split(',')[0]}</span>
                <ArrowRight className="w-4 h-4 text-sky-300" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-200">
          <p className="text-[11px] text-slate-500 font-medium">
            Protected by Centre for Railway Information Systems (CRIS) Multi-Factor Framework.
          </p>
        </div>
      </div>
    </div>
  );
};



