import React, { useState } from 'react';
import { Settings as SettingsIcon, Shield, Building2, Bell, Lock } from 'lucide-react';
import { Company, User } from '../types';

interface SettingsProps {
  user: User | null;
  company: Company | null;
  onUpdateCompany: (company: Company) => void;
}

export const Settings: React.FC<SettingsProps> = ({ user, company, onUpdateCompany }) => {
  const isFounder = user?.role === 'Founder';
  const [formData, setFormData] = useState({
    name: company?.name || '',
    authorizedShares: company?.authorizedShares || 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFounder) return;
    if (company) {
      onUpdateCompany({
        ...company,
        ...formData
      });
      alert('Settings updated successfully!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
        <p className="text-slate-500">Manage your company profile and application preferences.</p>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex items-center gap-3 bg-white/50">
          <Building2 className="text-primary" />
          <h3 className="font-bold text-slate-900">Company Information</h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Company Name</label>
              <input 
                type="text" 
                disabled={!isFounder}
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className={`w-full px-4 py-2 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary bg-white ${!isFounder ? 'bg-slate-50 cursor-not-allowed text-slate-400' : ''}`} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Authorized Shares</label>
              <input 
                type="number" 
                disabled={!isFounder}
                value={formData.authorizedShares}
                onChange={(e) => setFormData({...formData, authorizedShares: Number(e.target.value)})}
                className={`w-full px-4 py-2 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary bg-white ${!isFounder ? 'bg-slate-50 cursor-not-allowed text-slate-400' : ''}`} 
              />
              <p className="text-xs text-slate-400">Total number of shares the company is legally allowed to issue.</p>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            {isFounder ? (
              <button 
                type="submit"
                className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-[#DB2777] transition-colors shadow-sm"
              >
                Save Changes
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-white text-slate-400 px-6 py-2 rounded-lg cursor-not-allowed border border-border">
                <Lock size={16} />
                <span className="font-bold">Save Changes</span>
              </div>
            )}
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="text-emerald-600" />
            <h3 className="font-bold text-slate-900">Security</h3>
          </div>
          <div className="flex justify-between items-center p-3 bg-background border border-border/50 rounded-lg">
            <span className="text-sm text-slate-600">Two-Factor Authentication</span>
            <button className="text-primary font-bold text-sm hover:text-[#DB2777]">Enable</button>
          </div>
          <div className="flex justify-between items-center p-3 bg-background border border-border/50 rounded-lg">
            <span className="text-sm text-slate-600">Audit Logs</span>
            <button className="text-primary font-bold text-sm hover:text-[#DB2777]">View</button>
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <Bell className="text-amber-600" />
            <h3 className="font-bold text-slate-900">Notifications</h3>
          </div>
          <div className="flex justify-between items-center p-3 bg-background border border-border/50 rounded-lg">
            <span className="text-sm text-slate-600">Email Alerts</span>
            <div className="w-10 h-5 bg-primary rounded-full relative">
              <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
            </div>
          </div>
          <div className="flex justify-between items-center p-3 bg-background border border-border/50 rounded-lg">
            <span className="text-sm text-slate-600">Vesting Milestones</span>
            <div className="w-10 h-5 bg-primary rounded-full relative">
              <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
