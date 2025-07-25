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
import { useFetch } from "./hooks/useFetchFromAPI"; // Updated to use API fetching
import { Calendar, Home } from "lucide-react";

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
  // Updated to use API data fetching for all loan types
  const { data, loading, error } = useFetch("/DataNew.csv");
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    console.log("Fetched Data:", data);
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, [data]);

  if (loading) {
    return (
      <div className="p-4 bg-white flex flex-col w-full">
        <div className="flex-grow p-4 bg-white">
          <h1 className="text-2xl font-bold mb-6 text-center text-green-700 w-full">
            Overall Day Loan Performance Dashboard
          </h1>
          <div className="text-center">Loading...</div>
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

  // Update calculations to use the new field names
  const calculateRevenueData = data.map((item) => ({
    Date: item.date,
    Revenue: 
      (item.service_fee_recovered || 0) + 
      (item.late_fees_recovered || 0) + 
      (item.setup_fees_recovered || 0) + 
      (item.interest_fees_recovered || 0),
  }));

  const calculateNPLData = data.map((item) => ({
    Date: item.date,
    NPL: (item.gross_lent || 0) - (item.gross_recovered || 0),
  }));

  // Format data for charts
  const chartData = data.map((item) => ({
    Date: item.date,
    "Gross Lent": item.gross_lent || 0,
    "Gross Recovered": item.gross_recovered || 0,
    "Principal Recovered": item.principal_recovered || 0,
    "Service Fee Recovered": item.service_fee_recovered || 0,
    "Late Fees Recovered": item.late_fees_recovered || 0,
    "Setup Fees Recovered": item.setup_fees_recovered || 0,
    "Interest Fees Recovered": item.interest_fees_recovered || 0,
    "Unique_Users": item.unique_users || 0,
    "Overall_Unique_Users": item.overall_unique_users || 0
  }));

  return (
    <div className="p-4 bg-white flex flex-col w-full">
      <div className="flex h-screen">
        <div className="flex-grow p-4 bg-white">
          <h1 className="text-2xl font-bold mb-6 text-center text-green-700 w-full">
            Overall Day Loan Performance Dashboard
          </h1>

          <DashboardCard title="Daily Disbursements">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="Date" />
                <YAxis />
                <Tooltip formatter={formatTooltipValue} />
                <Legend />
                <Bar dataKey="Gross Lent" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </DashboardCard>

          <DashboardCard title="Recovery Performance">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="Date" />
                <YAxis />
                <Tooltip formatter={formatTooltipValue} />
                <Legend />
                <Bar dataKey="Gross Recovered" fill="#34a853" />
                <Bar dataKey="Principal Recovered" fill="#4285f4" />
                <Bar dataKey="Service Fee Recovered" fill="#fbbc05" />
                <Bar dataKey="Late Fees Recovered" fill="#ea4335" />
              </BarChart>
            </ResponsiveContainer>
          </DashboardCard>

          <DashboardCard title="Daily Revenue">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={calculateRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="Date" />
                <YAxis />
                <Tooltip formatter={formatTooltipValue} />
                <Legend />
                <Bar dataKey="Revenue" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </DashboardCard>

          <DashboardCard title="Non-Performing Loans (NPL)">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={calculateNPLData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="Date" />
                <YAxis />
                <Tooltip formatter={formatTooltipValue} />
                <Legend />
                <Line type="monotone" dataKey="NPL" stroke="#ff7300" />
              </LineChart>
            </ResponsiveContainer>
          </DashboardCard>

          <DashboardCard title="User Activity">
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
                  activeDot={{ r: 8 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="Overall_Unique_Users" 
                  stroke="#82ca9d" 
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