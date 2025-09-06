import React, { useState, useEffect } from "react";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [exchangeRate, setExchangeRate] = useState(1500); // Default exchange rate

  // Sample fragrance data - prices now in Naira
  const sampleProducts = [
    { id: 1, name: 'Chanel No. 5', brand: 'Chanel', category: 'Women', size: '100ml', price: 277500, stock: 12, image: '🌹' },
    { id: 2, name: 'Tom Ford Black Orchid', brand: 'Tom Ford', category: 'Unisex', size: '50ml', price: 247500, stock: 3, image: '🖤' },
    { id: 3, name: 'Dior Sauvage', brand: 'Dior', category: 'Men', size: '100ml', price: 180000, stock: 25, image: '🌊' },
    { id: 4, name: 'Creed Aventus', brand: 'Creed', category: 'Men', size: '120ml', price: 667500, stock: 0, image: '👑' },
    { id: 5, name: 'YSL Black Opium', brand: 'YSL', category: 'Women', size: '90ml', price: 202500, stock: 8, image: '✨' },
    { id: 6, name: 'Versace Eros', brand: 'Versace', category: 'Men', size: '100ml', price: 127500, stock: 18, image: '⚡' },
    { id: 7, name: 'Maison Margiela Jazz Club', brand: 'Maison Margiela', category: 'Unisex', size: '100ml', price: 213000, stock: 2, image: '🎷' },
    { id: 8, name: 'D&G Light Blue', brand: 'Dolce & Gabbana', category: 'Women', size: '100ml', price: 147000, stock: 15, image: '💙' }
  ];

  const categories = ['all', 'Men', 'Women', 'Unisex'];

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 600));
      setProducts(sampleProducts);
      setFilteredProducts(sampleProducts);
      setIsLoading(false);
    };
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, selectedCategory, products]);

  const filterProducts = () => {
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  };

  const getStockBadge = (stock) => {
    if (stock === 0) return { text: 'Out of Stock', color: 'bg-red-100 text-red-700' };
    if (stock <= 5) return { text: 'Low Stock', color: 'bg-orange-100 text-orange-700' };
    return { text: 'In Stock', color: 'bg-green-100 text-green-700' };
  };

  // Format Naira prices with commas
  const formatNairaPrice = (price) => {
    return `₦${price.toLocaleString('en-NG')}`;
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-[#e4c723] to-[#9c8817] text-white p-6 rounded-xl shadow-lg mb-6">
          <h1 className="text-3xl font-bold">Fragrance Catalog</h1>
          <p className="text-amber-100 mt-2">Browse your complete fragrance collection</p>
        </div>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e4c723]"></div>
          <span className="ml-3 text-gray-600">Loading catalog...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#e4c723] to-[#9c8817] text-white p-6 rounded-xl shadow-lg mb-6">
        <h1 className="text-3xl font-bold">Fragrance Catalog</h1>
        <p className="text-amber-100 mt-2">Browse your complete fragrance collection</p>

      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-xl shadow-lg mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search fragrances or brands..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e4c723] focus:border-[#9c8817] outline-none"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e4c723] focus:border-[#9c8817] outline-none"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>

          {/* View Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-md transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-gradient-to-r from-[#e4c723] to-[#9c8817] text-white' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-md transition-colors ${
                viewMode === 'list' 
                  ? 'bg-gradient-to-r from-[#e4c723] to-[#9c8817] text-white' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-gray-600">
        Showing {filteredProducts.length} of {products.length} fragrances
      </div>

      {/* Products Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const stockBadge = getStockBadge(product.stock);
            return (
              <div key={product.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                <div className="p-6">
                  <div className="text-4xl mb-4 text-center">{product.image}</div>
                  <h3 className="font-bold text-gray-900 mb-2 text-lg leading-tight">{product.name}</h3>
                  <p className="text-gray-600 mb-2">{product.brand}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.category === 'Men' ? 'bg-blue-100 text-blue-800' :
                      product.category === 'Women' ? 'bg-pink-100 text-pink-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {product.category}
                    </span>
                    <span className="text-sm text-gray-500">{product.size}</span>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl font-bold text-gray-900">{formatNairaPrice(product.price)}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${stockBadge.color}`}>
                      {stockBadge.text}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600">
                    Stock: {product.stock} bottles
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fragrance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Brand</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price (₦)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map((product) => {
                  const stockBadge = getStockBadge(product.stock);
                  return (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{product.image}</span>
                          <span className="font-medium text-gray-900">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{product.brand}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.category === 'Men' ? 'bg-blue-100 text-blue-800' :
                          product.category === 'Women' ? 'bg-pink-100 text-pink-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{product.size}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">{formatNairaPrice(product.price)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-900">{product.stock}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${stockBadge.color}`}>
                            {stockBadge.text}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredProducts.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <div className="text-gray-500">
            <p className="text-lg font-medium">No fragrances found</p>
            <p className="text-sm mt-1">Try adjusting your search or filter</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductList;