import React from 'react';

function FormGroup({ label, children, description, className = '' }) {
    return (
        <div className={`flex flex-col ${className}`}>
            <label className="text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>

            {children}
            {description && (
                <p className="mt-1 text-xs text-gray-500">{description}</p>
            )}
        </div>
    );
}

export default FormGroup;