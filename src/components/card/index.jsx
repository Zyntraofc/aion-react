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
        <div className={`flex flex-col p-3 rounded-2xl shadow-sm border-1 ${borderColor} bg-white w-full`}>
            <div className="flex items-center space-x-1">
                {icon && <span className={`${iconColor}`}>{icon}</span>}
                <h3 className="text-xs font-semibold text-gray-500">{title}</h3>
            </div>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
            {trend && <p className={`text-xs font-medium ${trendColor}`}>{trend}</p>}
        </div>
    );
}

export default MetricCard;
