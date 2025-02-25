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
    "Date": "01/01/2025",
    "Telco Country": "Airtel Zambia",
    "Qualified Base": 282008,
    "Active Base": 315,
    "Lending Transactions": 315,
    "Gross Lent": 54710,
    "Net Lent": 45745,
    "Service Fee Lent": 8965,
    "Late Fees Charged": 0,
    "Recovery Transactions": 700,
    "Gross Recovered": 98553,
    "Principal Recovered": 80592,
    "Service Fee Recovered": 16279,
    "Late Fees Recovered": 1683,
    "FX Rate": 28.00
},
{
    "Date": "02/01/2025",
    "Telco Country": "Airtel Zambia",
    "Qualified Base": 282008,
    "Active Base": 187,
    "Lending Transactions": 187,
    "Gross Lent": 32135,
    "Net Lent": 26760,
    "Service Fee Lent": 5375,
    "Late Fees Charged": 0,
    "Recovery Transactions": 813,
    "Gross Recovered": 113453,
    "Principal Recovered": 91762,
    "Service Fee Recovered": 18757,
    "Late Fees Recovered": 2934,
    "FX Rate": 27.93
},
{
    "Date": "03/01/2025",
    "Telco Country": "Airtel Zambia",
    "Qualified Base": 282008,
    "Active Base": 968,
    "Lending Transactions": 969,
    "Gross Lent": 175899,
    "Net Lent": 146984,
    "Service Fee Lent": 28915,
    "Late Fees Charged": 0,
    "Recovery Transactions": 1193,
    "Gross Recovered": 178160,
    "Principal Recovered": 146801,
    "Service Fee Recovered": 29071,
    "Late Fees Recovered": 2288,
    "FX Rate": 27.95
},
{
    "Date": "04/01/2025",
    "Telco Country": "Airtel Zambia",
    "Qualified Base": 282008,
    "Active Base": 1049,
    "Lending Transactions": 1049,
    "Gross Lent": 184675,
    "Net Lent": 154198,
    "Service Fee Lent": 30477,
    "Late Fees Charged": 0,
    "Recovery Transactions": 1025,
    "Gross Recovered": 142799,
    "Principal Recovered": 117320,
    "Service Fee Recovered": 22974,
    "Late Fees Recovered": 2505,
    "FX Rate": 28.05
},
{
    "Date": "05/01/2025",
    "Telco Country": "Airtel Zambia",
    "Qualified Base": 282008,
    "Active Base": 988,
    "Lending Transactions": 991,
    "Gross Lent": 174417,
    "Net Lent": 145659,
    "Service Fee Lent": 28758,
    "Late Fees Charged": 0,
    "Recovery Transactions": 845,
    "Gross Recovered": 118751,
    "Principal Recovered": 97627,
    "Service Fee Recovered": 18933,
    "Late Fees Recovered": 2191,
    "FX Rate": 28.04
},
{
    "Date": "06/01/2025",
    "Telco Country": "Airtel Zambia",
    "Qualified Base": 282008,
    "Active Base": 1016,
    "Lending Transactions": 1017,
    "Gross Lent": 179900,
    "Net Lent": 150423,
    "Service Fee Lent": 29477,
    "Late Fees Charged": 0,
    "Recovery Transactions": 1019,
    "Gross Recovered": 143773,
    "Principal Recovered": 117551,
    "Service Fee Recovered": 23445,
    "Late Fees Recovered": 2777,
    "FX Rate": 27.94
},
{
    "Date": "07/01/2025",
    "Telco Country": "Airtel Zambia",
    "Qualified Base": 282008,
    "Active Base": 854,
    "Lending Transactions": 854,
    "Gross Lent": 155287,
    "Net Lent": 129605,
    "Service Fee Lent": 25682,
    "Late Fees Charged": 0,
    "Recovery Transactions": 853,
    "Gross Recovered": 117599,
    "Principal Recovered": 96466,
    "Service Fee Recovered": 18977,
    "Late Fees Recovered": 2156,
    "FX Rate": 28.00
},
{
    "Date": "08/01/2025",
    "Telco Country": "Airtel Zambia",
    "Qualified Base": 282008,
    "Active Base": 920,
    "Lending Transactions": 922,
    "Gross Lent": 162940,
    "Net Lent": 136121,
    "Service Fee Lent": 26819,
    "Late Fees Charged": 0,
    "Recovery Transactions": 847,
    "Gross Recovered": 119415,
    "Principal Recovered": 96777,
    "Service Fee Recovered": 19707,
    "Late Fees Recovered": 2931,
    "FX Rate": 28.08
},
{
    "Date": "09/01/2025",
    "Telco Country": "Airtel Zambia",
    "Qualified Base": 282008,
    "Active Base": 932,
    "Lending Transactions": 933,
    "Gross Lent": 161736,
    "Net Lent": 135145,
    "Service Fee Lent": 26591,
    "Late Fees Charged": 0,
    "Recovery Transactions": 845,
    "Gross Recovered": 116783,
    "Principal Recovered": 95744,
    "Service Fee Recovered": 18486,
    "Late Fees Recovered": 2553,
    "FX Rate": 27.83
},
{
    "Date": "10/01/2025",
    "Telco Country": "Airtel Zambia",
    "Qualified Base": 282011,
    "Active Base": 1128,
    "Lending Transactions": 1130,
    "Gross Lent": 194844,
    "Net Lent": 162868,
    "Service Fee Lent": 31976,
    "Late Fees Charged": 0,
    "Recovery Transactions": 852,
    "Gross Recovered": 111967,
    "Principal Recovered": 91952,
    "Service Fee Recovered": 17460,
    "Late Fees Recovered": 2555,
    "FX Rate": 27.78
},
{
    "Date": "11/01/2025",
    "Telco Country": "Airtel Zambia",
    "Qualified Base": 282011,
    "Active Base": 1016,
    "Lending Transactions": 1017,
    "Gross Lent": 175687,
    "Net Lent": 146925,
    "Service Fee Lent": 28762,
    "Late Fees Charged": 0,
    "Recovery Transactions": 779,
    "Gross Recovered": 113239,
    "Principal Recovered": 92996,
    "Service Fee Recovered": 18253,
    "Late Fees Recovered": 1989,
    "FX Rate": 27.70
},
{
    "Date": "12/01/2025",
    "Telco Country": "Airtel Zambia",
    "Qualified Base": 282011,
    "Active Base": 1234,
    "Lending Transactions": 1235,
    "Gross Lent": 212544,
    "Net Lent": 177915,
    "Service Fee Lent": 34629,
    "Late Fees Charged": 0,
    "Recovery Transactions": 754,
    "Gross Recovered": 103699,
    "Principal Recovered": 84927,
    "Service Fee Recovered": 16780,
    "Late Fees Recovered": 1992,
    "FX Rate": 27.70
},
{
    "Date": "13/01/2025",
    "Telco Country": "Airtel Zambia",
    "Qualified Base": 282011,
    "Active Base": 1071,
    "Lending Transactions": 1075,
    "Gross Lent": 181411,
    "Net Lent": 152020,
    "Service Fee Lent": 29391,
    "Late Fees Charged": 0,
    "Recovery Transactions": 782,
    "Gross Recovered": 110325,
    "Principal Recovered": 90180,
    "Service Fee Recovered": 17726,
    "Late Fees Recovered": 2418,
    "FX Rate": 27.73
},
{
    "Date": "14/01/2025",
    "Telco Country": "Airtel Zambia",
    "Qualified Base": 282011,
    "Active Base": 331,
    "Lending Transactions": 332,
    "Gross Lent": 57094,
    "Net Lent": 47889,
    "Service Fee Lent": 9205,
    "Late Fees Charged": 0,
    "Recovery Transactions": 549,
    "Gross Recovered": 70952,
    "Principal Recovered": 57781,
    "Service Fee Recovered": 11608,
    "Late Fees Recovered": 1563,
    "FX Rate": 27.69
},
{
    "Date": "15/01/2025",
    "Telco Country": "Airtel Zambia",
    "Qualified Base": 282011,
    "Active Base": 1162,
    "Lending Transactions": 1166,
    "Gross Lent": 199284,
    "Net Lent": 167261,
    "Service Fee Lent": 32023,
    "Late Fees Charged": 0,
    "Recovery Transactions": 795,
    "Gross Recovered": 114715,
    "Principal Recovered": 93684,
    "Service Fee Recovered": 18311,
    "Late Fees Recovered": 2720,
    "FX Rate": 27.75
},
{
    "Date": "16/01/2025",
    "Telco Country": "Airtel Zambia",
    "Qualified Base": 282011,
    "Active Base": 894,
    "Lending Transactions": 895,
    "Gross Lent": 156904,
    "Net Lent": 131533,
    "Service Fee Lent": 25371,
    "Late Fees Charged": 0,
    "Recovery Transactions": 764,
    "Gross Recovered": 105917,
    "Principal Recovered": 86326,
    "Service Fee Recovered": 16827,
    "Late Fees Recovered": 2764,
    "FX Rate": 27.81
},
{
    "Date": "17/01/2025",
    "Telco Country": "Airtel Zambia",
    "Qualified Base": 282011,
    "Active Base": 1556,
    "Lending Transactions": 1560,
    "Gross Lent": 267446,
    "Net Lent": 224665,
    "Service Fee Lent": 42781,
    "Late Fees Charged": 0,
    "Recovery Transactions": 811,
    "Gross Recovered": 114456,
    "Principal Recovered": 93396,
    "Service Fee Recovered": 18374,
    "Late Fees Recovered": 2687,
    "FX Rate": 27.79
},
{
    "Date": "18/01/2025",
    "Telco Country": "Airtel Zambia",
    "Qualified Base": 282011,
    "Active Base": 1207,
    "Lending Transactions": 1209,
    "Gross Lent": 208803,
    "Net Lent": 175612,
    "Service Fee Lent": 33191,
    "Late Fees Charged": 0,
    "Recovery Transactions": 771,
    "Gross Recovered": 102206,
    "Principal Recovered": 83597,
    "Service Fee Recovered": 16316,
    "Late Fees Recovered": 2292,
    "FX Rate": 27.92
},
{
    "Date": "19/01/2025",
    "Telco Country": "Airtel Zambia",
    "Qualified Base": 282011,
    "Active Base": 1111,
    "Lending Transactions": 1113,
    "Gross Lent": 190287,
    "Net Lent": 160206,
    "Service Fee Lent": 30081,
    "Late Fees Charged": 0,
    "Recovery Transactions": 509,
    "Gross Recovered": 58737,
    "Principal Recovered": 47909,
    "Service Fee Recovered": 9499,
    "Late Fees Recovered": 1329,
    "FX Rate": 27.89
},
{
    "Date": "20/01/2025",
    "Telco Country": "Airtel Zambia",
    "Qualified Base": 282011,
    "Active Base": 918,
    "Lending Transactions": 920,
    "Gross Lent": 157063,
    "Net Lent": 132241,
    "Service Fee Lent": 24822,
    "Late Fees Charged": 0,
    "Recovery Transactions": 587,
    "Gross Recovered": 77399,
    "Principal Recovered": 64459,
    "Service Fee Recovered": 11864,
    "Late Fees Recovered": 1076,
    "FX Rate": 27.82
},
{
  "Date": "21/01/2025",
  "Telco Country": "Airtel Zambia",
  "Qualified Base": 282011,
  "Active Base": 1043,
  "Lending Transactions": 1045,
  "Gross Lent": 178397,
  "Net Lent": 150252,
  "Service Fee Lent": 28145,
  "Late Fees Charged": 0,
  "Recovery Transactions": 834,
  "Gross Recovered": 119872,
  "Principal Recovered": 99326,
  "Service Fee Recovered": 19308,
  "Late Fees Recovered": 1238,
  "FX Rate": 27.89
},
{
  "Date": "22/01/2025",
  "Telco Country": "Airtel Zambia",
  "Qualified Base": 282011,
  "Active Base": 1060,
  "Lending Transactions": 1062,
  "Gross Lent": 176588,
  "Net Lent": 149007,
  "Service Fee Lent": 27581,
  "Late Fees Charged": 0,
  "Recovery Transactions": 840,
  "Gross Recovered": 121645,
  "Principal Recovered": 99874,
  "Service Fee Recovered": 19796,
  "Late Fees Recovered": 1974,
  "FX Rate": 27.88
},
{
  "Date": "23/01/2025",
  "Telco Country": "Airtel Zambia",
  "Qualified Base": 282011,
  "Active Base": 956,
  "Lending Transactions": 958,
  "Gross Lent": 163543,
  "Net Lent": 137649,
  "Service Fee Lent": 25894,
  "Late Fees Charged": 0,
  "Recovery Transactions": 1142,
  "Gross Recovered": 186142,
  "Principal Recovered": 153432,
  "Service Fee Recovered": 29585,
  "Late Fees Recovered": 3125,
  "FX Rate": 27.81
},
{
  "Date": "24/01/2025",
  "Telco Country": "Airtel Zambia",
  "Qualified Base": 282011,
  "Active Base": 1014,
  "Lending Transactions": 1015,
  "Gross Lent": 179924,
  "Net Lent": 150623,
  "Service Fee Lent": 29301,
  "Late Fees Charged": 0,
  "Recovery Transactions": 1552,
  "Gross Recovered": 261972,
  "Principal Recovered": 214961,
  "Service Fee Recovered": 41837,
  "Late Fees Recovered": 5174,
  "FX Rate": 27.90
},
{
  "Date": "25/01/2025",
  "Telco Country": "Airtel Zambia",
  "Qualified Base": 282011,
  "Active Base": 1123,
  "Lending Transactions": 1126,
  "Gross Lent": 207638,
  "Net Lent": 173453,
  "Service Fee Lent": 34185,
  "Late Fees Charged": 0,
  "Recovery Transactions": 1421,
  "Gross Recovered": 229266,
  "Principal Recovered": 187966,
  "Service Fee Recovered": 37044,
  "Late Fees Recovered": 4256,
  "FX Rate": 27.85
},
{
  "Date": "26/01/2025",
  "Telco Country": "Airtel Zambia",
  "Qualified Base": 282011,
  "Active Base": 900,
  "Lending Transactions": 903,
  "Gross Lent": 158858,
  "Net Lent": 132930,
  "Service Fee Lent": 25928,
  "Late Fees Charged": 0,
  "Recovery Transactions": 723,
  "Gross Recovered": 107702,
  "Principal Recovered": 88759,
  "Service Fee Recovered": 17145,
  "Late Fees Recovered": 1799,
  "FX Rate": 27.84
},
{
  "Date": "27/01/2025",
  "Telco Country": "Airtel Zambia",
  "Qualified Base": 282011,
  "Active Base": 797,
  "Lending Transactions": 798,
  "Gross Lent": 143192,
  "Net Lent": 119555,
  "Service Fee Lent": 23637,
  "Late Fees Charged": 0,
  "Recovery Transactions": 901,
  "Gross Recovered": 140937,
  "Principal Recovered": 116348,
  "Service Fee Recovered": 23134,
  "Late Fees Recovered": 1455,
  "FX Rate": 27.87
},
{
  "Date": "28/01/2025",
  "Telco Country": "Airtel Zambia",
  "Qualified Base": 282011,
  "Active Base": 804,
  "Lending Transactions": 808,
  "Gross Lent": 143142,
  "Net Lent": 119788,
  "Service Fee Lent": 23354,
  "Late Fees Charged": 0,
  "Recovery Transactions": 815,
  "Gross Recovered": 126509,
  "Principal Recovered": 103871,
  "Service Fee Recovered": 20583,
  "Late Fees Recovered": 2055,
  "FX Rate": 27.90
},
{
  "Date": "29/01/2025",
  "Telco Country": "Airtel Zambia",
  "Qualified Base": 282011,
  "Active Base": 1097,
  "Lending Transactions": 1100,
  "Gross Lent": 197921,
  "Net Lent": 165076,
  "Service Fee Lent": 32845,
  "Late Fees Charged": 0,
  "Recovery Transactions": 1276,
  "Gross Recovered": 202657,
  "Principal Recovered": 167017,
  "Service Fee Recovered": 32473,
  "Late Fees Recovered": 3167,
  "FX Rate": 27.95
},
{
  "Date": "30/01/2025",
  "Telco Country": "Airtel Zambia",
  "Qualified Base": 282011,
  "Active Base": 912,
  "Lending Transactions": 916,
  "Gross Lent": 167498,
  "Net Lent": 139866,
  "Service Fee Lent": 27632,
  "Late Fees Charged": 0,
  "Recovery Transactions": 1037,
  "Gross Recovered": 165603,
  "Principal Recovered": 135726,
  "Service Fee Recovered": 25570,
  "Late Fees Recovered": 4307,
  "FX Rate": 27.95
},
{
  "Date": "31/01/2025",
  "Telco Country": "Airtel Zambia",
  "Qualified Base": 282011,
  "Active Base": 977,
  "Lending Transactions": 981,
  "Gross Lent": 174988,
  "Net Lent": 146363,
  "Service Fee Lent": 28625,
  "Late Fees Charged": 0,
  "Recovery Transactions": 1133,
  "Gross Recovered": 172574,
  "Principal Recovered": 141540,
  "Service Fee Recovered": 27413,
  "Late Fees Recovered": 3621,
  "FX Rate": 27.99
},
{
  "Date": "01/02/2025",
  "Telco Country": "Airtel Zambia",
  "Qualified Base": 282011,
  "Active Base": 965,
  "Lending Transactions": 965,
  "Gross Lent": 174937,
  "Net Lent": 145902,
  "Service Fee Lent": 29035,
  "Late Fees Charged": 0,
  "Recovery Transactions": 1054,
  "Gross Recovered": 159904,
  "Principal Recovered": 131589,
  "Service Fee Recovered": 24850,
  "Late Fees Recovered": 3465,
  "FX Rate": 28.10
},
{
  "Date": "02/02/2025",
  "Telco Country": "Airtel Zambia",
  "Qualified Base": 282011,
  "Active Base": 1011,
  "Lending Transactions": 1014,
  "Gross Lent": 184619,
  "Net Lent": 154035,
  "Service Fee Lent": 30584,
  "Late Fees Charged": 0,
  "Recovery Transactions": 958,
  "Gross Recovered": 149846,
  "Principal Recovered": 122293,
  "Service Fee Recovered": 23628,
  "Late Fees Recovered": 3926,
  "FX Rate": 28.10
},
{
  "Date": "03/02/2025",
  "Telco Country": "Airtel Zambia",
  "Qualified Base": 282011,
  "Active Base": 860,
  "Lending Transactions": 865,
  "Gross Lent": 157152,
  "Net Lent": 131173,
  "Service Fee Lent": 25979,
  "Late Fees Charged": 0,
  "Recovery Transactions": 788,
  "Gross Recovered": 113602,
  "Principal Recovered": 93738,
  "Service Fee Recovered": 17969,
  "Late Fees Recovered": 1895,
  "FX Rate": 28.05
},
{
  "Date": "04/02/2025",
  "Telco Country": "Airtel Zambia",
  "Qualified Base": 282011,
  "Active Base": 1007,
  "Lending Transactions": 1009,
  "Gross Lent": 178595,
  "Net Lent": 149006,
  "Service Fee Lent": 29589,
  "Late Fees Charged": 0,
  "Recovery Transactions": 1119,
  "Gross Recovered": 168668,
  "Principal Recovered": 138143,
  "Service Fee Recovered": 27346,
  "Late Fees Recovered": 3178,
  "FX Rate": 28.06
},
{
  "Date": "05/02/2025",
  "Telco Country": "Airtel Zambia",
  "Qualified Base": 185520,
  "Active Base": 1103,
  "Lending Transactions": 1106,
  "Gross Lent": 208572,
  "Net Lent": 174372,
  "Service Fee Lent": 34200,
  "Late Fees Charged": 0,
  "Recovery Transactions": 1163,
  "Gross Recovered": 172040,
  "Principal Recovered": 140886,
  "Service Fee Recovered": 27979,
  "Late Fees Recovered": 3175,
  "FX Rate": 28.07
},
{
  "Date": "06/02/2025",
  "Telco Country": "Airtel Zambia",
  "Qualified Base": 185520,
  "Active Base": 1285,
  "Lending Transactions": 1290,
  "Gross Lent": 256504,
  "Net Lent": 214759,
  "Service Fee Lent": 41745,
  "Late Fees Charged": 0,
  "Recovery Transactions": 1093,
  "Gross Recovered": 164927,
  "Principal Recovered": 134060,
  "Service Fee Recovered": 26586,
  "Late Fees Recovered": 4280,
  "FX Rate": 28.08
},
{
  "Date": "07/02/2025",
  "Telco Country": "Airtel Zambia",
  "Qualified Base": 185520,
  "Active Base": 1040,
  "Lending Transactions": 1043,
  "Gross Lent": 211254,
  "Net Lent": 176775,
  "Service Fee Lent": 34479,
  "Late Fees Charged": 0,
  "Recovery Transactions": 885,
  "Gross Recovered": 128288,
  "Principal Recovered": 104654,
  "Service Fee Recovered": 20343,
  "Late Fees Recovered": 3291,
  "FX Rate": 28.05
},
{
  "Date": "08/02/2025",
  "Telco Country": "Airtel Zambia",
  "Qualified Base": 185520,
  "Active Base": 1139,
  "Lending Transactions": 1144,
  "Gross Lent": 236342,
  "Net Lent": 197904,
  "Service Fee Lent": 38438,
  "Late Fees Charged": 0,
  "Recovery Transactions": 838,
  "Gross Recovered": 127907,
  "Principal Recovered": 104367,
  "Service Fee Recovered": 20724,
  "Late Fees Recovered": 2817,
  "FX Rate": 28.17
},
{
  "Date": "09/02/2025",
  "Telco Country": "Airtel Zambia",
  "Qualified Base": 185520,
  "Active Base": 1061,
  "Lending Transactions": 1067,
  "Gross Lent": 214138,
  "Net Lent": 179494,
  "Service Fee Lent": 34644,
  "Late Fees Charged": 0,
  "Recovery Transactions": 690,
  "Gross Recovered": 99524,
  "Principal Recovered": 81474,
  "Service Fee Recovered": 16174,
  "Late Fees Recovered": 1877,
  "FX Rate": 28.16
},
{
  "Date": "10/02/2025",
  "Telco Country": "Airtel Zambia",
  "Qualified Base": 185520,
  "Active Base": 964,
  "Lending Transactions": 969,
  "Gross Lent": 201848,
  "Net Lent": 169183,
  "Service Fee Lent": 32665,
  "Late Fees Charged": 0,
  "Recovery Transactions": 802,
  "Gross Recovered": 119256,
  "Principal Recovered": 97869,
  "Service Fee Recovered": 19183,
  "Late Fees Recovered": 2203,
  "FX Rate": 28.13
},
{
  "Date": "11/02/2025",
  "Telco Country": "Airtel Zambia",
  "Qualified Base": 185520,
  "Active Base": 951,
  "Lending Transactions": 951,
  "Gross Lent": 185824,
  "Net Lent": 156117,
  "Service Fee Lent": 29707,
  "Late Fees Charged": 0,
  "Recovery Transactions": 855,
  "Gross Recovered": 122706,
  "Principal Recovered": 100828,
  "Service Fee Recovered": 19347,
  "Late Fees Recovered": 2531,
  "FX Rate": 28.10
},
{
  "Date": "12/02/2025",
  "Telco Country": "Airtel Zambia",
  "Qualified Base": 185520,
  "Active Base": 971,
  "Lending Transactions": 974,
  "Gross Lent": 195296,
  "Net Lent": 164144,
  "Service Fee Lent": 31152,
  "Late Fees Charged": 0,
  "Recovery Transactions": 935,
  "Gross Recovered": 134654,
  "Principal Recovered": 110009,
  "Service Fee Recovered": 21330,
  "Late Fees Recovered": 3315,
  "FX Rate": 28.14
},
{
  "Date": "13/02/2025",
  "Telco Country": "Airtel Zambia",
  "Qualified Base": 185520,
  "Active Base": 917,
  "Lending Transactions": 919,
  "Gross Lent": 181407,
  "Net Lent": 152699,
  "Service Fee Lent": 28708,
  "Late Fees Charged": 0,
  "Recovery Transactions": 875,
  "Gross Recovered": 130164,
  "Principal Recovered": 107266,
  "Service Fee Recovered": 20019,
  "Late Fees Recovered": 2879,
  "FX Rate": 28.03
},
{
  "Date": "14/02/2025",
  "Telco Country": "Airtel Zambia",
  "Qualified Base": 185520,
  "Active Base": 1079,
  "Lending Transactions": 1079,
  "Gross Lent": 211264,
  "Net Lent": 177426,
  "Service Fee Lent": 33838,
  "Late Fees Charged": 0,
  "Recovery Transactions": 880,
  "Gross Recovered": 125047,
  "Principal Recovered": 102730,
  "Service Fee Recovered": 19759,
  "Late Fees Recovered": 2558,
  "FX Rate": 28.11
},
{
  "Date": "15/02/2025",
  "Telco Country": "Airtel Zambia",
  "Qualified Base": 185520,
  "Active Base": 1012,
  "Lending Transactions": 1014,
  "Gross Lent": 202601,
  "Net Lent": 170092,
  "Service Fee Lent": 32509,
  "Late Fees Charged": 0,
  "Recovery Transactions": 779,
  "Gross Recovered": 116529,
  "Principal Recovered": 95313,
  "Service Fee Recovered": 18640,
  "Late Fees Recovered": 2577,
  "FX Rate": 28.25
},
{
  "Date": "16/02/2025",
  "Telco Country": "Airtel Zambia",
  "Qualified Base": 185520,
  "Active Base": 922,
  "Lending Transactions": 927,
  "Gross Lent": 177848,
  "Net Lent": 149777,
  "Service Fee Lent": 28071,
  "Late Fees Charged": 0,
  "Recovery Transactions": 617,
  "Gross Recovered": 87330,
  "Principal Recovered": 71628,
  "Service Fee Recovered": 13723,
  "Late Fees Recovered": 1979,
  "FX Rate": 28.25
},
{
  "Date": "17/02/2025",
  "Telco Country": "Airtel Zambia",
  "Qualified Base": 185520,
  "Active Base": 913,
  "Lending Transactions": 918,
  "Gross Lent": 179301,
  "Net Lent": 150877,
  "Service Fee Lent": 28424,
  "Late Fees Charged": 0,
  "Recovery Transactions": 776,
  "Gross Recovered": 119540,
  "Principal Recovered": 98143,
  "Service Fee Recovered": 19324,
  "Late Fees Recovered": 2073,
  "FX Rate": 28.15
},
{
  "Date": "18/02/2025",
  "Telco Country": "Airtel Zambia",
  "Qualified Base": 185520,
  "Active Base": 917,
  "Lending Transactions": 919,
  "Gross Lent": 182570,
  "Net Lent": 154204,
  "Service Fee Lent": 28366,
  "Late Fees Charged": 0,
  "Recovery Transactions": 848,
  "Gross Recovered": 123740,
  "Principal Recovered": 102219,
  "Service Fee Recovered": 18821,
  "Late Fees Recovered": 2700,
  "FX Rate": 28.12
},
{
  "Date": "19/02/2025",
  "Telco Country": "Airtel Zambia",
  "Qualified Base": 185520,
  "Active Base": 863,
  "Lending Transactions": 865,
  "Gross Lent": 166539,
  "Net Lent": 140427,
  "Service Fee Lent": 26112,
  "Late Fees Charged": 0,
  "Recovery Transactions": 829,
  "Gross Recovered": 126233,
  "Principal Recovered": 103347,
  "Service Fee Recovered": 19778,
  "Late Fees Recovered": 3108,
  "FX Rate": 28.18
},
{
  "Date": "20/02/2025",
  "Telco Country": "Airtel Zambia",
  "Qualified Base": 185520,
  "Active Base": 938,
  "Lending Transactions": 941,
  "Gross Lent": 182832,
  "Net Lent": 154695,
  "Service Fee Lent": 28137,
  "Late Fees Charged": 0,
  "Recovery Transactions": 848,
  "Gross Recovered": 129478,
  "Principal Recovered": 105964,
  "Service Fee Recovered": 19800,
  "Late Fees Recovered": 3714,
  "FX Rate": 28.20
},
{
  "Date": "21/02/2025",
  "Telco Country": "Airtel Zambia",
  "Qualified Base": 185520,
  "Active Base": 818,
  "Lending Transactions": 821,
  "Gross Lent": 157843,
  "Net Lent": 133143,
  "Service Fee Lent": 24700,
  "Late Fees Charged": 0,
  "Recovery Transactions": 724,
  "Gross Recovered": 108173,
  "Principal Recovered": 88500,
  "Service Fee Recovered": 17366,
  "Late Fees Recovered": 2306,
  "FX Rate": 28.19
},
{
  "Date": "22/02/2025",
  "Telco Country": "Airtel Zambia",
  "Qualified Base": 185520,
  "Active Base": 703,
  "Lending Transactions": 704,
  "Gross Lent": 135109,
  "Net Lent": 114354,
  "Service Fee Lent": 20755,
  "Late Fees Charged": 0,
  "Recovery Transactions": 519,
  "Gross Recovered": 78386,
  "Principal Recovered": 64732,
  "Service Fee Recovered": 12021,
  "Late Fees Recovered": 1634,
  "FX Rate": 28.37
},
{
  "Date": "23/02/2025",
  "Telco Country": "Airtel Zambia",
  "Qualified Base": 185520,
  "Active Base": 693,
  "Lending Transactions": 694,
  "Gross Lent": 132148,
  "Net Lent": 112146,
  "Service Fee Lent": 20002,
  "Late Fees Charged": 0,
  "Recovery Transactions": 432,
  "Gross Recovered": 67369,
  "Principal Recovered": 55909,
  "Service Fee Recovered": 10348,
  "Late Fees Recovered": 1112,
  "FX Rate": 28.23
}
  
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
  date: new Date(day.Date.split("/").reverse().join("-")), // Convert date format
  serviceFees: day["Service Fee Recovered"] || 0,
  lateFees: day["Late Fees Recovered"] || 0,
  totalRevenue: (day["Service Fee Recovered"] || 0) + (day["Late Fees Recovered"] || 0),
})).sort((a, b) => a.date.getTime() - b.date.getTime()); // Ensure sorting


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
        <XAxis dataKey="date"  tickFormatter={(date) => date.toLocaleDateString()}  type="category"  allowDuplicatedCategory={false} 
/>

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
