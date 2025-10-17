import React from "react";

function MetricCard({
                        icon,
                        title,
                        value,
                        subtitle,
                        trend,
                        borderColor,
                        iconColor,
                        trendColor
                    }) {
    return (
        <div className={`flex flex-col p-3 rounded-2xl shadow-md border-1 ${borderColor} bg-white w-full`}>
            <div className={`pl-3`}>
                <div className="flex space-x-1">
                    <span className={`flex items-center justify-center ${iconColor}`}>
                        {icon ? (
                            icon
                        ) : (
                            <span className="inline-block w-2.5 h-2.5 bg-gray-300 rounded-full"></span>
                        )}
                    </span>
                    <h3 className={'text-xs font-medium text-gray-500 pl-1 '}>{title}</h3>
                </div>
                <div className="flex items-end">
                    <h2 className="font-bold mt-1 ">{value}</h2>
                    {subtitle && <p className="text-[10px] leading-tight font-normal ml-1 text-gray-400">{subtitle}</p>}
                    {trend && <p className={`text-xs font-medium ${trendColor}`}>{trend}</p>}
                </div>
            </div>
        </div>
    );
}

export default MetricCard;
