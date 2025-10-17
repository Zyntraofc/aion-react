import React from "react";
import MetricCard from "../card/index.jsx";

function QuickInformations({ cards = [] }) {
    const colorMap = {
        red: { border: "border-red-200", dot: "bg-red-500" },
        green: { border: "border-green-200", dot: "bg-green-500" },
        yellow: { border: "border-yellow-200", dot: "bg-yellow-500" },
        blue: { border: "border-blue-200", dot: "bg-blue-500" },
        default: { border: "shadow-md border-gray-200", dot: "bg-gray-400" },
    };

    return (
        <div className="pt-4 pr-4 pb-4">
            <div
                className={`grid gap-6 w-full
          ${cards.length === 1 ? "grid-cols-1" : ""}
          ${cards.length === 2 ? "grid-cols-1 md:grid-cols-2" : ""}
          ${cards.length >= 3 ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : ""}
        `}
                >
                {cards.map((card, index) => {
                    const colors = colorMap[card.color] || colorMap.default;

                    let iconElement;

                    if (card.icon) {
                        if (typeof card.icon === "string") {
                            iconElement = (
                                <img
                                    src={card.icon}
                                    alt={card.title}
                                    className={`w-5 h-5 ${card.iconColor || ""}`}
                                />
                            );
                        } else {
                            iconElement = (
                                <span className={`${card.iconColor || ""} `}>{card.icon}</span>
                            );
                        }
                    } else {
                        iconElement = (
                            <span
                                className={`w-2.5 h-2.5 rounded-full ${colors.dot}`}
                            ></span>
                        );
                    }

                    return (
                        <MetricCard
                            key={index}
                            icon={iconElement}
                            title={card.title}
                            value={card.value}
                            subtitle={card.subtitle}
                            trend={card.trend}
                            borderColor={colors.border}
                            trendColor={card.trendColor}
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default QuickInformations;