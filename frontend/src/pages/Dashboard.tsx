import React, { useMemo } from 'react';
import { Users, PieChart as PieChartIcon, TrendingUp, DollarSign } from 'lucide-react';
import { Stakeholder, Company, FundingRound, User } from '../types';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title 
} from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';

ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title
);

interface DashboardProps {
  user: User | null;
  company: Company | null;
  stakeholders: Stakeholder[];
  fundingRounds: FundingRound[];
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  user, 
  company, 
  stakeholders, 
  fundingRounds
}) => {
  const totalIssuedShares = useMemo(() => 
    stakeholders.reduce((sum, s) => sum + s.sharesOwned, 0), 
  [stakeholders]);

  const founderOwnership = useMemo(() => {
    const founderShares = stakeholders
      .filter(s => s.role === 'Founder')
      .reduce((sum, s) => sum + s.sharesOwned, 0);
    return totalIssuedShares > 0 ? (founderShares / totalIssuedShares) * 100 : 0;
  }, [stakeholders, totalIssuedShares]);

  const latestValuation = useMemo(() => {
    if (fundingRounds.length === 0) return 0;
    return fundingRounds[fundingRounds.length - 1].postMoneyValuation;
  }, [fundingRounds]);

  const chartData = useMemo(() => {
    const data = {
      labels: stakeholders.map(s => s.name),
      datasets: [
        {
          data: stakeholders.map(s => s.sharesOwned),
          backgroundColor: [
            '#EC4899', '#F472B6', '#FB7185', '#F9A8D4', '#BE185D', '#9D174D', '#FBCFE8'
          ],
          borderWidth: 1,
        },
      ],
    };
    return data;
  }, [stakeholders]);

  const fundingChartData = useMemo(() => {
    return {
      labels: fundingRounds.map(r => r.roundName),
      datasets: [
        {
          label: 'Post-money Valuation ($)',
          data: fundingRounds.map(r => r.postMoneyValuation),
          borderColor: '#EC4899',
          backgroundColor: 'rgba(236, 72, 153, 0.1)',
          fill: true,
          tension: 0.4,
        },
      ],
    };
  }, [fundingRounds]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
        <p className="text-slate-500">Overview of {company?.name || 'Company'}'s capitalization.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Shareholders" 
          value={stakeholders.length.toString()} 
          icon={<Users className="text-primary" size={24} />} 
        />
        <StatCard 
          title="Issued Shares" 
          value={totalIssuedShares.toLocaleString()} 
          icon={<PieChartIcon className="text-primary" size={24} />} 
        />
        <StatCard 
          title="Founder Ownership" 
          value={`${founderOwnership.toFixed(1)}%`} 
          icon={<TrendingUp className="text-primary" size={24} />} 
        />
        <StatCard 
          title="Latest Valuation" 
          value={`$${(latestValuation / 1000000).toFixed(1)}M`} 
          icon={<DollarSign className="text-primary" size={24} />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Ownership Distribution</h3>
          <div className="aspect-square max-h-[300px] flex items-center justify-center">
            <Pie data={chartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Funding History</h3>
          <div className="h-[300px] flex items-center justify-center">
            {fundingRounds.length > 0 ? (
              <Line 
                data={fundingChartData} 
                options={{ 
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value) => `$${Number(value) / 1000000}M`
                      }
                    }
                  }
                }} 
              />
            ) : (
              <div className="text-slate-400 text-sm">No funding history yet</div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-background rounded-lg border border-border/50">
            <p className="text-sm text-slate-500 mb-1">Authorized Shares</p>
            <p className="font-bold text-slate-900">{company?.authorizedShares.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-background rounded-lg border border-border/50">
            <p className="text-sm text-slate-500 mb-1">Available Options</p>
            <p className="font-bold text-slate-900">{(company?.authorizedShares! - totalIssuedShares).toLocaleString()}</p>
          </div>
          <div className="p-4 bg-background rounded-lg border border-border/50">
            <p className="text-sm text-slate-500 mb-1">Utilization</p>
            <p className="font-bold text-slate-900">
              {((totalIssuedShares / (company?.authorizedShares || 1)) * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => (
  <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-background rounded-lg border border-border/30">{icon}</div>
    </div>
    <div>
      <p className="text-sm text-slate-500 font-medium">{title}</p>
      <h4 className="text-2xl font-bold text-slate-900 mt-1">{value}</h4>
    </div>
  </div>
);
