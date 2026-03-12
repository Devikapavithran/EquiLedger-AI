import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Menu, ShieldCheck } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Stakeholders } from './pages/Stakeholders';
import { CapTable } from './pages/CapTable';
import { FundingRounds } from './pages/FundingRounds';
import { Vesting } from './pages/Vesting';
import { AIAssistant } from './pages/AIAssistant';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { Login } from './pages/auth/Login';
import { SignUp } from './pages/auth/SignUp';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { Onboarding } from './pages/auth/Onboarding';
import { dataService } from './services/dataService';
import { authService } from './services/authService';
import { Company, Stakeholder, FundingRound, VestingSchedule, User } from './types';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = authService.getCurrentUser();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user.onboardingCompleted && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const [user, setUser] = useState<User | null>(authService.getCurrentUser());
  const [company, setCompany] = useState<Company | null>(null);
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [fundingRounds, setFundingRounds] = useState<FundingRound[]>([]);
  const [vestingSchedules, setVestingSchedules] = useState<VestingSchedule[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const isAuthPage = ['/login', '/signup', '/forgot-password', '/onboarding'].includes(location.pathname);

  // Load data on mount and when user changes
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    if (currentUser) {
      refreshData();
    }
    // Close sidebar on navigation on mobile
    setIsSidebarOpen(false);
  }, [location]);

  const refreshData = () => {
    setCompany(dataService.getCompany());
    setStakeholders(dataService.getStakeholders());
    setFundingRounds(dataService.getFundingRounds());
    setVestingSchedules(dataService.getVestingSchedules());
  };

  const totalIssuedShares = useMemo(() => 
    stakeholders.reduce((sum, s) => sum + s.sharesOwned, 0), 
  [stakeholders]);

  const handleAddStakeholder = (stakeholder: Omit<Stakeholder, 'id' | 'createdAt'>) => {
    dataService.addStakeholder(stakeholder);
    refreshData();
  };

  const handleUpdateStakeholder = (stakeholder: Stakeholder) => {
    dataService.updateStakeholder(stakeholder);
    refreshData();
  };

  const handleDeleteStakeholder = (id: string) => {
    dataService.deleteStakeholder(id);
    refreshData();
  };

  const handleAddFundingRound = (round: Omit<FundingRound, 'id' | 'createdAt' | 'postMoneyValuation'>) => {
    dataService.addFundingRound(round);
    refreshData();
  };

  const handleAddVestingSchedule = (schedule: Omit<VestingSchedule, 'id'>) => {
    dataService.addVestingSchedule(schedule);
    refreshData();
  };

  const handleUpdateCompany = (updatedCompany: Company) => {
    dataService.updateCompany(updatedCompany);
    refreshData();
  };

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
      </Routes>
    );
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans text-slate-900">
      <Sidebar 
        user={user} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-border shadow-sm z-30">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary rounded-lg text-white">
              <ShieldCheck size={20} />
            </div>
            <span className="font-bold text-slate-900 tracking-tight">EquiLedger AI</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={
                <ProtectedRoute>
                  <Dashboard 
                    user={user} 
                    company={company} 
                    stakeholders={stakeholders} 
                    fundingRounds={fundingRounds} 
                  />
                </ProtectedRoute>
              } />
              <Route path="/stakeholders" element={
                <ProtectedRoute>
                  <Stakeholders 
                    user={user}
                    stakeholders={stakeholders} 
                    totalIssuedShares={totalIssuedShares}
                    onAddStakeholder={handleAddStakeholder}
                    onUpdateStakeholder={handleUpdateStakeholder}
                    onDeleteStakeholder={handleDeleteStakeholder}
                  />
                </ProtectedRoute>
              } />
              <Route path="/captable" element={<ProtectedRoute><CapTable user={user} company={company} stakeholders={stakeholders} totalIssuedShares={totalIssuedShares} /></ProtectedRoute>} />
              <Route path="/funding" element={
                <ProtectedRoute>
                  <FundingRounds 
                    user={user}
                    company={company} 
                    fundingRounds={fundingRounds} 
                    onAddFundingRound={handleAddFundingRound}
                  />
                </ProtectedRoute>
              } />
              <Route path="/vesting" element={
                <ProtectedRoute>
                  <Vesting 
                    user={user}
                    stakeholders={stakeholders} 
                    vestingSchedules={vestingSchedules} 
                    onAddVestingSchedule={handleAddVestingSchedule}
                  />
                </ProtectedRoute>
              } />
              <Route path="/ai" element={
                <ProtectedRoute>
                  <AIAssistant 
                    user={user}
                    company={company} 
                    stakeholders={stakeholders} 
                    fundingRounds={fundingRounds} 
                    totalIssuedShares={totalIssuedShares}
                  />
                </ProtectedRoute>
              } />
              <Route path="/reports" element={
                <ProtectedRoute>
                  <Reports 
                    user={user}
                    company={company} 
                    stakeholders={stakeholders} 
                    fundingRounds={fundingRounds} 
                    vestingSchedules={vestingSchedules}
                    totalIssuedShares={totalIssuedShares}
                  />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={<ProtectedRoute><Settings user={user} company={company} onUpdateCompany={handleUpdateCompany} /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;