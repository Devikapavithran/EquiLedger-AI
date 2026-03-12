import React from 'react';
import { Stakeholder, Company, User } from '../types';

interface CapTableProps {
  user: User | null;
  company: Company | null;
  stakeholders: Stakeholder[];
  totalIssuedShares: number;
}

export const CapTable: React.FC<CapTableProps> = ({ user, company, stakeholders, totalIssuedShares }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Cap Table</h2>
        <p className="text-slate-500">Detailed breakdown of company ownership.</p>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-x-auto shadow-sm">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-white/50 border-b border-border">
              <th className="px-6 py-4 text-sm font-semibold text-slate-900">Stakeholder</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-900">Role</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-900">Shares</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-900">Ownership %</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-900">Share Class</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-900">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {stakeholders.map((s) => {
              const ownership = totalIssuedShares > 0 ? (s.sharesOwned / totalIssuedShares) * 100 : 0;
              return (
                <tr key={s.id} className="hover:bg-white/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{s.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{s.role}</td>
                  <td className="px-6 py-4 text-sm text-slate-900 font-mono">{s.sharesOwned.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm font-bold text-primary">{ownership.toFixed(2)}%</td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <span className="px-2 py-1 bg-white border border-border rounded text-xs font-medium uppercase">
                      {s.shareClass}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      Active
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-white/50 font-bold border-t border-border">
              <td className="px-6 py-4 text-sm text-slate-900">Total Issued</td>
              <td className="px-6 py-4"></td>
              <td className="px-6 py-4 text-sm text-slate-900 font-mono">{totalIssuedShares.toLocaleString()}</td>
              <td className="px-6 py-4 text-sm text-slate-900">100.00%</td>
              <td className="px-6 py-4"></td>
              <td className="px-6 py-4"></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="bg-pink-50 border border-pink-100 rounded-xl p-6">
        <h3 className="text-lg font-bold text-pink-900 mb-2">Company Totals</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <p className="text-sm text-pink-700 font-medium">Authorized Shares</p>
            <p className="text-2xl font-bold text-pink-900">{company?.authorizedShares.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-pink-700 font-medium">Issued Shares</p>
            <p className="text-2xl font-bold text-pink-900">{totalIssuedShares.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-pink-700 font-medium">Available (Unissued)</p>
            <p className="text-2xl font-bold text-pink-900">{(company?.authorizedShares! - totalIssuedShares).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
