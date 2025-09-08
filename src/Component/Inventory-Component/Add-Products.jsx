import React, { useState } from "react";

function AddProducts() {
  const [formData, setFormData] = useState({
    productName: '',
    category: '',
    price: '',
    stockQuantity: '',
    description: '',
    sku: '',
    supplier: '',
    minStockLevel: '',
    unit: 'ml'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'Men',
    'Women',
    'Unisex',
    'Niche',
    'Designer',
    'Celebrity',
    'Limited Edition'
  ];

  const units = [
    'ml',
    'fl oz',
    'pieces'
  ];

  // Function to format naira price
  const formatNairaPrice = (price) => {
    if (!price) return '';
    return `₦${parseInt(price).toLocaleString('en-NG')}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.productName.trim()) {
      newErrors.productName = 'Product name is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }

    if (!formData.stockQuantity || parseInt(formData.stockQuantity) < 0) {
      newErrors.stockQuantity = 'Valid stock quantity is required';
    }

    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU is required';
    }

    if (formData.minStockLevel && parseInt(formData.minStockLevel) < 0) {
      newErrors.minStockLevel = 'Minimum stock level must be positive';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Product data:', formData);
      alert('Fragrance added successfully!');
      
      // Reset form
      setFormData({
        productName: '',
        category: '',
        price: '',
        stockQuantity: '',
        description: '',
        sku: '',
        supplier: '',
        minStockLevel: '',
        unit: 'ml'
      });
    } catch (error) {
      alert('Error adding fragrance. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateSKU = () => {
    const timestamp = Date.now().toString().slice(-6);
    const randomStr = Math.random().toString(36).substring(2, 5).toUpperCase();
    setFormData(prev => ({
      ...prev,
      sku: `FGN-${randomStr}-${timestamp}`
    }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Brand Gradient Header */}
      <div className="bg-gradient-to-r from-[#e4c723] to-[#9c8817] text-white p-6 rounded-xl shadow-lg mb-6">
        <h1 className="text-3xl font-bold">Add New Fragrance</h1>
        <p className="text-amber-100 mt-2">Add new fragrances to your inventory collection</p>
        
      </div>

      {/* Main Form */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">Fragrance Information</h2>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-amber-900 mb-2">
                Fragrance Name *
              </label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
                placeholder="Enter fragrance name"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#e4c723] focus:border-[#9c8817] outline-none transition-colors ${
                  errors.productName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.productName && (
                <p className="text-red-500 text-sm mt-1">{errors.productName}</p>
              )}
            </div>

            {/* SKU */}
            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">
                SKU (Stock Keeping Unit) *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  placeholder="Enter or generate SKU"
                  className={`flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-[#e4c723] focus:border-[#9c8817] outline-none transition-colors ${
                    errors.sku ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={generateSKU}
                  className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Generate
                </button>
              </div>
              {errors.sku && (
                <p className="text-red-500 text-sm mt-1">{errors.sku}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#e4c723] focus:border-[#9c8817] outline-none transition-colors ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category}</p>
              )}
            </div>

            {/* Price in Naira */}
            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">
                Price (₦) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500">₦</span>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  className={`w-full pl-8 p-3 border rounded-lg focus:ring-2 focus:ring-[#e4c723] focus:border-[#9c8817] outline-none transition-colors ${
                    errors.price ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">{errors.price}</p>
              )}
              {formData.price && (
                <p className="text-sm text-green-600 mt-1">
                  Formatted price: {formatNairaPrice(formData.price)}
                </p>
              )}
            </div>

            {/* Stock Quantity */}
            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">
                Initial Stock Quantity *
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  name="stockQuantity"
                  value={formData.stockQuantity}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  className={`flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-[#e4c723] focus:border-[#9c8817] outline-none transition-colors ${
                    errors.stockQuantity ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e4c723] focus:border-[#9c8817] outline-none"
                >
                  {units.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
              {errors.stockQuantity && (
                <p className="text-red-500 text-sm mt-1">{errors.stockQuantity}</p>
              )}
            </div>

            {/* Minimum Stock Level */}
            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">
                Minimum Stock Level
              </label>
              <input
                type="number"
                name="minStockLevel"
                value={formData.minStockLevel}
                onChange={handleInputChange}
                placeholder="Low stock alert threshold"
                min="0"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#e4c723] focus:border-[#9c8817] outline-none transition-colors ${
                  errors.minStockLevel ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.minStockLevel && (
                <p className="text-red-500 text-sm mt-1">{errors.minStockLevel}</p>
              )}
            </div>

            {/* Supplier */}
            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">
                Brand/Supplier
              </label>
              <input
                type="text"
                name="supplier"
                value={formData.supplier}
                onChange={handleInputChange}
                placeholder="Fragrance brand or supplier"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e4c723] focus:border-[#9c8817] outline-none transition-colors"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-amber-900 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Fragrance notes, description, occasion..."
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e4c723] focus:border-[#9c8817] outline-none transition-colors resize-none"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 mt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`flex-1 sm:flex-none px-8 py-3 bg-gradient-to-r from-[#e4c723] to-[#9c8817] text-white rounded-lg shadow-lg hover:shadow-xl transform transition-all duration-200 font-medium ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Adding Fragrance...
                </span>
              ) : (
                'Add Fragrance'
              )}
            </button>
            
            <button
              type="button"
              onClick={() => setFormData({
                productName: '',
                category: '',
                price: '',
                stockQuantity: '',
                description: '',
                sku: '',
                supplier: '',
                minStockLevel: '',
                unit: 'ml'
              })}
              className="flex-1 sm:flex-none px-8 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Clear Form
            </button>
          </div>

          <div className="mt-4 text-sm text-gray-500">
            * Required fields
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProducts;