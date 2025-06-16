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
import useFetch from "./hooks/useFetch";
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

const Day30 = () => {
  // Update the file path to the new data file
  const { data } = useFetch("/DataNew30.csv");
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    console.log("Fetched Data:", data);
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, [data]);

  // Update calculations to use the new field names
  const calculateRevenueData = data.map((item) => ({
    Date: item.date, // Updated field name from Date to date
    Revenue: 
      (item.service_fee_recovered || 0) + 
      (item.late_fees_recovered || 0) + 
      (item.setup_fees_recovered || 0) + 
      (item.interest_fees_recovered || 0),
  }));

  const calculateNPLData = data.map((item) => ({
    Date: item.date, // Updated field name
    NPL: (item.gross_lent || 0) - (item.gross_recovered || 0),
  }));

  // Format data for charts
  const chartData = data.map((item) => ({
    Date: item.date, // Use the updated field name
    "Gross Lent": item.gross_lent || 0,
    "Gross Recovered": item.gross_recovered || 0,
    "Principal Recovered": item.principal_recovered || 0,
    "Service Fee Recovered": item.service_fee_recovered || 0,
    "Late Fees Recovered": item.late_fees_recovered || 0,
    // Include new fields
    "Setup Fees Recovered": item.setup_fees_recovered || 0,
    "Interest Fees Recovered": item.interest_fees_recovered || 0
  }));

  return (
    <div className="p-4 bg-white flex flex-col w-full">
      <div className="flex h-screen">
        {/* Dashboard Content */}
        <div className="flex-grow p-4 bg-white">
          <h1 className="text-2xl font-bold mb-6 text-center text-green-700 w-full">
            30 Day Loan Performance Dashboard
          </h1>

          <DashboardCard title="Daily Disbursements">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="Date" />
                <YAxis />
                <Tooltip />
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
                <Tooltip />
                <Legend />
                <Bar dataKey="Gross Recovered" fill="#34a853" />
                <Bar dataKey="Principal Recovered" fill="#4285f4" />
                <Bar dataKey="Service Fee Recovered" fill="#fbbc05" />
                {/* Add new recovery types if you want to display them */}
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
                <Tooltip />
                <Legend />
                <Bar dataKey="Revenue" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </DashboardCard>

          {/* New card for unique users */}
          <DashboardCard title="User Activity">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="Date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="Unique Users" 
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="Overall Unique Users" 
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

export default Day30;