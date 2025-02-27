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

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:5000/users?username=${username}&password=${password}`);
    const users = await response.json();

    if (users.length > 0) {
      localStorage.setItem("user", JSON.stringify(users[0]));
      onLogin(users[0]);
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <input className="border p-2 mb-2 w-full" type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input className="border p-2 mb-2 w-full" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className="bg-blue-500 text-white p-2 w-full rounded">Login</button>
      </form>
    </div>
  );
};



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
  const [monthlyRates, setMonthlyRates] = useState<{ period: string; returnRate: number }[]>([]);
  const [weeklyRates, setWeeklyRates] = useState<{ period: string; returnRate: number }[]>([]);
  

  useEffect(() => {
    console.log("Fetched Data:", data);
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    if (data.length > 0) {
      const { monthlyRates, weeklyRates } = calculateReturnRates(data);
      setMonthlyRates(monthlyRates);
      setWeeklyRates(weeklyRates);
    }
  }, [data]);

  if (!user) return <Login onLogin={setUser} />;

  const calculateRevenueData = data.map((item) => ({
    Date: item.Date,
    Revenue: item["Service Fee Recovered"] + item["Late Fees Recovered"],
  }));

  const calculateNPLData = data.map((item) => ({
    Date: item.Date,
    NPL: item["Gross Lent"] - item["Gross Recovered"],
  }));

  

  const calculateReturnRates = (data: any[]) => {
    if (!data || data.length === 0) return { monthlyRates: [], weeklyRates: [] };
  
    const groupedByMonth: { [key: string]: any } = {};
    const groupedByWeek: { [key: string]: any } = {};
  
    data.forEach((entry) => {
      const date = new Date(entry.Date);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      const weekKey = `${date.getFullYear()}-W${Math.ceil(date.getDate() / 7)}`;
  
      if (!groupedByMonth[monthKey]) {
        groupedByMonth[monthKey] = { month: monthKey, principalRecovered: 0, grossLent: 0 };
      }
      if (!groupedByWeek[weekKey]) {
        groupedByWeek[weekKey] = { week: weekKey, principalRecovered: 0, grossLent: 0 };
      }
  
      groupedByMonth[monthKey].principalRecovered += entry["Principal Recovered"];
      groupedByMonth[monthKey].grossLent += entry["Gross Lent"];
      
      groupedByWeek[weekKey].principalRecovered += entry["Principal Recovered"];
      groupedByWeek[weekKey].grossLent += entry["Gross Lent"];
    });
  
    const monthlyRates = Object.values(groupedByMonth).map((item) => ({
      period: item.month,
      returnRate: item.grossLent ? (item.principalRecovered / item.grossLent) * 100 : 0,
    }));
  
    const weeklyRates = Object.values(groupedByWeek).map((item) => ({
      period: item.week,
      returnRate: item.grossLent ? (item.principalRecovered / item.grossLent) * 100 : 0,
    }));
  
    return { monthlyRates, weeklyRates };
  };
  

  return (
    <div className="p-4 bg-gray-50 flex flex-col w-full">
      <h1 className="text-2xl font-bold mb-6 text-center w-full">Emerald Finance Performance Dashboard</h1>
      <button className="self-end bg-red-500 text-white px-4 py-2 rounded mb-4" onClick={() => { localStorage.removeItem("user"); setUser(null); }}>
        Logout
      </button>
<DashboardCard title="User Trends">
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="Date" />
      <YAxis yAxisId="left" />
      <YAxis yAxisId="right" orientation="right" /> {/* Added right Y-axis */}
      <Tooltip />
      <Legend />
      <Line yAxisId="left" type="monotone" dataKey="Qualified Base" stroke="#8884d8" />
      <Line yAxisId="right" type="monotone" dataKey="Active Base" stroke="#82ca9d" /> {/* Uses right Y-axis */}
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


      {/* <DashboardCard title="Revenue Trends">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={calculateRevenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Revenue" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </DashboardCard> */}

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

      <DashboardCard title="Principal Return Rate (Monthly & Weekly)">
  <ResponsiveContainer width="100%" height={300}>
    {data.length > 0 ? (
      <BarChart data={[...monthlyRates, ...weeklyRates]}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="period" />
        <YAxis label={{ value: "Return Rate (%)", angle: -90, position: "insideLeft" }} />
        <Tooltip />
        <Legend />
        <Bar dataKey="returnRate" fill="#82ca9d" />
      </BarChart>
    ) : (
      <p>Loading data...</p>
    )}
  </ResponsiveContainer>
</DashboardCard>

    </div>
  );
};

export default App;
