import React, { useState } from "react";

function RecordStocks() {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [recordType, setRecordType] = useState('restock');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentRecords, setRecentRecords] = useState([
    { id: 1, product: 'Chanel No. 5', type: 'restock', quantity: '+15', date: '2025-09-05', reason: 'New delivery' },
    { id: 2, product: 'Dior Sauvage', type: 'adjustment', quantity: '-2', date: '2025-09-05', reason: 'Damaged bottles' },
    { id: 3, product: 'Tom Ford Black Orchid', type: 'restock', quantity: '+10', date: '2025-09-04', reason: 'Supplier restock' }
  ]);

  // Available products
  const products = [
    'Chanel No. 5 - 100ml',
    'Tom Ford Black Orchid - 50ml',
    'Dior Sauvage - 100ml',
    'Creed Aventus - 120ml',
    'YSL Black Opium - 90ml',
    'Versace Eros - 100ml',
    'Maison Margiela Jazz Club - 100ml',
    'D&G Light Blue - 100ml'
  ];

  const reasons = {
    restock: ['New delivery', 'Supplier restock', 'Transfer from warehouse', 'Emergency restock'],
    adjustment: ['Damaged bottles', 'Expired products', 'Theft/Loss', 'Inventory correction', 'Quality control']
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct || !quantity) return;

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newRecord = {
        id: Date.now(),
        product: selectedProduct,
        type: recordType,
        quantity: recordType === 'adjustment' ? `-${quantity}` : `+${quantity}`,
        date: new Date().toISOString().split('T')[0],
        reason: reason || 'No reason specified'
      };

      setRecentRecords(prev => [newRecord, ...prev.slice(0, 4)]);
      
      // Reset form
      setSelectedProduct('');
      setQuantity('');
      setReason('');
      setNotes('');
      
      alert('Stock record updated successfully!');
    } catch (error) {
      alert('Error updating stock. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#e4c723] to-[#9c8817] text-white p-6 rounded-xl shadow-lg mb-6">
        <h1 className="text-3xl font-bold">Record Stock Changes</h1>
        <p className="text-amber-100 mt-2">Add new stock or record adjustments to your fragrance inventory</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stock Recording Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Stock Transaction</h2>
            
            <div className="space-y-4">
              {/* Transaction Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRecordType('restock')}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      recordType === 'restock'
                        ? 'border-[#e4c723] bg-gradient-to-r from-[#e4c723] to-[#9c8817] text-white'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    📦 Add Stock
                  </button>
                  <button
                    type="button"
                    onClick={() => setRecordType('adjustment')}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      recordType === 'adjustment'
                        ? 'border-[#e4c723] bg-gradient-to-r from-[#e4c723] to-[#9c8817] text-white'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    📝 Adjustment
                  </button>
                </div>
              </div>

              {/* Product Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Fragrance
                </label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e4c723] focus:border-[#9c8817] outline-none"
                  required
                >
                  <option value="">Choose a fragrance...</option>
                  {products.map(product => (
                    <option key={product} value={product}>{product}</option>
                  ))}
                </select>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity (bottles)
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder={recordType === 'restock' ? 'Bottles to add' : 'Bottles to remove'}
                  min="1"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e4c723] focus:border-[#9c8817] outline-none"
                  required
                />
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e4c723] focus:border-[#9c8817] outline-none"
                >
                  <option value="">Select reason...</option>
                  {reasons[recordType].map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any additional details about this transaction..."
                  rows="3"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e4c723] focus:border-[#9c8817] outline-none resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !selectedProduct || !quantity}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                  isSubmitting || !selectedProduct || !quantity
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#e4c723] to-[#9c8817] text-white hover:shadow-lg transform hover:scale-105'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Recording...
                  </span>
                ) : (
                  `${recordType === 'restock' ? 'Add' : 'Adjust'} Stock`
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Transactions</h3>
            
            <div className="space-y-3">
              {recentRecords.map((record) => (
                <div key={record.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm text-gray-800">
                      {record.product.split(' - ')[0]}
                    </span>
                    <span className={`text-sm font-bold ${
                      record.quantity.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {record.quantity}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">
                    <div>{record.reason}</div>
                    <div className="mt-1">{record.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Summary</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Stock Added</span>
                <span className="font-bold text-green-600">+25 bottles</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Adjustments</span>
                <span className="font-bold text-red-600">-2 bottles</span>
              </div>
              <div className="flex justify-between items-center border-t pt-2">
                <span className="font-medium text-gray-800">Net Change</span>
                <span className="font-bold text-green-600">+23 bottles</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecordStocks;