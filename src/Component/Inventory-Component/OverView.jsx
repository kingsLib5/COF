import React, { useState, useEffect } from "react";

function OverView() {
  const [dashboardData, setDashboardData] = useState({
    totalFragrances: 0,
    totalValue: 0,
    lowStockItems: 0,
    outOfStock: 0,
    todaySales: 0,
    monthlyGrowth: 0,
    topFragrances: [],
    recentActivity: [],
    alerts: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Sample data
  const sampleData = {
    totalFragrances: 48,
    totalValue: 4250000,
    lowStockItems: 7,
    outOfStock: 3,
    todaySales: 485000,
    monthlyGrowth: 12.5,
    topFragrances: [
      { name: 'Dior Sauvage', sales: 34, revenue: 1670800 },
      { name: 'Chanel No. 5', sales: 28, revenue: 2123800 },
      { name: 'Tom Ford Black Orchid', sales: 22, revenue: 1488300 }
    ],
    recentActivity: [
      { type: 'sale', item: 'Versace Eros', time: '15 minutes ago', amount: 34850 },
      { type: 'restock', item: 'YSL Black Opium', time: '2 hours ago', quantity: 12 },
      { type: 'sale', item: 'Creed Aventus', time: '3 hours ago', amount: 182450 },
      { type: 'alert', item: 'Le Labo Santal 33', time: '4 hours ago', message: 'Low stock alert' }
    ],
    alerts: [
      { type: 'critical', message: 'Creed Aventus is out of stock', time: '1 hour ago' },
      { type: 'warning', message: '7 fragrances below minimum stock level', time: '2 hours ago' },
      { type: 'info', message: 'New shipment arriving tomorrow', time: '5 hours ago' }
    ]
  };

  useEffect(() => {
    // Load dashboard data
    const loadData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1200));
      setDashboardData(sampleData);
      setIsLoading(false);
    };
    loadData();

    // Update time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timeInterval);
  }, []);

  const formatCurrency = (amount) => `₦${amount.toLocaleString()}`;
  const getActivityIcon = (type) => {
    switch (type) {
      case 'sale': return '💰';
      case 'restock': return '📦';
      case 'alert': return '⚠️';
      default: return '📋';
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'warning': return 'border-orange-500 bg-orange-50';
      case 'info': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-[#e4c723] to-[#9c8817] text-white p-6 rounded-xl shadow-lg mb-6">
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
          <p className="text-amber-100 mt-2">Your complete fragrance business snapshot</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e4c723] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your business overview...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header with Time */}
      <div className="bg-gradient-to-r from-[#e4c723] to-[#9c8817] text-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard Overview</h1>
            <p className="text-amber-100 mt-2">Your complete fragrance business snapshot</p>
          </div>
          <div className="text-right text-amber-100">
            <p className="text-sm opacity-80">Current Time</p>
            <p className="text-lg font-semibold">{currentTime.toLocaleTimeString()}</p>
            <p className="text-sm">{currentTime.toLocaleDateString('en-GB')}</p>
          </div>
        </div>
      </div>

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500 hover:shadow-xl transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Fragrances</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardData.totalFragrances}</p>
              <p className="text-xs text-blue-600 mt-1">Active inventory</p>
            </div>
            <div className="text-4xl opacity-80">🧴</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500 hover:shadow-xl transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(dashboardData.totalValue)}</p>
              <p className="text-xs text-green-600 mt-1">+{dashboardData.monthlyGrowth}% this month</p>
            </div>
            <div className="text-4xl opacity-80">💎</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-orange-500 hover:shadow-xl transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Low Stock Alert</p>
              <p className="text-3xl font-bold text-orange-600">{dashboardData.lowStockItems}</p>
              <p className="text-xs text-orange-600 mt-1">Require attention</p>
            </div>
            <div className="text-4xl opacity-80">⚠️</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-red-500 hover:shadow-xl transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Out of Stock</p>
              <p className="text-3xl font-bold text-red-600">{dashboardData.outOfStock}</p>
              <p className="text-xs text-red-600 mt-1">Immediate action needed</p>
            </div>
            <div className="text-4xl opacity-80">🚨</div>
          </div>
        </div>
      </div>

      {/* Today's Performance */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Today's Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
            <div className="text-3xl mb-2">💰</div>
            <p className="text-sm text-gray-600 mb-1">Sales Today</p>
            <p className="text-2xl font-bold text-green-700">{formatCurrency(dashboardData.todaySales)}</p>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
            <div className="text-3xl mb-2">📈</div>
            <p className="text-sm text-gray-600 mb-1">Monthly Growth</p>
            <p className="text-2xl font-bold text-blue-700">+{dashboardData.monthlyGrowth}%</p>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
            <div className="text-3xl mb-2">🎯</div>
            <p className="text-sm text-gray-600 mb-1">Target Progress</p>
            <p className="text-2xl font-bold text-purple-700">78%</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Top Selling Fragrances */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Top Selling Fragrances</h2>
          <div className="space-y-4">
            {dashboardData.topFragrances.map((fragrance, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{fragrance.name}</p>
                    <p className="text-sm text-gray-600">{fragrance.sales} bottles sold</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">{formatCurrency(fragrance.revenue)}</p>
                  <p className="text-xs text-gray-500">Revenue</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Alerts */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">System Alerts</h2>
          <div className="space-y-3">
            {dashboardData.alerts.map((alert, index) => (
              <div key={index} className={`p-3 rounded-lg border-l-4 ${getAlertColor(alert.type)}`}>
                <p className="text-sm font-medium text-gray-800">{alert.message}</p>
                <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full text-center py-2 text-sm text-[#9c8817] hover:text-[#e4c723] font-medium border-t border-gray-100">
            View all alerts →
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {dashboardData.recentActivity.map((activity, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-xl">{getActivityIcon(activity.type)}</span>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">{activity.item}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
              {activity.amount && (
                <p className="text-sm font-semibold text-green-600">{formatCurrency(activity.amount)}</p>
              )}
              {activity.quantity && (
                <p className="text-sm text-blue-600">+{activity.quantity} bottles</p>
              )}
              {activity.message && (
                <p className="text-sm text-orange-600">{activity.message}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { 
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              ), 
              label: 'Add Fragrance', 
              color: 'hover:bg-green-50 hover:border-green-300 hover:text-green-600' 
            },
            { 
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              ), 
              label: 'View Catalog', 
              color: 'hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600' 
            },
            { 
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              ), 
              label: 'Check Stock', 
              color: 'hover:bg-purple-50 hover:border-purple-300 hover:text-purple-600' 
            },
            { 
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              ), 
              label: 'Record Stock', 
              color: 'hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600' 
            },
            { 
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              ), 
              label: 'Reports', 
              color: 'hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600' 
            },
            { 
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ), 
              label: 'Settings', 
              color: 'hover:bg-gray-50 hover:border-gray-300 hover:text-gray-600' 
            }
          ].map((action, index) => (
            <button key={index} className={`p-4 text-center border-2 border-gray-200 rounded-lg transition-all duration-200 group ${action.color}`}>
              <div className="mb-2 group-hover:scale-110 transition-transform flex justify-center">{action.icon}</div>
              <p className="text-sm font-medium text-gray-700 group-hover:font-semibold">{action.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Footer Stats */}
      <div className="text-center text-gray-500 text-sm py-4 border-t border-gray-200">
        <p>System running smoothly • Last backup: {new Date().toLocaleDateString()} • Nigeria Fragrance Market</p>
      </div>
    </div>
  );
}

export default OverView;