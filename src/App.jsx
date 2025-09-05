import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


// import InventoryDashboard from './pages/InventoryDashboard';
// import InventoryItem from './pages/InventoryItem'; // Example sub-route
// import InvoiceDashboard from './pages/InvoiceDashboard';
// import InvoiceDetails from './pages/InvoiceDetails'; // Example sub-route
import Login from './Pages/Login';
import Selection from './Pages/Selection';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Selection />} />
          


          {/* <Route path="/inventory/dashboard" element={<InventoryDashboard />} />
          <Route path="/inventory/item/:id" element={<InventoryItem />} /> 

          <Route path="/invoice/dashboard" element={<InvoiceDashboard />} />
          <Route path="/invoice/details/:id" element={<InvoiceDetails />} />  */}

        </Routes>
      </div>
    </Router>
  );
}

export default App;