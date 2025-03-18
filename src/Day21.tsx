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
import { Calendar, Home, } from "lucide-react";





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




const Day21 = () => {
  const { data } = useFetch("/Data21.csv");
  const [user, setUser] = useState(null);
  
  

  useEffect(() => {
    console.log("Fetched Data:", data);
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

  }, [data]);


  const calculateRevenueData = data.map((item) => ({
    Date: item.Date,
    Revenue: item["Service Fee Recovered"] + item["Late Fees Recovered"],
  }));

  const calculateNPLData = data.map((item) => ({
    Date: item.Date,
    NPL: item["Gross Lent"] - item["Gross Recovered"],
  }));

  


  return (
    <div className="p-4 bg-white flex flex-col w-full">

      <div className="flex h-screen">
  {/* Sidebar */}


  {/* Dashboard Content */}
  <div className="flex-grow p-4 bg-white">
    <h1 className="text-2xl font-bold mb-6 text-center text-green-700 w-full">
    7 Day Loan Performance Dashboard
    </h1>


    <DashboardCard title="Daily Disbursements">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
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
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Gross Recovered" fill="#34a853" />
          <Bar dataKey="Principal Recovered" fill="#4285f4" />
          <Bar dataKey="Service Fee Recovered" fill="#fbbc05" />
        </BarChart>
      </ResponsiveContainer>
    </DashboardCard>

     <DashboardCard title="Non-Performing Loans (NPL)">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={calculateNPLData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="NPL" stroke="#ff7300" />
        </LineChart>
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
  </div>
</div>

    </div>
)};

export default Day21;
