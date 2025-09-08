import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FiTrendingUp,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiDownload,
  FiPlus,
  FiEye,
  FiEdit3,
  FiMoreVertical,
} from "react-icons/fi";

export default function InvoiceOverview() {
  const navigate = useNavigate();

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const basePath = "/cofinvoicedashboard";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf9e7] to-[#fffced] p-6 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="w-96 h-96 bg-gradient-to-r from-amber-600 to-amber-700 rounded-full blur-3xl absolute -top-20 -left-20"></div>
        <div className="w-72 h-72 bg-gradient-to-r from-amber-700 to-amber-600 rounded-full blur-3xl absolute bottom-0 right-0"></div>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto relative z-10 space-y-10"
      >
        {/* Header / Tagline */}
        <motion.div variants={fadeInUp} className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent">
            Cloud of Fragrance
          </h1>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={fadeInUp}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
        >
          {[
            {
              title: "Total Revenue",
              value: "₦4,682,500",
              icon: <FiTrendingUp className="text-amber-600" />,
            },
            {
              title: "Pending Invoices",
              value: "18",
              icon: <FiClock className="text-amber-600" />,
            },
            {
              title: "Paid Invoices",
              value: "42",
              icon: <FiCheckCircle className="text-amber-600" />,
            },
            {
              title: "Overdue Invoices",
              value: "5",
              icon: <FiAlertCircle className="text-amber-600" />,
            },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              variants={fadeInUp}
              className="bg-white rounded-2xl shadow-lg p-6 border border-amber-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-600">
                    {stat.title}
                  </h3>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className="text-3xl p-3 bg-amber-50 rounded-full">
                  {stat.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Invoices */}
        <motion.div
          variants={fadeInUp}
          className="backdrop-blur-xl bg-white/70 rounded-2xl shadow-xl p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Recent Invoices</h2>
            <div className="flex gap-3">
              <button
                onClick={() => navigate(`${basePath}/create-invoice`)}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 text-white font-medium flex items-center gap-2 shadow hover:opacity-90"
              >
                <FiPlus /> Create Invoice
              </button>
              <button className="px-4 py-2 rounded-lg border border-amber-600 text-amber-600 font-medium flex items-center gap-2 hover:bg-amber-50">
                <FiDownload /> Export
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-600 border-b">
                  <th className="text-left py-3 px-4">Invoice</th>
                  <th className="text-left py-3 px-4">Client</th>
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Amount</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-right py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    id: "INV-001",
                    client: "Luxury Perfumes Ltd",
                    date: "2024-03-15",
                    amount: "₦457,000",
                    status: "Paid",
                  },
                  {
                    id: "INV-002",
                    client: "Fragrance Haven",
                    date: "2024-03-14",
                    amount: "₦310,000",
                    status: "Pending",
                  },
                  {
                    id: "INV-003",
                    client: "Aroma Essence",
                    date: "2024-03-13",
                    amount: "₦785,000",
                    status: "Overdue",
                  },
                ].map((inv) => (
                  <tr
                    key={inv.id}
                    className="border-b hover:bg-white/50 transition"
                  >
                    <td className="py-3 px-4 font-medium">{inv.id}</td>
                    <td className="py-3 px-4">{inv.client}</td>
                    <td className="py-3 px-4">{inv.date}</td>
                    <td className="py-3 px-4 font-semibold">{inv.amount}</td>
                    <td
                      className={`py-3 px-4 font-medium ${
                        inv.status === "Paid"
                          ? "text-emerald-600"
                          : inv.status === "Pending"
                          ? "text-amber-600"
                          : "text-red-600"
                      }`}
                    >
                      {inv.status}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <FiEye className="inline cursor-pointer hover:text-amber-600" />
                      <FiEdit3 className="inline cursor-pointer hover:text-gray-700" />
                      <FiMoreVertical className="inline cursor-pointer hover:text-gray-700" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Footer Info */}
        <motion.div
          variants={fadeInUp}
          className="bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-2xl shadow-lg p-6"
        >
          <h3 className="text-xl font-semibold">Business Information</h3>
          <div className="mt-3 grid md:grid-cols-3 gap-4">
            <div className="bg-white/20 p-4 rounded-lg">
              Business: Cloud of Fragrance
            </div>
            <div className="bg-white/20 p-4 rounded-lg">
              Email: contact@cloudfragrance.com
            </div>
            <div className="bg-white/20 p-4 rounded-lg">Clients: 152</div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
