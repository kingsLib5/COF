import React, { useState } from "react";

function Help() {
  const [activeSection, setActiveSection] = useState('getting-started');

  const sections = {
    'getting-started': {
      title: 'Getting Started',
      content: [
        { q: 'How do I add new fragrances?', a: 'Go to "Add Products" and fill in the fragrance details including name, brand, size, and stock quantity.' },
        { q: 'How do I check stock levels?', a: 'Use "Check Stocks" to view all fragrance inventory with real-time stock levels and low stock alerts.' },
        { q: 'What are the stock status colors?', a: 'Green = In Stock, Orange = Low Stock (at/below minimum), Red = Out of Stock.' }
      ]
    },
    'inventory': {
      title: 'Inventory Management',
      content: [
        { q: 'How do minimum stock levels work?', a: 'Set a minimum stock level for each fragrance. When stock falls to or below this level, you\'ll see a "Low Stock" warning.' },
        { q: 'Can I search for specific fragrances?', a: 'Yes! Use the search bar to find fragrances by name, brand, or SKU code.' },
        { q: 'How do I filter by fragrance categories?', a: 'Use the category dropdown to filter by Men\'s, Women\'s, or Unisex fragrances.' }
      ]
    },
    'troubleshooting': {
      title: 'Troubleshooting',
      content: [
        { q: 'Stock numbers aren\'t updating?', a: 'Refresh the page or check your internet connection. Contact support if the issue persists.' },
        { q: 'Can\'t find a specific fragrance?', a: 'Make sure you\'re using the correct spelling or try searching by SKU or brand name instead.' },
        { q: 'Getting error messages?', a: 'Clear your browser cache and try again. If errors continue, contact our support team.' }
      ]
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#e4c723] to-[#9c8817] text-white p-6 rounded-xl shadow-lg mb-6">
        <h1 className="text-3xl font-bold">Help & Support</h1>
        <p className="text-amber-100 mt-2">Get help with your fragrance inventory management system</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-4">Help Topics</h3>
            <div className="space-y-2">
              {Object.entries(sections).map(([key, section]) => (
                <button
                  key={key}
                  onClick={() => setActiveSection(key)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    activeSection === key 
                      ? 'bg-gradient-to-r from-[#e4c723] to-[#9c8817] text-white' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              {sections[activeSection].title}
            </h2>
            
            <div className="space-y-4">
              {sections[activeSection].content.map((item, index) => (
                <div key={index} className="border-l-4 border-[#e4c723] pl-4">
                  <h4 className="font-semibold text-gray-800 mb-2">{item.q}</h4>
                  <p className="text-gray-600 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Support */}
          
        </div>
      </div>
    </div>
  );
}

export default Help;