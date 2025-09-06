import React, { useState, useEffect } from "react";

function CheckStocks() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isLoading, setIsLoading] = useState(true);

  // Fragrance sample data with Nigerian pricing
  const sampleProducts = [
    { id: 1, name: 'Chanel No. 5 Eau de Parfum', sku: 'CHN-NO5-100ML', category: 'Women', brand: 'Chanel', price: 75850.00, stock: 12, minStock: 8, unit: 'bottles', supplier: 'Chanel', size: '100ml' },
    { id: 2, name: 'Tom Ford Black Orchid', sku: 'TF-BO-50ML', category: 'Unisex', brand: 'Tom Ford', price: 67650.00, stock: 3, minStock: 5, unit: 'bottles', supplier: 'Tom Ford Beauty', size: '50ml' },
    { id: 3, name: 'Dior Sauvage Eau de Toilette', sku: 'DR-SAV-100ML', category: 'Men', brand: 'Dior', price: 49200.00, stock: 25, minStock: 15, unit: 'bottles', supplier: 'Dior', size: '100ml' },
    { id: 4, name: 'Creed Aventus', sku: 'CRD-AVT-120ML', category: 'Men', brand: 'Creed', price: 182450.00, stock: 0, minStock: 3, unit: 'bottles', supplier: 'Creed', size: '120ml' },
    { id: 5, name: 'Yves Saint Laurent Black Opium', sku: 'YSL-BO-90ML', category: 'Women', brand: 'YSL', price: 55350.00, stock: 8, minStock: 10, unit: 'bottles', supplier: 'YSL Beauty', size: '90ml' },
    { id: 6, name: 'Versace Eros', sku: 'VER-ERS-100ML', category: 'Men', brand: 'Versace', price: 34850.00, stock: 18, minStock: 12, unit: 'bottles', supplier: 'Versace', size: '100ml' },
    { id: 7, name: 'Maison Margiela REPLICA Jazz Club', sku: 'MM-JC-100ML', category: 'Unisex', brand: 'Maison Margiela', price: 58220.00, stock: 2, minStock: 6, unit: 'bottles', supplier: 'Maison Margiela', size: '100ml' },
    { id: 8, name: 'Dolce & Gabbana Light Blue', sku: 'DG-LB-100ML', category: 'Women', brand: 'D&G', price: 40180.00, stock: 15, minStock: 10, unit: 'bottles', supplier: 'D&G', size: '100ml' },
    { id: 9, name: 'Viktor & Rolf Flowerbomb', sku: 'VR-FB-100ML', category: 'Women', brand: 'Viktor & Rolf', price: 63550.00, stock: 6, minStock: 8, unit: 'bottles', supplier: 'Viktor & Rolf', size: '100ml' },
    { id: 10, name: 'Le Labo Santal 33', sku: 'LL-S33-50ML', category: 'Unisex', brand: 'Le Labo', price: 81180.00, stock: 4, minStock: 5, unit: 'bottles', supplier: 'Le Labo', size: '50ml' }
  ];

  const categories = ['all', 'Men', 'Women', 'Unisex'];

  useEffect(() => {
    // Simulate API call
    const loadProducts = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setProducts(sampleProducts);
      setFilteredProducts(sampleProducts);
      setIsLoading(false);
    };
    
    loadProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [searchTerm, selectedCategory, stockFilter, sortBy, sortOrder, products]);

  const filterAndSortProducts = () => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Stock level filter
    if (stockFilter !== 'all') {
      filtered = filtered.filter(product => {
        if (stockFilter === 'in-stock') return product.stock > product.minStock;
        if (stockFilter === 'out-of-stock') return product.stock === 0;
        if (stockFilter === 'low-stock') return product.stock > 0 && product.stock <= product.minStock;
        return true;
      });
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'stock':
          aValue = a.stock;
          bValue = b.stock;
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'category':
          aValue = a.category.toLowerCase();
          bValue = b.category.toLowerCase();
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredProducts(filtered);
  };

  const getStockStatus = (stock, minStock) => {
    if (stock === 0) return { status: 'Out of Stock', color: 'text-red-600 bg-red-50' };
    if (stock <= minStock) return { status: 'Low Stock', color: 'text-orange-600 bg-orange-50' };
    return { status: 'In Stock', color: 'text-green-600 bg-green-50' };
  };

  const getStockCounts = () => {
    const total = products.length;
    const inStock = products.filter(p => p.stock > p.minStock).length;
    const lowStock = products.filter(p => p.stock > 0 && p.stock <= p.minStock).length;
    const outOfStock = products.filter(p => p.stock === 0).length;
    
    return { total, inStock, lowStock, outOfStock };
  };

  const stockCounts = getStockCounts();

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-[#e4c723] to-[#9c8817] text-white p-6 rounded-xl shadow-lg mb-6">
          <h1 className="text-3xl font-bold">Fragrance Stock Control</h1>
          <p className="text-amber-100 mt-2">Monitor perfume inventory levels and fragrance availability</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e4c723]"></div>
          <span className="ml-3 text-gray-600">Loading fragrance inventory...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#e4c723] to-[#9c8817] text-white p-6 rounded-xl shadow-lg mb-6">
        <h1 className="text-3xl font-bold">Fragrance Stock Control</h1>
        <p className="text-amber-100 mt-2">Monitor perfume inventory levels and fragrance availability</p>
      </div>

      {/* Stock Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Total Fragrances</p>
              <p className="text-2xl font-bold text-gray-900">{stockCounts.total}</p>
            </div>
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">In Stock</p>
              <p className="text-2xl font-bold text-green-600">{stockCounts.inStock}</p>
            </div>
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-orange-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-orange-600">{stockCounts.lowStock}</p>
            </div>
            <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">{stockCounts.outOfStock}</p>
            </div>
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
            </svg>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Fragrances</label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, brand, or SKU..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e4c723] focus:border-[#9c8817] outline-none"
              />
              <svg className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e4c723] focus:border-[#9c8817] outline-none"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Stock Status</label>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e4c723] focus:border-[#9c8817] outline-none"
            >
              <option value="all">All Status</option>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e4c723] focus:border-[#9c8817] outline-none"
              >
                <option value="name">Name</option>
                <option value="stock">Stock</option>
                <option value="price">Price</option>
                <option value="category">Category</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
              >
                <svg className={`w-4 h-4 text-gray-600 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fragrance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product.stock, product.minStock);
                return (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{product.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-700">{product.brand}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 font-mono">{product.sku}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.category === 'Men' ? 'bg-blue-100 text-blue-800' :
                        product.category === 'Women' ? 'bg-pink-100 text-pink-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.size}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">₦{product.price.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {product.stock} {product.unit}
                        {product.stock <= product.minStock && product.stock > 0 && (
                          <div className="text-xs text-orange-600">Min: {product.minStock}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stockStatus.color}`}>
                        {stockStatus.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <div className="text-gray-500">
              <p className="text-lg font-medium">No fragrances found</p>
              <p className="text-sm mt-1">Try adjusting your search or filter criteria</p>
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      {filteredProducts.length > 0 && (
        <div className="mt-4 text-sm text-gray-600 text-center">
          Showing {filteredProducts.length} of {products.length} fragrances
        </div>
      )}
    </div>
  );
}

export default CheckStocks;