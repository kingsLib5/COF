// RecordStocks.jsx
import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiFilter,
  FiDownload,
  FiPrinter,
  FiEye,
  FiEdit,
  FiTrash2,
  FiTrendingUp,
  FiTrendingDown,
  FiBox,
  FiPlus,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiSave,
  FiPackage,
  FiAlertTriangle,
  FiShoppingCart
} from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

// Custom count-up hook
function useCountUp(target, duration = 900) {
  const [value, setValue] = useState(0);
  React.useEffect(() => {
    let raf = null;
    let start = null;
    function step(ts) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

// Custom hook for filters
function useFilters() {
  const [filters, setFilters] = useState({
    category: "",
    status: "",
    dateRange: "",
    startDate: null,
    endDate: null
  });

  const updateFilter = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));
  const clearFilters = () =>
    setFilters({ category: "", status: "", dateRange: "", startDate: null, endDate: null });

  return { filters, updateFilter, clearFilters };
}

export default function RecordStocks() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const { filters, updateFilter, clearFilters } = useFilters();

  const [stockRecords, setStockRecords] = useState([]);

  const categories = ["All", "Perfumes", "Essential Oils", "Diffusers", "Candles", "Gift Sets", "Sprays"];
  const statusOptions = ["All", "In Stock", "Low Stock", "Out of Stock"];
  const dateRanges = ["Last 7 Days", "Last 30 Days", "Last 90 Days", "Custom"];

  // Fetch products from backend
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setStockRecords(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filtered records
  const filteredRecords = useMemo(() => {
    return stockRecords.filter(record => {
      const q = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !q ||
        (record.name?.toLowerCase().includes(q)) ||
        (record.id?.toLowerCase().includes(q)) ||
        (record.supplier?.toLowerCase().includes(q));

      let matchesTab = true;
      if (activeTab === "in-stock") matchesTab = record.status === "in-stock";
      if (activeTab === "low-stock") matchesTab = record.status === "low-stock";
      if (activeTab === "out-of-stock") matchesTab = record.status === "out-of-stock";

      const matchesCategory = !filters.category || filters.category === "All" || record.category === filters.category;
      const matchesStatus =
        !filters.status || filters.status === "All" || record.status === filters.status.toLowerCase().replace(" ", "-");

      let matchesDate = true;
      if (filters.startDate && filters.endDate) {
        const recordDate = new Date(record.lastUpdated);
        matchesDate = recordDate >= filters.startDate && recordDate <= filters.endDate;
      }

      return matchesSearch && matchesTab && matchesCategory && matchesStatus && matchesDate;
    });
  }, [stockRecords, searchTerm, activeTab, filters]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);

  // Summary numbers
  const totalProducts = useCountUp(stockRecords.length);
  const inStockCount = useCountUp(stockRecords.filter(r => r.status === "in-stock").length);
  const lowStockCount = useCountUp(stockRecords.filter(r => r.status === "low-stock").length);
  const outOfStockCount = useCountUp(stockRecords.filter(r => r.status === "out-of-stock").length);

  function getStatusBadge(statusKey) {
    const statusMap = {
      "in-stock": { label: "In Stock", color: "green", icon: FiTrendingUp },
      "low-stock": { label: "Low Stock", color: "orange", icon: FiAlertTriangle },
      "out-of-stock": { label: "Out of Stock", color: "red", icon: FiBox }
    };

    const status = statusMap[statusKey] || { label: "Unknown", color: "gray", icon: FiPackage };
    const IconComponent = status.icon;

    return (
      <span
        className="px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 w-fit"
        style={{ backgroundColor: `${status.color}15`, color: status.color, border: `1px solid ${status.color}30` }}
      >
        <IconComponent size={12} />
        {status.label}
      </span>
    );
  }

  // Edit, delete handlers
  const handleViewProduct = product => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  // Handle edit button click
  const handleEditProduct = product => {
    setEditingProduct({ ...product, id: product.id || product._id });
    setIsEditing(true);
  };

  // Delete product
  const handleDeleteProduct = async productId => {
    if (!productId) return;
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${productId}`);
        setStockRecords(prev => prev.filter(p => p.id !== productId));
      } catch (error) {
        console.error("Failed to delete product:", error);
      }
    }
  };

  // Handle save edit
  const handleSaveEdit = async () => {
    if (!editingProduct || !editingProduct.id) return;

    try {
      const updatedProduct = {
        ...editingProduct,
        currentStock: (Number(editingProduct.stockIn) || 0) - (Number(editingProduct.stockOut) || 0),
        lastUpdated: new Date().toISOString()
      };

      // PUT request to backend
      await axios.patch(`http://localhost:5000/api/products/${editingProduct.id}`, updatedProduct);

      // Update frontend state immediately
      setStockRecords(prev =>
        prev.map(p => (p.id === editingProduct.id ? updatedProduct : p))
      );

      setIsEditing(false);
      setEditingProduct(null);
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingProduct(null);
  };

  // Handle input changes in edit modal
  const handleInputChange = e => {
    const { name, value } = e.target;
    setEditingProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleItemsPerPageChange = e => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const formatDate = dateString => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Framer variants
  const cardVariant = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };
  const rowVariant = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, x: 20, transition: { duration: 0.1 } }
  };

  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gray-300 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-6 md:mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-amber-900 mb-1 md:mb-2 flex items-center gap-2">
                <FiPackage className="text-amber-700" />
                Stock Records
              </h1>
              <p className="text-amber-700 text-sm md:text-base">Manage and track your inventory stock levels</p>
            </div>
            <a href="/cofdashboard/add-products">
              <button className="flex items-center gap-2 px-4 py-2 md:py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all shadow-md hover:shadow-lg">
                <FiPlus />
                <span>Add New Product</span>
              </button>
            </a>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.08 } } }}
        >
          <motion.div variants={cardVariant} className="bg-white rounded-2xl p-5 shadow-lg border border-amber-200/50 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-amber-700 font-medium text-sm md:text-base">Total Products</h3>
                <p className="text-2xl md:text-3xl font-bold text-amber-900 mt-2">{totalProducts}</p>
                <p className="text-xs md:text-sm text-amber-600 mt-1">Across all categories</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-xl">
                <FiBox className="text-amber-700 text-lg" />
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-amber-200/30"></div>
          </motion.div>

          <motion.div variants={cardVariant} className="bg-white rounded-2xl p-5 shadow-lg border border-green-200/50 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-green-700 font-medium text-sm md:text-base">In Stock</h3>
                <p className="text-2xl md:text-3xl font-bold text-green-900 mt-2">{inStockCount}</p>
                <p className="text-xs md:text-sm text-green-600 mt-1">Products available</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <FiTrendingUp className="text-green-700 text-lg" />
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-green-200/30"></div>
          </motion.div>

          <motion.div variants={cardVariant} className="bg-white rounded-2xl p-5 shadow-lg border border-amber-200/50 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-amber-700 font-medium text-sm md:text-base">Low Stock</h3>
                <p className="text-2xl md:text-3xl font-bold text-amber-900 mt-2">{lowStockCount}</p>
                <p className="text-xs md:text-sm text-amber-600 mt-1">Need restocking</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-xl">
                <FiTrendingDown className="text-amber-700 text-lg" />
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-amber-200/30"></div>
          </motion.div>

          <motion.div variants={cardVariant} className="bg-white rounded-2xl p-5 shadow-lg border border-red-200/50 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-red-700 font-medium text-sm md:text-base">Out of Stock</h3>
                <p className="text-2xl md:text-3xl font-bold text-red-900 mt-2">{outOfStockCount}</p>
                <p className="text-xs md:text-sm text-red-600 mt-1">Require attention</p>
              </div>
              <div className="p-3 bg-red-100 rounded-xl">
                <FiBox className="text-red-700 text-lg" />
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-red-200/30"></div>
          </motion.div>
        </motion.div>

        {/* Controls Card */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-lg mb-4 md:mb-6 border border-amber-200/50"
        >
          <div className="p-5 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600" />
                <input
                  type="text"
                  placeholder="Search products, SKU or supplier..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 md:py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                />
              </div>

              {/* Filter Toggle for Mobile */}
              <button
                className="md:hidden flex items-center gap-2 px-4 py-2.5 border border-amber-200 rounded-xl text-amber-700 hover:bg-amber-50 transition-colors"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FiFilter />
                <span>Filters</span>
              </button>

              {/* Filters for Desktop */}
              <div className="hidden md:flex gap-3 items-center">
                <select
                  value={filters.category}
                  onChange={(e) => updateFilter("category", e.target.value)}
                  className="px-4 py-2.5 md:py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat, idx) => (
                    <option key={idx} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                <select
                  value={filters.status}
                  onChange={(e) => updateFilter("status", e.target.value)}
                  className="px-4 py-2.5 md:py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                >
                  <option value="">All Status</option>
                  {statusOptions.map((status, idx) => (
                    <option key={idx} value={status}>
                      {status}
                    </option>
                  ))}
                </select>

                <button className="flex items-center gap-2 px-4 py-2.5 md:py-3 border border-amber-200 rounded-xl text-amber-700 hover:bg-amber-50 transition-colors">
                  <FiDownload />
                  <span>Export</span>
                </button>
              </div>
            </div>

            {/* Expanded Filters for Mobile */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-4 md:hidden space-y-3"
                >
                  <select
                    value={filters.category}
                    onChange={(e) => updateFilter("category", e.target.value)}
                    className="w-full px-4 py-2.5 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat, idx) => (
                      <option key={idx} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>

                  <select
                    value={filters.status}
                    onChange={(e) => updateFilter("status", e.target.value)}
                    className="w-full px-4 py-2.5 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">All Status</option>
                    {statusOptions.map((status, idx) => (
                      <option key={idx} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>

                  <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-amber-200 rounded-xl text-amber-700 hover:bg-amber-50 transition-colors">
                      <FiDownload />
                      <span>Export</span>
                    </button>
                    <button
                      className="flex items-center justify-center gap-2 px-4 py-2.5 border border-amber-200 rounded-xl text-amber-700 hover:bg-amber-50 transition-colors"
                      onClick={clearFilters}
                    >
                      <FiX />
                      <span>Clear</span>
                    </button>
                  </div>

                  {/* Date Range Picker */}
                  <div className="pt-4 border-t border-amber-100">
                    <p className="text-sm font-medium text-amber-800 mb-2">Date Range</p>
                    <div className="grid grid-cols-2 gap-2">
                      <DatePicker
                        selected={filters.startDate}
                        onChange={(date) => updateFilter("startDate", date)}
                        selectsStart
                        startDate={filters.startDate}
                        endDate={filters.endDate}
                        placeholderText="Start Date"
                        className="w-full px-3 py-2 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                      <DatePicker
                        selected={filters.endDate}
                        onChange={(date) => updateFilter("endDate", date)}
                        selectsEnd
                        startDate={filters.startDate}
                        endDate={filters.endDate}
                        minDate={filters.startDate}
                        placeholderText="End Date"
                        className="w-full px-3 py-2 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tabs with animated underline */}
            <div className="relative mt-4 md:mt-6">
              <div className="flex gap-2 md:gap-4 border-b border-amber-200 overflow-x-auto">
                {[
                  { id: "all", label: "All Stock", icon: FiPackage },
                  { id: "in-stock", label: "In Stock", icon: FiTrendingUp },
                  { id: "low-stock", label: "Low Stock", icon: FiAlertTriangle },
                  { id: "out-of-stock", label: "Out of Stock", icon: FiBox }
                ].map((t) => {
                  const IconComponent = t.icon;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id)}
                      className={`px-3 py-2 md:px-4 md:py-3 font-medium whitespace-nowrap flex items-center gap-1.5 ${activeTab === t.id ? "text-amber-700" : "text-amber-600"}`}
                    >
                      <IconComponent size={16} />
                      {t.label}
                    </button>
                  );
                })}
              </div>

              {/* animated underline */}
              <motion.div
                layout
                initial={false}
                className="absolute left-0 bottom-0 h-[2px] bg-amber-600 rounded"
                animate={{
                  left:
                    activeTab === "all"
                      ? 0
                      : activeTab === "in-stock"
                      ? "104px"
                      : activeTab === "low-stock"
                      ? "188px"
                      : "282px",
                  width: activeTab === "all" ? "78px" : activeTab === "in-stock" ? "78px" : activeTab === "low-stock" ? "88px" : "108px"
                }}
                transition={{ type: "spring", stiffness: 220, damping: 28 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Table Card */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden border border-amber-200/50"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between p-5 md:p-6 border-b border-amber-200 bg-amber-50/50">
            <h3 className="text-lg font-medium text-amber-900 mb-2 md:mb-0 flex items-center gap-2">
              <FiPackage size={20} />
              {activeTab === "all" ? "All" : activeTab.replace("-", " ")} Products ({filteredRecords.length})
            </h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-sm text-amber-700">
                <span>Show</span>
                <select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="px-2 py-1.5 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </select>
                <span>entries</span>
              </div>
              <button className="hidden md:flex items-center gap-2 px-4 py-2 border border-amber-200 rounded-xl text-amber-700 hover:bg-amber-50 transition-colors">
                <FiPrinter />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-12 text-center">
                <div className="inline-flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="text-amber-600"
                  >
                    <FiRefreshCw size={24} />
                  </motion.div>
                  <span className="ml-3 text-amber-700">Loading stock data...</span>
                </div>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-amber-50 text-amber-700">
                    <th className="px-4 md:px-6 py-4 text-left font-medium text-sm">Product</th>
                    <th className="px-4 md:px-6 py-4 text-left font-medium text-sm hidden md:table-cell">Category</th>
                    <th className="px-4 md:px-6 py-4 text-left font-medium text-sm">Stock In</th>
                    <th className="px-4 md:px-6 py-4 text-left font-medium text-sm">Stock Out</th>
                    <th className="px-4 md:px-6 py-4 text-left font-medium text-sm">Current</th>
                    <th className="px-4 md:px-6 py-4 text-left font-medium text-sm">Status</th>
                    <th className="px-4 md:px-6 py-4 text-left font-medium text-sm hidden lg:table-cell">Last Updated</th>
                    <th className="px-4 md:px-6 py-4 text-left font-medium text-sm">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-amber-200/60">
                  <AnimatePresence>
                    {currentRecords.length > 0 ? (
                      currentRecords.map((record) => (
                        <motion.tr
                          key={record.id}
                          layout
                          initial="hidden"
                          animate="show"
                          exit="exit"
                          variants={rowVariant}
                          className="hover:bg-amber-50/50 transition-colors group"
                        >
                          <td className="px-4 md:px-6 py-4">
                            <div>
                              <p className="font-medium text-amber-900 group-hover:text-amber-700 transition-colors">{record.name}</p>
                              <p className="text-xs text-amber-600">{record.id}</p>
                              <p className="text-xs text-amber-500 md:hidden mt-1">{record.category}</p>
                            </div>
                          </td>
                          <td className="px-4 md:px-6 py-4 text-amber-700 hidden md:table-cell">{record.category}</td>
                          <td className="px-4 md:px-6 py-4">
                            <span className="px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-xs font-medium flex items-center gap-1 w-fit">
                              <FiTrendingUp size={12} />
                              {record.stockIn}
                            </span>
                          </td>
                          <td className="px-4 md:px-6 py-4">
                            <span className="px-3 py-1.5 bg-amber-100 text-amber-800 rounded-full text-xs font-medium flex items-center gap-1 w-fit">
                              <FiTrendingDown size={12} />
                              {record.stockOut}
                            </span>
                          </td>
                          <td className="px-4 md:px-6 py-4 font-medium text-amber-900">{(record.stockIn || 0) - (record.stockOut || 0)}</td>

                          <td className="px-4 md:px-6 py-4">{getStatusBadge(record.status)}</td>
                          <td className="px-4 md:px-6 py-4 text-amber-600 text-sm hidden lg:table-cell">
                            {formatDate(record.lastUpdated)}
                          </td>
                          <td className="px-4 md:px-6 py-4">
                            <div className="flex gap-2">
                              <button
                                className="p-2 text-amber-600 hover:bg-amber-100 rounded-xl transition-colors"
                                title="View"
                                onClick={() => handleViewProduct(record)}
                              >
                                <FiEye size={16} />
                              </button>
                              <button
                                className="p-2 text-amber-600 hover:bg-amber-100 rounded-xl transition-colors"
                                title="Edit"
                                onClick={() => handleEditProduct(record)}
                              >
                                <FiEdit size={16} />
                              </button>
                              <button
                                className="p-2 text-red-600 hover:bg-red-100 rounded-xl transition-colors"
                                title="Delete"
                                onClick={() => handleDeleteProduct(record.id)}
                              >
                                <FiTrash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center"
                      >
                        <td colSpan="8" className="px-6 py-12 text-amber-700">
                          <FiBox className="inline-block mb-2 text-amber-400" size={32} />
                          <p>No products found matching your criteria</p>
                          <button
                            className="mt-3 text-amber-600 underline text-sm hover:text-amber-700 transition-colors"
                            onClick={() => {
                              setSearchTerm("");
                              clearFilters();
                              setActiveTab("all");
                            }}
                          >
                            Clear all filters
                          </button>
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            )}
          </div>

          {/* Footer */}
          <div className="flex flex-col md:flex-row md:items-center justify-between p-4 md:p-6 border-t border-amber-200 gap-4 md:gap-0">
            <p className="text-amber-600 text-sm">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredRecords.length)} of {filteredRecords.length} results
            </p>
            <div className="flex gap-1 md:gap-2">
              <button
                className="flex items-center gap-1 px-3 py-1.5 md:px-4 md:py-2 border border-amber-200 rounded-xl text-amber-700 hover:bg-amber-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <FiChevronLeft size={16} />
                <span className="hidden md:inline">Previous</span>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`px-3 py-1.5 md:px-4 md:py-2 border rounded-xl transition-colors ${
                    currentPage === number
                      ? 'bg-amber-600 text-white border-amber-600'
                      : 'border-amber-200 text-amber-700 hover:bg-amber-50'
                  }`}
                >
                  {number}
                </button>
              ))}

              <button
                className="flex items-center gap-1 px-3 py-1.5 md:px-4 md:py-2 border border-amber-200 rounded-xl text-amber-700 hover:bg-amber-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <span className="hidden md:inline">Next</span>
                <FiChevronRight size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {showProductModal && selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowProductModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-amber-200">
                <h3 className="text-xl font-bold text-amber-900 flex items-center gap-2">
                  <FiPackage />
                  Product Details
                </h3>
                <button
                  className="p-2 text-amber-600 hover:bg-amber-100 rounded-full transition-colors"
                  onClick={() => setShowProductModal(false)}
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="space-y-5 py-2">
                <div>
                  <h4 className="text-lg font-medium text-amber-800">{selectedProduct.name}</h4>
                  <p className="text-amber-600 text-sm">{selectedProduct.id}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-amber-50 p-3 rounded-xl">
                    <p className="text-sm text-amber-700 font-medium">Category</p>
                    <p className="text-amber-900 font-medium">{selectedProduct.category}</p>
                  </div>
                  <div className="bg-amber-50 p-3 rounded-xl">
                    <p className="text-sm text-amber-700 font-medium">Price</p>
                    <p className="text-amber-900 font-medium">{selectedProduct.price}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-xl">
                    <p className="text-sm text-green-700 font-medium">Stock In</p>
                    <p className="text-green-900 font-medium">{selectedProduct.stockIn}</p>
                  </div>
                  <div className="bg-amber-50 p-3 rounded-xl">
                    <p className="text-sm text-amber-700 font-medium">Stock Out</p>
                    <p className="text-amber-900 font-medium">{selectedProduct.stockOut}</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-xl">
                    <p className="text-sm text-blue-700 font-medium">Current Stock</p>
                    <p className="text-blue-900 font-medium">{selectedProduct.currentStock}</p>
                  </div>
                  <div className="p-3 rounded-xl">
                    <p className="text-sm text-amber-700 font-medium">Status</p>
                    <div className="mt-1">{getStatusBadge(selectedProduct.status)}</div>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-sm text-gray-700 font-medium">Supplier</p>
                  <p className="text-gray-900">{selectedProduct.supplier}</p>
                </div>

                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-sm text-gray-700 font-medium">Last Updated</p>
                  <p className="text-gray-900">{formatDate(selectedProduct.lastUpdated)}</p>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-amber-200">
                  <button className="px-4 py-2 border border-amber-200 text-amber-700 rounded-xl hover:bg-amber-50 transition-colors">
                    Edit Product
                  </button>
                  <button className="px-4 py-2 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors flex items-center gap-2">
                    <FiShoppingCart size={16} />
                    Update Stock
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Product Modal */}
      <AnimatePresence>
        {isEditing && editingProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={handleCancelEdit}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-amber-200">
                <h3 className="text-2xl font-bold text-amber-900 flex items-center gap-2">
                  <FiEdit />
                  Edit Product
                </h3>
                <button
                  className="p-2 text-amber-600 hover:bg-amber-100 rounded-full transition-colors"
                  onClick={handleCancelEdit}
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-amber-900 font-medium mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editingProduct.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-amber-900 font-medium mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={editingProduct.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                  >
                    {categories.filter(cat => cat !== "All").map((cat, i) => (
                      <option key={i} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-amber-900 font-medium mb-2">
                    Stock In
                  </label>
                  <input
                    type="number"
                    name="stockIn"
                    value={editingProduct.stockIn}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-amber-900 font-medium mb-2">
                    Stock Out
                  </label>
                  <input
                    type="number"
                    name="stockOut"
                    value={editingProduct.stockOut}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-xl">
                  <label className="block text-blue-900 font-medium mb-2">
                    Current Stock
                  </label>
                  <p className="text-blue-900 font-bold text-xl">
                    {(editingProduct.stockIn || 0) - (editingProduct.stockOut || 0)}
                  </p>
                  <p className="text-blue-700 text-sm mt-1">Calculated automatically</p>
                </div>

                <div>
                  <label className="block text-amber-900 font-medium mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={editingProduct.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                  >
                    <option value="in-stock">In Stock</option>
                    <option value="low-stock">Low Stock</option>
                    <option value="out-of-stock">Out of Stock</option>
                  </select>
                </div>

                <div>
                  <label className="block text-amber-900 font-medium mb-2">
                    Price
                  </label>
                  <input
                    type="text"
                    name="price"
                    value={editingProduct.price}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-amber-900 font-medium mb-2">
                    Supplier
                  </label>
                  <input
                    type="text"
                    name="supplier"
                    value={editingProduct.supplier}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3 pt-5 border-t border-amber-200">
                <button
                  className="px-5 py-2.5 border border-amber-200 text-amber-700 rounded-xl hover:bg-amber-50 transition-colors"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
                <button
                  className="px-5 py-2.5 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors flex items-center gap-2"
                  onClick={handleSaveEdit}
                >
                  <FiSave size={16} />
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}