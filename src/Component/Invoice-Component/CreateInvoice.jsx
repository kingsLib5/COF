// src/Component/Invoice-Component/CreateInvoice.jsx
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import api from "../../api";

export default function CreateInvoice() {
  const [invoice, setInvoice] = useState({
    invoiceNumber: `INV-${Date.now()}`,
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    items: [{ description: "", quantity: "", price: "" }], // quantity & price empty
    paymentMethod: "",
    amountPaid: "", // start empty
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const printRef = useRef();

  // Validation
  const validateForm = () => {
    const newErrors = {};
    if (!invoice.customerName.trim()) newErrors.customerName = "Customer name is required";
    if (!invoice.customerEmail.trim()) newErrors.customerEmail = "Customer email is required";
    const itemErrors = [];
    invoice.items.forEach((item, index) => {
      const itemError = {};
      if (!item.description.trim()) itemError.description = "Description is required";
      if (item.quantity === "" || item.quantity <= 0) itemError.quantity = "Quantity must be > 0";
      if (item.price === "" || item.price < 0) itemError.price = "Price cannot be negative";
      if (Object.keys(itemError).length > 0) itemErrors[index] = itemError;
    });
    if (itemErrors.length > 0) newErrors.items = itemErrors;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Input handlers
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setInvoice({ ...invoice, [name]: type === "number" && value !== "" ? Number(value) : value });
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  const handleItemChange = (index, e) => {
    const { name, value, type } = e.target;
    const newItems = [...invoice.items];
    newItems[index][name] = type === "number" && value !== "" ? Number(value) : value;
    setInvoice({ ...invoice, items: newItems });
    if (errors.items && errors.items[index] && errors.items[index][name]) {
      const newErrors = { ...errors };
      delete newErrors.items[index][name];
      if (Object.keys(newErrors.items[index]).length === 0) delete newErrors.items[index];
      setErrors(newErrors);
    }
  };

  const addItem = () =>
    setInvoice({ ...invoice, items: [...invoice.items, { description: "", quantity: "", price: "" }] });

  const removeItem = (index) =>
    invoice.items.length > 1 && setInvoice({ ...invoice, items: invoice.items.filter((_, i) => i !== index) });

  // Calculations
  const calculateSubtotal = () =>
    invoice.items.reduce((sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.price) || 0), 0);

  const calculateTotal = () => calculateSubtotal();
  const getStatus = () => (Number(invoice.amountPaid) >= calculateTotal() ? "Paid" : "Credit");

  const resetForm = () => {
    setInvoice({
      invoiceNumber: `INV-${Date.now()}`,
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      invoiceDate: new Date().toISOString().split("T")[0],
      items: [{ description: "", quantity: "", price: "" }],
      paymentMethod: "",
      amountPaid: "",
    });
    setErrors({});
  };

  // Save invoice
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    const payload = {
      ...invoice,
      subtotal: calculateSubtotal(),
      totalAmount: calculateTotal(),
      status: getStatus(),
    };
    try {
      await api.post("/invoices", payload);
      alert("✅ Invoice created successfully");
      resetForm();
    } catch (error) {
      console.error("Error creating invoice:", error.response?.data || error.message);
      alert("❌ Failed to create invoice");
    } finally {
      setLoading(false);
    }
  };

  // Save and print
  const handlePrint = async () => {
    if (!validateForm()) return;

    setLoading(true);
    const payload = {
      ...invoice,
      subtotal: calculateSubtotal(),
      totalAmount: calculateTotal(),
      status: getStatus(),
    };

    try {
      await api.post("/invoices", payload);
      alert("✅ Invoice saved successfully. Preparing to print...");

      const printContents = printRef.current.innerHTML;
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    } catch (error) {
      console.error("Error saving invoice:", error.response?.data || error.message);
      alert("❌ Failed to save invoice. Cannot print.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
    >
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-10 border border-amber-100">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl sm:text-4xl font-extrabold text-center bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent mb-8 tracking-wide"
        >
          📄 Create Invoice
        </motion.h2>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Invoice Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">📄 Invoice Number</label>
              <input
                type="text"
                name="invoiceNumber"
                value={invoice.invoiceNumber}
                readOnly
                className="w-full border border-amber-200 rounded-lg px-4 py-3 bg-gray-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">📅 Invoice Date</label>
              <input
                type="date"
                name="invoiceDate"
                value={invoice.invoiceDate}
                onChange={handleChange}
                className="w-full border border-amber-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          {/* Customer Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-amber-700">👤 Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                name="customerName"
                value={invoice.customerName}
                onChange={handleChange}
                placeholder="Customer Name"
                className="w-full border border-amber-200 rounded-lg px-4 py-3"
              />
              <input
                type="email"
                name="customerEmail"
                value={invoice.customerEmail}
                onChange={handleChange}
                placeholder="Customer Email"
                className="w-full border border-amber-200 rounded-lg px-4 py-3"
              />
            </div>
            <input
              type="tel"
              name="customerPhone"
              value={invoice.customerPhone}
              onChange={handleChange}
              placeholder="Customer Phone"
              className="w-full border border-amber-200 rounded-lg px-4 py-3"
            />
          </div>

          {/* Items Table */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-amber-700">📋 Items & Services</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-sm font-medium text-gray-600 border-b">
                    <th className="text-left p-2">Description</th>
                    <th className="text-left p-2">Qty</th>
                    <th className="text-left p-2">Price (₦)</th>
                    <th className="text-left p-2">Total</th>
                    <th className="text-left p-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">
                        <input
                          type="text"
                          name="description"
                          value={item.description}
                          onChange={(e) => handleItemChange(index, e)}
                          className="w-full border rounded-lg px-3 py-2 text-sm"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          name="quantity"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, e)}
                          className="w-full border rounded-lg px-3 py-2 text-sm"
                          placeholder=""
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          name="price"
                          value={item.price}
                          onChange={(e) => handleItemChange(index, e)}
                          className="w-full border rounded-lg px-3 py-2 text-sm"
                          placeholder=""
                        />
                      </td>
                      <td className="p-2">
                        ₦{((Number(item.quantity) || 0) * (Number(item.price) || 0)).toLocaleString()}
                      </td>
                      <td className="p-2">
                        <button type="button" onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700">
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button type="button" onClick={addItem} className="text-amber-600 hover:text-amber-700 font-medium text-sm">
              ➕ Add Item
            </button>
          </div>

          {/* Payment Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <select
              name="paymentMethod"
              value={invoice.paymentMethod}
              onChange={handleChange}
              className="w-full border border-amber-200 rounded-lg px-3 py-3"
            >
              <option value="">Payment Method</option>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
            <input
              type="number"
              name="amountPaid"
              value={invoice.amountPaid}
              onChange={handleChange}
              placeholder=""
              className="w-full border border-amber-200 rounded-lg px-3 py-3"
            />
          </div>

          {/* Submit & Print */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold px-10 py-4 rounded-xl"
            >
              💰 {loading ? "Creating..." : "Generate Invoice"}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handlePrint}
              className="border-2 border-amber-600 text-amber-600 font-semibold px-10 py-4 rounded-xl"
            >
              🖨️ Save & Print Invoice
            </motion.button>
          </div>
        </form>
      </div>

      {/* Printable Invoice */}
      <div ref={printRef} className="hidden">
        <div className="p-8 w-full text-gray-800">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-amber-700">Cloud of Fragrance</h1>
            <p className="italic text-sm mb-2">EMBRACE THE ESSENCE OF ELEGANCE</p>
            <p>SHOP A23 & A24 ANAMBRA PLAZA (BEHIND POLARIS BANK), BALOGUN GATE, TRAIDEFAIR, LAGOS</p>
            <p>Contact: 08186199557 | 08126543632</p>
          </div>

          <hr className="border-t-2 border-amber-200 mb-4" />

          {/* Invoice Info */}
          <div className="flex justify-between mb-4">
            <div>
              <p><strong>Invoice Number:</strong> {invoice.invoiceNumber}</p>
              <p><strong>Invoice Date:</strong> {invoice.invoiceDate}</p>
            </div>
            <div>
              <p><strong>Customer Name:</strong> {invoice.customerName}</p>
              <p><strong>Email:</strong> {invoice.customerEmail}</p>
              <p><strong>Phone:</strong> {invoice.customerPhone}</p>
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full border-collapse mb-4">
            <thead>
              <tr>
                <th className="border px-2 py-1">Description</th>
                <th className="border px-2 py-1">Qty</th>
                <th className="border px-2 py-1">Price (₦)</th>
                <th className="border px-2 py-1">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index}>
                  <td className="border px-2 py-1">{item.description}</td>
                  <td className="border px-2 py-1">{item.quantity}</td>
                  <td className="border px-2 py-1">{item.price.toLocaleString()}</td>
                  <td className="border px-2 py-1">{((Number(item.quantity) || 0) * (Number(item.price) || 0)).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end flex-col items-end">
            <p><strong>Subtotal:</strong> ₦{calculateSubtotal().toLocaleString()}</p>
            <p><strong>Total:</strong> ₦{calculateTotal().toLocaleString()}</p>
            <p><strong>Amount Paid:</strong> ₦{(Number(invoice.amountPaid) || 0).toLocaleString()}</p>
            <p><strong>Status:</strong> {getStatus()}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
