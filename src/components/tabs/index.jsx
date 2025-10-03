// src/components/ConfigTabs.jsx
import React from 'react';

const Tabs = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="flex bg-indigo-400 rounded-xl p-2 border-b-2 border-gray-200">
      {tabs.map((tabName) => {

        const isActive = tabName === activeTab;
        const tabClasses = `
          flex-1
          text-center
          py-2 px-4
          rounded-md
          transition-colors
          ${isActive
            ? 'bg-white text-indigo-600 font-semibold cursor-default'
            : 'text-white hover:bg-indigo-600 cursor-pointer'
          }
        `;

        return (
          <button
            key={tabName}
            className={tabClasses}
            onClick={() => onTabChange(tabName)}
            disabled={isActive}>
            {tabName}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;