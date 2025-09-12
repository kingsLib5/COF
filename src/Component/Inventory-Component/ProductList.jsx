import React, { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiSearch, FiEdit, FiTrash2, FiPlus, FiBox, FiTrendingUp, 
  FiTrendingDown, FiFilter, FiX, FiSave, FiPackage
} from 'react-icons/fi'
import api from '../../api/axiosConfig'

// Format number as Nigerian Naira
const formatNaira = (amount) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

function useCountUp(target, duration = 700) {
  const [value, setValue] = useState(0)
  React.useEffect(() => {
    let raf = null
    let start = null
    function step(ts) {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(target * eased))
      if (progress < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])
  return value
}

export default function ProductList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [sortBy, setSortBy] = useState('name')
  const [viewMode, setViewMode] = useState('grid')
  const [products, setProducts] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [formData, setFormData] = useState({ name:'', description:'', category:'', price:'', stock:'', sku:'' })

  const categories = ['All', 'Perfumes', 'Essential Oils', 'Diffusers', 'Candles', 'Gift Sets', 'Sprays', 'Accessories']
  const statusOptions = ['All', 'In Stock', 'Low Stock', 'Out of Stock']

  const fetchProducts = async () => {
    try {
      const res = await api.get('/api/products')
      const prods = res.data.map(p => ({
        ...p,
        status: p.stock === 0 ? 'out-of-stock' : p.stock <= 10 ? 'low-stock' : 'in-stock'
      }))
      setProducts(prods)
    } catch (err) {
      console.error('Failed to fetch products', err)
    }
  }

  useEffect(() => { fetchProducts() }, [])

  const filtered = useMemo(() => products.filter(p => {
    const q = searchTerm.trim().toLowerCase()
    const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.id?.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q)
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory
    const matchesStatus =
      selectedStatus === 'All' ||
      (selectedStatus === 'In Stock' && p.status === 'in-stock') ||
      (selectedStatus === 'Low Stock' && p.status === 'low-stock') ||
      (selectedStatus === 'Out of Stock' && p.status === 'out-of-stock')
    return matchesSearch && matchesCategory && matchesStatus
  }), [products, searchTerm, selectedCategory, selectedStatus])

  const sortedProducts = useMemo(() => {
    const arr = [...filtered]
    arr.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'price') return a.price - b.price
      if (sortBy === 'stock') return a.stock - b.stock
      if (sortBy === 'category') return a.category.localeCompare(b.category)
      return 0
    })
    return arr
  }, [filtered, sortBy])

  const totalCount = useCountUp(products.length)
  const inStockCount = useCountUp(products.filter(p => p.status==='in-stock').length)
  const lowStockCount = useCountUp(products.filter(p => p.status==='low-stock').length)
  const outOfStockCount = useCountUp(products.filter(p => p.status==='out-of-stock').length)

  const getStatusBadge = (status) => {
    const statusConfig = {
      'in-stock': { 
        text: 'In Stock', 
        color: 'bg-green-100 text-green-800 border border-green-200',
        icon: FiTrendingUp
      },
      'low-stock': { 
        text: 'Low Stock', 
        color: 'bg-amber-100 text-amber-800 border border-amber-200',
        icon: FiTrendingDown
      },
      'out-of-stock': { 
        text: 'Out of Stock', 
        color: 'bg-red-100 text-red-800 border border-red-200',
        icon: FiBox
      }
    }
    const config = statusConfig[status]
    const IconComponent = config.icon
    
    return (
      <span className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 ${config.color}`}>
        <IconComponent size={12} />
        {config.text}
      </span>
    )
  }

  const cardVariant = { 
    hidden: { opacity: 0, y: 12, scale: 0.95 }, 
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3 } } 
  }
  
  const rowVariant = { 
    hidden: { opacity: 0, x: -12 }, 
    show: { opacity: 1, x: 0, transition: { duration: 0.2 } }, 
    exit: { opacity: 0, x: 12, transition: { duration: 0.1 } } 
  }

  const handleEdit = (product) => {
    setEditProduct(product)
    setFormData({ 
      name: product.name, 
      description: product.description, 
      category: product.category, 
      price: product.price, 
      stock: product.stock, 
      sku: product.sku 
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if(!window.confirm('Are you sure you want to delete this product?')) return
    try {
      await api.delete(`/api/products/${id}`)
      fetchProducts()
    } catch(err){ console.error('Delete failed', err) }
  }

  const handleSave = async () => {
    try {
      if(editProduct){
        await api.patch(`/api/products/${editProduct._id}`, formData)
      } else {
        await api.post('/api/products', formData)
      }
      setShowModal(false)
      setEditProduct(null)
      setFormData({ name:'', description:'', category:'', price:'', stock:'', sku:'' })
      fetchProducts()
    } catch(err){ console.error('Save failed', err) }
  }

  const handleCancel = () => {
    setShowModal(false)
    setEditProduct(null)
    setFormData({ name:'', description:'', category:'', price:'', stock:'', sku:'' })
  }

  return (
    <motion.div className="min-h-screen bg-gray-300 p-6" initial={{ opacity:0 }} animate={{ opacity:1 }}>
      <div className="max-w-7xl mx-auto">
        <motion.div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4" initial={{ y: -6, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <div>
            <h1 className="text-3xl font-bold text-amber-900 mb-1 flex items-center gap-2">
              <FiPackage className="text-amber-700" />
              Product Catalog
            </h1>
            <p className="text-amber-700">Manage your luxury fragrance products</p>
          </div>

          <div className="flex items-center   gap-3">
            <div className="hidden md:flex  mx-[40px] gap-3">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="bg-white rounded-2xl  p-4 shadow-lg border border-amber-200/50 flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-xl">
                  <FiBox className="text-amber-700 text-lg" />
                </div>
                <div>
                  <div className="text-sm text-amber-600">Total Products</div>
                  <div className="text-lg font-bold text-amber-900">{totalCount}</div>
                </div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="bg-white rounded-2xl p-4 shadow-lg border border-green-200/50 flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-xl">
                  <FiTrendingUp className="text-green-700 text-lg" />
                </div>
                <div>
                  <div className="text-sm text-green-600">In Stock</div>
                  <div className="text-lg font-bold text-green-900">{inStockCount}</div>
                </div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="bg-white rounded-2xl p-4 shadow-lg border border-amber-200/50 flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-xl">
                  <FiTrendingDown className="text-amber-700 text-lg" />
                </div>
                <div>
                  <div className="text-sm text-amber-600">Low Stock</div>
                  <div className="text-lg font-bold text-amber-900">{lowStockCount}</div>
                </div>
              </motion.div>
            </div>
            <a href="/cofdashboard/add-products">
                   <motion.button 
                // onClick={() => setShowModal(true)} 
                whileHover={{ scale: 1.03 }} 
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <FiPlus />
                <span>Add New Product</span>
              </motion.button>
            </a>
             
          </div>
        </motion.div>

        {/* Summary Cards for Mobile */}
        <div className="grid grid-cols-2 gap-3 mb-6 md:hidden">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl p-3 shadow border border-amber-200/50">
            <div className="text-sm text-amber-600">Total</div>
            <div className="text-lg font-bold text-amber-900">{totalCount}</div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl p-3 shadow border border-green-200/50">
            <div className="text-sm text-green-600">In Stock</div>
            <div className="text-lg font-bold text-green-900">{inStockCount}</div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl p-3 shadow border border-amber-200/50">
            <div className="text-sm text-amber-600">Low Stock</div>
            <div className="text-lg font-bold text-amber-900">{lowStockCount}</div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl p-3 shadow border border-red-200/50">
            <div className="text-sm text-red-600">Out of Stock</div>
            <div className="text-lg font-bold text-red-900">{outOfStockCount}</div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-lg mb-6 border border-amber-200/50">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600" />
                <input 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  type="text" 
                  placeholder="Search products by name, SKU or ID..." 
                  className="w-full pl-10 pr-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors" 
                />
              </div>

              <div className="flex flex-wrap gap-3 items-center">
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)} 
                  className="px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                >
                  {categories.map((c, i) => <option key={i} value={c}>{c}</option>)}
                </select>

                <select 
                  value={selectedStatus} 
                  onChange={(e) => setSelectedStatus(e.target.value)} 
                  className="px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                >
                  {statusOptions.map((s, i) => <option key={i} value={s}>{s}</option>)}
                </select>

                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)} 
                  className="px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price">Sort by Price</option>
                  <option value="stock">Sort by Stock</option>
                  <option value="category">Sort by Category</option>
                </select>

                <div className="flex border border-amber-200 rounded-xl overflow-hidden">
                  <button 
                    onClick={() => setViewMode('grid')} 
                    className={`p-3 ${viewMode === 'grid' ? 'bg-amber-100 text-amber-700' : 'text-amber-600 hover:bg-amber-50'} transition-colors`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => setViewMode('list')} 
                    className={`p-3 ${viewMode === 'list' ? 'bg-amber-100 text-amber-700' : 'text-amber-600 hover:bg-amber-50'} transition-colors`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mb-4 flex justify-between items-center">
          <p className="text-amber-700">Showing {sortedProducts.length} of {products.length} products</p>
          <div className="text-sm text-amber-600">Last updated: {new Date().toLocaleDateString()}</div>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {sortedProducts.map(p => (
                <motion.div 
                  layout 
                  key={p._id || p.id} 
                  variants={cardVariant}
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border border-amber-200/50 p-5 transition-all duration-200 hover:shadow-xl"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-medium text-amber-900">{p.name}</h3>
                      <p className="text-sm text-amber-600">{p.sku || p.id}</p>
                    </div>
                    {getStatusBadge(p.status)}
                  </div>
                  <p className="text-sm text-amber-600 mb-4 line-clamp-2 h-10">{p.description}</p>
                  <div className="flex justify-between mb-4">
                    <span className="text-amber-700 font-medium bg-amber-50 px-2 py-1 rounded-lg text-sm">{p.category}</span>
                    <span className="font-bold text-amber-900">{formatNaira(p.price)}</span>
                  </div>
                  <div className="text-sm text-amber-700 mb-4">
                    <span className="font-medium">Stock: </span>{p.stock} units
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEdit(p)} 
                      className="flex-1 flex items-center justify-center gap-1 py-2 bg-amber-100 text-amber-700 rounded-xl hover:bg-amber-200 transition-colors"
                    >
                      <FiEdit /> Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(p._id || p.id)} 
                      className="flex-1 flex items-center justify-center gap-1 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors"
                    >
                      <FiTrash2 /> Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden border border-amber-200/50"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-amber-50 text-amber-700">
                    <th className="px-6 py-4 text-left font-medium">Product</th>
                    <th className="px-6 py-4 text-left font-medium hidden md:table-cell">Category</th>
                    <th className="px-6 py-4 text-left font-medium">Price</th>
                    <th className="px-6 py-4 text-left font-medium">Stock</th>
                    <th className="px-6 py-4 text-left font-medium">Status</th>
                    <th className="px-6 py-4 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-200">
                  <AnimatePresence initial={false}>
                    {sortedProducts.map(p => (
                      <motion.tr 
                        key={p._id || p.id} 
                        layout 
                        initial="hidden" 
                        animate="show" 
                        exit="exit" 
                        variants={rowVariant} 
                        className="hover:bg-amber-50/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-amber-900">{p.name}</div>
                            <div className="text-sm text-amber-600">{p.sku || p.id}</div>
                            <div className="text-sm text-amber-500 md:hidden mt-1">{p.category}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">{p.category}</td>
                        <td className="px-6 py-4 font-medium text-amber-900">{formatNaira(p.price)}</td>
                        <td className="px-6 py-4">{p.stock}</td>
                        <td className="px-6 py-4">{getStatusBadge(p.status)}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleEdit(p)} 
                              className="p-2 text-amber-600 hover:bg-amber-100 rounded-xl transition-colors"
                            >
                              <FiEdit />
                            </button>
                            <button 
                              onClick={() => handleDelete(p._id || p.id)} 
                              className="p-2 text-red-600 hover:bg-red-100 rounded-xl transition-colors"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {sortedProducts.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-12 text-center shadow-lg border border-amber-200/50"
          >
            <FiBox className="mx-auto h-12 w-12 text-amber-300" />
            <h3 className="mt-4 text-lg font-medium text-amber-900">No products found</h3>
            <p className="mt-1 text-sm text-amber-600">Try adjusting your search, filters, or add a new product.</p>
            <button 
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('All')
                setSelectedStatus('All')
              }}
              className="mt-4 px-4 py-2 bg-amber-100 text-amber-700 rounded-xl hover:bg-amber-200 transition-colors"
            >
              Clear all filters
            </button>
          </motion.div>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
            onClick={() => handleCancel()}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-amber-200">
                <h2 className="text-xl font-bold text-amber-900 flex items-center gap-2">
                  <FiPackage />
                  {editProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button 
                  onClick={() => handleCancel()}
                  className="p-2 text-amber-600 hover:bg-amber-100 rounded-full transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                {['name', 'sku', 'description', 'category', 'price', 'stock'].map(field => (
                  <div key={field}>
                    <label className="block text-amber-900 font-medium mb-2 capitalize">
                      {field}
                    </label>
                    {field === 'description' ? (
                      <textarea
                        value={formData[field]}
                        onChange={e => setFormData({...formData, [field]: e.target.value})}
                        className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                        rows="3"
                      />
                    ) : (
                      <input
                        type={field === 'price' || field === 'stock' ? 'number' : 'text'}
                        value={formData[field]}
                        onChange={e => setFormData({...formData, [field]: e.target.value})}
                        className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                      />
                    )}
                  </div>
                ))}
                
                {formData.price > 0 && (
                  <div className="bg-amber-50 p-3 rounded-xl">
                    <p className="text-sm text-amber-700">Price display:</p>
                    <p className="font-medium text-amber-900">{formatNaira(formData.price)}</p>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-amber-200">
                <button 
                  onClick={() => handleCancel()}
                  className="px-4 py-2 border border-amber-200 text-amber-700 rounded-xl hover:bg-amber-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="px-4 py-2 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors flex items-center gap-2"
                >
                  <FiSave size={16} />
                  {editProduct ? 'Save Changes' : 'Add Product'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}