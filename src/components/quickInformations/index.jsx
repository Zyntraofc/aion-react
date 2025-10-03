import React from "react";
import MetricCard from "../card/index.jsx";

function QuickInformations({ cards = [] }) {
    // Mapeia cor → classes do Tailwind
    const colorMap = {
        red: { border: "border-red-200", dot: "bg-red-500" },
        green: { border: "border-green-200", dot: "bg-green-500" },
        yellow: { border: "border-yellow-200", dot: "bg-yellow-500" },
        default: { border: "shadow-md border-gray-200", dot: "bg-gray-400" },
    };

    return (
        <div className="p-4 w-full">
            <div
                className={`grid gap-6 w-full
          ${cards.length === 1 ? "grid-cols-1" : ""}
          ${cards.length === 2 ? "grid-cols-1 md:grid-cols-2" : ""}
          ${cards.length >= 3 ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : ""}
        `}
            >
                {cards.map((card, index) => {
                    const colors = colorMap[card.color] || colorMap.default;
                    return (
                        <MetricCard
                            key={index}
                            icon={<span className={`w-2 h-2 rounded-full ${colors.dot}`} />}
                            title={card.title}
                            value={card.value}
                            borderColor={colors.border}
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default QuickInformations;
