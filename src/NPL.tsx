import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Prepare data for visualization
const loanTypeData = [
  { name: '7 Days Loan', outstandingBalance: 1457497, totalRecovered: 3640709, unrecoveredPercentage: 22.39 },
  { name: '14 Days Loan', outstandingBalance: 3197580, totalRecovered: 4899872, unrecoveredPercentage: 32.63 },
  { name: '21 Days Loan', outstandingBalance: 1419345, totalRecovered: 2033642, unrecoveredPercentage: 32.29 },
  { name: '30 Days Loan', outstandingBalance: 8778014, totalRecovered: 9872876, unrecoveredPercentage: 38.47 }
];

const ArrearsOverTimeData = [
  { name: 'Within Tenure', amount: 3783182 },
  { name: '30 days in arrears', amount: 1563554 },
  { name: '31-60 days in arrears', amount: 1311402 },
  { name: '61-90 days in arrears', amount: 1429759 },
  { name: '91-120 days in arrears', amount: 2245783 },
  { name: '121-150 days in arrears', amount: 1641346 },
  { name: '151-180 days in arrears', amount: 1250673 },
  { name: '181+ days in arrears', amount: 1626737 }
];

// Calculated from the net outstanding balance data
const totalOverdueRateData = [
  { name: 'Overdue', value: 69.88 },
  { name: 'Within Tenure', value: 30.12 }
];

// NPL rate - 90+ days in arrears
const nplRateData = [
  { name: 'NPL', value: 38.19 },
  { name: 'Performing', value: 61.81 }
];

const COLORS = {
  overdue: ['#ff6b6b', '#74b9ff'],
  npl: ['#ff4757', '#7bed9f']
};

const formatNumber = (value) => {
  return new Intl.NumberFormat('en-US', { 
    notation: 'compact',
    compactDisplay: 'short'
  }).format(value);
};

const RecoveryRateDashboard = () => {
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold text-center">NPL Report Dashboard</h1>
      
      {/* Dial Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total Overdue Rate Dial */}
        <div className="bg-white shadow-md rounded-lg p-4 h-64">
          <h2 className="text-xl font-semibold mb-2 text-center">Total Overdue Rate</h2>
          <p className="text-sm text-gray-500 text-center mb-4">(Total Overdue/Total Net Outstanding)</p>
          <ResponsiveContainer width="100%" height="80%">
            <PieChart>
              <Pie
                data={totalOverdueRateData}
                cx="50%"
                cy="50%"
                startAngle={180}
                endAngle={0}
                innerRadius="60%"
                outerRadius="80%"
                paddingAngle={5}
                dataKey="value"
              >
                {totalOverdueRateData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS.overdue[index]} />
                ))}
              </Pie>
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold">
                69.88%
              </text>
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* NPL Rate Dial */}
        <div className="bg-white shadow-md rounded-lg p-4 h-64">
          <h2 className="text-xl font-semibold mb-2 text-center">NPL Rate</h2>
          <p className="text-sm text-gray-500 text-center mb-4">(90+ Days in Arrears/Total Net Outstanding)</p>
          <ResponsiveContainer width="100%" height="80%">
            <PieChart>
              <Pie
                data={nplRateData}
                cx="50%"
                cy="50%"
                startAngle={180}
                endAngle={0}
                innerRadius="60%"
                outerRadius="80%"
                paddingAngle={5}
                dataKey="value"
              >
                {nplRateData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS.npl[index]} />
                ))}
              </Pie>
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold">
                38.19%
              </text>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        {/* Loan Type Balance and Recovery Chart */}
        <div className="bg-white shadow-md rounded-lg p-4 h-96">
          <h2 className="text-xl font-semibold mb-4">Loan Type Performance</h2>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={loanTypeData} margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis 
                tickFormatter={formatNumber}
                width={80}
                label={{ value: 'Amount (ZMW)', angle: -90, position: 'insideLeft', offset: 10 }}
              />
              <Tooltip 
                formatter={(value, name) => {
                  if (typeof value === 'number') {
                    return [new Intl.NumberFormat('en-US').format(value), name];
                  }
                  return [value, name];
                }}
              />
              <Legend />
              <Bar dataKey="outstandingBalance" fill="#8884d8" name="Outstanding Balance" />
              <Bar dataKey="totalRecovered" fill="#82ca9d" name="Total Recovered" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Arrears Over Time Chart */}
        <div className="bg-white shadow-md rounded-lg p-4 h-96">
          <h2 className="text-xl font-semibold mb-4">Arrears Distribution Over Time</h2>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={ArrearsOverTimeData} margin={{ left: 20, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                interval={0} 
                height={100}
                tick={{
                  dx: -10,
                  dy: 10,
                  fontSize: '0.75rem'
                }}
              />
              <YAxis 
                tickFormatter={formatNumber}
                width={80}
                label={{ value: 'Amount(ZMW)', angle: -90, position: 'insideLeft', offset: 10 }}
              />
              <Tooltip 
                formatter={(value, name) => {
                  if (typeof value === 'number') {
                    return [new Intl.NumberFormat('en-US').format(value), name];
                  }
                  return [value, name];
                }}
              />
              <Bar dataKey="amount" fill="#ffc658" name="Arrears Amount" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Unrecovered Percentage Table */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Unrecovered Percentage by Loan Type</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left">Loan Type</th>
                <th className="p-3 text-right">Unrecovered %</th>
                <th className="p-3 text-right">Outstanding Balance</th>
                <th className="p-3 text-right">Total Recovered</th>
              </tr>
            </thead>
            <tbody>
              {loanTypeData.map((loan) => (
                <tr key={loan.name} className="border-b">
                  <td className="p-3">{loan.name}</td>
                  <td className="p-3 text-right text-red-600">
                    {loan.unrecoveredPercentage.toFixed(2)}%
                  </td>
                  <td className="p-3 text-right">
                    {loan.outstandingBalance.toLocaleString()}
                  </td>
                  <td className="p-3 text-right text-green-600">
                    {loan.totalRecovered.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecoveryRateDashboard;