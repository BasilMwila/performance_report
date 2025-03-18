import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Calendar, Home, Menu } from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Menu Button for Small Screens */}
      <button
        className="sm:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-full shadow-lg"
        onClick={() => setIsOpen(true)}
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "fixed inset-0 w-full h-full z-40 bg-white" : "w-64 h-screen"
        } bg-white p-4 flex flex-col sm:relative sm:block sm:w-64 sm:h-screen`}
      >
        {/* Close Sidebar in Small Screens */}
        {isOpen && (
          <button
            className="absolute top-4 right-4 p-2 bg-gray-200 rounded-full"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>
        )}

        {/* Logo */}
        <div className="flex items-center justify-center mb-6 hidden sm:block">
          <img src="/Emerald_Logo_Web.png" alt="Emerald Finance" className="h-36 w-48" />
        </div>
        
        {/* Navigation Links */}
        <nav className="flex flex-col gap-2 hidden sm:block">
          <NavLink
            to="/day7"
            className={({ isActive }) => `flex items-center gap-2 p-2 rounded-lg ${isActive ? "bg-gray-200" : "hover:bg-gray-100"}`}
          >
            <Calendar size={20} /> 7-Day Metrics
          </NavLink>
          <NavLink
            to="/day14"
            className={({ isActive }) => `flex items-center gap-2 p-2 rounded-lg ${isActive ? "bg-gray-200" : "hover:bg-gray-100"}`}
          >
            <Calendar size={20} /> 14-Day Metrics
          </NavLink>
          <NavLink
            to="/day21"
            className={({ isActive }) => `flex items-center gap-2 p-2 rounded-lg ${isActive ? "bg-gray-200" : "hover:bg-gray-100"}`}
          >
            <Calendar size={20} /> 21-Day Metrics
          </NavLink>
          <NavLink
            to="/day30"
            className={({ isActive }) => `flex items-center gap-2 p-2 rounded-lg ${isActive ? "bg-gray-200" : "hover:bg-gray-100"}`}
          >
            <Calendar size={20} /> 30-Day Metrics
          </NavLink>
          <NavLink
            to="/"
            className={({ isActive }) => `flex items-center gap-2 p-2 rounded-lg ${isActive ? "bg-gray-200" : "hover:bg-gray-100"}`}
          >
            <Home size={20} /> Overall Performance
          </NavLink>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
