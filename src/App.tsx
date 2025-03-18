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
import { Calendar, FileText, Folder, Home, Users } from "lucide-react";





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

const App = () => {
  const { data } = useFetch("/Data.csv");
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
  <div className="w-64 bg-white text-black flex flex-col p-4 hidden sm:block">
    <div className="flex items-center space-x-2 mb-6">
      <span className="text-2xl font-bold">
        <img src="Emerald_Logo_Web.png" alt="Emerald Logo"/>
      </span>
    </div> 
   <nav className="flex-1">
      <ul className="space-y-2">
        <li className="flex items-center p-2 bg-gray-300 rounded-lg">
          <Home className="w-5 h-5 mr-3" />
          <span>Dashboard</span>
    
        </li>
        <li className="flex items-center p-2 hover:bg-gray-100 rounded-lg">
          <Users className="w-5 h-5 mr-3" />
          <span>Risk Control Metrics</span>
        </li>
        <li className="flex items-center p-2 hover:bg-gray-100 rounded-lg">
          <Folder className="w-5 h-5 mr-3" />
          <span>Projects</span>
          
        </li>
        <li className="flex items-center p-2 hover:bg-gray-100 rounded-lg">
          <Calendar className="w-5 h-5 mr-3" />
          <span>Calendar</span>
        
        </li>
        <li className="flex items-center p-2 hover:bg-gray-100 rounded-lg">
          <BarChart className="w-5 h-5 mr-3" />
          <span>Reports</span>
        </li>
      </ul>
    </nav>
    
  </div>

  {/* Dashboard Content */}
  <div className="flex-grow p-4 bg-white">
    <h1 className="text-2xl font-bold mb-6 text-center text-green-700 w-full">
      Emerald Finance Performance Dashboard
    </h1>


     <DashboardCard title="User Trends">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Date" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="Qualified Base" stroke="#8884d8" />
          <Line yAxisId="right" type="monotone" dataKey="Active Base" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </DashboardCard>

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
  );
};

export default App;
