import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Prepare data for visualization
const loanTypeData = [
  { name: '7 Days Loan', outstandingBalance: 987061, totalRecovered: 6465510, unrecoveredPercentage: 13.26 },
  { name: '14 Days Loan', outstandingBalance: 2417143, totalRecovered: 9902194, unrecoveredPercentage: 19.62 },
  { name: '21 Days Loan', outstandingBalance: 843681, totalRecovered: 3360435, unrecoveredPercentage: 20.07 },
  { name: '30 Days Loan', outstandingBalance: 5471605, totalRecovered: 17602405, unrecoveredPercentage: 23.71 },
  { name: 'Total Balance', outstandingBalance: 9720390, totalRecovered: 37330544, unrecoveredPercentage: 20.66 }
];

const ArrearsOverTimeData = [
  { name: 'Within Tenure', amount:  3278598 },
  { name: '30 days in arrears', amount: 1327925 },
  { name: '31-60 days in arrears', amount: 706659 },
  { name: '61-90 days in arrears', amount: 413794 },
  { name: '91-120 days in arrears', amount: 439720 },
  { name: '121-150 days in arrears', amount: 442654 },
  { name: '151-180 days in arrears', amount: 593835 },
  { name: '181+ days in arrears', amount: 2517205 }
];

// Calculate actual total values from the data
const calculateMetrics = () => {
  const totalNetOutstanding = ArrearsOverTimeData.reduce((sum, item) => sum + item.amount, 0);
  
  const totalOverdue = ArrearsOverTimeData
    .filter(item => item.name !== 'Within Tenure')
    .reduce((sum, item) => sum + item.amount, 0);
  
  const nplAmount = ArrearsOverTimeData
    .filter(item => {
      return ['91-120 days in arrears', '121-150 days in arrears', 
              '151-180 days in arrears', '181+ days in arrears'].includes(item.name);
    })
    .reduce((sum, item) => sum + item.amount, 0);
  
  const totalOverdueRate = (totalOverdue / totalNetOutstanding) * 100;
  const nplRate = (nplAmount / totalNetOutstanding) * 100;
  
  return {
    totalNetOutstanding,
    totalOverdueRate,
    nplRate,
    performingRate: 100 - nplRate
  };
};

const metrics = calculateMetrics();

// Using our calculated values from data analysis
const totalOverdueRateData = [
  { name: 'Overdue', value: metrics.totalOverdueRate },
  { name: 'Within Tenure', value: 100 - metrics.totalOverdueRate }
];

// NPL rate - 90+ days in arrears
const nplRateData = [
  { name: 'NPL', value: metrics.nplRate },
  { name: 'Performing', value: metrics.performingRate }
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
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fontSize="16" fontWeight="bold">
                {totalOverdueRateData[0].value.toFixed(2) + '%'}
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
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fontSize="16" fontWeight="bold">
                {nplRateData[0].value.toFixed(2) + '%'} 
              </text>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {/* Loan Type Balance and Recovery Chart */}
        <div className="bg-white shadow-md rounded-lg p-4 h-96">
          <h2 className="text-xl font-semibold mb-4">Loan Type Performance</h2>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={loanTypeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis 
                tickFormatter={formatNumber}
                width={60}
              />
              <Tooltip 
                formatter={(value) => {
                  return typeof value === 'number' 
                    ? [new Intl.NumberFormat('en-US').format(value), ""] 
                    : [value, ""];
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
            <BarChart data={ArrearsOverTimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={80}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tickFormatter={formatNumber}
                width={60}
              />
              <Tooltip 
                formatter={(value) => {
                  return typeof value === 'number' 
                    ? [new Intl.NumberFormat('en-US').format(value), ""] 
                    : [value, ""];
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
      
      {/* Summary Stats */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Summary Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg text-center">
            <h3 className="font-semibold text-gray-600">Total Overdue Rate</h3>
            <p className="text-2xl font-bold text-red-500">{metrics.totalOverdueRate.toFixed(2)}%</p>
          </div>
          <div className="p-4 border rounded-lg text-center">
            <h3 className="font-semibold text-gray-600">NPL Rate</h3>
            <p className="text-2xl font-bold text-red-500">{metrics.nplRate.toFixed(2)}%</p>
          </div>
          <div className="p-4 border rounded-lg text-center">
            <h3 className="font-semibold text-gray-600">Performing Rate</h3>
            <p className="text-2xl font-bold text-green-500">{metrics.performingRate.toFixed(2)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecoveryRateDashboard;