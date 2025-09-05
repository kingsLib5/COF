import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Login from './Pages/Login';
import Selection from './Pages/Selection';
import InvenDash from './Component/Inventory-Component/InvenDash';
import OverView from './Component/Inventory-Component/OverView';
import RecordStocks from './Component/Inventory-Component/RecordStocks';
// Import other components to be rendered in the Outlet
// import Inventory from './Pages/Inventory';
// import Invoices from './Pages/Invoices';
// import Customers from './Pages/Customers';
// import Analytics from './Pages/Analytics';
// import Settings from './Pages/Settings';
// import Help from './Pages/Help';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Selection />} />

          <Route path="/cofdashboard" element={<InvenDash />}>
            <Route index element={<OverView />} /> {/* Default content for /cofdashboard */}
           <Route path="new-records" element={<RecordStocks />} /> 
            {/* <Route path="invoices" element={<Invoices />} /> */}
            {/* <Route path="customers" element={<Customers />} /> */}
            {/* <Route path="analytics" element={<Analytics />} /> */}
            {/* <Route path="settings" element={<Settings />} /> */}
            {/* <Route path="help" element={<Help />} />  */}
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;