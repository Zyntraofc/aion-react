import React from 'react';

const Tabs = ({ tabs, activeTab, onTabChange }) => {
    return (
        <div className="overflow-x-auto">
            <div className="flex bg-tertiary rounded-xl p-2 border-b-2 border-gray-200 min-w-max">
                {tabs.map(({ id, label, count = 0, Icon }) => {
                    const isActive = id === activeTab;

                    const tabClasses = [
                        'flex-1 flex items-center justify-center whitespace-nowrap',
                        'py-2 px-3 sm:py-2 sm:px-4',
                        'rounded-lg transition-colors',
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
                            {Icon && <Icon className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5" />}
                            <span className="mr-2 text-sm sm:text-base">{label}</span>
                            {count > 0 && (
                                <span
                                    className={`text-xs sm:text-sm font-bold px-2 py-0.5 rounded-full ${
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
        </div>
    );
};

export default Tabs;
