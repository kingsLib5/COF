import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUpload,
  FiX,
  FiPlus,
  FiBox,
  FiDollarSign,
  FiTag,
  FiAlignLeft,
  FiBarChart
} from "react-icons/fi";
import api from '../../api/axiosConfig';

export default function AddProducts() {
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    stock: "",
    sku: ""
  });

  const [images, setImages] = useState([]); // { file, preview }
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    // revoke object URLs when component unmounts or images change
    return () => images.forEach((img) => URL.revokeObjectURL(img.preview));
  }, [images]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 5) {
      alert("Maximum 5 images allowed");
      return;
    }
    const newImages = files.map((file) => ({ file, preview: URL.createObjectURL(file) }));
    setImages((prev) => [...prev, ...newImages]);
  };

  // optional: support drag & drop
  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files || []).filter((f) => f.type.startsWith("image/"));
    if (!files.length) return;
    if (images.length + files.length > 5) {
      alert("Maximum 5 images allowed");
      return;
    }
    const newImages = files.map((file) => ({ file, preview: URL.createObjectURL(file) }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    // revoke the object URL to release memory
    URL.revokeObjectURL(images[index].preview);
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const categories = [
    "Perfumes",
    "Essential Oils",
    "Diffusers",
    "Candles",
    "Gift Sets",
    "Accessories"
  ];

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const payload = { ...productData };
    await api.post('/api/products', payload); // token auto-attached by axios instance
    alert('Product added successfully!');
    setProductData({ name: '', description: '', category: '', price: '', stock: '', sku: '' });
  } catch (err) {
    console.error('Add product error:', err);
    alert(err.response?.data?.message || 'Failed to add product');
  } finally {
    setIsSubmitting(false);
  }
};

  // framer variants
  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  const previewVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1 }
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-300 p-6"
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.04 } } }}
    >
      <motion.div className="max-w-4xl mx-auto" variants={cardVariants}>
        {/* Header */}
        <motion.div
          className="mb-8 text-left"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
        >
          <h1 className="text-3xl font-playfair font-bold text-amber-900 mb-2">Add New Product</h1>
          <p className="text-amber-700">Fill in the details below to add a new product to your inventory</p>
        </motion.div>

        {/* Form Card */}
        <motion.form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl overflow-hidden border border-amber-200/50 p-6"
          initial={{ scale: 0.995, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 140, damping: 16 }}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column */}
            <div className="space-y-6">
              <motion.div whileHover={{ scale: 1.01 }}>
                <label className="block text-amber-900 font-medium mb-2 flex items-center">
                  <FiTag className="mr-2 text-amber-700" />
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={productData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                  placeholder="e.g., Luxe Gold Perfume"
                />
              </motion.div>

              <motion.div whileHover={{ scale: 1.01 }}>
                <label className="block text-amber-900 font-medium mb-2 flex items-center">
                  <FiAlignLeft className="mr-2 text-amber-700" />
                  Description
                </label>
                <textarea
                  name="description"
                  value={productData.description}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                  placeholder="Describe the product features and benefits..."
                />
              </motion.div>

              <motion.div whileHover={{ scale: 1.01 }}>
                <label className="block text-amber-900 font-medium mb-2 flex items-center">
                  <FiBox className="mr-2 text-amber-700" />
                  Category
                </label>
                <select
                  name="category"
                  value={productData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat, i) => (
                    <option key={i} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </motion.div>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              <motion.div whileHover={{ scale: 1.01 }}>
                <label className="block text-amber-900 font-medium mb-2 flex items-center">
                  <FiDollarSign className="mr-2 text-amber-700" />
                  Price
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-700">N</span>
                  <input
                    type="number"
                    name="price"
                    value={productData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full pl-8 pr-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                    placeholder="0.00"
                  />
                </div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.01 }}>
                <label className="block text-amber-900 font-medium mb-2 flex items-center">
                  <FiBarChart className="mr-2 text-amber-700" />
                  Stock Quantity
                </label>
                <input
                  type="number"
                  name="stock"
                  value={productData.stock}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                  placeholder="Enter quantity"
                />
              </motion.div>

              <motion.div whileHover={{ scale: 1.01 }}>
                <label className="block text-amber-900 font-medium mb-2">SKU (Stock Keeping Unit)</label>
                <input
                  type="text"
                  name="sku"
                  value={productData.sku}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                  placeholder="e.g., LUX-GLD-001"
                />
              </motion.div>

                 
               
              
            </div>
          </div>

          {/* Submit */}
          <div className="mt-8 flex justify-end">
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-75"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Adding Product...
                </>
              ) : (
                <>
                  <FiPlus className="mr-2" />
                  Add Product
                </>
              )}
            </motion.button>
          </div>
        </motion.form>
      </motion.div>
    </motion.div>
  );
}
