import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Login() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const perfumes = [
    {
      name: 'Eternal Essence',
      description: 'A timeless fragrance that captures the essence of luxury',
      color: 'linear-gradient(180deg,#FDE68A,#F59E0B)'
    },
    {
      name: 'Midnight Bloom',
      description: 'An exotic blend that blossoms under moonlight',
      color: 'linear-gradient(180deg,#FDE68A,#B45309)'
    },
    {
      name: 'Ocean Mist',
      description: 'Fresh aquatic notes with a hint of mountain air',
      color: 'linear-gradient(180deg,#FDE68A,#D97706)'
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((p) => (p + 1) % perfumes.length)
    }, 4200)
    return () => clearInterval(timer)
  }, [perfumes.length])

  // Motion variants
  const container = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { staggerChildren: 0.06 } }
  }

  const fadeUp = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  const slide = {
    initial: { opacity: 0, x: 30, scale: 0.98 },
    animate: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.8 } },
    exit: { opacity: 0, x: -30, scale: 0.98, transition: { duration: 0.6 } }
  }

  return (
    <div className="min-h-screen bg-gray-300 flex items-center justify-center p-6">
      {/* small component-scoped styles for subtle shimmer & float */}
      <style>{`
        @keyframes floaty { 0% { transform: translateY(0) } 50% { transform: translateY(-8px) } 100% { transform: translateY(0) } }
        @keyframes shine { 0% { background-position: -200% 0 } 100% { background-position: 200% 0 } }
        .gold-shimmer { background: linear-gradient(90deg, rgba(255,255,255,0.0) 0%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.0) 100%); background-size: 200% auto; animation: shine 2.6s linear infinite; }
        .bottle-shadow { box-shadow: 0 12px 30px rgba(34,34,34,0.18); }
      `}</style>

      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* ========== LOGIN FORM (left) ========== */}
        <motion.div
          className="p-8 md:p-12 flex flex-col justify-center bg-white"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={fadeUp} className="text-center mb-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-yellow-800 font-playfair">Cloud Of Fragrance</h1>
            <p className="text-sm tracking-widest text-yellow-600 mt-2">Embrace The Essence  Of Elegance</p>

            <p className="text-sm tracking-widest text-yellow-600 mt-2">Management Portal</p>
          </motion.div>

          <motion.form variants={fadeUp} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 300 }}
                type="text"
                className="w-full px-4 py-3 border border-yellow-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-300 transition"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 300 }}
                type="password"
                className="w-full px-4 py-3 border border-yellow-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-300 transition"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-gray-700">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                />
                <span className="ml-2">Remember me</span>
              </label>

              <a href="#" className="font-medium text-yellow-700 hover:text-yellow-600">Forgot password?</a>
            </div>

            <motion.div variants={fadeUp}>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-yellow-600 to-yellow-700 text-white font-semibold shadow-md gold-shimmer"
              >
                Sign in to dashboard
              </motion.button>
            </motion.div>
          </motion.form>

          <motion.div variants={fadeUp} className="mt-8 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} Cloud Of Fragrance System Management. All rights reserved.[;]
          </motion.div>
        </motion.div>

        {/* ========== CAROUSEL (right) ========== */}
        <div className="relative overflow-hidden bg-gradient-to-br from-yellow-600 via-yellow-700 to-yellow-800 p-6">
          {/* decorative floating gold circles */}
          <div className="absolute -left-10 -top-10 w-40 h-40 rounded-full bg-yellow-100/20 blur-2xl"></div>
          <div className="absolute -right-8 bottom-6 w-28 h-28 rounded-full bg-yellow-200/20 blur-2xl"></div>

          <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                variants={slide}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full flex flex-col items-center justify-center"
              >
                {/* bottle + label */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="relative flex flex-col items-center"
                >
                  <div
                    className="bottle-shadow rounded-lg"
                    style={{ width: 130, height: 220, borderRadius: 20, background: perfumes[currentSlide].color }}
                  ></div>

                  <div className="mt-4 text-center max-w-xs">
                    <h2 className="text-2xl font-semibold tracking-tight">{perfumes[currentSlide].name}</h2>
                    <p className="mt-2 text-sm opacity-90">{perfumes[currentSlide].description}</p>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* indicators */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-3">
              {perfumes.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  whileHover={{ scale: 1.15 }}
                  className={`w-3 h-3 rounded-full transition-all ${currentSlide === index ? 'bg-white' : 'bg-white/40'}`}
                  aria-label={`show slide ${index + 1}`}
                />
              ))}
            </div>

            {/* subtle top-right logo/crest */}
            <div className="absolute top-6 right-6 text-right">
              <div className="text-sm font-semibold text-white/90">Cloud Of Fragrance</div>
             
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
