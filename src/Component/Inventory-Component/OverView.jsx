import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiBox, FiFileText, FiUsers, FiClock, FiArrowRight, FiTrendingUp, FiPlus, FiArrowDown, FiArrowUp } from 'react-icons/fi'

// small count-up hook for stats
function useCountUp(target, duration = 800) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    let start = null
    const from = 0
    const to = target
    function step(ts) {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      setValue(Math.round(from + (to - from) * (1 - Math.pow(1 - progress, 3))))
      if (progress < 1) requestAnimationFrame(step)
    }
    const raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])
  return value
}

function OverView() {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000 * 30) // update every 30s
    return () => clearInterval(id)
  }, [])

  const productHighlights = [
    { id: 1, icon: <FiBox className="text-amber-700" />, title: 'Low Stock Alert', desc: '3 products need restocking' },
    { id: 2, icon: <FiTrendingUp className="text-amber-700" />, title: 'New Arrivals', desc: '12 new products added' },
    { id: 3, icon: <FiUsers className="text-amber-700" />, title: 'Customer Favorites', desc: 'Jasmine demand rising' }
  ]

  // carousel state (cycles automatically)
  const [index, setIndex] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % productHighlights.length), 4500)
    return () => clearInterval(id)
  }, [productHighlights.length])

  const next = () => setIndex((i) => (i + 1) % productHighlights.length)
  const prev = () => setIndex((i) => (i - 1 + productHighlights.length) % productHighlights.length)

  // stats with count-up
  const totalStock = useCountUp(1248)
  const stockIn = useCountUp(384)
  const stockOut = useCountUp(216)

  const shortTime = (d) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const niceDate = (d) => d.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })

  const card = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }

  
  

  return (
    <div className="h-[50vh] p-6 bg-gray-300">
      <div className="max-w-7xl  mx-auto grid grid-cols-12 gap-6">
        {/* LEFT */}
        <div className="col-span-12 lg:col-span-4 grid gap-6">
          <motion.div initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}} transition={{duration:0.45}} className="rounded-2xl p-6 bg-white/80 backdrop-blur-sm border border-amber-200 shadow-md">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center ring-1 ring-amber-50">
                <span className="text-amber-700 font-bold">COF</span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-amber-900">Cloud Of Fragrance</h2>
                <p className="text-xs text-amber-600">Admin • Manager</p>
              </div>
            </div>
            <h1 className="text-2xl font-playfair font-bold text-amber-900 mb-2">Welcome back, Admin!</h1>
            <p className="text-amber-700/80 mb-4">Here's what's happening with your inventory today.</p>
            <div className="flex items-center justify-between text-amber-700 text-sm">
              <span>Last login: Today at 09:42 AM</span>
              <div className="flex items-center gap-2"><FiClock/> <span>{time.toLocaleDateString()}</span></div>
            </div>
          </motion.div>

          <motion.div initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{delay:0.06}} className="rounded-2xl p-6 bg-white/80 backdrop-blur-sm border border-amber-200 shadow-md">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-amber-900">Product Highlights</h3>
              <div className="flex items-center gap-2">
                <button onClick={prev} aria-label="Prev" className="p-1 rounded-md hover:bg-amber-50 transition"><FiArrowLeftIcon/></button>
                <button onClick={next} aria-label="Next" className="p-1 rounded-md hover:bg-amber-50 transition"><FiArrowRight className="text-amber-600"/></button>
              </div>
            </div>

            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div key={productHighlights[index].id} initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}} transition={{duration:0.45}} className="p-3 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-amber-200/40 flex items-center justify-center">{productHighlights[index].icon}</div>
                    <div>
                      <div className="font-medium text-amber-900">{productHighlights[index].title}</div>
                      <div className="text-xs text-amber-600">{productHighlights[index].desc}</div>
                    </div>
                  </div>
                  <FiArrowRight className="text-amber-600" />
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center gap-2 mt-3">
                {productHighlights.map((p, i) => (
                  <button key={p.id} onClick={() => setIndex(i)} className={`w-2 h-2 rounded-full transition-transform ${i===index? 'scale-125 bg-amber-500' : 'bg-amber-200'}`}></button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* RIGHT */}
        <div className="col-span-12 lg:col-span-8  grid grid-rows-12 gap-6">
          <motion.div initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} className="row-span-4 my-[40px] grid grid-cols-12 gap-3">
            <div className="col-span-9 grid grid-cols-3 gap-4">
              <motion.button whileHover={{scale:1.03}} className="rounded-xl p-5 bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg flex flex-col items-center justify-center">
                <FiFileText className="text-2xl mb-2" />
                <span className="text-sm font-medium">Create Invoice</span>
              </motion.button>

              <motion.button whileHover={{scale:1.03}} className="rounded-xl p-5 bg-white border border-amber-200 shadow-md flex flex-col items-center justify-center">
                <FiUsers className="text-2xl mb-2 text-amber-700" />
                <span className="text-sm font-medium text-amber-800">Invoice Records</span>
              </motion.button>

              <motion.button whileHover={{scale:1.03}} className="rounded-xl p-5 bg-[#635c5c54] border border-amber-200 shadow-md flex flex-col items-center justify-center">
                <FiBox className="text-2xl mb-2 text-amber-700" />
                <span className="text-sm font-medium text-amber-800">Inventory</span>
              </motion.button>
            </div>

            <div className="col-span-3">
              <motion.div initial={{opacity:0}} animate={{opacity:1}} className="rounded-2xl p-5 bg-white/80 backdrop-blur-sm border border-amber-200 shadow-md flex flex-col items-center justify-center h-full">
                <FiClock className="text-amber-700 text-2xl mb-2" />
                <div className="text-3xl font-bold text-amber-900">{shortTime(time)}</div>
                <div className="text-amber-600 text-sm mt-1">{niceDate(time)}</div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div initial="hidden" animate="show" variants={{show:{transition:{staggerChildren:0.05}}}} className="row-span-8 bg-transparent backdrop-blur-sm rounded-2xl p-6 border border-amber-200 shadow-md">
            <h3 className="text-lg font-semibold text-amber-900 mb-6">Inventory Overview</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div variants={card} className="rounded-xl p-5 bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-medium">Total Stock Available</h4>
                  <div className="bg-amber-400/20 p-1 rounded">
                    <FiBox className="text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold mb-2">{totalStock.toLocaleString()}</div>
                <div className="flex items-center text-amber-100 text-sm"><FiArrowUp className="mr-1"/> <span>12% from last week</span></div>
              </motion.div>

              <motion.div variants={card} className="rounded-xl p-5 bg-white border border-amber-200 shadow-md">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-medium">Total Stock In</h4>
                  <div className="bg-amber-100 p-1 rounded"><FiArrowDown className="text-amber-600"/></div>
                </div>
                <div className="text-3xl font-bold mb-2">{stockIn.toLocaleString()}</div>
                <div className="flex items-center text-amber-600 text-sm"><FiArrowUp className="mr-1"/> <span>8% from last week</span></div>
              </motion.div>

              <motion.div variants={card} className="rounded-xl p-5 bg-white border border-amber-200 shadow-md">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-medium">Total Stock Out</h4>
                  <div className="bg-amber-100 p-1 rounded"><FiArrowUp className="text-amber-600"/></div>
                </div>
                <div className="text-3xl font-bold mb-2">{stockOut.toLocaleString()}</div>
                <div className="flex items-center text-amber-600 text-sm"><FiArrowUp className="mr-1"/> <span>5% from last week</span></div>
              </motion.div>
            </div>

            <div className="mt-8 border-t border-amber-100 pt-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-amber-900">Recent Activity</h4>
                <button className="text-amber-700 text-sm flex items-center hover:text-amber-900 transition-colors">View all <FiArrowRight className="ml-1"/></button>
              </div>

              <div className="space-y-3">
                <motion.div whileHover={{x:6}} className="flex items-center justify-between p-3 rounded-lg hover:bg-amber-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center"><FiPlus className="text-amber-700"/></div>
                    <div>
                      <p className="text-sm font-medium">New product added</p>
                      <p className="text-xs text-amber-600">2 minutes ago</p>
                    </div>
                  </div>
                  <span className="text-amber-700 text-sm">+1</span>
                </motion.div>

                <motion.div whileHover={{x:6}} className="flex items-center justify-between p-3 rounded-lg hover:bg-amber-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center"><FiFileText className="text-amber-700"/></div>
                    <div>
                      <p className="text-sm font-medium">Invoice #INV-0048 created</p>
                      <p className="text-xs text-amber-600">15 minutes ago</p>
                    </div>
                  </div>
                  <span className="text-amber-700 text-sm">N248.00</span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// small helper icon wrapper to keep markup concise
function FiArrowLeftIcon() { return <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg> }

export default OverView
