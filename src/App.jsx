import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Login from './Pages/Login';
import CheckStocks from './Component/Inventory-Component/Check-Stocks';
import ProductList from './Component/Inventory-Component/Product-List';
import AddProduct from './Component/Inventory-Component/Add-Products';
import Settings from './Component/Inventory-Component/Settings';
import Help from './Component/Inventory-Component/Help';
import Selection from './Pages/Selection';
import InvenDash from './Component/Inventory-Component/InvenDash';
import OverView from './Component/Inventory-Component/OverView';
import InvoiceDash from './Component/Invoice-Component/InvoiceDash';
import RecordStocks from './Component/Inventory-Component/RecordStocks';
import InOverview from './Component/Invoice-Component/InOverview';
import InvoiceList from "./Component/Invoice-Component/InvoiceList";
import CreateInvoice from "./Component/Invoice-Component/CreateInvoice";
import InvoiceCustomers from "./Component/Invoice-Component/InvoiceCustomers";
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

                    <Route path="/cofinvoicedashboard" element={<InvoiceDash />}>
                      <Route index element={<InOverview />} /> {/* Default content for /cofdashboard */}
                       <Route path="invoices" element={<InvoiceList />} />
                        <Route path="create-invoice" element={<CreateInvoice />} />
                        <Route path="customers" element={<InvoiceCustomers />} />
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
