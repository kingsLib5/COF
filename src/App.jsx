import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Login from './Pages/Login';
import Selection from './Pages/Selection';
import InvenDash from './Component/Inventory-Component/InvenDash';
import OverView from './Component/Inventory-Component/OverView';
import RecordStocks from './Component/Inventory-Component/RecordStocks';
import ProductList from './Component/Inventory-Component/Product-List';
import AddProduct from './Component/Inventory-Component/Add-Products';
import CheckStocks from './Component/Inventory-Component/Check-Stocks';
import Settings from './Component/Inventory-Component/Settings';
import Help from './Component/Inventory-Component/Help';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Selection />} />

          {/* Dashboard routes */}
          <Route path="/cofdashboard" element={<InvenDash />}>
            <Route index element={<OverView />} />
            <Route path="new-records" element={<RecordStocks />} />
            <Route path="check-stocks" element={<CheckStocks />} />
            <Route path="product-list" element={<ProductList />} />
            <Route path="add-products" element={<AddProduct />} />
            <Route path="settings" element={<Settings />} />
            <Route path="help" element={<Help />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
