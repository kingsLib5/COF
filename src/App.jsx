import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Lazy load components for better performance
const Login = lazy(() => import('./Pages/Login'));
const Selection = lazy(() => import('./Pages/Selection'));
const InvenDash = lazy(() => import('./Component/Inventory-Component/InvenDash'));
const OverView = lazy(() => import('./Component/Inventory-Component/OverView'));
const InvoiceDash = lazy(() => import('./Component/Invoice-Component/InvoiceDash'));
const RecordStocks = lazy(() => import('./Component/Inventory-Component/RecordStocks'));
const InOverview = lazy(() => import('./Component/Invoice-Component/InOverview'));
const ProductList = lazy(() => import('./Component/Inventory-Component/ProductList'));
const AddProduct = lazy(() => import('./Component/Inventory-Component/AddProducts'));
const Settings = lazy(() => import('./Component/Inventory-Component/Settings'));
const Help = lazy(() => import('./Component/Inventory-Component/Help'));
const CheckStocks = lazy(() => import('./Component/Inventory-Component/CheckStocks'));

// Loading Component with enhanced Luxe Aroma styling
const LoadingAnimation = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-amber-50 via-amber-100 to-amber-50 flex items-center justify-center z-50">
      <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200 max-w-md w-4/5">
        <motion.div
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 flex items-center justify-center shadow-lg"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        >
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </motion.div>
        
        <motion.h2 
          className="text-amber-800 font-playfair text-2xl font-bold mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Cloud Of Fragrance
        </motion.h2>
        
        <motion.p 
          className="text-amber-600 mb-6 font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Loading exquisite experience...
        </motion.p>
        
        <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        
        <motion.p 
          className="text-amber-500 text-xs mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {progress}% complete
        </motion.p>
      </div>
    </div>
  );
};

// Enhanced page transition wrapper
const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.995 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.995 }}
      transition={{ 
        duration: 0.4, 
        ease: "easeInOut",
        scale: { duration: 0.3 }
      }}
      className="min-h-screen"
    >
      {children}
    </motion.div>
  );
};

// Fallback component for lazy loading
const FallbackLoader = () => (
  <div className="flex items-center justify-center h-64">
    <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// Main App component with routing and transitions
function AppContent() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [prevLocation, setPrevLocation] = useState(location);

  useEffect(() => {
    // Only show loading animation if the pathname changes
    if (prevLocation.pathname !== location.pathname) {
      setLoading(true);
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else {
      setLoading(false);
    }
    
    setPrevLocation(location);
  }, [location, prevLocation.pathname]);

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="App bg-gradient-to-br from-amber-50 to-amber-100 min-h-screen">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public routes */}
          <Route path="/login" element={
            <PageTransition>
              <Suspense fallback={<FallbackLoader />}>
                <Login />
              </Suspense>
            </PageTransition>
          } />
          
          <Route path="/" element={
            <PageTransition>
              <Suspense fallback={<FallbackLoader />}>
                <Selection />
              </Suspense>
            </PageTransition>
          } />

          {/* Dashboard routes */}
          <Route path="/cofdashboard" element={
            <PageTransition>
              <Suspense fallback={<FallbackLoader />}>
                <InvenDash />
              </Suspense>
            </PageTransition>
          }>
            <Route index element={<OverView />} />
            <Route path="new-records" element={<RecordStocks />} />
            <Route path="check-stocks" element={<CheckStocks />} />
            <Route path="product-list" element={<ProductList />} />
            <Route path="add-products" element={<AddProduct />} />
            <Route path="settings" element={<Settings />} />
            <Route path="help" element={<Help />} />
          </Route>

          <Route path="/cofinvoicedashboard" element={
            <PageTransition>
              <Suspense fallback={<FallbackLoader />}>
                <InvoiceDash />
              </Suspense>
            </PageTransition>
          }>
            <Route index element={<InOverview />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </div>
  );
}

// Main App wrapper
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;