import React, { useState } from "react";

function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    storeName: 'Luxe Fragrance Store',
    currency: 'NGN',
    timezone: 'Africa/Lagos',
    language: 'English',
    lowStockAlert: 5,
    autoReorder: false,
    emailNotifications: true,
    smsNotifications: false,
    stockAlerts: true,
    salesReports: true,
    theme: 'light',
    compactView: false,
    fragranceCategories: ['Men', 'Women', 'Unisex', 'Niche'],
    defaultFragranceSize: '100ml',
    enableFragranceNotes: true
  });

  const [isSaving, setIsSaving] = useState(false);

  const tabs = [
    { id: 'general', name: 'General', icon: '⚙️' },
    { id: 'inventory', name: 'Inventory', icon: '📦' },
    { id: 'fragrance', name: 'Fragrance', icon: '🌸' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'display', name: 'Display', icon: '🖥️' }
  ];

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    alert('Settings saved successfully!');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => handleSettingChange('storeName', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e4c723] focus:border-[#9c8817] outline-none"
                placeholder="Enter your fragrance store name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                <select
                  value={settings.currency}
                  onChange={(e) => handleSettingChange('currency', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e4c723] focus:border-[#9c8817] outline-none"
                >
                  <option value="NGN">NGN (₦)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
                <p className="text-sm text-gray-500 mt-1">All prices will be displayed in this currency</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                <select
                  value={settings.timezone}
                  onChange={(e) => handleSettingChange('timezone', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e4c723] focus:border-[#9c8817] outline-none"
                >
                  <option value="Africa/Lagos">West Africa Time (WAT)</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">GMT</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select
                value={settings.language}
                onChange={(e) => handleSettingChange('language', e.target.value)}
                className="w-full md:w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e4c723] focus:border-[#9c8817] outline-none"
              >
                <option value="English">English</option>
                <option value="French">Français</option>
                <option value="Spanish">Español</option>
              </select>
            </div>
          </div>
        );

      case 'inventory':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Low Stock Alert Threshold
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  value={settings.lowStockAlert}
                  onChange={(e) => handleSettingChange('lowStockAlert', parseInt(e.target.value))}
                  min="1"
                  max="50"
                  className="w-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e4c723] focus:border-[#9c8817] outline-none"
                />
                <span className="text-gray-600">bottles remaining</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Get alerts when fragrance stock falls to or below this number
              </p>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-800">Auto-Reorder</h4>
                <p className="text-sm text-gray-600">Automatically create purchase orders when fragrance stock is low</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoReorder}
                  onChange={(e) => handleSettingChange('autoReorder', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#e4c723]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#e4c723] peer-checked:to-[#9c8817]"></div>
              </label>
            </div>
          </div>
        );

      case 'fragrance':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Fragrance Size
              </label>
              <select
                value={settings.defaultFragranceSize}
                onChange={(e) => handleSettingChange('defaultFragranceSize', e.target.value)}
                className="w-full md:w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e4c723] focus:border-[#9c8817] outline-none"
              >
                <option value="30ml">30ml</option>
                <option value="50ml">50ml</option>
                <option value="100ml">100ml</option>
                <option value="200ml">200ml</option>
              </select>
              <p className="text-sm text-gray-500 mt-1">
                Default size when adding new fragrances
              </p>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-800">Enable Fragrance Notes</h4>
                <p className="text-sm text-gray-600">Show top, middle, and base notes for fragrances</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableFragranceNotes}
                  onChange={(e) => handleSettingChange('enableFragranceNotes', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#e4c723]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#e4c723] peer-checked:to-[#9c8817]"></div>
              </label>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-4">
            {[
              { key: 'emailNotifications', title: 'Email Notifications', desc: 'Receive notifications via email' },
              { key: 'smsNotifications', title: 'SMS Notifications', desc: 'Receive notifications via SMS' },
              { key: 'stockAlerts', title: 'Low Stock Alerts', desc: 'Get notified when fragrances are running low' },
              { key: 'salesReports', title: 'Daily Sales Reports', desc: 'Receive daily fragrance sales summary reports' }
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-800">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings[item.key]}
                    onChange={(e) => handleSettingChange(item.key, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#e4c723]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#e4c723] peer-checked:to-[#9c8817]"></div>
                </label>
              </div>
            ))}
          </div>
        );

      case 'display':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
              <div className="grid grid-cols-2 gap-3">
                {['light', 'dark'].map(theme => (
                  <button
                    key={theme}
                    onClick={() => handleSettingChange('theme', theme)}
                    className={`p-4 rounded-lg border-2 transition-colors capitalize ${
                      settings.theme === theme
                        ? 'border-[#e4c723] bg-gradient-to-r from-[#e4c723] to-[#9c8817] text-white'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {theme === 'light' ? '☀️' : '🌙'} {theme} Mode
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-800">Compact View</h4>
                <p className="text-sm text-gray-600">Show more fragrances with reduced spacing</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.compactView}
                  onChange={(e) => handleSettingChange('compactView', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#e4c723]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#e4c723] peer-checked:to-[#9c8817]"></div>
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#e4c723] to-[#9c8817] text-white p-6 rounded-xl shadow-lg mb-6">
        <h1 className="text-3xl font-bold">Fragrance Store Settings</h1>
        <p className="text-amber-100 mt-2">Manage your fragrance store preferences and configurations</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#e4c723] text-[#9c8817] bg-amber-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {renderTabContent()}
        </div>

        {/* Save Button */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                isSaving
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#e4c723] to-[#9c8817] text-white hover:shadow-lg transform hover:scale-105'
              }`}
            >
              {isSaving ? (
                <span className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </span>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <h3 className="font-medium text-gray-800 mb-1">Backup Fragrance Data</h3>
          <p className="text-sm text-gray-600 mb-3">Export your fragrance inventory</p>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            Export Now →
          </button>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <h3 className="font-medium text-gray-800 mb-1">Import Fragrances</h3>
          <p className="text-sm text-gray-600 mb-3">Import fragrances from CSV</p>
          <button className="text-green-600 hover:text-green-700 text-sm font-medium">
            Import File →
          </button>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
          <h3 className="font-medium text-gray-800 mb-1">Reset Settings</h3>
          <p className="text-sm text-gray-600 mb-3">Restore default fragrance settings</p>
          <button className="text-red-600 hover:text-red-700 text-sm font-medium">
            Reset All →
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;