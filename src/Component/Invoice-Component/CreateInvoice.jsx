import React, { useState } from "react";
import { motion } from "framer-motion";

export default function CreateInvoice() {
  const [invoice, setInvoice] = useState({
    invoiceNumber: `INV-${Date.now()}`,
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    customerName: "",
    customerEmail: "",
    items: [{ name: "", description: "", quantity: 1, price: 0 }],
  });

  const handleChange = (e) => {
    setInvoice({ ...invoice, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index, e) => {
    const newItems = [...invoice.items];
    newItems[index][e.target.name] = e.target.value;
    setInvoice({ ...invoice, items: newItems });
  };

  const addItem = () => {
    setInvoice({
      ...invoice,
      items: [
        ...invoice.items,
        { name: "", description: "", quantity: 1, price: 0 },
      ],
    });
  };

  const calculateSubtotal = () =>
    invoice.items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Invoice submitted:", invoice);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
    >
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-10 border border-amber-100">
        {/* Header */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl sm:text-4xl font-extrabold text-center bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent mb-8 tracking-wide"
        >
          Create Invoice
        </motion.h2>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Invoice Header */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Invoice Number
              </label>
              <input
                type="text"
                name="invoiceNumber"
                value={invoice.invoiceNumber}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-amber-600 focus:border-amber-600 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Issue Date
              </label>
              <input
                type="date"
                name="issueDate"
                value={invoice.issueDate}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-amber-600 focus:border-amber-600 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                value={invoice.dueDate}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-amber-600 focus:border-amber-600 transition"
              />
            </div>
          </div>

          {/* Customer Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Customer Name
              </label>
              <input
                type="text"
                name="customerName"
                value={invoice.customerName}
                onChange={handleChange}
                placeholder="e.g. Jane Doe"
                className="w-full border border-gray-200 rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-amber-600 focus:border-amber-600 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Customer Email
              </label>
              <input
                type="email"
                name="customerEmail"
                value={invoice.customerEmail}
                onChange={handleChange}
                placeholder="e.g. jane@example.com"
                className="w-full border border-gray-200 rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-amber-600 focus:border-amber-600 transition"
              />
            </div>
          </div>

          {/* Items Section */}
          <div>
            <h3 className="font-semibold text-xl text-amber-700 mb-4">
              Invoice Items
            </h3>
            <div className="space-y-4">
              {invoice.items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-amber-50/40 p-4 rounded-lg border border-amber-100 shadow-sm"
                >
                  <input
                    type="text"
                    name="name"
                    placeholder="Item"
                    value={item.name}
                    onChange={(e) => handleItemChange(index, e)}
                    className="border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-amber-600 focus:border-amber-600"
                  />
                  <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, e)}
                    className="border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-amber-600 focus:border-amber-600"
                  />
                  <input
                    type="number"
                    name="quantity"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, e)}
                    className="border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-amber-600 focus:border-amber-600"
                  />
                  <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={item.price}
                    onChange={(e) => handleItemChange(index, e)}
                    className="border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-amber-600 focus:border-amber-600"
                  />
                </motion.div>
              ))}
            </div>
            <button
              type="button"
              onClick={addItem}
              className="mt-5 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-medium px-6 py-2.5 rounded-lg shadow-md hover:scale-105 hover:shadow-lg transition"
            >
              + Add Item
            </button>
          </div>

          {/* Subtotal */}
          <div className="text-right font-bold text-2xl text-gray-800">
            Subtotal:{" "}
            <span className="text-amber-700">
              ₦{calculateSubtotal().toLocaleString()}
            </span>
          </div>

          {/* Submit */}
          <div className="text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full sm:w-auto bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold px-10 py-3 rounded-xl shadow-xl hover:shadow-amber-400/40 transition"
            >
              Generate Invoice
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
