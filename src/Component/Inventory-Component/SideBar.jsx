// SideBar.jsx
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiGrid, FiBox, FiFileText, FiUsers,
  FiBarChart2, FiSettings, FiHelpCircle,
  FiLogOut, FiMenu, FiPlus, FiEdit
} from 'react-icons/fi'

export default function SideBar({
  initialOpen = false,
  onLogout = () => {},
  onExpand = () => {},
  onCollapse = () => {},
  // quickLeftRoute = '/create',
  // quickRightRoute = '/explore'
}) {
  const [isOpen, setIsOpen] = useState(initialOpen)
  const [activeItem, setActiveItem] = useState('over-view')
  const navigate = useNavigate()

  // Keep parent informed when isOpen changes
  useEffect(() => {
    if (isOpen) onExpand?.()
    else onCollapse?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  useEffect(() => {
    // initialize based on viewport size if you want different defaults
    const handleResize = () => {
      if (window.innerWidth >= 1024 && initialOpen) setIsOpen(true)
      if (window.innerWidth < 1024 && !initialOpen) setIsOpen(false)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [initialOpen])

  const menuItems = [
    { id: 'over-view', label: 'Dashboard', icon: <FiGrid size={18} />, to: '/cofdashboard' },
    { id: 'newrecords', label: 'Add-Stock', icon: <FiBox size={18} />, to: '/cofdashboard/new-records' },
    { id: 'CheckStocks', label: 'Check-Stocks', icon: <FiFileText size={18} />, to: '/cofdashboard/new-records' },
    { id: 'productlist', label: 'Product-List', icon: <FiUsers size={18} />, to: '/cofdashboard/new-records' },
    { id: 'newproducts', label: 'Add-Products', icon: <FiBarChart2 size={18} />, to: '/cofdashboard/new-records' },

  ]

  // numeric widths (used for framer animation) — match these in parent margins:
  const OPEN_PX = 288   // corresponds to Tailwind ml-72 (18rem = 288px)
  const CLOSED_PX = 80  // corresponds to Tailwind ml-20 (5rem = 80px)

  const sidebarVariants = {
    open: { width: OPEN_PX, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { width: CLOSED_PX, transition: { type: 'spring', stiffness: 300, damping: 30 } }
  }

  const textVariants = { hidden: { opacity: 0, x: -8 }, visible: { opacity: 1, x: 0, transition: { duration: 0.16 } } }

  // open on hover for desktop only
  const handleMouseEnter = () => { if (window.innerWidth >= 1024) setIsOpen(true) }
  const handleMouseLeave = () => { if (window.innerWidth >= 1024 && !initialOpen) setIsOpen(false) }

  return (
    <>
      {/* mobile hamburger to toggle on small screens */}
      <button
        onClick={() => setIsOpen((s) => !s)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md"
        aria-label="Toggle menu"
      >
        <FiMenu size={20} />
      </button>

      {/* mobile overlay */}
      <AnimatePresence>
        {isOpen && typeof window !== 'undefined' && window.innerWidth < 1024 && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 0.45 }} exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black z-40"
          />
        )}
      </AnimatePresence>

      <motion.aside
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="fixed top-0 left-0 h-full bg-white text-amber-900 z-50 shadow-lg overflow-hidden flex flex-col border-r"
        variants={sidebarVariants}
        animate={isOpen ? 'open' : 'closed'}
        initial={false}
        style={{ minWidth: CLOSED_PX }}
      >
        {/* decorative stripe */}
        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-r from-amber-600 to-amber-700 pointer-events-none" />

        {/* header */}
        <div className="flex items-center gap-3 p-4 border-b border-amber-100">
          <div className="w-10 h-10 rounded-md bg-gradient-to-r from-amber-600 to-amber-700 flex items-center justify-center text-white font-bold shadow-sm">COF</div>
          <AnimatePresence>
            {isOpen && (
              <motion.div key="brand" initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -6 }} className="flex-1 overflow-hidden">
                <h1 className="text-lg font-semibold">Cloud Of Fragrance </h1>
                <p className="text-xs text-amber-500">Vendor Portal</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* profile */}
        <div className="p-4 flex items-center gap-3 border-b border-amber-100">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 flex items-center justify-center text-white font-semibold shadow">A</div>
          <AnimatePresence>
            {isOpen && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="truncate font-medium">Welcome</div>
                <div className="text-xs text-amber-500 truncate mt-1">Vendor Manager</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* navigation */}
        <nav className="flex-1 overflow-auto py-3 px-2">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = activeItem === item.id
              return (
                <li key={item.id}>
                  <motion.div initial={{ backgroundColor: 'transparent' }} whileHover={{ backgroundColor: 'rgba(183,123,29,0.06)' }} transition={{ duration: 0.12 }} className="rounded-md">
                    <Link
                      to={item.to}
                      onClick={() => setActiveItem(item.id)}
                      className={`group flex items-center gap-3 w-full px-3 py-2 rounded-md transition-all focus:outline-none ${
                        isActive ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow' : 'text-amber-900'
                      }`}
                    >
                      <motion.span
                        style={{ color: isActive ? '#fff' : '#b77b1d' }}
                        whileHover={{ scale: 1.12, rotate: 8 }}
                        whileTap={{ scale: 0.96 }}
                        transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                        className="flex-shrink-0 rounded-md p-1"
                        aria-hidden
                      >
                        {item.icon}
                      </motion.span>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.span key={item.id} initial="hidden" animate="visible" exit="hidden" variants={textVariants} className={`truncate font-medium ${isActive ? 'text-white' : 'text-amber-900'}`}>
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>

                      {isActive && <motion.div className="ml-auto w-1 h-6 rounded-full bg-gradient-to-r from-amber-600 to-amber-700" initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ duration: 0.14 }} />}
                    </Link>
                  </motion.div>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* footer / logout */}
        <div className="p-3 border-t border-amber-100">
          <motion.button onClick={() => onLogout()} whileHover={{ x: 6 }} className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-amber-900 hover:bg-yellow-50 focus:outline-none">
            <motion.span style={{ color: '#b77b1d' }} whileHover={{ scale: 1.08 }}>
              <FiLogOut size={18} />
            </motion.span>
            <AnimatePresence>{isOpen && <motion.span initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -6 }}>Logout</motion.span>}</AnimatePresence>
          </motion.button>
        </div>
      </motion.aside>
    </>
  )
}
