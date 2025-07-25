import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Calendar, Home, Menu, BarChart, TrendingUp } from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Hamburger Button */}
      <button
        className="lg:hidden p-4"
        onClick={() => setIsOpen(true)}
      >
        <Menu size={28} />
      </button>

      {/* Sidebar - Fullscreen on small devices */}
      {isOpen && <div className="fixed inset-0 bg-black opacity-50 z-40" onClick={() => setIsOpen(false)}></div>}
      
      <div
        className={`fixed inset-0 bg-white p-4 flex flex-col transition-transform duration-300 z-50 lg:w-64 lg:h-screen lg:static ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Sidebar Content */}
        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center justify-center mb-6">
            <img src="/Emerald_Logo_Web1.png" alt="Emerald Finance" className="h-36 w-56" />
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-2">
            {[
              { to: "/", label: "Overall Performance", icon: Home },
              { to: "/day7", label: "7-Day Metrics", icon: Calendar },
              { to: "/day14", label: "14-Day Metrics", icon: Calendar },
              { to: "/day21", label: "21-Day Metrics", icon: Calendar },
              { to: "/day30", label: "30-Day Metrics", icon: Calendar },
              { to: "/npl", label: "NPL Report", icon: BarChart },
            ].map(({ to, label, icon: Icon }, index) => (
              <NavLink
                key={index}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 p-2 rounded-lg ${
                    isActive ? "bg-gray-200" : "hover:bg-gray-100"
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                <Icon size={20} /> {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;