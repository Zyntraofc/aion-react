// src/components/ConfigSection.jsx
import React from 'react';

function ConfigSection({ title, children, layout = 'default' }) {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-bold mb-2">{title}</h3>

      <div
        className={
          layout === 'list'
            ? 'flex flex-col space-y-3'
            : 'grid grid-cols-1 md:grid-cols-2 gap-4'
        }
      >
        {children}
      </div>
    </div>
  );
}

export default ConfigSection;
