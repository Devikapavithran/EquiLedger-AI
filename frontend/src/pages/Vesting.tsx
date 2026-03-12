import React, { useState } from 'react';
import { Plus, Clock, CheckCircle2, AlertCircle, Lock } from 'lucide-react';
import { VestingSchedule, Stakeholder, User } from '../types';

interface VestingProps {
  user: User | null;
  stakeholders: Stakeholder[];
  vestingSchedules: VestingSchedule[];
  onAddVestingSchedule: (schedule: Omit<VestingSchedule, 'id'>) => void;
}

export const Vesting: React.FC<VestingProps> = ({ 
  user,
  stakeholders, 
  vestingSchedules, 
  onAddVestingSchedule 
}) => {
  const isFounder = user?.role === 'Founder';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    stakeholderId: stakeholders[0]?.id || '',
    totalOptions: 0,
    cliffMonths: 12,
    vestingMonths: 48,
    startDate: new Date().toISOString().split('T')[0]
  });

  const calculateVesting = (schedule: VestingSchedule) => {
    const start = new Date(schedule.startDate);
    const now = new Date();
    const monthsDiff = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
    
    if (monthsDiff < schedule.cliffMonths) return 0;
    if (monthsDiff >= schedule.vestingMonths) return schedule.totalOptions;
    
    return Math.floor((schedule.totalOptions / schedule.vestingMonths) * monthsDiff);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddVestingSchedule(formData);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Vesting</h2>
          <p className="text-slate-500">Equity release schedules and progress.</p>
        </div>
        {isFounder ? (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-[#DB2777] transition-colors shadow-sm"
          >
            <Plus size={20} />
            Add Vesting Schedule
          </button>
        ) : (
          <div className="flex items-center gap-2 bg-white text-slate-400 px-4 py-2 rounded-lg cursor-not-allowed border border-border" title="Founder access required">
            <Lock size={16} />
            <span className="text-sm font-medium">Add Vesting Schedule</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {vestingSchedules.length === 0 ? (
          <div className="bg-card border-2 border-dashed border-border rounded-2xl p-12 text-center">
            <Clock className="text-primary/30 mx-auto mb-4" size={48} />
            <h3 className="text-lg font-bold text-slate-900">No vesting schedules</h3>
            <p className="text-slate-500 mt-2">Add a schedule to track employee or founder equity vesting.</p>
          </div>
        ) : (
          vestingSchedules.map((schedule) => {
            const stakeholder = stakeholders.find(s => s.id === schedule.stakeholderId);
            const vested = calculateVesting(schedule);
            const percent = (vested / schedule.totalOptions) * 100;
            
            return (
              <div key={schedule.id} className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{stakeholder?.name || 'Unknown'}</h3>
                    <p className="text-sm text-slate-500">Started on {new Date(schedule.startDate).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-400 uppercase">Total Grant</p>
                    <p className="text-xl font-bold text-slate-900">{schedule.totalOptions.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-slate-600">Vesting Progress ({percent.toFixed(1)}%)</span>
                    <span className="text-primary">{vested.toLocaleString()} / {schedule.totalOptions.toLocaleString()} vested</span>
                  </div>
                  <div className="w-full h-3 bg-white border border-border rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-500" 
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 pt-4 text-center">
                    <div className="p-3 bg-background rounded-lg border border-border/50">
                      <p className="text-xs text-slate-400 uppercase mb-1">Cliff</p>
                      <p className="font-bold text-slate-700">{schedule.cliffMonths} Months</p>
                    </div>
                    <div className="p-3 bg-background rounded-lg border border-border/50">
                      <p className="text-xs text-slate-400 uppercase mb-1">Term</p>
                      <p className="font-bold text-slate-700">{schedule.vestingMonths} Months</p>
                    </div>
                    <div className="p-3 bg-background rounded-lg border border-border/50">
                      <p className="text-xs text-slate-400 uppercase mb-1">Status</p>
                      <p className="font-bold text-emerald-600">
                        {percent === 100 ? 'Fully Vested' : 'Active'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-border shrink-0 bg-card">
              <h3 className="text-xl font-bold">Add Vesting Schedule</h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Stakeholder</label>
                <select 
                  required
                  value={formData.stakeholderId}
                  onChange={(e) => setFormData({...formData, stakeholderId: e.target.value})}
                  className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="" disabled>Select a stakeholder</option>
                  {stakeholders.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Total Options/Shares</label>
                <input 
                  required
                  type="number" 
                  value={formData.totalOptions}
                  onChange={(e) => setFormData({...formData, totalOptions: Number(e.target.value)})}
                  className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Cliff (Months)</label>
                  <input 
                    required
                    type="number" 
                    value={formData.cliffMonths}
                    onChange={(e) => setFormData({...formData, cliffMonths: Number(e.target.value)})}
                    className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Total Term (Months)</label>
                  <input 
                    required
                    type="number" 
                    value={formData.vestingMonths}
                    onChange={(e) => setFormData({...formData, vestingMonths: Number(e.target.value)})}
                    className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Start Date</label>
                <input 
                  required
                  type="date" 
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary" 
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 bg-pink-50 border border-pink-100 rounded-lg font-medium text-pink-700 hover:bg-pink-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-[#DB2777] transition-colors shadow-sm"
                >
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
