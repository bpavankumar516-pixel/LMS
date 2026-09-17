import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const DashboardLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex w-full max-w-full overflow-x-hidden relative">
      {/* Sidebar Navigation */}
      <Sidebar
        isCollapsed={isCollapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        onToggleCollapse={toggleSidebar}
      />

      {/* Main Content Container */}
      <div
        className={`flex-1 flex flex-col min-w-0 w-full max-w-full overflow-x-hidden transition-all duration-300 ease-in-out ${
          isCollapsed ? "lg:pl-20" : "lg:pl-64"
        }`}
      >
        <Navbar
          onToggleSidebar={toggleSidebar}
          onOpenMobile={() => setMobileOpen(true)}
          isCollapsed={isCollapsed}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full max-w-none mx-0 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
