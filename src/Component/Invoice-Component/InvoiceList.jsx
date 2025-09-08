import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiFileText } from "react-icons/fi";

export default function InvoiceList() {
  // temporary mock data (replace later with backend data)
  const [invoices] = useState([
    {
      id: 1,
      number: "INV-001",
      customer: "John Doe",
      issueDate: "2025-09-04",
      dueDate: "2025-09-11",
      total: 25000,
      status: "Paid",
    },
    {
      id: 2,
      number: "INV-002",
      customer: "Cloud of Fragrance",
      issueDate: "2025-09-05",
      dueDate: "2025-09-12",
      total: 45000,
      status: "Pending",
    },
    {
      id: 3,
      number: "INV-003",
      customer: "Jane Smith",
      issueDate: "2025-09-06",
      dueDate: "2025-09-13",
      total: 38000,
      status: "Overdue",
    },
  ]);

  const statusClasses = {
    Paid: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Overdue: "bg-red-100 text-red-700",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto p-6"
    >
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent">
        Invoices
      </h2>

      {/* ✅ Table view (desktop) */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-amber-600 to-amber-700 text-white text-left">
              <th className="p-3">Invoice #</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Issue Date</th>
              <th className="p-3">Due Date</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv, i) => (
              <motion.tr
                key={inv.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="border-b hover:bg-amber-50"
              >
                <td className="p-3 font-semibold">{inv.number}</td>
                <td className="p-3">{inv.customer}</td>
                <td className="p-3">{inv.issueDate}</td>
                <td className="p-3">{inv.dueDate}</td>
                <td className="p-3 font-bold">₦{inv.total.toLocaleString()}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${statusClasses[inv.status]}`}
                  >
                    {inv.status}
                  </span>
                </td>
                <td className="p-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-1 px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200"
                  >
                    <FiFileText className="text-gray-600" />
                    View
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Card view (mobile) */}
      <div className="space-y-4 md:hidden">
        {invoices.map((inv, i) => (
          <motion.div
            key={inv.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl shadow p-4 border border-amber-100"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-amber-700">{inv.number}</h3>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${statusClasses[inv.status]}`}
              >
                {inv.status}
              </span>
            </div>
            <p className="text-sm text-gray-700 mb-1">
              <span className="font-medium">Customer:</span> {inv.customer}
            </p>
            <p className="text-sm text-gray-700 mb-1">
              <span className="font-medium">Issue:</span> {inv.issueDate}
            </p>
            <p className="text-sm text-gray-700 mb-1">
              <span className="font-medium">Due:</span> {inv.dueDate}
            </p>
            <p className="text-sm text-gray-900 font-bold mb-3">
              ₦{inv.total.toLocaleString()}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="w-full flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 text-white"
            >
              <FiFileText className="text-white" />
              View Invoice
            </motion.button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
