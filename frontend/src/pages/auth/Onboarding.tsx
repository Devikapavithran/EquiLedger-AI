import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { dataService } from '../../services/dataService';
import { LayoutDashboard, Building2, Users, ArrowRight, Check } from 'lucide-react';

export const Onboarding: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Step 1: Company
  const [companyName, setCompanyName] = useState('');
  const [authorizedShares, setAuthorizedShares] = useState('10000000');

  // Step 2: Founders
  const [founders, setFounders] = useState([
    { name: '', email: '', shares: '4000000' }
  ]);

  const handleAddFounder = () => {
    setFounders([...founders, { name: '', email: '', shares: '0' }]);
  };

  const handleFounderChange = (index: number, field: string, value: string) => {
    const newFounders = [...founders];
    newFounders[index] = { ...newFounders[index], [field]: value };
    setFounders(newFounders);
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      // 1. Create company
      const company = dataService.updateCompany({
        id: crypto.randomUUID(),
        name: companyName,
        authorizedShares: parseInt(authorizedShares),
        createdAt: new Date().toISOString(),
      } as any);

      // 2. Add founders as stakeholders
      for (const founder of founders) {
        if (founder.name && founder.email) {
          dataService.addStakeholder({
            companyId: company?.id || 'default',
            name: founder.name,
            email: founder.email,
            role: 'Founder',
            shareClass: 'Common',
            sharesOwned: parseInt(founder.shares),
            startDate: new Date().toISOString(),
          });
        }
      }

      // 3. Update user onboarding status
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        authService.updateUser({
          ...currentUser,
          onboardingCompleted: true,
          companyId: company?.id
        });
      }

      navigate('/');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <div className="max-w-2xl w-full">
        <div className="mb-12 text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <div className="bg-primary p-2 rounded-lg text-white">
              <LayoutDashboard className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">EquiLedger AI</h1>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Let's set up your workspace</h2>
          
          <div className="mt-8 flex justify-center items-center gap-4">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-slate-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 ${step >= 1 ? 'border-primary bg-pink-50' : 'border-slate-300'}`}>
                {step > 1 ? <Check className="w-5 h-5" /> : '1'}
              </div>
              <span className="font-semibold">Company</span>
            </div>
            <div className="w-12 h-0.5 bg-border"></div>
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-slate-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 ${step >= 2 ? 'border-primary bg-pink-50' : 'border-slate-300'}`}>
                {step > 2 ? <Check className="w-5 h-5" /> : '2'}
              </div>
              <span className="font-semibold">Founders</span>
            </div>
          </div>
        </div>

        <div className="bg-card p-8 rounded-2xl shadow-xl border border-border">
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-pink-100 p-2 rounded-lg text-primary">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Company Details</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Company Name</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    placeholder="e.g. Acme Corp"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Authorized Shares</label>
                  <input
                    type="number"
                    required
                    value={authorizedShares}
                    onChange={(e) => setAuthorizedShares(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    placeholder="10,000,000"
                  />
                  <p className="mt-2 text-xs text-slate-500 italic">Total number of shares the company is legally allowed to issue.</p>
                </div>
              </div>

              <button
                onClick={() => companyName && setStep(2)}
                className="w-full py-4 bg-primary hover:bg-[#DB2777] text-white font-bold rounded-xl transition-all shadow-lg shadow-pink-100 flex justify-center items-center gap-2"
              >
                Continue
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-pink-100 p-2 rounded-lg text-primary">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Initial Stakeholders</h3>
              </div>

              <p className="text-slate-500 text-sm">Add the founders who will own the initial equity.</p>

              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {founders.map((founder, index) => (
                  <div key={index} className="p-4 bg-white/50 border border-border rounded-xl space-y-3 relative">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Name</label>
                        <input
                          type="text"
                          value={founder.name}
                          onChange={(e) => handleFounderChange(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
                          placeholder="Founder name"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
                        <input
                          type="email"
                          value={founder.email}
                          onChange={(e) => handleFounderChange(index, 'email', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
                          placeholder="founder@example.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Shares Owned</label>
                      <input
                        type="number"
                        value={founder.shares}
                        onChange={(e) => handleFounderChange(index, 'shares', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
                        placeholder="4,000,000"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleAddFounder}
                className="text-primary font-bold text-sm hover:text-[#DB2777] flex items-center gap-1 transition-colors"
              >
                + Add another founder
              </button>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
                >
                  Back
                </button>
                <button
                  disabled={loading}
                  onClick={handleComplete}
                  className="flex-[2] py-4 bg-primary hover:bg-[#DB2777] text-white font-bold rounded-xl transition-all shadow-lg shadow-pink-100 flex justify-center items-center gap-2 disabled:opacity-70"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    'Complete Setup'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
