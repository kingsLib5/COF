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
    Paid: "bg-green-100 text-green-700 border border-green-200",
    Pending: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    Overdue: "bg-red-100 text-red-700 border border-red-200",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto p-6"
    >
      <h2 className="text-3xl font-extrabold mb-6 bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent tracking-tight">
        Invoice List
      </h2>

      {/* ✅ Table view (desktop) */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-2xl shadow-lg border border-gray-100">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-amber-600 to-amber-700 text-white text-left text-sm uppercase tracking-wide">
              <th className="p-4">Invoice #</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Issue Date</th>
              <th className="p-4">Due Date</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv, i) => (
              <motion.tr
                key={inv.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="border-b last:border-none hover:bg-amber-50 transition-colors"
              >
                <td className="p-4 font-semibold">{inv.number}</td>
                <td className="p-4">{inv.customer}</td>
                <td className="p-4">{inv.issueDate}</td>
                <td className="p-4">{inv.dueDate}</td>
                <td className="p-4 font-bold text-gray-800">
                  ₦{inv.total.toLocaleString()}
                </td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClasses[inv.status]}`}
                  >
                    {inv.status}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow hover:shadow-md transition"
                  >
                    <FiFileText className="text-lg" />
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
        {/* hshshsgsgh */}
        {invoices.map((inv, i) => (
          <motion.div
            key={inv.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-5 border border-amber-100"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-bold text-amber-700">{inv.number}</h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClasses[inv.status]}`}
              >
                {inv.status}
              </span>
            </div>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Customer:</span> {inv.customer}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Issue:</span> {inv.issueDate}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Due:</span> {inv.dueDate}
            </p>
            <p className="text-base text-gray-900 font-bold mt-2 mb-4">
              ₦{inv.total.toLocaleString()}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold shadow hover:shadow-md"
            >
              <FiFileText className="text-white text-lg" />
              View Invoice
            </motion.button>
          </motion.div>
        ))}
      </div>
    </motion.div>
    // hh
  );
}
