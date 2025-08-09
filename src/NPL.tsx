import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useFetchNPLData } from "./hooks/useFetchFromAPI"; // Updated to use API fetching
import DateRangePicker from "./components/DateRangePicker";
import { subDays, format } from "date-fns";

// Helper function to safely format values in tooltips
const formatTooltipValue = (value: any): [string, string] => {
  if (typeof value === 'number') {
    return [new Intl.NumberFormat('en-US').format(value), ""];
  } else if (typeof value === 'string') {
    const numValue = parseFloat(value.replace(/,/g, ''));
    if (!isNaN(numValue)) {
      return [new Intl.NumberFormat('en-US').format(numValue), ""];
    }
    return [value, ""];
  }
  return [String(value), ""];
};

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('en-US', { 
    notation: 'compact',
    compactDisplay: 'short'
  }).format(value);
};

const COLORS = {
  overdue: ['#ff6b6b', '#74b9ff'],
  npl: ['#ff4757', '#7bed9f']
};

const RecoveryRateDashboard = () => {
  // Add state for date range filtering
  const [dateRange, setDateRange] = useState({
    startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'), // Default to last 30 days
    endDate: format(new Date(), 'yyyy-MM-dd'),
  });

  // Use the specialized NPL API hook with date filtering
  const { loanTypeData, arrearsOverTimeData, loading, error } = useFetchNPLData({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate
  });

  const handleDateRangeChange = (startDate: string, endDate: string) => {
    setDateRange({ startDate, endDate });
  };

  if (loading) {
    return (
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-bold text-center">NPL Report Dashboard</h1>
        <div className="text-center">Loading NPL data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-bold text-center">NPL Report Dashboard</h1>
        <div className="text-center text-red-600">Error loading NPL data: {error}</div>
      </div>
    );
  }

  // Debug: Show what data is actually being received
  console.log('NPL Dashboard - Raw loanTypeData:', loanTypeData);
  console.log('NPL Dashboard - Raw arrearsOverTimeData:', arrearsOverTimeData);

  // Calculate metrics from database data
  const calculateMetrics = () => {
    const totalNetOutstanding = arrearsOverTimeData.reduce((sum, item) => sum + item.amount, 0);

    const totalOverdue = arrearsOverTimeData
      .filter(item => item.name !== 'Within Tenure')
      .reduce((sum, item) => sum + item.amount, 0);

    const nplAmount = arrearsOverTimeData
      .filter(item => {
        return ['91-120 days in arrears', '121-150 days in arrears', 
                '151-180 days in arrears', '181+ days in arrears'].includes(item.name);
      })
      .reduce((sum, item) => sum + item.amount, 0);

    // Calculate rates from database data
    const totalOverdueRate = totalNetOutstanding > 0 ? (totalOverdue / totalNetOutstanding) * 100 : 0;
    const nplRate = totalNetOutstanding > 0 ? (nplAmount / totalNetOutstanding) * 100 : 0;
    
    // Calculate NPL rate from actual database data only
    const actualNplRate = nplRate;

    return {
      totalNetOutstanding,
      totalOverdueRate,
      nplRate: actualNplRate,
      performingRate: 100 - actualNplRate
    };
  };

  const metrics = calculateMetrics();

  // Create dial chart data
  const totalOverdueRateData = [
    { name: 'Overdue', value: metrics.totalOverdueRate },
    { name: 'Within Tenure', value: 100 - metrics.totalOverdueRate }
  ];

  const nplRateData = [
    { name: 'NPL', value: metrics.nplRate },
    { name: 'Performing', value: metrics.performingRate }
  ];

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-green-700">NPL Report Dashboard</h1>
        <div className="flex-shrink-0">
          <DateRangePicker
            onDateRangeChange={handleDateRangeChange}
            initialStartDate={subDays(new Date(), 30)}
            initialEndDate={new Date()}
          />
        </div>
      </div>

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
              <Tooltip formatter={formatTooltipValue} />
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
            <BarChart data={arrearsOverTimeData}>
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
              <Tooltip formatter={formatTooltipValue} />
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