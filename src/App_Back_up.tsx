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

// Login Component
const Login = ({ onLogin }: { onLogin: (user: any) => void }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch(`http://localhost:5000/users?username=${username}&password=${password}`);
    const users = await response.json();

    if (users.length > 0) {
      localStorage.setItem("user", JSON.stringify(users[0])); // Store login info
      onLogin(users[0]); // Authenticate user
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <input
          className="border p-2 mb-2 w-full"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="border p-2 mb-2 w-full"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="bg-blue-500 text-white p-2 w-full rounded">Login</button>
      </form>
    </div>
  );
};

// Dashboard Card Component
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

const rawData = [
    {
      "Date": "1/01/2025",
      "Telco Country": "Airtel Zambia",
      "Qualified Base": 282008,
      "Active Base": 315,
      "Lending Transactions": 54710,
      "Gross Lent": 45745,
      "Net Lent": 8965,
      "Service Fee Lent": 0,
      "Late Fees Charged": 700,
      "Recovery Transactions": 98553,
      "Gross Recovered": 80592,
      "Principal Recovered": 16279,
      "Service Fee Recovered": 1683,
      "Late Fees Recovered": 28.00,
      "FX Rate": 28.00
    },
    {
      "Date": "2/01/2025",
      "Telco Country": "Airtel Zambia",
      "Qualified Base": 282008,
      "Active Base": 187,
      "Lending Transactions": 32135,
      "Gross Lent": 26760,
      "Net Lent": 5375,
      "Service Fee Lent": 0,
      "Late Fees Charged": 813,
      "Recovery Transactions": 113453,
      "Gross Recovered": 91762,
      "Principal Recovered": 18757,
      "Service Fee Recovered": 2934,
      "Late Fees Recovered": 27.93,
      "FX Rate": 27.93
    },
    {
      "Date": "3/01/2025",
      "Telco Country": "Airtel Zambia",
      "Qualified Base": 282008,
      "Active Base": 968,
      "Lending Transactions": 175899,
      "Gross Lent": 146984,
      "Net Lent": 28915,
      "Service Fee Lent": 0,
      "Late Fees Charged": 1193,
      "Recovery Transactions": 178160,
      "Gross Recovered": 146801,
      "Principal Recovered": 29071,
      "Service Fee Recovered": 2288,
      "Late Fees Recovered": 27.95,
      "FX Rate": 27.95
    },
    {
      "Date": "4/01/2025",
      "Telco Country": "Airtel Zambia",
      "Qualified Base": 282008,
      "Active Base": 1049,
      "Lending Transactions": 184675,
      "Gross Lent": 154198,
      "Net Lent": 30477,
      "Service Fee Lent": 0,
      "Late Fees Charged": 1025,
      "Recovery Transactions": 142799,
      "Gross Recovered": 117320,
      "Principal Recovered": 22974,
      "Service Fee Recovered": 2505,
      "Late Fees Recovered": 28.05,
      "FX Rate": 28.05
    },
    {
      "Date": "5/01/2025",
      "Telco Country": "Airtel Zambia",
      "Qualified Base": 282008,
      "Active Base": 988,
      "Lending Transactions": 174417,
      "Gross Lent": 145659,
      "Net Lent": 28758,
      "Service Fee Lent": 0,
      "Late Fees Charged": 845,
      "Recovery Transactions": 118751,
      "Gross Recovered": 97627,
      "Principal Recovered": 18933,
      "Service Fee Recovered": 2191,
      "Late Fees Recovered": 28.04,
      "FX Rate": 28.04
    },
    {
      "Date": "6/01/2025",
      "Telco Country": "Airtel Zambia",
      "Qualified Base": 282008,
      "Active Base": 1016,
      "Lending Transactions": 179900,
      "Gross Lent": 150423,
      "Net Lent": 29477,
      "Service Fee Lent": 0,
      "Late Fees Charged": 1019,
      "Recovery Transactions": 143773,
      "Gross Recovered": 117551,
      "Principal Recovered": 23445,
      "Service Fee Recovered": 2777,
      "Late Fees Recovered": 27.94,
      "FX Rate": 27.94
    },
    {
      "Date": "7/01/2025",
      "Telco Country": "Airtel Zambia",
      "Qualified Base": 282008,
      "Active Base": 854,
      "Lending Transactions": 155287,
      "Gross Lent": 129605,
      "Net Lent": 25682,
      "Service Fee Lent": 0,
      "Late Fees Charged": 853,
      "Recovery Transactions": 117599,
      "Gross Recovered": 96466,
      "Principal Recovered": 18977,
      "Service Fee Recovered": 2156,
      "Late Fees Recovered": 28.00,
      "FX Rate": 28.00
    },
    {
      "Date": "8/01/2025",
      "Telco Country": "Airtel Zambia",
      "Qualified Base": 282008,
      "Active Base": 920,
      "Lending Transactions": 162940,
      "Gross Lent": 136121,
      "Net Lent": 26819,
      "Service Fee Lent": 0,
      "Late Fees Charged": 847,
      "Recovery Transactions": 119415,
      "Gross Recovered": 96777,
      "Principal Recovered": 19707,
      "Service Fee Recovered": 2931,
      "Late Fees Recovered": 28.08,
      "FX Rate": 28.08
    },
    {
      "Date": "9/01/2025",
      "Telco Country": "Airtel Zambia",
      "Qualified Base": 282008,
      "Active Base": 932,
      "Lending Transactions": 161736,
      "Gross Lent": 135145,
      "Net Lent": 26591,
      "Service Fee Lent": 0,
      "Late Fees Charged": 845,
      "Recovery Transactions": 116783,
      "Gross Recovered": 95744,
      "Principal Recovered": 18486,
      "Service Fee Recovered": 2553,
      "Late Fees Recovered": 27.83,
      "FX Rate": 27.83
    },
    {
      "Date": "10/01/2025",
      "Telco Country": "Airtel Zambia",
      "Qualified Base": 282011,
      "Active Base": 1128,
      "Lending Transactions": 194844,
      "Gross Lent": 162868,
      "Net Lent": 31976,
      "Service Fee Lent": 0,
      "Late Fees Charged": 852,
      "Recovery Transactions": 111967,
      "Gross Recovered": 91952,
      "Principal Recovered": 17460,
      "Service Fee Recovered": 2555,
      "Late Fees Recovered": 27.78,
      "FX Rate": 27.78
    },
    {
      "Date": "11/01/2025",
      "Telco Country": "Airtel Zambia",
      "Qualified Base": 282011,
      "Active Base": 1016,
      "Lending Transactions": 175687,
      "Gross Lent": 146925,
      "Net Lent": 28762,
      "Service Fee Lent": 0,
      "Late Fees Charged": 779,
      "Recovery Transactions": 113239,
      "Gross Recovered": 92996,
      "Principal Recovered": 18253,
      "Service Fee Recovered": 1989,
      "Late Fees Recovered": 27.70,
      "FX Rate": 27.70
    },
    {
      "Date": "12/01/2025",
      "Telco Country": "Airtel Zambia",
      "Qualified Base": 282011,
      "Active Base": 1234,
      "Lending Transactions": 212544,
      "Gross Lent": 177915,
      "Net Lent": 34629,
      "Service Fee Lent": 0,
      "Late Fees Charged": 754,
      "Recovery Transactions": 103699,
      "Gross Recovered": 84927,
      "Principal Recovered": 16780,
      "Service Fee Recovered": 1992,
      "Late Fees Recovered": 27.70,
      "FX Rate": 27.70
    },
    {
      "Date": "13/01/2025",
      "Telco Country": "Airtel Zambia",
      "Qualified Base": 282011,
      "Active Base": 1071,
      "Lending Transactions": 181411,
      "Gross Lent": 152020,
      "Net Lent": 29391,
      "Service Fee Lent": 0,
      "Late Fees Charged": 782,
      "Recovery Transactions": 110325,
      "Gross Recovered": 90180,
      "Principal Recovered": 17726,
      "Service Fee Recovered": 2418,
      "Late Fees Recovered": 27.73,
      "FX Rate": 27.73
    },
    {
      "Date": "14/01/2025",
      "Telco Country": "Airtel Zambia",
      "Qualified Base": 282011,
      "Active Base": 331,
      "Lending Transactions": 57094,
      "Gross Lent": 47889,
      "Net Lent": 9205,
      "Service Fee Lent": 0,
      "Late Fees Charged": 549,
      "Recovery Transactions": 70952,
      "Gross Recovered": 57781,
      "Principal Recovered": 11608,
      "Service Fee Recovered": 1563,
      "Late Fees Recovered": 27.69,
      "FX Rate": 27.69
    },
    {
      "Date": "15/01/2025",
      "Telco Country": "Airtel Zambia",
      "Qualified Base": 282011,
      "Active Base": 1162,
      "Lending Transactions": 199284,
      "Gross Lent": 167261,
      "Net Lent": 32023,
      "Service Fee Lent": 0,
      "Late Fees Charged": 795,
      "Recovery Transactions": 114715,
      "Gross Recovered": 93684,
      "Principal Recovered": 18311,
      "Service Fee Recovered": 2720,
      "Late Fees Recovered": 27.75,
      "FX Rate": 27.75
    },
    {
      "Date": "16/01/2025",
      "Telco Country": "Airtel Zambia",
      "Qualified Base": 282011,
      "Active Base": 894,
      "Lending Transactions": 156904,
      "Gross Lent": 131533,
      "Net Lent": 25371,
      "Service Fee Lent": 0,
      "Late Fees Charged": 764,
      "Recovery Transactions": 105917,
      "Gross Recovered": 86326,
      "Principal Recovered": 16827,
      "Service Fee Recovered": 2764,
      "Late Fees Recovered": 27.81,
      "FX Rate": 27.81
    },
    {
      "Date": "17/01/2025",
      "Telco Country": "Airtel Zambia",
      "Qualified Base": 282011,
      "Active Base": 1556,
      "Lending Transactions": 267446,
      "Gross Lent": 224665,
      "Net Lent": 42781,
      "Service Fee Lent": 0,
      "Late Fees Charged": 811,
      "Recovery Transactions": 114456,
      "Gross Recovered": 93396,
      "Principal Recovered": 18374,
      "Service Fee Recovered": 2687,
      "Late Fees Recovered": 27.79,
      "FX Rate": 27.79
    },
    {
      "Date": "18/01/2025",
      "Telco Country": "Airtel Zambia",
      "Qualified Base": 282011,
      "Active Base": 1207,
      "Lending Transactions": 208803,
      "Gross Lent": 175612,
      "Net Lent": 33191,
      "Service Fee Lent": 0,
      "Late Fees Charged": 771,
      "Recovery Transactions": 102206,
      "Gross Recovered": 83597,
      "Principal Recovered": 16316,
      "Service Fee Recovered": 2292,
      "Late Fees Recovered": 27.92,
      "FX Rate": 27.92
    },
    {
      "Date": "19/01/2025",
      "Telco Country": "Airtel Zambia",
      "Qualified Base": 282011,
      "Active Base": 1111,
      "Lending Transactions": 190287,
      "Gross Lent": 160206,
      "Net Lent": 30081,
      "Service Fee Lent": 0,
      "Late Fees Charged": 509,
      "Recovery Transactions": 58737,
      "Gross Recovered": 47909,
      "Principal Recovered": 9499,
      "Service Fee Recovered": 1329,
      "Late Fees Recovered": 27.89,
      "FX Rate": 27.89
    },
    {
      "Date": "20/01/2025",
      "Telco Country": "Airtel Zambia",
      "Qualified Base": 282011,
      "Active Base": 918,
      "Lending Transactions": 157063,
      "Gross Lent": 132241,
      "Net Lent": 24822,
      "Service Fee Lent": 0,
      "Late Fees Charged": 587,
      "Recovery Transactions": 77399,
      "Gross Recovered": 64459,
      "Principal Recovered": 11864,
      "Service Fee Recovered": 1076,
      "Late Fees Recovered": 27.82,
      "FX Rate": 27.82
    },

    
    {
      "Date": "21/01/2025",
      "Telco Country": "Airtel Zambia",
      "Qualified Base": 282011,
      "Active Base": 1043,
      "Lending Transactions": 178397,
      "Gross Lent": 150252,
      "Net Lent": 28145,
      "Service Fee Lent": 0,
      "Late Fees Charged": 834,
      "Recovery Transactions": 119872,
      "Gross Recovered": 99326,
      "Principal Recovered": 19308,
      "Service Fee Recovered": 1238,
      "Late Fees Recovered": 27.89,
      "FX Rate": 27.89
    },
    {
      "Date": "22/01/2025",
      "Telco Country": "Airtel Zambia",
      "Qualified Base": 282011,
      "Active Base": 1060,
      "Lending Transactions": 176588,
      "Gross Lent": 149007,
      "Net Lent": 27581,
      "Service Fee Lent": 0,
      "Late Fees Charged": 840,
      "Recovery Transactions": 121645,
      "Gross Recovered": 99874,
      "Principal Recovered": 19796,
      "Service Fee Recovered": 1974,
      "Late Fees Recovered": 27.88,
      "FX Rate": 27.88
    },
    {
      "Date": "23/01/2025",
      "Telco Country": "Airtel Zambia",
      "Qualified Base": 282011,
      "Active Base": 956,
      "Lending Transactions": 163543,
      "Gross Lent": 137649,
      "Net Lent": 25894,
      "Service Fee Lent": 0,
      "Late Fees Charged": 1142,
      "Recovery Transactions": 186142,
      "Gross Recovered": 153432,
      "Principal Recovered": 29585,
      "Service Fee Recovered": 3125,
      "Late Fees Recovered": 27.81,
      "FX Rate": 27.81
    },
    {
      "Date": "24/01/2025",
      "Telco Country": "Airtel Zambia",
      "Qualified Base": 282011,
      "Active Base": 1014,
      "Lending Transactions": 179924,
      "Gross Lent": 150623,
      "Net Lent": 29301,
      "Service Fee Lent": 0,
      "Late Fees Charged": 1552,
      "Recovery Transactions": 261972,
      "Gross Recovered": 214961,
      "Principal Recovered": 41837,
      "Service Fee Recovered": 5174,
      "Late Fees Recovered": 27.90,
      "FX Rate": 27.90
    },
    {
      "Date": "25/01/2025",
      "Telco Country": "Airtel Zambia",
      "Qualified Base": 282011,
      "Active Base": 1123,
      "Lending Transactions": 207638,
      "Gross Lent": 173453,
      "Net Lent": 34185,
      "Service Fee Lent": 0,
      "Late Fees Charged": 1421,
      "Recovery Transactions": 229266,
      "Gross Recovered": 187966,
      "Principal Recovered": 37044,
      "Service Fee Recovered": 4256,
      "Late Fees Recovered": 27.85,
      "FX Rate": 27.85
    },
    {
      "Date": "26/01/2025",
      "Telco Country": "Airtel Zambia",
      "Qualified Base": 282011,
      "Active Base": 900,
      "Lending Transactions": 158858,
      "Gross Lent": 132930,
      "Net Lent": 25928,
      "Service Fee Lent": 0,
      "Late Fees Charged": 723,
      "Recovery Transactions": 107702,
      "Gross Recovered": 88759,
      "Principal Recovered": 17145,
      "Service Fee Recovered": 1799,
      "Late Fees Recovered": 27.84,
      "FX Rate": 27.84
    },
    {
      "Date": "27/01/2025",
      "Telco Country": "Airtel Zambia",
      "Qualified Base": 282011,
      "Active Base": 797,
      "Lending Transactions": 143192,
      "Gross Lent": 119555,
      "Net Lent": 23637,
      "Service Fee Lent": 0,
      "Late Fees Charged": 901,
      "Recovery Transactions": 140937,
      "Gross Recovered": 116348,
      "Principal Recovered": 23134,
      "Service Fee Recovered": 1455,
      "Late Fees Recovered": 27.87,
      "FX Rate": 27.87
    },
    {
      "Date": "28/01/2025",
      "Telco Country": "Airtel Zambia",
      "Qualified Base": 282011,
      "Active Base": 804,
      "Lending Transactions": 143142,
      "Gross Lent": 119788,
      "Net Lent": 23354,
      "Service Fee Lent": 0,
      "Late Fees Charged": 815,
      "Recovery Transactions": 126509,
      "Gross Recovered": 103871,
      "Principal Recovered": 20583,
      "Service Fee Recovered": 2055,
      "Late Fees Recovered": 27.90,
      "FX Rate": 27.90
    },
    {
      "Date": "29/01/2025",
      "Telco Country": "Airtel Zambia",
      "Qualified Base": 282011,
      "Active Base": 1097,
      "Lending Transactions": 197921,
      "Gross Lent": 165076,
      "Net Lent": 32845,
      "Service Fee Lent": 0,
      "Late Fees Charged": 1276,
      "Recovery Transactions": 202657,
      "Gross Recovered": 167017,
      "Principal Recovered": 32473,
      "Service Fee Recovered": 3167,
      "Late Fees Recovered": 27.95,
      "FX Rate": 27.95
    },
    {
      "Date": "30/01/2025",
      "Telco Country": "Airtel Zambia",
      "Qualified Base": 282011,
      "Active Base": 912,
      "Lending Transactions": 167498,
      "Gross Lent": 139866,
      "Net Lent": 27632,
      "Service Fee Lent": 0,
      "Late Fees Charged": 1037,
      "Recovery Transactions": 165603,
      "Gross Recovered": 135726,
      "Principal Recovered": 25570,
      "Service Fee Recovered": 4307,
      "Late Fees Recovered": 27.95,
      "FX Rate": 27.95
    },
    {
      "Date": "31/01/2025",
      "Telco Country": "Airtel Zambia",
      "Qualified Base": 282011,
      "Active Base": 977,
      "Lending Transactions": 174988,
      "Gross Lent": 146363,
      "Net Lent": 28625,
      "Service Fee Lent": 0,
      "Late Fees Charged": 1133,
      "Recovery Transactions": 172574,
      "Gross Recovered": 141540,
      "Principal Recovered": 27413,
      "Service Fee Recovered": 3621,
      "Late Fees Recovered": 27.99,
      "FX Rate": 27.99
    },
    {
      "Date": "01/02/2025",
      "Telco Country": "Airtel Zambia",
      "Qualified Base": 282011,
      "Active Base": 965,
      "Lending Transactions": 174937,
      "Gross Lent": 145902,
      "Net Lent": 29035,
      "Service Fee Lent": 0,
      "Late Fees Charged": 1054,
      "Recovery Transactions": 159904,
      "Gross Recovered": 131589,
      "Principal Recovered": 24850,
      "Service Fee Recovered": 3465,
      "Late Fees Recovered": 28.10,
      "FX Rate": 28.10
    },
    {
      "Date": "02/02/2025",
      "Telco Country": "Airtel Zambia",
      "Qualified Base": 282011,
      "Active Base": 1011,
      "Lending Transactions": 184619,
      "Gross Lent": 154035,
      "Net Lent": 30584,
      "Service Fee Lent": 0,
      "Late Fees Charged": 958,
      "Recovery Transactions": 149846,
      "Gross Recovered": 122293,
      "Principal Recovered": 23628,
      "Service Fee Recovered": 3926,
      "Late Fees Recovered": 28.10,
      "FX Rate": 28.10
    },
    {
      "Date": "03/02/2025",
      "Telco Country": "Airtel Zambia",
      "Qualified Base": 282011,
      "Active Base": 860,
      "Lending Transactions": 157152,
      "Gross Lent": 131173,
      "Net Lent": 25979,
      "Service Fee Lent": 0,
      "Late Fees Charged": 788,
      "Recovery Transactions": 113602,
      "Gross Recovered": 93738,
      "Principal Recovered": 17969,
      "Service Fee Recovered": 1895,
      "Late Fees Recovered": 28.05,
      "FX Rate": 28.05
    },
    {
      "Date": "04/02/2025",
      "Telco Country": "Airtel Zambia",
      "Qualified Base": 282011,
      "Active Base": 1007,
      "Lending Transactions": 178595,
      "Gross Lent": 149006,
      "Net Lent": 29589,
      "Service Fee Lent": 0,
      "Late Fees Charged": 1119,
      "Recovery Transactions": 168668,
      "Gross Recovered": 138143,
      "Principal Recovered": 27346,
      "Service Fee Recovered": 3178,
      "Late Fees Recovered": 28.06,
      "FX Rate": 28.06
    },
    {
      "Date": "05/02/2025",
      "Telco Country": "Airtel Zambia",
      "Qualified Base": 185520,
      "Active Base": 1103,
      "Lending Transactions": 208572,
      "Gross Lent": 174372,
      "Net Lent": 34200,
      "Service Fee Lent": 0,
      "Late Fees Charged": 1163,
      "Recovery Transactions": 172040,
      "Gross Recovered": 140886,
      "Principal Recovered": 27979,
      "Service Fee Recovered": 3175,
      "Late Fees Recovered": 28.07,
      "FX Rate": 28.07
    },
    {
      "Date": "06/02/2025",
      "Telco Country": "Airtel Zambia",
      "Qualified Base": 185520,
      "Active Base": 1285,
      "Lending Transactions": 256504,
      "Gross Lent": 214759,
      "Net Lent": 41745,
      "Service Fee Lent": 0,
      "Late Fees Charged": 1093,
      "Recovery Transactions": 164927,
      "Gross Recovered": 134060,
      "Principal Recovered": 26586,
      "Service Fee Recovered": 4280,
      "Late Fees Recovered": 28.08,
      "FX Rate": 28.08
    },
    {
      "Date": "07/02/2025",
      "Telco Country": "Airtel Zambia",
      "Qualified Base": 185520,
      "Active Base": 1040,
      "Lending Transactions": 211254,
      "Gross Lent": 176775,
      "Net Lent": 34479,
      "Service Fee Lent": 0,
      "Late Fees Charged": 885,
      "Recovery Transactions": 128288,
      "Gross Recovered": 104654,
      "Principal Recovered": 20343,
      "Service Fee Recovered": 3291,
      "Late Fees Recovered": 28.05,
      "FX Rate": 28.05
    },
    {
      "Date": "08/02/2025",
      "Telco Country": "Airtel Zambia",
      "Qualified Base": 185520,
      "Active Base": 1139,
      "Lending Transactions": 236342,
      "Gross Lent": 197904,
      "Net Lent": 38438,
      "Service Fee Lent": 0,
      "Late Fees Charged": 838,
      "Recovery Transactions": 127907,
      "Gross Recovered": 104367,
      "Principal Recovered": 20724,
      "Service Fee Recovered": 2817,
      "Late Fees Recovered": 28.17,
      "FX Rate": 28.17
    },
    {
      "Date": "09/02/2025",
      "Telco Country": "Airtel Zambia",
      "Qualified Base": 185520,
      "Active Base": 1061,
      "Lending Transactions": 214138,
      "Gross Lent": 179494,
      "Net Lent": 34644,
      "Service Fee Lent": 0,
      "Late Fees Charged": 690,
      "Recovery Transactions": 99524,
      "Gross Recovered": 81474,
      "Principal Recovered": 16174,
      "Service Fee Recovered": 1877,
      "Late Fees Recovered": 28.16,
      "FX Rate": 28.16
    },
    {
      "Date": "10/02/2025",
      "Telco Country": "Airtel Zambia",
      "Qualified Base": 185520,
      "Active Base": 964,
      "Lending Transactions": 201848,
      "Gross Lent": 169183,
      "Net Lent": 32665,
      "Service Fee Lent": 0,
      "Late Fees Charged": 802,
      "Recovery Transactions": 119256,
      "Gross Recovered": 97869,
      "Principal Recovered": 19183,
      "Service Fee Recovered": 2203,
      "Late Fees Recovered": 28.13,
      "FX Rate": 28.13
    },
    {
      "Date": "11/02/2025",
      "Telco Country": "Airtel Zambia",
      "Qualified Base": 185520,
      "Active Base": 951,
      "Lending Transactions": 185824,
      "Gross Lent": 156117,
      "Net Lent": 29707,
      "Service Fee Lent": 0,
      "Late Fees Charged": 855,
      "Recovery Transactions": 122706,
      "Gross Recovered": 100828,
      "Principal Recovered": 19347,
      "Service Fee Recovered": 2531,
      "Late Fees Recovered": 28.10,
      "FX Rate": 28.10
    },
    {
      "Date": "12/02/2025",
      "Telco Country": "Airtel Zambia",
      "Qualified Base": 185520,
      "Active Base": 971,
      "Lending Transactions": 195296,
      "Gross Lent": 164144,
      "Net Lent": 31152,
      "Service Fee Lent": 0,
      "Late Fees Charged": 935,
      "Recovery Transactions": 134654,
      "Gross Recovered": 110009,
      "Principal Recovered": 21330,
      "Service Fee Recovered": 3315,
      "Late Fees Recovered": 28.14,
      "FX Rate": 28.14
    },
    {
      "Date": "13/02/2025",
      "Telco Country": "Airtel Zambia",
      "Qualified Base": 185520,
      "Active Base": 917,
      "Lending Transactions": 181407,
      "Gross Lent": 152699,
      "Net Lent": 28708,
      "Service Fee Lent": 0,
      "Late Fees Charged": 875,
      "Recovery Transactions": 130164,
      "Gross Recovered": 107266,
      "Principal Recovered": 20019,
      "Service Fee Recovered": 2879,
      "Late Fees Recovered": 28.03,
      "FX Rate": 28.03
    },
    {
      "Date": "14/02/2025",
      "Telco Country": "Airtel Zambia",
      "Qualified Base": 185520,
      "Active Base": 1079,
      "Lending Transactions": 211264,
      "Gross Lent": 177426,
      "Net Lent": 33838,
      "Service Fee Lent": 0,
      "Late Fees Charged": 880,
      "Recovery Transactions": 125047,
      "Gross Recovered": 102730,
      "Principal Recovered": 19759,
      "Service Fee Recovered": 2558,
      "Late Fees Recovered": 28.11,
      "FX Rate": 28.11
    },
    {
      "Date": "15/02/2025",
      "Telco Country": "Airtel Zambia",
      "Qualified Base": 185520,
      "Active Base": 1012,
      "Lending Transactions": 202601,
      "Gross Lent": 170092,
      "Net Lent": 32509,
      "Service Fee Lent": 0,
      "Late Fees Charged": 779,
      "Recovery Transactions": 116529,
      "Gross Recovered": 95313,
      "Principal Recovered": 18640,
      "Service Fee Recovered": 2577,
      "Late Fees Recovered": 28.25,
      "FX Rate": 28.25
    },
    {
      "Date": "16/02/2025",
      "Telco Country": "Airtel Zambia",
      "Qualified Base": 185520,
      "Active Base": 922,
      "Lending Transactions": 177848,
      "Gross Lent": 149777,
      "Net Lent": 28071,
      "Service Fee Lent": 0,
      "Late Fees Charged": 617,
      "Recovery Transactions": 87330,
      "Gross Recovered": 71628,
      "Principal Recovered": 13723,
      "Service Fee Recovered": 1979,
      "Late Fees Recovered": 28.25,
      "FX Rate": 28.25
    },
    {
      "Date": "17/02/2025",
      "Telco Country": "Airtel Zambia",
      "Qualified Base": 185520,
      "Active Base": 913,
      "Lending Transactions": 179301,
      "Gross Lent": 150877,
      "Net Lent": 28424,
      "Service Fee Lent": 0,
      "Late Fees Charged": 776,
      "Recovery Transactions": 119540,
      "Gross Recovered": 98143,
      "Principal Recovered": 19324,
      "Service Fee Recovered": 2073,
      "Late Fees Recovered": 28.15,
      "FX Rate": 28.15
    },
    {
      "Date": "18/02/2025",
      "Telco Country": "Airtel Zambia",
      "Qualified Base": 185520,
      "Active Base": 917,
      "Lending Transactions": 182570,
      "Gross Lent": 154204,
      "Net Lent": 28366,
      "Service Fee Lent": 0,
      "Late Fees Charged": 848,
      "Recovery Transactions": 123740,
      "Gross Recovered": 102219,
      "Principal Recovered": 18821,
      "Service Fee Recovered": 2700,
      "Late Fees Recovered": 28.12,
      "FX Rate": 28.12
    },
    {
      "Date": "19/02/2025",
      "Telco Country": "Airtel Zambia",
      "Qualified Base": 185520,
      "Active Base": 863,
      "Lending Transactions": 166539,
      "Gross Lent": 140427,
      "Net Lent": 26112,
      "Service Fee Lent": 0,
      "Late Fees Charged": 829,
      "Recovery Transactions": 126233,
      "Gross Recovered": 103352,
      "Principal Recovered": 19778,
      "Service Fee Recovered": 3102,
      "Late Fees Recovered": 28.18,
      "FX Rate": 28.18
  },
  
    // Add more objects following the same structure...
  ];

  const parseDate = (dateString) => new Date(dateString);

// Function to calculate NPL rate
const calculateNPL = (data) => {
  const totalLent = data.reduce((acc, curr) => acc + parseFloat(curr["Gross Lent"]), 0);
  const totalRecovered = data.reduce((acc, curr) => acc + parseFloat(curr["Gross Recovered"]), 0);
  return ((totalLent - totalRecovered) / totalLent) * 100;
};

const revenueData = rawData.map((day) => ({
  date: day.Date,
  serviceFees: day["Service Fee Recovered"],
  lateFees: day["Late Fees Recovered"],
  totalRevenue:
    day["Service Fee Lent"] + day["Late Fees Recovered"],
}));

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div className="p-4 bg-gray-50 flex flex-col w-full">
      <h1 className="text-2xl font-bold mb-6 text-center w-full">
        Emerald Finance Performance Dashboard
      </h1>

      <button 
        className="self-end bg-red-500 text-white px-4 py-2 rounded mb-4"
        onClick={() => {
          localStorage.removeItem("user");
          setUser(null);
        }}
      >
        Logout
      </button>
      

      <DashboardCard title="User Trends">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={rawData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Date" />
            <YAxis yAxisId="left" stroke="#8884d8" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Qualified Base" stroke="#8884d8" yAxisId="left" />
            <Line type="monotone" dataKey="Active Base" stroke="#82ca9d" yAxisId="right" />
          </LineChart>
        </ResponsiveContainer>
      </DashboardCard>

      <DashboardCard title="Daily Disbursements">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={rawData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Gross Lent" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </DashboardCard>

      <DashboardCard title="Daily Recoveries">
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={rawData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Gross Recovered" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  </DashboardCard>

      <DashboardCard title="Revenue Trends" >
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={revenueData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="totalRevenue" stroke="#ffc658" />
      </LineChart>
    </ResponsiveContainer>
  </DashboardCard>

      <DashboardCard title="Total NPL Distribution">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={[
                { name: "Performing", value: 100 - calculateNPL(rawData) },
                { name: "Non-Performing", value: calculateNPL(rawData) },
              ]}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ percent }) => `${(percent * 100).toFixed(2)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              <Cell key="cell-0" fill="#0088FE" />
              <Cell key="cell-1" fill="#FF8042" />
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </DashboardCard>
    </div>
  );
};

export default App;
