// src/Component/Invoice-Component/InvoiceList.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiFileText } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import api from "../../api";

export default function InvoiceList() {
  const [invoices, setInvoices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await api.get("/invoices");
        setInvoices(res.data);
        setFilteredInvoices(res.data);
      } catch (err) {
        console.error("Error fetching invoices:", err);
      }
    };
    fetchInvoices();
  }, []);

  useEffect(() => {
    const filtered = invoices.filter(
      (inv) =>
        inv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredInvoices(filtered);
  }, [searchQuery, invoices]);

  const handleClick = (id) => {
    navigate(`/cofinvoicedashboard/invoices/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf9e7] to-[#fffced] p-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="w-96 h-96 bg-gradient-to-r from-amber-600 to-amber-700 rounded-full blur-3xl absolute -top-20 -left-20"></div>
        <div className="w-72 h-72 bg-gradient-to-r from-amber-700 to-amber-600 rounded-full blur-3xl absolute bottom-0 right-0"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto py-10 px-6 relative z-10"
      >
        <h2 className="text-3xl font-bold text-amber-700 mb-6">Invoice List</h2>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by customer name or invoice number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-amber-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <div className="grid gap-6">
          {filteredInvoices.length === 0 ? (
            <p className="text-gray-500 text-center">No invoices found.</p>
          ) : (
            filteredInvoices.map((invoice) => (
              <motion.div
                key={invoice._id}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-2xl shadow-lg p-6 flex items-center justify-between border border-amber-100 cursor-pointer"
                onClick={() => handleClick(invoice._id)}
              >
                <div className="flex items-center gap-4">
                  <div className="text-amber-600 bg-amber-50 p-3 rounded-full">
                    <FiFileText className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {invoice.customerName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Invoice: {invoice.invoiceNumber}
                    </p>
                  </div>
                </div>
                <div className="text-amber-700 font-bold text-lg">
                  ₦
                  {invoice.items
                    .reduce((sum, item) => sum + item.quantity * item.price, 0)
                    .toLocaleString()}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
