import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiSearch,
  FiFilter,
  FiEdit,
  FiTrash2,
  FiPlus,
  FiBox,
  FiTag,
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown
} from 'react-icons/fi'

// small animated counter
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
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'

  const products = [
    { id: 'PRD-001', name: 'Luxe Gold Perfume', category: 'Perfumes', price: 89.99, stock: 25, status: 'in-stock', description: 'Premium luxury perfume with gold accents' },
    { id: 'PRD-002', name: 'Amber Essence Oil', category: 'Essential Oils', price: 42.5, stock: 5, status: 'low-stock', description: 'Pure amber essential oil in decorative bottle' },
    { id: 'PRD-003', name: 'Rose Petal Diffuser', category: 'Diffusers', price: 65.0, stock: 0, status: 'out-of-stock', description: 'Elegant reed diffuser with rose petal fragrance' },
    { id: 'PRD-004', name: 'Vanilla Dream Candle', category: 'Candles', price: 38.0, stock: 35, status: 'in-stock', description: 'Hand-poured vanilla scented candle' },
    { id: 'PRD-005', name: 'Sandalwood Gift Set', category: 'Gift Sets', price: 125.0, stock: 2, status: 'low-stock', description: 'Luxury sandalwood fragrance gift set' },
    { id: 'PRD-006', name: 'Ocean Breeze Room Spray', category: 'Sprays', price: 28.5, stock: 18, status: 'in-stock', description: 'Refreshing ocean breeze room spray' },
    { id: 'PRD-007', name: 'Lavender Sachets', category: 'Accessories', price: 22.0, stock: 0, status: 'out-of-stock', description: 'Lavender sachets for drawers and closets' },
    { id: 'PRD-008', name: 'Citrus Zest Oil Blend', category: 'Essential Oils', price: 45.0, stock: 7, status: 'low-stock', description: 'Energizing citrus essential oil blend' }
  ]

  const categories = ['All', 'Perfumes', 'Essential Oils', 'Diffusers', 'Candles', 'Gift Sets', 'Sprays', 'Accessories']
  const statusOptions = ['All', 'In Stock', 'Low Stock', 'Out of Stock']

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const q = searchTerm.trim().toLowerCase()
      const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory
      const matchesStatus =
        selectedStatus === 'All' ||
        (selectedStatus === 'In Stock' && p.status === 'in-stock') ||
        (selectedStatus === 'Low Stock' && p.status === 'low-stock') ||
        (selectedStatus === 'Out of Stock' && p.status === 'out-of-stock')
      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [products, searchTerm, selectedCategory, selectedStatus])

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
  const inStockCount = useCountUp(products.filter(p => p.status === 'in-stock').length)
  const lowStockCount = useCountUp(products.filter(p => p.status === 'low-stock').length)

  const getStatusBadge = (status) => {
    const statusConfig = {
      'in-stock': { text: 'In Stock', color: 'bg-green-100 text-green-800' },
      'low-stock': { text: 'Low Stock', color: 'bg-amber-100 text-amber-800' },
      'out-of-stock': { text: 'Out of Stock', color: 'bg-red-100 text-red-800' }
    }
    const config = statusConfig[status]
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>{config.text}</span>
  }

  const cardVariant = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }
  const rowVariant = { hidden: { opacity: 0, x: -8 }, show: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 8 } }

  return (
    <motion.div className="min-h-screen bg-gray-100 p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="max-w-7xl mx-auto">
        <motion.div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4" initial={{ y: -6, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <div>
            <h1 className="text-3xl font-playfair font-bold text-amber-900 mb-1">Product Catalog</h1>
            <p className="text-amber-700">Manage your luxury fragrance products</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex gap-3">
              <motion.div whileHover={{ scale: 1.03 }} className="bg-white rounded-2xl p-3 shadow border border-amber-200/50 flex items-center gap-3">
                <FiBox className="text-amber-700" />
                <div>
                  <div className="text-sm text-amber-600">Total</div>
                  <div className="text-lg font-bold text-amber-900">{totalCount}</div>
                </div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.03 }} className="bg-white rounded-2xl p-3 shadow border border-amber-200/50 flex items-center gap-3">
                <FiTrendingUp className="text-green-600" />
                <div>
                  <div className="text-sm text-amber-600">In Stock</div>
                  <div className="text-lg font-bold text-amber-900">{inStockCount}</div>
                </div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.03 }} className="bg-white rounded-2xl p-3 shadow border border-amber-200/50 flex items-center gap-3">
                <FiTrendingDown className="text-amber-700" />
                <div>
                  <div className="text-sm text-amber-600">Low Stock</div>
                  <div className="text-lg font-bold text-amber-900">{lowStockCount}</div>
                </div>
              </motion.div>
            </div>
              <a href="">
                     <motion.button whileHover={{ scale: 1.03 }} className="mt-2 md:mt-0 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all">
              <FiPlus />
              <span>Add New Product</span>
            </motion.button>
              </a>
          
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-lg mb-6 border border-amber-200/50">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600" />
                <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} type="text" placeholder="Search products..." className="w-full pl-10 pr-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
              </div>

              <div className="flex flex-wrap gap-3 items-center">
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                  {categories.map((c, i) => <option key={i} value={c}>{c}</option>)}
                </select>

                <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                  {statusOptions.map((s, i) => <option key={i} value={s}>{s}</option>)}
                </select>

                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                  <option value="name">Sort by Name</option>
                  <option value="price">Sort by Price</option>
                  <option value="stock">Sort by Stock</option>
                  <option value="category">Sort by Category</option>
                </select>

                <div className="flex border border-amber-200 rounded-lg overflow-hidden">
                  <button onClick={() => setViewMode('grid')} className={`p-3 ${viewMode === 'grid' ? 'bg-amber-100 text-amber-700' : 'text-amber-600'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                  </button>
                  <button onClick={() => setViewMode('list')} className={`p-3 ${viewMode === 'list' ? 'bg-amber-100 text-amber-700' : 'text-amber-600'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mb-4 flex justify-between items-center">
          <p className="text-amber-700">Showing {sortedProducts.length} of {products.length} products</p>
          <div className="text-sm text-amber-600">Last updated: Today at 11:45 AM</div>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {sortedProducts.map((p) => (
                <motion.div layout key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} whileHover={{ scale: 1.02 }} className="bg-white m-[20px] rounded-2xl shadow-lg overflow-hidden border border-amber-200/50">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-700 font-medium">{p.name.split(' ').map(n=>n[0]).slice(0,2).join('')}</div>
                        <div>
                          <h3 className="font-medium text-amber-900">{p.name}</h3>
                          <p className="text-sm text-amber-600">{p.id}</p>
                        </div>
                      </div>
                      <div>{getStatusBadge(p.status)}</div>
                    </div>

                    <p className="text-sm text-amber-600 mb-4 line-clamp-2">{p.description}</p>

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-amber-700 font-medium">{p.category}</span>
                      <span className="font-bold text-amber-900">${p.price}</span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <div className="text-sm text-amber-600">{p.stock} in stock</div>

                      <div className="flex gap-2 w-full">
                        {/* VIEW button removed as requested */}
                        <button title="Edit" className="flex-1 flex items-center justify-center gap-1 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors">
                          <FiEdit className="h-4 w-4" />
                          <span className="text-sm">Edit</span>
                        </button>

                        <button title="Delete" className="flex-1 flex items-center justify-center gap-1 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                          <FiTrash2 className="h-4 w-4" />
                          <span className="text-sm">Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-amber-200/50">
            <table className="w-full">
              <thead>
                <tr className="bg-amber-50 text-amber-700">
                  <th className="px-6 py-4 text-left font-medium">Product</th>
                  <th className="px-6 py-4 text-left font-medium">Category</th>
                  <th className="px-6 py-4 text-left font-medium">Price</th>
                  <th className="px-6 py-4 text-left font-medium">Stock</th>
                  <th className="px-6 py-4 text-left font-medium">Status</th>
                  <th className="px-6 py-4 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-200">
                <AnimatePresence initial={false}>
                  {sortedProducts.map((p) => (
                    <motion.tr key={p.id} layout initial="hidden" animate="show" exit="exit" variants={rowVariant} className="hover:bg-amber-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-700 font-medium">{p.name.split(' ').map(n=>n[0]).slice(0,2).join('')}</div>
                          <div>
                            <p className="font-medium text-amber-900">{p.name}</p>
                            <p className="text-sm text-amber-600">{p.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-amber-700">{p.category}</td>
                      <td className="px-6 py-4 font-medium text-amber-900">${p.price}</td>
                      <td className="px-6 py-4"><span className={p.stock === 0 ? 'text-red-600' : p.stock <= 10 ? 'text-amber-600' : 'text-green-600'}>{p.stock}</span></td>
                      <td className="px-6 py-4">{getStatusBadge(p.status)}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {/* VIEW button removed */}
                          <button className="p-2 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors" title="Edit"><FiEdit /></button>
                          <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Delete"><FiTrash2 /></button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}

        {sortedProducts.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-amber-200/50">
            <FiBox className="mx-auto h-12 w-12 text-amber-300" />
            <h3 className="mt-4 text-lg font-medium text-amber-900">No products found</h3>
            <p className="mt-2 text-amber-600">Try adjusting your search or filter to find what you're looking for.</p>
          </div>
        )}

        {sortedProducts.length > 0 && (
          <div className="mt-8 flex justify-center">
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-amber-200 rounded-lg text-amber-700 hover:bg-amber-50 transition-colors">Previous</button>
              <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">1</button>
              <button className="px-4 py-2 border border-amber-200 rounded-lg text-amber-700 hover:bg-amber-50 transition-colors">2</button>
              <button className="px-4 py-2 border border-amber-200 rounded-lg text-amber-700 hover:bg-amber-50 transition-colors">3</button>
              <button className="px-4 py-2 border border-amber-200 rounded-lg text-amber-700 hover:bg-amber-50 transition-colors">Next</button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
