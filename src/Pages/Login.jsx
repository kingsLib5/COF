// src/Pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig'; // axios instance

// Import your perfume images
import perfume1 from '../assets/na.png';
import perfume2 from '../assets/naa.png';
import perfume3 from '../assets/naaaa.png';

export default function Login() {
  const navigate = useNavigate();

  const [currentSlide, setCurrentSlide] = useState(0);
  const perfumes = [
    { name: 'Eternal Essence', description: 'A timeless fragrance that captures the essence of luxury', image: perfume1 },
    { name: 'Midnight Bloom', description: 'An exotic blend that blossoms under moonlight', image: perfume2 },
    { name: 'Ocean Mist', description: 'Fresh aquatic notes with a hint of mountain air', image: perfume3 },
  ];

  // form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');               // friendly message for user
  const [debugInfo, setDebugInfo] = useState(null);     // detailed error object
  const [showDebug, setShowDebug] = useState(false);    // controlled ONLY by toggle button

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((p) => (p + 1) % perfumes.length), 4200);
    return () => clearInterval(timer);
  }, [perfumes.length]);

  // Motion variants
  const container = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { staggerChildren: 0.06 } } };
  const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
  const slide = { initial: { opacity: 0, x: 30, scale: 0.98 }, animate: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.8, ease: "easeInOut" } }, exit: { opacity: 0, x: -30, scale: 0.98, transition: { duration: 0.6, ease: "easeInOut" } } };
  const imageAnimation = { initial: { opacity: 0, y: 20, rotateX: 90, rotateY: 20, rotateZ: 10 }, animate: { opacity: 1, y: 0, rotateX: 0, rotateY: 0, rotateZ: 0, transition: { duration: 0.8, delay: 0.2, ease: "easeOut" } }, exit: { opacity: 0, y: -20, rotateX: 90, rotateY: -20, rotateZ: -10, transition: { duration: 0.5, ease: "easeIn" } } };

  // // Helper: generate user-friendly message from axios error
  // const formatErrorMessage = (err) => {
  //   if (!navigator.onLine) {
  //     return { message: 'No internet connection — please check your network.' , hint: 'Your browser is offline.' };
  //   }

  //   if (err?.response) {
  //     const { status, data, statusText } = err.response;
  //     const serverMessage = data && (data.message || data.error || data.msg);
  //     let message = serverMessage || `${status} ${statusText || ''}`.trim();

  //     if (!message) {
  //       if (status === 401) message = 'Invalid credentials. Please check your email and password.';
  //       else if (status === 403) message = 'Access denied. You do not have permission to sign in.';
  //       else if (status === 404) message = 'Login service not found (404). Check the API path.';
  //       else if (status >= 500) message = 'Server error. Please try again later.';
  //       else message = 'Login failed. Please try again.';
  //     }

  //     const hint =
  //       status === 401 ? 'Check credentials or reset your password.' :
  //       status === 403 ? 'Your account is not allowed to access this resource.' :
  //       status === 404 ? 'Confirm backend is running and route is correct (/api/auth/login).' :
  //       status >= 500 ? 'Check server logs for errors (500+).' :
  //       null;

  //     return { message, hint, status };
  //   }

  //   if (err?.request) {
  //     return {
  //       message: 'No response from server. The backend might be down or blocked by CORS.',
  //       hint: 'Make sure backend is running and CORS allows requests from this origin.',
  //     };
  //   }

  //   const fallback = err?.message || String(err) || 'Unknown error';
  //   return { message: `Login failed: ${fallback}`, hint: null };
  // };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setDebugInfo(null);

    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const payload = { email: email.trim().toLowerCase(), password };

      // only log non-sensitive fields when debug is toggled on
      if (showDebug) console.debug('[LOGIN] payload (no password shown):', { email: payload.email });

      const res = await api.post('/api/auth/login', payload);
      const { token, user } = res.data || {};

      if (!token) {
        const dbg = { reason: 'no_token', responseData: res?.data };
        console.debug('[LOGIN] token missing in response', dbg);
        setDebugInfo(dbg);
        throw new Error('No token returned from server. Please check server response.');
      }

      localStorage.setItem('cof_auth', JSON.stringify({ token, user }));
      navigate('/option');
    } catch (err) {
      const parsed = formatErrorMessage(err);
      setError(parsed.message || 'Login failed.');

      const debugPayload = {
        message: err?.message,
        code: err?.code,
        isAxiosError: !!err?.isAxiosError,
        response: err?.response ? {
          status: err.response.status,
          statusText: err.response.statusText,
          data: err.response.data,
          headers: err.response.headers,
        } : undefined,
        requestExists: !!err?.request,
        parsed,
      };
      setDebugInfo(debugPayload);
      console.error('[LOGIN] error (detailed):', debugPayload, err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-300 flex items-center justify-center p-6">
      <style>{`
        @keyframes floaty { 0% { transform: translateY(0) } 50% { transform: translateY(-8px) } 100% { transform: translateY(0) } }
        @keyframes shine { 0% { background-position: -200% 0 } 100% { background-position: 200% 0 } }
        .gold-shimmer { background: linear-gradient(90deg, rgba(255,255,255,0.0) 0%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.0) 100%); background-size: 200% auto; animation: shine 2.6s linear infinite; }
        .bottle-shadow { box-shadow: 0 12px 30px rgba(34,34,34,0.18); }
      `}</style>

      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <motion.div className="p-8 md:p-12 flex flex-col justify-center bg-white" variants={container} initial="hidden" animate="show">
          <motion.div variants={fadeUp} className="text-center mb-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-yellow-800 font-playfair">Cloud Of Fragrance</h1>
            <p className="text-sm tracking-widest text-yellow-600 mt-2">Embrace The Essence Of Elegance</p>
            <p className="text-sm tracking-widest text-yellow-600 mt-2">Management Portal</p>
          </motion.div>

          <motion.form variants={fadeUp} className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <motion.input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                whileFocus={{ scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 300 }}
                type="email"
                className="w-full px-4 py-3 border border-yellow-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-300 transition"
                placeholder="Enter your email"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <motion.input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                whileFocus={{ scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 300 }}
                type="password"
                className="w-full px-4 py-3 border border-yellow-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-300 transition"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-gray-700">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded" />
                <span className="ml-2">Remember me</span>
              </label>

              {/* <button
                type="button"
                onClick={() => setShowDebug((s) => !s)}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                {showDebug ? 'Hide debug' : 'Show debug'}
              </button> */}
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}

            <motion.div variants={fadeUp}>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold shadow-md ${loading ? 'opacity-70 cursor-wait' : ''}`}
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign in to dashboard'}
              </motion.button>
            </motion.div>
          </motion.form>

          <motion.div variants={fadeUp} className="mt-8 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} Cloud Of Fragrance System Management. All rights reserved.
          </motion.div>

          {/* {showDebug && (
            <div className="mt-4 bg-gray-50 border border-gray-200 p-3 rounded text-xs text-left">
              <div className="flex items-center justify-between mb-2">
                <strong className="text-sm">Debug info</strong>
                <button onClick={() => { setDebugInfo(null); setError(''); }} className="text-xs text-gray-500 hover:text-gray-700">Clear</button>
              </div>

              <div className="mb-2">
                <div className="text-xxs text-gray-600">Network:</div>
                <div className="text-sm">{navigator.onLine ? 'Online' : 'Offline'}</div>
              </div>

              <div>
                <div className="text-xxs text-gray-600">Last error (parsed):</div>
                <pre className="whitespace-pre-wrap text-xs bg-white border p-2 rounded mt-1">
                  {JSON.stringify(debugInfo?.parsed || { message: error || 'No errors yet' }, null, 2)}
                </pre>
              </div>

              {debugInfo && (
                <>
                  <div className="mt-2 text-xxs text-gray-600">Full debug object:</div>
                  <pre className="whitespace-pre-wrap text-xs bg-white border p-2 rounded mt-1">
                    {JSON.stringify(debugInfo, null, 2)}
                  </pre>
                </>
              )}
            </div>
          )} */}
        </motion.div>

        <div className="relative overflow-hidden bg-gradient-to-br from-yellow-600 via-yellow-700 to-yellow-800 p-6">
          <div className="absolute -left-10 -top-10 w-40 h-40 rounded-full bg-yellow-600/20 blur-2xl"></div>
          <div className="absolute -right-8 bottom-6 w-28 h-28 rounded-full bg-yellow-200/20 blur-2xl"></div>

          <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
            <AnimatePresence mode="wait">
              <motion.div key={currentSlide} variants={slide} initial="initial" animate="animate" exit="exit" className="w-full flex flex-col items-center justify-center">
                <motion.div className="relative flex flex-col items-center">
                  <motion.img variants={imageAnimation} initial="initial" animate="animate" exit="exit" src={perfumes[currentSlide].image} alt={perfumes[currentSlide].name} className="bottle-shadow rounded-lg" style={{ width: 130, height: 220, objectFit: 'cover' }} />
                  <div className="mt-4 text-center max-w-xs">
                    <h2 className="text-2xl font-semibold tracking-tight">{perfumes[currentSlide].name}</h2>
                    <p className="mt-2 text-sm opacity-90">{perfumes[currentSlide].description}</p>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-3">
              {perfumes.map((_, index) => (
                <motion.button key={index} onClick={() => setCurrentSlide(index)} whileHover={{ scale: 1.15 }} className={`w-3 h-3 rounded-full transition-all ${currentSlide === index ? 'bg-white' : 'bg-white/40'}`} aria-label={`show slide ${index + 1}`} />
              ))}
            </div>

            <div className="absolute top-6 right-6 text-right">
              <div className="text-sm font-semibold text-white/90">Cloud Of Fragrance</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
