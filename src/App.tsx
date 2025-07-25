import React, { useState, useEffect } from "react";
import { Calendar, FileText, Folder, Home, Users } from "lucide-react";
import Sidebar from "./Sidebar"; 
import { BrowserRouter as Router, Routes, Route, useNavigate, Link } from "react-router-dom";
import Day7 from "./Day7";
import Day14 from "./Day14";
import Day21 from "./Day21";
import Day30 from "./Day30";
import OverallPerf from "./OverallPerf";
import NPL from "./NPL";

function App() {
  return (
    <Router>
      <div className="md:flex h-screen">
        {/* Sidebar is always visible */}
        <Sidebar />

        {/* Main content changes based on route */}
        <div className="flex-grow overflow-auto">
          <Routes>
            <Route path="/" element={<OverallPerf />} />
            <Route path="/overall" element={<OverallPerf />} />
            <Route path="/day7" element={<Day7 />} />
            <Route path="/day14" element={<Day14 />} />
            <Route path="/day21" element={<Day21 />} /> 
            <Route path="/day30" element={<Day30 />} />
            <Route path="/npl" element={<NPL />} />
            {/* Fallback route */}
            <Route path="*" element={<OverallPerf />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;