import React, { useState } from 'react';
import { Plus, Mail, Shield, Briefcase, Calendar, Lock, Pencil, Trash2 } from 'lucide-react';
import { Stakeholder, StakeholderRole, ShareClass, User } from '../types';

interface StakeholdersProps {
  user: User | null;
  stakeholders: Stakeholder[];
  totalIssuedShares: number;
  onAddStakeholder: (stakeholder: Omit<Stakeholder, 'id' | 'createdAt'>) => void;
  onUpdateStakeholder: (stakeholder: Stakeholder) => void;
  onDeleteStakeholder: (id: string) => void;
}

export const Stakeholders: React.FC<StakeholdersProps> = ({ 
  user,
  stakeholders, 
  totalIssuedShares,
  onAddStakeholder,
  onUpdateStakeholder,
  onDeleteStakeholder
}) => {
  const isFounder = user?.role === 'Founder';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStakeholder, setEditingStakeholder] = useState<Stakeholder | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Employee' as StakeholderRole,
    shareClass: 'Common' as ShareClass,
    sharesOwned: 0,
    startDate: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStakeholder) {
      onUpdateStakeholder({
        ...editingStakeholder,
        ...formData,
        sharesOwned: Number(formData.sharesOwned)
      });
    } else {
      onAddStakeholder({
        ...formData,
        companyId: stakeholders[0]?.companyId || 'company-1',
        sharesOwned: Number(formData.sharesOwned)
      });
    }
    closeModal();
  };

  const openModal = (stakeholder?: Stakeholder) => {
    if (stakeholder) {
      setEditingStakeholder(stakeholder);
      setFormData({
        name: stakeholder.name,
        email: stakeholder.email,
        role: stakeholder.role,
        shareClass: stakeholder.shareClass,
        sharesOwned: stakeholder.sharesOwned,
        startDate: new Date(stakeholder.startDate).toISOString().split('T')[0]
      });
    } else {
      setEditingStakeholder(null);
      setFormData({
        name: '',
        email: '',
        role: 'Employee',
        shareClass: 'Common',
        sharesOwned: 0,
        startDate: new Date().toISOString().split('T')[0]
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingStakeholder(null);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
      onDeleteStakeholder(id);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Stakeholders</h2>
          <p className="text-slate-500">Manage individuals and entities with equity.</p>
        </div>
        {isFounder ? (
          <button 
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-[#DB2777] transition-colors shadow-sm"
          >
            <Plus size={20} />
            Add Stakeholder
          </button>
        ) : (
          <div className="flex items-center gap-2 bg-slate-100 text-slate-400 px-4 py-2 rounded-lg cursor-not-allowed border border-border" title="Founder access required">
            <Lock size={16} />
            <span className="text-sm font-medium">Add Stakeholder</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stakeholders.map((s) => {
          const ownership = totalIssuedShares > 0 ? (s.sharesOwned / totalIssuedShares) * 100 : 0;
          return (
            <div key={s.id} className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group relative">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-pink-100 text-primary rounded-full flex items-center justify-center font-bold text-lg">
                  {s.name.charAt(0)}
                </div>
                <div className="flex items-center gap-2">
                  {isFounder && (
                    <div className="flex gap-1 mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => openModal(s)}
                        className="p-1.5 text-slate-400 hover:text-primary hover:bg-pink-50 rounded-lg transition-colors"
                        title="Edit Stakeholder"
                      >
                        <Pencil size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(s.id, s.name)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Stakeholder"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    s.role === 'Founder' ? 'bg-pink-200 text-pink-800' :
                    s.role === 'Investor' ? 'bg-pink-100 text-primary' :
                    'bg-white/50 text-slate-700 border border-border'
                  }`}>
                    {s.role}
                  </span>
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 mb-1">{s.name}</h3>
              <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
                <Mail size={14} />
                {s.email}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase mb-1">Shares</p>
                  <p className="font-bold text-slate-900">{s.sharesOwned.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase mb-1">Ownership</p>
                  <p className="font-bold text-slate-900">{ownership.toFixed(2)}%</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase mb-1">Class</p>
                  <p className="font-medium text-slate-700">{s.shareClass}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase mb-1">Since</p>
                  <p className="font-medium text-slate-700">{new Date(s.startDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-border shrink-0 bg-card">
              <h3 className="text-xl font-bold">{editingStakeholder ? 'Edit Stakeholder' : 'Add New Stakeholder'}</h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Full Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email Address</label>
                <input 
                  required
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Role</label>
                  <select 
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value as StakeholderRole})}
                    className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Founder">Founder</option>
                    <option value="Employee">Employee</option>
                    <option value="Investor">Investor</option>
                    <option value="Advisor">Advisor</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Share Class</label>
                  <select 
                    value={formData.shareClass}
                    onChange={(e) => setFormData({...formData, shareClass: e.target.value as ShareClass})}
                    className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Common">Common</option>
                    <option value="Preferred">Preferred</option>
                    <option value="Options">Options</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Shares Owned</label>
                  <input 
                    required
                    type="number" 
                    value={formData.sharesOwned}
                    onChange={(e) => setFormData({...formData, sharesOwned: Number(e.target.value)})}
                    className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary" 
                  />
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
              </div>
              
              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 bg-pink-50 border border-pink-100 rounded-lg font-medium text-pink-700 hover:bg-pink-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-[#DB2777] transition-colors shadow-sm"
                >
                  {editingStakeholder ? 'Update' : 'Save'} Stakeholder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
