import React, { useState, useMemo } from 'react';
import { initialBalanceSheet, activityItems, arAgingData } from '../services/mockData';
import { FinancialItem, ArAgingBucket } from '../types';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
};

const ReportTable: React.FC<{ items: FinancialItem[]; title: string }> = ({ items, title }) => (
  <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden mb-6">
    <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
      <h3 className="font-bold text-slate-700">{title}</h3>
      <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded">BLU Standard</span>
    </div>
    <table className="w-full text-sm text-left">
      <thead className="bg-slate-50 text-slate-500 font-medium uppercase text-xs">
        <tr>
          <th className="px-6 py-3">Account Name</th>
          <th className="px-6 py-3 text-right">Current Period</th>
          <th className="px-6 py-3 text-right">Previous Period</th>
          <th className="px-6 py-3 text-right">Change (%)</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {items.map((item) => {
          const change = ((item.currentValue - item.previousValue) / item.previousValue) * 100;
          return (
            <tr key={item.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-3 font-medium text-slate-700">
                {item.name}
                {item.subcategory && <span className="ml-2 text-xs text-slate-400">({item.subcategory})</span>}
              </td>
              <td className="px-6 py-3 text-right font-mono text-slate-600">{formatCurrency(item.currentValue)}</td>
              <td className="px-6 py-3 text-right font-mono text-slate-400">{formatCurrency(item.previousValue)}</td>
              <td className={`px-6 py-3 text-right font-bold ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {change > 0 ? '+' : ''}{change.toFixed(1)}%
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

const ARAgingTable: React.FC<{ data: ArAgingBucket[] }> = ({ data }) => {
  const totalProvision = data.reduce((acc, curr) => acc + (curr.amount * curr.provisionRate), 0);
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden mb-6">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
        <h3 className="font-bold text-slate-700">Piutang & Penyisihan (AR Provisioning)</h3>
        <p className="text-xs text-slate-500 mt-1">KMK No. 1981/MENKES/SK/XII/2010 Compliance</p>
      </div>
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 text-slate-500 font-medium uppercase text-xs">
          <tr>
            <th className="px-6 py-3">Aging Category</th>
            <th className="px-6 py-3 text-right">Amount</th>
            <th className="px-6 py-3 text-right">Provision Rate</th>
            <th className="px-6 py-3 text-right">Provision Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((item, idx) => (
            <tr key={idx} className="hover:bg-slate-50">
              <td className="px-6 py-3 font-medium text-slate-700">{item.range}</td>
              <td className="px-6 py-3 text-right font-mono">{formatCurrency(item.amount)}</td>
              <td className="px-6 py-3 text-right font-mono">{(item.provisionRate * 100)}%</td>
              <td className="px-6 py-3 text-right font-mono text-red-600">{formatCurrency(item.amount * item.provisionRate)}</td>
            </tr>
          ))}
          <tr className="bg-slate-50 font-bold">
            <td className="px-6 py-3" colSpan={3}>Total Provision (Cadangan Kerugian Piutang)</td>
            <td className="px-6 py-3 text-right text-red-700">{formatCurrency(totalProvision)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const FinancialReports: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'balance' | 'activity' | 'ar'>('balance');

  // Filter lists
  const assets = useMemo(() => initialBalanceSheet.filter(i => i.category === 'asset'), []);
  const liabilities = useMemo(() => initialBalanceSheet.filter(i => i.category === 'liability'), []);
  const equity = useMemo(() => initialBalanceSheet.filter(i => i.category === 'equity'), []);

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Laporan Keuangan BLU</h2>
          <p className="text-slate-500">Kepatuhan Standar Akuntansi Pemerintahan</p>
        </div>
        <div className="flex space-x-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
          {(['balance', 'activity', 'ar'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab === 'balance' && 'Neraca'}
              {tab === 'activity' && 'Laporan Operasional'}
              {tab === 'ar' && 'Manajemen Piutang'}
            </button>
          ))}
        </div>
      </header>

      {activeTab === 'balance' && (
        <div className="grid gap-6">
          <ReportTable title="Aset (Assets)" items={assets} />
          <ReportTable title="Kewajiban (Liabilities)" items={liabilities} />
          <ReportTable title="Ekuitas (Equity)" items={equity} />
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="grid gap-6">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <i className="fas fa-info-circle text-yellow-500"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Laporan Aktivitas ini disajikan menggunakan metode <strong>Single Step</strong> sesuai standar BLU.
                </p>
              </div>
            </div>
          </div>
          <ReportTable title="Laporan Operasional (Activity Report)" items={activityItems} />
        </div>
      )}

      {activeTab === 'ar' && (
        <ARAgingTable data={arAgingData} />
      )}
    </div>
  );
};

export default FinancialReports;