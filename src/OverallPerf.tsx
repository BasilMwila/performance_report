import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useFetchLoanData } from "./hooks/useFetchFromAPI"; // Updated to use API fetching with date range
import { Calendar, Home } from "lucide-react";
import DateRangePicker from "./components/DateRangePicker";
import LoadingSpinner from "./components/LoadingSpinner";
import DataDebugger from "./components/DataDebugger";
import { subDays, format } from "date-fns";
import { aggregateDataByDate, calculateRevenueData, calculateNPLData, formatChartData, filterValidTransactions } from "./utils/dataAggregation";

const DashboardCard = ({ title, children }) => (
  <div className="bg-white rounded-lg shadow-md p-4 mb-6">
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    {children}
  </div>
);

DashboardCard.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

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

const OverallPerf = () => {
  const [user, setUser] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: format(subDays(new Date(), 7), 'yyyy-MM-dd'), // Start with 7 days for better performance
    endDate: format(new Date(), 'yyyy-MM-dd'),
  });

  // Updated to use API data fetching with date range filtering
  // For now, let's focus on Airtel only to match business reports
  const { data, loading, error } = useFetchLoanData({
    loanType: 'all',
    telco: 'airtel', // Focus on Airtel to match business report
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });
  
  useEffect(() => {
    console.log("Fetched Data:", data);
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, [data]);

  const handleDateRangeChange = (startDate: string, endDate: string) => {
    setDateRange({ startDate, endDate });
  };

  if (loading) {
    return (
      <div className="p-4 bg-white flex flex-col w-full min-h-screen">
        <div className="flex-grow flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-6 text-green-700">
            Overall Day Loan Performance Dashboard
          </h1>
          <LoadingSpinner message="Loading dashboard data..." size="lg" />
          <p className="text-sm text-gray-500 mt-4 text-center max-w-md">
            Loading data for the selected date range. This may take a moment for large datasets.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-white flex flex-col w-full">
        <div className="flex-grow p-4 bg-white">
          <h1 className="text-2xl font-bold mb-6 text-center text-green-700 w-full">
            Overall Day Loan Performance Dashboard
          </h1>
          <div className="text-center text-red-600">Error loading data: {error}</div>
        </div>
      </div>
    );
  }

  // Aggregate data by date - sum all loan amount segments (100, 200, 500 TCL) for each day
  const aggregatedData = aggregateDataByDate(data);

  // Handle empty data case
  if (!loading && !error && aggregatedData.length === 0) {
    return (
      <div className="p-4 bg-white flex flex-col w-full min-h-screen">
        <div className="flex-grow p-4 bg-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
            <h1 className="text-2xl font-bold text-green-700">
              Overall Day Loan Performance Dashboard
            </h1>
            <div className="flex-shrink-0">
              <DateRangePicker
                onDateRangeChange={handleDateRangeChange}
                initialStartDate={subDays(new Date(), 7)}
                initialEndDate={new Date()}
              />
            </div>
          </div>
          <div className="text-center p-8">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">No Data Available</h3>
              <p className="text-yellow-700">
                No data found for the selected date range. Try selecting a different date range or check if data is available for this period.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Use utility functions for calculations
  const revenueData = calculateRevenueData(aggregatedData);
  const nplData = calculateNPLData(aggregatedData);
  const chartData = formatChartData(aggregatedData);

  return (
    <div className="p-4 bg-white flex flex-col w-full">
      <div className="flex h-screen">
        <div className="flex-grow p-4 bg-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
            <h1 className="text-2xl font-bold text-green-700">
              Overall Day Loan Performance Dashboard
            </h1>
            <div className="flex-shrink-0">
              <DateRangePicker
                onDateRangeChange={handleDateRangeChange}
                initialStartDate={subDays(new Date(), 7)}
                initialEndDate={new Date()}
              />
            </div>
          </div>

          <DataDebugger 
            data={data} 
            aggregatedData={aggregatedData} 
            title={`Overall Performance Data (${filterValidTransactions(data).length} valid of ${data.length} total records)`}
          />

          <DashboardCard title="Daily Disbursements (Total Across All Loan Amounts)">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="Date" />
                <YAxis />
                <Tooltip formatter={formatTooltipValue} />
                <Legend />
                <Bar dataKey="Gross Lent" fill="#8884d8" name="Total Gross Lent" />
                <Bar dataKey="Principal Lent" fill="#82ca9d" name="Total Principal Lent" />
              </BarChart>
            </ResponsiveContainer>
          </DashboardCard>

          <DashboardCard title="Recovery Performance (Total Across All Loan Amounts)">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="Date" />
                <YAxis />
                <Tooltip formatter={formatTooltipValue} />
                <Legend />
                <Bar dataKey="Gross Recovered" fill="#34a853" name="Total Gross Recovered" />
                <Bar dataKey="Principal Recovered" fill="#4285f4" name="Total Principal Recovered" />
                <Bar dataKey="Service Fee Recovered" fill="#fbbc05" name="Total Service Fee Recovered" />
                <Bar dataKey="Late Fees Recovered" fill="#ea4335" name="Total Late Fees Recovered" />
              </BarChart>
            </ResponsiveContainer>
          </DashboardCard>

          <DashboardCard title="Daily Revenue (Total Across All Loan Amounts)">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="Date" />
                <YAxis />
                <Tooltip formatter={formatTooltipValue} />
                <Legend />
                <Bar dataKey="Revenue" fill="#8884d8" name="Total Daily Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </DashboardCard>

          <DashboardCard title="Non-Performing Loans (NPL) - Total Across All Loan Amounts">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={nplData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="Date" />
                <YAxis />
                <Tooltip formatter={formatTooltipValue} />
                <Legend />
                <Line type="monotone" dataKey="NPL" stroke="#ff7300" name="Total NPL (Lent - Recovered)" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </DashboardCard>

          <DashboardCard title="Daily Unique Users">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="Date" />
                <YAxis />
                <Tooltip formatter={formatTooltipValue} />
                <Legend />
                
                <Line 
                  type="monotone" 
                  dataKey="Unique_Users" 
                  stroke="#8884d8" 
                  name="Daily Unique Users"
                  activeDot={{ r: 8 }}
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </DashboardCard>

          <DashboardCard title="User Activity & Qualified Base">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="Date" />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip formatter={formatTooltipValue} />
                <Legend />
                
                {/* Qualified Base on left axis */}
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="Qualified_Base" 
                  stroke="#ff7300" 
                  name="Qualified Base"
                  strokeWidth={2}
                />
                
                {/* Overall Unique Users on right axis */}
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="Overall_Unique_Users" 
                  stroke="#82ca9d" 
                  name="Overall Unique Users"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
};

export default OverallPerf;