// src/Component/Invoice-Component/InvoiceDash.jsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";
import { FiFileText, FiUsers, FiPlus } from "react-icons/fi";

const InvoiceDash = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const menus = [
    { name: "Overview", icon: <FiFileText />, path: "" },            
    { name: "Invoices", icon: <FiFileText />, path: "invoices" },
    { name: "Create Invoice", icon: <FiPlus />, path: "create-invoice" },
    { name: "Customers", icon: <FiUsers />, path: "customers" },
    // ✅ Remove "Invoice Details" from sidebar
  ];

  return (
    <div className="flex min-h-screen">
      <SideBar
        basePath="/cofinvoicedashboard"
        menus={menus}
        onExpand={() => setIsSidebarExpanded(true)}
        onCollapse={() => setIsSidebarExpanded(false)}
      />

      {/* Main content */}
      <div
        className={`flex-grow p-4 transition-all duration-300 ${
          isSidebarExpanded ? "lg:ml-64" : "lg:ml-20"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default InvoiceDash;
