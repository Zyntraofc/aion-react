import React from 'react';

const Tabs = ({ tabs, activeTab, onTabChange }) => {
    // Normaliza as tabs para garantir que sejam objetos
    const normalizedTabs = tabs.map(tab =>
        typeof tab === 'string' ? { id: tab, label: tab } : tab
    );

    return (
        <div className="flex bg-tertiary rounded-xl p-2 border-b-2 border-gray-200">
            {normalizedTabs.map(({ id, label, count = 0, Icon }) => {
                const isActive = id === activeTab;

                const tabClasses = [
                    'flex-1',
                    'text-center',
                    'py-2 px-4',
                    'rounded-lg',
                    'transition-colors',
                    'flex items-center justify-center',
                    isActive
                        ? 'bg-white text-indigo-600 font-semibold cursor-default shadow'
                        : 'text-indigo-100 hover:bg-indigo-600 cursor-pointer',
                ].join(' ');

                return (
                    <button
                        key={id}
                        className={tabClasses}
                        onClick={() => onTabChange(id)}
                        disabled={isActive}
                    >
                        {Icon && <Icon className="w-5 h-5 mr-1.5" />}
                        <span className="mr-2">{label}</span>
                        {count > 0 && (
                            <span
                                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                    isActive ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600'
                                }`}
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