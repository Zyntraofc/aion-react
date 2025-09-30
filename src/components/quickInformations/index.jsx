import React from "react";
import { UserIcon, BarChart3 } from "lucide-react";
import MetricCard from "../card/index.jsx";

function QuickInformations({ info1, info2, info3, info4, titulo1, titulo2, titulo3, titulo4 }) {
    const cards = [
        {
            title: titulo1,
            value: info1,
            borderColor: "border-red-200",
            icon: <span className="w-2 h-2 rounded-full bg-red-500"></span>,
        },
        {
            title: titulo2,
            value: info2,
            borderColor: "border-green-200",
            icon: <span className="w-2 h-2 rounded-full bg-green-500"></span>,
        },
        {
            title: titulo3,
            value: info3,
            borderColor: "border-gray-200",
            icon: <UserIcon size={13} className="text-blue-500" />,
        },
        {
            title: titulo4,
            value: `${info4}%`,
            borderColor: "border-gray-200",
            icon: <BarChart3 size={13} className="text-blue-500" />,
        },
    ];

    return (
        <div className="p-4 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                {cards.map((card, index) => (
                    <MetricCard
                        key={index}
                        icon={card.icon}
                        title={card.title}
                        value={card.value}
                        borderColor={card.borderColor}
                    />
                ))}
            </div>
        </div>
    );
}

export default QuickInformations;
