import React, { useState } from 'react';
import { Plus, TrendingUp, DollarSign, Calendar, Lock } from 'lucide-react';
import { FundingRound, Company, User } from '../types';

interface FundingRoundsProps {
  user: User | null;
  company: Company | null;
  fundingRounds: FundingRound[];
  onAddFundingRound: (round: Omit<FundingRound, 'id' | 'createdAt' | 'postMoneyValuation'>) => void;
}

export const FundingRounds: React.FC<FundingRoundsProps> = ({ 
  user,
  company, 
  fundingRounds, 
  onAddFundingRound 
}) => {
  const isFounder = user?.role === 'Founder';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    roundName: '',
    preMoneyValuation: 0,
    investmentAmount: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddFundingRound({
      ...formData,
      companyId: company?.id || 'company-1',
    });
    setIsModalOpen(false);
    setFormData({
      roundName: '',
      preMoneyValuation: 0,
      investmentAmount: 0,
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Funding Rounds</h2>
          <p className="text-slate-500">Track investments and company valuations.</p>
        </div>
        {isFounder ? (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-[#DB2777] transition-colors shadow-sm"
          >
            <Plus size={20} />
            Add Funding Round
          </button>
        ) : (
          <div className="flex items-center gap-2 bg-white text-slate-400 px-4 py-2 rounded-lg cursor-not-allowed border border-border" title="Founder access required">
            <Lock size={16} />
            <span className="text-sm font-medium">Add Funding Round</span>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {fundingRounds.length === 0 ? (
          <div className="bg-card border-2 border-dashed border-border rounded-2xl p-12 text-center">
            <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mx-auto mb-4 border border-border">
              <TrendingUp className="text-primary/50" size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No funding rounds yet</h3>
            <p className="text-slate-500 max-w-sm mx-auto mt-2">
              Start by adding your company's initial seed round or latest investment.
            </p>
          </div>
        ) : (
          fundingRounds.map((round) => (
            <div key={round.id} className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <div className="flex flex-wrap gap-8 items-center">
                <div className="flex-1 min-w-[200px]">
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{round.roundName}</h3>
                  <p className="text-sm text-slate-500 flex items-center gap-2">
                    <Calendar size={14} />
                    {new Date(round.createdAt).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex gap-8">
                  <div>
                    <p className="text-xs text-slate-400 font-medium uppercase mb-1">Pre-money</p>
                    <p className="font-bold text-slate-900">${(round.preMoneyValuation / 1000000).toFixed(2)}M</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium uppercase mb-1">Investment</p>
                    <p className="font-bold text-primary">${(round.investmentAmount / 1000000).toFixed(2)}M</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium uppercase mb-1">Post-money</p>
                    <p className="font-bold text-emerald-600">${(round.postMoneyValuation / 1000000).toFixed(2)}M</p>
                  </div>
                </div>
                
                <div className="ml-auto">
                  <div className="px-4 py-2 bg-background border border-border rounded-lg font-medium text-slate-700">
                    {((round.investmentAmount / round.postMoneyValuation) * 100).toFixed(1)}% Dilution
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-border shrink-0 bg-card">
              <h3 className="text-xl font-bold">New Funding Round</h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Round Name (e.g., Seed, Series A)</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g., Seed Round"
                  value={formData.roundName}
                  onChange={(e) => setFormData({...formData, roundName: e.target.value})}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Pre-money Valuation ($)</label>
                <input 
                  required
                  type="number" 
                  value={formData.preMoneyValuation}
                  onChange={(e) => setFormData({...formData, preMoneyValuation: Number(e.target.value)})}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Investment Amount ($)</label>
                <input 
                  required
                  type="number" 
                  value={formData.investmentAmount}
                  onChange={(e) => setFormData({...formData, investmentAmount: Number(e.target.value)})}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none" 
                />
              </div>
              
              <div className="p-4 bg-pink-50 rounded-xl border border-pink-100 mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-500">Post-money Valuation</span>
                  <span className="font-bold text-slate-900">${((formData.preMoneyValuation + formData.investmentAmount) / 1000000).toFixed(2)}M</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Investor Ownership</span>
                  <span className="font-bold text-primary">
                    {formData.preMoneyValuation + formData.investmentAmount > 0 
                      ? ((formData.investmentAmount / (formData.preMoneyValuation + formData.investmentAmount)) * 100).toFixed(1) 
                      : 0}%
                  </span>
                </div>
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
                  Create Round
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
