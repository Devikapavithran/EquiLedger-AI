import React from 'react';
import { FileText, Download, PieChart, Users, ArrowRight } from 'lucide-react';
import { Stakeholder, FundingRound, Company, User, VestingSchedule } from '../types';
import { jsPDF } from 'jspdf';

interface ReportsProps {
  user: User | null;
  company: Company | null;
  stakeholders: Stakeholder[];
  fundingRounds: FundingRound[];
  vestingSchedules: VestingSchedule[];
  totalIssuedShares: number;
}

export const Reports: React.FC<ReportsProps> = ({ 
  company, 
  stakeholders, 
  fundingRounds,
  vestingSchedules,
  totalIssuedShares
}) => {
  const calculateVesting = (schedule: VestingSchedule) => {
    const start = new Date(schedule.startDate);
    const now = new Date();
    const monthsDiff = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
    
    if (monthsDiff < schedule.cliffMonths) return 0;
    if (monthsDiff >= schedule.vestingMonths) return schedule.totalOptions;
    
    return Math.floor((schedule.totalOptions / schedule.vestingMonths) * monthsDiff);
  };

  const handleDownload = (reportType: 'cap-table' | 'stakeholders' | 'funding' | 'vesting') => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const companyName = company?.name || 'EquiLedger';
    const date = new Date().toLocaleDateString();

    // Header
    doc.setFontSize(20);
    doc.setTextColor(131, 24, 67); // Deep rose (#831843)
    doc.text(companyName, 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(236, 72, 153); // Primary pink (#EC4899)
    doc.text(`Generated on ${date}`, 14, 28);

    let y = 45;

    const drawLine = (yPos: number) => {
      doc.setDrawColor(251, 207, 232); // Pink-200 (#FBCFE8)
      doc.line(14, yPos, pageWidth - 14, yPos);
    };

    const drawHeader = (title: string) => {
      doc.setFontSize(16);
      doc.setTextColor(131, 24, 67);
      doc.text(title, 14, 40);
      drawLine(42);
    };

    switch (reportType) {
      case 'cap-table': {
        drawHeader('Cap Table Summary');
        
        // Table Headers
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Stakeholder', 14, y);
        doc.text('Shares', 100, y);
        doc.text('Ownership %', 140, y);
        doc.text('Class', 175, y);
        
        y += 8;
        doc.setFont('helvetica', 'normal');
        
        stakeholders.forEach((s) => {
          if (y > 280) { doc.addPage(); y = 20; }
          const ownership = ((s.sharesOwned / totalIssuedShares) * 100).toFixed(2);
          doc.text(s.name, 14, y);
          doc.text(s.sharesOwned.toLocaleString(), 100, y);
          doc.text(`${ownership}%`, 140, y);
          doc.text(s.shareClass, 175, y);
          y += 7;
        });

        y += 5;
        drawLine(y);
        y += 8;
        doc.setFont('helvetica', 'bold');
        doc.text('Total Issued Shares:', 14, y);
        doc.text(totalIssuedShares.toLocaleString(), 100, y);
        doc.text('100.00%', 140, y);
        break;
      }

      case 'stakeholders': {
        drawHeader('Stakeholder Directory');
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Name', 14, y);
        doc.text('Email', 60, y);
        doc.text('Role', 120, y);
        doc.text('Shares Owned', 170, y);
        
        y += 8;
        doc.setFont('helvetica', 'normal');
        
        stakeholders.forEach((s) => {
          if (y > 280) { doc.addPage(); y = 20; }
          doc.text(s.name, 14, y);
          doc.text(s.email, 60, y);
          doc.text(s.role, 120, y);
          doc.text(s.sharesOwned.toLocaleString(), 170, y);
          y += 7;
        });
        break;
      }

      case 'funding': {
        drawHeader('Funding History');
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Round', 14, y);
        doc.text('Pre-Money', 50, y);
        doc.text('Investment', 90, y);
        doc.text('Post-Money', 130, y);
        doc.text('Date', 170, y);
        
        y += 8;
        doc.setFont('helvetica', 'normal');
        
        fundingRounds.forEach((r) => {
          if (y > 280) { doc.addPage(); y = 20; }
          doc.text(r.roundName, 14, y);
          doc.text(`$${r.preMoneyValuation.toLocaleString()}`, 50, y);
          doc.text(`$${r.investmentAmount.toLocaleString()}`, 90, y);
          doc.text(`$${r.postMoneyValuation.toLocaleString()}`, 130, y);
          doc.text(new Date(r.createdAt).toLocaleDateString(), 170, y);
          y += 7;
        });
        break;
      }

      case 'vesting': {
        drawHeader('Vesting Status Report');
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Stakeholder', 14, y);
        doc.text('Vested', 70, y);
        doc.text('Unvested', 110, y);
        doc.text('Total Grant', 150, y);
        doc.text('Progress', 180, y);
        
        y += 8;
        doc.setFont('helvetica', 'normal');
        
        vestingSchedules.forEach((vs) => {
          if (y > 280) { doc.addPage(); y = 20; }
          const stakeholder = stakeholders.find(s => s.id === vs.stakeholderId);
          const vested = calculateVesting(vs);
          const unvested = vs.totalOptions - vested;
          const progress = ((vested / vs.totalOptions) * 100).toFixed(1);
          
          doc.text(stakeholder?.name || 'Unknown', 14, y);
          doc.text(vested.toLocaleString(), 70, y);
          doc.text(unvested.toLocaleString(), 110, y);
          doc.text(vs.totalOptions.toLocaleString(), 150, y);
          doc.text(`${progress}%`, 180, y);
          y += 7;
        });
        break;
      }
    }

    doc.save(`${companyName.replace(/\s+/g, '_')}_${reportType}_Report.pdf`);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Reports</h2>
        <p className="text-slate-500">Generate and export company equity documents.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ReportCard 
          title="Cap Table Summary"
          description="Complete breakdown of all share classes, stakeholders, and ownership percentages."
          icon={<PieChart className="text-primary" size={24} />}
          onDownload={() => handleDownload('cap-table')}
        />
        <ReportCard 
          title="Stakeholder Directory"
          description="Contact information and total equity holdings for all company stakeholders."
          icon={<Users className="text-primary" size={24} />}
          onDownload={() => handleDownload('stakeholders')}
        />
        <ReportCard 
          title="Funding History"
          description="Detailed record of all investment rounds, valuations, and dilution events."
          icon={<FileText className="text-primary" size={24} />}
          onDownload={() => handleDownload('funding')}
        />
        <ReportCard 
          title="Vesting Status Report"
          description="Summary of all active vesting schedules and current vested vs unvested totals."
          icon={<ArrowRight className="text-primary" size={24} />}
          onDownload={() => handleDownload('vesting')}
        />
      </div>

      <div className="bg-sidebar rounded-2xl p-8 text-sidebar-foreground shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">Automated Compliance</h3>
            <p className="text-sidebar-foreground/70">
              Need to generate 409A valuations or tax documents? Connect with our network of auditors for specialized reporting.
            </p>
          </div>
          <button className="px-6 py-3 bg-white text-sidebar text-sm rounded-xl font-bold hover:bg-pink-50 transition-colors whitespace-nowrap">
            Upgrade to Enterprise
          </button>
        </div>
      </div>
    </div>
  );
};

interface ReportCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onDownload: () => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ title, description, icon, onDownload }) => (
  <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex gap-4 hover:border-primary/30 transition-colors cursor-pointer group">
    <div className="p-3 bg-background rounded-xl group-hover:bg-pink-50 transition-colors border border-border/50">
      {icon}
    </div>
    <div className="flex-1">
      <h4 className="font-bold text-slate-900 mb-1">{title}</h4>
      <p className="text-sm text-slate-500 mb-4">{description}</p>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onDownload();
        }}
        className="flex items-center gap-2 text-sm font-bold text-primary hover:text-[#DB2777] transition-colors"
      >
        <Download size={16} />
        Download PDF
      </button>
    </div>
  </div>
);

