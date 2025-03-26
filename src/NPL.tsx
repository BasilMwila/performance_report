import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Prepare data for visualization
const loanTypeData = [
  { name: '7 Days Loan', outstandingBalance: 1542220, totalRecovered: 3364869, unrecoveredPercentage: 25.05 },
  { name: '14 Days Loan', outstandingBalance: 3383720, totalRecovered: 4354534, unrecoveredPercentage: 36.73 },
  { name: '21 Days Loan', outstandingBalance: 1535238, totalRecovered: 1863330, unrecoveredPercentage: 36.34 },
  { name: '30 Days Loan', outstandingBalance: 8870803, totalRecovered: 9083440, unrecoveredPercentage: 40.73 }
];

const ArrearsOverTimeData = [
  { name: 'Within Tenure', amount: 3837796 },
  { name: '30 days in arrears', amount: 2030708 },
  { name: '31-60 days in arrears', amount: 1432637 },
  { name: '61-90 days in arrears', amount: 1671139 },
  { name: '91-120 days in arrears', amount: 2249308 },
  { name: '121-150 days in arrears', amount: 1553465 },
  { name: '151-180 days in arrears', amount: 1296178 },
  { name: '181+ days in arrears', amount: 1260750 }
];

const formatNumber = (value) => {
  return new Intl.NumberFormat('en-US', { 
    notation: 'compact',
    compactDisplay: 'short'
  }).format(value);
};

const RecoveryRateDashboard = () => {
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold text-center">Airtel Zambia NPL Report Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Loan Type Balance and Recovery Chart */}
        <div className="bg-white shadow-md rounded-lg p-4 h-[400px]">
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
                formatter={(value) => [new Intl.NumberFormat('en-US').format(value as number), 'Amount']}
              />
              <Legend />
              <Bar dataKey="outstandingBalance" fill="#8884d8" name="Outstanding Balance" />
              <Bar dataKey="totalRecovered" fill="#82ca9d" name="Total Recovered" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Arrears Over Time Chart */}
        <div className="bg-white shadow-md rounded-lg p-4 h-[450px]">
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
                formatter={(value) => [new Intl.NumberFormat('en-US').format(value as number), 'Amount']}
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