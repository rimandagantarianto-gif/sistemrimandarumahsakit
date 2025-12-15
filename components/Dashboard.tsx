import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { activityItems, initialBalanceSheet } from '../services/mockData';

const Dashboard: React.FC = () => {
  // Prepare data for charts
  const revenueData = activityItems
    .filter(i => i.category === 'revenue')
    .map(i => ({ name: i.name.split(' ')[0], value: i.currentValue }));

  const expenseData = activityItems
    .filter(i => i.category === 'expense')
    .map(i => ({ name: i.name.split(' ')[1] || i.name, value: i.currentValue }));

  const assetDistribution = initialBalanceSheet
    .filter(i => i.category === 'asset')
    .map(i => ({ name: i.name, value: i.currentValue }));

  const COLORS = ['#0ea5e9', '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af'];

  const StatCard: React.FC<{ title: string; value: string; trend: string; icon: string; color: string }> = ({ title, value, trend, icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h4 className="text-2xl font-bold text-slate-800">{value}</h4>
        <p className={`text-xs font-medium mt-2 ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
          {trend} <span className="text-slate-400 ml-1">vs last month</span>
        </p>
      </div>
      <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center text-white text-lg`}>
        <i className={`fas ${icon}`}></i>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value="Rp 5.7 M" 
          trend="+8.5%" 
          icon="fa-coins" 
          color="bg-emerald-500" 
        />
        <StatCard 
          title="Patient Visits" 
          value="1,248" 
          trend="+12.2%" 
          icon="fa-procedures" 
          color="bg-blue-500" 
        />
        <StatCard 
          title="AR Aging > 6mo" 
          value="Rp 200 jt" 
          trend="-2.4%" 
          icon="fa-clock" 
          color="bg-amber-500" 
        />
        <StatCard 
          title="Bed Occupancy" 
          value="78%" 
          trend="+4.1%" 
          icon="fa-hospital" 
          color="bg-indigo-500" 
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue vs Expense */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-700 mb-6">Financial Performance (BLU)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Revenue', amount: revenueData.reduce((a,b) => a + b.value, 0) },
                { name: 'Expense', amount: expenseData.reduce((a,b) => a + b.value, 0) }
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `Rp ${(val/1000000000).toFixed(1)}M`} />
                <Tooltip 
                  formatter={(val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(val)}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Asset Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-700 mb-6">Asset Allocation</h3>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={assetDistribution.slice(0, 5)} // Top 5
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {assetDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   formatter={(val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(val)}
                />
                <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: '12px' }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Compliance Notice */}
      <div className="bg-blue-900 rounded-xl p-6 text-white flex items-center justify-between">
         <div>
           <h4 className="font-bold text-lg">BLU Compliance Status</h4>
           <p className="text-blue-200 text-sm mt-1">
             System checks confirm all financial reports adhere to KMK No. 1981/MENKES/SK/XII/2010.
           </p>
         </div>
         <div className="px-4 py-2 bg-green-500 rounded-lg text-sm font-bold shadow-lg">
           COMPLIANT
         </div>
      </div>
    </div>
  );
};

export default Dashboard;