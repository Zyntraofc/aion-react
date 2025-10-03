// src/components/ConfigCard/index.jsx

import React from 'react';

function ConfigCard({ title, icon, children }) {
  return (
    <div className="bg-white shadow-xl rounded-xl p-6 mb-6 border-t-4 border-indigo-500">

      <div className="flex items-center space-x-3 mb-4 border-b pb-3">
        {icon && (
          <div className="text-indigo-600 p-2 bg-indigo-100 rounded-full">
            {icon}
          </div>
        )}

        <h2 className="text-2xl font-bold text-gray-800">
          {title}
        </h2>
      </div>

      <div className="config-card-content">
        {children}
      </div>

    </div>
  );
}

export default ConfigCard;