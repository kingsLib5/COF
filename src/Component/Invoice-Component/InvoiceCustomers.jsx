// src/Component/Invoice-Component/InvoiceCustomers.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../api";

export default function InvoiceCustomers() {
  const [invoices, setInvoices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredInvoices, setFilteredInvoices] = useState([]);

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
    // Filter invoices by customer name or invoice number
    const filtered = invoices.filter(
      (inv) =>
        inv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredInvoices(filtered);
  }, [searchQuery, invoices]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-5xl mx-auto py-10 px-6"
    >
      <h2 className="text-3xl font-bold text-amber-700 mb-6">
        Invoice Customers
      </h2>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by customer name or invoice number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border border-amber-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-400"
        />
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 border border-amber-100">
        {filteredInvoices.length === 0 ? (
          <p className="text-gray-500 text-center">No customers found.</p>
        ) : (
          filteredInvoices.map((inv, i) => (
            <div
              key={i}
              className="flex justify-between items-center py-3 border-b last:border-none"
            >
              <div>
                <span className="text-gray-800 font-medium">{inv.customerName}</span>
                <span className="text-gray-500 ml-2">({inv.customerEmail})</span>
              </div>
              <span className="text-gray-600 font-semibold">{inv.invoiceNumber}</span>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}
