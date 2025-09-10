import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function InvoiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate(); // <- Added
  const [invoice, setInvoice] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/invoices/${id}`);
        setInvoice(res.data);
        setFormData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchInvoice();
  }, [id]);

  const handleItemChange = (index, e) => {
    const { name, value, type } = e.target;
    const newItems = [...formData.items];
    newItems[index][name] = type === "number" && value !== "" ? Number(value) : value;
    setFormData({ ...formData, items: newItems });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await axios.put(`http://localhost:5000/api/invoices/${id}`, formData);
      setInvoice({ ...formData, edited: true });
      setIsEditing(false);
      alert("✅ Invoice saved successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save invoice");
    } finally {
      setLoading(false);
    }
  };

  if (!invoice) return <p>Loading...</p>;

  const calculateSubtotal = () =>
    formData.items?.reduce((sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.price) || 0), 0) || 0;

  const calculateTotal = () => calculateSubtotal();
  const getStatus = () => (Number(formData.amountPaid) >= calculateTotal() ? "Paid" : "Credit");

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
    >
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded text-gray-800 font-semibold"
      >
        ← Back
      </button>

      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-10 border border-amber-100 relative">
        {/* Watermark */}
        {invoice.edited && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl text-gray-300 opacity-20 rotate-12 pointer-events-none">
            EDITED
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-amber-700">Cloud of Fragrance</h1>
          <p className="italic text-sm mb-2">EMBRACE THE ESSENCE OF ELEGANCE</p>
          <p className="text-xs mb-1">SHOP A23 & A24 ANAMBRA PLAZA (BEHIND POLARIS BANK), BALOGUN GATE, TRAIDEFAIR, LAGOS</p>
          <p className="text-xs">Contact: 08186199557 | 08126543632</p>
        </div>

        <hr className="border-t-2 border-amber-200 mb-4" />

        {/* Invoice & Customer Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm">
          <div>
            <p><strong>Invoice Number:</strong> {invoice.invoiceNumber}</p>
            <p><strong>Date:</strong> {new Date(invoice.invoiceDate).toLocaleDateString()}</p>
          </div>
          <div>
            <p><strong>Customer:</strong> {invoice.customerName}</p>
            <p><strong>Email:</strong> {invoice.customerEmail || "-"}</p>
            <p><strong>Phone:</strong> {invoice.customerPhone || "-"}</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-amber-100 text-sm font-medium text-gray-600">
                <th className="p-2 border">Description</th>
                <th className="p-2 border">Qty</th>
                <th className="p-2 border">Price (₦)</th>
                <th className="p-2 border">Total</th>
              </tr>
            </thead>
            <tbody>
              {formData.items?.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                  <td className="border p-2">
                    {isEditing ? (
                      <input
                        type="text"
                        name="description"
                        value={item.description}
                        onChange={(e) => handleItemChange(index, e)}
                        className="w-full border rounded-lg px-3 py-2 text-sm"
                      />
                    ) : (
                      item.description
                    )}
                  </td>
                  <td className="border p-2">
                    {isEditing ? (
                      <input
                        type="number"
                        name="quantity"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, e)}
                        className="w-full border rounded-lg px-3 py-2 text-sm"
                      />
                    ) : (
                      item.quantity
                    )}
                  </td>
                  <td className="border p-2">
                    {isEditing ? (
                      <input
                        type="number"
                        name="price"
                        value={item.price}
                        onChange={(e) => handleItemChange(index, e)}
                        className="w-full border rounded-lg px-3 py-2 text-sm"
                      />
                    ) : (
                      Number(item.price).toLocaleString()
                    )}
                  </td>
                  <td className="border p-2">{(Number(item.quantity) * Number(item.price)).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end flex-col items-end text-sm space-y-1 mb-4">
          <p><strong>Subtotal:</strong> ₦{calculateSubtotal().toLocaleString()}</p>
          <p><strong>Total:</strong> ₦{calculateTotal().toLocaleString()}</p>
          <p><strong>Amount Paid:</strong> ₦{Number(formData.amountPaid || 0).toLocaleString()}</p>
          <p><strong>Status:</strong> {getStatus()}</p>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-4">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                {loading ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-amber-600 text-white rounded"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
