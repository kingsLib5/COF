import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiUser } from "react-icons/fi";

export default function InvoiceCustomers() {
  // temporary mock data (replace later with backend data)
  const [customers] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", phone: "+2348012345678" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "+2348098765432" },
    { id: 3, name: "Cloud of Fragrance", email: "info@cloudfragrance.com", phone: "+2347011122233" },
  ]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto p-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent drop-shadow-sm">
          Customers
        </h2>
        <button className="mt-4 sm:mt-0 px-6 py-2.5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 text-white font-medium shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-200">
          + Add Customer
        </button>
      </div>

      {/* Table for desktop */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-2xl shadow-xl border border-amber-100">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-amber-600 to-amber-700 text-white text-left">
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Email</th>
              <th className="p-4 font-semibold">Phone</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((cust, i) => (
              <motion.tr
                key={cust.id}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`border-b last:border-0 hover:bg-amber-50 transition ${
                  i % 2 === 0 ? "bg-amber-50/30" : "bg-white"
                }`}
              >
                <td className="p-4 font-medium text-amber-900">{cust.name}</td>
                <td className="p-4 text-gray-700">{cust.email}</td>
                <td className="p-4 text-gray-700">{cust.phone}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card view for mobile */}
      <div className="space-y-5 md:hidden">
        {customers.map((cust, i) => (
          <motion.div
            key={cust.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-5 border border-amber-200 hover:shadow-xl transition"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center shadow-inner">
                <FiUser className="text-amber-700 text-xl" />
              </div>
              <h3 className="font-bold text-lg text-amber-800">{cust.name}</h3>
            </div>
            <p className="text-sm text-gray-700 mb-1">
              <span className="font-semibold text-amber-700">Email:</span> {cust.email}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-amber-700">Phone:</span> {cust.phone}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
