import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArchive, FiFileText, FiPlus, FiCompass, FiAward, FiShoppingBag } from 'react-icons/fi'

export default function Selection({
  inventoryRoute = '/cofdashboard',
  invoiceRoute = '/invoices',
  leftBtnRoute = '/create',
  rightBtnRoute = '/explore',
  leftBtnLabel = 'Create',
  rightBtnLabel = 'Explore'
}) {
  const [activeButton, setActiveButton] = useState(null)
  const navigate = useNavigate()

  const cardVariants = {
    rest: { 
      scale: 1, 
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 5px 10px -5px rgba(0, 0, 0, 0.04)',
      y: 0
    },
    hover: { 
      scale: 1.03, 
      boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.15), 0 10px 20px -10px rgba(0, 0, 0, 0.08)',
      y: -5
    }
  }

  const iconVariants = {
    rest: { scale: 1, rotate: 0 },
    hover: { scale: 1.1, rotate: -5 }
  }

  const float = { y: [0, -10, 0] }
  const floatTransition = { duration: 3.5, ease: 'easeInOut', repeat: Infinity }

  const handleKeyNav = (route) => (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      navigate(route)
    }
  }

  return (
    <div className="min-h-screen bg-gray-300 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div 
        className="absolute top-1/4 -left-20 w-80 h-80 bg-amber-200/30 rounded-full pointer-events-none"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.25, 0.2]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-200/30 rounded-full pointer-events-none"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.25, 0.2]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      
      {/* Decorative corner elements */}
      <div className="absolute top-0 left-0 w-40 h-40 -mt-20 -ml-20 bg-gradient-to-br from-amber-400/10 to-transparent rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 -mb-20 -mr-20 bg-gradient-to-tr from-purple-400/10 to-transparent rounded-full"></div>

      {/* Header */}
      <div className="text-center absolute top-8 left-0 right-0">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <FiAward className="h-6 w-6 text-amber-600" />
             <h1 className="text-4xl font-extrabold tracking-tight text-yellow-800 font-playfair">Cloud Of Fragrance</h1>
           
          </div>
          <p className="text-amber-600/80 tracking-widest text-sm font-light uppercase">Vendor Management System</p>
          <div className="w-24 h-0.5 bg-gradient-to-r from-amber-400/50 to-amber-600/50 mt-4 rounded-full"></div>
        </motion.div>
      </div>

      {/* Main Cards */}
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
        {/* Inventory Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          tabIndex={0}
          role="button"
          aria-pressed={activeButton === 'inventory'}
          onMouseEnter={() => setActiveButton('inventory')}
          onMouseLeave={() => setActiveButton(null)}
          onFocus={() => setActiveButton('inventory')}
          onBlur={() => setActiveButton(null)}
          onClick={() => navigate(inventoryRoute)}
          onKeyDown={handleKeyNav(inventoryRoute)}
          initial="rest"
          whileHover="hover"
          animate={activeButton === 'inventory' ? 'hover' : 'rest'}
          variants={cardVariants}
          className="relative bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden cursor-pointer outline-none border border-amber-100/50"
        >
          <div className="p-10 flex flex-col items-center">
            <motion.div 
              className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center mb-6 shadow-inner"
              variants={iconVariants}
            >
              <FiArchive className="h-12 w-12 text-amber-700" />
            </motion.div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3 font-playfair">Inventory Management</h2>
            <p className="text-gray-600 mb-8 text-center leading-relaxed max-w-xs">Manage your perfume inventory, track stock levels, and analyze product performance</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => { e.stopPropagation(); navigate(inventoryRoute) }}
              className="px-8 py-3.5 bg-gradient-to-r from-[#e4c723] to-[#9c8817] text-white rounded-xl hover:shadow-lg transition-all font-medium flex items-center gap-2 shadow-md shadow-amber-200"
            >
              <FiShoppingBag className="h-4 w-4" />
              Access Inventory
            </motion.button>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 -mt-6 -mr-6 w-28 h-28 bg-amber-200/40 rounded-full pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-20 h-20 bg-amber-300/30 rounded-full pointer-events-none"></div>
        </motion.div>

        {/* Invoice Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          tabIndex={0}
          role="button"
          aria-pressed={activeButton === 'invoice'}
          onMouseEnter={() => setActiveButton('invoice')}
          onMouseLeave={() => setActiveButton(null)}
          onFocus={() => setActiveButton('invoice')}
          onBlur={() => setActiveButton(null)}
          onClick={() => navigate(invoiceRoute)}
          onKeyDown={handleKeyNav(invoiceRoute)}
          initial="rest"
          whileHover="hover"
          animate={activeButton === 'invoice' ? 'hover' : 'rest'}
          variants={cardVariants}
          className="relative bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden cursor-pointer outline-none border border-purple-100/50"
        >
          <div className="p-10 flex flex-col items-center">
            <motion.div 
              className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center mb-6 shadow-inner"
              variants={iconVariants}
            >
              <FiFileText className="h-12 w-12 text-purple-700" />
            </motion.div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3 font-playfair">Invoice System</h2>
            <p className="text-gray-600 mb-8 text-center leading-relaxed max-w-xs">Create and manage invoices, track payments, and manage customer orders</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => { e.stopPropagation(); navigate(invoiceRoute) }}
              className="px-8 py-3.5 bg-gradient-to-r from-[#e4c723] to-[#9c8817] text-white rounded-xl hover:shadow-lg transition-all font-medium flex items-center gap-2 shadow-md shadow-purple-200"
            >
              <FiFileText className="h-4 w-4" />
              Access Invoices
            </motion.button>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 left-0 -mt-6 -ml-6 w-28 h-28 bg-purple-200/40 rounded-full pointer-events-none"></div>
          <div className="absolute bottom-0 right-0 -mb-6 -mr-6 w-20 h-20 bg-purple-300/30 rounded-full pointer-events-none"></div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="absolute bottom-6 left-0 right-0 text-center"
      >
        <p className="text-xs text-gray-500/80">© {new Date().getFullYear()} Cloud Of Fragrance. All rights reserved.</p>
      </motion.div>

      {/* Floating Buttons */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        aria-label={leftBtnLabel}
        onClick={() => navigate(leftBtnRoute)}
        whileHover={{ scale: 1.08, boxShadow: '0 12px 25px -8px rgba(180, 83, 9, 0.3)' }}
        whileTap={{ scale: 0.96 }}
        animate={float}
        transition={floatTransition}
        className="fixed left-6 bottom-8 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg bg-gradient-to-br from-white to-amber-50 border border-amber-200 focus:outline-none focus:ring-3 focus:ring-amber-300/50"
        title={leftBtnLabel}
      >
        <FiPlus className="h-5 w-5 text-amber-700" />
        <span className="hidden sm:inline text-sm font-medium text-amber-800">{leftBtnLabel}</span>
      </motion.button>

      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.7 }}
        aria-label={rightBtnLabel}
        onClick={() => navigate(rightBtnRoute)}
        whileHover={{ scale: 1.08, boxShadow: '0 12px 25px -8px rgba(180, 83, 9, 0.5)' }}
        whileTap={{ scale: 0.96 }}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3.8, ease: 'easeInOut', repeat: Infinity }}
        className="fixed right-6 bottom-8 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg bg-gradient-to-r from-amber-600 to-amber-700 text-white focus:outline-none focus:ring-3 focus:ring-amber-400/50"
        title={rightBtnLabel}
      >
        <FiCompass className="h-5 w-5" />
        <span className="hidden sm:inline text-sm font-medium">{rightBtnLabel}</span>
      </motion.button>
    </div>
  )
}