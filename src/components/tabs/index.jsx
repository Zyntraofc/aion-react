// src/components/tabs/index.jsx
import React from 'react';

const Tabs = ({ tabs, activeTab, onTabChange }) => {
    return (
        <div className="flex bg-indigo-500 rounded-xl p-2 mb-6 shadow-lg">
            {tabs.map((tab) => {
                const { id, label, count, Icon } = tab;
                const isActive = id === activeTab;

                const tabClasses = `
                    flex-1
                    text-center
                    py-2 px-4
                    rounded-lg
                    transition-colors
                    flex items-center justify-center
                    ${isActive
                        ? 'bg-white text-indigo-600 font-semibold cursor-default shadow'
                        : 'text-indigo-100 hover:bg-indigo-600 cursor-pointer'
                    }
                `;

                return (
                    <button
                        key={id}
                        className={tabClasses}
                        onClick={() => onTabChange(id)}
                        disabled={isActive}
                    >
                        <Icon className="w-5 h-5 mr-1.5" />

                        <span className="mr-2">{label}</span>

                        {count > 0 && (
                            <span
                                className={`
                                    text-xs font-bold px-2 py-0.5 rounded-full
                                    ${isActive ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600'}
                                `}
                            >
                                {count}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
};

export default Tabs;